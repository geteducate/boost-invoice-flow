import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhook, EventName, type PaddleEnv } from "@/lib/paddle.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData, scheduledChange } = data;
  const userId = customData?.userId;
  if (!userId) { console.error("No userId in customData"); return; }
  const item = items[0];
  const priceId = item.price.importMeta?.externalId;
  const productId = item.product.importMeta?.externalId;
  if (!priceId || !productId) {
    console.warn("Skipping subscription: missing importMeta.externalId");
    return;
  }
  const sb = getSupabase() as any;
  await sb.from("subscriptions").upsert({
    user_id: userId,
    paddle_subscription_id: id,
    paddle_customer_id: customerId,
    product_id: productId,
    price_id: priceId,
    status,
    current_period_start: currentBillingPeriod?.startsAt,
    current_period_end: currentBillingPeriod?.endsAt,
    cancel_at_period_end: scheduledChange?.action === "cancel",
    environment: env,
    updated_at: new Date().toISOString(),
  }, { onConflict: "paddle_subscription_id" });

  // Welcome email (best-effort; do not fail webhook on email errors)
  try {
    const { data: userRes } = await sb.auth.admin.getUserById(userId);
    const email = userRes?.user?.email;
    if (email) {
      const tier = productId === "starter_plan" ? "starter" : productId === "pro_plan" ? "pro" : productId === "business_plan" ? "business" : "your";
      const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
      const { data: profile } = await sb.from("profiles").select("display_name").eq("user_id", userId).maybeSingle();
      const name = profile?.display_name || userRes?.user?.user_metadata?.display_name;
      const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a"><h1 style="font-size:22px;margin:0 0 12px">Welcome to Boost Profits${name ? `, ${name}` : ""}!</h1><p style="color:#475569;line-height:1.6">Your <b>${tierName}</b> plan is active. You can now access your dashboard, automate milestone billing, and start collecting invoices faster.</p><p style="margin:24px 0"><a href="https://boostprofits.app/app" style="background:#0f1b3d;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Open dashboard</a></p><p style="color:#94a3b8;font-size:12px">Need help? Just reply to this email.</p></div>`;
      const lovableKey = process.env.LOVABLE_API_KEY;
      const resendKey = process.env.RESEND_API_KEY;
      if (lovableKey && resendKey) {
        await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${lovableKey}`, "X-Connection-Api-Key": resendKey },
          body: JSON.stringify({ from: "Boost Profits <onboarding@resend.dev>", to: [email], subject: "Welcome to Boost Profits 🎉", html }),
        });
      }
    }
  } catch (e) {
    console.error("Welcome email failed:", e);
  }
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange, items } = data;
  const item = items?.[0];
  const update: Record<string, any> = {
    status,
    current_period_start: currentBillingPeriod?.startsAt,
    current_period_end: currentBillingPeriod?.endsAt,
    cancel_at_period_end: scheduledChange?.action === "cancel",
    updated_at: new Date().toISOString(),
  };
  // For at-next-renewal plan changes, scheduledChange may also reflect new items.
  if (item?.price?.importMeta?.externalId) update.price_id = item.price.importMeta.externalId;
  if (item?.product?.importMeta?.externalId) update.product_id = item.product.importMeta.externalId;
  await (getSupabase() as any).from("subscriptions")
    .update(update)
    .eq("paddle_subscription_id", id)
    .eq("environment", env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  await (getSupabase() as any).from("subscriptions")
    .update({
      status: "canceled",
      current_period_end: data.currentBillingPeriod?.endsAt ?? data.canceledAt,
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", data.id)
    .eq("environment", env);
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.eventType) {
    case EventName.SubscriptionCreated:
      await handleSubscriptionCreated(event.data, env); break;
    case EventName.SubscriptionUpdated:
      await handleSubscriptionUpdated(event.data, env); break;
    case EventName.SubscriptionCanceled:
      await handleSubscriptionCanceled(event.data, env); break;
    default:
      console.log("Unhandled event:", event.eventType);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = (url.searchParams.get("env") || "sandbox") as PaddleEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
