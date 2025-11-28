import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[CHECKOUT] body ricevuto:", body);

    const plan = body.plan as "standard" | "pro";

    if (!plan) {
      console.error("[CHECKOUT] Missing plan nel body");
      return NextResponse.json(
        { error: "Missing plan" },
        { status: 400 }
      );
    }

    const { userId } = body as { userId?: string };
    console.log("[CHECKOUT] plan/userId:", plan, userId);

    if (!userId) {
      console.error("[CHECKOUT] Missing userId nel body");
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // URL base dell'app (deve avere http:// o https://)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl || !appUrl.startsWith("http")) {
      console.error("Invalid NEXT_PUBLIC_APP_URL:", appUrl);
      return NextResponse.json(
        { error: "Server misconfigured: invalid NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    const priceId =
      plan === "standard"
        ? process.env.STRIPE_PRICE_STANDARD_ID
        : process.env.STRIPE_PRICE_PRO_ID;

    if (!priceId) {
      console.error("[CHECKOUT] Missing priceId per plan", plan);
      return NextResponse.json(
        { error: "Stripe price ID not configured" },
        { status: 500 }
      );
    }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    // 👇 Stripe sostituirà {CHECKOUT_SESSION_ID} con l'id reale
    success_url: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing?checkout=cancel`,
  });

    console.log("[CHECKOUT] session creata:", session.id, session.metadata);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}