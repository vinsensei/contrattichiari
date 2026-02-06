import HeaderPublic from "@/components/HeaderPublic";
import Link from "next/link";

export const metadata = {
  title: "Contratti Chiari – Analisi contratti con AI",
  alternates: {
    canonical: "https://contrattichiari.it/",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* HEADER */}
      <HeaderPublic />

      {/* MAIN */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16">
        {/* HERO */}
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen pb-10 pt-10 overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            <div className="flex flex-1 flex-col gap-8 md:flex-row md:items-center">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[14px] font-bold text-black">
                  Contratti chiari, amicizia lunga.
                </span>

                <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                  Carica il tuo contratto,
                  <br className="hidden sm:block" />
                  noi ti spieghiamo{" "}
                  <span className="text-sky-500">
                    cosa c&apos;è scritto davvero.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text leading-relaxed text-zinc-900">
                  ContrattiChiari legge il tuo PDF, evidenzia le clausole
                  critiche e ti restituisce un riassunto in italiano semplice.
                  Una base chiara per decidere se firmare così com&apos;è o cosa
                  chiedere di modificare.
                </p>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
                  >
                    Carica un contratto
                  </Link>
                </div>
                <br />
                <p className="text-xs text-zinc-800">
                  Prima analisi rapida, linguaggio umano, nessun gergo da codice
                  civile.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Link
                    href="/contratto-affitto"
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12px] text-zinc-800 transition hover:bg-sky-200 border-1 border-solid border-sky-200 hover:border-sky-700 hover:text-zinc-800"
                  >
                    Affitti abitativi
                  </Link>
                  <Link
                    href="/contratti/lavoro-collaborazioni"
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12px] text-zinc-800 transition hover:bg-sky-200 border-1 border-solid border-sky-200 hover:border-sky-700 hover:text-zinc-800"
                  >
                    Contratti di lavoro
                  </Link>

                  <Link
                    href="/rischi/rinnovo-automatico-saas"
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12px] text-zinc-800 transition hover:bg-sky-200 border-1 border-solid border-sky-200 hover:border-sky-700 hover:text-zinc-800"
                  >
                    Contratti SaaS
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex flex-1 justify-center md:mt-0">
                <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Uno sguardo all&apos;analisi
                  </p>
                  <div className="mt-3 space-y-2 rounded-2xl bg-zinc-100 p-3">
                    <p className="text-[11px] font-semibold text-zinc-700">
                      Rischio complessivo:{" "}
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-[2px] text-[10px] font-semibold text-amber-900">
                        medio
                      </span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-zinc-800">
                      Il contratto è generalmente corretto, ma contiene alcuni
                      punti sbilanciati a favore del locatore (recesso, penali,
                      aggiornamento canone).
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl border border-zinc-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-zinc-800">
                        Clausola di recesso anticipato
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-600 line-clamp-3">
                        La clausola prevede una penale fissa di 3 mensilità
                        anche in caso di gravi motivi, soluzione non sempre
                        proporzionata...
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-zinc-800">
                        Aggiornamento ISTAT
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-600 line-clamp-3">
                        Il canone viene aggiornato automaticamente al 100%
                        dell&apos;indice ISTAT: puoi negoziare una soglia più
                        bassa o un tetto massimo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="blue_moon"></div>
        </section>

        {/* COME FUNZIONA */}
        <section
          className="mt-16 mb-16 grid gap-6 rounded-2xl border border-zinc-200 p-6 text-sm sm:grid-cols-[1.3fr,1.1fr]"
          style={{ backgroundColor: "#fff" }}
        >
          {/* COLONNA SINISTRA */}
          <div className="space-y-4">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "#2ABEFF" }}
            >
              Come funziona
            </p>

            <h2 className="text-lg font-semibold text-zinc-900">
              Come funziona Contratti Chiari
            </h2>

            <ol className="space-y-3 text-zinc-800">
              <li className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#2ABEFF" }}
                >
                  1
                </span>
                <span>
                  <strong>Carica il contratto</strong> – PDF, foto o scansione
                  del documento.
                </span>
              </li>

              <li className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#2ABEFF" }}
                >
                  2
                </span>
                <span>
                  <strong>Analisi gratuita</strong> – ti mostriamo subito i
                  punti critici principali.
                </span>
              </li>

              <li className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#2ABEFF" }}
                >
                  3
                </span>
                <span>
                  <strong>Analisi completa</strong> – PDF, storico e dettaglio
                  se vuoi approfondire.
                </span>
              </li>
            </ol>

            <p className="text text-zinc-800">
              Linguaggio semplice, senza tecnicismi inutili.
            </p>
          </div>

          {/* COLONNA DESTRA */}
          <div
            className="space-y-3 rounded-xl p-4 bg-sky-50">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide text-sky-950">
              Cosa ottieni
            </p>

            <p className="leading-relaxed text-sky-950">
              Una lettura chiara del contratto: clausole sbilanciate, rischi
              concreti per te e punti che puoi provare a rinegoziare prima di
              firmare.
            </p>
          </div>
        </section>

        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-sky-50 pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center"></div>

            {/* PER CHI È PENSATO */}
            <section className="mt-12">
              <h2 className="text-lg font-semibold text-sky-950">
                Pensato per i contratti che firmi davvero
              </h2>
              <div className="mt-4 grid gap-4 text-xs text-zinc-600 sm:grid-cols-3">
                <div className="rounded-2xl border border-sky-200 bg-white p-4">
                  <p className="font-semibold text-zinc-900">
                    Clausole critiche in evidenza
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Individuiamo i punti più sbilanciati e ti spieghiamo perché
                    possono essere un problema per te, prima di firmare.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-white p-4">
                  <p className="font-semibold text-zinc-900">
                    Linguaggio umano, non da codice civile
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Sintesi, esempi e glossario in linguaggio quotidiano, per
                    capire al volo cosa stai accettando.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-white p-4">
                  <p className="font-semibold text-zinc-900">
                    Affitti, lavoro, collaborazioni, servizi
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Ottimizzato per i contratti che incontri più spesso nella
                    vita reale: locazioni, incarichi, consulenze, servizi
                    digitali.
                  </p>
                </div>
              </div>
            </section>

            {/* GUIDE RAPIDE */}
            <section className="mt-12">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-950">
                    Guide rapide
                  </p>
                  <h2 className="text-lg font-semibold text-sky-950">
                    Rischi e clausole più comuni (in 2 minuti)
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-600">
                    Se vuoi orientarti prima di caricare un PDF, parti da qui:
                    esempi concreti e spiegazioni in linguaggio semplice.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 text-xs sm:grid-cols-3">
                <Link
                  href="/rischi/addebiti-extra-non-previsti"
                  className="group rounded-2xl border border-sky-200 bg-white p-4 transition hover:border-zinc-300"
                >
                  <p className="font-semibold text-zinc-900 group-hover:text-zinc-950">
                    Addebiti extra non previsti
                  </p>
                  <p className="mt-1 leading-relaxed text-zinc-600">
                    Costi aggiuntivi, conguagli e voci ambigue: cosa controllare
                    e cosa chiedere di chiarire.
                  </p>
                  <p className="mt-3 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-700">
                    Leggi la guida →
                  </p>
                </Link>

                <Link
                  href="/contratto-affitto"
                  className="group rounded-2xl border border-sky-200 bg-white p-4 transition hover:border-zinc-300"
                >
                  <p className="font-semibold text-zinc-900 group-hover:text-zinc-950">
                    Contratto di affitto
                  </p>
                  <p className="mt-1 leading-relaxed text-zinc-600">
                    Le clausole che contano davvero: recesso, deposito, penali,
                    rinnovo e aggiornamento ISTAT.
                  </p>
                  <p className="mt-3 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-700">
                    Vai alla pagina →
                  </p>
                </Link>

                <Link
                  href="/contratto-noleggio-auto-lungo-termine"
                  className="group rounded-2xl border border-sky-200 bg-white p-4 transition hover:border-zinc-300"
                >
                  <p className="font-semibold text-zinc-900 group-hover:text-zinc-950">
                    Noleggio auto lungo termine
                  </p>
                  <p className="mt-1 leading-relaxed text-zinc-600">
                    Attenzione a franchigie, manutenzione, penali e condizioni
                    di restituzione del veicolo.
                  </p>
                  <p className="mt-3 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-700">
                    Vai alla pagina →
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-4 border-t border-zinc-200 bg-white/80 py-4 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p className="order-2 sm:order-1">
            © {new Date().getFullYear()} ContrattiChiari.
          </p>
          <div className="order-1 flex flex-wrap items-center justify-center gap-4 sm:order-2">
            <Link href="/cookie" className="hover:text-zinc-800">
              Cookie Policy
            </Link>
            <Link href="/privacy" className="hover:text-zinc-800">
              Privacy policy
            </Link>
            <Link href="/termini" className="hover:text-zinc-800">
              Termini e condizioni
            </Link>
            <Link href="/contratto-affitto" className="hover:text-zinc-800">
              Contratto di affitto
            </Link>
            <Link
              href="/contratto-noleggio-auto-lungo-termine"
              className="hover:text-zinc-800"
            >
              Noleggio auto lungo termine
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
