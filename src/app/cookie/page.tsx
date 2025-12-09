import type { Metadata } from "next";
import HeaderPublic from "@/components/HeaderPublic";

export const metadata: Metadata = {
  title: "Cookie Policy – Contratti Chiari",
  description:
    "Cookie Policy di Contratti Chiari: informazioni sull’uso dei cookie tecnici e analitici.",
};

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <HeaderPublic />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Informazioni legali
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Questa pagina spiega come Contratti Chiari utilizza i cookie tecnici e
            i cookie analitici (Google Analytics 4), e come puoi gestire o revocare
            il tuo consenso.
          </p>
        </header>

        {/* 1. Cosa sono i cookie */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">1. Cosa sono i cookie</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            I cookie sono piccoli file di testo archiviati sul tuo dispositivo quando visiti
            un sito web. Possono essere tecnici (necessari al funzionamento del sito),
            analitici (per misurare le visite) o di profilazione (per marketing e pubblicità).
            Contratti Chiari utilizza solo cookie tecnici e cookie analitici opzionali.
          </p>
        </section>

        {/* 2. Tipologie di cookie utilizzati */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Tipologie di cookie utilizzati
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed">
            (a) <strong>Cookie tecnici necessari</strong><br />
            Essenziali per il funzionamento del sito: gestione sessioni, login, impostazioni
            di sicurezza, preferenze dell’utente. Questi cookie non richiedono consenso.
          </p>

          <p className="text-sm text-slate-700 leading-relaxed">
            (b) <strong>Cookie analitici (Google Analytics 4)</strong><br />
            Utilizziamo GA4 per raccogliere statistiche aggregate e anonime su:
            pagine visitate, comportamento di navigazione, funnel di utilizzo e performance
            del sito. GA4 è attivato solo dopo consenso esplicito dell’utente.
          </p>
        </section>

        {/* 3. Base giuridica */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Base giuridica dell’uso dei cookie
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            • Cookie tecnici: legittimo interesse del titolare (art. 6.1.f GDPR).<br />
            • Cookie analitici (GA4): consenso dell’utente (art. 6.1.a GDPR).
          </p>
        </section>

        {/* 4. Google Analytics 4 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">4. Google Analytics 4</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            GA4 è un servizio fornito da Google LLC. I dati raccolti vengono utilizzati per
            analisi statistiche aggregate e sono anonimizzati tramite IP masking. Google può
            raccogliere identificatori tecnici, informazioni sul browser e dati di utilizzo.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Google Analytics 4 viene caricato solo dopo che l’utente ha cliccato “Accetta” sul
            banner di consenso. Senza consenso, nessun dato viene inviato.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Privacy di Google: https://policies.google.com/privacy
          </p>
        </section>

        {/* 5. Come gestire il consenso */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Come gestire o revocare il consenso
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Puoi modificare in qualsiasi momento le tue preferenze cliccando su “Gestisci cookie”
            nel footer del sito. Puoi anche eliminare i cookie direttamente dal browser.
          </p>
        </section>

        {/* 6. Cookie di terze parti */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">6. Cookie di terze parti</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Il sito può contenere cookie installati da servizi esterni, come Google Analytics.
            Questi soggetti agiscono come autonomi titolari o responsabili del trattamento.
          </p>
        </section>

        {/* 7. Contatti */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">7. Contatti</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Per domande sulla Cookie Policy o per esercitare i tuoi diritti GDPR, puoi contattare:
            <br />
            PEC: booleans@messaggipec.it<br />
            Indirizzo: Via Ignazio Pettinengo 72, 00159 Roma (RM)
          </p>
        </section>
      </main>
    </div>
  );
}
