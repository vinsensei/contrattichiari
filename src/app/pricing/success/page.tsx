import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default function PricingSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="w-full max-w-xl space-y-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Pagamento completato
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Stiamo attivando il tuo piano. Potrebbe richiedere qualche secondo.
            </p>
            <div className="text-sm text-slate-500">Caricamento…</div>
          </div>
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}