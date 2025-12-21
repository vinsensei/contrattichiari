"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { gaEvent } from "@/lib/gtag";
import Link from "next/link";
import HeaderPublic from "@/components/HeaderPublic";

export default function PricingPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [checkingUser, setCheckingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<
    "standard" | "pro" | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      } else {
        setUserId(null);
      }

      // carica piano corrente
      try {
        if (data.user) {
          const { data: rows, error: subError } = await supabase
            .from("user_subscriptions")
            .select("plan, is_active, current_period_end")
            .eq("user_id", data.user.id)
            .limit(1);

          if (subError) {
            console.error("Errore nel recupero abbonamento:", subError);
          }

          const sub = rows?.[0] ?? null;

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

  const startCheckout = async (selectedPlan: "standard" | "pro") => {
    if (!userId) return;
    setErrorMsg(null);
    setLoadingCheckout(selectedPlan);

    gaEvent("subscription_started", { plan: selectedPlan });

    try {
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (sessionErr || !token) {
        setErrorMsg("Sessione non valida. Rifai login e riprova.");
        setLoadingCheckout(null);
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: selectedPlan }), // ✅ niente userId dal client
      });

      const data = await res.json();

      if (data?.url) window.location.href = data.url;
      else {
        setErrorMsg(data?.error ?? "Risposta di Stripe non valida.");
        setLoadingCheckout(null);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Errore imprevisto durante il checkout.");
      setLoadingCheckout(null);
    }
  };

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          <img
            src="/loader.svg"
            alt="Caricamento in corso..."
            className="h-12 w-12 animate-bounce mx-auto mb-2"
          />
        </p>
      </div>
    );
  }

  const standardIsActive = isActive && plan === "standard";
  const proIsActive = isActive && plan === "pro";

  const hasAnyActive = isActive && (plan === "standard" || plan === "pro");
  const isOnOtherPlan = (p: "standard" | "pro") => hasAnyActive && plan !== p;

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderPublic />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 animate-fade-in-up delay-1 mt-0 md:mt-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-slate-900">
            La certezza che ti serve, subito.
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-10">
            Parti gratis, passa allo Standard quando ti serve analizzare più
            contratti.
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
              <li>• 1 analisi completa</li>
              <li>• Clausole critiche evidenziate</li>
              <li>• Spiegazione in italiano semplice</li>
              <li>• Glossario dei termini (definizioni rapide)</li>
              <li>• Checklist “cosa fare ora”</li>
            </ul>
            <button
              onClick={() => router.push(userId ? "/dashboard" : "/register")}
              className="mt-auto text-sm text-slate-700 underline"
            >
              {userId ? "Torna alla dashboard" : "Crea un account gratuito"}
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
              <li>• Storico analisi in dashboard</li>
              <li>• Clausole critiche e vessatorie evidenziate</li>
              <li>• Spiegazioni, esempi e glossario</li>
              <li>• Checklist operativa “cosa fare ora”</li>
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
                onClick={() => {
                  if (!userId) {
                    router.push("/login?redirect=/pricing");
                    return;
                  }
                  startCheckout("standard");
                }}
                disabled={loadingCheckout !== null}
                className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
              >
                {loadingCheckout === "standard"
                  ? "Reindirizzamento…"
                  : isOnOtherPlan("standard")
                  ? "Gestisci / cambia piano"
                  : "Attiva Standard"}
              </button>
            )}
          </div>

          {/* Piano Pro */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">Pro</h2>
              {proIsActive && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-[11px] font-medium border border-emerald-200">
                  Piano attivo
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-slate-900">9,99€/mese</p>
            <p className="text-sm text-slate-600">
              Per studi e team. Report esportabili e funzionalità avanzate.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 mt-2">
              <li>• Tutto dello Standard</li>
              <li>• Report PDF esportabili</li>
              <li>• Esportazione PDF (report completo)</li>
              <li>• Funzioni avanzate sull’analisi (blocchi Pro)</li>
              <li>• Priorità supporto (in roadmap)</li>
            </ul>
            {errorMsg && (
              <p className="text-xs text-red-600 mt-2">{errorMsg}</p>
            )}
            {proIsActive ? (
              <button
                onClick={() => router.push("/dashboard/account")}
                className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                Gestisci il tuo abbonamento
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!userId) {
                    router.push("/login?redirect=/pricing");
                    return;
                  }
                  startCheckout("pro");
                }}
                disabled={loadingCheckout !== null}
                className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
              >
                {loadingCheckout === "pro"
                  ? "Reindirizzamento…"
                  : isOnOtherPlan("pro")
                  ? "Gestisci / cambia piano"
                  : "Attiva Pro"}
              </button>
            )}
          </div>
        </section>

        {/* TRUST / REASSURANCE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-700">
              <img
                src="/shield-secure.svg"
                alt="Pagamenti sicuri"
                className="h-5 w-5 text-emerald-600"
              />

              <span className="text-sm font-medium">
                Pagamenti sicuri e certificati
              </span>
            </div>

            <div className="flex items-center gap-2 opacity-80">
              <img src="/stripe.png" alt="Stripe" className="h-5 w-auto" />
              <span className="text-xs text-slate-500">Powered by Stripe</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Disdici quando vuoi
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                Nessun vincolo: puoi annullare in qualsiasi momento dal tuo
                account.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Pagamento sicuro
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                Pagamenti gestiti da Stripe. Non salviamo i dati della tua carta
                sui nostri sistemi.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Trasparenza totale
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                Prezzo chiaro, niente costi nascosti. Se resti sul Free, non
                paghi nulla.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Hai dubbi? Leggi{" "}
              <Link href="/termini" className="underline hover:text-slate-700">
                Termini
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="underline hover:text-slate-700">
                Privacy
              </Link>
              .
            </p>
            <p className="text-[11px] text-slate-400">
              I risultati sono informativi e non sostituiscono un parere legale
              professionale.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
