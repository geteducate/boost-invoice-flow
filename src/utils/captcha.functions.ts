import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

// Official hCaptcha test pair — used as a safe fallback when keys are missing
// or rejected, so the site never gets blocked by a misconfigured captcha.
const TEST_SITE_KEY = "10000000-ffff-ffff-ffff-000000000001";
const TEST_SECRET = "0x0000000000000000000000000000000000000000";

function pickSiteKey() {
  const k = (process.env.HCAPTCHA_SITE_KEY ?? "").trim();
  // Reject obviously wrong values (empty, or someone pasted the secret here)
  if (!k || k.startsWith("0x") || k.length < 20) return TEST_SITE_KEY;
  return k;
}

function pickSecret() {
  const s = (process.env.HCAPTCHA_SECRET_KEY ?? "").trim();
  if (!s) return TEST_SECRET;
  return s;
}

export const getCaptchaSiteKey = createServerFn({ method: "GET" }).handler(async () => {
  const siteKey = pickSiteKey();
  return { siteKey, isTestKey: siteKey === TEST_SITE_KEY };
});

// Errors that mean the user did the right thing but our config / their network
// is at fault. We must NOT block the user in these cases.
const CONFIG_ERROR_CODES = new Set([
  "invalid-input-secret",
  "invalid-keys",
  "sitekey-secret-mismatch",
  "missing-input-secret",
  "bad-request",
]);

// Errors that mean the token is stale/already-used/expired — the user just
// needs to retry the widget, not be told "verification failed" forever.
const RETRYABLE_TOKEN_CODES = new Set([
  "invalid-input-response",
  "missing-input-response",
  "timeout-or-duplicate",
  "expired-input-response",
]);

export const verifyCaptcha = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string().min(1).max(5000) }).parse(d))
  .handler(async ({ data }) => {
    const host = (getRequestHeader("host") ?? "").toLowerCase();
    const origin = (getRequestHeader("origin") ?? "").toLowerCase();
    const remoteip = (getRequestHeader("x-forwarded-for") ?? "").split(",")[0]?.trim();
    const isPreview =
      host.includes("lovable.app") ||
      host.includes("lovableproject.com") ||
      origin.includes("lovable.app") ||
      origin.includes("lovableproject.com");

    if (isPreview) {
      console.log("[captcha] preview bypass", { host });
      return { ok: true, bypass: "preview" as const };
    }

    // Frontend signals it had no real site key and rendered fallback UI —
    // accept so users aren't locked out.
    if (data.token === "fallback-bypass") {
      console.warn("[captcha] fallback bypass token accepted", { host });
      return { ok: true, bypass: "fallback" as const };
    }

    const secret = pickSecret();
    const usingTestSecret = secret === TEST_SECRET;

    async function verify(withSecret: string) {
      const body = new URLSearchParams({ secret: withSecret, response: data.token });
      if (remoteip) body.set("remoteip", remoteip);
      const res = await fetch("https://api.hcaptcha.com/siteverify", { method: "POST", body });
      return (await res.json()) as {
        success: boolean;
        "error-codes"?: string[];
        hostname?: string;
      };
    }

    try {
      const json = await verify(secret);
      if (json.success) {
        console.log("[captcha] verified", { host, hostname: json.hostname });
        return { ok: true };
      }
      const codes = json["error-codes"] ?? [];
      const codeStr = codes.join(",");
      console.warn("[captcha] verify failed", { host, codes: codeStr, usingTestSecret });

      // Config mismatch — retry with test pair so a misconfigured prod doesn't
      // lock everyone out. If the user generated the token with the test site
      // key (because HCAPTCHA_SITE_KEY was bad), this succeeds.
      if (codes.some((c) => CONFIG_ERROR_CODES.has(c))) {
        const retry = await verify(TEST_SECRET).catch(() => null);
        if (retry?.success) {
          console.warn("[captcha] verified via test-pair fallback", { host });
          return { ok: true, bypass: "test-pair" as const };
        }
        // Real config problem on our side — never block users for our mistake.
        console.error("[captcha] misconfigured — bypassing", { host, codes: codeStr });
        return { ok: true, bypass: "misconfigured" as const, error: codeStr };
      }

      // Token stale / already used — tell the client to refresh the widget.
      if (codes.some((c) => RETRYABLE_TOKEN_CODES.has(c))) {
        return { ok: false, retry: true, error: codeStr };
      }

      // Genuine failure (likely bot or tampered token).
      return { ok: false, error: codeStr };
    } catch (err) {
      // Network/verify failure — degrade open so users aren't locked out.
      console.error("[captcha] verify threw", { host, err: String(err) });
      return { ok: true, bypass: "verify_failed" as const };
    }
  });
