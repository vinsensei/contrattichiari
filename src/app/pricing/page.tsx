"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function PricingPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [checkingUser, setCheckingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUserId(data.user.id);
      setCheckingUser(false);
    };
    check();
  }, [supabase, router]);

  const startCheckout = async () => {
    if (!userId) return;
    setErrorMsg(null);
    setLoadingCheckout(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "standard", userId }), // 👈 userId qui
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
        <p className="text-sm text-slate-500">Caricamento…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
        <div className="text-lg font-semibold text-slate-900">
          Contratti Chiari
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Torna alla dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Scegli il tuo piano
          </h1>
          <p className="text-sm text-slate-600">
            La certezza che ti serve, subito. Parti gratis, passa allo Standard
            quando ti serve analizzare più contratti.
          </p>
        </section>

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
            <h2 className="text-base font-semibold">Standard</h2>
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
            <button
              onClick={startCheckout}
              disabled={loadingCheckout}
              className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
            >
              {loadingCheckout ? "Reindirizzamento…" : "Attiva Standard"}
            </button>
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
