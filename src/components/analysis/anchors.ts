export const ANALYSIS_ANCHORS = {
  /** Riassunto semplice del contratto
   *  ↳ SectionSummary.tsx
   */
  summary: "riassunto-semplice",

  /** Anteprima (parziale) delle clausole critiche – versione free
   *  ↳ SectionPreviewCriticalClauses.tsx
   */
  criticalPreview: "anteprima-clausole-critiche",

  /** Anteprima (parziale) delle clausole potenzialmente vessatorie – versione free
   *  ↳ SectionPreviewUnfairClauses.tsx
   */
  unfairPreview: "anteprima-clausole-vessatorie",

  /** Clausole critiche complete – versione full
   *  ↳ SectionCriticalClausesFull.tsx
   */
  criticalFull: "clausole-problematiche",

  /** Clausole potenzialmente vessatorie complete – versione full
   *  ↳ SectionUnfairClausesFull.tsx
   */
  unfairFull: "clausole-vessatorie",

  /** Indice di rischio complessivo (v2)
   *  ↳ SectionRiskIndexBox.tsx
   */
  riskIndex: "indice-di-rischio",

  /** Clausole con rischio più elevato (v2)
   *  ↳ SectionTopRiskClausesBox.tsx
   */
  topRiskClauses: "clausole-piu-rischiose",

  /** Bilanciamento del contratto tra le parti (v2)
   *  ↳ SectionBalanceScoreBox.tsx
   */
  balanceScore: "bilanciamento-contratto",

  /** Checklist operativa e di attenzione (v2)
   *  ↳ SectionChecklistBox.tsx
   */
  checklist: "checklist-operativa",

  /** Lista completa delle clausole arricchite e analizzate (v2)
   *  ↳ SectionClausesList.tsx
   */
  clausesEnriched: "clausole-dettagliate",

  /** Versione riequilibrata del contratto
   *  ↳ SectionRebalancedVersion.tsx
   */
  rebalanced: "versione-riequilibrata",

  /** Glossario dei termini legali
   *  ↳ SectionGlossary.tsx
   */
  glossary: "glossario",

  /** Alert finali prima della firma
   *  ↳ SectionFinalAlerts.tsx
   */
  finalAlerts: "alert-finali",
} as const;

export type AnalysisAnchor =
  (typeof ANALYSIS_ANCHORS)[keyof typeof ANALYSIS_ANCHORS];
