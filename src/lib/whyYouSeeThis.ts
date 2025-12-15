export type WhyYouSeeThis = {
  id: string;
  title: string;
  text: string;
};

export const WHY_YOU_SEE_THIS: Record<string, WhyYouSeeThis> = {
  affitto: {
    id: "affitto",
    title: "Perché vedi queste informazioni",
    text:
      "Questa pagina ti mostra i punti del contratto di affitto che più spesso causano problemi reali. " +
      "Li abbiamo selezionati analizzando contratti e situazioni ricorrenti, per aiutarti a capire cosa controllare prima di firmare."
  },

  affitto_clausole: {
    id: "affitto_clausole",
    title: "Perché vedi queste clausole",
    text:
      "Le clausole mostrate sono quelle che più spesso creano squilibri o fraintendimenti nei contratti di affitto. " +
      "Capirle prima ti aiuta a evitare problemi dopo."
  },

  affitto_rischi: {
    id: "affitto_rischi",
    title: "Perché vedi questi rischi",
    text:
      "Questi rischi derivano da situazioni reali emerse da contratti già firmati. " +
      "Li vedi qui per riconoscerli in anticipo e decidere con maggiore consapevolezza."
  },

  guida_rapida_affitto: {
    id: "guida_rapida_affitto",
    title: "Perché vedi questa guida",
    text:
      "Questa guida riassume i controlli essenziali sul contratto di affitto, pensata per una lettura veloce prima di firmare o rinnovare."
  },
};