import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: Request) {
  try {
    // --- 1) Leggi il body in modo safe (come abbiamo fatto per /portal) ---
    let userId: string | undefined;

    try {
      const rawBody = await req.text();
      if (rawBody) {
        const parsed = JSON.parse(rawBody);
        userId = parsed.userId;
      }
    } catch (parseErr) {
      console.error("[PORTAL] JSON parse error:", parseErr);
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // --- 2) Prova a leggere stripe_customer_id da user_subscriptions ---
    const { data: sub, error: subError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("[PORTAL] errore user_subscriptions:", subError);
    }

    let customerId: string | null =
      (sub?.stripe_customer_id as string | null) ?? null;

    // --- 3) Se stripe_customer_id non c'è, cerchiamo il cliente Stripe via email ---
    if (!customerId) {
      // Prendi la mail dall'utente in auth.users
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.admin.getUserById(userId);

      if (userError || !userData?.user?.email) {
        console.error("[PORTAL] impossibile recuperare email utente:", userError);
        return NextResponse.json(
          { error: "Impossibile trovare l'utente o la sua email." },
          { status: 400 }
        );
      }

      const email = userData.user.email;

      console.log("[PORTAL] Nessun stripe_customer_id in DB, cerco per email:", email);

      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      const customer = customers.data[0];

      if (!customer) {
        console.error("[PORTAL] Nessun customer Stripe trovato per email:", email);
        return NextResponse.json(
          { error: "Nessun cliente Stripe associato all’account." },
          { status: 400 }
        );
      }

      customerId = customer.id;

      // Prova a salvare il customerId in user_subscriptions per il futuro
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);

      if (updateError) {
        console.error("[PORTAL] errore nel salvataggio stripe_customer_id:", updateError);
      } else {
        console.log("[PORTAL] stripe_customer_id aggiornato per user:", userId);
      }
    }

    if (!customerId) {
      // ultra fallback, non dovrebbe mai arrivare qui
      return NextResponse.json(
        { error: "Nessun cliente Stripe associato all’account." },
        { status: 400 }
      );
    }

    // --- 4) Costruisci la base URL dell’app ---
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    // --- 5) Crea la sessione del Billing Portal ---
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[PORTAL] errore inatteso:", err);
    return NextResponse.json(
      { error: "Errore interno apertura portale" },
      { status: 500 }
    );
  }
}