import React from "react";
import GoToMarket from "@/components/analysis/GoToMarket";

/**
 * Wrapper unico per tutte le sezioni Pro:
 * - Header resta fuori (quindi NON blurato)
 * - Solo body viene blurato + overlay CTA
 */
export default function ProLockedSection({
  locked,
  children,
  blurClassName = "blur-sm opacity-90",
}: {
  locked: boolean;
  children: React.ReactNode;
  /** Ti permette di standardizzare blur e opacità in un solo punto */
  blurClassName?: string;
}) {
  return (
    <div className="relative">
      <div
        className={locked ? `pointer-events-none select-none ${blurClassName}` : ""}
        aria-hidden={locked ? "true" : undefined}
      >
        {children}
      </div>

      {locked ? <GoToMarket /> : null}
    </div>
  );
}