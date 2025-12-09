import type { Metadata } from "next";
import HeaderPublic from "@/components/HeaderPublic";

export const metadata: Metadata = {
  title: "Termini e condizioni – Contratti Chiari",
  description:
    "Termini e condizioni di Contratti Chiari: come trattiamo i tuoi dati personali quando utilizzi il servizio.",
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <HeaderPublic />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Informazioni legali
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Termini e condizioni
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
            Booleans, ditta individuale (P.IVA 03380210793), con sede in Via Ignazio Pettinengo 72, 00159 Roma (RM), è il titolare del servizio “ContrattiChiari” e del trattamento dei dati personali degli utenti. PEC: booleans@messaggipec.it. Il titolare è responsabile dell’erogazione del servizio di analisi assistita dei contratti e della tutela delle informazioni fornite dagli utenti.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Tipologie di dati trattati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Raccogliamo e trattiamo i seguenti dati: (a) dati di registrazione forniti dall’utente (email, nome se inserito); (b) documenti caricati dall’utente, inclusi contratti, immagini e PDF; (c) log tecnici generati automaticamente dal servizio (indirizzo IP parziale, timestamp, errori tecnici, eventi di utilizzo); (d) dati relativi ai pagamenti e agli abbonamenti gestiti tramite provider terzi (Stripe). I documenti caricati restano di proprietà esclusiva dell’utente.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Pagamenti e abbonamenti tramite Stripe
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            I pagamenti e gli abbonamenti a ContrattiChiari sono gestiti tramite Stripe, Inc.
            I dati della carta di pagamento non transitano né vengono mai memorizzati sui
            nostri server. Al momento dell’acquisto l’utente viene reindirizzato all’ambiente
            sicuro di Stripe, che agisce come responsabile esterno del trattamento ai sensi
            dell’art. 28 GDPR.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Stripe potrebbe raccogliere dati relativi al metodo di pagamento, identificatori
            di sicurezza, indirizzo di fatturazione e informazioni necessarie per prevenire
            frodi e transazioni non autorizzate. L’utilizzo di Stripe è soggetto ai termini
            e all’informativa privacy di Stripe, disponibili all’indirizzo https://stripe.com/privacy.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Finalità e base giuridica
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            I dati sono trattati per: (a) erogare il servizio di analisi automatica dei contratti; (b) gestire l’account e l’accesso alle funzionalità; (c) prevenire abusi e garantire sicurezza; (d) adempiere ad obblighi di legge (fiscali, contabili); (e) migliorare la qualità del servizio e dell’AI. La base giuridica è l’esecuzione del contratto (art. 6.1.b GDPR), il legittimo interesse del titolare (art. 6.1.f) e, dove richiesto, l’adempimento di obblighi di legge (art. 6.1.c).
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            5. Conservazione dei dati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Conserviamo i dati per il tempo strettamente necessario: (a) documenti caricati e analisi: fino alla cancellazione dell’account o su richiesta dell’utente; (b) dati di fatturazione: 10 anni per obblighi fiscali; (c) log di sicurezza: 12 mesi; (d) cronologia analisi: fino alla chiusura dell’account o richiesta di cancellazione. Alla cessazione del rapporto, i dati vengono cancellati o anonimizzati.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            6. Diritti degli interessati
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            L’utente può esercitare in qualsiasi momento i diritti previsti dagli artt. 15–22 GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca del consenso (dove applicabile) e reclamo al Garante per la Protezione dei Dati Personali. Il titolare risponde entro 30 giorni dalla richiesta.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            7. Contatti
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Per domande sui presenti Termini o per esercitare i tuoi diritti, puoi contattare: booleans@messaggipec.it (PEC) o l’indirizzo postale Via Ignazio Pettinengo 72, 76125 Trani (BT).
          </p>
        </section>
      </main>
    </div>
  );
}