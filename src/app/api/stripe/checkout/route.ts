import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      );
    }

    // Determina la base URL dell'app:
    // 1) usa NEXT_PUBLIC_SITE_URL se valida (inizia con http)
    // 2) altrimenti usa l'origin ricavato dalla request (funziona in localhost)
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;

    const priceId =
      plan === "standard"
        ? process.env.STRIPE_PRICE_STANDARD
        : process.env.STRIPE_PRICE_PRO;

    if (!priceId) {
      console.error(
        "Stripe checkout error: missing price ID for plan",
        plan
      );
      return NextResponse.json(
        { error: "Server misconfigured: missing Stripe price ID" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: undefined,
      metadata: { userId, plan },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Stripe checkout failure" },
      { status: 500 }
    );
  }
}