"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { gaEvent } from "@/lib/gtag";

export default function PricingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return;
    }

    // Evita di ripetere la chiamata se l'utente ricarica senza param
    setConfirming(true);
    (async () => {
      try {
        await fetch(`/api/stripe/confirm?session_id=${sessionId}`, {
          method: "POST",
        });

        gaEvent("subscription_completed", {
          source: "stripe_checkout",
        });

        // pulisco l'URL dal session_id
        const url = new URL(window.location.href);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        console.error("Errore conferma abbonamento:", e);
        setConfirmError(
          "Il pagamento sembra completato, ma si è verificato un errore durante l'attivazione dell'abbonamento. Riprova ad accedere alla dashboard tra pochi minuti."
        );
      } finally {
        setConfirming(false);
      }
    })();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          Pagamento completato ✅
        </h1>

        {confirming && (
          <p className="text-sm text-slate-600">
            Stiamo attivando il tuo abbonamento… qualche istante e sarà tutto pronto.
          </p>
        )}

        {!confirming && !confirmError && (
          <p className="text-sm text-slate-600">
            Il tuo abbonamento a ContrattoChiaro è stato attivato. Ora puoi vedere le analisi complete
            dei tuoi contratti nella dashboard.
          </p>
        )}

        {confirmError && (
          <p className="text-sm text-red-600">
            {confirmError}
          </p>
        )}

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 hover:bg-slate-800"
          >
            Vai alla dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
