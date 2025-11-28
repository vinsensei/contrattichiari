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
        const plan = (session.metadata?.plan as "standard" | "pro") || "standard";

        console.log("[WEBHOOK] checkout.session.completed metadata:", {
          userId,
          plan,
        });

        if (!userId) {
          console.error("[WEBHOOK] Missing userId in session.metadata");
          break;
        }

        const { error } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              is_active: true,
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