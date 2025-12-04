// src/lib/emails.ts
import { resend } from "@/lib/resendClient";
import { renderEmailTemplate } from "./emailTemplate";

export type PlanName = "free" | "standard" | "pro";

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

// URL base per link nelle email
const APP_BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://contrattichiari.it"
).replace(/\/+$/, "");

/**
 * ENTRY POINT UNICO — qui ora integriamo Resend
 */
async function sendEmail({ to, subject, text, html }: SendEmailArgs) {
  try {
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ??
        "Contratti Chiari <noreply@contrattichiari.it>",
      to,
      subject,
      text,
      html,
    });

    console.log("[EMAIL:OK]", { to, subject });
  } catch (err) {
    console.error("[EMAIL:ERROR]", err);
  }
}

/**
 * Email di benvenuto dopo la registrazione
 */
export async function sendWelcomeEmail(to: string) {
  const subject = "Benvenuto in Contratti Chiari";

  const dashboardUrl = `${APP_BASE_URL}/dashboard`;

  const text = [
    "Ciao,",
    "",
    "benvenuto in Contratti Chiari 👋",
    "Da ora puoi caricare il tuo primo contratto e ottenere un'analisi chiara in pochi secondi.",
    "",
    `Vai qui per iniziare: ${dashboardUrl}`,
    "",
    "A presto,",
    "Il team di Contratti Chiari",
  ].join("\n");

  const html = renderEmailTemplate({
    title: "Benvenuto in Contratti Chiari 👋",
    content: `
      <p>Ciao,</p>
      <p>
        benvenuto in <strong>Contratti Chiari</strong>! Da ora puoi caricare il tuo primo contratto
        e ottenere un'analisi chiara in pochi secondi.
      </p>
      <p>
        Quando sei pronto, puoi iniziare da qui:
      </p>
      <p>
        <a href="${dashboardUrl}" class="button">Vai alla dashboard</a>
      </p>
      <p>A presto,<br />Il team di Contratti Chiari</p>
    `,
  });

  await sendEmail({ to, subject, text, html });
}

/**
 * Email di inattività
 * level 0 → primo reminder (7 giorni)
 * level 1 → secondo reminder (30 giorni), ecc.
 */
export async function sendInactivityEmail(to: string, level: number) {
  const dashboardUrl = `${APP_BASE_URL}/dashboard`;
  const loginUrl = `${APP_BASE_URL}/login`;

  let subject: string;
  let text: string;
  let htmlContent: string;

  if (level === 0) {
    subject = "Ti sei dimenticato di Contratti Chiari?";
    text = [
      "Ciao,",
      "",
      "abbiamo notato che non analizzi un contratto da un po'.",
      "Ricorda che puoi caricare PDF di contratti e ottenere un’analisi chiara e comprensibile in pochi secondi.",
      "",
      `Torna qui quando vuoi: ${dashboardUrl}`,
      "",
      "A presto,",
      "Il team di Contratti Chiari",
    ].join("\n");

    htmlContent = `
      <p>Ciao,</p>
      <p>
        abbiamo notato che non analizzi un contratto da un po'.
        Ricorda che puoi caricare i tuoi PDF e ottenere un’analisi chiara e comprensibile in pochi secondi.
      </p>
      <p>
        Puoi tornare quando vuoi da qui:
      </p>
      <p>
        <a href="${dashboardUrl}" class="button">Vai alla dashboard</a>
      </p>
      <p>A presto,<br />Il team di Contratti Chiari</p>
    `;
  } else {
    subject = "Vuoi tornare a usare Contratti Chiari?";
    text = [
      "Ciao,",
      "",
      "è passato un po’ di tempo dal tuo ultimo accesso a Contratti Chiari.",
      "Se hai nuovi contratti o documenti da capire, noi siamo qui.",
      "",
      `Accedi da qui: ${loginUrl}`,
      "",
      "Un saluto,",
      "Il team di Contratti Chiari",
    ].join("\n");

    htmlContent = `
      <p>Ciao,</p>
      <p>
        è passato un po’ di tempo dal tuo ultimo accesso a <strong>Contratti Chiari</strong>.
        Se hai nuovi contratti o documenti da capire, noi siamo qui.
      </p>
      <p>
        Puoi accedere di nuovo da qui:
      </p>
      <p>
        <a href="${loginUrl}" class="button">Accedi al tuo account</a>
      </p>
      <p>Un saluto,<br />Il team di Contratti Chiari</p>
    `;
  }

  const html = renderEmailTemplate({
    title: subject,
    content: htmlContent,
  });

  await sendEmail({ to, subject, text, html });
}

/**
 * Email di conferma pagamento / attivazione piano
 */
export async function sendPaymentEmail(
  to: string,
  plan: PlanName,
  amount: number,
  currency: string,
  nextRenewalDate?: string
) {
  const planLabel =
    plan === "free" ? "Free" : plan === "standard" ? "Standard" : "Pro";

  const profileUrl = `${APP_BASE_URL}/dashboard/account`;

  const subject = `Pagamento confermato – Piano ${planLabel}`;
  const lines = [
    "Ciao,",
    "",
    `il tuo pagamento per il piano ${planLabel} è andato a buon fine.`,
    `Importo: ${amount.toFixed(2)} ${currency.toUpperCase()}.`,
  ];

  if (nextRenewalDate) {
    lines.push(`Prossimo rinnovo: ${nextRenewalDate}.`);
  }

  lines.push(
    "",
    "Puoi gestire il tuo abbonamento in qualsiasi momento dalla pagina di profilo.",
    "",
    "Grazie per la fiducia,",
    "Il team di Contratti Chiari"
  );

  const text = lines.join("\n");

  const html = renderEmailTemplate({
    title: `Pagamento confermato – Piano ${planLabel}`,
    content: `
      <p>Ciao,</p>
      <p>
        il tuo pagamento per il piano <strong>${planLabel}</strong> è andato a buon fine.
      </p>
      <p>
        Importo: <strong>${amount.toFixed(2)} ${currency.toUpperCase()}</strong>.
      </p>
      ${
        nextRenewalDate
          ? `<p>Prossimo rinnovo previsto il: <strong>${nextRenewalDate}</strong>.</p>`
          : ""
      }
      <p>
        Puoi gestire il tuo abbonamento in qualsiasi momento dalla pagina di profilo.
      </p>
      <p>
        <a href="${profileUrl}" class="button">Gestisci abbonamento</a>
      </p>
      <p>Grazie per la fiducia,<br />Il team di Contratti Chiari</p>
    `,
  });

  await sendEmail({ to, subject, text, html });
}

/**
 * Email per cambio piano (upgrade/downgrade/cancel)
 */
export async function sendPlanChangeEmail(
  to: string,
  oldPlan: PlanName | null,
  newPlan: PlanName
) {
  const label = (p: PlanName | null) =>
    p === null
      ? "nessun piano"
      : p === "free"
      ? "Free"
      : p === "standard"
      ? "Standard"
      : "Pro";

  const subject = "Il tuo piano Contratti Chiari è stato aggiornato";

  const text = [
    "Ciao,",
    "",
    `il tuo piano è stato aggiornato:`,
    `Da: ${label(oldPlan)}`,
    `A: ${label(newPlan)}`,
    "",
    "Se non riconosci questa modifica, contattaci rispondendo a questa email.",
    "",
    "Grazie,",
    "Il team di Contratti Chiari",
  ].join("\n");

  const html = renderEmailTemplate({
    title: "Il tuo piano è stato aggiornato",
    content: `
      <p>Ciao,</p>
      <p>il tuo piano su <strong>Contratti Chiari</strong> è stato aggiornato:</p>
      <p>
        Da: <strong>${label(oldPlan)}</strong><br/>
        A: <strong>${label(newPlan)}</strong>
      </p>
      <p>
        Se non riconosci questa modifica, rispondi a questa email o contattaci al più presto.
      </p>
      <p>Grazie,<br />Il team di Contratti Chiari</p>
    `,
  });

  await sendEmail({ to, subject, text, html });
}

/**
 * Email di fine prova gratuita
 */
export async function sendTrialEndingEmail(to: string, daysLeft: number) {
  const subject = "La tua prova gratuita sta per terminare";

  const accountUrl = `${APP_BASE_URL}/dashboard/account`;

  const text = [
    "Ciao,",
    "",
    `mancano circa ${daysLeft} giorni alla fine della tua prova gratuita di Contratti Chiari.`,
    "Se vuoi continuare ad analizzare contratti senza limiti, puoi attivare ora il tuo piano dall’area abbonamento.",
    "",
    `Vai qui per gestire il tuo piano: ${accountUrl}`,
    "",
    "Un saluto,",
    "Il team di Contratti Chiari",
  ].join("\n");

  const html = renderEmailTemplate({
    title: "La tua prova gratuita sta per terminare",
    content: `
      <p>Ciao,</p>
      <p>
        mancano circa <strong>${daysLeft} giorni</strong> alla fine della tua prova gratuita di Contratti Chiari.
      </p>
      <p>
        Se vuoi continuare ad analizzare contratti senza limiti, puoi attivare ora il tuo piano dall’area abbonamento.
      </p>
      <p>
        <a href="${accountUrl}" class="button">Gestisci il tuo piano</a>
      </p>
      <p>Un saluto,<br />Il team di Contratti Chiari</p>
    `,
  });

  await sendEmail({ to, subject, text, html });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const subject = "Reimposta la tua password su Contratti Chiari";

  const text = [
    "Ciao,",
    "",
    "hai richiesto di reimpostare la password del tuo account Contratti Chiari.",
    "Se non hai effettuato tu questa richiesta, puoi ignorare questa email.",
    "",
    `Per scegliere una nuova password, clicca su questo link: ${resetLink}`,
    "",
    "Il link è valido per 60 minuti.",
    "",
    "A presto,",
    "Il team di Contratti Chiari",
  ].join("\n");

  const htmlContent = `
    <p>Ciao,</p>
    <p>
      hai richiesto di reimpostare la password del tuo account <strong>Contratti Chiari</strong>.
      Se non hai effettuato tu questa richiesta, puoi ignorare questa email.
    </p>
    <p>
      Per scegliere una nuova password, clicca sul pulsante qui sotto:
    </p>
    <p>
      <a href="${resetLink}" class="button">Reimposta la password</a>
    </p>
    <p style="font-size: 12px; color: #6b7280;">
      Il link è valido per 60 minuti.<br/>
      Se il pulsante non dovesse funzionare, copia e incolla questo indirizzo nel browser:<br/>
      <span style="word-break: break-all;">${resetLink}</span>
    </p>
    <p>A presto,<br />Il team di Contratti Chiari</p>
  `;

  const html = renderEmailTemplate({
    title: subject,
    content: htmlContent,
  });

  await sendEmail({ to, subject, text, html });
}