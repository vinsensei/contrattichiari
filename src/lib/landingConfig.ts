export type LandingConfig = {
  slug: string;

  seoTitle: string;
  seoDescription: string;

  ogTitle: string;
  ogDescription: string;
  ogImage: string; // /og/{slug}.png

  h1: string;
  subtitle: string;
  ctaLabel: string;

  problemBlocks: string[];
  checks: string[];
  examples: string[];
  faq: { question: string; answer: string }[];

  related?: string[]; // slugs landing (tool)
  relatedEditorial?: string[]; // slugs editorial, es: "clausole/recesso"
};

export const LANDINGS: Record<string, LandingConfig> = {
  /*
  "debug-contratto-affitto": {
  slug: "debug-contratto-affitto",

  seoTitle: "DEBUG – Landing completa | ContrattiChiari",
  seoDescription:
    "Pagina di debug per visualizzare tutti i moduli disponibili nella landing di ContrattiChiari.",

  ogTitle: "DEBUG Landing ContrattiChiari",
  ogDescription:
    "Anteprima completa di hero, problemi, checklist, esempi, CTA e FAQ.",
  ogImage: "/og/contratto-affitto.png",


  h1: "Debug landing – Tutti i moduli",
  subtitle:
    "Questa pagina serve solo a visualizzare e rifinire tutti i componenti della landing.",

  ctaLabel: "Carica un contratto (debug)",

  problemBlocks: [
    "Clausole scritte in modo ambiguo o sbilanciato",
    "Obblighi economici non evidenti alla prima lettura",
    "Rinnovi automatici poco chiari",
    "Penali sproporzionate o non spiegate",
    "Rischi che emergono solo dopo la firma",
  ],

  checks: [
    "Durata del contratto e rinnovi",
    "Clausole di recesso e disdetta",
    "Penali e interessi di mora",
    "Ripartizione di spese e costi",
    "Deposito cauzionale",
    "Obblighi delle parti",
    "Riferimenti mancanti o incompleti",
    "Clausole potenzialmente vessatorie",
  ],

  examples: [
    "«Il contratto prevede un rinnovo automatico senza indicare chiaramente i termini di disdetta.»",
    "«Sono presenti penali fisse anche per ritardi minimi nei pagamenti.»",
    "«Alcune spese vengono trasferite all’utente senza essere dettagliate.»",
  ],
  faq: [
    {
      question: "Questa pagina è visibile agli utenti?",
      answer:
        "No. È una pagina di debug usata solo per test grafici e di layout.",
    },
    {
      question: "Serve anche per mobile?",
      answer:
        "Sì. Serve proprio per verificare il comportamento di tutti i moduli su mobile e desktop.",
    },
    {
      question: "Quando va rimossa?",
      answer:
        "Quando il design della landing è validato e stabile.",
    },
  ],
  related: [
    "contratto-affitto",
    "contratto-affitto-studenti",
    "contratto-stanza",
  ],

  relatedEditorial: [
    "contratti/affitto",
    "clausole/recesso",
    "rischi/penali-sproporzionate",
  ],
},
*/
  // Contratti di affitto
  "contratto-affitto": {
    slug: "contratto-affitto",

    seoTitle: "Analisi contratto di affitto – Verifica rischi e clausole",
    seoDescription:
      "Carica il tuo contratto di affitto e scopri subito clausole scorrette, obblighi nascosti e rischi prima di firmare.",

    ogTitle: "Controllo contratto di affitto",
    ogDescription:
      "Analisi immediata del contratto di affitto con punti critici, rischi e obblighi.",
    ogImage: "/og/contratto-affitto.png",

    h1: "Analisi contratto di affitto",
    subtitle:
      "Carica il PDF del tuo contratto di affitto e verifica subito clausole scorrette, rischi e obblighi non chiari.",
    ctaLabel: "Carica contratto di affitto",

    problemBlocks: [
      "Clausole che trasferiscono spese non dovute all’inquilino",
      "Cauzione irregolare o superiore ai limiti",
      "Durata e rinnovi non conformi",
      "Recesso penalizzante o non previsto",
      "Ripartizione delle spese poco chiara",
    ],

    checks: [
      "Durata e rinnovi",
      "Deposito cauzionale",
      "Spese condominiali",
      "Obblighi del locatore",
      "Obblighi dell’inquilino",
      "Clausole vessatorie",
      "Recesso e preavvisi",
      "Dati e riferimenti mancanti",
    ],

    examples: [
      "“Il deposito cauzionale supera il limite previsto dalla normativa vigente.”",
      "“La clausola di recesso non rispetta il preavviso minimo di legge.”",
      "“Sono presenti spese a carico dell’inquilino che non dovrebbero esserlo.”",
    ],

    faq: [
      {
        question: "Il mio documento è sicuro?",
        answer:
          "Sì. Il file viene elaborato temporaneamente e cancellato al termine dell’analisi.",
      },
      {
        question: "L’analisi vale come consulenza legale?",
        answer:
          "No. È un supporto informativo che ti aiuta a capire rischi e criticità del testo.",
      },
      {
        question: "Posso analizzare anche foto o scansioni?",
        answer: "Sì, accettiamo PDF, JPG e PNG.",
      },
    ],

    related: ["contratto-affitto-studenti", "contratto-stanza"],

    relatedEditorial: [
      "contratti/affitto",
      "clausole/recesso",
      "rischi/penali-sproporzionate",
    ],
  },

  //Contratto affitto studenti
  "contratto-affitto-studenti": {
    slug: "contratto-affitto-studenti",

    seoTitle: "Analisi contratto affitto studenti – Verifica clausole e spese",
    seoDescription:
      "Carica il contratto di affitto studenti e verifica cauzione, spese, obblighi e rischi nascosti.",
    ogTitle: "Controllo contratto studenti",
    ogDescription:
      "Analisi automatica per contratto studenti: rischi, spese e obblighi non chiari.",
    ogImage: "/og/contratto-affitto-studenti.png",

    h1: "Analisi contratto affitto studenti",
    subtitle:
      "Scopri subito se il contratto studenti contiene spese e clausole irregolari.",
    ctaLabel: "Carica contratto studenti",

    problemBlocks: [
      "Cauzione elevata o irregolare",
      "Clausole non valide per contratti studenteschi",
      "Spese accessorie non chiare",
      "Durata non conforme ai contratti agevolati",
      "Penali eccessive in caso di recesso anticipato",
    ],

    checks: [
      "Durata agevolata",
      "Cauzione studenti",
      "Ripartizione spese",
      "Responsabilità danni",
      "Clausole di recesso",
      "Obblighi locatore",
      "Normativa per studenti",
    ],

    examples: [
      "“Clausola di durata non valida per contratti studenti.”",
      "“Cauzione superiore ai limiti consigliati.”",
      "“Penale eccessiva per recesso anticipato.”",
    ],

    faq: [
      {
        question: "Accettate contratti misti studenti-lavoratori?",
        answer:
          "Sì, è possibile analizzare qualsiasi forma contrattuale, incluse soluzioni ibride.",
      },
      {
        question: "È valido per contratti agevolati?",
        answer:
          "Sì, identifichiamo eventuali incongruenze con le agevolazioni previste.",
      },
    ],

    related: ["contratto-affitto", "contratto-stanza"],
  },
  //contratto transitorio
  "contratto-transitorio": {
    slug: "contratto-transitorio",

    seoTitle: "Analisi contratto transitorio – Verifica durata e clausole",
    seoDescription:
      "Controlla il tuo contratto transitorio e verifica durata, motivazioni, spese e rischi.",
    ogTitle: "Controllo contratto transitorio",
    ogDescription:
      "Analisi immediata del contratto transitorio: durata, motivazioni e clausole.",
    ogImage: "/og/contratto-transitorio.png",

    h1: "Analisi contratto transitorio",
    subtitle:
      "Scopri subito se il tuo contratto transitorio rispetta durata, motivazione e condizioni previste.",
    ctaLabel: "Carica contratto transitorio",

    problemBlocks: [
      "Durata non valida",
      "Motivazione mancante o generica",
      "Penali eccessive",
      "Ripartizione spese irregolare",
      "Condizioni non compatibili con contratto transitorio",
    ],

    checks: [
      "Durata contrattuale",
      "Motivazione transitorietà",
      "Ripartizione spese",
      "Obblighi locatore",
      "Obblighi conduttore",
      "Clausole irregolari",
      "Penali e recesso",
    ],

    examples: [
      "“La motivazione della transitorietà è insufficiente o generica.”",
      "“Durata non conforme ai limiti normativi.”",
    ],

    faq: [
      {
        question: "Il contratto transitorio richiede motivazione?",
        answer:
          "Sì, è obbligatoria e deve essere specifica. L’analisi la verifica automaticamente.",
      },
    ],

    related: ["contratto-affitto"],
  },
  //Contratto stanza / co-living
  "contratto-stanza": {
    slug: "contratto-stanza",

    seoTitle: "Analisi contratto stanza – Verifica costi e clausole",
    seoDescription:
      "Carica il contratto di affitto stanza e scopri subito clausole scorrette e rischi.",
    ogTitle: "Controllo contratto stanza",
    ogDescription:
      "Analisi contratto stanza: cauzione, spese, recesso, responsabilità.",
    ogImage: "/og/contratto-stanza.png",

    h1: "Analisi contratto stanza",
    subtitle:
      "Analisi immediata del contratto di stanza: costi, obblighi e possibili rischi.",
    ctaLabel: "Carica contratto stanza",

    problemBlocks: [
      "Spese non chiare (internet, pulizie, utenze)",
      "Responsabilità condivise confuse",
      "Cauzione irregolare",
      "Clausole non applicabili al co-living",
    ],

    checks: [
      "Spese incluse",
      "Responsabilità danni",
      "Regole co-living",
      "Durata",
      "Recesso",
      "Obblighi proprietario",
    ],

    examples: [
      "“Spese comuni non specificate in modo chiaro.”",
      "“Responsabilità danni condivise in modo eccessivamente generico.”",
    ],

    faq: [
      {
        question: "Valido anche per co-living?",
        answer: "Sì, controlliamo anche contratti multipli e in condivisione.",
      },
    ],

    related: ["contratto-affitto", "contratto-affitto-studenti"],
  },
  //Contratto affitto commerciale
  "contratto-affitto-commerciale": {
    slug: "contratto-affitto-commerciale",

    seoTitle:
      "Analisi contratto affitto commerciale – Controllo rischi e clausole",
    seoDescription:
      "Carica il contratto commerciale di affitto negozio/ufficio e verifica rischi, spese e clausole.",
    ogTitle: "Controllo contratto affitto commerciale",
    ogDescription:
      "Analisi automatica del contratto commerciale: durata, canone, spese, clausole.",
    ogImage: "/og/contratto-affitto-commerciale.png",

    h1: "Analisi contratto affitto commerciale",
    subtitle:
      "Verifica subito clausole, spese e rischi del tuo contratto commerciale.",
    ctaLabel: "Carica contratto commerciale",

    problemBlocks: [
      "Durata non conforme",
      "Ripartizione spese manutenzione non chiara",
      "Penali eccessive",
      "Clausole di recesso rigide",
    ],

    checks: [
      "Durata (6+6)",
      "Responsabilità manutenzione",
      "Uso immobile",
      "Recesso",
      "Penali",
      "Clausole irregolari",
    ],

    examples: [
      "“La durata indicata non rispetta gli standard commerciali.”",
      "“Le spese ordinarie e straordinarie non sono chiaramente distinte.”",
    ],

    faq: [
      {
        question: "Valido anche per uffici?",
        answer:
          "Sì, l’analisi è compatibile con negozi, uffici e attività commerciali.",
      },
    ],

    related: ["contratto-affitto"],
  },
  //Contratto a tempo determinato
  "contratto-tempo-determinato": {
    slug: "contratto-tempo-determinato",

    seoTitle: "Analisi contratto a tempo determinato – Clausole e tutele",
    seoDescription:
      "Carica il tuo contratto a tempo determinato e verifica periodo di prova, recesso, tutele e clausole critiche.",
    ogTitle: "Controllo contratto tempo determinato",
    ogDescription:
      "Analisi immediata del contratto a tempo determinato: rischi, clausole e tutele.",
    ogImage: "/og/contratto-tempo-determinato.png",

    h1: "Analisi contratto a tempo determinato",
    subtitle:
      "Carica il PDF e scopri subito periodo di prova, recesso, tutele e clausole potenzialmente scorrette.",
    ctaLabel: "Carica contratto tempo determinato",

    problemBlocks: [
      "Periodo di prova troppo lungo",
      "Mancanza di indicazione sull’inquadramento",
      "Orario e mansioni vaghi",
      "Recesso unilaterale non conforme",
      "Penali eccessive o non valide",
    ],

    checks: [
      "Periodo di prova",
      "Inquadramento e livello",
      "Durata e rinnovi",
      "Mansioni e orari",
      "Clausole disciplinari",
      "Recesso",
      "Tutela malattia",
      "Clausole vessatorie",
    ],

    examples: [
      "“Il periodo di prova indicato supera i limiti previsti dal CCNL.”",
      "“Mansioni definite in modo troppo generico e potenzialmente abusabile.”",
    ],

    faq: [
      {
        question: "Vale per tutti i CCNL?",
        answer:
          "Sì, l’analisi evidenzia incongruenze rispetto alle normative e ai contratti collettivi.",
      },
      {
        question: "Accetta foto del contratto?",
        answer: "Sì, PDF, JPG e PNG.",
      },
    ],

    related: ["contratto-tempo-indeterminato", "co-co-co"],
  },
  //Contratto a tempo indeterminato
  "contratto-tempo-indeterminato": {
    slug: "contratto-tempo-indeterminato",

    seoTitle: "Analisi contratto a tempo indeterminato – Tutele e clausole",
    seoDescription:
      "Carica il contratto a tempo indeterminato e controlla clausole critiche, mansioni, recesso e periodo di prova.",
    ogTitle: "Controllo contratto tempo indeterminato",
    ogDescription:
      "Analisi automatica del contratto a tempo indeterminato: tutele, clausole e rischi.",
    ogImage: "/og/contratto-tempo-indeterminato.png",

    h1: "Analisi contratto a tempo indeterminato",
    subtitle:
      "Verifica subito tutele, periodo di prova e possibili clausole penalizzanti.",
    ctaLabel: "Carica contratto tempo indeterminato",

    problemBlocks: [
      "Periodo di prova troppo lungo",
      "Inquadramento non chiaro",
      "Mansioni vaghe o troppo generiche",
      "Clausole disciplinari poco trasparenti",
      "Penali non conformi",
    ],

    checks: [
      "Periodo di prova",
      "Inquadramento",
      "Orario di lavoro",
      "Mansioni",
      "Clausole disciplinari",
      "Recesso",
      "Tutela ferie e malattia",
    ],

    examples: [
      "“Il periodo di prova dura più di quanto consentito.”",
      "“Le mansioni non sono definite in modo adeguato.”",
    ],

    faq: [
      {
        question: "Verificate anche i riferimenti al CCNL?",
        answer:
          "Sì, l’analisi segnala eventuali incongruenze con quanto previsto dal CCNL.",
      },
    ],

    related: ["contratto-tempo-determinato"],
  },
  //Contratto di collaborazione (co.co.co.)
  "co-co-co": {
    slug: "co-co-co",

    seoTitle: "Analisi contratto di collaborazione – Clausole e rischi",
    seoDescription:
      "Carica il tuo contratto co.co.co. e scopri rischi, compensi, recesso e obblighi del collaboratore.",
    ogTitle: "Controllo contratto collaborazione",
    ogDescription:
      "Analisi completa del contratto di collaborazione: compensi, durata, obblighi, rischi.",
    ogImage: "/og/co-co-co.png",

    h1: "Analisi contratto di collaborazione (co.co.co.)",
    subtitle:
      "Verifica subito compenso, durata, obiettivi, rischi e clausole critiche.",
    ctaLabel: "Carica contratto co.co.co.",

    problemBlocks: [
      "Compenso non definito chiaramente",
      "Durata troppo vaga",
      "Clausole di esclusiva non equilibrate",
      "Recesso non specificato",
      "Penali non conformi",
    ],

    checks: [
      "Compenso",
      "Durata",
      "Recesso",
      "Obblighi del collaboratore",
      "Obblighi del committente",
      "Clausole non conformi",
    ],

    examples: [
      "“La durata non è chiaramente indicata.”",
      "“La clausola di esclusiva è eccessivamente restrittiva.”",
    ],

    faq: [
      {
        question: "Vale anche per partite IVA?",
        answer:
          "Sì, puoi analizzare contratti di collaborazione anche con P.IVA.",
      },
    ],

    related: ["contratto-consulenza", "contratto-tempo-determinato"],
  },
  //Contratto di consulenza / progetto
  "contratto-consulenza": {
    slug: "contratto-consulenza",

    seoTitle: "Analisi contratto di consulenza – Clausole e rischi",
    seoDescription:
      "Carica il contratto di consulenza e verifica compensi, obiettivi, penali e condizioni.",
    ogTitle: "Controllo contratto di consulenza",
    ogDescription:
      "Analisi contratto consulenza: compensi, durata, responsabilità e rischi.",
    ogImage: "/og/contratto-consulenza.png",

    h1: "Analisi contratto di consulenza",
    subtitle:
      "Scopri subito rischi, clausole scorrette e punti critici del contratto di consulenza.",
    ctaLabel: "Carica contratto di consulenza",

    problemBlocks: [
      "Obiettivi non definiti",
      "Compenso poco chiaro",
      "Clausole di responsabilità eccessive",
      "Penali sproporzionate",
    ],

    checks: [
      "Compenso",
      "Durata e proroghe",
      "Responsabilità",
      "Proprietà intellettuale",
      "Penali",
      "Consegne",
    ],

    examples: [
      "“La responsabilità del consulente è definita in modo troppo esteso.”",
      "“Le penali non sono proporzionate al valore del progetto.”",
    ],

    faq: [
      {
        question: "Vale per freelance?",
        answer:
          "Sì, l’analisi è ottimizzata per freelance e professionisti autonomi.",
      },
    ],

    related: ["co-co-co"],
  },
  //Contratto di stage / tirocinio
  "contratto-stage": {
    slug: "contratto-stage",

    seoTitle: "Analisi contratto di stage – Rischi e tutele",
    seoDescription:
      "Carica il contratto di stage e scopri diritti, obblighi, orari, rimborsi e clausole irregolari.",
    ogTitle: "Controllo contratto di stage",
    ogDescription:
      "Analisi completa del contratto di stage: rimborso spese, orari, obblighi e rischi.",
    ogImage: "/og/contratto-stage.png",

    h1: "Analisi contratto di stage",
    subtitle:
      "Verifica subito se il tuo contratto di stage rispetta diritti, orari e condizioni previste.",
    ctaLabel: "Carica contratto di stage",

    problemBlocks: [
      "Orario non conforme",
      "Mancanza del rimborso spese",
      "Indennità non chiara",
      "Obblighi non coerenti con uno stage",
    ],

    checks: [
      "Orari",
      "Tutor aziendale",
      "Durata",
      "Rimborso spese",
      "Attività consentite",
      "Clausole irregolari",
    ],

    examples: [
      "“Il rimborso spese non è indicato.”",
      "“Orario superiore ai limiti previsti per gli stage.”",
    ],

    faq: [
      {
        question: "Vale anche per tirocini curriculari?",
        answer: "Sì, analizza qualsiasi tipo di tirocinio.",
      },
    ],

    related: ["contratto-tempo-determinato"],
  },
  //Clausola di non concorrenza
  "clausola-non-concorrenza": {
    slug: "clausola-non-concorrenza",

    seoTitle: "Analisi clausola di non concorrenza – Validità e rischi",
    seoDescription:
      "Carica il contratto con clausola di non concorrenza e verifica limiti, durata, compenso e rischi.",
    ogTitle: "Controllo clausola di non concorrenza",
    ogDescription:
      "Analisi immediata clausola di non concorrenza: limiti, durata e rischi.",
    ogImage: "/og/clausola-non-concorrenza.png",

    h1: "Analisi clausola di non concorrenza",
    subtitle:
      "Scopri se la clausola di non concorrenza è valida, equilibrata e conforme.",
    ctaLabel: "Carica contratto con clausola di non concorrenza",

    problemBlocks: [
      "Durata eccessiva",
      "Compenso insufficiente",
      "Ambito territoriale troppo ampio",
      "Limitazioni sproporzionate",
    ],

    checks: [
      "Durata",
      "Compenso",
      "Territorio",
      "Attività vietate",
      "Clausole irregolari",
    ],

    examples: [
      "“La clausola limita attività troppo ampie e indefinite.”",
      "“Il compenso previsto non è proporzionato alla limitazione.”",
    ],

    faq: [
      {
        question: "La clausola deve prevedere un compenso?",
        answer: "Sì, altrimenti non è valida.",
      },
    ],

    related: ["contratto-tempo-indeterminato"],
  },
  //Contratto di lavoro intermittente
  "contratto-intermittente": {
    slug: "contratto-intermittente",

    seoTitle: "Analisi contratto intermittente – Verifica clausole e rischi",
    seoDescription:
      "Carica il tuo contratto intermittente e verifica disponibilità, compensi, obblighi e rischi.",
    ogTitle: "Controllo contratto intermittente",
    ogDescription:
      "Analisi contratto intermittente: diritti, obblighi, compensi, rischi.",
    ogImage: "/og/contratto-intermittente.png",

    h1: "Analisi contratto lavoro intermittente",
    subtitle:
      "Scopri subito obblighi, disponibilità, compensi e rischi del contratto intermittente.",
    ctaLabel: "Carica contratto intermittente",

    problemBlocks: [
      "Disponibilità non definita",
      "Compenso poco chiaro",
      "Orari non indicati",
      "Penali sproporzionate",
    ],

    checks: [
      "Compenso",
      "Orari",
      "Disponibilità",
      "Obblighi lavoratore",
      "Clausole irregolari",
    ],

    examples: [
      "“Compenso definito in modo troppo generico.”",
      "“Clausole disciplinari non conformi.”",
    ],

    faq: [
      {
        question: "Vale anche per contratti intermittenti part-time?",
        answer: "Sì, analizziamo tutte le forme di lavoro intermittente.",
      },
    ],

    related: ["contratto-tempo-determinato"],
  },
  //Assicurazione auto (RC + accessorie)
  "assicurazione-auto": {
    slug: "assicurazione-auto",

    seoTitle:
      "Analisi assicurazione auto – Franchigie, esclusioni, rivalsa e massimali",
    seoDescription:
      "Carica la polizza auto e controlla franchigie, esclusioni, rivalsa, massimali e clausole che riducono (o negano) il risarcimento.",
    ogTitle: "Controllo assicurazione auto",
    ogDescription:
      "Analisi polizza auto: franchigie, esclusioni, rivalsa, massimali e clausole critiche.",
    ogImage: "/og/assicurazione-auto.png",

    h1: "Analisi assicurazione auto",
    subtitle:
      "Scopri subito cosa pagheresti davvero in caso di sinistro: franchigie, esclusioni e regole di liquidazione.",
    ctaLabel: "Carica assicurazione auto",

    problemBlocks: [
      "Franchigie elevate non messe in evidenza",
      "Esclusioni generiche che bloccano il risarcimento",
      "Rivalsa/limitazioni che spostano il costo su di te",
      "Massimali e garanzie accessorie poco chiari",
    ],

    checks: [
      "Franchigie e scoperti",
      "Esclusioni principali",
      "Massimali",
      "Rivalsa / rinuncia alla rivalsa",
      "Garanzie accessorie (kasko, eventi, furto)",
      "Recesso e tempi di rimborso",
    ],

    examples: [
      "“Franchigia alta: il primo importo del danno lo paghi tu.”",
      "“Esclusioni vaghe: risarcimento ridotto o negato.”",
    ],

    faq: [
      {
        question: "Posso caricare condizioni generali + particolari?",
        answer:
          "Sì: spesso le clausole più importanti sono nelle condizioni generali o negli allegati/appendici.",
      },
    ],

    related: ["assicurazione-casa", "assicurazione-vita"],
  },
  //Assicurazione casa
  "assicurazione-casa": {
    slug: "assicurazione-casa",

    seoTitle:
      "Analisi assicurazione casa – Esclusioni, massimali, scoperti e rimborsi",
    seoDescription:
      "Carica la polizza casa e verifica esclusioni, massimali, scoperti, tempi di rimborso e condizioni che possono limitare l’indennizzo.",
    ogTitle: "Controllo assicurazione casa",
    ogDescription:
      "Analisi polizza casa: esclusioni, massimali, scoperti, tempi di rimborso e clausole critiche.",
    ogImage: "/og/assicurazione-casa.png",

    h1: "Analisi assicurazione casa",
    subtitle:
      "Capisci subito cosa copre davvero la polizza e cosa rischi di pagare tu tra esclusioni, scoperti e limiti.",
    ctaLabel: "Carica assicurazione casa",

    problemBlocks: [
      "Esclusioni che emergono solo dopo il sinistro",
      "Massimali insufficienti per danni importanti",
      "Scoperti/franchigie che riducono molto il rimborso",
      "Tempi e documenti richiesti poco chiari",
    ],

    checks: [
      "Eventi coperti (incendio, acqua, eventi naturali)",
      "Esclusioni e limitazioni",
      "Massimali per sezione",
      "Scoperti e franchigie",
      "Documentazione richiesta",
      "Recesso e rimborso premio",
    ],

    examples: [
      "“Copertura presente, ma con massimale troppo basso per il danno reale.”",
      "“Esclusioni negli allegati che limitano l’indennizzo.”",
    ],

    faq: [
      {
        question: "Vale anche per polizze abbinate a mutuo?",
        answer:
          "Sì: molte polizze casa sono collegate al mutuo e hanno vincoli specifici su recesso e beneficiario.",
      },
    ],

    related: ["assicurazione-auto", "assicurazione-vita"],
  },
  //Assicurazione sanitaria
  "assicurazione-sanitaria": {
    slug: "assicurazione-sanitaria",

    seoTitle:
      "Analisi assicurazione sanitaria – Esclusioni, massimali e carenze",
    seoDescription:
      "Carica la tua polizza sanitaria e verifica esclusioni, carenze, massimali e condizioni di rimborso.",
    ogTitle: "Controllo contratto assicurazione sanitaria",
    ogDescription:
      "Analisi polizza sanitaria: carenze, esclusioni, massimali, condizioni di rimborso.",
    ogImage: "/og/assicurazione-sanitaria.png",

    h1: "Analisi assicurazione sanitaria",
    subtitle:
      "Scopri davvero cosa copre la tua assicurazione sanitaria e quali limiti prevede.",
    ctaLabel: "Carica contratto assicurazione sanitaria",

    problemBlocks: [
      "Carenze non indicate chiaramente",
      "Esclusioni per patologie pregresse",
      "Massimali insufficienti per interventi complessi",
      "Condizioni di rimborso poco trasparenti",
    ],

    checks: [
      "Periodo di carenza",
      "Esclusioni patologie pregresse",
      "Massimali interventi",
      "Copertura visite ed esami",
      "Condizioni di rimborso",
      "Franchigie",
    ],

    examples: [
      "“Periodo di carenza molto lungo non evidenziato chiaramente.”",
      "“Esclusa la copertura per patologie già diagnosticate.”",
    ],

    faq: [
      {
        question: "Vale per polizze individuali e aziendali?",
        answer:
          "Sì, puoi analizzare sia polizze personali che sanitarie collettive.",
      },
    ],

    related: ["assicurazione-vita", "assicurazione-casa"],
  },
  //Polizza vita / infortuni
  "assicurazione-vita": {
    slug: "assicurazione-vita",

    seoTitle: "Analisi polizza vita – Clausole, beneficiari e esclusioni",
    seoDescription:
      "Carica la tua polizza vita/infortuni e controlla beneficiari, esclusioni, condizioni e massimali.",
    ogTitle: "Controllo polizza vita e infortuni",
    ogDescription:
      "Analisi contratto polizza vita: condizioni, esclusioni, beneficiari, massimali.",
    ogImage: "/og/assicurazione-vita.png",

    h1: "Analisi polizza vita e infortuni",
    subtitle:
      "Verifica subito cosa prevede davvero la tua polizza vita e infortuni.",
    ctaLabel: "Carica polizza vita/infortuni",

    problemBlocks: [
      "Esclusioni non evidenziate",
      "Condizioni per l’indennizzo poco chiare",
      "Beneficiari non definiti correttamente",
      "Limitazioni importanti su eventi coperti",
    ],

    checks: [
      "Beneficiari",
      "Esclusioni",
      "Massimali",
      "Condizioni per indennizzo",
      "Durata",
      "Clausole aggiuntive",
    ],

    examples: [
      "“Beneficiari non aggiornati o non specificati.”",
      "“Esclusioni per determinate attività a rischio non evidenziate.”",
    ],

    faq: [
      {
        question: "Valido anche per polizze abbinate a mutuo?",
        answer:
          "Sì, puoi caricare anche polizze vita collegate a finanziamenti o mutui.",
      },
    ],

    related: ["assicurazione-auto", "assicurazione-sanitaria"],
  },
  //Contratto telefonia mobile
  "contratto-telefonia-mobile": {
    slug: "contratto-telefonia-mobile",

    seoTitle: "Analisi contratto telefonia mobile – Costi nascosti e vincoli",
    seoDescription:
      "Carica il contratto telefonia mobile e verifica costi nascosti, vincoli, rateizzazione e penali.",
    ogTitle: "Controllo contratto telefonia mobile",
    ogDescription:
      "Analisi contratto mobile: vincoli, costi nascosti, penali e condizioni.",
    ogImage: "/og/contratto-telefonia-mobile.png",

    h1: "Analisi contratto telefonia mobile",
    subtitle:
      "Scopri subito se il tuo contratto di telefonia mobile nasconde costi extra o vincoli pesanti.",
    ctaLabel: "Carica contratto telefonia mobile",

    problemBlocks: [
      "Vincoli di durata non chiari",
      "Penali di recesso elevate",
      "Costi aggiuntivi poco trasparenti",
      "Rateizzazione smartphone poco comprensibile",
    ],

    checks: [
      "Durata e vincoli",
      "Penali recesso",
      "Costi attivazione",
      "Rateizzazione dispositivi",
      "Condizioni traffico dati",
      "Clausole promozionali",
    ],

    examples: [
      "“Penale di recesso non chiaramente indicata nel contratto.”",
      "“Costi di attivazione nascosti nelle note.”",
    ],

    faq: [
      {
        question: "Valido anche per offerte convergenti (mobile + fibra)?",
        answer:
          "Sì, puoi caricare qualsiasi contratto di telefonia o pacchetto combinato.",
      },
    ],

    related: ["contratto-fibra", "contratto-pay-tv"],
  },
  //Contratto fibra / internet
  "contratto-fibra": {
    slug: "contratto-fibra",

    seoTitle: "Analisi contratto fibra e internet – Verifica costi e vincoli",
    seoDescription:
      "Carica il contratto di fibra/internet e scopri subito vincoli, costi nascosti, penali e condizioni.",
    ogTitle: "Controllo contratto fibra e internet",
    ogDescription:
      "Analisi contratto internet: vincoli, penali, costi nascosti e condizioni.",
    ogImage: "/og/contratto-fibra.png",

    h1: "Analisi contratto fibra e internet",
    subtitle:
      "Verifica in pochi secondi se il contratto internet nasconde vincoli o costi inattesi.",
    ctaLabel: "Carica contratto fibra/internet",

    problemBlocks: [
      "Vincolo di 24 mesi non evidenziato",
      "Penali di recesso alte",
      "Costi modem e attivazione poco chiari",
      "Condizioni di velocità non trasparenti",
    ],

    checks: [
      "Durata del vincolo",
      "Penali recesso",
      "Costo modem",
      "Costo attivazione",
      "Velocità minima garantita",
      "Clausole promozionali",
    ],

    examples: [
      "“Vincolo di permanenza lungo nascosto nelle condizioni generali.”",
      "“Costi modem non chiaramente separati dal canone.”",
    ],

    faq: [
      {
        question: "Funziona anche con contratti business?",
        answer:
          "Sì, puoi analizzare sia contratti residenziali che business per internet e fibra.",
      },
    ],

    related: ["contratto-telefonia-mobile", "contratto-pay-tv"],
  },
  //Contratto pay TV / streaming
  "contratto-pay-tv": {
    slug: "contratto-pay-tv",

    seoTitle: "Analisi contratto pay TV e streaming – Verifica costi e vincoli",
    seoDescription:
      "Carica il contratto pay TV/streaming e controlla costi, rinnovi automatici e penali di recesso.",
    ogTitle: "Controllo contratto pay TV e streaming",
    ogDescription:
      "Analisi contratto pay TV: costi, rinnovi, penali e condizioni nascoste.",
    ogImage: "/og/contratto-pay-tv.png",

    h1: "Analisi contratto pay TV e streaming",
    subtitle:
      "Scopri se il tuo abbonamento pay TV o streaming nasconde rinnovi automatici o costi poco chiari.",
    ctaLabel: "Carica contratto pay TV/streaming",

    problemBlocks: [
      "Rinnovo automatico non evidente",
      "Penali per disdetta non chiare",
      "Costi nascosti nelle opzioni aggiuntive",
      "Durata minima poco trasparente",
    ],

    checks: [
      "Durata abbonamento",
      "Rinnovo automatico",
      "Penali disdetta",
      "Pacchetti aggiuntivi",
      "Costi nascosti",
    ],

    examples: [
      "“Rinnovo automatico non indicato in modo chiaro nel contratto.”",
      "“Penali di disdetta sproporzionate rispetto al canone.”",
    ],

    faq: [
      {
        question: "Valido anche per servizi solo online?",
        answer:
          "Sì, analizziamo sia contratti tradizionali che termini di servizi digitali.",
      },
    ],

    related: ["contratto-fibra", "contratto-saas"],
  },
  //Contratto SaaS / abbonamenti digitali
  "contratto-saas": {
    slug: "contratto-saas",

    seoTitle:
      "Analisi contratto SaaS – Termini di servizio e abbonamenti digitali",
    seoDescription:
      "Carica il contratto o i termini di servizio di un SaaS e verifica rinnovi, responsabilità e clausole critiche.",
    ogTitle: "Controllo contratto SaaS e abbonamenti digitali",
    ogDescription:
      "Analisi contratti SaaS: rinnovi automatici, responsabilità, limitazioni, penali.",
    ogImage: "/og/contratto-saas.png",

    h1: "Analisi contratto SaaS e abbonamenti digitali",
    subtitle:
      "Verifica i termini di un software in abbonamento: rinnovi, limiti di responsabilità, penali e privacy.",
    ctaLabel: "Carica contratto SaaS",

    problemBlocks: [
      "Rinnovo automatico nascosto",
      "Limitazioni forti di responsabilità",
      "Penali per superamento limiti d’uso",
      "Condizioni di cancellazione poco chiare",
    ],

    checks: [
      "Rinnovo automatico",
      "Limiti di utilizzo",
      "Responsabilità fornitore",
      "Penali",
      "Disdetta",
      "Privacy e dati",
    ],

    examples: [
      "“Limitazione di responsabilità molto ampia a favore del fornitore.”",
      "“Rinnovo automatico con cancellazione complessa non evidenziata chiaramente.”",
    ],

    faq: [
      {
        question: "Valido per termini di servizio in inglese?",
        answer:
          "Sì, puoi caricare anche contratti e termini in altre lingue. L’analisi sarà comunque in italiano.",
      },
    ],

    related: ["contratto-pay-tv"],
  },
  //Contratto energia elettrica
  "contratto-energia-elettrica": {
    slug: "contratto-energia-elettrica",

    seoTitle: "Analisi contratto energia elettrica – Costi e clausole",
    seoDescription:
      "Carica il contratto energia elettrica e verifica costi nascosti, condizioni, penali e cambi tariffari.",
    ogTitle: "Controllo contratto energia elettrica",
    ogDescription:
      "Analisi contratto luce: tariffe, penali, costi nascosti, condizioni di recesso.",
    ogImage: "/og/contratto-energia-elettrica.png",

    h1: "Analisi contratto energia elettrica",
    subtitle:
      "Scopri subito costi nascosti, penali e condizioni di recesso del tuo contratto luce.",
    ctaLabel: "Carica contratto energia elettrica",

    problemBlocks: [
      "Tariffe non chiaramente indicate",
      "Penali recesso nascoste",
      "Condizioni promozionali poco chiare",
      "Costi aggiuntivi non spiegati",
    ],

    checks: [
      "Tariffa (fissa/variabile)",
      "Penali recesso",
      "Costi attivazione",
      "Fatturazione",
      "Condizioni promozionali",
    ],

    examples: [
      "“Penali per recesso anticipate nascoste nelle note.”",
      "“Costo attivazione non chiaramente indicato.”",
    ],

    faq: [
      {
        question: "Vale anche per contratti business?",
        answer:
          "Sì, puoi caricare contratti energia sia domestici che aziendali.",
      },
    ],

    related: ["contratto-gas", "contratto-acqua"],
  },
  //Contratto gas
  "contratto-gas": {
    slug: "contratto-gas",

    seoTitle: "Analisi contratto gas – Costi, tariffe e vincoli",
    seoDescription:
      "Carica il tuo contratto del gas e verifica tariffe, costi nascosti, penali e clausole critiche.",
    ogTitle: "Controllo contratto gas",
    ogDescription:
      "Analisi contratto gas: tariffe, penali, costi nascosti e condizioni.",
    ogImage: "/og/contratto-gas.png",

    h1: "Analisi contratto gas",
    subtitle:
      "Controlla subito costi, vincoli e tariffe del tuo contratto gas.",
    ctaLabel: "Carica contratto gas",

    problemBlocks: [
      "Tariffe promozionali poco chiare",
      "Penali per recesso non evidenziate",
      "Costi aggiuntivi nascosti",
      "Condizioni di fatturazione poco trasparenti",
    ],

    checks: [
      "Tariffe",
      "Penali recesso",
      "Costi attivazione",
      "Fatturazione",
      "Durata contratto",
      "Clausole irregolari",
    ],

    examples: [
      "“Tariffa variabile non spiegata chiaramente.”",
      "“Penale di recesso non esplicitata nelle condizioni principali.”",
    ],

    faq: [
      {
        question: "Accettate contratti multi-fornitore?",
        answer:
          "Sì, analizziamo qualsiasi contratto gas, anche parte di pacchetti combinati.",
      },
    ],

    related: ["contratto-energia-elettrica"],
  },
  //Contratto acqua / condominio
  "contratto-acqua": {
    slug: "contratto-acqua",

    seoTitle: "Analisi contratto acqua – Costi e condizioni",
    seoDescription:
      "Carica il contratto acqua/condominio e verifica costi, ripartizione, responsabilità e clausole poco chiare.",
    ogTitle: "Controllo contratto acqua e condominio",
    ogDescription:
      "Analisi contratto acqua/condominio: costi, responsabilità, clausole e rischi.",
    ogImage: "/og/contratto-acqua.png",

    h1: "Analisi contratto acqua / condominio",
    subtitle:
      "Verifica subito costi, spese e responsabilità del tuo contratto acqua o condominiale.",
    ctaLabel: "Carica contratto acqua/condominio",

    problemBlocks: [
      "Spese condominiali poco chiare",
      "Ripartizione costi non corretta",
      "Responsabilità danni non definite",
      "Clausole irregolari nelle parti comuni",
    ],

    checks: [
      "Ripartizione costi",
      "Responsabilità danni",
      "Spese condominiali",
      "Clausole parti comuni",
      "Obblighi gestore",
    ],

    examples: [
      "“Ripartizione costi non conforme al regolamento condominiale.”",
      "“Responsabilità danni non chiaramente attribuita.”",
    ],

    faq: [
      {
        question: "Vale per regolamenti condominiali?",
        answer: "Sì, puoi caricare anche regolamenti o delibere condominiali.",
      },
    ],

    related: ["contratto-energia-elettrica", "contratto-gas"],
  },
  //Contratto di mutuo
  "contratto-mutuo": {
    slug: "contratto-mutuo",

    seoTitle: "Analisi contratto di mutuo – Clausole, tassi, rischi",
    seoDescription:
      "Carica il tuo contratto di mutuo e verifica tassi, coperture, condizioni, penali e clausole critiche.",
    ogTitle: "Controllo contratto di mutuo",
    ogDescription:
      "Analisi contratto mutuo: tassi, penali, condizioni, rischi nascosti.",
    ogImage: "/og/contratto-mutuo.png",

    h1: "Analisi contratto di mutuo",
    subtitle:
      "Scopri subito condizioni, tassi, rischi e clausole del tuo mutuo prima della firma.",
    ctaLabel: "Carica contratto di mutuo",

    problemBlocks: [
      "Tassi poco chiari",
      "Penali per estinzione anticipata",
      "Coperture assicurative obbligatorie non chiare",
      "Clausole che aumentano il costo totale",
    ],

    checks: [
      "Tasso (fisso/variabile)",
      "TAEG e TAN",
      "Penali",
      "Coperture obbligatorie",
      "Durata",
      "Rischi variabilità",
      "Clausole irregolari",
    ],

    examples: [
      "“Penali di estinzione anticipata nascoste nel dettaglio condizioni.”",
      "“Copertura assicurativa imposta senza alternativa.”",
    ],

    faq: [
      {
        question: "Accettate mutui prima casa e surroghe?",
        answer:
          "Sì, puoi analizzare qualsiasi contratto di mutuo, inclusi surroghe e rinegoziazioni.",
      },
    ],

    related: ["contratto-prestito-personale", "assicurazione-vita"],
  },
  //Prestito personale
  "contratto-prestito-personale": {
    slug: "contratto-prestito-personale",

    seoTitle:
      "Analisi contratto prestito personale – Costi, tassi e condizioni",
    seoDescription:
      "Carica il contratto di prestito personale e verifica TAEG, tassi, costi nascosti e clausole.",
    ogTitle: "Controllo contratto prestito personale",
    ogDescription:
      "Analisi prestito personale: costi, tassi, penali, condizioni nascoste.",
    ogImage: "/og/contratto-prestito-personale.png",

    h1: "Analisi contratto prestito personale",
    subtitle:
      "Verifica subito tassi, costi e condizioni del tuo prestito personale.",
    ctaLabel: "Carica contratto prestito personale",

    problemBlocks: [
      "TAEG alto non evidenziato",
      "Costi aggiuntivi nascosti",
      "Coperture assicurative opzionali imposte",
      "Penali non chiare",
    ],

    checks: [
      "TAN/TAEG",
      "Costi aggiuntivi",
      "Assicurazioni collegate",
      "Penali estinzione",
      "Durata",
      "Clausole irregolari",
    ],

    examples: [
      "“TAEG più alto rispetto ai tassi dichiarati nella pubblicità.”",
      "“Assicurazione aggiunta senza esplicita accettazione.”",
    ],

    faq: [
      {
        question: "Accettate prestiti con cessione del quinto?",
        answer: "Sì, analizziamo anche contratti di cessione del quinto.",
      },
    ],

    related: ["contratto-mutuo"],
  },
  //Carta di credito
  "carta-di-credito": {
    slug: "carta-di-credito",

    seoTitle:
      "Analisi carta di credito – Canone, commissioni, blocchi e addebiti",
    seoDescription:
      "Carica il contratto della carta di credito e controlla canone, commissioni, addebiti contestabili, blocchi e clausole che generano costi nascosti.",
    ogTitle: "Controllo carta di credito",
    ogDescription:
      "Analisi carta di credito: canone, commissioni, addebiti, blocchi e clausole critiche.",
    ogImage: "/og/carta-di-credito.png",

    h1: "Analisi carta di credito",
    subtitle:
      "Scopri subito costi reali, regole di rimborso e clausole che possono bloccarti pagamenti o aumentare le spese.",
    ctaLabel: "Carica contratto carta di credito",

    problemBlocks: [
      "Canone e commissioni non chiarissimi",
      "Addebiti e servizi accessori attivati automaticamente",
      "Limiti e blocchi operativi improvvisi",
      "Contestazioni e rimborsi con tempi/opacità",
    ],

    checks: [
      "Canone e commissioni",
      "Interessi e mora",
      "Spese prelievo/anticipo contanti",
      "Servizi opzionali e assicurazioni",
      "Blocchi/limitazioni d’uso",
      "Contestazioni e chargeback",
    ],

    examples: [
      "“Commissioni su prelievo e anticipo contanti poco evidenziate.”",
      "“Servizi aggiuntivi attivi di default con costo mensile.”",
    ],

    faq: [
      {
        question: "Posso caricare condizioni generali + foglio informativo?",
        answer:
          "Sì: più documenti hai, più è facile individuare costi e vincoli non visibili nel contratto principale.",
      },
    ],

    related: ["carta-revolving", "conto-corrente"],
  },
  //Conto corrente
  "conto-corrente": {
    slug: "conto-corrente",

    seoTitle:
      "Analisi conto corrente – Canone, costi nascosti e servizi opzionali",
    seoDescription:
      "Carica il contratto del conto corrente e controlla canone, commissioni, servizi opzionali attivati di default, scoperti, fidi e modifiche unilaterali.",
    ogTitle: "Controllo conto corrente",
    ogDescription:
      "Analisi conto corrente: canone, commissioni, servizi opzionali, scoperto e clausole critiche.",
    ogImage: "/og/conto-corrente.png",

    h1: "Analisi conto corrente",
    subtitle:
      "Verifica subito canone, commissioni e servizi extra: spesso i costi veri stanno nelle condizioni e nelle “note”.",
    ctaLabel: "Carica contratto conto corrente",

    problemBlocks: [
      "Commissioni e costi ricorrenti poco evidenti",
      "Servizi opzionali attivati automaticamente",
      "Spese su bonifici, carte, prelievi e alert",
      "Modifiche unilaterali con comunicazioni “invisibili”",
    ],

    checks: [
      "Canone e spese fisse",
      "Commissioni operazioni (bonifici/prelievi)",
      "Carte collegate e relativi costi",
      "Servizi opzionali/assicurazioni",
      "Scoperto/fido e interessi",
      "Modifiche unilaterali e recesso",
    ],

    examples: [
      "“Servizi premium attivi di default con addebito mensile.”",
      "“Commissioni per operazioni comuni non evidenziate chiaramente.”",
    ],

    faq: [
      {
        question: "Vale anche per conti online e conti aziendali?",
        answer:
          "Sì: possiamo analizzare conti personali, online e business, perché le clausole critiche sono spesso simili.",
      },
    ],

    related: ["carta-di-credito", "carta-revolving"],
  },
  //Carta revolving
  "carta-revolving": {
    slug: "carta-revolving",

    seoTitle:
      "Analisi carta revolving – Interessi reali, TAEG e rischio debito",
    seoDescription:
      "Carica il contratto della carta revolving e verifica TAEG, interessi reali, costi ricorrenti, rimborsi minimi e rischio sovraindebitamento.",
    ogTitle: "Controllo carta revolving",
    ogDescription:
      "Analisi carta revolving: TAEG, interessi, rate minime, costi ricorrenti e clausole critiche.",
    ogImage: "/og/carta-revolving.png",

    h1: "Analisi carta revolving",
    subtitle:
      "Capisci subito quanto ti costa davvero: interessi, rate minime e regole che possono farti restare in debito a lungo.",
    ctaLabel: "Carica contratto carta revolving",

    problemBlocks: [
      "TAEG e interessi reali difficili da stimare",
      "Rate minime che allungano il debito",
      "Costi ricorrenti (commissioni, assicurazioni, servizi)",
      "Penali, mora e ricalcoli poco trasparenti",
    ],

    checks: [
      "TAEG (costo totale)",
      "Interessi e modalità di calcolo",
      "Rata minima e piano di rimborso",
      "Commissioni/quote/servizi",
      "Penali e mora",
      "Modifiche unilaterali",
    ],

    examples: [
      "“Rata minima bassa: il debito si riduce lentissimo.”",
      "“Spese ricorrenti che aumentano il costo totale oltre il previsto.”",
    ],

    faq: [
      {
        question: "È diversa da una carta di credito normale?",
        answer:
          "Sì: la revolving ruota su credito rateizzato con interessi. La differenza vera è nel costo totale e nella durata del debito.",
      },
    ],

    related: ["carta-di-credito", "conto-corrente"],
  },
  //Contratto palestra
  "contratto-palestra": {
    slug: "contratto-palestra",

    seoTitle: "Analisi contratto palestra – Abbonamenti, penali e rinnovi",
    seoDescription:
      "Carica il contratto della palestra e verifica costi, rinnovi automatici, penali e clausole nascoste.",
    ogTitle: "Controllo contratto palestra",
    ogDescription:
      "Analisi contratto palestra: abbonamenti, rinnovi automatici, penali e costi nascosti.",
    ogImage: "/og/contratto-palestra.png",

    h1: "Analisi contratto palestra",
    subtitle:
      "Scopri subito rinnovi automatici, penali e costi nascosti del tuo abbonamento in palestra.",
    ctaLabel: "Carica contratto palestra",

    problemBlocks: [
      "Rinnovo automatico non evidenziato",
      "Penali elevate per disdetta anticipata",
      "Costi di iscrizione poco chiari",
      "Clausole per sospensione o malattia non trasparenti",
    ],

    checks: [
      "Durata abbonamento",
      "Rinnovo automatico",
      "Penali disdetta",
      "Costi iscrizione",
      "Sospensione per malattia",
      "Clausole irregolari",
    ],

    examples: [
      "“Il contratto prevede rinnovo automatico senza evidenza chiara al momento della firma.”",
      "“Penale di disdetta sproporzionata rispetto al valore dell’abbonamento.”",
    ],

    faq: [
      {
        question: "Vale anche per centri sportivi e piscine?",
        answer:
          "Sì, puoi caricare contratti di palestre, centri sportivi, piscine e strutture simili.",
      },
    ],

    related: ["abbonamento-trasporti"],
  },
  //Noleggio auto lungo termine
  "contratto-noleggio-auto-lungo-termine": {
    slug: "contratto-noleggio-auto-lungo-termine",

    seoTitle:
      "Analisi contratto noleggio auto lungo termine – Costi e clausole",
    seoDescription:
      "Carica il contratto di noleggio auto a lungo termine e verifica costi, penali, chilometraggio e clausole critiche.",
    ogTitle: "Controllo contratto noleggio auto lungo termine",
    ogDescription:
      "Analisi contratto noleggio lungo termine: costi, penali, chilometraggio, condizioni.",
    ogImage: "/og/contratto-noleggio-auto-lungo-termine.png",

    h1: "Analisi contratto noleggio auto lungo termine",
    subtitle:
      "Verifica in pochi secondi costi, penali, chilometraggio e condizioni del tuo contratto di noleggio lungo termine.",
    ctaLabel: "Carica contratto noleggio auto lungo termine",

    problemBlocks: [
      "Penali elevate per supero chilometri",
      "Costi nascosti per danni o usura",
      "Condizioni di recesso poco chiare",
      "Servizi inclusi/non inclusi non evidenziati",
    ],

    checks: [
      "Durata e chilometraggio",
      "Penali supero km",
      "Copertura danni",
      "Manutenzione inclusa",
      "Recesso anticipato",
      "Clausole irregolari",
    ],

    examples: [
      "“Penale per supero chilometrico molto alta e non evidenziata chiaramente.”",
      "“Costi per danni minori non definiti in modo trasparente.”",
    ],

    faq: [
      {
        question: "Vale anche per noleggio veicoli commerciali?",
        answer:
          "Sì, puoi analizzare contratti di noleggio lungo termine per auto e veicoli commerciali.",
      },
    ],

    related: ["contratto-palestra", "contratto-energia-elettrica"],
  },
  //Contratto coworking / ufficio flessibile
  "contratto-coworking": {
    slug: "contratto-coworking",

    seoTitle: "Analisi contratto coworking – Costi, servizi inclusi e clausole",
    seoDescription:
      "Carica il contratto di coworking e verifica costi, servizi inclusi, durata, recesso e clausole particolari.",
    ogTitle: "Controllo contratto coworking",
    ogDescription:
      "Analisi contratto coworking: costi, servizi inclusi, clausole, recesso.",
    ogImage: "/og/contratto-coworking.png",

    h1: "Analisi contratto coworking",
    subtitle:
      "Scopri cosa include davvero il tuo contratto di coworking e quali clausole possono crearti problemi.",
    ctaLabel: "Carica contratto coworking",

    problemBlocks: [
      "Servizi inclusi/non inclusi poco chiari",
      "Regole di utilizzo degli spazi non definite",
      "Penali per danni o uso improprio",
      "Condizioni di disdetta poco trasparenti",
    ],

    checks: [
      "Durata contratto",
      "Servizi inclusi (wifi, pulizie, sale riunioni)",
      "Regolamento spazi comuni",
      "Penali danni",
      "Recesso",
      "Clausole irregolari",
    ],

    examples: [
      "“Regole per l’utilizzo delle sale riunioni non chiaramente definite.”",
      "“Penale generica per danni senza criteri oggettivi.”",
    ],

    faq: [
      {
        question: "Vale anche per uffici serviti e business center?",
        answer:
          "Sì, puoi caricare contratti di coworking, uffici serviti e spazi flessibili.",
      },
    ],

    related: ["contratto-affitto-commerciale"],
  },
  //Abbonamento trasporti (treni, bus, metro)
  "abbonamento-trasporti": {
    slug: "abbonamento-trasporti",

    seoTitle: "Analisi abbonamento trasporti – Condizioni, rimborsi e clausole",
    seoDescription:
      "Carica condizioni e regolamento del tuo abbonamento trasporti e verifica rimborsi, sospensioni, vincoli e clausole.",
    ogTitle: "Controllo abbonamento trasporti",
    ogDescription:
      "Analisi abbonamento trasporti: condizioni, rimborsi, sospensioni, clausole.",
    ogImage: "/og/abbonamento-trasporti.png",

    h1: "Analisi abbonamento trasporti",
    subtitle:
      "Scopri subito diritti, rimborsi e condizioni del tuo abbonamento a treni, bus o metro.",
    ctaLabel: "Carica condizioni abbonamento trasporti",

    problemBlocks: [
      "Regole di rimborso non chiare",
      "Condizioni di sospensione poco trasparenti",
      "Limitazioni di utilizzo nascoste",
      "Clausole penalizzanti in caso di smarrimento",
    ],

    checks: [
      "Condizioni di rimborso",
      "Sospensione abbonamento",
      "Limitazioni utilizzo",
      "Regole smarrimento tessera",
      "Durata e rinnovo",
    ],

    examples: [
      "“Rimborso parziale non spiegato in modo chiaro.”",
      "“Limitazioni di utilizzo in alcune fasce orarie poco evidenti.”",
    ],

    faq: [
      {
        question: "Vale anche per abbonamenti integrati (treno+bus)?",
        answer:
          "Sì, puoi caricare regolamenti e condizioni di qualsiasi abbonamento trasporti.",
      },
    ],

    related: ["contratto-palestra"],
  },
  //Termini e condizioni e-commerce / acquisti online
  "contratto-ecommerce": {
    slug: "contratto-ecommerce",

    seoTitle:
      "Analisi termini e condizioni e-commerce – Resi, rimborsi e garanzie",
    seoDescription:
      "Carica i termini e condizioni di un e-commerce e verifica politiche di reso, rimborso, garanzie e clausole critiche.",
    ogTitle: "Controllo termini e condizioni e-commerce",
    ogDescription:
      "Analisi termini e condizioni acquisti online: resi, rimborsi, garanzie, clausole rischiose.",
    ogImage: "/og/contratto-ecommerce.png",

    h1: "Analisi termini e condizioni e-commerce",
    subtitle:
      "Verifica diritti di reso, rimborsi, garanzie e clausole poco chiare nei termini di un e-commerce.",
    ctaLabel: "Carica termini e condizioni e-commerce",

    problemBlocks: [
      "Politiche di reso poco chiare o limitanti",
      "Condizioni di rimborso non corrette",
      "Limitazioni di garanzia non evidenziate",
      "Clausole che limitano i tuoi diritti da consumatore",
    ],

    checks: [
      "Diritto di recesso",
      "Tempi e modalità di reso",
      "Rimborsi",
      "Garanzie",
      "Limitazioni di responsabilità",
      "Clausole vessatorie",
    ],

    examples: [
      "“Diritto di recesso inferiore a quanto previsto dal Codice del Consumo.”",
      "“Limitazioni di garanzia non indicate chiaramente prima dell’acquisto.”",
    ],

    faq: [
      {
        question: "Vale sia per negozi italiani che esteri?",
        answer:
          "Sì, puoi caricare termini e condizioni di siti italiani ed esteri. L’analisi sarà comunque in italiano.",
      },
    ],

    related: ["contratto-saas", "carta-di-credito"],
  },
  // fine ultima landing (contratto-ecommerce)
};

export const landingSlugs = Object.keys(LANDINGS);

export function getLandingBySlug(slug: string): LandingConfig | undefined {
  return LANDINGS[slug];
}
