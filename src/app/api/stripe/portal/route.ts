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

function isStripeModeMismatchError(err: any): boolean {
  const msg = String(err?.message ?? "");
  return (
    msg.includes("a similar object exists in live mode") ||
    msg.includes("a similar object exists in test mode")
  );
}

async function safeRetrieveCustomerIdFromSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const c = subscription.customer;
    return typeof c === "string" ? c : c?.id ?? null;
  } catch (e: any) {
    if (isStripeModeMismatchError(e)) return null;
    throw e;
  }
}

async function safeValidateCustomerId(customerId: string) {
  try {
    const c = await stripe.customers.retrieve(customerId);
    // If Stripe returns a deleted customer object, treat it as invalid.
    // Stripe types: Customer | DeletedCustomer
    if ((c as any)?.deleted) return null;
    return (c as any)?.id ?? null;
  } catch (e: any) {
    if (isStripeModeMismatchError(e)) return null;
    return null;
  }
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

    // Se in DB abbiamo un customerId ma non esiste (o è in modalità diversa), lo invalidiamo
    if (customerId) {
      const ok = await safeValidateCustomerId(customerId);
      if (!ok) customerId = null;
    }

    /* ------------------------------------------------------------------
       3) Metodo più affidabile: se ho subscriptionId → ricavo customer da Stripe
          (con fallback sicuro se c'è mismatch test/live)
    ------------------------------------------------------------------ */
    if (!customerId && subscriptionId) {
      try {
        customerId = await safeRetrieveCustomerIdFromSubscription(subscriptionId);
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
      // Nota: se arriviamo qui è molto probabile che i dati in DB siano stale (es. test/live mismatch).
      // Aggiorniamo in modo best-effort nel passo successivo con upsert.
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
            // Se abbiamo dovuto ricostruire il customerId senza poter validare la subscription,
            // meglio azzerare la subscription_id per evitare future retrieve su id non valido.
            stripe_subscription_id: subscriptionId ?? null,
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

    if (!customerId) {
      return NextResponse.json(
        { error: "Nessun cliente Stripe disponibile per aprire il portale" },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    // Qui vogliamo LOG utile, perché il tuo errore era troppo “generico”
    console.error("[PORTAL] errore inatteso:", err);
    return NextResponse.json({ error: "Errore interno apertura portale" }, { status: 500 });
  }
}