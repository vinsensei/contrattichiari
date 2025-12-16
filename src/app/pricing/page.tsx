"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { gaEvent } from "@/lib/gtag";
import Link from "next/link";

export default function PricingPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [checkingUser, setCheckingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);

      // carica piano corrente
      try {
        const { data: sub, error: subError } = await supabase
          .from("user_subscriptions")
          .select("plan, is_active")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (subError) {
          console.error("Errore nel recupero abbonamento:", subError);
        }

        if (sub) {
          setPlan((sub.plan as any) ?? "free");
          setIsActive(sub.is_active ?? false);
        } else {
          setPlan("free");
          setIsActive(false);
        }
      } catch (e) {
        console.error("Errore imprevisto nel recupero abbonamento:", e);
      }

      setCheckingUser(false);
    };
    check();
  }, [supabase, router]);

  const startCheckout = async () => {
    if (!userId) return;
    setErrorMsg(null);
    setLoadingCheckout(true);

    // piano scelto (per ora fisso)
    const selectedPlan = "standard";

    // GA4: evento di inizio checkout
    gaEvent("subscription_started", {
      plan: selectedPlan,
    });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, userId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Impossibile avviare il checkout.");
        setLoadingCheckout(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url; // redirect a Stripe
      } else {
        setErrorMsg("Risposta di Stripe non valida.");
        setLoadingCheckout(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Errore imprevisto durante il checkout.");
      setLoadingCheckout(false);
    }
  };

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          <img src="/loader.svg" alt="Caricamento in corso..." className="h-12 w-12 animate-bounce mx-auto mb-2" />
        </p>
      </div>
    );
  }

  const standardIsActive = isActive && plan === "standard";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
        <div className="text-lg font-semibold text-slate-900">
          <Link href="/" className="flex items-center">
            {/* Logo Mobile */}
            <img
              src="/logo_mobile.png"
              alt="Contratti Chiari"
              className="h-9 w-auto shrink-0 block md:hidden"
            />

            {/* Logo Desktop */}
            <img
              src="/logo.png"
              alt="Contratti Chiari"
              className="h-8 w-auto shrink-0 hidden md:block"
            />
          </Link>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Torna alla dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 animate-fade-in-up delay-1 mt-0 md:mt-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-slate-900">
           La certezza che ti serve, subito. 
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-10">
            Parti gratis, passa allo Standard
            quando ti serve analizzare più contratti.
          </p>
       </div>
        

        <section className="grid gap-6 md:grid-cols-3">
          {/* Piano Free */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3">
            <h2 className="text-base font-semibold text-slate-900">Free</h2>
            <p className="text-2xl font-semibold text-slate-900">0€</p>
            <p className="text-sm text-slate-600">
              1 analisi completa, perfetta per provare il servizio.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 mt-2">
              <li>• 1 contratto analizzato</li>
              <li>• Evidenziazione clausole critiche</li>
              <li>• Riassunto semplice</li>
            </ul>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-auto text-sm text-slate-700 underline"
            >
              Torna alla dashboard
            </button>
          </div>

          {/* Piano Standard */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col gap-3 border border-slate-900">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">Standard</h2>
              {standardIsActive && (
                <span className="inline-flex items-center rounded-full bg-emerald-400/20 text-emerald-100 px-3 py-0.5 text-[11px] font-medium">
                  Piano attivo
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold">4,99€/mese</p>
            <p className="text-sm text-slate-100">
              Analisi illimitate per privati, freelance e piccoli studi.
            </p>
            <ul className="text-xs text-slate-100/90 space-y-1 mt-2">
              <li>• Analisi illimitate</li>
              <li>• Evidenziazione clausole critiche e vessatorie</li>
              <li>• Versione riequilibrata suggerita</li>
            </ul>
            {errorMsg && (
              <p className="text-xs text-red-300 mt-2">{errorMsg}</p>
            )}
            {standardIsActive ? (
              <button
                onClick={() => router.push("/dashboard/account")}
                className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100"
              >
                Gestisci il tuo abbonamento
              </button>
            ) : (
              <button
                onClick={startCheckout}
                disabled={loadingCheckout}
                className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
              >
                {loadingCheckout ? "Reindirizzamento…" : "Attiva Standard"}
              </button>
            )}
          </div>

          {/* Piano Pro */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3 opacity-70">
            <h2 className="text-base font-semibold text-slate-900">Pro</h2>
            <p className="text-2xl font-semibold text-slate-900">9,99€/mese</p>
            <p className="text-sm text-slate-600">
              Per studi e team. Report esportabili e funzionalità avanzate.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 mt-2">
              <li>• Tutto dello Standard</li>
              <li>• Report PDF</li>
              <li>• Multi-utente (in roadmap)</li>
            </ul>
            <p className="mt-auto text-xs text-slate-400">
              Il piano Pro sarà attivato in una fase successiva.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
