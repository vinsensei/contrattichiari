// src/lib/emails.ts

export type PlanName = "free" | "standard" | "pro";

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Entry point unico: qui poi colleghi il provider reale (Resend, Mailersend, ecc.)
 */
async function sendEmail({ to, subject, text, html }: SendEmailArgs) {
  // TODO: integra provider email qui
  console.log("[EMAIL:DEBUG]", { to, subject, text });
  // esempio Resend:
  // await resend.emails.send({ from: "...", to, subject, text, html });
}

/**
 * Email di benvenuto dopo la registrazione
 */
export async function sendWelcomeEmail(to: string) {
  const subject = "Benvenuto in ContrattoChiaro";
  const text = [
    "Ciao,",
    "",
    "benvenuto in ContrattoChiaro 👋",
    "Da ora puoi caricare il tuo primo contratto e ottenere un'analisi chiara in pochi secondi.",
    "",
    "Vai qui per iniziare: https://contrattochiaro.it/dashboard", // TODO: sostituire con URL reale
    "",
    "A presto,",
    "Il team di ContrattoChiaro",
  ].join("\n");

  await sendEmail({ to, subject, text });
}

/**
 * Email di inattività
 * level 0 → primo reminder (7 giorni)
 * level 1 → secondo reminder (30 giorni), ecc.
 */
export async function sendInactivityEmail(to: string, level: number) {
  let subject: string;
  let text: string;

  if (level === 0) {
    subject = "Ti sei dimenticato di ContrattoChiaro?";
    text = [
      "Ciao,",
      "",
      "abbiamo notato che non analizzi un contratto da un po'.",
      "Ricorda che puoi caricare PDF di contratti e ottenere un’analisi chiara e comprensibile in pochi secondi.",
      "",
      "Torna qui quando vuoi: https://contrattochiaro.it/dashboard",
      "",
      "A presto,",
      "Il team di ContrattoChiaro",
    ].join("\n");
  } else {
    subject = "Vuoi tornare a usare ContrattoChiaro?";
    text = [
      "Ciao,",
      "",
      "è passato un po’ di tempo dal tuo ultimo accesso a ContrattoChiaro.",
      "Se hai nuovi contratti o documenti da capire, noi siamo qui.",
      "",
      "Accedi da qui: https://contrattochiaro.it/login",
      "",
      "Un saluto,",
      "Il team di ContrattoChiaro",
    ].join("\n");
  }

  await sendEmail({ to, subject, text });
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
    "Il team di ContrattoChiaro"
  );

  const text = lines.join("\n");

  await sendEmail({ to, subject, text });
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
    p === null ? "nessun piano" : p === "free" ? "Free" : p === "standard" ? "Standard" : "Pro";

  const subject = "Il tuo piano ContrattoChiaro è stato aggiornato";

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
    "Il team di ContrattoChiaro",
  ].join("\n");

  await sendEmail({ to, subject, text });
}

/**
 * Email di fine prova gratuita
 */
export async function sendTrialEndingEmail(
  to: string,
  daysLeft: number
) {
  const subject = "La tua prova gratuita sta per terminare";

  const text = [
    "Ciao,",
    "",
    `mancano circa ${daysLeft} giorni alla fine della tua prova gratuita di ContrattoChiaro.`,
    "Se vuoi continuare ad analizzare contratti senza limiti, puoi attivare ora il tuo piano dall’area abbonamento.",
    "",
    "Vai qui per gestire il tuo piano: https://contrattochiaro.it/account",
    "",
    "Un saluto,",
    "Il team di ContrattoChiaro",
  ].join("\n");

  await sendEmail({ to, subject, text });
}