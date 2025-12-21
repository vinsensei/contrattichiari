import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Stripe uses the API version configured in your Stripe dashboard / key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service-role Supabase client (server-only). Used only to lookup/store stripe_customer_id.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Plan = "standard" | "pro";

function getAppUrl(req: Request) {
  const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestOrigin = new URL(req.url).origin;
  return envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;
}

function priceIdForPlan(plan: Plan) {
  if (plan === "standard") return process.env.STRIPE_PRICE_STANDARD;
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  return undefined;
}

export async function POST(req: Request) {
  try {
    const { plan, userId } = (await req.json()) as {
      plan?: string;
      userId?: string;
    };

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      );
    }

    // Supportiamo standard + pro (free non passa da checkout)
    if (plan !== "standard" && plan !== "pro") {
      return NextResponse.json(
        { error: "Unsupported plan" },
        { status: 400 }
      );
    }

    const priceId = priceIdForPlan(plan);
    if (!priceId) {
      console.error("Stripe checkout error: missing price ID for plan", plan);
      return NextResponse.json(
        { error: "Server misconfigured: missing Stripe price ID" },
        { status: 500 }
      );
    }

    const appUrl = getAppUrl(req);
    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;

    // 1) Proviamo a recuperare uno stripe_customer_id già noto (così evitiamo clienti duplicati)
    let stripeCustomerId: string | null = null;
    try {
      const { data, error } = await supabaseAdmin
        .from("user_subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Stripe checkout: cannot lookup stripe_customer_id", error);
      } else {
        stripeCustomerId = (data?.stripe_customer_id as string | null) ?? null;
      }
    } catch (e) {
      console.warn("Stripe checkout: lookup stripe_customer_id unexpected error", e);
    }

    // 2) Creiamo la Checkout Session.
    // IMPORTANTISSIMO: mettiamo metadata anche su subscription_data.metadata,
    // così i webhook customer.subscription.* possono leggerla sempre.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,

      // Optional: se abbiamo già un customer, lo riutilizziamo
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),

      // Fallback metadata sul checkout session
      metadata: {
        userId,
        plan,
      },

      // Metadata sulla subscription (più affidabile per i webhook)
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },

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