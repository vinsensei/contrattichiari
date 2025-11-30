

import type { Metadata } from "next";
import HeaderPublic from "@/components/HeaderPublic";

export const metadata: Metadata = {
  title: "Privacy policy – ContrattoChiaro",
  description:
    "Informativa sulla privacy di ContrattoChiaro: come trattiamo i tuoi dati personali quando utilizzi il servizio.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <HeaderPublic />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Informazioni legali
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Privacy policy
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Questa pagina descrive in modo semplice come ContrattoChiaro tratta
            i tuoi dati personali quando ti registri, carichi un contratto o utilizzi
            il servizio.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Titolare del trattamento
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Qui potrai inserire i dati del titolare del trattamento (nome o ragione sociale,
            indirizzo, contatti). Per ora questo è un testo segnaposto.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Tipologie di dati trattati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            In questa sezione descriverai i dati trattati: dati di registrazione,
            contenuto dei contratti caricati, log tecnici di utilizzo del servizio,
            dati di pagamento (se rilevanti e gestiti da provider terzi), ecc.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Finalità e base giuridica
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Qui potrai spiegare perché tratti i dati (erogazione del servizio,
            gestione dell&apos;account, sicurezza, adempimenti legali) e su quale base giuridica
            (contratto, obbligo di legge, legittimo interesse, consenso).
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Conservazione dei dati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Indica per quanto tempo vengono conservati i dati e quali criteri utilizzi
            per definire i tempi di conservazione (ad esempio: durata dell&apos;account,
            obblighi fiscali, log di sicurezza, ecc.).
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Diritti degli interessati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Qui spiegherai come gli utenti possono esercitare i loro diritti di accesso,
            rettifica, cancellazione, limitazione, opposizione, portabilità e reclamo
            all&apos;autorità di controllo competente.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            6. Contatti
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Inserisci qui l&apos;indirizzo email o il canale preferito attraverso cui gli utenti
            possono contattarti per qualsiasi richiesta relativa alla privacy.
          </p>
        </section>

        <p className="text-[11px] text-slate-400">
          Questa pagina è un placeholder di struttura. Puoi sostituire in qualsiasi momento
          i testi con la tua informativa completa redatta con il supporto di un legale.
        </p>
      </main>
    </div>
  );
}