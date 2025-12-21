// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

type StripeSubWithPeriodEnd = Stripe.Subscription & {
  current_period_end?: number;
};

function getCurrentPeriodEndIso(subscription: Stripe.Subscription): string | null {
  const sub = subscription as StripeSubWithPeriodEnd;
  return unixToIso(typeof sub.current_period_end === "number" ? sub.current_period_end : null);
}

function unixToIso(ts?: number | null): string | null {
  if (!ts || !Number.isFinite(ts)) return null;
  return new Date(ts * 1000).toISOString();
}

function planFromPriceId(priceId?: string | null): "free" | "standard" | "pro" {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_STANDARD) return "standard";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return "free";
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("[WEBHOOK] Signature verify error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[WEBHOOK] Event received:", event.type);
  const supabase = supabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        let userId = session.metadata?.userId ?? null;
        let plan = (session.metadata?.plan as "standard" | "pro" | undefined) ?? undefined;

        let currentPeriodEnd: string | null = null;

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            currentPeriodEnd = getCurrentPeriodEndIso(subscription);

            userId = userId ?? (subscription.metadata?.userId as string | null);
            plan = plan ?? (subscription.metadata?.plan as any);

            if (!plan) {
              const priceId = subscription.items.data[0]?.price?.id ?? null;
              const p = planFromPriceId(priceId);
              plan = p === "pro" ? "pro" : "standard";
            }
          } catch (e) {
            console.error("[WEBHOOK] retrieve subscription error:", e);
          }
        }

        if (!userId) {
          console.error("[WEBHOOK] Missing userId in session/subscription metadata");
          break;
        }

        const effectivePlan: "standard" | "pro" = plan === "pro" ? "pro" : "standard";

        const { error } = await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            plan: effectivePlan,
            is_active: true,
            current_period_end: currentPeriodEnd,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subscriptionId,
          },
          { onConflict: "user_id" }
        );

        if (error) console.error("[WEBHOOK] upsert error:", error);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;
        const status = subscription.status;
        const isActive = status === "active" || status === "trialing";
        const currentPeriodEnd = getCurrentPeriodEndIso(subscription);

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = isActive ? planFromPriceId(priceId) : "free";

        const userId = (subscription.metadata?.userId as string) ?? null;

        // ✅ 1) se userId presente, aggiorna per user_id (fonte di verità)
        if (userId) {
          const { error } = await supabase.from("user_subscriptions").upsert(
            {
              user_id: userId,
              plan,
              is_active: isActive,
              current_period_end: currentPeriodEnd,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
            },
            { onConflict: "user_id" }
          );
          if (error) console.error("[WEBHOOK] subscription upsert error:", error);
          break;
        }

        // ✅ 2) fallback solo se manca userId (meno sicuro)
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            plan,
            is_active: isActive,
            current_period_end: currentPeriodEnd,
            stripe_subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("[WEBHOOK] subscription update fallback error:", error);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;
        const userId = (subscription.metadata?.userId as string) ?? null;

        // ✅ preferisci userId se c’è
        if (userId) {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              plan: "free",
              is_active: false,
              current_period_end: null,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
            })
            .eq("user_id", userId);

          if (error) console.error("[WEBHOOK] deleted update error:", error);
          break;
        }

        // fallback per customerId
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            plan: "free",
            is_active: false,
            current_period_end: null,
            stripe_subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("[WEBHOOK] deleted fallback error:", error);
        break;
      }

      default:
        console.log("[WEBHOOK] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}