import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

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

  // Stripe signature verification requires the exact raw request body.
  // Using arrayBuffer + Buffer is the safest option in Next.js.
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
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        // 1) Proviamo a leggere userId/plan dai metadata della sessione (set lato checkout)
        let userId = session.metadata?.userId ?? null;
        let plan: "standard" | "pro" | null =
          (session.metadata?.plan as any) ?? null;

        // 2) Fallback: se abbiamo subscriptionId, proviamo a leggere i metadata dalla subscription
        //    (più robusto nel tempo, perché i metadata sulla subscription restano come fonte di verità)
        let currentPeriodEnd: string | null = null;
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );

            currentPeriodEnd = unixToIso(
              (subscription as any).current_period_end as number | undefined
            );

            if (!userId) {
              userId = (subscription.metadata?.userId as string) ?? null;
            }
            if (!plan) {
              plan = (subscription.metadata?.plan as any) ?? null;
            }

            // Ultimo fallback: deduciamo il plan dal priceId
            if (!plan) {
              const priceId = subscription.items.data[0]?.price?.id ?? null;
              const p = planFromPriceId(priceId);
              plan = p === "pro" ? "pro" : "standard";
            }
          } catch (err) {
            console.error(
              "[WEBHOOK] Error retrieving subscription for checkout.session.completed:",
              err
            );
          }
        }

        // Default plan se non lo troviamo
        const effectivePlan: "standard" | "pro" = plan === "pro" ? "pro" : "standard";

        console.log("[WEBHOOK] checkout.session.completed:", {
          userId,
          plan: effectivePlan,
          customerId,
          subscriptionId,
          currentPeriodEnd,
        });

        if (!userId) {
          console.error("[WEBHOOK] Missing userId in metadata (session/subscription)");
          break;
        }

        const { error } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan: effectivePlan,
              is_active: true,
              stripe_customer_id: customerId ?? null,
              stripe_subscription_id: subscriptionId,
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

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status;
        const isActive = status === "active" || status === "trialing";

        const currentPeriodEnd = unixToIso(
          (subscription as any).current_period_end as number | undefined
        );

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = isActive ? planFromPriceId(priceId) : "free";

        const userId = (subscription.metadata?.userId as string) ?? null;

        console.log("[WEBHOOK] customer.subscription.created:", {
          customerId,
          status,
          isActive,
          currentPeriodEnd,
          plan,
          userId,
        });

        if (!userId) {
          // Se non abbiamo userId nei metadata non possiamo collegare in modo sicuro.
          // Manteniamo log e usciamo.
          console.error(
            "[WEBHOOK] Missing userId in subscription.metadata on subscription.created"
          );
          break;
        }

        const { error } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              is_active: isActive,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              current_period_end: currentPeriodEnd,
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error(
            "[WEBHOOK] Supabase upsert error (subscription.created):",
            error
          );
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status;
        const isActive = status === "active" || status === "trialing";

        const currentPeriodEnd = unixToIso(
          (subscription as any).current_period_end as number | undefined
        );

        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = isActive ? planFromPriceId(priceId) : "free";

        const userId = (subscription.metadata?.userId as string) ?? null;

        console.log("[WEBHOOK] customer.subscription.updated:", {
          customerId,
          status,
          isActive,
          currentPeriodEnd,
          plan,
          userId,
        });

        // 1) tentiamo update via stripe_customer_id
        const upd = await supabase
          .from("user_subscriptions")
          .update({
            is_active: isActive,
            current_period_end: currentPeriodEnd,
            plan,
            stripe_subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", customerId);

        if (upd.error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.updated):",
            upd.error
          );
          break;
        }

        // 2) fallback su user_id dai metadata (se presente)
        //    così “ripariamo” righe create senza stripe_customer_id.
        //    Non usiamo `count` perché non è sempre disponibile sugli update di supabase-js.
        if (userId) {
          // Proviamo sempre a riallineare stripe_customer_id e subscription_id su user_id
          const fix = await supabase
            .from("user_subscriptions")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
            })
            .eq("user_id", userId);

          if (fix.error) {
            console.error(
              "[WEBHOOK] Supabase fallback update error (subscription.updated -> user_id):",
              fix.error
            );
          }
        } else {
          console.warn(
            "[WEBHOOK] subscription.updated: no userId metadata available for fallback"
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = (subscription.metadata?.userId as string) ?? null;

        console.log("[WEBHOOK] customer.subscription.deleted:", {
          customerId,
          userId,
        });

        const del = await supabase
          .from("user_subscriptions")
          .update({
            is_active: false,
            current_period_end: null,
            plan: "free",
            stripe_subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", customerId);

        if (del.error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.deleted):",
            del.error
          );
        }

        // Fallback su user_id se il customer_id non matcha nessuna riga
        if (userId) {
          const fix = await supabase
            .from("user_subscriptions")
            .update({
              is_active: false,
              current_period_end: null,
              plan: "free",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
            })
            .eq("user_id", userId);

          if (fix.error) {
            console.error(
              "[WEBHOOK] Supabase fallback update error (subscription.deleted -> user_id):",
              fix.error
            );
          }
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