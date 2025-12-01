import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("[WEBHOOK] Missing signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[WEBHOOK] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();

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
        const userId = session.metadata?.userId;
        const plan =
          (session.metadata?.plan as "standard" | "pro") || "standard";

        console.log("[WEBHOOK] checkout.session.completed metadata:", {
          userId,
          plan,
        });

        if (!userId) {
          console.error("[WEBHOOK] Missing userId in session.metadata");
          break;
        }

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        // current_period_end dalla subscription se presente
        let currentPeriodEnd: string | null = null;
        const subscriptionId = session.subscription;
        if (typeof subscriptionId === "string") {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            const cpe = (subscription as any)
              .current_period_end as number | undefined;
            if (cpe) {
              currentPeriodEnd = new Date(cpe * 1000).toISOString();
            }
          } catch (err) {
            console.error(
              "[WEBHOOK] Error retrieving subscription for checkout.session.completed:",
              err
            );
          }
        }

        const { error } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              is_active: true,
              stripe_customer_id: customerId ?? null,
              current_period_end: currentPeriodEnd,
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error("[WEBHOOK] Supabase upsert error:", error);
        } else {
          console.log("[WEBHOOK] Subscription upserted for user:", userId);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status;
        const isActive =
          status === "active" || status === "trialing";

        const cpe = (subscription as any)
          .current_period_end as number | undefined;
        const currentPeriodEnd = cpe
          ? new Date(cpe * 1000).toISOString()
          : null;

        // deduci il piano dal priceId SOLO se è attivo
        let plan: "free" | "standard" | "pro" = "free";
        if (isActive) {
          const priceId = subscription.items.data[0]?.price?.id;
          if (priceId === process.env.STRIPE_PRICE_STANDARD) {
            plan = "standard";
          } else if (priceId === process.env.STRIPE_PRICE_PRO) {
            plan = "pro";
          }
        }

        console.log("[WEBHOOK] customer.subscription.updated:", {
          customerId,
          status,
          isActive,
          currentPeriodEnd,
          plan,
        });

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            is_active: isActive,
            current_period_end: currentPeriodEnd,
            plan,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.updated):",
            error
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log("[WEBHOOK] customer.subscription.deleted:", {
          customerId,
        });

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            is_active: false,
            current_period_end: null,
            plan: "free",
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.deleted):",
            error
          );
        }

        break;
      }

      default:
        console.log("[WEBHOOK] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}