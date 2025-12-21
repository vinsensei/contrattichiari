import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

// Supabase admin (service role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getAppUrl(req: Request) {
  const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestOrigin = new URL(req.url).origin;
  return envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;
}

export async function POST(req: Request) {
  try {
    /* ------------------------------------------------------------------
       1) AUTH: leggiamo il token dall’header Authorization
    ------------------------------------------------------------------ */
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
      console.error("[PORTAL] auth error:", authError);
      return NextResponse.json({ error: "Utente non autenticato" }, { status: 401 });
    }

    const userId = user.id;

    /* ------------------------------------------------------------------
       2) Recuperiamo stripe ids da user_subscriptions
    ------------------------------------------------------------------ */
    const { data: sub, error: subError } = await supabaseAdmin
      .from("user_subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("[PORTAL] errore lookup user_subscriptions:", subError);
    }

    let customerId: string | null = (sub?.stripe_customer_id as string | null) ?? null;
    const subscriptionId: string | null =
      (sub?.stripe_subscription_id as string | null) ?? null;

    /* ------------------------------------------------------------------
       3) Metodo più affidabile: se ho subscriptionId → ricavo customer da Stripe
    ------------------------------------------------------------------ */
    if (!customerId && subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const c = subscription.customer;
        customerId = typeof c === "string" ? c : c?.id ?? null;
      } catch (e) {
        console.warn("[PORTAL] cannot retrieve subscription:", subscriptionId, e);
      }
    }

    /* ------------------------------------------------------------------
       4) Fallback: se manca customerId, cerchiamo su Stripe via email
    ------------------------------------------------------------------ */
    if (!customerId) {
      if (!user.email) {
        return NextResponse.json({ error: "Email utente non disponibile" }, { status: 400 });
      }

      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      const customer = customers.data[0];
      if (!customer) {
        return NextResponse.json(
          { error: "Nessun cliente Stripe associato all’account" },
          { status: 400 }
        );
      }

      customerId = customer.id;
    }

    /* ------------------------------------------------------------------
       5) Persistiamo customerId (upsert: crea riga se manca)
    ------------------------------------------------------------------ */
    if (customerId) {
      const { error: upsertError } = await supabaseAdmin
        .from("user_subscriptions")
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (upsertError) {
        console.warn("[PORTAL] upsert stripe_customer_id failed:", upsertError);
      }
    }

    /* ------------------------------------------------------------------
       6) Costruiamo la return_url corretta + Billing Portal session
    ------------------------------------------------------------------ */
    const appUrl = getAppUrl(req);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId!,
      return_url: `${appUrl}/dashboard/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    // Qui vogliamo LOG utile, perché il tuo errore era troppo “generico”
    console.error("[PORTAL] errore inatteso:", err);
    return NextResponse.json({ error: "Errore interno apertura portale" }, { status: 500 });
  }
}