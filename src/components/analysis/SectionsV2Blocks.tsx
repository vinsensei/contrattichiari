"use client";

import React from "react";

/* componenti pro */
import SectionRiskIndexBox, {
  SectionPlainLanguageBox,
} from "@/components/analysis/pro/SectionRiskIndexBox";
import SectionTopRiskClausesBox from "@/components/analysis/pro/SectionTopRiskClausesBox";
import SectionClausesList from "@/components/analysis/pro/SectionClausesList";
import SectionBalanceScoreBox from "@/components/analysis/pro/SectionBalanceScoreBox";
import SectionChecklistBox from "@/components/analysis/pro/SectionChecklistBox";

/**
 * Placeholder “sicuri” per contenuti Pro quando l’utente NON è Pro.
 * Importante: in locked mode NON dobbiamo mai passare dati reali ai componenti Pro,
 * anche se la UI è blurata, perché il testo resterebbe comunque nel DOM.
 */
import { PRO_PLACEHOLDERS } from "@/components/analysis/proPlaceholders";

type V2 = {
  risk_index?: any;
  top_risk_clauses?: any[];
  clauses_enriched?: any[];
  plain_language?: string;
  balance_score?: any;
  checklist?: any[];
};

export default function SectionsV2Blocks({
  v2,
  isPro,
  showPro = false,
}: {
  v2?: V2 | null;
  /** True se l’utente ha piano Pro */
  isPro?: boolean;
  /** Legacy: compatibilità temporanea */
  showPro?: boolean;
}) {
  // Normalizziamo lo stato Pro: isPro ha precedenza, showPro resta come fallback legacy
  const proEnabled = typeof isPro === "boolean" ? isPro : Boolean(showPro);

  // Se non c’è proprio v2, non renderizziamo nulla (come prima)
  const hasAny =
    !!v2?.risk_index ||
    (Array.isArray(v2?.top_risk_clauses) && v2.top_risk_clauses.length > 0) ||
    (Array.isArray(v2?.clauses_enriched) && v2.clauses_enriched.length > 0) ||
    Boolean(v2?.plain_language) ||
    Boolean(v2?.balance_score) ||
    (Array.isArray(v2?.checklist) && v2.checklist.length > 0);

  if (!hasAny) return null;

  const locked = !proEnabled;

  /**
   * Dati effettivamente passati ai blocchi Pro:
   * - Se Pro: usiamo i dati reali (v2)
   * - Se NON Pro: usiamo SOLO placeholder (mai dati reali)
   */
  const riskIndex = locked ? PRO_PLACEHOLDERS.riskIndex : (v2?.risk_index as any);
  const topRiskClauses = locked
    ? (PRO_PLACEHOLDERS.topRiskClauses as any)
    : (v2?.top_risk_clauses as any);

  const balanceScore = locked
    ? (PRO_PLACEHOLDERS.balanceScore as any)
    : (v2?.balance_score as any);

  const checklist = locked
    ? (PRO_PLACEHOLDERS.checklist as any)
    : (v2?.checklist as any);

  const plainLanguage = locked
    ? (PRO_PLACEHOLDERS.plainLanguage.excerpt as any)
    : (v2?.plain_language as any);

  const clausesEnriched = locked
    ? (PRO_PLACEHOLDERS.clausesEnriched as any)
    : (v2?.clauses_enriched as any);

  return (
    <>
      {/*
       * Sezioni “Pro” (v2).
       * In locked mode:
       * - header visibile
       * - body blur + overlay (gestito nei singoli componenti)
       * - dati NON reali (solo PRO_PLACEHOLDERS)
       */}
      <SectionRiskIndexBox
        riskIndex={riskIndex}
        stickyHeader
        {...({ locked } as any)}
      />

      <SectionTopRiskClausesBox
        items={topRiskClauses}
        stickyHeader
        {...({ locked } as any)}
      />

      <SectionBalanceScoreBox
        data={balanceScore}
        stickyHeader
        {...({ locked } as any)}
      />

      <SectionChecklistBox
        items={checklist}
        stickyHeader
        {...({ locked } as any)}
      />

      <SectionPlainLanguageBox
        text={plainLanguage}
        stickyHeader
        {...({ locked } as any)}
      />

      <SectionClausesList
        clauses={clausesEnriched}
        stickyHeader
        {...({ locked } as any)}
      />
    </>
  );
}