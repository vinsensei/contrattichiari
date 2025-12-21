import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

type Plan = "standard" | "pro";

function unixToIso(ts?: number | null): string | null {
  if (!ts || !Number.isFinite(ts)) return null;
  return new Date(ts * 1000).toISOString();
}

function planFromPriceId(priceId?: string | null): Plan {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return "standard";
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;

    const metadata = session.metadata || {};
    const userId = metadata.userId;

    if (!userId) {
      console.error("[CONFIRM] Missing userId in session.metadata", metadata);
      return NextResponse.json({ error: "Missing userId in metadata" }, { status: 400 });
    }

    // Plan: prefer metadata.plan, otherwise infer from subscription item price
    let plan: Plan = ((metadata.plan as Plan) || "standard");

    // Compute active + current_period_end from the real subscription (when available)
    let isActive = true;
    let currentPeriodEnd: string | null = null;

    if (subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        // Stripe typings can differ; read from `any` to avoid TS noise.
        const status = (sub as any)?.status as string | undefined;
        isActive = status === "active" || status === "trialing";

        currentPeriodEnd = unixToIso((sub as any)?.current_period_end as number | undefined);

        if (!metadata.plan) {
          const priceId = sub.items?.data?.[0]?.price?.id ?? null;
          plan = planFromPriceId(priceId);
        }
      } catch (e) {
        console.warn("[CONFIRM] Cannot retrieve subscription to confirm state", e);
        // Keep best-effort defaults
        isActive = true;
      }
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          plan,
          is_active: isActive,
          current_period_end: currentPeriodEnd,
          stripe_customer_id: customerId ?? null,
          stripe_subscription_id: subscriptionId,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[CONFIRM] Supabase upsert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    console.log("[CONFIRM] Subscription confirmed for user:", {
      userId,
      plan,
      isActive,
      currentPeriodEnd,
      customerId,
      subscriptionId,
    });

    return NextResponse.json({ ok: true, plan, isActive, currentPeriodEnd });
  } catch (err) {
    console.error("[CONFIRM] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}