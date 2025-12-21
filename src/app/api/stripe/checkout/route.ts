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
    const portalReturnUrl = `${appUrl}/pricing`;

    // 1) Lookup subscription state (per evitare checkout se già attivo)
    let stripeCustomerId: string | null = null;
    let stripeSubscriptionId: string | null = null;
    let isActive = false;

    try {
      const { data, error } = await supabaseAdmin
        .from("user_subscriptions")
        .select(
          "plan,stripe_customer_id,stripe_subscription_id,is_active,current_period_end"
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Stripe checkout: cannot lookup user_subscriptions", error);
      } else {
        stripeCustomerId = (data?.stripe_customer_id as string | null) ?? null;
        stripeSubscriptionId =
          (data?.stripe_subscription_id as string | null) ?? null;
        const now = new Date();
        const periodEnd = (data as any)?.current_period_end
          ? new Date((data as any).current_period_end)
          : null;

        // ✅ consideriamo attiva anche se i webhook arrivano in ritardo,
        // usando current_period_end come fallback.
        isActive =
          Boolean((data as any)?.is_active) || (periodEnd ? periodEnd > now : false);
      }
    } catch (e) {
      console.warn(
        "Stripe checkout: lookup user_subscriptions unexpected error",
        e
      );
    }

    // 2) Se l'utente ha già una subscription attiva → Billing Portal (gestione upgrade/downgrade/cancel)
    if (isActive) {
      // Se non ho il customerId, provo a ricavarlo dalla subscription
      if (!stripeCustomerId && stripeSubscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const cust =
            typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

          if (cust) {
            stripeCustomerId = cust;

            // best-effort: salviamo il customerId per i prossimi giri
            await supabaseAdmin
              .from("user_subscriptions")
              .update({ stripe_customer_id: cust })
              .eq("user_id", userId);
          }
        } catch (e) {
          console.warn("Stripe portal: cannot retrieve subscription/customer", e);
        }
      }

      if (!stripeCustomerId) {
        return NextResponse.json(
          {
            error:
              "Active subscription found but missing stripe_customer_id. Cannot open billing portal.",
          },
          { status: 500 }
        );
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: portalReturnUrl,
      });

      return NextResponse.json({ url: portalSession.url, mode: "portal" });
    }

    // 3) Nessuna subscription attiva → Checkout Session (create subscription)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,

      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),

      metadata: { userId, plan },

      subscription_data: {
        metadata: { userId, plan },
      },

      line_items: [{ price: priceId, quantity: 1 }],

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url, mode: "checkout" });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Stripe checkout failure" },
      { status: 500 }
    );
  }
}