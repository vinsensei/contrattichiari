"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ANALYSIS_ANCHORS } from "./anchors";

export default function AnchorNav({
  navRef,
  summary,
  showFull,
  isPro,
  hasClausoleCritiche,
  hasClausoleVessatorie,
  hasVersioneRiequilibrata,
  hasGlossario,
  hasAlertFinali,
  hasRiskIndex = true,
  hasTopRiskClauses = true,
  hasBalanceScore = true,
  hasChecklist = true,
  hasClausesEnriched = true,
  onGo,
}: {
  navRef: React.RefObject<HTMLElement | null>;
  summary: string | null;

  /** Se true: mostriamo link alle sezioni full. Se false: preview + CTA */
  showFull: boolean;

  /** Se true: utente con piano Pro (sblocca le sezioni v2) */
  isPro: boolean;

  hasClausoleCritiche: boolean;
  hasClausoleVessatorie: boolean;
  hasVersioneRiequilibrata: boolean;
  hasGlossario: boolean;
  hasAlertFinali: boolean;

  /** v2 – mostra pulsante se la sezione esiste */
  hasRiskIndex?: boolean;
  /** v2 – mostra pulsante se la sezione esiste */
  hasTopRiskClauses?: boolean;
  /** v2 – mostra pulsante se la sezione esiste */
  hasBalanceScore?: boolean;
  /** v2 – mostra pulsante se la sezione esiste */
  hasChecklist?: boolean;
  /** v2 – mostra pulsante se la sezione esiste */
  hasClausesEnriched?: boolean;

  onGo: (anchorId: string) => void;
}) {
  // Stato: quale ancora è “attiva” (evidenzia il bottone)
  const [activeId, setActiveId] = useState<string | null>(null);

  // Ref al contenitore scrollabile orizzontale (la row dei chip)
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Ref ai singoli bottoni (per scrollIntoView quando diventano attivi)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Micro-reward: quando si sblocca il piano (isPro=true), facciamo “pop” il pill "Pro" per le sezioni PRO
  const [justUnlockedIds, setJustUnlockedIds] = useState<Record<string, boolean>>({});

  // Flag per evitare che IntersectionObserver “sovrascriva” l’attivo subito dopo un click
  const suppressObserverRef = useRef(false);
  const suppressTimerRef = useRef<number | null>(null);

  const navItems = useMemo(
    () =>
      [
        // 1) summary
        {
          id: ANALYSIS_ANCHORS.summary,
          label: "Riassunto semplice",
          show: Boolean(summary),
          locked: false,
          tier: "base" as const,
        },

        // 2) preview (free)
        {
          id: ANALYSIS_ANCHORS.criticalPreview,
          label: "Anteprima clausole critiche",
          show: !showFull && hasClausoleCritiche,
          locked: false,
          tier: "base" as const,
        },
        {
          id: ANALYSIS_ANCHORS.unfairPreview,
          label: "Anteprima clausole vessatorie",
          show: !showFull && hasClausoleVessatorie,
          locked: false,
          tier: "base" as const,
        },

        // 3) full (paid/full)
        {
          id: ANALYSIS_ANCHORS.criticalFull,
          label: "Clausole problematiche",
          show: showFull && hasClausoleCritiche,
          locked: false,
          tier: "base" as const,
        },
        {
          id: ANALYSIS_ANCHORS.unfairFull,
          label: "Clausole potenzialmente vessatorie",
          show: showFull && hasClausoleVessatorie,
          locked: false,
          tier: "base" as const,
        },

        // 4) v2 (PRO)
        {
          id: ANALYSIS_ANCHORS.riskIndex,
          label: "Indice di rischio",
          show: hasRiskIndex,
          locked: !isPro,
          tier: "pro" as const,
        },
        {
          id: ANALYSIS_ANCHORS.topRiskClauses,
          label: "Clausole più rischiose",
          show: hasTopRiskClauses,
          locked: !isPro,
          tier: "pro" as const,
        },
        {
          id: ANALYSIS_ANCHORS.balanceScore,
          label: "Bilanciamento",
          show: hasBalanceScore,
          locked: !isPro,
          tier: "pro" as const,
        },
        {
          id: ANALYSIS_ANCHORS.checklist,
          label: "Checklist",
          show: hasChecklist,
          locked: !isPro,
          tier: "pro" as const,
        },
        {
          id: ANALYSIS_ANCHORS.clausesEnriched,
          label: "Clausole dettagliate",
          show: hasClausesEnriched,
          locked: !isPro,
          tier: "pro" as const,
        },

        // 5) sezioni full “extra”
        {
          id: ANALYSIS_ANCHORS.rebalanced,
          label: "Versione riequilibrata",
          show: showFull && hasVersioneRiequilibrata,
          locked: false,
          tier: "base" as const,
        },
        {
          id: ANALYSIS_ANCHORS.glossary,
          label: "Glossario",
          show: showFull && hasGlossario,
          locked: false,
          tier: "base" as const,
        },
        {
          id: ANALYSIS_ANCHORS.finalAlerts,
          label: "Alert finali",
          show: showFull && hasAlertFinali,
          locked: false,
          tier: "base" as const,
        },
      ].filter((x) => x.show),
    [
      summary,
      showFull,
      isPro,
      hasClausoleCritiche,
      hasClausoleVessatorie,
      hasVersioneRiequilibrata,
      hasGlossario,
      hasAlertFinali,
      hasRiskIndex,
      hasTopRiskClauses,
      hasBalanceScore,
      hasChecklist,
      hasClausesEnriched,
    ]
  );

  useEffect(() => {
    if (!isPro) return;

    // Sezioni PRO (v2) che passano da 🔒 a pill “Pro” quando l’utente sblocca
    const proIds = [
      ANALYSIS_ANCHORS.riskIndex,
      ANALYSIS_ANCHORS.topRiskClauses,
      ANALYSIS_ANCHORS.balanceScore,
      ANALYSIS_ANCHORS.checklist,
      ANALYSIS_ANCHORS.clausesEnriched,
    ];

    // Attiva pop una volta (per questa render-cycle di sblocco)
    setJustUnlockedIds((prev) => {
      const next = { ...prev };
      for (const id of proIds) next[id] = true;
      return next;
    });

    const t = window.setTimeout(() => {
      setJustUnlockedIds({});
    }, 900);

    return () => window.clearTimeout(t);
  }, [isPro]);

  // ✅ Auto-sync: mentre scrolli la pagina, aggiorna activeId in base alla sezione più “presente” in viewport.
  useEffect(() => {
    if (!navItems.length) return;

    // Consideriamo l’altezza della nav sticky (così l’attivazione delle sezioni è coerente)
    const navH = navRef.current?.offsetHeight ?? 0;

    // RootMargin:
    // - parte alta “spinta giù” della nav (top negativo) per non considerare l’area coperta
    // - parte bassa ridotta per evitare switch troppo presto
    const rootMargin = `-${navH + 8}px 0px -60% 0px`;

    const thresholds = [0, 0.15, 0.25, 0.35, 0.5, 0.65, 0.8, 0.95];

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return;

        // Prendiamo la sezione “migliore”: tra quelle visibili, quella con ratio più alta.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        const id = (visible?.target as HTMLElement | undefined)?.id;
        if (!id) return;

        // Evita set ripetuti inutili
        setActiveId((prev) => (prev === id ? prev : id));
      },
      { root: null, rootMargin, threshold: thresholds }
    );

    // Osserviamo solo gli elementi che esistono davvero in pagina
    const observedEls: HTMLElement[] = [];
    for (const item of navItems) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        observedEls.push(el);
      }
    }

    // Se nessuna sezione è osservabile (edge case), non facciamo nulla
    if (!observedEls.length) {
      observer.disconnect();
      return;
    }

    return () => observer.disconnect();
  }, [navItems, navRef]);

  // ✅ Quando cambia activeId (da scroll o click), porta sempre il chip attivo verso sinistra.
  useEffect(() => {
    if (!activeId) return;
    const btn = buttonRefs.current[activeId];
    if (!btn) return;

    btn.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [activeId]);

  // Cleanup timer di soppressione observer
  useEffect(() => {
    return () => {
      if (suppressTimerRef.current) {
        window.clearTimeout(suppressTimerRef.current);
        suppressTimerRef.current = null;
      }
    };
  }, []);

  if (!navItems.length) return null;

  return (
    <nav
      ref={navRef}
      data-anchor-nav="true"
      className="sticky top-0 z-30 -mx-4 sm:-mx-6 bg-white/95 backdrop-blur border-b border-slate-200"
    >
      <div
        ref={scrollerRef}
        className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-4 py-3 text-xs sm:text-sm"
      >
        {navItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              type="button"
              onClick={() => {
                setActiveId(item.id);

                suppressObserverRef.current = true;
                if (suppressTimerRef.current) {
                  window.clearTimeout(suppressTimerRef.current);
                }
                suppressTimerRef.current = window.setTimeout(() => {
                  suppressObserverRef.current = false;
                }, 800);

                onGo(item.id);
              }}
              className={[
                "inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-4 whitespace-nowrap transition",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
                item.locked ? "opacity-80" : "",
              ].join(" ")}
              aria-current={isActive ? "true" : undefined}
            >
              {item.tier === "pro" ? (
                item.locked ? (
                  <span aria-hidden className="text-[11px] leading-none">
                    🔒
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className={[
                      "ml-0.5 inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase leading-none text-slate-700",
                      justUnlockedIds[item.id] ? "pop" : "",
                    ].join(" ")}
                  >
                    Pro
                  </span>
                )
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
