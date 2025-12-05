import { NextResponse } from "next/server";
import Stripe from "stripe";

// Niente apiVersion qui: Stripe usa quella di default collegata alla chiave
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      );
    }

    // Per ora supportiamo SOLO il piano standard
    if (plan !== "standard") {
      return NextResponse.json(
        { error: "Unsupported plan" },
        { status: 400 }
      );
    }

    // Base URL app:
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;

    // Usiamo solo il price STANDARD
    const priceId = process.env.STRIPE_PRICE_STANDARD;

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
      metadata: {
        userId,
        plan,
      },
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
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