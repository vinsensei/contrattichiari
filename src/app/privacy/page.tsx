import type { Metadata } from "next";
import HeaderPublic from "@/components/HeaderPublic";

export const metadata: Metadata = {
  title: "Privacy policy – Contratti Chiari",
  description:
    "Informativa sulla privacy di Contratti Chiari: come trattiamo i tuoi dati personali quando utilizzi il servizio.",
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
            Questa pagina descrive in modo semplice come Contratti Chiari tratta
            i tuoi dati personali quando ti registri, carichi un contratto o utilizzi
            il servizio.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Titolare del trattamento
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Il titolare del trattamento è Booleans, ditta individuale (P.IVA 03380210793), con sede in Via Ignazio Pettinengo 72, 00159 Roma (RM). PEC: booleans@messaggipec.it. Il titolare garantisce che il trattamento dei dati avviene nel rispetto del GDPR e della normativa italiana vigente.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Tipologie di dati trattati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Trattiamo i dati necessari per l’erogazione del servizio: informazioni di registrazione (email), documenti caricati dall’utente (PDF, immagini, testo), cronologia analisi, log tecnici e identificatori di sessione, dati di pagamento gestiti tramite Stripe. L’utente mantiene piena proprietà e responsabilità sui documenti caricati.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Pagamenti gestiti tramite Stripe
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            I pagamenti vengono elaborati tramite Stripe, Inc., che agisce come responsabile
            esterno del trattamento ai sensi dell’art. 28 GDPR. Stripe riceve ed elabora i
            dati necessari all’esecuzione del pagamento (dati della carta, indirizzo di
            fatturazione, identificatori antifrode).
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            ContrattiChiari non raccoglie né memorizza i dati della carta di credito: tali
            informazioni sono trattate esclusivamente da Stripe su connessione sicura (PCI-DSS).
            Per maggiori informazioni sul trattamento effettuato da Stripe, è possibile consultare
            l’informativa privacy all’indirizzo https://stripe.com/privacy.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Conservazione dei dati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            I dati vengono conservati per: documenti caricati e analisi: fino alla cancellazione dell’account; dati di pagamento e fatturazione: 10 anni; log tecnici: 12 mesi; preferenze utente e impostazioni: fino alla chiusura dell’account. L’utente può richiedere la cancellazione anticipata dei propri documenti.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            6. Diritti degli interessati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            L’utente può esercitare i diritti GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e reclamo al Garante Privacy. Le richieste possono essere inviate via PEC a booleans@messaggipec.it. Il titolare risponde entro 30 giorni.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            7. Contatti
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Per qualunque richiesta relativa alla privacy o per l’esercizio dei tuoi diritti, puoi contattare la PEC booleans@messaggipec.it o scrivere a Via Ignazio Pettinengo 72, 76125 Trani (BT).
          </p>
        </section>
      </main>
    </div>
  );
}