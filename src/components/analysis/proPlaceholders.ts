export const PRO_PLACEHOLDERS = {
  riskIndex: {
    score: 72,
    level: "medio",
    why_short: "xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx.sss",
  },
  topRiskClauses: [
    {
      clause_id: "x1",
      title: "xxxxxxxx xxxxxxxx",
      risk_score: 88,
      risk_level: "alto",
      why_short: "xxxxxxxx xxxxxxxx xxxxxxxx.",
      excerpt: "xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx…",
    },
    {
      clause_id: "x2",
      title: "xxxxxxxx xxxxxxxx",
      risk_score: 74,
      risk_level: "medio",
      why_short: "xxxxxxxx xxxxxxxx.",
      excerpt: "xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx…",
    },
  ],
  plainLanguage: {
    excerpt: "xxxxxxxxxxxxxxxx xxxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxx xxxxxxxxxxxxx xxx xxxxxxxxx xxxxxxxxxxx xxxxxxxxxxxx xxxxxxxxxx xxxxxxxx x xxxxxxxxx xxxxxxxx xxxxx xxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xxxxxxxxx xxxxxxxx xxxxx xxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xxxxxxxxx xxxxxxxx xxxxx xxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xxxxxxxxx xxxxxxxx xxxxx xxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xxxxxxxxx xxxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xxxxxxxxx xxxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xx xxxxxxx xxxxxxxx xxxxxxxx xxxxxxx xx xxx xxxxxx. xxxxxxxxxxxxxxxx xxxxxxxx xxxxx xxxxxxxx xxxxx xx xxxxxx xxxxxxxxxxxxxxxx xx xxx xx xxxxxxx xxxxxxxx xxxxxxxx xxxxxxx xx xxx xxxxxx ",
  },
  balanceScore: {
    user: 46,
    counterparty: 54,
    note: "xxxxxxxx xxxxxxxx xxxxxxxx.",
  },
  checklist: [
    { type: "action", text: "xxxxxxxx xxxxxxxx xxxxxxxx." },
    { type: "caution", text: "xxxxxxxx xxxxxxxx." },
    { type: "ok", text: "xxxxxxxx xxxxxxxx xxxxxxxx." },
  ],
  clausesEnriched: Array.from({ length: 3 }).map((_, i) => ({
    clause_id: `cx${i + 1}`,
    title: "xxxxxxxx xxxxxxxx",
    excerpt: "xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx…",
    risk_level: i < 2 ? "alto" : i < 4 ? "medio" : "basso",
    risk_score: i < 2 ? 85 : i < 4 ? 62 : 35,
    traffic_light: i < 2 ? "red" : i < 4 ? "yellow" : "green",
    diagnostic: "xxxxxxxx xxxxxxxx xxxxxxxx.",
    highlights: ["xxxxxxxx", "xxxxxxxx", "xxxxxxxx"],
  })),
} as const;