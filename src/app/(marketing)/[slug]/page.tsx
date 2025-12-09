// app/(marketing)/[slug]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  LANDINGS,
  landingSlugs,
  getLandingBySlug,
  type LandingConfig,
} from "@/lib/landingConfig";
import HeaderPublic from "@/components/HeaderPublic";

// Static params...
export function generateStaticParams() {
  return landingSlugs.map((slug) => ({ slug }));
}

// SEO + OG dinamici...
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const landing = getLandingBySlug(slug);

  if (!landing) {
    return {
      title: "Pagina non trovata – ContrattiChiari",
      description: "La pagina che stai cercando non esiste.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://contrattichiari.it";

  const url = new URL(landing.path, baseUrl).toString();

  return {
    title: landing.seoTitle,
    description: landing.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: landing.ogTitle,
      description: landing.ogDescription,
      url,
      images: [
        {
          url: landing.ogImage,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: landing.ogTitle,
      description: landing.ogDescription,
      images: [landing.ogImage],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const landing = getLandingBySlug(slug);

  if (!landing) return notFound();

  return (
    <Suspense fallback={null}>
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      {/* HEADER comune con la home */}
      <HeaderPublic />

      {/* MAIN landing */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16 space-y-14">
        {/* HERO */}
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            ContrattiChiari • {landing.slug.replace(/-/g, " ")}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950">
            {landing.h1}
          </h1>
          <p className="text-sm md:text-base text-zinc-600">
            {landing.subtitle}
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/upload?from=${landing.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              {landing.ctaLabel}
            </Link>
            <p className="text-xs text-zinc-500">
              Carica il PDF, una scansione o una foto leggibile del contratto.
            </p>
          </div>
        </section>

        {/* PROBLEMI TIPICI */}
        {landing.problemBlocks.length > 0 && (
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Problemi frequenti in questo tipo di contratto
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
              {landing.problemBlocks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* COME FUNZIONA */}
        <section className="grid gap-6 rounded-2xl bg-white p-5 text-sm shadow-sm sm:grid-cols-[1.3fr,1.1fr]">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              Come funziona ContrattiChiari
            </h2>
            <ol className="space-y-2 text-zinc-700">
              <li>
                <strong>1. Carica il contratto</strong> – PDF, foto o scansione
                del documento.
              </li>
              <li>
                <strong>2. Analisi gratuita</strong> – ti mostriamo subito i
                punti critici principali.
              </li>
              <li>
                <strong>3. Sblocco analisi completa</strong> – se vuoi il
                dettaglio completo, PDF e storico, puoi passare al piano a
                pagamento.
              </li>
            </ol>
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Cosa ottieni su questo contratto
            </p>
            <p className="text-sm leading-relaxed text-zinc-700">
              Oltre alla sintesi in linguaggio semplice, evidenziamo le
              clausole più sbilanciate, i possibili rischi per te e i punti che
              puoi provare a rinegoziare prima di firmare.
            </p>
          </div>
        </section>

        {/* COSA CONTROLLIAMO */}
        {landing.checks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              Cosa controlliamo in questo contratto
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
              {landing.checks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ESEMPI DI RISCHI */}
        {landing.examples.length > 0 && (
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Esempi di rischi che possiamo individuare
            </h2>
            <ul className="space-y-2 text-sm text-zinc-700">
              {landing.examples.map((ex) => (
                <li key={ex} className="border-l-2 border-zinc-200 pl-3">
                  {ex}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA CENTRALE */}
        <section className="space-y-3 rounded-2xl bg-zinc-900 px-5 py-6 text-center text-zinc-50">
          <h2 className="text-base font-semibold">
            Carica ora il tuo contratto
          </h2>
          <p className="text-xs text-zinc-200">
            Ricevi in pochi secondi un’analisi chiara e leggibile, prima di
            firmare.
          </p>
          <div className="pt-2">
            <a
              href={`/upload?from=${landing.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200"
            >
              {landing.ctaLabel}
            </a>
          </div>
        </section>

        {/* FAQ */}
        {landing.faq.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-zinc-900">
              Domande frequenti
            </h2>
            <div className="space-y-3">
              {landing.faq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm"
                >
                  <summary className="cursor-pointer text-sm font-medium text-zinc-900">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-zinc-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* LINK CORRELATI */}
        {landing.related && landing.related.length > 0 && (
          <section className="space-y-3 border-t border-zinc-200 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Altri contratti che potresti voler controllare
            </h2>
            <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
              {landing.related.map((slug) => {
                const relatedLanding: LandingConfig | undefined = LANDINGS[slug];
                if (!relatedLanding) return null;
                return (
                  <li key={slug}>
                    <a
                      href={relatedLanding.path}
                      className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
                    >
                      {relatedLanding.h1}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>

      {/* FOOTER allineato alla home */}
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
            <Link href="/" className="hover:text-zinc-800">
              Torna alla home
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </Suspense>
  );
}