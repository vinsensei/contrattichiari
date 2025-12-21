"use client";

export default function SectionUpgradeCta({
  show,
  onUpgrade,
}: {
  show: boolean;
  onUpgrade: () => void;
}) {
  if (!show) return null;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
      <h2 className="text-base font-semibold text-slate-900">
        Vuoi l’analisi completa?
      </h2>

      <p className="text-base text-slate-700">
        Al momento stai visualizzando una versione ridotta dell’analisi,
        generata a partire dal caricamento rapido del contratto. Con
        l’abbonamento ContrattiChiari puoi sbloccare:
      </p>

      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
        <li>clausole critiche spiegate nel dettaglio</li>
        <li>clausole potenzialmente vessatorie evidenziate</li>
        <li>una versione riequilibrata del contratto</li>
        <li>alert finali e glossario dei termini complessi</li>
      </ul>

      <button
        onClick={onUpgrade}
        className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
      >
        Vedi piani e sblocca l’analisi completa
      </button>
    </section>
  );
}