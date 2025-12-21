"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function PricingPage() {
  const supabase = supabaseBrowser();

  // 1) loadingCheckout as plan-specific string or null
  const [loadingCheckout, setLoadingCheckout] = useState<
    "standard" | "pro" | null
  >(null);

  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("plan, is_active, current_period_end")
        .single();

      if (error) {
        setPlan("free");
        setIsActive(false);
        return;
      }

      const sub = data;

      if (sub) {
        const planVal = (sub.plan as any) ?? "free";

        // is_active può essere stale (es. dopo cancellazione o scadenza).
        // Usiamo anche current_period_end per decidere se è davvero attivo.
        const cpe = sub.current_period_end
          ? new Date(sub.current_period_end).getTime()
          : null;
        const now = Date.now();
        const activeByDate = cpe ? cpe > now : false;
        const active = Boolean(sub.is_active) && activeByDate;

        setPlan(planVal);
        setIsActive(active);
      } else {
        setPlan("free");
        setIsActive(false);
      }
    }

    loadSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCheckout(selectedPlan: "standard" | "pro") {
    setErrorMsg(null);
    setLoadingCheckout(selectedPlan);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (!res.ok) {
        setErrorMsg("Errore nella richiesta di checkout.");
        setLoadingCheckout(null);
        return;
      }

      const data = await res.json();

      // Se l'API decide che hai già un abbonamento attivo, può rispondere con un URL di gestione (Customer Portal)
      // invece che con una Checkout Session.
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("Risposta di Stripe non valida.");
        setLoadingCheckout(null);
      }
    } catch (err) {
      setErrorMsg("Errore durante il checkout.");
      setLoadingCheckout(null);
    }
  }

  const standardIsActive = isActive && plan === "standard";
  const proIsActive = isActive && plan === "pro";

  const hasAnyActive = isActive && (plan === "standard" || plan === "pro");
  const isOnOtherPlan = (p: "standard" | "pro") => hasAnyActive && plan !== p;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold">Scegli il tuo piano</h1>

      <div className="flex gap-6">
        <div className="border p-6 rounded-lg shadow-sm w-64">
          <h2 className="text-xl font-semibold mb-2">Standard</h2>
          <p className="mb-4">Ideale per uso personale.</p>
          <button
            disabled={loadingCheckout !== null}
            className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-50"
            onClick={() => startCheckout("standard")}
          >
            {loadingCheckout === "standard"
              ? "Reindirizzamento…"
              : isOnOtherPlan("standard")
              ? "Gestisci / cambia piano"
              : "Attiva Standard"}
          </button>
          {standardIsActive && (
            <p className="mt-2 text-green-600">Piano attivo</p>
          )}
        </div>

        <div className="border p-6 rounded-lg shadow-sm w-64">
          <h2 className="text-xl font-semibold mb-2">Pro</h2>
          <p className="mb-4">Per professionisti e aziende.</p>
          <button
            disabled={loadingCheckout !== null}
            className="w-full rounded bg-green-600 text-white py-2 disabled:opacity-50"
            onClick={() => startCheckout("pro")}
          >
            {loadingCheckout === "pro"
              ? "Reindirizzamento…"
              : isOnOtherPlan("pro")
              ? "Gestisci / cambia piano"
              : "Attiva Pro"}
          </button>
          {proIsActive && <p className="mt-2 text-green-600">Piano attivo</p>}
        </div>
      </div>

      {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
    </main>
  );
}