// src/lib/editorialConfig.ts
// EditorialKind: "index" is used for editorial listing/index pages (e.g., Argomenti/Clausole/Rischi) that are not a single clause/risk/hub.
export type EditorialKind =
  | "index" // pagine indice/listing (es: Argomenti/Clausole/Rischi)
  | "hub" // pagina indice / cluster
  | "guida" // guida pratica / overview
  | "clausola" // singola clausola
  | "rischio"; // rischio concreto

export type EditorialPage = {
  slug: string; // es: "clausole/recesso"
  kind: EditorialKind;

  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };

  hero: {
    h1: string;
    subtitle?: string;
  };

  related?: {
    editorial?: string[]; // slugs editoriali, es: "rischi/penali-sproporzionate"
    landings?: string[]; // slugs landing tool, es: "contratto-affitto"
  };

  // stessa filosofia “a blocchi” delle landing: semplice, leggibile, scalabile
  blocks: Array<
    | { type: "intro"; text: string }
    | { type: "bullets"; title?: string; items: string[] }
    | {
        type: "examples";
        title?: string;
        items: { title: string; text: string }[];
      }
    | {
        type: "cards";
        title?: string;
        items: { title: string; text: string; href: string }[];
      }
    | { type: "checklist"; title?: string; items: string[] }
    | {
        type: "cta";
        variant: "soft" | "mid" | "strong";
        title: string;
        text?: string;
        buttonLabel: string;
        buttonHref: string; // es: "/upload" o "/affitto" o la landing tool
      }
    | { type: "faq"; items: { q: string; a: string }[] }
  >;
};

export const EDITORIAL_PAGES: EditorialPage[] = [

  /*
  {
    slug: "debug/all-blocks",
    kind: "clausola",
    seo: {
      title: "Debug UI – Tutti i blocchi editoriali | ContrattiChiari",
      description:
        "Pagina tecnica di anteprima per visualizzare tutti i blocchi editoriali disponibili nel template.",
    },
    hero: {
      h1: "Tutti i blocchi editoriali",
      subtitle:
        "Questa pagina serve solo a visualizzare e rifinire tutti i componenti disponibili.",
    },

    related: {
      editorial: [
        "contratti/affitto",
        "clausole/recesso",
        "rischi/penali-sproporzionate",
      ],
      landings: ["contratto-affitto"],
    },

    blocks: [
      {
        type: "intro",
        text: "Questo è il blocco introduttivo. Serve per dare contesto immediato, senza box, con testo continuo. È pensato per spiegazioni iniziali, definizioni o inquadramento del problema.",
      },

      {
        type: "bullets",
        title: "Elenco puntato (bullets)",
        items: [
          "Primo punto importante da evidenziare",
          "Secondo punto critico o informativo",
          "Terzo punto con dettaglio rilevante",
          "Quarto punto che l’utente deve ricordare",
        ],
      },

      {
        type: "examples",
        title: "Esempi concreti",
        items: [
          {
            title: "Esempio 1",
            text: "Un esempio pratico che mostra come una clausola può essere scritta in modo ambiguo.",
          },
          {
            title: "Esempio 2",
            text: "Un secondo esempio che evidenzia un rischio reale per chi firma senza controllare.",
          },
          {
            title: "Esempio 3",
            text: "Un caso tipico che porta a contenziosi o problemi successivi.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Checklist di verifica",
        items: [
          "Il testo è chiaro e comprensibile?",
          "Sono indicati tempi e modalità precise?",
          "Ci sono penali o costi nascosti?",
          "È specificato cosa succede in caso di problemi?",
          "Sono citati allegati o documenti esterni?",
        ],
      },

      {
        type: "cta",
        variant: "soft",
        title: "CTA soft (non invasiva)",
        text: "Usata quando vuoi suggerire l’azione senza forzare troppo la conversione.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },

      {
        type: "cta",
        variant: "mid",
        title: "CTA intermedia",
        text: "Questa CTA ha più peso visivo ed è utile a metà pagina.",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },

      {
        type: "cta",
        variant: "strong",
        title: "CTA forte (conversione)",
        text: "Questa è la CTA principale: va usata nei punti decisivi della pagina.",
        buttonLabel: "Analizza ora il contratto",
        buttonHref: "/upload",
      },

      {
        type: "faq",
        items: [
          {
            q: "Questa pagina verrà indicizzata?",
            a: "No. È una pagina tecnica di debug. Può essere rimossa o esclusa dalla sitemap.",
          },
          {
            q: "Serve anche per mobile?",
            a: "Sì. È pensata proprio per verificare il comportamento dei blocchi su mobile e desktop.",
          },
          {
            q: "Quando va eliminata?",
            a: "Quando tutti i componenti sono validati visivamente e funzionalmente.",
          },
        ],
      },
    ],
  },
  */

  // CLUSTER AFFITTI
  {
    slug: "clausole/recesso",
    kind: "clausola",
    seo: {
      title:
        "Clausola di recesso nell’affitto: cosa significa e cosa controllare",
      description:
        "Guida rapida al recesso nell’affitto: chi può recedere, preavviso, modalità e rischi quando la clausola è sbilanciata.",
    },
    hero: {
      h1: "Clausola di recesso",
      subtitle: "Cos’è, quando è critica e cosa controllare prima di firmare.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/disdetta-affitto",
        "clausole/durata-affitto",
        "rischi/penali-sproporzionate",
        "rischi/disdetta-non-valida",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "La clausola di recesso disciplina come e quando una parte può uscire dal contratto. Diventa rischiosa quando è sbilanciata (recesso “facile” per uno, difficile per l’altro), quando non è chiara su tempi e forma, o quando introduce penali eccessive.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Recesso previsto solo per una delle parti",
          "Preavviso non chiaro o troppo rigido",
          "Modalità di comunicazione “impossibili” (solo PEC/raccomandata, indirizzi specifici)",
          "Penali alte o calcolate in modo vago",
          "Obblighi dopo il recesso poco chiari (pagamenti, restituzioni, spese)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (30 secondi)",
        items: [
          "Chi può recedere? Entrambe le parti o solo una?",
          "Con quanto preavviso e da quando decorre?",
          "Con quale forma (PEC, raccomandata, email)?",
          "Ci sono penali? Sono proporzionate e calcolate chiaramente?",
          "Cosa succede dopo il recesso (spese, consegna immobile, conguagli)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi verificare come è scritto nel tuo contratto?",
        text: "Caricalo e controlliamo se la clausola è sbilanciata o rischiosa.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Recesso e disdetta sono la stessa cosa?",
            a: "Non sempre. La disdetta spesso riguarda la comunicazione di fine rapporto a scadenza; il recesso è un’uscita anticipata o “prevista” dal contratto. Conta cosa prevede il testo.",
          },
          {
            q: "Se non c’è una clausola di recesso?",
            a: "Dipende dal tipo di contratto e da quanto previsto nel testo e dalla disciplina applicabile. In pratica: va verificato caso per caso.",
          },
        ],
      },
    ],
  },

  {
    slug: "rischi/penali-sproporzionate",
    kind: "rischio",
    seo: {
      title:
        "Penali sproporzionate nell’affitto: quando sono un campanello d’allarme",
      description:
        "Come riconoscere penali eccessive nel contratto di affitto, perché sono rischiose e cosa controllare prima di firmare.",
    },
    hero: {
      h1: "Penali sproporzionate",
      subtitle: "Quando una penale diventa un problema (e cosa controllare).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/recesso",
        "clausole/penali-mora-ritardi",
        "clausole/rinnovo-automatico-affitto",
        "rischi/disdetta-non-valida",
      ],
      landings: ["contratto-affitto", "contratto-affitto-commerciale"],
    },
    blocks: [
      {
        type: "intro",
        text: "Una penale serve a coprire un danno prevedibile. Diventa un rischio quando è troppo alta, poco chiara, cumulabile con altre voci, o scatta anche per violazioni minime. Nell’affitto spesso si presenta su ritardi, recesso, disdetta e regole dell’immobile.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Penale fissa alta",
            text: "Somma elevata anche per ritardi minimi o violazioni marginali.",
          },
          {
            title: "Penale cumulativa",
            text: "Penale + interessi + spese + trattenute: il costo reale esplode.",
          },
          {
            title: "Penale vaga",
            text: "Importo o calcolo non chiaro (“a discrezione”, “in misura congrua”).",
          },
        ],
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "Quando scatta la penale? È legata a un evento specifico e verificabile?",
          "Quanto vale e come si calcola (importo, percentuale, giorni)?",
          "È cumulabile con interessi, spese, risarcimenti?",
          "C’è una soglia minima (es. giorni di ritardo) o scatta subito?",
          "È prevista anche per errori “formali” (comunicazioni, modalità, termini)?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se la penale nel tuo contratto è eccessiva?",
        text: "Caricalo: evidenziamo penali, cumuli e punti dove il testo è troppo vago.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "contratti/affitto",
    kind: "hub",
    seo: {
      title: "Contratto di affitto: cosa controllare prima di firmare",
      description:
        "Guida pratica al contratto di affitto: clausole critiche, rischi comuni e cosa verificare prima di firmare o rinnovare.",
    },
    hero: {
      h1: "Contratto di affitto",
      subtitle:
        "Clausole, rischi e punti critici da controllare prima di firmare.",
    },
    related: {
      editorial: [
        // CLAUSOLE CHIAVE
        "clausole/recesso",
        "clausole/disdetta-affitto",
        "clausole/rinnovo-automatico-affitto",
        "clausole/deposito-cauzionale",
        "clausole/spese-condominiali",
        "clausole/manutenzione-riparazioni",
        "clausole/restituzione-immobile",
        "clausole/clausola-risolutiva-espressa-affitto",

        // RISCHI CONCRETI
        "rischi/disdetta-non-valida",
        "rischi/rinnovo-automatico-nascosto",
        "rischi/cauzione-non-restituita",
        "rischi/aumenti-spese-non-previste",
        "rischi/spese-non-dovute",
        "rischi/penali-sproporzionate",
        "rischi/risoluzione-automatica-per-inadempimento-minimo",
      ],
      landings: [
        "contratto-affitto",
        "contratto-affitto-studenti",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il contratto di affitto è spesso più complesso di quanto sembri. Molti problemi non nascono da ciò che è evidente, ma da clausole scritte in modo vago o sbilanciato: disdetta, rinnovi automatici, cauzione, spese e penali.",
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre",
        items: [
          "Durata del contratto e rinnovo automatico",
          "Disdetta: tempi, modalità e preavviso",
          "Deposito cauzionale e criteri di restituzione",
          "Spese condominiali, utenze e conguagli",
          "Penali, mora e clausole risolutive",
          "Manutenzioni e responsabilità",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Perché lo vedo?",
        text: "Questa pagina evidenzia i punti che nei contratti creano più problemi (scadenze, disdetta, spese, penali, fine rapporto). Trasparenza totale su cosa controlliamo.",
        buttonLabel: "Scopri come funziona",
        buttonHref: "/perche-lo-vedo",
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il tuo contratto di affitto è scritto bene?",
        text: "Caricalo e ti segnaliamo subito clausole sbilanciate, rischi nascosti e punti critici prima che diventino problemi.",
        buttonLabel: "Analizza il mio contratto di affitto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "affitto/rischi",
    kind: "hub",
    seo: {
      title:
        "Rischi nel contratto di affitto: i problemi più comuni e come riconoscerli",
      description:
        "I rischi più frequenti nei contratti di affitto: rinnovi nascosti, disdetta non valida, cauzione trattenuta, penali e spese opache. Vai dritto ai punti critici.",
    },
    hero: {
      h1: "Rischi nell’affitto",
      subtitle:
        "I problemi più comuni nel contratto di affitto (e dove si nascondono nel testo).",
    },
    related: {
      editorial: [
        "contratti/affitto",

        // Rischi principali (già presenti nel cluster)
        "rischi/disdetta-non-valida",
        "rischi/rinnovo-automatico-nascosto",
        "rischi/cauzione-non-restituita",
        "rischi/ritardi-restituzione-cauzione",
        "rischi/aumenti-spese-non-previste",
        "rischi/spese-non-dovute",
        "rischi/penali-sproporzionate",
        "rischi/forfait-spese-ingannevole",
        "rischi/ispezioni-invasive",
        "rischi/decadenza-per-ospitalita",
        "rischi/uscita-anticipata-penali",
        "rischi/risoluzione-automatica-per-inadempimento-minimo",
        "rischi/contestazioni-stato-immobile",
        "rischi/clausole-nascoste-negli-allegati",
        "rischi/ritardo-chiusura-contratto",
      ],
      landings: [
        "contratto-affitto",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di affitto i problemi più costosi non sono quasi mai “in prima pagina”: si nascondono in formule vaghe, scadenze poco visibili e clausole scritte per lasciare margine di contestazione. Qui trovi i rischi più frequenti e le pagine guida per riconoscerli in pochi minuti.",
      },
      {
        type: "bullets",
        title:
          "Rischi che ti legano al contratto (scadenze, rinnovi, disdetta)",
        items: [
          "Rinnovo automatico nascosto: scadenze poco visibili e disdetta complicata",
          "Disdetta non valida: canale/indirizzo/tempi sbagliati e il contratto si rinnova",
          "Uscita anticipata con penali: recesso/risoluzione scritti per farti pagare troppo",
          "Risoluzione “automatica” per inadempimenti minimi: clausole troppo aggressive",
        ],
      },
      {
        type: "bullets",
        title: "Rischi economici (cauzione, spese, penali)",
        items: [
          "Cauzione non restituita: criteri vaghi e trattenute facili",
          "Ritardi nella restituzione cauzione: tempi indefiniti e conguagli opachi",
          "Spese non dovute: formule generiche (“tutte le spese”) e riparti sbilanciati",
          "Aumenti di spese non previste: conguagli senza documenti e voci non definite",
          "Forfait spese ingannevole: “spese incluse” ma poi arrivano conguagli o aumenti",
          "Penali sproporzionate: importi alti, cumuli e condizioni poco chiare",
        ],
      },
      {
        type: "bullets",
        title:
          "Rischi di conflitto a fine rapporto (chiavi, verbali, contestazioni)",
        items: [
          "Ritardo nella chiusura del contratto: consegni le chiavi ma resti “aperto”",
          "Contestazioni sullo stato dell’immobile: senza verbali e criteri è facile trattenere",
          "Clausole nascoste negli allegati: regole vincolanti fuori dal testo principale",
        ],
      },
      {
        type: "bullets",
        title: "Rischi sulla tua libertà e privacy (accessi, ospiti, regole)",
        items: [
          "Ispezioni invasive: accessi troppo liberi o senza preavviso",
          "Decadenza per ospitalità: regole sugli ospiti scritte in modo rigido o ambiguo",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce (2 minuti): dove guardare nel contratto",
        items: [
          "Scadenze e rinnovi: sono evidenti e con termini di disdetta chiari?",
          "Disdetta/recesso: canali ammessi e indirizzi “speciali” sono realistici?",
          "Cauzione: tempi di restituzione e criteri di trattenuta sono scritti bene?",
          "Spese: elenco, criteri e documenti per conguagli sono previsti?",
          "Penali: quando scattano e come si calcolano (senza cumuli nascosti)?",
          "Fine affitto: consegna chiavi e verbale di uscita chiudono davvero il canone?",
          "Allegati/regolamenti: sono consegnati e elencati chiaramente?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Perché lo vedo?",
        text: "Questa pagina evidenzia i punti che nei contratti creano più problemi (scadenze, disdetta, spese, penali, fine rapporto). Trasparenza totale su cosa controlliamo.",
        buttonLabel: "Scopri come funziona",
        buttonHref: "/perche-lo-vedo",
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi sapere quali rischi ci sono davvero nel tuo contratto?",
        text: "Caricalo: ti evidenziamo le clausole che ti legano, i costi nascosti e i punti dove il testo è troppo vago.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Qual è il rischio più comune negli affitti?",
            a: "Di solito è legato a scadenze e comunicazioni: rinnovi taciti e disdette inviate nel modo o nei tempi sbagliati.",
          },
          {
            q: "Se il testo è vago su cauzione e spese, è un problema?",
            a: "Sì: quando mancano tempi, criteri e documenti, aumentano contestazioni e trattenute perché il contratto lascia troppo margine di interpretazione.",
          },
          {
            q: "Gli allegati contano davvero?",
            a: "Sì: regolamenti e tabelle possono introdurre divieti, penali e criteri di spesa. Se sono richiamati in modo generico, è un segnale di rischio.",
          },
        ],
      },
    ],
  },

  {
    slug: "affitto/clausole",
    kind: "hub",
    seo: {
      title:
        "Clausole del contratto di affitto: le più importanti da controllare prima di firmare",
      description:
        "Le clausole chiave dell’affitto spiegate in modo semplice: recesso, disdetta, rinnovo, cauzione, spese, penali, manutenzione, consegna chiavi e verbali. Vai dritto ai punti critici.",
    },
    hero: {
      h1: "Clausole nell’affitto",
      subtitle:
        "Le clausole più importanti del contratto di affitto (e cosa controllare per evitare problemi).",
    },
    related: {
      editorial: [
        "contratti/affitto",

        // Clausole chiave (già presenti nel cluster)
        "clausole/durata-affitto",
        "clausole/rinnovo-automatico-affitto",
        "clausole/disdetta-affitto",
        "clausole/recesso",
        "clausole/risoluzione-anticipata-affitto",

        "clausole/deposito-cauzionale",
        "clausole/restituzione-immobile",
        "clausole/verbale-uscita-stato-immobile",

        "clausole/spese-condominiali",
        "clausole/utenze-conguagli",
        "clausole/spese-forfettarie-affitto",
        "clausole/adeguamento-istat-canone",

        "clausole/penali-mora-ritardi",
        "clausole/clausola-risolutiva-espressa-affitto",

        "clausole/sublocazione-ospitalita",
        "clausole/animali-domestici-affitto",
        "clausole/accesso-locatore-ispezioni",
        "clausole/regolamento-condominiale-allegati",
        "clausole/consegna-chiavi-fine-affitto",
      ],
      landings: [
        "contratto-affitto",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Le clausole “critiche” non sono quelle più lunghe: sono quelle scritte in modo vago o sbilanciato. Qui trovi le clausole fondamentali dell’affitto, con guide rapide per capire cosa significano e cosa controllare prima di firmare (o prima di disdire).",
      },

      {
        type: "bullets",
        title: "Clausole che decidono durata e uscita",
        items: [
          "Durata: scadenza reale, proroghe e quando decorre il preavviso",
          "Rinnovo automatico: quando scatta e come evitarlo con la disdetta",
          "Disdetta: tempi, modalità (PEC/raccomandata) e indirizzi corretti",
          "Recesso: chi può recedere e con quali condizioni",
          "Risoluzione anticipata: uscire prima della scadenza senza penali inutili",
        ],
      },

      {
        type: "bullets",
        title: "Clausole economiche (cauzione, spese, aumenti)",
        items: [
          "Deposito cauzionale: importo, tempi e criteri di restituzione",
          "Spese condominiali: ripartizione, conguagli e documentazione",
          "Utenze e conguagli: letture contatori, prove e criteri di riparto",
          "Spese forfettarie: quando “spese incluse” non significa costo bloccato",
          "Adeguamento ISTAT: aumenti del canone e formule poco trasparenti",
        ],
      },

      {
        type: "bullets",
        title: "Clausole di sanzione (penali, mora, risoluzioni)",
        items: [
          "Penali e mora: quando scattano e come si calcolano (senza cumuli)",
          "Clausola risolutiva espressa: rischi di risoluzione “rapida” per eventi minimi",
        ],
      },

      {
        type: "bullets",
        title: "Clausole su regole, privacy e vincoli esterni",
        items: [
          "Sublocazione e ospitalità: divieti e definizioni troppo rigide",
          "Animali domestici: permessi, limiti e penali",
          "Accesso del locatore/ispezioni: preavviso, motivi e limiti",
          "Regolamento e allegati: dove si nascondono vincoli e costi",
        ],
      },

      {
        type: "bullets",
        title: "Clausole di fine rapporto (uscita, chiavi, verbali)",
        items: [
          "Restituzione immobile: criteri, pulizia, normale usura e contestazioni",
          "Verbale di uscita: perché è decisivo per cauzione e contestazioni",
          "Consegna chiavi: quando finisce davvero il canone e come provare la chiusura",
        ],
      },

      {
        type: "checklist",
        title: "Checklist (90 secondi): cosa verificare su ogni clausola",
        items: [
          "È scritta in modo chiaro (eventi, tempi, importi, modalità) o usa formule vaghe?",
          "È bilanciata tra le parti o favorisce solo una parte?",
          "Richiede modalità pratiche (PEC/raccomandata/indirizzi) realistiche?",
          "Prevede penali/costi: sono proporzionati e con calcolo chiaro?",
          "Rimanda ad allegati/regolamenti: sono elencati e consegnati?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Perché lo vedo?",
        text: "Questa pagina evidenzia i punti che nei contratti creano più problemi (scadenze, disdetta, spese, penali, fine rapporto). Trasparenza totale su cosa controlliamo.",
        buttonLabel: "Scopri come funziona",
        buttonHref: "/perche-lo-vedo",
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi sapere quali clausole sono davvero critiche nel tuo contratto?",
        text: "Caricalo: individuiamo subito le clausole sbilanciate, quelle vaghe e i punti che creano costi o vincoli non evidenti.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },

      {
        type: "faq",
        items: [
          {
            q: "Devo leggere tutte le clausole?",
            a: "No: conviene concentrarsi su quelle che decidono uscita, costi e fine rapporto (disdetta/recesso, cauzione, spese, penali, consegna chiavi e verbali).",
          },
          {
            q: "Quali clausole causano più problemi in pratica?",
            a: "Quelle su disdetta e rinnovo (errori di tempi/modi), quelle su cauzione (tempi e criteri vaghi) e quelle su spese/penali (calcoli poco trasparenti).",
          },
          {
            q: "Se una clausola rimanda al regolamento condominiale, cosa devo fare?",
            a: "Verificare che l’allegato sia consegnato e che non introduca divieti o costi aggiuntivi rispetto al testo principale.",
          },
        ],
      },
    ],
  },

  {
    slug: "affitto/guida-rapida",
    kind: "hub",
    seo: {
      title:
        "Contratto di affitto: guida rapida (check in 3 minuti prima di firmare)",
      description:
        "Guida rapidissima al contratto di affitto: cosa controllare in 3 minuti (durata, rinnovo, disdetta, recesso, cauzione, spese, penali, consegna chiavi). Checklist pronta.",
    },
    hero: {
      h1: "Guida rapida al contratto di affitto",
      subtitle:
        "3 minuti. 10 controlli. Evita le sorprese più comuni prima di firmare (o prima di disdire).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "affitto/clausole",
        "affitto/rischi",

        // scorciatoie più utili (clausole)
        "clausole/durata-affitto",
        "clausole/rinnovo-automatico-affitto",
        "clausole/disdetta-affitto",
        "clausole/recesso",
        "clausole/deposito-cauzionale",
        "clausole/spese-condominiali",
        "clausole/utenze-conguagli",
        "clausole/penali-mora-ritardi",
        "clausole/consegna-chiavi-fine-affitto",
        "clausole/verbale-uscita-stato-immobile",

        // rischi più frequenti
        "rischi/disdetta-non-valida",
        "rischi/rinnovo-automatico-nascosto",
        "rischi/cauzione-non-restituita",
        "rischi/ritardi-restituzione-cauzione",
        "rischi/spese-non-dovute",
        "rischi/penali-sproporzionate",
        "rischi/ritardo-chiusura-contratto",
      ],
      landings: [
        "contratto-affitto",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Se non hai tempo di leggere tutto: usa questa guida. È pensata per mobile e per farti trovare in fretta le clausole che generano più problemi (rinnovo, disdetta, cauzione, spese, penali, chiusura).",
      },

      {
        type: "checklist",
        title: "Checklist (3 minuti): 10 cose da controllare",
        items: [
          "1) Durata: quando scade davvero (data precisa) e cosa succede a scadenza",
          "2) Rinnovo automatico: scatta da solo? con quali condizioni?",
          "3) Disdetta: quanto preavviso e da quando decorre (giorno/mese)?",
          "4) Disdetta: con che modalità (PEC/raccomandata/email) e a quale indirizzo esatto?",
          "5) Recesso: è previsto? per chi? ci sono condizioni o penali?",
          "6) Canone: importo, scadenza pagamento e cosa succede in caso di ritardo",
          "7) Cauzione: quando si restituisce e con quali criteri (prove, verbali, tempi)",
          "8) Spese: quali sono incluse/escluse, come funzionano conguagli e documentazione",
          "9) Penali/risoluzione: quando scattano e se sono proporzionate (no formule vaghe)",
          "10) Fine rapporto: consegna chiavi + verbale di uscita = chiusura reale del canone?",
        ],
      },

      {
        type: "bullets",
        title: "Se vedi una di queste frasi, fermati un attimo",
        items: [
          "“A discrezione del locatore” (criteri non chiari)",
          "“Entro un termine congruo” (tempi indefiniti)",
          "“Qualsiasi inadempimento” (troppo ampio, rischio risoluzione)",
          "“Tutte le spese a carico del conduttore” (costi potenzialmente illimitati)",
          "“Solo PEC / solo raccomandata / solo un indirizzo specifico” (rischio disdetta non valida)",
        ],
      },

      {
        type: "examples",
        title: "3 errori tipici (e il danno concreto)",
        items: [
          {
            title: "Disdetta inviata nel modo sbagliato",
            text: "Se il contratto richiede PEC/raccomandata e usi una mail, rischi che la disdetta non valga e scatti il rinnovo.",
          },
          {
            title: "Cauzione senza tempi e criteri",
            text: "Senza scadenze e prove per le trattenute, la restituzione può slittare o diventare contestabile.",
          },
          {
            title: "Consegna chiavi “non chiude”",
            text: "Se non è chiaro quando finisce il canone e manca un verbale, possono nascere richieste di canoni extra o contestazioni.",
          },
        ],
      },

      {
        type: "cta",
        variant: "soft",
        title: "Perché lo vedo?",
        text: "Questa pagina evidenzia i punti che nei contratti creano più problemi (scadenze, disdetta, spese, penali, fine rapporto). Trasparenza totale su cosa controlliamo.",
        buttonLabel: "Scopri come funziona",
        buttonHref: "/perche-lo-vedo",
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi la versione “zero dubbi” sul tuo contratto?",
        text: "Caricalo: segnaliamo subito scadenze, disdetta/recesso, costi nascosti, penali e cosa serve per chiudere davvero a fine affitto.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },

      {
        type: "faq",
        items: [
          {
            q: "Questa guida sostituisce la lettura completa del contratto?",
            a: "No: ti aiuta a trovare subito le clausole che creano più problemi. Se trovi formule vaghe o sbilanciate, vale la pena approfondire.",
          },
          {
            q: "Qual è il controllo più importante di tutti?",
            a: "Disdetta + rinnovo: tempi e modalità. È l’errore che porta più spesso a restare vincolati (o a pagare oltre il previsto).",
          },
          {
            q: "Cosa devo avere in mano alla fine del contratto?",
            a: "Prova consegna chiavi + verbale di uscita firmato (se possibile) + chiarezza su fine canone e restituzione cauzione.",
          },
        ],
      },
    ],
  },

  {
    slug: "perche-lo-vedo",
    kind: "hub",
    seo: {
      title: "Perché lo vedo? Come funziona ContrattoChiaro (in 30 secondi)",
      description:
        "Spieghiamo perché vedi queste guide e cosa controlliamo nei contratti: clausole critiche, rischi pratici, scadenze e costi nascosti. Trasparenza totale.",
    },
    hero: {
      h1: "Perché lo vedo?",
      subtitle:
        "In 30 secondi: cosa guardiamo nei contratti e perché queste pagine esistono.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "affitto/guida-rapida",
        "affitto/clausole",
        "affitto/rischi",
      ],
      landings: [
        "contratto-affitto",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Queste guide esistono perché nei contratti i problemi nascono da dettagli pratici: scadenze poco visibili, modalità rigide (PEC/raccomandata), penali vaghe, spese non definite, fine rapporto ambigua. Qui ti aiutiamo a riconoscerli in fretta.",
      },

      {
        type: "bullets",
        title: "Cosa controlliamo (sempre)",
        items: [
          "Scadenze: durata, rinnovo automatico, finestre di disdetta",
          "Modalità: canali ammessi (PEC/raccomandata/email) e destinatari corretti",
          "Costi: spese, conguagli, utenze, penali e cumuli (penale + interessi + spese)",
          "Fine rapporto: consegna chiavi, verbali, contestazioni e cauzione",
          "Formulazioni vaghe: “a discrezione”, “termine congruo”, “qualsiasi inadempimento”",
        ],
      },

      {
        type: "examples",
        title: "Esempi di “rischio pratico” (non teoria)",
        items: [
          {
            title: "Disdetta valida solo via PEC",
            text: "Se usi una mail, rischi che la disdetta non valga e il contratto si rinnovi.",
          },
          {
            title: "Spese “tutte a carico dell’inquilino”",
            text: "Senza elenco e criteri, possono comparire voci non previste e conguagli contestabili.",
          },
          {
            title: "Cauzione senza tempi",
            text: "Senza scadenze e prove per le trattenute, la restituzione può slittare.",
          },
        ],
      },

      {
        type: "checklist",
        title: "Come usare il sito (modo più veloce)",
        items: [
          "1) Se hai un dubbio specifico → apri una pagina “Clausola” o “Rischio”",
          "2) Se vuoi una panoramica → usa la “Guida rapida”",
          "3) Se vuoi risposta sul tuo contratto → caricalo e analizziamo il testo reale",
        ],
      },

      {
        type: "cta",
        variant: "mid",
        title: "Vuoi controllare il tuo contratto, non un esempio generico?",
        text: "Caricalo: individuiamo le clausole critiche e ti spieghiamo dove nasce il rischio nel tuo testo.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },

      {
        type: "faq",
        items: [
          {
            q: "È consulenza legale?",
            a: "No: è un supporto pratico di lettura e comprensione del testo. Se emergono punti critici, puoi decidere se approfondire con un professionista.",
          },
          {
            q: "Perché avete pagine separate per “clausole” e “rischi”?",
            a: "Perché una clausola è “dove guardare nel contratto”, il rischio è “cosa può succedere nella pratica” se è scritta male o troppo vaga.",
          },
          {
            q: "Perché insistete su disdetta e rinnovi?",
            a: "Perché sono i punti che più spesso causano vincoli involontari (rinnovi automatici) o pagamenti oltre il previsto.",
          },
        ],
      },
    ],
  },

  {
    slug: "clausole/rinnovo-automatico-affitto",
    kind: "clausola",
    seo: {
      title:
        "Rinnovo automatico nel contratto di affitto: come funziona e cosa controllare",
      description:
        "Guida rapida al rinnovo automatico nell’affitto: durata, scadenze, disdetta, rinnovi ‘taciti’ e clausole poco chiare.",
    },
    hero: {
      h1: "Rinnovo automatico (affitto)",
      subtitle: "Scadenze, disdetta e rischi dei rinnovi ‘taciti’.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/recesso",
        "rischi/rinnovo-automatico-nascosto",
        "rischi/disdetta-non-valida",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di affitto il rinnovo può essere previsto in automatico (anche ‘tacitamente’). Il rischio è non accorgersi delle scadenze, dei termini di disdetta o di clausole che rendono difficile uscire dal contratto.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Scadenze non evidenti o disperse nel testo",
          "Disdetta con tempi molto anticipati o modalità rigide",
          "Rinnovi automatici senza spiegazione chiara",
          "Penali o costi legati alla disdetta",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "Qual è la durata e quando scade?",
          "Quali sono i termini di disdetta (quando e come)?",
          "Il rinnovo è automatico? Con quali condizioni?",
          "Ci sono penali o costi in caso di uscita?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire quando puoi uscire dal contratto?",
        text: "Caricalo e ti evidenziamo scadenze, disdetta e clausole critiche.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Rinnovo automatico e ‘tacito rinnovo’ sono la stessa cosa?",
            a: "Spesso sì nella pratica: indica che il contratto prosegue se nessuno comunica la disdetta nei tempi previsti.",
          },
          {
            q: "Se sbaglio i tempi di disdetta cosa succede?",
            a: "Dipende dal testo: può scattare il rinnovo o può rendere più difficile recedere. Per questo conviene verificare con precisione scadenze e modalità.",
          },
        ],
      },
    ],
  },

  {
    slug: "rischi/rinnovo-automatico-nascosto",
    kind: "rischio",
    seo: {
      title: "Rinnovo automatico nascosto nell’affitto: come riconoscerlo",
      description:
        "Come riconoscere un rinnovo automatico ‘nascosto’: scadenze poco chiare, disdetta complessa e clausole che ti legano al contratto.",
    },
    hero: {
      h1: "Rinnovo automatico nascosto",
      subtitle:
        "Scadenze e disdetta: il rischio è ‘rimanere dentro’ senza accorgersene.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/rinnovo-automatico-affitto",
        "rischi/disdetta-non-valida",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "Alcuni contratti rendono il rinnovo automatico difficile da individuare: scadenze poco visibili, termini di disdetta troppo anticipati o modalità rigide (solo PEC, solo raccomandata, indirizzi specifici). Il risultato è che il contratto si rinnova e diventa complicato uscire.",
      },
      {
        type: "bullets",
        title: "Segnali tipici",
        items: [
          "Scadenza indicata in modo poco chiaro",
          "Disdetta con tempi molto anticipati",
          "Modalità di disdetta rigide o ‘impossibili’",
          "Penali o costi legati alla disdetta",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare disdetta e rinnovo nel tuo contratto?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/durata-affitto",
    kind: "clausola",
    seo: {
      title:
        "Durata del contratto di affitto: cosa significa e cosa controllare",
      description:
        "Guida alla durata nell’affitto: scadenze, rinnovi, termini di disdetta e punti del testo che possono crearti vincoli.",
    },
    hero: {
      h1: "Durata del contratto di affitto",
      subtitle: "Scadenze, rinnovi e dove nascono i vincoli.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/rinnovo-automatico-affitto",
        "clausole/recesso",
        "rischi/rinnovo-automatico-nascosto",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "La durata è il cuore del contratto di affitto: definisce quanto resti vincolato e come (e quando) puoi uscire. Il rischio è avere scadenze poco chiare, rinnovi automatici non evidenti o termini di disdetta rigidi.",
      },
      {
        type: "bullets",
        title: "Dove nascono i problemi",
        items: [
          "Scadenza indicata in modo ambiguo",
          "Rinnovo automatico senza spiegazione chiara",
          "Disdetta con tempi troppo anticipati",
          "Penali o costi collegati alla disdetta",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "Quando scade esattamente il contratto?",
          "Cosa succede alla scadenza (rinnovo automatico, proroga, nuova firma)?",
          "Quali sono tempi e modalità di disdetta?",
          "Ci sono costi/penali se esci prima?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi verificare scadenze e disdetta nel tuo contratto?",
        text: "Caricalo: evidenziamo subito i punti critici e le scadenze importanti.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/disdetta-affitto",
    kind: "clausola",
    seo: {
      title: "Disdetta nell’affitto: tempi, modalità e clausole a rischio",
      description:
        "Come funziona la disdetta nell’affitto: quando inviarla, con che modalità (PEC/raccomandata) e cosa controllare nel testo.",
    },
    hero: {
      h1: "Disdetta (affitto)",
      subtitle:
        "Tempi, modalità e errori tipici che ti fanno perdere la scadenza.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/rinnovo-automatico-affitto",
        "clausole/recesso",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "Molte difficoltà nascono dalla disdetta: il contratto può richiedere modalità specifiche (PEC, raccomandata, indirizzi precisi) e tempi rigidi. Se sbagli forma o scadenza, rischi il rinnovo.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Solo una modalità ammessa (senza alternative)",
          "Tempi di disdetta molto anticipati",
          "Indirizzi/contatti ‘speciali’ difficili da usare",
          "Penali o costi in caso di disdetta",
        ],
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "Qual è il preavviso richiesto e da quando decorre?",
          "Quali canali sono ammessi (PEC, raccomandata, email)?",
          "A quale indirizzo deve essere inviata?",
          "Ci sono costi collegati alla disdetta?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi evitare un rinnovo ‘per errore’?",
        text: "Carica il contratto e controlliamo disdetta e rinnovo.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/adeguamento-istat-canone",
    kind: "clausola",
    seo: {
      title: "Adeguamento ISTAT del canone: come funziona e cosa controllare",
      description:
        "Guida all’adeguamento ISTAT e agli aumenti del canone: clausole, limiti, frequenza e formulazioni poco chiare.",
    },
    hero: {
      h1: "Adeguamento ISTAT del canone",
      subtitle: "Aumenti, frequenza e formule che possono pesare nel tempo.",
    },
    related: {
      editorial: ["contratti/affitto", "rischi/aumenti-imprevisti-canone"],
      landings: ["contratto-affitto"],
    },
    blocks: [
      {
        type: "intro",
        text: "Nel contratto di affitto può essere previsto l’adeguamento del canone (spesso legato all’ISTAT). Il rischio è una clausola scritta in modo troppo ampio o poco trasparente, che rende difficile prevedere aumenti e tempistiche.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Aumenti descritti in modo generico (‘a discrezione’)",
          "Frequenza non indicata o troppo frequente",
          "Mancanza di una formula chiara",
          "Aumenti cumulativi senza limiti",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "È scritto se l’adeguamento è previsto oppure no?",
          "Con quale indice e quale percentuale?",
          "Ogni quanto può essere applicato?",
          "Serve una comunicazione formale o scatta automaticamente?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se gli aumenti sono scritti in modo chiaro?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/aumenti-imprevisti-canone",
    kind: "rischio",
    seo: {
      title: "Aumenti imprevisti del canone: quando il contratto è rischioso",
      description:
        "Come riconoscere clausole che possono portare ad aumenti imprevisti del canone: formule vaghe, adeguamenti e costi aggiuntivi.",
    },
    hero: {
      h1: "Aumenti imprevisti del canone",
      subtitle:
        "Quando il testo rende difficile capire quanto pagherai davvero.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/adeguamento-istat-canone",
        "rischi/spese-non-dovute",
      ],
      landings: ["contratto-affitto"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un rischio tipico è la presenza di clausole che consentono aumenti poco trasparenti: adeguamenti descritti male, costi extra che ‘si sommano’ al canone, servizi non definiti e conguagli senza criteri.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Formula vaga",
            text: "Aumento previsto senza indice o percentuale chiara.",
          },
          {
            title: "Costi extra",
            text: "Voci aggiuntive che si sommano al canone senza dettaglio.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare se il costo totale è chiaro?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/manutenzione-riparazioni",
    kind: "clausola",
    seo: {
      title: "Manutenzione e riparazioni nell’affitto: chi paga cosa",
      description:
        "Guida pratica alle manutenzioni nell’affitto: riparazioni, responsabilità e clausole che possono trasferire costi non dovuti.",
    },
    hero: {
      h1: "Manutenzione e riparazioni",
      subtitle: "Responsabilità e costi: cosa deve stare nel contratto.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/spese-non-dovute",
        "clausole/spese-condominiali",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il contratto dovrebbe distinguere in modo chiaro chi si occupa di manutenzioni ordinarie e straordinarie. Il rischio è una formula generica che scarica sull’inquilino anche costi importanti o non prevedibili.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Obblighi di manutenzione troppo ampi per l’inquilino",
          "Nessuna distinzione tra ordinaria e straordinaria",
          "Riparazioni ‘a carico del conduttore’ senza limiti",
          "Spese per impianti/guasti importanti non chiarite",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "Sono distinti interventi ordinari e straordinari?",
          "Chi paga guasti importanti (impianti, struttura)?",
          "Serve autorizzazione prima di intervenire?",
          "Come si gestiscono urgenze e tempi di ripristino?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se ti stanno attribuendo costi ‘troppo larghi’?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/restituzione-immobile",
    kind: "clausola",
    seo: {
      title:
        "Restituzione immobile nell’affitto: verbale, stato e contestazioni",
      description:
        "Cosa controllare sulla restituzione dell’immobile: verbale di consegna/uscita, contestazioni, pulizia, danni e trattenute.",
    },
    hero: {
      h1: "Restituzione dell’immobile",
      subtitle:
        "Verbale, contestazioni e cosa succede alla fine del contratto.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/deposito-cauzionale",
        "rischi/cauzione-non-restituita",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "La fase di restituzione dell’immobile è un momento delicato: se non sono previsti criteri chiari (verbale, stato, tempi), aumentano contestazioni e trattenute sulla cauzione.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Nessun riferimento a verbale di uscita o controllo congiunto",
          "‘Stato dell’immobile’ definito in modo vago",
          "Pulizie/ripristini richiesti senza criteri",
          "Tempi indefiniti per chiudere la restituzione",
        ],
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "È previsto un verbale di consegna e uno di uscita?",
          "Cosa si intende per ‘normale usura’?",
          "Ci sono tempistiche per controlli e chiusura?",
          "È collegato alla restituzione della cauzione?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi prevenire contestazioni e trattenute?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/sublocazione-ospitalita",
    kind: "clausola",
    seo: {
      title: "Sublocazione e ospitalità nell’affitto: cosa dice il contratto",
      description:
        "Guida a sublocazione e ospitalità: divieti, autorizzazioni, limiti e rischi di clausole troppo rigide o ambigue.",
    },
    hero: {
      h1: "Sublocazione e ospitalità",
      subtitle: "Divieti, permessi e clausole che possono limitarti troppo.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/decadenza-per-ospitalita",
        "clausole/recesso",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il contratto può limitare sublocazione e ospitalità. Il rischio è una clausola troppo ampia che vieta anche situazioni comuni (ospiti temporanei) o che prevede decadenze/penali sproporzionate.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Divieto totale senza distinguere tra ospitalità e sublocazione",
          "Decadenza automatica per ‘ospiti’ non definiti",
          "Obblighi di comunicazione impossibili da rispettare",
          "Penali elevate in caso di violazione",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire cosa puoi fare davvero con ospiti e sublocazione?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/decadenza-per-ospitalita",
    kind: "rischio",
    seo: {
      title: "Decadenza per ospitalità: quando una clausola è troppo rigida",
      description:
        "Come riconoscere clausole che prevedono decadenza o risoluzione per ospitalità: formule vaghe, penali e obblighi eccessivi.",
    },
    hero: {
      h1: "Decadenza per ospitalità",
      subtitle: "Quando una regola sugli ospiti diventa un rischio concreto.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/sublocazione-ospitalita",
        "clausole/recesso",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Alcuni contratti includono clausole che fanno scattare risoluzione o penali se ospiti qualcuno. Il rischio è quando ‘ospite’ è definito in modo vago o quando la sanzione è automatica e sproporzionata.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Definizione vaga",
            text: "‘Ospitalità’ senza durata, limiti o criteri.",
          },
          {
            title: "Sanzione automatica",
            text: "Risoluzione immediata senza possibilità di chiarimento.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se questa clausola ti espone a rischi inutili?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/accesso-locatore-ispezioni",
    kind: "clausola",
    seo: {
      title:
        "Accesso del locatore e ispezioni: cosa è lecito e cosa controllare",
      description:
        "Guida alle clausole su accesso del locatore e ispezioni: preavviso, motivi, limiti e formulazioni invasive.",
    },
    hero: {
      h1: "Accesso del locatore e ispezioni",
      subtitle: "Preavviso, motivi e limiti: quando una clausola è invasiva.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/ispezioni-invasive",
        "clausole/restituzione-immobile",
      ],
      landings: ["contratto-affitto"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il contratto può prevedere accessi per controlli o interventi. Il rischio è una clausola che consente accessi frequenti, senza preavviso o con motivazioni generiche, riducendo la tua privacy e creando conflitti.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Accesso ‘in qualsiasi momento’",
          "Nessun preavviso minimo previsto",
          "Motivi troppo generici",
          "Penali se neghi l’accesso",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se la clausola è scritta in modo corretto?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/ispezioni-invasive",
    kind: "rischio",
    seo: {
      title:
        "Ispezioni invasive nell’affitto: quando il contratto è sbilanciato",
      description:
        "Come riconoscere clausole che permettono ispezioni invasive: accessi senza preavviso, motivi vaghi e penali.",
    },
    hero: {
      h1: "Ispezioni invasive",
      subtitle: "Accessi troppo liberi: quando la clausola è un problema.",
    },
    related: {
      editorial: ["contratti/affitto", "clausole/accesso-locatore-ispezioni"],
      landings: ["contratto-affitto"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è una clausola che permette al locatore di entrare spesso o senza preavviso. Questo può creare conflitti e pressioni, soprattutto se il testo prevede sanzioni o formule troppo generiche.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Accesso senza preavviso",
            text: "Il locatore può accedere ‘previo semplice avviso’ senza tempi minimi.",
          },
          {
            title: "Motivi vaghi",
            text: "Controlli ‘per verifica generale’ senza necessità specifica.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare come è scritta la clausola nel tuo contratto?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/deposito-cauzionale",
    kind: "clausola",
    seo: {
      title:
        "Deposito cauzionale nell’affitto: quanto, quando si restituisce e rischi",
      description:
        "Guida al deposito cauzionale nell’affitto: cosa controllare, tempi di restituzione, trattenute e clausole ambigue.",
    },
    hero: {
      h1: "Deposito cauzionale",
      subtitle:
        "Quanto può essere, come si gestisce e dove nascono le trattenute.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/cauzione-non-restituita",
        "clausole/restituzione-immobile",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il deposito cauzionale serve a coprire danni o inadempimenti. Il rischio nasce quando il contratto non spiega chiaramente tempi, criteri di trattenuta e modalità di restituzione, oppure quando ‘lega’ la cauzione a spese e conguagli generici.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Tempi di restituzione non indicati",
          "Trattenute definite in modo generico (‘a discrezione’)",
          "Cauzione collegata a spese non dettagliate",
          "Nessun riferimento a verbale/controllo di uscita",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "Quanto è la cauzione e quando viene versata?",
          "Quando e come deve essere restituita?",
          "In quali casi può essere trattenuta (criteri chiari)?",
          "È collegata a verbali/controlli di consegna e uscita?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title:
          "Vuoi capire se la cauzione è gestita in modo corretto nel tuo contratto?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/cauzione-non-restituita",
    kind: "rischio",
    seo: {
      title:
        "Cauzione non restituita: come riconoscere clausole che lo favoriscono",
      description:
        "Cosa controllare per evitare trattenute arbitrarie della cauzione: tempi indefiniti, criteri vaghi e conguagli non trasparenti.",
    },
    hero: {
      h1: "Cauzione non restituita",
      subtitle:
        "Quando il contratto rende ‘facile’ trattenere soldi a fine affitto.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/deposito-cauzionale",
        "clausole/restituzione-immobile",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio principale è una clausola che non prevede tempi e criteri oggettivi per la restituzione. In questi casi le trattenute diventano più probabili, perché il testo non mette paletti su cosa sia contestabile e come.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Tempi indefiniti",
            text: "Restituzione ‘entro un tempo congruo’ senza date.",
          },
          {
            title: "Criteri vaghi",
            text: "Trattenute per ‘spese’ senza dettaglio e senza prove.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi prevenire trattenute arbitrarie?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/spese-condominiali",
    kind: "clausola",
    seo: {
      title:
        "Spese condominiali nell’affitto: cosa controllare e ripartizione corretta",
      description:
        "Guida alle spese condominiali nell’affitto: ripartizione, conguagli, criteri e clausole che trasferiscono costi non dovuti.",
    },
    hero: {
      h1: "Spese condominiali",
      subtitle: "Ripartizione, conguagli e voci ‘grigie’ da chiarire.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/spese-non-dovute",
        "clausole/manutenzione-riparazioni",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Le spese condominiali possono essere una fonte di fraintendimenti: il rischio è una clausola che non specifica voci, criteri e modalità di conguaglio, oppure che scarica sull’inquilino anche spese ‘straordinarie’.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Spese indicate come ‘a carico del conduttore’ senza elenco",
          "Conguagli senza rendicontazione",
          "Nessuna distinzione tra ordinario/straordinario",
          "Regole diverse tra testo e allegati (tabella spese, regolamento)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "È presente un elenco delle spese incluse/escluse?",
          "Come avviene il conguaglio e con quali documenti?",
          "Sono escluse le spese straordinarie dall’inquilino?",
          "Sono citati regolamento condominiale e tabelle di ripartizione?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se le spese sono definite in modo trasparente?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/spese-non-dovute",
    kind: "rischio",
    seo: {
      title:
        "Spese non dovute nell’affitto: quando il contratto scarica costi sull’inquilino",
      description:
        "Come riconoscere clausole che ribaltano sull’inquilino spese non dovute: voci generiche, conguagli opachi e manutenzioni troppo ampie.",
    },
    hero: {
      h1: "Spese non dovute",
      subtitle: "Quando il testo ti carica costi extra (senza dirtelo bene).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/spese-condominiali",
        "clausole/manutenzione-riparazioni",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un rischio frequente è la presenza di formule troppo generiche sulle spese. Se non c’è chiarezza su cosa paghi, quando e con quali prove, i costi possono aumentare nel tempo e diventare motivo di conflitto.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Voce generica",
            text: "‘Tutte le spese’ a carico dell’inquilino senza dettaglio.",
          },
          {
            title: "Conguaglio opaco",
            text: "Conguagli senza obbligo di rendicontazione.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire quali spese stai accettando davvero?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/penali-mora-ritardi",
    kind: "clausola",
    seo: {
      title:
        "Penali e mora nell’affitto: cosa controllare su ritardi e pagamenti",
      description:
        "Guida a penali e interessi di mora nell’affitto: quando scattano, quanto possono essere e cosa controllare nel testo.",
    },
    hero: {
      h1: "Penali e mora",
      subtitle:
        "Ritardi, interessi e clausole che possono diventare molto costose.",
    },
    related: {
      editorial: ["contratti/affitto", "rischi/penali-sproporzionate"],
      landings: ["contratto-affitto"],
    },
    blocks: [
      {
        type: "intro",
        text: "Alcuni contratti prevedono penali e interessi di mora per ritardi. Il problema nasce quando le condizioni sono troppo rigide, gli importi non sono proporzionati o il testo fa scattare la penale anche per ritardi minimi.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Penale fissa alta per qualsiasi ritardo",
          "Mora cumulativa (interessi + penale + spese)",
          "Scatto automatico senza soglia minima",
          "Clausole poco chiare su calcolo e decorrenza",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se penali e mora sono proporzionate?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/utenze-conguagli",
    kind: "clausola",
    seo: {
      title:
        "Utenze e conguagli nell’affitto: cosa controllare (luce, gas, internet)",
      description:
        "Guida a utenze e conguagli nell’affitto: intestazione, criteri di riparto, letture contatori e clausole che creano costi extra.",
    },
    hero: {
      h1: "Utenze e conguagli",
      subtitle: "Chi intesta cosa, come si ripartisce e dove nascono sorprese.",
    },
    related: {
      editorial: ["contratti/affitto", "rischi/spese-non-dovute"],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Le utenze sono spesso il punto più ‘confuso’: intestazioni, letture, riparti e conguagli. Il rischio è un testo che non definisce criteri e prove (letture contatore, fatture, riparto), aprendo la porta a richieste contestabili.",
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "Le utenze sono intestate a chi?",
          "Come si calcolano i conguagli (fatture, letture, riparto)?",
          "C’è un elenco delle utenze incluse/escluse?",
          "Cosa succede alla consegna e alla restituzione (letture finali)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se utenze e conguagli sono scritti bene?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/regolamento-condominiale-allegati",
    kind: "clausola",
    seo: {
      title:
        "Regolamento condominiale e allegati: dove si nascondono vincoli nell’affitto",
      description:
        "Molte regole sono negli allegati (regolamento, tabelle, inventari). Ecco cosa controllare per evitare vincoli e costi inattesi.",
    },
    hero: {
      h1: "Regolamento e allegati",
      subtitle:
        "Dove si nascondono vincoli, divieti e costi (oltre al testo principale).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/clausole-nascoste-negli-allegati",
        "clausole/spese-condominiali",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Non tutto è nel testo ‘principale’: spesso vincoli e regole sono nei documenti allegati (regolamento condominiale, inventario, tabelle spese). Il rischio è accettare obblighi che non hai visto o che sono scritti in modo poco leggibile.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Richiamo generico agli allegati senza elenco",
          "Regolamento non consegnato o non firmato",
          "Inventari vaghi o incompleti",
          "Tabelle spese non chiare o mancanti",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se negli allegati c’è qualcosa di ‘pesante’?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/clausole-nascoste-negli-allegati",
    kind: "rischio",
    seo: {
      title:
        "Clausole nascoste negli allegati: il rischio più sottovalutato nell’affitto",
      description:
        "Come riconoscere e prevenire clausole ‘nascoste’ in regolamenti e allegati: divieti, penali, spese e obblighi non evidenti.",
    },
    hero: {
      h1: "Clausole nascoste negli allegati",
      subtitle: "Quando il contratto ‘vero’ è anche nei documenti secondari.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/regolamento-condominiale-allegati",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un contratto può richiamare allegati e regolamenti che contengono regole molto vincolanti: divieti, penali, criteri di spesa, limitazioni sull’uso degli spazi. Se non sono chiari e consegnati, aumenta il rischio di contestazioni future.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Divieti extra",
            text: "Regole su ospiti, animali, orari e uso parti comuni non citate nel testo principale.",
          },
          {
            title: "Spese extra",
            text: "Tabelle spese che ribaltano costi in modo non previsto.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare testo + allegati insieme?",
        buttonLabel: "Carica il documento",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/animali-domestici-affitto",
    kind: "clausola",
    seo: {
      title: "Animali domestici in affitto: cosa controllare nella clausola",
      description:
        "Guida alle clausole su animali domestici nell’affitto: divieti, autorizzazioni, penali e formulazioni troppo generiche.",
    },
    hero: {
      h1: "Animali domestici",
      subtitle: "Divieti, permessi e penali: come leggere la clausola.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "rischi/penali-sproporzionate",
        "clausole/regolamento-condominiale-allegati",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Le clausole sugli animali possono essere rigide o vaghe. Il rischio è un divieto totale senza criteri, oppure penali automatiche. Spesso la regola è anche nel regolamento condominiale allegato.",
      },
      {
        type: "bullets",
        title: "Cose da controllare",
        items: [
          "Divieto totale o autorizzazione preventiva",
          "Condizioni (taglia, numero, aree comuni)",
          "Penali e conseguenze in caso di violazione",
          "Richiami a regolamenti o allegati",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se la clausola è scritta in modo corretto?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/disdetta-non-valida",
    kind: "rischio",
    seo: {
      title: "Disdetta non valida nell’affitto: errori tipici e come evitarli",
      description:
        "Quando la disdetta non è valida: tempi sbagliati, canale errato (PEC/raccomandata), indirizzo incompleto. Cosa controllare nel contratto.",
    },
    hero: {
      h1: "Disdetta non valida",
      subtitle: "Il rischio più comune: inviarla… e scoprire che “non vale”.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/disdetta-affitto",
        "clausole/rinnovo-automatico-affitto",
        "rischi/rinnovo-automatico-nascosto",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "Molte disdette falliscono per motivi pratici: tempi sbagliati, modalità non rispettate (solo PEC o solo raccomandata), destinatario errato o indirizzo specifico previsto dal contratto. Il risultato è concreto: il contratto può rinnovarsi automaticamente e diventa più difficile uscire.",
      },
      {
        type: "bullets",
        title: "Errori tipici che rendono la disdetta “non valida”",
        items: [
          "Preavviso calcolato male (decorrenza non chiara)",
          "Canale sbagliato (email invece di PEC/raccomandata)",
          "Indirizzo o destinatario diverso da quello indicato nel contratto",
          "Mancanza di prove (ricevuta, accettazione/consegna PEC)",
          "Testo troppo generico o incompleto (non richiama contratto e dati essenziali)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida prima di inviare",
        items: [
          "Qual è la scadenza esatta e da quando parte il preavviso?",
          "Quale canale è ammesso (PEC, raccomandata, altro)?",
          "A chi e a quale indirizzo va inviata (quello “speciale” nel contratto)?",
          "Serve allegare documento o riferimenti (data, immobile, parti)?",
          "Hai una prova di invio e ricezione/consegna?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi controllare se nel tuo contratto la disdetta è “a rischio errore”?",
        text: "Caricalo: ti evidenziamo tempi, modalità e punti ambigui che possono invalidarla.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Se mando una mail vale lo stesso?",
            a: "Dipende da cosa prevede il contratto. Se richiede PEC o raccomandata, l’email può non essere sufficiente.",
          },
          {
            q: "Se sbaglio i tempi cosa succede?",
            a: "Spesso scatta il rinnovo (tacito) e devi attendere la nuova finestra o usare altre vie (recesso/risoluzione) se previste.",
          },
        ],
      },
    ],
  },

  {
    slug: "rischi/ritardi-restituzione-cauzione",
    kind: "rischio",
    seo: {
      title:
        "Ritardi nella restituzione della cauzione: quando il contratto è pericoloso",
      description:
        "Cauzione restituita tardi o mai: tempi indefiniti, trattenute vaghe e verbali mancanti. Cosa controllare nel contratto di affitto.",
    },
    hero: {
      h1: "Ritardi restituzione cauzione",
      subtitle: "Quando “te la restituisco poi” diventa un problema concreto.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/deposito-cauzionale",
        "clausole/restituzione-immobile",
        "rischi/cauzione-non-restituita",
      ],
      landings: [
        "contratto-affitto",
        "contratto-affitto-studenti",
        "contratto-stanza",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio non è solo la cauzione “non restituita”: spesso la trattenuta nasce da un contratto che non definisce tempi, criteri e prove. Se mancano regole chiare (verbale, normale usura, documentazione spese), la restituzione può slittare e diventare oggetto di conflitto.",
      },
      {
        type: "bullets",
        title: "Segnali che aumentano il rischio di ritardi",
        items: [
          "Nessuna scadenza per la restituzione della cauzione",
          "Trattenute possibili per ‘spese’ o ‘danni’ senza criteri",
          "Restituzione legata a conguagli non documentati",
          "Assenza di verbale di uscita o controllo congiunto",
          "Formula ampia: ‘a discrezione del locatore’",
        ],
      },
      {
        type: "checklist",
        title: "Cosa controllare nel testo",
        items: [
          "Esiste un termine (giorni/settimane) per la restituzione?",
          "Le trattenute richiedono prove (fatture, preventivi, foto)?",
          "È definita la ‘normale usura’ vs danno?",
          "È previsto un verbale di consegna e uno di uscita?",
          "I conguagli (spese/utenze) hanno criteri e documentazione?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi capire se nel tuo contratto la cauzione è “a rischio trattenute e ritardi”?",
        text: "Caricalo: evidenziamo clausole vaghe e punti che rendono difficile riaverla nei tempi.",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Se non c’è scritto un termine per la restituzione?",
            a: "È un segnale di rischio: senza una scadenza chiara è più facile che la restituzione slitti. Conviene verificare cosa prevede il testo e come gestisce verbali e conguagli.",
          },
          {
            q: "È normale legare la cauzione ai conguagli?",
            a: "Dipende da come è scritto: se mancano criteri e documenti, diventa una leva per trattenere somme in modo poco trasparente.",
          },
        ],
      },
    ],
  },

  {
    slug: "rischi/aumenti-spese-non-previste",
    kind: "rischio",
    seo: {
      title:
        "Aumenti di spese non previste nell’affitto: come riconoscerli nel contratto",
      description:
        "Spese che aumentano nel tempo: forfait senza dettaglio, conguagli opachi, servizi vaghi e riparti poco chiari. Cosa controllare prima di firmare.",
    },
    hero: {
      h1: "Aumenti spese non previste",
      subtitle: "Quando il canone non è l’unico costo (e le spese “scappano”).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/spese-condominiali",
        "clausole/utenze-conguagli",
        "rischi/spese-non-dovute",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un rischio concreto è scoprire che, oltre al canone, le spese crescono per conguagli, riparti non trasparenti o voci non definite. Il problema nasce quando il contratto usa formule generiche (“tutte le spese”, “forfait”) senza elenchi, criteri e documenti.",
      },
      {
        type: "examples",
        title: "Esempi tipici che portano ad aumenti",
        items: [
          {
            title: "Forfait senza dettaglio",
            text: "Importo mensile ‘spese incluse’ senza elenco e senza rendiconto: può crescere o generare conguagli.",
          },
          {
            title: "Conguaglio opaco",
            text: "Conguagli previsti senza obbligo di fatture/letture contatori o criteri di riparto.",
          },
          {
            title: "Servizi vaghi",
            text: "Voci tipo ‘servizi condominiali’ senza specificare cosa comprende e come si calcola.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Checklist: dove guardare nel contratto",
        items: [
          "Le spese sono elencate (incluse/escluse) o sono generiche?",
          "È previsto un rendiconto/documentazione per i conguagli?",
          "Utenze: letture iniziali/finali e criteri di riparto sono chiari?",
          "Ordinarie vs straordinarie sono distinte?",
          "Ci sono allegati (regolamento, tabelle) che cambiano il riparto?",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi capire il costo reale (canone + spese) del tuo contratto?",
        text: "Caricalo: evidenziamo voci vaghe, conguagli e punti che possono aumentare nel tempo.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Se c’è scritto ‘tutte le spese a carico dell’inquilino’ è un problema?",
            a: "È spesso un segnale di rischio: senza elenco e criteri può includere voci non previste. Va verificato bene, specie con allegati e regolamenti.",
          },
          {
            q: "Spese ‘forfettarie’ = spese bloccate?",
            a: "Non necessariamente: dipende da come è scritto. Se manca rendiconto o criteri di revisione, può creare sorprese o dispute.",
          },
        ],
      },
    ],
  },

  {
    slug: "clausole/clausola-risolutiva-espressa-affitto",
    kind: "clausola",
    seo: {
      title:
        "Clausola risolutiva espressa nell’affitto: cosa significa e quando è rischiosa",
      description:
        "Guida rapida alla clausola risolutiva espressa nell’affitto: quando scatta, quali inadempimenti copre e cosa controllare per evitare risoluzioni “automatiche”.",
    },
    hero: {
      h1: "Clausola risolutiva espressa",
      subtitle:
        "Quando il contratto può “saltare” subito (e cosa controllare).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/penali-mora-ritardi",
        "clausole/disdetta-affitto",
        "clausole/recesso",
        "rischi/risoluzione-automatica-per-inadempimento-minimo",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "La clausola risolutiva espressa stabilisce che, se accade un certo inadempimento, il contratto può essere risolto rapidamente. È critica quando include condizioni troppo ampie, scatta per errori minimi o non chiarisce tempi e modalità di contestazione.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Scatta per eventi “minimi” (ritardi piccoli, formalità)",
          "Elenca troppi casi o usa formule vaghe (“qualsiasi inadempimento”)",
          "Non chiarisce come avviene la contestazione e in che tempi",
          "Si combina con penali/mora e crea un rischio “doppio”",
          "Rimanda ad allegati/regolamenti senza dettaglio",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "Per quali eventi scatta la risoluzione?",
          "Serve una contestazione formale? In che modo (PEC/raccomandata)?",
          "Ci sono tempi di “rimedio” (es. giorni per sanare)?",
          "È proporzionata rispetto all’evento (non per errori minimi)?",
          "È collegata a penali o spese aggiuntive?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se la clausola è troppo aggressiva?",
        text: "Carica il contratto: ti evidenziamo dove scatta, e se è scritta in modo sbilanciato.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/risoluzione-automatica-per-inadempimento-minimo",
    kind: "rischio",
    seo: {
      title:
        "Risoluzione “automatica” per inadempimenti minimi: rischio nel contratto di affitto",
      description:
        "Quando il contratto può essere risolto per errori o ritardi minimi: clausole troppo ampie, risolutiva espressa e conseguenze pratiche per l’inquilino.",
    },
    hero: {
      h1: "Risoluzione automatica per inadempimenti minimi",
      subtitle: "Quando un errore piccolo può diventare un problema grande.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/clausola-risolutiva-espressa-affitto",
        "clausole/penali-mora-ritardi",
        "rischi/penali-sproporzionate",
        "rischi/aumenti-spese-non-previste",
      ],
      landings: ["contratto-affitto", "contratto-transitorio"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio nasce quando il contratto contiene clausole che permettono di risolvere il rapporto per eventi marginali: piccoli ritardi, errori formali, obblighi poco chiari o richiami ad allegati difficili da rispettare. Il problema è pratico: aumenta la pressione e riduce i margini di gestione.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Ritardo minimo",
            text: "Risoluzione o decadenza per un ritardo di pochi giorni, senza soglia o possibilità di sanare.",
          },
          {
            title: "Obbligo formale",
            text: "Rischio risoluzione per comunicazioni non inviate nel modo “esatto” (solo PEC, indirizzi specifici).",
          },
          {
            title: "Clausole vaghe",
            text: "Formula ampia (“qualsiasi violazione”) che rende imprevedibile cosa sia davvero “grave”.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Checklist: cosa controllare nel testo",
        items: [
          "Ci sono soglie minime (giorni/importi) prima che scatti la risoluzione?",
          "È previsto un tempo per rimediare (sanare) l’inadempimento?",
          "Gli obblighi sono chiari e realisticamente rispettabili?",
          "La clausola rimanda ad allegati/regolamenti non consegnati o non firmati?",
          "Si combina con penali/mora creando un “doppio colpo” economico?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi capire se il tuo contratto ti espone a una risoluzione “facile”?",
        text: "Caricalo: evidenziamo clausole troppo ampie e punti dove un errore minimo diventa un rischio concreto.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/spese-forfettarie-affitto",
    kind: "clausola",
    seo: {
      title: "Spese forfettarie nell’affitto: quando il forfait è scritto male",
      description:
        "Guida alle spese forfettarie nell’affitto: cosa significa davvero “forfait”, quando può aumentare e quali clausole sono rischiose.",
    },
    hero: {
      h1: "Spese forfettarie nell’affitto",
      subtitle: "Quando “spese incluse” non significa costo bloccato.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/spese-condominiali",
        "clausole/utenze-conguagli",
        "rischi/forfait-spese-ingannevole",
        "rischi/aumenti-spese-non-previste",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Nel contratto di affitto le spese possono essere indicate come “forfettarie” o “incluse”. Il problema nasce quando il forfait non è davvero fisso: senza criteri chiari, può aprire la porta a conguagli, aumenti o richieste extra.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Forfait senza elenco delle spese incluse",
          "Assenza di una frase che escluda conguagli",
          "Richiamo generico a regolamenti o allegati",
          "Possibilità di revisione del forfait non spiegata",
          "Forfait che copre anche spese variabili (utenze, servizi)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Quali spese sono incluse nel forfait?",
          "È esclusa esplicitamente la possibilità di conguagli?",
          "Il forfait può essere aggiornato? Quando e come?",
          "Sono richiamati regolamenti o tabelle spese?",
          "Le utenze sono davvero comprese o solo anticipate?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se il forfait è davvero bloccato?",
        text: "Carica il contratto e verifichiamo se le spese sono scritte in modo chiaro.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/forfait-spese-ingannevole",
    kind: "rischio",
    seo: {
      title: "Forfait spese ingannevole: quando paghi più del previsto",
      description:
        "Il rischio del forfait spese nell’affitto: conguagli, aumenti e costi extra nascosti in clausole poco chiare.",
    },
    hero: {
      h1: "Forfait spese ingannevole",
      subtitle: "Quando “spese incluse” diventa una trappola.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/spese-forfettarie-affitto",
        "clausole/spese-condominiali",
        "clausole/utenze-conguagli",
        "rischi/aumenti-spese-non-previste",
        "rischi/spese-non-dovute",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il forfait spese diventa ingannevole quando non è davvero fisso. Succede se il contratto consente conguagli, revisioni o richieste extra senza criteri chiari. Il risultato è pagare più del previsto, spesso senza accorgersene subito.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Forfait + conguaglio",
            text: "Spese indicate come forfettarie ma con clausola che consente conguagli a fine anno.",
          },
          {
            title: "Forfait modificabile",
            text: "Il locatore può aggiornare il forfait senza limiti o parametri.",
          },
          {
            title: "Servizi vaghi",
            text: "Il forfait include ‘servizi’ non definiti che generano costi extra.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Segnali di rischio nel testo",
        items: [
          "Mancanza di una frase che escluda esplicitamente i conguagli",
          "Richiamo a regolamenti o tabelle non allegate",
          "Forfait collegato a spese variabili",
          "Nessun limite o criterio per eventuali aumenti",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi sapere se il forfait può aumentare?",
        text: "Carica il contratto: individuiamo subito le clausole che rendono il forfait rischioso.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/risoluzione-anticipata-affitto",
    kind: "clausola",
    seo: {
      title:
        "Risoluzione anticipata nell’affitto: uscire prima della scadenza e cosa controllare",
      description:
        "Guida alla risoluzione anticipata nell’affitto: quando puoi uscire, preavviso, penali e clausole che ti vincolano troppo.",
    },
    hero: {
      h1: "Risoluzione anticipata (affitto)",
      subtitle: "Uscire prima della scadenza: dove nascono penali e vincoli.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/recesso",
        "clausole/disdetta-affitto",
        "clausole/penali-mora-ritardi",
        "rischi/uscita-anticipata-penali",
        "rischi/disdetta-non-valida",
      ],
      landings: [
        "contratto-affitto",
        "contratto-transitorio",
        "contratto-stanza",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Uscire prima della scadenza è uno dei punti più delicati nei contratti di affitto. Il rischio nasce quando il testo non distingue bene tra disdetta, recesso e risoluzione, oppure quando prevede penali automatiche o condizioni difficili da rispettare.",
      },
      {
        type: "bullets",
        title: "Cose da controllare nel testo",
        items: [
          "Esiste una clausola di recesso? Per chi vale (solo una parte o entrambe)?",
          "Preavviso richiesto e da quando decorre",
          "Modalità di comunicazione (PEC, raccomandata, indirizzi specifici)",
          "Penali o costi in caso di uscita anticipata",
          "Eccezioni (giusta causa, inadempimento, accordo tra le parti)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "Qual è la data di scadenza e qual è la finestra utile per uscire?",
          "È previsto recesso anticipato? Con quali condizioni?",
          "C’è una penale? È proporzionata e spiegata?",
          "La clausola rimanda ad allegati o regolamenti?",
          "Sono previste conseguenze automatiche (decadenza, trattenute, spese)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se puoi uscire senza penali inutili?",
        text: "Carica il contratto: evidenziamo preavvisi, vincoli e clausole che possono costarti caro.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/uscita-anticipata-penali",
    kind: "rischio",
    seo: {
      title:
        "Uscita anticipata con penali nell’affitto: quando il contratto è sbilanciato",
      description:
        "Penali e costi per uscire prima della scadenza: come riconoscere clausole che ti bloccano o ti fanno pagare troppo.",
    },
    hero: {
      h1: "Uscita anticipata con penali",
      subtitle: "Quando uscire costa troppo (o è scritto per impedirlo).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/risoluzione-anticipata-affitto",
        "clausole/recesso",
        "clausole/penali-mora-ritardi",
        "rischi/penali-sproporzionate",
        "rischi/disdetta-non-valida",
      ],
      landings: [
        "contratto-affitto",
        "contratto-transitorio",
        "contratto-stanza",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio più concreto è scoprire che uscire prima della scadenza comporta penali elevate o costi non immediatamente evidenti. Alcuni contratti scrivono la clausola in modo da rendere l’uscita difficile (preavvisi rigidi, canali obbligatori, penali automatiche).",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Penale fissa alta",
            text: "Somma elevata anche se mancano pochi mesi alla scadenza.",
          },
          {
            title: "Pagamento fino a fine contratto",
            text: "Obbligo di pagare canoni residui anche dopo l’uscita, senza condizioni chiare.",
          },
          {
            title: "Vincoli pratici impossibili",
            text: "Disdetta valida solo con modalità rigide e tempi molto anticipati.",
          },
        ],
      },
      {
        type: "bullets",
        title: "Segnali di rischio nel testo",
        items: [
          "Penali senza criteri (o senza tetto massimo)",
          "Decorrenza del preavviso ambigua (facile sbagliare)",
          "Clausole che cumulano penale + spese + trattenute",
          "Richiami ad allegati non consegnati o non firmati",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire quanto ti costa davvero uscire prima?",
        text: "Carica il contratto: ti evidenziamo penali, vincoli e punti sbilanciati.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/consegna-chiavi-fine-affitto",
    kind: "clausola",
    seo: {
      title:
        "Consegna delle chiavi a fine affitto: quando il contratto crea problemi",
      description:
        "Guida alla consegna delle chiavi a fine affitto: tempi, modalità, verbali e clausole che possono ritardare la chiusura del rapporto.",
    },
    hero: {
      h1: "Consegna delle chiavi",
      subtitle:
        "Quando il contratto non chiarisce come e quando finisce davvero.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/restituzione-immobile",
        "clausole/risoluzione-anticipata-affitto",
        "rischi/ritardo-chiusura-contratto",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "La consegna delle chiavi segna la fine del rapporto solo se il contratto lo dice chiaramente. Il rischio è una clausola vaga che lascia spazio a contestazioni, richieste di canoni extra o ritardi nella restituzione della cauzione.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Nessuna indicazione su quando consegnare le chiavi",
          "Consegna subordinata a controlli non definiti",
          "Obblighi di presenza del locatore senza alternative",
          "Collegamento poco chiaro con verbale di uscita",
        ],
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "Quando e come vanno consegnate le chiavi?",
          "È previsto un verbale di uscita contestuale?",
          "La consegna chiavi chiude il pagamento dei canoni?",
          "Ci sono condizioni aggiuntive da rispettare?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title:
          "Vuoi capire se il contratto chiude davvero con la consegna delle chiavi?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/ritardo-chiusura-contratto",
    kind: "rischio",
    seo: {
      title:
        "Ritardo nella chiusura del contratto di affitto: quando continui a pagare senza accorgertene",
      description:
        "Come nascono ritardi nella chiusura del rapporto (consegna chiavi, verbali, accessi, disdetta): segnali nel testo e cosa controllare per evitare canoni extra e trattenute.",
    },
    hero: {
      h1: "Ritardo nella chiusura del contratto",
      subtitle:
        "Quando consegni le chiavi… ma il contratto non è davvero chiuso (e rischi canoni extra).",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/consegna-chiavi-fine-affitto",
        "clausole/restituzione-immobile",
        "clausole/verbale-uscita-stato-immobile",
        "rischi/disdetta-non-valida",
        "rischi/ritardi-restituzione-cauzione",
      ],
      landings: [
        "contratto-affitto",
        "contratto-stanza",
        "contratto-transitorio",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è pensare che il rapporto sia finito, mentre il contratto resta ‘aperto’ perché mancano passaggi chiari: consegna chiavi non documentata, verbale di uscita assente, controlli rimandati, modalità di disdetta non rispettate. In questi casi possono nascere richieste di canoni extra, trattenute sulla cauzione o contestazioni sullo stato dell’immobile.",
      },
      {
        type: "bullets",
        title: "Segnali tipici che favoriscono il ritardo",
        items: [
          "Consegna chiavi prevista ma senza prova (nessuna ricevuta/verbale)",
          "Chiusura subordinata a ‘controlli’ senza tempi e criteri",
          "Verbale di uscita non previsto o lasciato ‘a discrezione’",
          "Obbligo di presenza del locatore senza alternative (ritardi pratici)",
          "Collegamento poco chiaro tra consegna chiavi, fine canone e cauzione",
          "Disdetta/recesso con modalità rigide: facile sbagliare e rinnovare",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (60 secondi)",
        items: [
          "Il testo dice esplicitamente che la consegna chiavi chiude il pagamento dei canoni?",
          "È previsto un verbale di uscita firmato da entrambe le parti?",
          "Ci sono tempi per controlli e contestazioni (giorni/settimane)?",
          "La restituzione cauzione ha un termine e criteri/prove per trattenute?",
          "Le modalità di disdetta/recesso sono rispettabili (PEC/raccomandata/indirizzi)?",
        ],
      },
      {
        type: "examples",
        title: "Esempi concreti",
        items: [
          {
            title: "‘Le chiavi le prendo poi’",
            text: "Il contratto non prevede alternative alla consegna in presenza: se il locatore rimanda, la chiusura slitta e restano ambigui canone e responsabilità.",
          },
          {
            title: "Controllo immobile senza scadenze",
            text: "Il testo parla di verifiche e ripristini ma non mette tempi: contestazioni e trattenute possono arrivare ‘a distanza’.",
          },
          {
            title: "Disdetta inviata nel modo sbagliato",
            text: "Hai comunicato l’uscita, ma non con il canale previsto (solo PEC/raccomandata): il rischio è che il contratto si rinnovi e tu resti vincolato.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se nel tuo contratto la chiusura è scritta bene?",
        text: "Caricalo: controlliamo consegna chiavi, verbali, tempi di contestazione e i punti che possono farti pagare oltre il dovuto.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/verbale-uscita-stato-immobile",
    kind: "clausola",
    seo: {
      title:
        "Verbale di uscita nell’affitto: perché è decisivo per cauzione e contestazioni",
      description:
        "Cosa controllare sul verbale di uscita: stato dell’immobile, normale usura, danni e collegamento con la cauzione.",
    },
    hero: {
      h1: "Verbale di uscita",
      subtitle:
        "Stato dell’immobile, contestazioni e cauzione: tutto passa da qui.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/restituzione-immobile",
        "clausole/deposito-cauzionale",
        "rischi/contestazioni-stato-immobile",
        "rischi/cauzione-non-restituita",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il verbale di uscita serve a fotografare lo stato dell’immobile alla fine del contratto. Se manca o è scritto male, aumentano le contestazioni e il rischio di trattenute sulla cauzione.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Verbale non previsto o facoltativo",
          "Nessuna distinzione tra danno e normale usura",
          "Controlli unilaterali del locatore",
          "Assenza di criteri o documentazione",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "È previsto un verbale firmato da entrambe le parti?",
          "È definita la ‘normale usura’?",
          "Sono richieste prove (foto, fatture)?",
          "Il verbale è collegato alla restituzione della cauzione?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi evitare contestazioni a fine affitto?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/contestazioni-stato-immobile",
    kind: "rischio",
    seo: {
      title:
        "Contestazioni sullo stato dell’immobile a fine affitto: come nascono",
      description:
        "Quando il contratto favorisce contestazioni su danni, pulizia e usura: clausole vaghe, verbali mancanti e rischi concreti.",
    },
    hero: {
      h1: "Contestazioni sullo stato dell’immobile",
      subtitle:
        "Il problema nasce quando il contratto non mette paletti chiari.",
    },
    related: {
      editorial: [
        "contratti/affitto",
        "clausole/verbale-uscita-stato-immobile",
        "clausole/restituzione-immobile",
        "rischi/ritardi-restituzione-cauzione",
      ],
      landings: ["contratto-affitto", "contratto-stanza"],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti conflitti a fine affitto nascono da clausole vaghe sullo stato dell’immobile. Senza verbali, criteri e prove, ogni difetto può diventare una contestazione e una trattenuta.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Normale usura non definita",
            text: "Qualsiasi segno viene trattato come danno.",
          },
          {
            title: "Controllo unilaterale",
            text: "Il locatore decide da solo cosa contestare.",
          },
          {
            title: "Pulizia generica",
            text: "Richieste di ripristino senza criteri oggettivi.",
          },
        ],
      },
      {
        type: "bullets",
        title: "Segnali di rischio nel testo",
        items: [
          "Assenza di verbale di uscita",
          "Clausole su ‘stato perfetto’ o ‘come nuovo’",
          "Trattenute senza obbligo di documentazione",
          "Collegamento vago con la cauzione",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi prevenire contestazioni e trattenute?",
        text: "Carica il contratto: individuiamo subito i punti che favoriscono conflitti.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  //CLUSTER: LAVORO / COLLABORAZIONI
  {
    slug: "contratti/lavoro-collaborazioni",
    kind: "hub",
    seo: {
      title:
        "Contratti di lavoro e collaborazione: cosa controllare prima di firmare",
      description:
        "Guida pratica ai contratti di lavoro e collaborazione: clausole critiche, rischi comuni e punti da verificare prima di firmare.",
    },
    hero: {
      h1: "Contratti di lavoro e collaborazione",
      subtitle:
        "Clausole, rischi e punti critici da controllare prima di firmare.",
    },
    related: {
      editorial: [
        "lavoro/guida-rapida",
        "lavoro/clausole",
        "lavoro/rischi",
        // CLAUSOLE CHIAVE
        "clausole/durata-collaborazione",
        "clausole/compenso-pagamenti",
        "clausole/recesso-rapporto-lavoro",
        "clausole/non-concorrenza",
        "clausole/proprieta-intellettuale",

        // RISCHI CONCRETI
        "rischi/compenso-non-pagato",
        "rischi/recesso-unilaterale",
        "rischi/non-concorrenza-eccessiva",
        "rischi/falsa-partita-iva",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di lavoro e collaborazione molti problemi non nascono dallo stipendio o dal ruolo, ma da clausole scritte male: recesso improvviso, compensi vaghi, obblighi di esclusiva, non concorrenza o proprietà del lavoro svolto.",
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre",
        items: [
          "Durata del rapporto e rinnovi",
          "Compenso, tempi di pagamento e penali",
          "Recesso e preavviso",
          "Clausole di non concorrenza ed esclusiva",
          "Proprietà del lavoro prodotto (codice, contenuti, idee)",
          "Inquadramento reale del rapporto",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il tuo contratto di lavoro è equilibrato?",
        text: "Caricalo e ti segnaliamo clausole sbilanciate, rischi concreti e punti da chiarire prima di firmare.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "lavoro/guida-rapida",
    kind: "guida",
    seo: {
      title:
        "Contratto di lavoro o collaborazione: guida rapida (cosa controllare)",
      description:
        "Guida rapida: le 7 cose da controllare in un contratto di lavoro o collaborazione (durata, recesso, compenso, esclusiva, non concorrenza, IP, vincoli).",
    },
    hero: {
      h1: "Guida rapida: lavoro e collaborazioni",
      subtitle: "I controlli essenziali prima di firmare (in 2 minuti).",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "lavoro/clausole",
        "lavoro/rischi",
        "clausole/durata-collaborazione",
        "clausole/recesso-rapporto-lavoro",
        "clausole/compenso-pagamenti",
        "clausole/non-concorrenza",
        "clausole/proprieta-intellettuale",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Se hai poco tempo, controlla questi punti. I problemi più comuni arrivano da recesso improvviso, compensi poco chiari, vincoli (esclusiva/non concorrenza) e proprietà di ciò che produci.",
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Durata: scadenza, rinnovi, proroghe e cosa succede a fine periodo",
          "Recesso: chi può interrompere, preavviso, indennizzi e conseguenze",
          "Compenso: importi, scadenze, condizioni di pagamento e approvazioni",
          "Esclusiva: ti impedisce di lavorare per altri? per quanto e con quali limiti",
          "Non concorrenza: durata, ambito, territorio e (se previsto) compenso",
          "Proprietà intellettuale: cosa cedi, quando lo cedi, cosa resta tuo",
          "Penali e responsabilità: importi, casi di applicazione, tetto massimo",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi un controllo completo del tuo contratto?",
        text: "Caricalo: evidenziamo clausole sbilanciate e rischi pratici prima che firmi.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "lavoro/clausole",
    kind: "index",
    seo: {
      title:
        "Clausole nei contratti di lavoro e collaborazione: elenco e spiegazioni",
      description:
        "Indice delle clausole più importanti nei contratti di lavoro e collaborazione: durata, recesso, compenso, non concorrenza, proprietà intellettuale.",
    },
    hero: {
      h1: "Clausole: lavoro e collaborazioni",
      subtitle: "Le sezioni che contano davvero (e dove nascono i problemi).",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "lavoro/guida-rapida",
        "lavoro/rischi",
        "clausole/durata-collaborazione",
        "clausole/compenso-pagamenti",
        "clausole/recesso-rapporto-lavoro",
        "clausole/non-concorrenza",
        "clausole/proprieta-intellettuale",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Qui trovi le clausole più frequenti nei contratti di lavoro e collaborazione. L’obiettivo è semplice: capire dove sei vincolato, come esci dal rapporto, quando vieni pagato e cosa cedi davvero.",
      },
      {
        type: "cards",
        title: "Clausole chiave",
        items: [
          {
            title: "Durata del rapporto",
            text: "Scadenze, rinnovi e proroghe: quanto sei vincolato davvero.",
            href: "/clausole/durata-collaborazione",
          },
          {
            title: "Compenso e pagamenti",
            text: "Importi, scadenze, condizioni e rischi di pagamenti incerti.",
            href: "/clausole/compenso-pagamenti",
          },
          {
            title: "Recesso dal rapporto",
            text: "Preavviso, indennizzi e clausole sbilanciate (uscita facile solo per una parte).",
            href: "/clausole/recesso-rapporto-lavoro",
          },
          {
            title: "Non concorrenza",
            text: "Quando limita davvero il tuo lavoro futuro.",
            href: "/clausole/non-concorrenza",
          },
          {
            title: "Proprietà intellettuale",
            text: "Chi possiede codice, contenuti, idee e materiali creati.",
            href: "/clausole/proprieta-intellettuale",
          },
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire quali clausole nel tuo contratto sono a rischio?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "lavoro/rischi",
    kind: "index",
    seo: {
      title:
        "Rischi nei contratti di lavoro e collaborazione: i problemi più comuni",
      description:
        "Indice dei rischi tipici nei contratti di lavoro e collaborazione: compenso non pagato, recesso unilaterale, non concorrenza eccessiva, falsa partita IVA.",
    },
    hero: {
      h1: "Rischi: lavoro e collaborazioni",
      subtitle: "I problemi più frequenti (e da dove nascono nel testo).",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "lavoro/guida-rapida",
        "lavoro/clausole",
        "rischi/compenso-non-pagato",
        "rischi/recesso-unilaterale",
        "rischi/non-concorrenza-eccessiva",
        "rischi/falsa-partita-iva",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Questi sono i rischi più comuni che vediamo nei contratti di lavoro e collaborazione. Spesso non dipendono dal ‘tipo’ di contratto, ma da come sono scritte le clausole.",
      },
      {
        type: "cards",
        title: "Rischi più frequenti",
        items: [
          {
            title: "Compenso non pagato",
            text: "Tempi vaghi, condizioni discrezionali e pagamenti subordinati.",
            href: "/rischi/compenso-non-pagato",
          },
          {
            title: "Recesso unilaterale",
            text: "Chiusura improvvisa del rapporto senza tutele o indennizzi.",
            href: "/rischi/recesso-unilaterale",
          },
          {
            title: "Non concorrenza eccessiva",
            text: "Divieti troppo ampi, lunghi o senza compenso.",
            href: "/rischi/non-concorrenza-eccessiva",
          },
          {
            title: "Falsa partita IVA",
            text: "Quando la collaborazione nasconde un rapporto subordinato.",
            href: "/rischi/falsa-partita-iva",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il tuo contratto ti espone a questi rischi?",
        text: "Caricalo e ti evidenziamo subito le frasi che li attivano.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/durata-collaborazione",
    kind: "clausola",
    seo: {
      title: "Durata del rapporto di lavoro o collaborazione: cosa controllare",
      description:
        "Durata del rapporto, rinnovi automatici e scadenze: cosa verificare nei contratti di lavoro e collaborazione.",
    },
    hero: {
      h1: "Durata del rapporto",
      subtitle:
        "Scadenze, rinnovi e vincoli che possono legarti più del previsto.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/recesso-rapporto-lavoro",
        "rischi/recesso-unilaterale",
      ],
      landings: ["contratto-lavoro", "contratto-collaborazione"],
    },
    blocks: [
      {
        type: "intro",
        text: "La durata definisce quanto sei vincolato al rapporto. Il rischio è un testo che prevede rinnovi automatici, proroghe implicite o scadenze poco chiare che rendono difficile interrompere la collaborazione.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Rinnovo automatico senza condizioni chiare",
          "Durata collegata a obiettivi vaghi",
          "Proroghe tacite non evidenziate",
          "Scadenze diverse tra testo e allegati",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire quanto sei davvero vincolato?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/compenso-pagamenti",
    kind: "clausola",
    seo: {
      title: "Compenso e pagamenti nel contratto di lavoro: cosa controllare",
      description:
        "Come sono scritti compenso, fatturazione e pagamenti nei contratti di lavoro e collaborazione. Dove nascono i problemi.",
    },
    hero: {
      h1: "Compenso e pagamenti",
      subtitle: "Quanto, quando e come vieni pagato davvero.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "rischi/compenso-non-pagato",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti contratti indicano il compenso ma non spiegano chiaramente tempi, modalità e condizioni di pagamento. Il rischio è lavorare correttamente e non essere pagati nei tempi o nei modi previsti.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Compenso legato a risultati vaghi",
          "Tempi di pagamento non indicati",
          "Pagamenti subordinati ad approvazioni discrezionali",
          "Penali previste solo per te",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il pagamento è davvero tutelato?",
        text: "Carica il contratto e controlliamo come e quando vieni pagato.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/recesso-rapporto-lavoro",
    kind: "clausola",
    seo: {
      title:
        "Recesso nel contratto di lavoro o collaborazione: cosa controllare",
      description:
        "Recesso, preavviso e interruzione del rapporto: cosa verificare nei contratti di lavoro e collaborazione.",
    },
    hero: {
      h1: "Recesso dal rapporto",
      subtitle: "Chi può uscire, quando e con quali conseguenze.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "rischi/recesso-unilaterale",
      ],
      landings: ["contratto-lavoro", "contratto-collaborazione"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il recesso stabilisce come e quando una parte può interrompere il rapporto. Il rischio è una clausola che consente l’uscita immediata a una parte e vincola l’altra con preavvisi o penali.",
      },
      {
        type: "bullets",
        title: "Rischi frequenti",
        items: [
          "Recesso libero solo per il committente",
          "Preavviso lungo o poco chiaro",
          "Penali solo a carico tuo",
          "Effetti del recesso non definiti",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se puoi uscire senza danni?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/non-concorrenza",
    kind: "clausola",
    seo: {
      title: "Clausola di non concorrenza: quando è un rischio",
      description:
        "Non concorrenza nei contratti di lavoro e collaborazione: limiti, durata e rischi di clausole eccessive.",
    },
    hero: {
      h1: "Clausola di non concorrenza",
      subtitle: "Quando limita davvero il tuo lavoro futuro.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "rischi/non-concorrenza-eccessiva",
      ],
      landings: ["contratto-lavoro", "contratto-partita-iva"],
    },
    blocks: [
      {
        type: "intro",
        text: "La non concorrenza può impedirti di lavorare per altri clienti o settori. Il rischio è una clausola troppo ampia, lunga o non compensata.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Durata lunga o indefinita",
          "Ambito geografico ampio",
          "Divieto su attività generiche",
          "Nessun compenso previsto",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se limita troppo il tuo futuro?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/proprieta-intellettuale",
    kind: "clausola",
    seo: {
      title:
        "Proprietà intellettuale nel contratto di lavoro: cosa controllare",
      description:
        "Chi possiede il lavoro svolto: codice, contenuti, idee. Cosa verificare nei contratti di lavoro e collaborazione.",
    },
    hero: {
      h1: "Proprietà intellettuale",
      subtitle: "Chi è proprietario di ciò che crei davvero.",
    },
    related: {
      editorial: ["contratti/lavoro-collaborazioni"],
      landings: ["contratto-lavoro", "contratto-collaborazione"],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti contratti attribuiscono automaticamente al committente tutto ciò che produci. Il rischio è una clausola troppo ampia che include anche lavori non collegati o futuri.",
      },
      {
        type: "bullets",
        title: "Rischi frequenti",
        items: [
          "Cessione totale e indefinita",
          "Inclusione di lavori futuri",
          "Nessuna distinzione tra lavoro e progetti personali",
          "Diritti ceduti senza limiti",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire cosa stai cedendo davvero?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/compenso-non-pagato",
    kind: "rischio",
    seo: {
      title: "Compenso non pagato: quando il contratto ti espone al rischio",
      description:
        "Quando il compenso non viene pagato o arriva in ritardo: clausole vaghe, approvazioni discrezionali e problemi tipici nei contratti di lavoro.",
    },
    hero: {
      h1: "Compenso non pagato",
      subtitle: "Il rischio più concreto: lavorare e non essere pagati.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/compenso-pagamenti",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti contratti indicano il compenso ma non tutelano il pagamento. Se mancano tempi certi, criteri oggettivi e penali, il rischio è lavorare correttamente e ricevere il pagamento in ritardo o non riceverlo affatto.",
      },
      {
        type: "examples",
        title: "Situazioni tipiche",
        items: [
          {
            title: "Pagamento subordinato",
            text: "Il pagamento dipende da approvazioni o verifiche non definite.",
          },
          {
            title: "Tempi vaghi",
            text: "Formule come “entro tempi congrui” o “a fine progetto”.",
          },
          {
            title: "Penali a senso unico",
            text: "Penali previste solo per te, mai per il ritardo del committente.",
          },
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi sapere se il tuo pagamento è davvero tutelato?",
        text: "Carica il contratto e controlliamo tempi, condizioni e rischi reali.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/recesso-unilaterale",
    kind: "rischio",
    seo: {
      title:
        "Recesso unilaterale: quando il contratto può chiudersi all’improvviso",
      description:
        "Recesso improvviso nei contratti di lavoro e collaborazione: clausole sbilanciate, preavviso mancante e conseguenze economiche.",
    },
    hero: {
      h1: "Recesso unilaterale",
      subtitle:
        "Quando l’altra parte può chiudere il rapporto da un giorno all’altro.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/recesso-rapporto-lavoro",
        "clausole/durata-collaborazione",
      ],
      landings: ["contratto-lavoro", "contratto-collaborazione"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un rischio frequente è una clausola che consente al committente di interrompere il rapporto senza preavviso o con effetti immediati. Questo può lasciarti senza compensi già previsti o con progetti interrotti.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Recesso libero solo per una parte",
          "Preavviso assente o minimo",
          "Nessun indennizzo previsto",
          "Effetti del recesso non chiariti",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se puoi essere lasciato a metà lavoro?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/non-concorrenza-eccessiva",
    kind: "rischio",
    seo: {
      title: "Non concorrenza eccessiva: quando limita il tuo lavoro futuro",
      description:
        "Clausole di non concorrenza troppo ampie: durata, ambito e limiti che possono bloccare il tuo futuro professionale.",
    },
    hero: {
      h1: "Non concorrenza eccessiva",
      subtitle: "Quando una clausola ti impedisce di lavorare davvero.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/non-concorrenza",
      ],
      landings: ["contratto-lavoro", "contratto-partita-iva"],
    },
    blocks: [
      {
        type: "intro",
        text: "Una non concorrenza scritta male può impedirti di lavorare per mesi o anni. Il rischio è un divieto troppo ampio, senza compenso e senza limiti reali.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Ambito generico",
            text: "Divieto su ‘attività simili’ senza definizione chiara.",
          },
          {
            title: "Durata lunga",
            text: "Vincoli che continuano anche dopo la fine del rapporto.",
          },
          {
            title: "Nessun compenso",
            text: "Limitazioni importanti senza indennizzo.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se limita il tuo futuro?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/falsa-partita-iva",
    kind: "rischio",
    seo: {
      title: "Falsa partita IVA: segnali di un contratto a rischio",
      description:
        "Quando una collaborazione nasconde un rapporto di lavoro subordinato: segnali, clausole e rischi per chi firma.",
    },
    hero: {
      h1: "Falsa partita IVA",
      subtitle: "Quando una collaborazione è (di fatto) lavoro subordinato.",
    },
    related: {
      editorial: ["contratti/lavoro-collaborazioni"],
      landings: ["contratto-partita-iva", "contratto-collaborazione"],
    },
    blocks: [
      {
        type: "intro",
        text: "Alcuni contratti di collaborazione nascondono rapporti di lavoro subordinato. Il rischio è trovarsi senza tutele, ferie, malattia e con responsabilità fiscali maggiori.",
      },
      {
        type: "bullets",
        title: "Segnali tipici",
        items: [
          "Orari fissi e obbligo di presenza",
          "Esclusiva di fatto",
          "Controllo gerarchico continuo",
          "Compenso fisso mensile",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi capire se il tuo contratto è davvero una collaborazione?",
        text: "Caricalo e analizziamo i segnali di rischio.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  //CLUSTER Servizi / Freelance / Agenzia
  {
    slug: "contratti/servizi-freelance-agenzia",
    kind: "hub",
    seo: {
      title:
        "Contratti di servizi, freelance e agenzia: cosa controllare prima di firmare",
      description:
        "Guida pratica ai contratti di servizi, freelance e agenzia: clausole critiche, rischi comuni e cosa verificare per evitare lavoro non pagato o vincoli nascosti.",
    },
    hero: {
      h1: "Contratti di servizi, freelance e agenzia",
      subtitle:
        "Compensi, consegne, revisioni e responsabilità: dove nascono i problemi più frequenti.",
    },
    related: {
      editorial: [
        // CLAUSOLE CHIAVE
        "clausole/compenso-servizi",
        "clausole/tempi-consegna-approvazioni",
        "clausole/revisioni-modifiche",
        "clausole/recesso-servizi",
        "clausole/proprieta-intellettuale-servizi",
        "clausole/esclusiva-non-concorrenza-servizi",
        "clausole/limitazione-responsabilita",
        "clausole/penali-ritardi-servizi",

        // RISCHI CONCRETI
        "rischi/servizi-non-pagati",
        "rischi/scope-creep",
        "rischi/revisioni-illimitate",
        "rischi/recesso-improvviso-servizi",
        "rischi/cessione-diritti-totale",
        "rischi/responsabilita-eccessiva",
        "rischi/esclusiva-bloccante",
        "rischi/pagamento-condizionato",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "I contratti di servizi, freelance e agenzia sembrano spesso semplici, ma nascondono molte insidie. I problemi più comuni non nascono dal lavoro in sé, ma da compensi poco chiari, revisioni infinite, recesso improvviso o clausole che trasferiscono responsabilità eccessive.",
      },
      {
        type: "bullets",
        title: "Problemi frequenti in questi contratti",
        items: [
          "Lavoro svolto ma pagamento ritardato o negato",
          "Richieste extra non previste (scope creep)",
          "Revisioni illimitate senza compenso aggiuntivo",
          "Recesso improvviso del cliente",
          "Perdita dei diritti sul lavoro realizzato",
          "Esclusive che bloccano altri incarichi",
          "Responsabilità e penali sproporzionate",
        ],
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre prima di firmare",
        items: [
          "Compenso: importo, scadenze e modalità di pagamento",
          "Ambito del lavoro e limiti delle attività incluse",
          "Numero di revisioni e modifiche comprese",
          "Tempi di consegna e approvazione",
          "Recesso: quando è possibile e con quali effetti",
          "Diritti d’uso e proprietà del lavoro",
          "Responsabilità, penali e limitazioni",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi capire se il tuo contratto di servizi è sbilanciato?",
        text: "Caricalo e ti segnaliamo subito clausole a rischio, richieste extra nascoste e punti che possono crearti problemi prima di iniziare a lavorare.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/compenso-servizi",
    kind: "clausola",
    seo: {
      title: "Compenso nei contratti di servizi e freelance: cosa controllare",
      description:
        "Guida alla clausola sul compenso nei contratti di servizi e freelance: importi, scadenze, condizioni di pagamento e rischi di lavoro non pagato.",
    },
    hero: {
      h1: "Compenso nei contratti di servizi",
      subtitle:
        "Quanto, quando e a che condizioni vieni pagato: dove nascono i problemi.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/servizi-non-pagati",
        "rischi/pagamento-condizionato",
        "clausole/tempi-consegna-approvazioni",
        "clausole/recesso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di servizi e freelance il compenso è spesso scritto in modo poco chiaro. Il rischio non è solo l’importo, ma le condizioni che lo rendono incerto: approvazioni discrezionali, pagamenti posticipati o legati a eventi che non controlli.",
      },
      {
        type: "bullets",
        title: "Come può essere scritto il compenso",
        items: [
          "Compenso fisso per progetto o attività",
          "Compenso a ore o a giornata",
          "Pagamento a milestone o fasi",
          "Pagamento a risultato o approvazione",
          "Compenso misto (fisso + variabile)",
        ],
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Pagamento subordinato a 'piena soddisfazione' del cliente",
          "Nessuna data certa di pagamento",
          "Pagamento solo a fine progetto senza acconti",
          "Facoltà unilaterale del cliente di sospendere o ritardare il pagamento",
          "Mancanza di interessi o penali per ritardo",
          "Rinvio a documenti o accordi non allegati",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida sul compenso",
        items: [
          "L’importo è chiaramente indicato?",
          "Sono previste date o scadenze precise?",
          "Il pagamento dipende da approvazioni soggettive?",
          "Sono previsti acconti o milestone?",
          "Cosa succede in caso di ritardo nel pagamento?",
          "Il compenso copre tutte le attività richieste?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il tuo compenso è davvero garantito?",
        text: "Carica il contratto: ti mostriamo se il pagamento è certo o se dipende da condizioni che possono metterti in difficoltà.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "È rischioso il pagamento solo a fine progetto?",
            a: "Sì, soprattutto se il progetto è lungo o se il cliente può interromperlo. Senza acconti o milestone il rischio di non essere pagati aumenta.",
          },
          {
            q: "Il cliente può pagare solo se 'soddisfatto'?",
            a: "Dipende da come è scritto. Se la soddisfazione è discrezionale e non legata a criteri oggettivi, è un segnale di forte squilibrio.",
          },
        ],
      },
    ],
  },
  {
    slug: "clausole/revisioni-modifiche",
    kind: "clausola",
    seo: {
      title: "Revisioni e modifiche nei contratti di servizi: cosa controllare",
      description:
        "Guida alle clausole su revisioni e modifiche nei contratti di servizi e freelance: limiti, costi extra e rischi di lavoro infinito.",
    },
    hero: {
      h1: "Revisioni e modifiche",
      subtitle: "Quando il lavoro non finisce mai (e non viene pagato).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/revisioni-illimitate",
        "clausole/compenso-servizi",
        "clausole/tempi-consegna-approvazioni",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Le clausole su revisioni e modifiche sono tra le più sottovalutate. Se non sono limitate per numero, ambito e tempi, il rischio è lavorare molto più del previsto senza compenso aggiuntivo.",
      },
      {
        type: "bullets",
        title: "Come vengono scritte di solito",
        items: [
          "Numero fisso di revisioni incluse",
          "Revisioni entro una certa fase o data",
          "Modifiche extra a pagamento",
          "Revisioni soggette ad approvazione finale",
        ],
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Revisioni illimitate o non quantificate",
          "Modifiche richieste 'fino a soddisfazione'",
          "Nessuna distinzione tra revisione e nuovo lavoro",
          "Assenza di costi extra per richieste aggiuntive",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Quante revisioni sono incluse?",
          "Cosa è considerato revisione e cosa nuovo lavoro?",
          "Ci sono limiti di tempo o fase?",
          "Le revisioni extra sono a pagamento?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi evitare revisioni infinite?",
        text: "Carica il contratto e verifichiamo se revisioni e modifiche sono definite in modo corretto.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/tempi-consegna-approvazioni",
    kind: "clausola",
    seo: {
      title: "Tempi di consegna e approvazioni nei contratti di servizi",
      description:
        "Come controllare tempi di consegna e approvazioni nei contratti di servizi e freelance: ritardi, silenzi e pagamenti bloccati.",
    },
    hero: {
      h1: "Tempi di consegna e approvazioni",
      subtitle: "Quando i ritardi non dipendono da te (ma ti bloccano).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/pagamento-condizionato",
        "clausole/compenso-servizi",
        "clausole/revisioni-modifiche",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti contratti fissano tempi di consegna per il fornitore ma non per il cliente. Se le approvazioni non hanno scadenze, il progetto può restare fermo e il pagamento bloccato.",
      },
      {
        type: "bullets",
        title: "Dove nascono i problemi",
        items: [
          "Tempi di consegna rigidi solo per il fornitore",
          "Nessun termine per approvare o contestare",
          "Pagamento legato all’approvazione finale",
          "Silenzio del cliente senza effetti",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "I tempi di consegna sono realistici?",
          "Esiste un termine per l’approvazione?",
          "Il silenzio equivale ad approvazione?",
          "Il pagamento dipende da eventi fuori dal tuo controllo?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se i tempi sono sbilanciati?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/recesso-servizi",
    kind: "clausola",
    seo: {
      title:
        "Recesso nei contratti di servizi: cosa succede se il cliente interrompe",
      description:
        "Guida al recesso nei contratti di servizi e freelance: preavviso, compensi maturati e rischi di lavoro non pagato.",
    },
    hero: {
      h1: "Recesso nei contratti di servizi",
      subtitle: "Cosa succede se il cliente interrompe il lavoro.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/servizi-non-pagati",
        "clausole/compenso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il recesso nei contratti di servizi è spesso sbilanciato: il cliente può interrompere quando vuole, mentre il fornitore rischia di non essere pagato per il lavoro già svolto.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Recesso libero senza preavviso",
          "Nessun pagamento per attività già svolte",
          "Rimborso spese non previsto",
          "Recesso unilaterale solo per il cliente",
        ],
      },
      {
        type: "checklist",
        title: "Checklist essenziale",
        items: [
          "Chi può recedere e con quali limiti?",
          "È previsto un preavviso minimo?",
          "Il lavoro svolto viene pagato?",
          "Cosa succede alle spese già sostenute?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire cosa rischi se il contratto viene interrotto?",
        text: "Carica il contratto e analizziamo cosa succede in caso di recesso.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/servizi-non-pagati",
    kind: "rischio",
    seo: {
      title:
        "Servizi non pagati: il rischio più comune nei contratti freelance",
      description:
        "Quando il lavoro viene svolto ma non pagato: clausole vaghe, approvazioni bloccate e compensi non tutelati nei contratti di servizi.",
    },
    hero: {
      h1: "Servizi non pagati",
      subtitle: "Hai lavorato, ma il pagamento non arriva.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/compenso-servizi",
        "clausole/tempi-consegna-approvazioni",
        "clausole/recesso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio più frequente nei contratti di servizi è semplice: lavori, consegni, ma il pagamento non arriva. Spesso non è una truffa, ma il risultato di clausole scritte male o troppo vaghe.",
      },
      {
        type: "bullets",
        title: "Situazioni tipiche",
        items: [
          "Pagamento legato ad approvazioni mai formalizzate",
          "Compenso dovuto solo a progetto 'completato'",
          "Cliente che interrompe il lavoro senza pagare quanto svolto",
          "Assenza di acconti o milestone",
        ],
      },
      {
        type: "examples",
        title: "Esempi concreti",
        items: [
          {
            title: "Approvazione bloccata",
            text: "Il cliente non approva formalmente e il pagamento resta sospeso.",
          },
          {
            title: "Progetto interrotto",
            text: "Il contratto viene chiuso prima della fine e il lavoro svolto non viene riconosciuto.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Cosa controllare nel contratto",
        items: [
          "Il pagamento è legato a eventi chiari e misurabili?",
          "Sono previsti acconti o pagamenti a stato avanzamento?",
          "Il lavoro già svolto viene sempre pagato?",
          "Esistono termini certi di pagamento?",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi sapere se il tuo contratto ti tutela davvero?",
        text: "Caricalo: individuiamo subito clausole che possono portare a lavoro non pagato.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/pagamento-condizionato",
    kind: "rischio",
    seo: {
      title:
        "Pagamento condizionato nei contratti di servizi: perché è rischioso",
      description:
        "Quando il pagamento dipende da approvazioni, risultati o eventi fuori dal tuo controllo. Come riconoscere il rischio nel contratto.",
    },
    hero: {
      h1: "Pagamento condizionato",
      subtitle: "Se dipende da altri, non è davvero garantito.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/tempi-consegna-approvazioni",
        "clausole/compenso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Un pagamento è 'condizionato' quando non dipende solo dal tuo lavoro. Se il compenso è legato a eventi esterni o decisioni discrezionali, il rischio di non essere pagati aumenta.",
      },
      {
        type: "bullets",
        title: "Condizioni tipiche",
        items: [
          "Approvazione finale del cliente senza criteri",
          "Risultati economici o di performance",
          "Accettazione soggettiva del lavoro",
          "Consegna 'conforme alle aspettative'",
        ],
      },
      {
        type: "examples",
        title: "Esempi frequenti",
        items: [
          {
            title: "Valutazione soggettiva",
            text: "Il lavoro deve essere 'soddisfacente' senza criteri misurabili.",
          },
          {
            title: "Evento esterno",
            text: "Pagamento solo dopo il successo di una campagna o vendita.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Domande chiave",
        items: [
          "Il pagamento dipende solo dalla consegna?",
          "Le condizioni sono oggettive e verificabili?",
          "C’è un termine massimo per approvare?",
          "Il silenzio vale come approvazione?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il pagamento è davvero garantito?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/revisioni-illimitate",
    kind: "rischio",
    seo: {
      title:
        "Revisioni illimitate: il rischio del lavoro infinito nei contratti di servizi",
      description:
        "Quando il contratto non limita le revisioni: richieste continue, lavoro extra non pagato e conflitti con il cliente.",
    },
    hero: {
      h1: "Revisioni illimitate",
      subtitle: "Il lavoro che non finisce mai (e non viene pagato).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/revisioni-modifiche",
        "clausole/compenso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Le revisioni illimitate sono uno dei rischi più comuni nei contratti di servizi. Senza limiti chiari, ogni richiesta può diventare 'dovuta', anche se esula dall’accordo iniziale.",
      },
      {
        type: "bullets",
        title: "Come nasce il problema",
        items: [
          "Revisioni non quantificate",
          "Nessuna distinzione tra revisione e nuovo lavoro",
          "Richieste tardive o fuori scope",
          "Assenza di costi extra",
        ],
      },
      {
        type: "examples",
        title: "Esempi concreti",
        items: [
          {
            title: "Scope che si allarga",
            text: "Ogni modifica introduce nuove funzionalità o attività.",
          },
          {
            title: "Feedback continuo",
            text: "Il cliente chiede modifiche a distanza di settimane o mesi.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Cosa deve essere chiaro",
        items: [
          "Numero massimo di revisioni",
          "Ambito delle revisioni incluse",
          "Tempi entro cui richiederle",
          "Costo delle modifiche extra",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi evitare il lavoro infinito?",
        text: "Carica il contratto e verifichiamo se revisioni e modifiche sono davvero sotto controllo.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/proprieta-intellettuale-servizi",
    kind: "clausola",
    seo: {
      title:
        "Proprietà intellettuale nei contratti di servizi: cosa controllare",
      description:
        "Chi possiede ciò che crei (design, codice, contenuti): cessione, licenze, riuso e clausole che ti fanno perdere diritti.",
    },
    hero: {
      h1: "Proprietà intellettuale (servizi)",
      subtitle: "Chi possiede ciò che crei: cessione, licenze e riuso.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/cessione-diritti-totale",
        "clausole/compenso-servizi",
        "clausole/recesso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di servizi la proprietà intellettuale è spesso scritta in modo “onnivoro”: tutto al cliente, per sempre, su tutto. Il rischio è cedere anche asset riutilizzabili (template, componenti, metodologie) o lavori non collegati al progetto.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Cessione totale e irrevocabile di “ogni diritto”",
          "Inclusione di lavori futuri o non collegati",
          "Divieto di riuso di know-how, template o componenti",
          "Cessione senza legarla al pagamento completo",
          "Assenza di distinzione tra deliverable e strumenti di lavoro",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "È cessione o licenza d’uso? Su quali materiali?",
          "La cessione avviene solo a pagamento avvenuto?",
          "Riesci a riusare know-how/asset generici (non specifici del cliente)?",
          "Sono inclusi sorgenti, file editabili, librerie? È scritto chiaramente?",
          "Ci sono limiti (ambito, durata, territorio) o è “tutto per sempre”?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire cosa stai cedendo davvero?",
        text: "Carica il contratto: individuiamo clausole “onnivore” e ti segnaliamo dove perdi diritti inutilmente.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/esclusiva-non-concorrenza-servizi",
    kind: "clausola",
    seo: {
      title:
        "Esclusiva e non concorrenza nei contratti di servizi: quando sono un rischio",
      description:
        "Esclusiva e non concorrenza nei contratti freelance/agenzia: limiti, durata, clienti vietati e clausole troppo ampie.",
    },
    hero: {
      h1: "Esclusiva e non concorrenza",
      subtitle: "Quando un cliente può bloccarti altri lavori.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/esclusiva-bloccante",
        "clausole/compenso-servizi",
        "clausole/recesso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di servizi l’esclusiva può essere esplicita o “di fatto”. Il rischio è una clausola troppo ampia (settore generico, durata lunga, divieto su clienti simili) che limita il tuo lavoro senza un compenso adeguato.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Divieto su attività “simili” senza definizione",
          "Ambito troppo ampio (settore generico / intero mercato)",
          "Durata lunga o che continua dopo la fine del contratto",
          "Divieto su clienti potenziali o contatti indiretti",
          "Penali automatiche alte in caso di violazione",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "È esclusiva totale o solo su uno specifico progetto?",
          "Qual è il perimetro (clienti nominati, lista, settore definito)?",
          "Quanto dura e quando termina davvero?",
          "È previsto un compenso/indennizzo per l’esclusiva?",
          "Ci sono penali proporzionate e con tetto massimo?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se questa clausola ti blocca troppo?",
        text: "Carica il contratto: evidenziamo perimetro, durata e rischi pratici di esclusiva/non concorrenza.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/limitazione-responsabilita",
    kind: "clausola",
    seo: {
      title:
        "Limitazione di responsabilità nei contratti di servizi: cosa controllare",
      description:
        "Responsabilità, danni, manleva e limiti: come leggere la clausola per evitare richieste sproporzionate nei contratti freelance/agenzia.",
    },
    hero: {
      h1: "Limitazione di responsabilità",
      subtitle:
        "Danni, manleva e tetti: quando la responsabilità diventa sproporzionata.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/responsabilita-eccessiva",
        "clausole/penali-ritardi-servizi",
        "clausole/tempi-consegna-approvazioni",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Questa clausola decide “quanto puoi rischiare” se qualcosa va storto. Il problema nasce quando il contratto ti attribuisce responsabilità per danni indiretti, perdite di profitto, o ti impone manleve ampie senza tetto massimo.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Responsabilità illimitata (nessun tetto)",
          "Manleva ampia (“per qualsiasi pretesa di terzi”)",
          "Danni indiretti inclusi (perdita profitti, reputazione, ecc.)",
          "Responsabilità anche per materiali forniti dal cliente",
          "Obblighi di sicurezza/risultato non compatibili con un servizio",
        ],
      },
      {
        type: "checklist",
        title: "Checklist essenziale",
        items: [
          "C’è un tetto massimo (cap) alla responsabilità?",
          "Sono esclusi i danni indiretti e consequenziali?",
          "La manleva è limitata a casi specifici e controllabili?",
          "La responsabilità è collegata a colpa grave/dolo o è generica?",
          "C’è coerenza tra responsabilità e compenso (rischio/valore)?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se la responsabilità è sproporzionata?",
        text: "Carica il contratto: individuiamo cap, manleve e rischi “fuori scala” rispetto al lavoro.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/penali-ritardi-servizi",
    kind: "clausola",
    seo: {
      title:
        "Penali per ritardi nei contratti di servizi: quando sono un rischio",
      description:
        "Penali e SLA nei contratti freelance/agenzia: quando scattano, cumuli, soglie e clausole scritte male che ti espongono troppo.",
    },
    hero: {
      h1: "Penali per ritardi",
      subtitle: "Quando i ritardi costano troppo (o non dipendono da te).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "rischi/responsabilita-eccessiva",
        "clausole/tempi-consegna-approvazioni",
        "rischi/pagamento-condizionato",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Le penali hanno senso solo se i tempi sono chiari e dipendono da te. Il rischio nasce quando le penali scattano anche per ritardi causati dal cliente (brief tardivi, feedback lenti), quando si cumulano senza tetto o quando non c’è una soglia minima.",
      },
      {
        type: "bullets",
        title: "Segnali tipici di rischio",
        items: [
          "Penali senza soglia (anche per 1 giorno)",
          "Penali cumulabili senza tetto massimo",
          "Scatto anche se il cliente non approva/fornisce materiali",
          "Definizione vaga di “ritardo” o “consegna”",
          "Penali + risoluzione immediata (doppia sanzione)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Quando inizia a contare il tempo (brief/materiali ok)?",
          "La consegna è definita in modo oggettivo?",
          "C’è una soglia minima e un tetto massimo alle penali?",
          "Il cliente ha tempi di approvazione (o silenzio=ok)?",
          "Le penali sostituiscono i danni o si sommano a tutto?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se le penali sono scritte in modo pericoloso?",
        text: "Carica il contratto: evidenziamo soglie, tetti e punti dove le penali scattano “anche se non è colpa tua”.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/scope-creep",
    kind: "rischio",
    seo: {
      title: "Scope creep: quando il lavoro si allarga e non viene pagato",
      description:
        "Il rischio più comune nei contratti di servizi: richieste extra, attività non definite e revisioni che diventano nuovo lavoro.",
    },
    hero: {
      h1: "Scope creep",
      subtitle: "Quando il progetto si allarga (e il compenso resta uguale).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/revisioni-modifiche",
        "clausole/compenso-servizi",
        "rischi/revisioni-illimitate",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Lo scope creep succede quando, senza accorgersene, il lavoro richiesto aumenta: nuove attività, nuovi canali, nuove versioni, nuove urgenze. Se il contratto non definisce confini e costi extra, il rischio è lavorare molto di più senza compenso.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Piccole aggiunte continue",
            text: "Ogni feedback aggiunge una parte nuova “già che ci siamo”.",
          },
          {
            title: "Output non definiti",
            text: "Non è chiaro cosa è incluso, quindi tutto diventa richiesto.",
          },
          {
            title: "Urgenze e canali extra",
            text: "Aggiunta di attività rapide, supporto, call, chat, fix continui.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Segnali di rischio nel testo",
        items: [
          "Ambito descritto in modo generico (“supporto completo”, “tutto incluso”)",
          "Nessuna regola per change request o extra",
          "Revisioni non limitate o non definite",
          "Nessuna tariffa per attività fuori ambito",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il contratto ti espone a scope creep?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/recesso-improvviso-servizi",
    kind: "rischio",
    seo: {
      title:
        "Recesso improvviso nei contratti di servizi: il rischio di lavoro interrotto",
      description:
        "Quando il cliente può interrompere il lavoro senza pagare il maturato: recesso libero, preavviso assente e consegne bloccate.",
    },
    hero: {
      h1: "Recesso improvviso",
      subtitle: "Quando il cliente può fermare tutto (e tu resti scoperto).",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/recesso-servizi",
        "rischi/servizi-non-pagati",
        "rischi/pagamento-condizionato",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è una clausola che permette al cliente di chiudere quando vuole, senza preavviso e senza pagare davvero ciò che hai già fatto. Succede soprattutto quando pagamento e approvazione sono vaghi o quando non esistono milestone.",
      },
      {
        type: "bullets",
        title: "Segnali tipici",
        items: [
          "Recesso libero senza preavviso",
          "Pagamento solo a progetto finito",
          "Nessuna regola sul pagamento del lavoro già svolto",
          "Cliente può sospendere “in attesa di valutazioni”",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire cosa succede se il cliente interrompe?",
        text: "Carica il contratto: vediamo se sei pagato per il maturato e se il recesso è sbilanciato.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/cessione-diritti-totale",
    kind: "rischio",
    seo: {
      title:
        "Cessione totale dei diritti: quando perdi asset e riuso nei contratti di servizi",
      description:
        "Il rischio di clausole che cedono tutto (anche know-how e template): cosa controllare per non perdere riuso e valore futuro.",
    },
    hero: {
      h1: "Cessione diritti totale",
      subtitle: "Quando “tutto è del cliente” diventa un rischio enorme.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/proprieta-intellettuale-servizi",
        "clausole/compenso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio non è solo cedere i deliverable del progetto: alcune clausole ti impediscono di riusare parti generiche del tuo lavoro (template, componenti, metodi), riducendo la tua efficienza e il tuo valore nel tempo.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Cessione su tutto",
            text: "Cessione di “ogni diritto, presente e futuro” senza limiti.",
          },
          {
            title: "Divieto di riuso",
            text: "Non puoi riusare framework, asset e processi anche se generici.",
          },
          {
            title: "Cessione senza pagamento",
            text: "Diritti trasferiti anche se il cliente non paga (o paga dopo).",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se stai cedendo troppo?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/responsabilita-eccessiva",
    kind: "rischio",
    seo: {
      title:
        "Responsabilità eccessiva nei contratti di servizi: quando il rischio è fuori scala",
      description:
        "Responsabilità illimitata, manleve ampie e danni indiretti: come riconoscere un contratto che ti espone troppo rispetto al compenso.",
    },
    hero: {
      h1: "Responsabilità eccessiva",
      subtitle:
        "Quando il rischio economico è sproporzionato rispetto al lavoro.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/limitazione-responsabilita",
        "clausole/penali-ritardi-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Un contratto diventa pericoloso quando ti attribuisce responsabilità senza tetti, include danni indiretti o ti impone manleve generiche. Anche se il progetto è piccolo, il rischio può diventare enorme.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Nessun cap massimo alla responsabilità",
          "Manleva per “qualsiasi” pretesa di terzi",
          "Danni indiretti inclusi (profitto, reputazione, fermo attività)",
          "Responsabilità anche per dati/materiali del cliente",
          "Obblighi di risultato (non di mezzi) senza definizione",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il contratto è “fuori scala” sul rischio?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/esclusiva-bloccante",
    kind: "rischio",
    seo: {
      title:
        "Esclusiva bloccante: quando un contratto ti impedisce altri clienti",
      description:
        "Il rischio dell’esclusiva nei contratti freelance/agenzia: perimetro vago, durata lunga, penali e blocco di opportunità.",
    },
    hero: {
      h1: "Esclusiva bloccante",
      subtitle: "Quando un cliente può impedirti di lavorare con altri.",
    },
    related: {
      editorial: [
        "contratti/servizi-freelance-agenzia",
        "clausole/esclusiva-non-concorrenza-servizi",
        "clausole/compenso-servizi",
      ],
      landings: [
        "contratto-servizi",
        "contratto-freelance",
        "contratto-agenzia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è un’esclusiva scritta in modo troppo ampio: non solo su un progetto, ma su un settore, su clienti simili o per periodi lunghi. Senza un compenso adeguato, può diventare una perdita netta di opportunità.",
      },
      {
        type: "checklist",
        title: "Segnali tipici nel testo",
        items: [
          "Settore definito in modo generico (tutto è “concorrenza”)",
          "Durata lunga o post-contratto",
          "Penali automatiche senza tetto",
          "Divieto su clienti potenziali o indiretti",
          "Nessun indennizzo per il vincolo",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi capire se questa esclusiva ti sta tagliando fuori dal mercato?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/esclusiva",
    kind: "clausola",
    seo: {
      title: "Clausola di esclusiva: cosa significa e quando è rischiosa",
      description:
        "Guida rapida alla clausola di esclusiva nei contratti di lavoro e collaborazione: limiti, durata, ambito e rischi quando blocca altri incarichi.",
    },
    hero: {
      h1: "Clausola di esclusiva",
      subtitle: "Quando ti impedisce (di fatto) di lavorare per altri.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "rischi/esclusiva-troppo-ampia",
        "clausole/non-concorrenza",
        "rischi/non-concorrenza-eccessiva",
        "clausole/compenso-pagamenti",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "L’esclusiva significa che ti impegni a non lavorare per altri (o a non lavorare per alcuni soggetti/settori) mentre dura il rapporto. Diventa rischiosa quando è troppo ampia, non ha limiti chiari o non è compensata: può ridurre davvero le tue entrate e la tua libertà professionale.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Esclusiva totale senza motivazione (anche su attività non in concorrenza)",
          "Ambito vago (“attività simili” senza definizione)",
          "Durata indefinita o che continua dopo la fine del rapporto",
          "Divieto esteso a clienti/settori molto ampi",
          "Nessun compenso o indennizzo per l’esclusiva",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "È esclusiva totale o limitata a un settore/cliente?",
          "È definito cosa è “concorrenza” e cosa no?",
          "Quanto dura (solo durante il rapporto o anche dopo)?",
          "È prevista un’indennità/compenso per l’esclusiva?",
          "Cosa succede se ricevi un incarico esterno (permesso scritto, eccezioni)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se l’esclusiva ti blocca troppo?",
        text: "Carica il contratto: evidenziamo ampiezza, durata e squilibri della clausola.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "Esclusiva e non concorrenza sono la stessa cosa?",
            a: "No. L’esclusiva vale di solito durante il rapporto; la non concorrenza spesso opera anche dopo e dovrebbe avere limiti e condizioni specifiche. Conta cosa c’è scritto nel testo.",
          },
          {
            q: "Se non è previsto un compenso, è automaticamente invalida?",
            a: "Dipende dal tipo di rapporto e da come è formulata. In pratica: se è molto ampia e ti limita davvero, è un segnale di squilibrio da verificare bene.",
          },
        ],
      },
    ],
  },
  {
    slug: "rischi/esclusiva-troppo-ampia",
    kind: "rischio",
    seo: {
      title: "Esclusiva troppo ampia: quando ti blocca altri lavori",
      description:
        "Come riconoscere un’esclusiva eccessiva nei contratti di lavoro/collaborazione: ambito vago, durata lunga, penali e assenza di compenso.",
    },
    hero: {
      h1: "Esclusiva troppo ampia",
      subtitle: "Quando il vincolo è scritto per limitarti più del necessario.",
    },
    related: {
      editorial: [
        "clausole/esclusiva",
        "clausole/non-concorrenza",
        "rischi/non-concorrenza-eccessiva",
        "contratti/lavoro-collaborazioni",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Un’esclusiva diventa un rischio quando non è delimitata: vieta “di fatto” qualsiasi altro incarico, anche non in concorrenza. Se manca un perimetro chiaro, una durata ragionevole e un compenso, può trasformarsi in una perdita economica e di opportunità.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Ambito vago",
            text: "Divieto su “attività simili” senza definire cosa rientra davvero nel divieto.",
          },
          {
            title: "Durata eccessiva",
            text: "Vincolo lungo o che continua anche dopo la fine del rapporto, senza limiti chiari.",
          },
          {
            title: "Penali fuori scala",
            text: "Penali automatiche alte, senza tetto massimo o condizioni verificabili.",
          },
        ],
      },
      {
        type: "checklist",
        title: "Segnali di rischio nel testo",
        items: [
          "Settore/attività definiti in modo generico (tutto diventa “concorrenza”)",
          "Durata indefinita o post-contratto senza criteri",
          "Divieto esteso a clienti potenziali o indiretti",
          "Nessun indennizzo per la limitazione",
          "Penali senza cap o con calcolo poco chiaro",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se l’esclusiva è “troppo” per quello che vale?",
        text: "Carica il contratto: ti evidenziamo dove l’esclusiva è vaga o sproporzionata e cosa comporta nella pratica.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/riservatezza-nda",
    kind: "clausola",
    seo: {
      title:
        "Clausola di riservatezza (NDA): cosa controllare prima di firmare",
      description:
        "Guida alla riservatezza/NDA nei contratti di lavoro e collaborazione: definizione di confidenziale, durata, penali e limiti ragionevoli.",
    },
    hero: {
      h1: "Riservatezza (NDA)",
      subtitle:
        "Quando protegge davvero… e quando diventa un vincolo eccessivo.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "rischi/nda-sbilanciato",
        "clausole/proprieta-intellettuale",
        "rischi/proprieta-intellettuale-totale",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "La riservatezza serve a proteggere informazioni del cliente/azienda. Diventa rischiosa quando definisce come “confidenziale” qualunque cosa, dura troppo, o prevede penali automatiche sproporzionate. Il punto chiave è capire cosa puoi dire/fare e cosa no, per quanto tempo e con quali eccezioni.",
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre",
        items: [
          "Cosa è definito “confidenziale” (definizione chiara, non totale)",
          "Eccezioni: informazioni pubbliche, già note, obblighi di legge",
          "Durata della riservatezza (e se continua dopo la fine del rapporto)",
          "Modalità di gestione: restituzione/cancellazione materiali",
          "Penali e responsabilità in caso di violazione",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "La definizione di confidenziale è ragionevole o “tutto e sempre”?",
          "Ci sono eccezioni chiare (pubblico, già noto, obbligo legale)?",
          "Quanto dura l’obbligo e quando termina?",
          "Cosa devi fare con file, email, documenti a fine rapporto?",
          "Le penali sono proporzionate e collegate a un danno specifico?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se l’NDA è scritta in modo equilibrato?",
        text: "Carica il contratto: evidenziamo definizioni troppo ampie, durata e penali.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
      {
        type: "faq",
        items: [
          {
            q: "La riservatezza può impedirmi di mostrare il lavoro in portfolio?",
            a: "Spesso sì, se non è prevista un’eccezione. Conviene verificare se puoi citare il cliente o mostrare parti del lavoro con autorizzazione.",
          },
          {
            q: "Se non è indicata una durata, cosa succede?",
            a: "È un segnale di rischio: senza durata l’obbligo può essere interpretato come molto lungo. Meglio che sia definito chiaramente nel testo.",
          },
        ],
      },
    ],
  },
  {
    slug: "rischi/nda-sbilanciato",
    kind: "rischio",
    seo: {
      title: "NDA sbilanciato: quando la riservatezza è troppo ampia",
      description:
        "Come riconoscere un NDA sbilanciato: definizione di confidenziale troppo ampia, durata eccessiva, penali automatiche e obblighi poco realistici.",
    },
    hero: {
      h1: "NDA sbilanciato",
      subtitle: "Quando la riservatezza diventa un rischio per te.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/riservatezza-nda",
        "rischi/compenso-non-pagato",
        "rischi/proprieta-intellettuale-totale",
      ],
      landings: [
        "contratto-collaborazione",
        "contratto-partita-iva",
        "contratto-lavoro",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Un NDA diventa sbilanciato quando ti impone obblighi molto pesanti senza chiarire confini, eccezioni e durata. Il rischio pratico è doppio: da un lato puoi violarlo senza volerlo (perché è troppo vago), dall’altro può impedirti attività normali (portfolio, riuso di competenze, collaborazione con altri).",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Tutto è confidenziale",
            text: "Qualsiasi informazione, anche pubblica o generica, viene trattata come segreta.",
          },
          {
            title: "Durata eccessiva",
            text: "Obbligo senza termine o per molti anni, senza motivazione.",
          },
          {
            title: "Penali automatiche",
            text: "Penale fissa molto alta anche per violazioni minime o non intenzionali.",
          },
        ],
      },
      {
        type: "bullets",
        title: "Segnali di rischio nel testo",
        items: [
          "Definizione di “confidenziale” troppo ampia o vaga",
          "Assenza di eccezioni (pubblico, già noto, obbligo legale)",
          "Durata indefinita o sproporzionata",
          "Obblighi tecnici irrealistici (cancellazioni, audit, controlli)",
          "Penali fisse elevate o responsabilità illimitata",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se l’NDA ti espone a rischi inutili?",
        text: "Carica il contratto: individuiamo le parti vaghe e le penali sproporzionate.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/proprieta-intellettuale-totale",
    kind: "rischio",
    seo: {
      title:
        "Proprietà intellettuale totale: quando il contratto si prende tutto",
      description:
        "Come riconoscere clausole che cedono tutta la proprietà intellettuale: lavori futuri, idee generiche, riuso di competenze e rischi per portfolio e progetti personali.",
    },
    hero: {
      h1: "Proprietà intellettuale totale",
      subtitle: "Quando il contratto si prende più del lavoro per cui ti paga.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/proprieta-intellettuale",
        "clausole/riservatezza-nda",
        "rischi/nda-sbilanciato",
      ],
      landings: [
        "contratto-collaborazione",
        "contratto-partita-iva",
        "contratto-lavoro",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è una clausola che trasferisce al committente ogni diritto su tutto ciò che produci — anche oltre il progetto: idee, metodi, componenti riutilizzabili, lavori futuri o non collegati. Questo può impedirti di riusare parti del lavoro, mostrare portfolio o portare avanti progetti personali.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Cessione senza limiti",
            text: "Cede “ogni diritto presente e futuro” senza collegarlo al progetto specifico.",
          },
          {
            title: "Include lavori non correlati",
            text: "Include “qualsiasi sviluppo” anche fuori dall’incarico o fatto in altri contesti.",
          },
          {
            title: "Riuso vietato",
            text: "Vieta di riutilizzare anche parti generiche (template, librerie, metodi).",
          },
        ],
      },
      {
        type: "checklist",
        title: "Segnali di rischio nel testo",
        items: [
          "Cessione totale e indefinita, non legata all’incarico",
          "Include idee, know-how e strumenti generici",
          "Include lavori futuri o non collegati",
          "Nessuna licenza/permesso per portfolio",
          "Nessuna distinzione tra materiale pre-esistente e lavoro nuovo",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire cosa stai cedendo davvero?",
        text: "Carica il contratto: evidenziamo cosa è “dentro” e cosa dovrebbe restare tuo.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  //CLUSTER Privacy / NDA / Dati
  {
    slug: "contratti/privacy-nda-dati",
    kind: "hub",
    seo: {
      title: "Privacy, NDA e dati: cosa controllare prima di firmare",
      description:
        "Guida pratica a privacy, NDA e gestione dati nei contratti: clausole critiche, rischi comuni e cosa verificare per non esporti a sanzioni o vincoli eccessivi.",
    },
    hero: {
      h1: "Privacy / NDA / Dati",
      subtitle:
        "Confidenzialità, trattamento dati e responsabilità: dove nascono i rischi più costosi.",
    },
    related: {
      editorial: [
        // CLAUSOLE
        "clausole/nda-confidenzialita",
        "clausole/durata-nda-e-obblighi",
        "clausole/eccezioni-confidenzialita",
        "clausole/penali-per-violazione-nda",
        "clausole/trattamento-dati-ruoli-gdpr",
        "clausole/trasferimento-dati-e-subfornitori",

        // RISCHI
        "rischi/nda-troppo-ampia",
        "rischi/obbligo-confidenzialita-indefinito",
        "rischi/eccezioni-mancanti-nda",
        "rischi/penali-sproporzionate-nda",
        "rischi/responsabilita-gdpr-sbilanciata",
        "rischi/trasferimenti-dati-non-trasparenti",
      ],
      landings: [
        "contratto-nda",
        "contratto-privacy-gdpr",
        "contratto-servizi",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Privacy e NDA sono spesso firmate “di fretta”, ma possono creare rischi concreti: obblighi indefiniti, definizioni troppo ampie, penali elevate, e responsabilità GDPR scaricate su una sola parte. Qui trovi i punti da controllare in modo semplice e veloce.",
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre",
        items: [
          "Che cosa è davvero “confidenziale” (definizione e ambito)",
          "Durata degli obblighi (e se ci sono parti indefinite)",
          "Eccezioni (pubblico dominio, obblighi di legge, pre-esistenza, indipendente sviluppo)",
          "Penali e responsabilità in caso di violazione",
          "Ruoli GDPR (titolare/responsabile) e istruzioni di trattamento",
          "Subfornitori e trasferimenti extra-UE",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi sapere se privacy/NDA ti espongono a rischi inutili?",
        text: "Carica il documento: ti segnaliamo clausole sbilanciate, obblighi troppo ampi e punti GDPR critici.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // ---------- CLAUSOLE ----------
  {
    slug: "clausole/nda-confidenzialita",
    kind: "clausola",
    seo: {
      title: "NDA e confidenzialità: cosa significa davvero e cosa controllare",
      description:
        "Guida rapida alla clausola NDA/confidenzialità: definizione di informazioni confidenziali, ambito, obblighi e segnali di squilibrio.",
    },
    hero: {
      h1: "NDA / Confidenzialità",
      subtitle:
        "Definizioni e obblighi: quando la clausola diventa troppo ampia.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/durata-nda-e-obblighi",
        "clausole/eccezioni-confidenzialita",
        "rischi/nda-troppo-ampia",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "La clausola di confidenzialità (NDA) definisce quali informazioni non puoi divulgare e come devi proteggerle. Il rischio nasce quando “confidenziale” include praticamente tutto, senza limiti e senza eccezioni.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Definizione generica: “qualsiasi informazione” senza limiti",
          "Obblighi di sicurezza impossibili o non proporzionati",
          "Divieto di uso anche per eseguire il lavoro",
          "Divieto di citare il cliente/progetto anche come portfolio (se ti serve)",
        ],
      },
      {
        type: "checklist",
        title: "Checklist (30 secondi)",
        items: [
          "Cosa rientra nella definizione di “confidenziale”?",
          "Puoi usare le info solo per l’esecuzione del contratto?",
          "Ci sono obblighi di sicurezza realistici (accessi, backup, cifratura)?",
          "Ci sono limiti su divulgazione a team/consulenti necessari?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se la definizione è troppo ampia?",
        buttonLabel: "Carica l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/durata-nda-e-obblighi",
    kind: "clausola",
    seo: {
      title:
        "Durata dell’NDA: quanto dura la confidenzialità e perché è critica",
      description:
        "Guida alla durata degli obblighi di confidenzialità: termini, obblighi indefiniti e cosa controllare prima di firmare.",
    },
    hero: {
      h1: "Durata dell’NDA",
      subtitle: "Quando l’obbligo non finisce mai (e diventa un rischio).",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/nda-confidenzialita",
        "rischi/obbligo-confidenzialita-indefinito",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "La durata dell’NDA è spesso sottovalutata. Se l’obbligo è indefinito o troppo lungo, rischi di non poter riutilizzare competenze, template o informazioni già note nel settore.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Obbligo “a tempo indeterminato” senza distinzione",
          "Durata molto lunga senza motivo (es. 10+ anni) su contenuti generici",
          "Mancanza di differenza tra segreti industriali e info ordinarie",
        ],
      },
      {
        type: "checklist",
        title: "Checklist veloce",
        items: [
          "È previsto un termine chiaro (mesi/anni)?",
          "C’è distinzione tra segreti e informazioni non sensibili?",
          "Che cosa succede a fine rapporto (restituzione/cancellazione dati)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se la durata è eccessiva?",
        buttonLabel: "Analizza l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/eccezioni-confidenzialita",
    kind: "clausola",
    seo: {
      title: "Eccezioni alla confidenzialità: le 4–5 che devono esserci",
      description:
        "Guida alle eccezioni dell’NDA: pubblico dominio, obblighi di legge, informazioni preesistenti, sviluppo indipendente e terze parti.",
    },
    hero: {
      h1: "Eccezioni alla confidenzialità",
      subtitle: "Se mancano, l’NDA può diventare ingestibile (e pericolosa).",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/nda-confidenzialita",
        "rischi/eccezioni-mancanti-nda",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Un’NDA equilibrata include eccezioni standard. Se mancano, rischi di violare l’accordo anche senza colpa (es. perché devi rispondere a un obbligo di legge o perché l’informazione era già pubblica).",
      },
      {
        type: "bullets",
        title: "Eccezioni tipiche che dovrebbero esserci",
        items: [
          "Informazioni già pubbliche o diventate pubbliche senza tua colpa",
          "Informazioni già in tuo possesso prima della disclosure (pre-esistenza)",
          "Informazioni ricevute legittimamente da terzi",
          "Sviluppo indipendente senza usare info confidenziali",
          "Divulgazione richiesta da legge/autorità (con obbligo di notifica, se possibile)",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare se le eccezioni sono presenti e scritte bene?",
        buttonLabel: "Carica l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/penali-per-violazione-nda",
    kind: "clausola",
    seo: {
      title: "Penali per violazione NDA: come leggere importi e responsabilità",
      description:
        "Guida alle penali in caso di violazione NDA: importi, automatismi, cumuli e cosa controllare per evitare rischi sproporzionati.",
    },
    hero: {
      h1: "Penali per violazione NDA",
      subtitle: "Quando una penale diventa una minaccia economica reale.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "rischi/penali-sproporzionate-nda",
        "clausole/nda-confidenzialita",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Le penali nelle NDA possono essere legittime, ma diventano un rischio se sono automatiche, molto alte, o cumulabili con risarcimenti e spese legali senza limiti chiari.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Penale fissa altissima anche per violazioni minime",
          "Cumulo: penale + risarcimento + spese + interessi senza tetto",
          "Penale automatica senza distinguere dolo/colpa o gravità",
          "Obbligo di “manleva” totale anche per eventi non controllabili",
        ],
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Quanto vale la penale e quando scatta esattamente?",
          "È previsto un tetto massimo complessivo?",
          "È cumulabile con risarcimento/spese?",
          "Sono definite le modalità di contestazione (notifica, tempi)?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se la penale è sproporzionata?",
        buttonLabel: "Analizza l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/trattamento-dati-ruoli-gdpr",
    kind: "clausola",
    seo: {
      title: "GDPR: ruoli (titolare/responsabile) e istruzioni di trattamento",
      description:
        "Guida alla clausola GDPR: ruoli, istruzioni, misure di sicurezza, audit, incidenti e responsabilità. Dove nascono gli squilibri.",
    },
    hero: {
      h1: "Trattamento dati e ruoli GDPR",
      subtitle: "Se i ruoli sono confusi, il rischio diventa tuo.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/trasferimento-dati-e-subfornitori",
        "rischi/responsabilita-gdpr-sbilanciata",
      ],
      landings: ["contratto-privacy-gdpr", "contratto-servizi"],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti che coinvolgono dati personali, la parte critica è definire ruoli e responsabilità: chi decide finalità e mezzi (titolare) e chi tratta per conto (responsabile). Se il testo è vago, rischi obblighi e sanzioni non tue.",
      },
      {
        type: "bullets",
        title: "Cose che devono essere chiare",
        items: [
          "Ruolo di ciascuna parte (titolare/responsabile/contitolare)",
          "Istruzioni documentate del titolare (cosa puoi fare e cosa no)",
          "Misure di sicurezza minime richieste (realistiche e proporzionate)",
          "Gestione data breach e tempi di notifica",
          "Audit/ispezioni: limiti e preavviso",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se la clausola GDPR ti scarica responsabilità?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "clausole/trasferimento-dati-e-subfornitori",
    kind: "clausola",
    seo: {
      title:
        "Subfornitori e trasferimento dati: cosa controllare (cloud, extra-UE)",
      description:
        "Guida a subfornitori e trasferimenti dati (anche extra-UE): autorizzazioni, trasparenza, responsabilità e clausole critiche.",
    },
    hero: {
      h1: "Subfornitori e trasferimenti dati",
      subtitle: "Cloud, terze parti e extra-UE: dove si “apre” il rischio.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/trattamento-dati-ruoli-gdpr",
        "rischi/trasferimenti-dati-non-trasparenti",
      ],
      landings: ["contratto-privacy-gdpr", "contratto-servizi"],
    },
    blocks: [
      {
        type: "intro",
        text: "Se usi cloud o subfornitori, devi sapere cosa consente il contratto. Il rischio è una clausola che vieta subfornitori (impossibile da rispettare) o che li consente senza regole e poi ti scarica tutta la responsabilità.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Divieto assoluto di subfornitura anche per servizi standard (hosting, email, analytics)",
          "Autorizzazione “caso per caso” senza tempi (blocca operatività)",
          "Trasferimenti extra-UE non menzionati ma inevitabili in pratica",
          "Responsabilità totale a tuo carico anche per terze parti imposte",
        ],
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "Puoi usare subfornitori? Serve autorizzazione generale o specifica?",
          "Devi notificare un elenco? Con che modalità?",
          "Ci sono regole sui trasferimenti extra-UE?",
          "Chi gestisce incidenti su terze parti?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title:
          "Vuoi capire se puoi usare cloud e tool senza rischi contrattuali?",
        buttonLabel: "Analizza il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // ---------- RISCHI ----------
  {
    slug: "rischi/nda-troppo-ampia",
    kind: "rischio",
    seo: {
      title: "NDA troppo ampia: quando ti blocca più del necessario",
      description:
        "Rischio NDA troppo ampia: definizione “tutto è confidenziale”, limiti assenti, uso vietato e obblighi non realistici.",
    },
    hero: {
      h1: "NDA troppo ampia",
      subtitle:
        "Quando “confidenziale” significa tutto (e tu non puoi lavorare).",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/nda-confidenzialita",
        "clausole/eccezioni-confidenzialita",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio nasce quando l’NDA definisce confidenziale qualsiasi cosa, anche informazioni banali o già note nel settore. Questo può impedirti di riutilizzare know-how e creare conflitti anche senza divulgazione reale.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Definizione totale",
            text: "‘Qualsiasi informazione’ senza distinguere sensibilità o contesto.",
          },
          {
            title: "Divieto di uso",
            text: "Non puoi usare le info nemmeno per eseguire il contratto in modo efficace.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se l’NDA è troppo ampia?",
        buttonLabel: "Carica l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/obbligo-confidenzialita-indefinito",
    kind: "rischio",
    seo: {
      title: "Obbligo di confidenzialità indefinito: perché è pericoloso",
      description:
        "Rischio di obbligo NDA senza scadenza: vincoli per sempre, conflitti futuri e impossibilità di usare competenze e materiali.",
    },
    hero: {
      h1: "Confidenzialità indefinita",
      subtitle: "Quando l’obbligo non finisce mai e diventa un rischio futuro.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/durata-nda-e-obblighi",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Se l’obbligo di confidenzialità è indefinito, il rischio non è solo “non parlare”: è non poter dimostrare lavori, non poter riusare soluzioni standard e vivere con incertezza legale.",
      },
      {
        type: "bullets",
        title: "Segnali di rischio",
        items: [
          "Durata “per sempre” senza distinguere segreti reali vs info ordinarie",
          "Nessuna regola su cosa diventa pubblico o obsoleto",
          "Obbligo di distruzione/cancellazione totale senza eccezioni operative",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se la durata è sbilanciata?",
        buttonLabel: "Analizza l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/eccezioni-mancanti-nda",
    kind: "rischio",
    seo: {
      title: "Eccezioni mancanti nell’NDA: il rischio più sottovalutato",
      description:
        "Se mancano eccezioni standard (pubblico dominio, legge, pre-esistenza), rischi violazioni “involontarie”. Ecco cosa controllare.",
    },
    hero: {
      h1: "Eccezioni mancanti",
      subtitle: "Quando rischi di violare l’NDA anche senza colpa.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/eccezioni-confidenzialita",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Senza eccezioni, l’NDA può diventare una trappola: ti vincola anche su informazioni pubbliche, su obblighi imposti dalla legge o su contenuti che avevi già prima.",
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Pubblico dominio: c’è?",
          "Obblighi di legge/autorità: c’è una procedura?",
          "Pre-esistenza e sviluppo indipendente: sono previsti?",
          "Terze parti: è coperto il caso di info ricevute legittimamente?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi vedere se mancano eccezioni fondamentali?",
        buttonLabel: "Carica l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/penali-sproporzionate-nda",
    kind: "rischio",
    seo: {
      title: "Penali sproporzionate nell’NDA: quando il rischio è economico",
      description:
        "Penali NDA troppo alte o automatiche: cumuli, manleve e assenza di tetti massimi. Cosa controllare prima di firmare.",
    },
    hero: {
      h1: "Penali sproporzionate (NDA)",
      subtitle: "Quando una clausola diventa un rischio economico enorme.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/penali-per-violazione-nda",
      ],
      landings: ["contratto-nda"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è una penale che scatta facilmente e costa molto, magari sommata a risarcimenti e spese legali. In pratica: anche un errore piccolo può diventare un danno enorme.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Penale automatica",
            text: "Scatta senza distinguere gravità o colpa.",
          },
          {
            title: "Cumulo senza limiti",
            text: "Penale + risarcimento + spese senza tetto massimo.",
          },
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi capire quanto rischi davvero?",
        buttonLabel: "Analizza l’NDA",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/responsabilita-gdpr-sbilanciata",
    kind: "rischio",
    seo: {
      title:
        "Responsabilità GDPR sbilanciata: quando ti scaricano tutto addosso",
      description:
        "Rischio GDPR: ruoli confusi, manleve totali, obblighi impossibili e audit invasivi. Come riconoscere una clausola sbilanciata.",
    },
    hero: {
      h1: "Responsabilità GDPR sbilanciata",
      subtitle: "Ruoli confusi = rischio di sanzioni e responsabilità non tue.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/trattamento-dati-ruoli-gdpr",
        "clausole/trasferimento-dati-e-subfornitori",
      ],
      landings: ["contratto-privacy-gdpr", "contratto-servizi"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio nasce quando il contratto ti attribuisce obblighi da “titolare” pur essendo di fatto un “responsabile”, oppure ti impone manleve totali e audit senza limiti. Risultato: responsabilità e costi sproporzionati.",
      },
      {
        type: "bullets",
        title: "Segnali tipici",
        items: [
          "Ruoli non definiti o contraddittori",
          "Manleva totale per qualsiasi violazione anche non dipendente da te",
          "Audit frequenti senza preavviso o senza limiti",
          "Obblighi tecnici non realistici o non proporzionati al servizio",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il GDPR è scritto “contro di te”?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },
  {
    slug: "rischi/trasferimenti-dati-non-trasparenti",
    kind: "rischio",
    seo: {
      title:
        "Trasferimenti dati non trasparenti: cloud e subfornitori come rischio",
      description:
        "Rischio trasferimenti dati: subfornitori non dichiarati, extra-UE implicito, divieti impossibili e responsabilità scaricate.",
    },
    hero: {
      h1: "Trasferimenti dati non trasparenti",
      subtitle: "Quando i dati “viaggiano” ma il contratto fa finta di no.",
    },
    related: {
      editorial: [
        "contratti/privacy-nda-dati",
        "clausole/trasferimento-dati-e-subfornitori",
        "rischi/responsabilita-gdpr-sbilanciata",
      ],
      landings: ["contratto-privacy-gdpr", "contratto-servizi"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è operativo e legale: usi strumenti cloud e subfornitori, ma il contratto li vieta o non li disciplina. Oppure li consente, ma poi ti scarica tutta la responsabilità senza regole chiare.",
      },
      {
        type: "checklist",
        title: "Checklist rapida",
        items: [
          "Il contratto consente subfornitori/fornitori cloud?",
          "Richiede autorizzazioni? Sono realistiche nei tempi?",
          "È gestito il caso extra-UE?",
          "È chiaro chi fa cosa in caso di incidenti su terze parti?",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare se puoi usare i tuoi tool senza rischi?",
        buttonLabel: "Analizza il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // =========================================================
  // CLUSTER: UTENZE / SERVIZI (energia, gas, internet, telco)
  // =========================================================
  {
    slug: "contratti/utenze-servizi",
    kind: "hub",
    seo: {
      title:
        "Contratti di utenze e servizi: cosa controllare prima di attivare",
      description:
        "Guida pratica a luce, gas, internet e telefonia: rinnovi, rimodulazioni, penali, addebiti extra e cosa verificare nel contratto.",
    },
    hero: {
      h1: "Contratti di utenze e servizi",
      subtitle:
        "Rinnovi, penali, costi nascosti e addebiti: i punti che creano più problemi.",
    },
    related: {
      editorial: [
        "utenze/guida-rapida",
        "utenze/rischi",
        "utenze/clausole",

        "clausole/rinnovo-tacito-utenze",
        "clausole/rimodulazioni-variazioni-prezzo",
        "clausole/recesso-disdetta-utenze",
        "clausole/penali-chiusura-anticipata-utenze",
        "clausole/addebito-sdd-metodi-pagamento",

        "rischi/rinnovo-tacito-nascosto-utenze",
        "rischi/rimodulazione-imprevista",
        "rischi/addebiti-extra-non-previsti",
        "rischi/penali-recesso-anticipato-utenze",
        "rischi/conguagli-bolletta-opachi",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
        "contratto-servizi-digitali",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di utenze il problema raramente è la prima bolletta: spesso nasce da rinnovi taciti, rimodulazioni, penali di uscita, addebiti extra e formule poco chiare su conguagli e costi accessori.",
      },
      {
        type: "bullets",
        title: "Cose da controllare sempre",
        items: [
          "Durata, rinnovo tacito e come disdire",
          "Variazioni prezzo (rimodulazioni) e come vengono comunicate",
          "Penali/costi di chiusura anticipata e restituzione apparati",
          "Addebiti extra (attivazione, modem, servizi aggiuntivi)",
          "Conguagli: criteri, letture e documentazione",
          "Metodo di pagamento (SDD) e cosa succede in caso di contestazione",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il tuo contratto di utenze è chiaro?",
        text: "Caricalo: evidenziamo rinnovi, penali, rimodulazioni e costi extra nascosti.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "utenze/guida-rapida",
    kind: "hub",
    seo: {
      title: "Contratti utenze: guida rapida (check in 2 minuti)",
      description:
        "Checklist velocissima per luce, gas, internet e telefonia: rinnovo, disdetta, rimodulazioni, penali e addebiti extra.",
    },
    hero: {
      h1: "Guida rapida contratti utenze",
      subtitle: "2 minuti. 10 controlli. Evita penali e costi extra.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "utenze/clausole",
        "utenze/rischi",
        "clausole/rinnovo-tacito-utenze",
        "clausole/recesso-disdetta-utenze",
        "clausole/rimodulazioni-variazioni-prezzo",
        "rischi/addebiti-extra-non-previsti",
        "rischi/rimodulazione-imprevista",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Se stai per attivare (o hai già attivato) un’utenza: questa guida ti fa trovare subito i punti che generano più problemi in pratica.",
      },
      {
        type: "checklist",
        title: "Checklist (2 minuti): 10 cose da controllare",
        items: [
          "1) Durata: scadenza reale e rinnovo tacito",
          "2) Disdetta/recesso: tempi e modalità (canali, indirizzi, moduli)",
          "3) Penali/costi di uscita: importi e condizioni",
          "4) Variazioni prezzo: quando possono cambiare e come avvisano",
          "5) Costi accessori: attivazione, gestione, spedizioni, pratiche",
          "6) Apparati: modem/router, rate, restituzione e costi se non rientra",
          "7) Servizi inclusi: cosa è davvero incluso e cosa è opzionale",
          "8) Bolletta: conguagli, letture, stime e documenti",
          "9) Pagamento SDD: come bloccare addebiti e contestare",
          "10) Comunicazioni: dove ti scrivono (email/SMS/app) e cosa vale come notifica",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi la versione “zero dubbi” sul tuo contratto?",
        text: "Caricalo: troviamo subito rinnovi, penali, rimodulazioni e addebiti extra.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "utenze/clausole",
    kind: "hub",
    seo: {
      title:
        "Clausole dei contratti di utenze: le più importanti da controllare",
      description:
        "Le clausole chiave di luce, gas, internet e telefonia: rinnovo tacito, rimodulazioni, recesso, penali, addebiti SDD e conguagli.",
    },
    hero: {
      h1: "Clausole nei contratti di utenze",
      subtitle:
        "Le clausole che decidono costi, uscita e sorprese in bolletta.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/rinnovo-tacito-utenze",
        "clausole/rimodulazioni-variazioni-prezzo",
        "clausole/recesso-disdetta-utenze",
        "clausole/penali-chiusura-anticipata-utenze",
        "clausole/addebito-sdd-metodi-pagamento",
        "clausole/conguagli-letture-stime",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Le clausole critiche nelle utenze non sono quelle più lunghe: sono quelle che ti vincolano (rinnovi/disdetta), cambiano il prezzo (rimodulazioni) o aggiungono costi (penali, apparati, servizi).",
      },
      {
        type: "bullets",
        title: "Le clausole più “pericolose” se scritte male",
        items: [
          "Rinnovo tacito e disdetta (tempi e canali)",
          "Rimodulazioni e variazioni di prezzo",
          "Penali/costi di chiusura anticipata",
          "Addebito SDD e gestione contestazioni",
          "Conguagli, letture, stime e prove",
          "Apparati (modem) e restituzione",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi sapere quali clausole sono davvero critiche nel tuo contratto?",
        text: "Caricalo: individuiamo subito le frasi vaghe e i punti sbilanciati.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "utenze/rischi",
    kind: "hub",
    seo: {
      title:
        "Rischi nei contratti di utenze: i problemi più comuni e come riconoscerli",
      description:
        "Rischi tipici in luce, gas, internet e telefonia: rinnovo tacito, rimodulazioni, penali, addebiti extra e conguagli opachi.",
    },
    hero: {
      h1: "Rischi nei contratti di utenze",
      subtitle: "I problemi più comuni (e dove si nascondono nel testo).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "rischi/rinnovo-tacito-nascosto-utenze",
        "rischi/rimodulazione-imprevista",
        "rischi/addebiti-extra-non-previsti",
        "rischi/penali-recesso-anticipato-utenze",
        "rischi/conguagli-bolletta-opachi",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Qui trovi i rischi più frequenti nelle utenze: non tanto “il prezzo”, ma tutto ciò che rende difficile uscire o prevedere il costo totale nel tempo.",
      },
      {
        type: "bullets",
        title: "Rischi che ti legano al contratto",
        items: [
          "Rinnovo tacito nascosto e disdetta complicata",
          "Penali/costi di uscita anticipata e restituzione apparati",
        ],
      },
      {
        type: "bullets",
        title: "Rischi economici (bollette e addebiti)",
        items: [
          "Rimodulazioni improvvise (prezzo che cambia nel tempo)",
          "Addebiti extra non previsti (servizi, apparati, costi gestione)",
          "Conguagli opachi (stime, letture non verificabili, documenti mancanti)",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi sapere quali rischi ci sono nel tuo contratto specifico?",
        text: "Caricalo: evidenziamo le clausole che creano costi extra e vincoli.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // --- CLAUSOLE UTENZE
  {
    slug: "clausole/rinnovo-tacito-utenze",
    kind: "clausola",
    seo: {
      title: "Rinnovo tacito nelle utenze: come funziona e cosa controllare",
      description:
        "Rinnovo tacito in luce, gas, internet e telefonia: durata, scadenze, disdetta e clausole che rendono difficile uscire.",
    },
    hero: {
      h1: "Rinnovo tacito (utenze)",
      subtitle:
        "Scadenze e disdetta: quando il contratto “si rinnova da solo”.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/recesso-disdetta-utenze",
        "rischi/rinnovo-tacito-nascosto-utenze",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rinnovo tacito è critico quando scadenze e modalità di disdetta non sono chiarissime. Il rischio è restare vincolati (o pagare costi extra) perché la disdetta non rispetta tempi/canali previsti.",
      },
      {
        type: "checklist",
        title: "Checklist (60 secondi)",
        items: [
          "Qual è la durata e quando scade davvero?",
          "Il rinnovo è automatico? per quanto tempo?",
          "Quando e come puoi disdire (canale/indirizzo/modulo)?",
          "Ci sono costi o condizioni legate alla disdetta?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se il rinnovo è scritto in modo chiaro?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/recesso-disdetta-utenze",
    kind: "clausola",
    seo: {
      title:
        "Recesso e disdetta nelle utenze: tempi, modalità e punti a rischio",
      description:
        "Come disdire luce, gas, internet e telefonia: tempi, canali, moduli e clausole che possono invalidare la disdetta.",
    },
    hero: {
      h1: "Recesso e disdetta (utenze)",
      subtitle: "Tempi e modalità: l’errore pratico più comune.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/rinnovo-tacito-utenze",
        "clausole/penali-chiusura-anticipata-utenze",
        "rischi/rinnovo-tacito-nascosto-utenze",
        "rischi/penali-recesso-anticipato-utenze",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Molti problemi nascono da disdette inviate nel modo sbagliato (canale, indirizzo, modulo) o con tempi non chiari. Se il contratto è rigido, rischi rinnovi e costi di uscita.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Canali obbligatori senza alternative realistiche",
          "Moduli o procedure non allegati o poco chiari",
          "Decorrenza del preavviso ambigua",
          "Costi legati alla chiusura non evidenziati",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi evitare una disdetta “non valida”?",
        text: "Carica il contratto: verifichiamo tempi, canali e costi di uscita.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/rimodulazioni-variazioni-prezzo",
    kind: "clausola",
    seo: {
      title:
        "Rimodulazioni e variazioni di prezzo: cosa controllare nel contratto",
      description:
        "Come sono scritte le variazioni di prezzo (rimodulazioni) in utenze e servizi: quando possono cambiare, come avvisano e cosa vale.",
    },
    hero: {
      h1: "Rimodulazioni e variazioni prezzo",
      subtitle: "Quando il costo cambia nel tempo (e come lo scopri).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "rischi/rimodulazione-imprevista",
        "clausole/rinnovo-tacito-utenze",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Una clausola di variazione prezzo è rischiosa se è troppo ampia, poco trasparente o se la comunicazione non è chiara (dove ti avvisano e con quale anticipo).",
      },
      {
        type: "checklist",
        title: "Checklist (1 minuto)",
        items: [
          "In quali casi possono cambiare prezzo o condizioni?",
          "Con quanto preavviso devono avvisarti?",
          "Dove comunicano la variazione (email/SMS/app/bolletta)?",
          "Cosa puoi fare se non accetti (recesso senza costi)?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title:
          "Vuoi capire se la rimodulazione è scritta in modo troppo largo?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/penali-chiusura-anticipata-utenze",
    kind: "clausola",
    seo: {
      title:
        "Penali e costi di chiusura anticipata: cosa controllare nelle utenze",
      description:
        "Guida a penali e costi di uscita anticipata in luce, gas, internet e telefonia: importi, condizioni, apparati e restituzioni.",
    },
    hero: {
      h1: "Penali e costi di uscita",
      subtitle: "Quando chiudere costa troppo (o non è spiegato bene).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/recesso-disdetta-utenze",
        "rischi/penali-recesso-anticipato-utenze",
      ],
      landings: [
        "contratto-internet",
        "contratto-telefonia",
        "contratto-luce-gas",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Nei contratti di utenze e servizi spesso i costi “veri” emergono quando vuoi uscire: penali, costi di disattivazione, rate apparati, restituzioni e spese amministrative.",
      },
      {
        type: "bullets",
        title: "Cose da controllare",
        items: [
          "Penale fissa o calcolo (mesi residui / percentuali)",
          "Costi di disattivazione o gestione pratica",
          "Rate residue di modem/apparati",
          "Restituzione apparati: tempi, prova spedizione e costi se non rientra",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire quanto ti costa davvero uscire?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/addebito-sdd-metodi-pagamento",
    kind: "clausola",
    seo: {
      title:
        "Addebito SDD e metodi di pagamento: cosa controllare nel contratto",
      description:
        "SDD/addebito diretto, fatturazione e contestazioni: cosa dice il contratto e dove possono nascere addebiti indesiderati.",
    },
    hero: {
      h1: "Addebito SDD e pagamenti",
      subtitle: "Quando il pagamento automatico può diventare un problema.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "rischi/addebiti-extra-non-previsti",
        "rischi/conguagli-bolletta-opachi",
      ],
      landings: [
        "contratto-luce-gas",
        "contratto-internet",
        "contratto-telefonia",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il pagamento automatico (SDD) è comodo, ma diventa rischioso se il contratto consente addebiti extra con formule vaghe o se la gestione contestazioni è poco chiara.",
      },
      {
        type: "checklist",
        title: "Checklist pratica",
        items: [
          "Quando possono fare addebiti extra e con quale descrizione?",
          "Come e in che tempi puoi contestare un addebito?",
          "Cosa succede se blocchi l’SDD (sospensione, penali, interessi)?",
          "Dove arrivano le fatture e cosa vale come notifica?",
        ],
      },
      {
        type: "cta",
        variant: "soft",
        title: "Vuoi capire se l’SDD ti espone a rischi inutili?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "clausole/conguagli-letture-stime",
    kind: "clausola",
    seo: {
      title:
        "Conguagli, letture e stime: cosa controllare in bolletta e contratto",
      description:
        "Come sono gestiti conguagli, letture contatori e stime: criteri, prove e clausole che rendono i costi imprevedibili.",
    },
    hero: {
      h1: "Conguagli, letture e stime",
      subtitle: "Quando la bolletta non è verificabile (e il costo esplode).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "rischi/conguagli-bolletta-opachi",
      ],
      landings: ["contratto-luce-gas"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio nasce quando conguagli e letture non hanno criteri chiari o documentazione: stime prolungate, rettifiche tardive e importi difficili da verificare.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Stime frequenti senza indicare quando si farà lettura reale",
          "Conguagli senza dettaglio di letture/periodi",
          "Documentazione non prevista o difficile da ottenere",
          "Regole “elastiche” che rendono il costo imprevedibile",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se conguagli e letture sono gestiti bene?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // --- RISCHI UTENZE
  {
    slug: "rischi/rinnovo-tacito-nascosto-utenze",
    kind: "rischio",
    seo: {
      title:
        "Rinnovo tacito nascosto: come riconoscerlo nei contratti di utenze",
      description:
        "Scadenze poco visibili e disdetta complicata: quando il rinnovo tacito ti lega al contratto senza accorgertene.",
    },
    hero: {
      h1: "Rinnovo tacito nascosto",
      subtitle:
        "Il rischio: restare dentro perché disdetta e scadenze non sono chiare.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/rinnovo-tacito-utenze",
        "clausole/recesso-disdetta-utenze",
      ],
      landings: [
        "contratto-internet",
        "contratto-telefonia",
        "contratto-luce-gas",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rinnovo tacito è ‘nascosto’ quando il contratto non rende evidenti scadenza e procedura di disdetta (canali, moduli, indirizzi). Il risultato è un rinnovo automatico e costi di uscita.",
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi verificare scadenza e disdetta nel tuo contratto?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/rimodulazione-imprevista",
    kind: "rischio",
    seo: {
      title:
        "Rimodulazione imprevista: quando il prezzo cambia e non te ne accorgi",
      description:
        "Rimodulazioni in internet/telefonia/energia: comunicazioni poco chiare, preavvisi vaghi e costi che aumentano nel tempo.",
    },
    hero: {
      h1: "Rimodulazione imprevista",
      subtitle: "Quando il costo cambia nel tempo senza essere davvero chiaro.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/rimodulazioni-variazioni-prezzo",
        "clausole/recesso-disdetta-utenze",
      ],
      landings: [
        "contratto-internet",
        "contratto-telefonia",
        "contratto-luce-gas",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio non è che il prezzo possa cambiare, ma che il contratto renda poco chiaro come vieni avvisato e cosa puoi fare per uscire senza costi quando non accetti la variazione.",
      },
      {
        type: "examples",
        title: "Esempi tipici",
        items: [
          {
            title: "Notifica “debole”",
            text: "Comunicazioni in bolletta o area clienti che passano inosservate.",
          },
          {
            title: "Preavviso vago",
            text: "Termini non chiari su quando scatta la variazione e da quando vale.",
          },
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title:
          "Vuoi capire se la rimodulazione è scritta in modo troppo ampio?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/addebiti-extra-non-previsti",
    kind: "rischio",
    seo: {
      title:
        "Addebiti extra non previsti: quando paghi più del prezzo pubblicizzato",
      description:
        "Costi extra in utenze e servizi: attivazioni, gestione, apparati, servizi opzionali e addebiti automatici poco trasparenti.",
    },
    hero: {
      h1: "Addebiti extra non previsti",
      subtitle:
        "Quando il costo reale è “prezzo + extra” (e non te lo dicono bene).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/addebito-sdd-metodi-pagamento",
        "clausole/penali-chiusura-anticipata-utenze",
      ],
      landings: [
        "contratto-internet",
        "contratto-telefonia",
        "contratto-luce-gas",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "Un rischio tipico è scoprire costi extra non evidenti: attivazione, gestione, apparati a rate, servizi ‘inclusi’ che diventano a pagamento, o addebiti automatici difficili da contestare.",
      },
      {
        type: "checklist",
        title: "Checklist: cosa cercare nel testo",
        items: [
          "C’è un elenco completo dei costi accessori?",
          "Gli optional sono davvero opzionali (disattivabili)?",
          "Apparati: costo totale, rate e restituzione sono chiari?",
          "Addebiti SDD: come contestare e in che tempi?",
        ],
      },
      {
        type: "cta",
        variant: "strong",
        title: "Vuoi capire il costo totale del tuo contratto?",
        text: "Caricalo: evidenziamo extra, apparati, servizi aggiuntivi e condizioni di addebito.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/penali-recesso-anticipato-utenze",
    kind: "rischio",
    seo: {
      title: "Penali per recesso anticipato: quando uscire costa troppo",
      description:
        "Penali e costi di uscita nelle utenze: importi, rate apparati, costi di disattivazione e clausole che ti bloccano.",
    },
    hero: {
      h1: "Penali per recesso anticipato",
      subtitle: "Quando vuoi uscire e scopri che costa più del previsto.",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/penali-chiusura-anticipata-utenze",
        "clausole/recesso-disdetta-utenze",
      ],
      landings: ["contratto-internet", "contratto-telefonia"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio concreto è firmare un contratto che rende l’uscita costosa: penali fisse, costi amministrativi, rate residue di apparati e restituzioni con regole rigide.",
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire quanto ti costa davvero chiudere?",
        buttonLabel: "Carica il contratto",
        buttonHref: "/upload",
      },
    ],
  },

  {
    slug: "rischi/conguagli-bolletta-opachi",
    kind: "rischio",
    seo: {
      title:
        "Conguagli opachi in bolletta: quando non riesci a verificare i consumi",
      description:
        "Conguagli difficili da capire: letture stimate, rettifiche tardive e documenti mancanti. Cosa controllare nel contratto e nelle condizioni.",
    },
    hero: {
      h1: "Conguagli opachi",
      subtitle: "Quando non è chiaro come si calcola (e diventa contestabile).",
    },
    related: {
      editorial: [
        "contratti/utenze-servizi",
        "clausole/conguagli-letture-stime",
      ],
      landings: ["contratto-luce-gas"],
    },
    blocks: [
      {
        type: "intro",
        text: "Il rischio è pagare importi che non riesci a verificare: periodi non chiari, letture stimate a lungo, conguagli senza prove e regole contrattuali troppo elastiche.",
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se il contratto gestisce bene letture e conguagli?",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },

  // =========================================================
  // EXTRA LAVORO (mancanti tipiche): riservatezza + esclusiva
  // =========================================================

  {
    slug: "clausole/esclusiva-rapporto-lavoro",
    kind: "clausola",
    seo: {
      title: "Clausola di esclusiva: quando ti blocca altri lavori o clienti",
      description:
        "Esclusiva nei contratti di lavoro e collaborazione: limiti, durata, compenso e rischi se impedisce altri incarichi.",
    },
    hero: {
      h1: "Esclusiva",
      subtitle: "Quando il contratto ti impedisce di lavorare per altri.",
    },
    related: {
      editorial: [
        "contratti/lavoro-collaborazioni",
        "clausole/non-concorrenza",
        "rischi/non-concorrenza-eccessiva",
      ],
      landings: [
        "contratto-lavoro",
        "contratto-collaborazione",
        "contratto-partita-iva",
      ],
    },
    blocks: [
      {
        type: "intro",
        text: "L’esclusiva è critica quando è generica (qualsiasi attività), quando non ha limiti chiari o quando di fatto ti impedisce di lavorare con altri clienti senza un corrispettivo adeguato.",
      },
      {
        type: "bullets",
        title: "Campanelli d’allarme",
        items: [
          "Divieto su attività troppo generiche o non definite",
          "Limiti senza durata o con durata lunga",
          "Obbligo di autorizzazione discrezionale",
          "Nessun compenso o indennizzo per l’esclusiva",
        ],
      },
      {
        type: "cta",
        variant: "mid",
        title: "Vuoi capire se l’esclusiva è scritta in modo sbilanciato?",
        text: "Carica il contratto: controlliamo limiti, durata e impatto reale sul tuo lavoro.",
        buttonLabel: "Analizza il mio contratto",
        buttonHref: "/upload",
      },
    ],
  },
];

export function getEditorialBySlug(slug: string) {
  return EDITORIAL_PAGES.find((p) => p.slug === slug) ?? null;
}

export const editorialSlugs = EDITORIAL_PAGES.map((p) => p.slug);

// ✅ dev-only: fail fast se qualcuno duplica uno slug
if (process.env.NODE_ENV !== "production") {
  const slugs = new Set<string>();
  const missing = new Set<string>();

  for (const p of EDITORIAL_PAGES) {
    if (slugs.has(p.slug)) {
      throw new Error(`Duplicated editorial slug: ${p.slug}`);
    }
    slugs.add(p.slug);
  }
  if (missing.size) {
    throw new Error(
      `Broken related.editorial slugs:\n- ${[...missing].sort().join("\n- ")}`
    );
  }
}

const bySlug = new Set(EDITORIAL_PAGES.map((p) => p.slug));

const missingRelated = EDITORIAL_PAGES.flatMap((p) => {
  const rel = p.related?.editorial ?? [];
  return rel
    .filter((s) => !bySlug.has(s))
    .map((s) => ({ from: p.slug, missing: s }));
});

console.log("Pagine totali:", EDITORIAL_PAGES.length);
console.log("Related mancanti:", missingRelated);
