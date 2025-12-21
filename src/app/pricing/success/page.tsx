"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Plan = "free" | "standard" | "pro";

export default function PricingSuccessPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = useMemo(
    () => searchParams.get("session_id") ?? "",
    [searchParams]
  );

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>("free");
  const [isActive, setIsActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAndWaitForSubscription() {
      setLoading(true);
      setErrorMsg(null);

      try {
        // 1) Serve essere loggati (il successo può essere aperto anche in una tab anon/incognito)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          // Se non siamo autenticati, rimandiamo al login e poi in /pricing
          router.replace("/login");
          return;
        }

        // 2) Aspettiamo che webhook/DB aggiornino la subscription.
        // In prod può richiedere qualche secondo.
        const MAX_TRIES = 12; // ~18s
        const SLEEP_MS = 1500;

        for (let i = 0; i < MAX_TRIES; i++) {
          if (cancelled) return;

          const { data: rows, error: subError } = await supabase
            .from("user_subscriptions")
            .select("plan, is_active, current_period_end, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(1);

          const sub = rows?.[0] ?? null;

          if (!subError && sub) {
            const planVal: Plan = (sub.plan as Plan) ?? "free";

            // is_active può essere stale: usiamo anche current_period_end.
            const cpeMs = sub.current_period_end
              ? new Date(sub.current_period_end).getTime()
              : null;
            const now = Date.now();
            const activeByDate = cpeMs ? cpeMs > now : false;
            const active = Boolean(sub.is_active) && activeByDate;

            setPlan(planVal);
            setIsActive(active);

            // Se vediamo un piano pagante attivo, possiamo proseguire.
            if (active && (planVal === "standard" || planVal === "pro")) {
              // Redirect morbido: vai al dashboard/account dove puoi gestire fatture/piano.
              router.replace("/dashboard/account");
              return;
            }
          }

          // sleep
          await new Promise((r) => setTimeout(r, SLEEP_MS));
        }

        // Se dopo i tentativi non risulta ancora attivo, non blocchiamo l'utente:
        // lo mandiamo comunque in account, dove potrà riprovare / vedere lo stato.
        if (!cancelled) {
          router.replace("/dashboard/account");
        }
      } catch (e) {
        console.error("[PRICING SUCCESS] unexpected error:", e);
        if (!cancelled) {
          setErrorMsg(
            "Pagamento completato, ma non siamo riusciti a confermare l’attivazione. Vai al profilo per verificare lo stato."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAndWaitForSubscription();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase, sessionId]);

  const planLabel =
    plan === "free" ? "Free" : plan === "standard" ? "Standard" : "Pro";

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Pagamento completato
        </h1>

        <p className="text-sm sm:text-base text-slate-600">
          Stiamo attivando il tuo piano. Potrebbe richiedere qualche secondo.
        </p>

        {sessionId ? (
          <p className="text-xs text-slate-400">
            Riferimento: <span className="font-mono">{sessionId}</span>
          </p>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Stato</div>
          <div className="mt-1 text-sm text-slate-800">
            Piano: <span className="font-semibold">{planLabel}</span>
            {isActive ? (
              <span className="ml-2 text-emerald-700">(attivo)</span>
            ) : (
              <span className="ml-2 text-amber-700">(in aggiornamento)</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Reindirizzamento…</div>
        ) : null}

        {errorMsg ? (
          <p className="text-sm text-rose-600">{errorMsg}</p>
        ) : null}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.replace("/dashboard/account")}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Vai al profilo
          </button>
        </div>
      </div>
    </main>
  );
}