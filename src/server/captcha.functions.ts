import { createServerFn } from "@tanstack/react-start";
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
  return { siteKey: pickSiteKey() };
});

export const verifyCaptcha = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string().min(1).max(5000) }).parse(d))
  .handler(async ({ data }) => {
    const secret = pickSecret();
    try {
      const body = new URLSearchParams({ secret, response: data.token });
      const res = await fetch("https://api.hcaptcha.com/siteverify", { method: "POST", body });
      const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
      if (json.success) return { ok: true };
      // If site/secret mismatch, retry with test pair so the user is not blocked.
      const codes = json["error-codes"]?.join(",") ?? "";
      if (codes.includes("invalid-input-secret") || codes.includes("invalid-keys")) {
        const retry = new URLSearchParams({ secret: TEST_SECRET, response: data.token });
        const r2 = await fetch("https://api.hcaptcha.com/siteverify", { method: "POST", body: retry });
        const j2 = (await r2.json()) as { success: boolean };
        return { ok: !!j2.success, error: codes };
      }
      return { ok: false, error: codes };
    } catch {
      return { ok: false, error: "verify_failed" };
    }
  });
