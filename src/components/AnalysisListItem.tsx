import Link from "next/link";

type AnalysisListItemProps = {
  id: string;
  tipoContratto: string;
  valutazioneRischio: string | null;
  motivazioneRischio: string;
  createdAt: string;
};

const AnalysisListItem = ({
  id,
  tipoContratto,
  valutazioneRischio,
  motivazioneRischio,
  createdAt,
}: AnalysisListItemProps) => {
  const riskBadge = (risk: string | null) => {
    if (!risk) return null;
    const base =
      "inline-flex items-center justify-center rounded-full text-[11px] font-medium px-3 py-1 w-full text-center sm:w-auto";
    if (risk === "alto")
      return (
        <span className={`${base} bg-red-50 text-red-700 border border-red-100`}>
          Rischio alto
        </span>
      );
    if (risk === "medio")
      return (
        <span
          className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}
        >
          Rischio medio
        </span>
      );
    return (
      <span
        className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100`}
      >
        Rischio basso
      </span>
    );
  };

  return (
    <li>
      <Link
        href={`/analysis/${id}`}
        className="group block rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* left: titolo + testo */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900 group-hover:text-slate-950">
              {tipoContratto}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2">
              {motivazioneRischio}
            </p>
          </div>
          {/* right: badge + data/ora */}
          <div className="flex flex-col items-stretch gap-1 sm:items-end sm:min-w-[160px]">
            {riskBadge(valutazioneRischio)}
            <p className="text-[11px] text-slate-400 sm:text-right">
              {new Date(createdAt).toLocaleString("it-IT")}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default AnalysisListItem;