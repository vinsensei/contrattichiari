import HeaderPublic from "@/components/HeaderPublic";
import Link from "next/link";

export const metadata = {
  title: "ContrattoChiaro – Analisi contratti con AI",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      {/* HEADER */}
      <HeaderPublic />

      {/* MAIN */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16">
        {/* HERO */}
        <section className="flex flex-1 flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-medium text-sky-900">
              Contratti chiari, amicizia lunga.
            </span>

            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
              Carica il tuo contratto,
              <br className="hidden sm:block" />
              noi ti spieghiamo cosa c&apos;è scritto davvero.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
              ContrattiChiari legge il tuo PDF, evidenzia le clausole critiche e
              ti restituisce un riassunto in italiano semplice. Una base chiara
              per decidere se firmare così com&apos;è o cosa chiedere di
              modificare.
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
              <p className="text-xs text-zinc-500">
                Prima analisi rapida, linguaggio umano, nessun gergo da codice
                civile.
              </p>             

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1">
                Affitti abitativi
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1">
                Contratti di lavoro e collaborazione
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1">
                Forniture e servizi digitali
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-1 justify-center md:mt-0">
            <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Uno sguardo all&apos;analisi
              </p>
              <div className="mt-3 space-y-2 rounded-2xl bg-zinc-50 p-3">
                <p className="text-[11px] font-semibold text-zinc-700">
                  Rischio complessivo:{" "}
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-[2px] text-[10px] font-semibold text-amber-900">
                    medio
                  </span>
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-600">
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
                    La clausola prevede una penale fissa di 3 mensilità anche in
                    caso di gravi motivi, soluzione non sempre proporzionata...
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-[11px] font-semibold text-zinc-800">
                    Aggiornamento ISTAT
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-600 line-clamp-3">
                    Il canone viene aggiornato automaticamente al 100% dell&apos;indice
                    ISTAT: puoi negoziare una soglia più bassa o un tetto massimo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COME FUNZIONA */}
        <section className="mt-16 grid gap-6 rounded-3xl bg-white p-6 text-sm shadow-sm sm:grid-cols-[1.2fr,1.1fr]">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              Come funziona ContrattiChiari
            </h2>
            <ol className="space-y-2 text-zinc-700">
              <li>
                <strong>1. Carichi il PDF o una scansione</strong> – affitti,
                lavoro, servizi: basta che il testo sia leggibile.
              </li>
              <li>
                <strong>2. Analisi automatica</strong> – il motore individua
                clausole critiche, possibili squilibri e punti a tuo favore.
              </li>
              <li>
                <strong>3. Spiegazione in italiano semplice</strong> – ricevi
                riassunto, alert e un glossario dei termini più tecnici.
              </li>
              <li>
                <strong>4. Storico e PDF scaricabile</strong> – con
                l&apos;abbonamento salvi le analisi e scarichi i report.
              </li>
            </ol>
          </div>
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Perché esiste ContrattiChiari
            </p>
            <p className="text-sm leading-relaxed text-zinc-700">
              La maggior parte delle persone firma contratti senza avere il
              tempo, le competenze o la pazienza per leggerli davvero.
              ContrattiChiari non sostituisce un avvocato, ma ti aiuta a capire
              subito se ci sono punti da far vedere a un professionista o da
              rinegoziare.
            </p>
          </div>
        </section>

        {/* PER CHI È PENSATO */}
        <section className="mt-12">
          <h2 className="text-base font-semibold text-zinc-900">
            Pensato per i contratti che firmi davvero
          </h2>
          <div className="mt-4 grid gap-4 text-xs text-zinc-600 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="font-semibold text-zinc-900">
                Clausole critiche in evidenza
              </p>
              <p className="mt-1 leading-relaxed">
                Individuiamo i punti più sbilanciati e ti spieghiamo perché
                possono essere un problema per te, prima di firmare.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="font-semibold text-zinc-900">
                Linguaggio umano, non da codice civile
              </p>
              <p className="mt-1 leading-relaxed">
                Sintesi, esempi e glossario in linguaggio quotidiano, per
                capire al volo cosa stai accettando.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="font-semibold text-zinc-900">
                Affitti, lavoro, collaborazioni, servizi
              </p>
              <p className="mt-1 leading-relaxed">
                Ottimizzato per i contratti che incontri più spesso nella vita
                reale: locazioni, incarichi, consulenze, servizi digitali.
              </p>
            </div>
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
            <Link href="/privacy" className="hover:text-zinc-800">
              Privacy policy
            </Link>
            <Link href="/termini" className="hover:text-zinc-800">
              Termini e condizioni
            </Link>
            <Link
              href="/contratto-affitto"
              className="hover:text-zinc-800"
            >
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
