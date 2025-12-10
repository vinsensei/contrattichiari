import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";
import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export default async function PricingSuccessPage({
  searchParams,
}: SuccessPageProps) {
  // 👇 NUOVO: unwrap della Promise
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            Nessuna sessione di pagamento trovata
          </h1>
          <p className="text-sm text-slate-600">
            Non abbiamo trovato i dettagli del pagamento. Se hai completato il
            checkout, prova ad accedere alla dashboard per verificare il tuo
            piano.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
            >
              Vai alla dashboard
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Torna ai piani
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let plan: "standard" | "pro" | "free" = "free";
  let updateOk = false;

  try {
    // 1) Recupera la sessione Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const planMeta = (metadata.plan as "standard" | "pro") || "standard";

    plan = planMeta;

    if (!userId) {
      console.error("[SUCCESS] Nessun userId in session.metadata", {
        sessionId,
        metadata,
      });
    } else {
      // 2) customerId da session.customer
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      // 3) current_period_end dalla subscription, se c'è
      let currentPeriodEnd: string | null = null;
      const subscriptionId = session.subscription;

      if (typeof subscriptionId === "string") {
        try {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          // TS non vede current_period_end sul tipo, lo leggiamo via any
          const cpe = (subscription as any)
            .current_period_end as number | undefined;

          if (cpe) {
            currentPeriodEnd = new Date(cpe * 1000).toISOString();
          }
        } catch (err) {
          console.error("[SUCCESS] Errore nel recupero subscription:", err);
        }
      }

      // 4) Upsert su user_subscriptions, includendo stripe_customer_id
      const supabase = supabaseAdmin();
      const { error } = await supabase.from("user_subscriptions").upsert(
        {
          user_id: userId,
          plan: planMeta,
          is_active: true,
          current_period_end: currentPeriodEnd,
          stripe_customer_id: customerId ?? null,
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("[SUCCESS] Errore upsert user_subscriptions:", error);
      } else {
        updateOk = true;
      }
    }
  } catch (err) {
    console.error("[SUCCESS] Errore nel recupero sessione Stripe:", err);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          {updateOk
            ? "Abbonamento attivato con successo"
            : "Pagamento completato"}
        </h1>
        <p className="text-sm text-slate-600">
          {updateOk
            ? "Il tuo piano è stato aggiornato. Puoi ora usare Contratti Chiari senza limiti, secondo il piano scelto."
            : "Abbiamo ricevuto il pagamento. Se il tuo piano non risulta ancora aggiornato, potrebbe volerci qualche istante."}
        </p>
        <p className="text-xs text-slate-500">
          Piano:{" "}
          <span className="font-medium">
            {plan === "standard"
              ? "Standard"
              : plan === "pro"
              ? "Pro"
              : "Free"}
          </span>
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            Vai alla dashboard
          </Link>
          <Link
            href="/dashboard/account"
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Gestisci account
          </Link>
        </div>
      </div>
    </main>
  );
}