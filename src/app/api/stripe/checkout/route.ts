// src/app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service-role Supabase client (server-only)
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
    // ✅ AUTH: token -> userId (mai dal client)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("[CHECKOUT] auth error:", authError);
      return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
    }

    const userId = user.id;

    const { plan } = (await req.json()) as { plan?: string };
    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    if (plan !== "standard" && plan !== "pro") {
      return NextResponse.json({ error: "Unsupported plan" }, { status: 400 });
    }

    const priceId = priceIdForPlan(plan);
    if (!priceId) {
      console.error("[CHECKOUT] missing price ID for plan", plan);
      return NextResponse.json(
        { error: "Server misconfigured: missing Stripe price ID" },
        { status: 500 }
      );
    }

    const appUrl = getAppUrl(req);
    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;
    const portalReturnUrl = `${appUrl}/pricing`;

    // 1) Lookup subscription state
    let stripeCustomerId: string | null = null;
    let stripeSubscriptionId: string | null = null;
    let isActive = false;

    const { data } = await supabaseAdmin
      .from("user_subscriptions")
      .select("stripe_customer_id,stripe_subscription_id,is_active,current_period_end,plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (data) {
      stripeCustomerId = (data.stripe_customer_id as string | null) ?? null;
      stripeSubscriptionId = (data.stripe_subscription_id as string | null) ?? null;

      const now = Date.now();
      const cpeMs = data.current_period_end
        ? new Date(data.current_period_end as any).getTime()
        : null;

      // ✅ robusto: consideriamo attiva anche se `is_active` è stale,
      // usando `current_period_end` come fallback (webhook può arrivare in ritardo)
      const activeByDate = Boolean(cpeMs && cpeMs > now);
      isActive = Boolean(data.is_active) || activeByDate;
    }

    // 2) Se attivo -> portal
    if (isActive) {
      if (!stripeCustomerId && stripeSubscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const cust = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

          if (cust) {
            stripeCustomerId = cust;
            await supabaseAdmin
              .from("user_subscriptions")
              .update({ stripe_customer_id: cust })
              .eq("user_id", userId);
          }
        } catch (e) {
          console.warn("[CHECKOUT] cannot retrieve subscription/customer", e);
        }
      }

      if (!stripeCustomerId) {
        return NextResponse.json(
          { error: "Active subscription but missing stripe_customer_id" },
          { status: 500 }
        );
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: portalReturnUrl,
      });

      return NextResponse.json({ url: portalSession.url, mode: "portal" });
    }

    // 3) Nessuna subscription attiva -> checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: userId,
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      metadata: { userId, plan },
      subscription_data: { metadata: { userId, plan } },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url, mode: "checkout" });
  } catch (err) {
    console.error("[CHECKOUT] Stripe checkout error:", err);
    return NextResponse.json({ error: "Stripe checkout failure" }, { status: 500 });
  }
}