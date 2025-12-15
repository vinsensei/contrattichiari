// app/(marketing)/[...slug]/page.tsx
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
import {
  editorialSlugs,
  getEditorialBySlug,
  type EditorialPage,
} from "@/lib/editorialConfig";
import HeaderPublic from "@/components/HeaderPublic";
import WhyYouSeeThis from "@/components/WhyYouSeeThis";

// Static params: landings + editorial
export function generateStaticParams() {
  const a = landingSlugs.map((slug) => ({ slug: slug.split("/") }));
  const b = editorialSlugs.map((slug) => ({ slug: slug.split("/") }));
  return [...a, ...b];
}

function getWhyId(slug: string) {
  if (slug.startsWith("contratti/affitto")) return "affitto";
  if (slug.startsWith("affitto/clausole")) return "affitto_clausole";
  if (slug.startsWith("affitto/rischi")) return "affitto_rischi";
  if (slug.startsWith("affitto/guida-rapida")) return "guida_rapida_affitto";
  return null;
}

// --- SuggestedPath helpers ---
type SuggestedLink = { slug: string; label?: string };

function getSuggestedLinks(slug: string): SuggestedLink[] {
  // B1: micro-hub path suggestions (SEO/internal-linking)
  // For now we start with the Affitto cluster; extend later with other clusters.
  if (slug === "contratti/affitto" || slug.startsWith("contratti/affitto/")) {
    return [
      { slug: "affitto/guida-rapida" },
      { slug: "affitto/clausole" },
      { slug: "affitto/rischi" },
    ];
  }

  if (slug.startsWith("affitto/guida-rapida")) {
    return [
      { slug: "contratti/affitto" },
      { slug: "affitto/clausole" },
      { slug: "affitto/rischi" },
    ];
  }

  if (slug.startsWith("affitto/clausole")) {
    return [
      { slug: "contratti/affitto" },
      { slug: "affitto/guida-rapida" },
      { slug: "affitto/rischi" },
    ];
  }

  if (slug.startsWith("affitto/rischi")) {
    return [
      { slug: "contratti/affitto" },
      { slug: "affitto/guida-rapida" },
      { slug: "affitto/clausole" },
    ];
  }

  return [];
}

function resolveSuggestedLabel(slug: string): string | null {
  const relLanding: LandingConfig | undefined = LANDINGS[slug];
  if (relLanding) return relLanding.h1;

  const relEditorial = getEditorialBySlug(slug);
  if (relEditorial) return relEditorial.hero.h1;

  return null;
}

function SuggestedPath({ currentSlug }: { currentSlug: string }) {
  const items = getSuggestedLinks(currentSlug)
    .map((it) => {
      if (it.slug === currentSlug) return null;
      const label = it.label ?? resolveSuggestedLabel(it.slug);
      if (!label) return null;
      return { slug: it.slug, label };
    })
    .filter(Boolean) as { slug: string; label: string }[];

  if (items.length === 0) return null;

  return (
    <section className="space-y-3 border-t border-zinc-200 pt-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Percorso consigliato
      </h2>
      <p className="text-sm text-zinc-700 leading-relaxed">
        Se stai leggendo questa pagina, probabilmente ti serve anche uno di questi passaggi.
      </p>
      <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
        {items.map((it) => (
          <li key={`p:${it.slug}`}>
            <Link
              href={`/${it.slug}`}
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// SEO + OG dinamici (landing OR editorial)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");

  const landing = getLandingBySlug(slugStr);
  const editorial = landing ? null : getEditorialBySlug(slugStr);

  if (!landing && !editorial) {
    return {
      title: "Pagina non trovata – ContrattiChiari",
      description: "La pagina che stai cercando non esiste.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://contrattichiari.it";
  const url = `${baseUrl}/${slugStr}`;

  const toAbsolute = (p?: string) => {
    if (!p) return p;
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    if (p.startsWith("/")) return `${baseUrl}${p}`;
    return `${baseUrl}/${p}`;
  };

  // Landing metadata
  if (landing) {
    return {
      title: landing.seoTitle,
      description: landing.seoDescription,
      alternates: { canonical: url },
      openGraph: {
        title: landing.ogTitle,
        description: landing.ogDescription,
        url,
        images: [{ url: toAbsolute(landing.ogImage)! }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: landing.ogTitle,
        description: landing.ogDescription,
        images: [toAbsolute(landing.ogImage)!],
      },
    };
  }

  // Editorial metadata
  // (adatta i campi se nel tuo editorialConfig usi nomi diversi)
  const e = editorial as EditorialPage;

  return {
    title: e.seo.title,
    description: e.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: e.seo.title,
      description: e.seo.description,
      url,
      images: e.seo.ogImage ? [{ url: toAbsolute(e.seo.ogImage)! }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: e.seo.title,
      description: e.seo.description,
      images: e.seo.ogImage ? [toAbsolute(e.seo.ogImage)!] : undefined,
    },
  };
}

function EditorialBlocks({ page }: { page: EditorialPage }) {
  return (
    <div className="space-y-10">
      {page.blocks.map((b, idx) => {
        if (b.type === "intro") {
          return (
            <section key={idx} className="space-y-3">
              <p className="text-sm md:text-base text-zinc-700 leading-relaxed">
                {b.text}
              </p>
            </section>
          );
        }

        if (b.type === "bullets") {
          return (
            <section
              key={idx}
              className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5"
            >
              {b.title && (
                <h2 className="text-base font-semibold text-zinc-900">
                  {b.title}
                </h2>
              )}
              <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (b.type === "examples") {
          return (
            <section
              key={idx}
              className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5"
            >
              {b.title && (
                <h2 className="text-base font-semibold text-zinc-900">
                  {b.title}
                </h2>
              )}
              <ul className="space-y-2 text-sm text-zinc-700">
                {b.items.map((ex) => (
                  <li key={ex.title} className="border-l-2 border-zinc-200 pl-3">
                    <strong className="text-zinc-900">{ex.title}:</strong>{" "}
                    <span>{ex.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (b.type === "checklist") {
          return (
            <section key={idx} className="space-y-3">
              {b.title && (
                <h2 className="text-base font-semibold text-zinc-900">
                  {b.title}
                </h2>
              )}
              <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (b.type === "cta") {
          const isDark = b.variant !== "soft";
          return (
            <section
              key={idx}
              className={
                isDark
                  ? "space-y-3 rounded-2xl bg-zinc-900 px-5 py-6 text-center text-zinc-50"
                  : "space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 text-center"
              }
            >
              <h2
                className={
                  "text-base font-semibold " +
                  (isDark ? "text-zinc-50" : "text-zinc-900")
                }
              >
                {b.title}
              </h2>
              {b.text && (
                <p
                  className={
                    "text-xs " + (isDark ? "text-zinc-200" : "text-zinc-600")
                  }
                >
                  {b.text}
                </p>
              )}
              <div className="pt-2">
                <Link
                  href={b.buttonHref}
                  className={
                    isDark
                      ? "inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200"
                      : "inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
                  }
                >
                  {b.buttonLabel}
                </Link>
              </div>
            </section>
          );
        }

        if (b.type === "faq") {
          return (
            <section key={idx} className="space-y-4">
              <h2 className="text-base font-semibold text-zinc-900">
                Domande frequenti
              </h2>
              <div className="space-y-3">
                {b.items.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm"
                  >
                    <summary className="cursor-pointer text-sm font-medium text-zinc-900">
                      {item.q}
                    </summary>
                    <p className="mt-2 text-sm text-zinc-700">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* LINK CORRELATI (editorial + landing) */}
      {((page.related?.editorial?.length ?? 0) > 0 || (page.related?.landings?.length ?? 0) > 0) && (
        <section className="space-y-3 border-t border-zinc-200 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Approfondimenti correlati
          </h2>

          <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {page.related?.editorial?.map((s) => {
              const rel = getEditorialBySlug(s);
              if (!rel) return null;
              return (
                <li key={`e:${s}`}>
                  <Link
                    href={`/${s}`}
                    className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
                  >
                    {rel.hero.h1}
                  </Link>
                </li>
              );
            })}

            {page.related?.landings?.map((s) => {
              const rel: LandingConfig | undefined = LANDINGS[s];
              if (!rel) return null;
              return (
                <li key={`l:${s}`}>
                  <Link
                    href={`/${s}`}
                    className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
                  >
                    {rel.h1}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");

  const prettySlug = slugStr
    .replace(/\//g, " · ")
    .replace(/-/g, " ");

  const landing = getLandingBySlug(slugStr);
  const editorial = landing ? null : getEditorialBySlug(slugStr);

  if (!landing && !editorial) return notFound();

  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <HeaderPublic />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-16 space-y-14">
          {/* HERO */}
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              ContrattiChiari • {prettySlug}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950">
              {landing ? landing.h1 : editorial!.hero.h1}
            </h1>

            {(landing?.subtitle || editorial?.hero.subtitle) && (
              <p className="text-sm md:text-base text-zinc-600">
                {landing ? landing.subtitle : editorial!.hero.subtitle}
              </p>
            )}

            {/* CTA immediata SOLO per landing tool */}
            {landing && (
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
            )}
          </section>

          {/* WHY YOU SEE THIS (solo su alcune pagine) */}
          {(() => {
            const whyId = getWhyId(slugStr);
            return whyId ? <WhyYouSeeThis id={whyId} /> : null;
          })()}

          {/* BODY */}
          {landing ? (
            <>
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
                <h2 className="text-base font-semibold">Carica ora il tuo contratto</h2>
                <p className="text-xs text-zinc-200">
                  Ricevi in pochi secondi un’analisi chiara e leggibile, prima di firmare.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/upload?from=${landing.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-200"
                  >
                    {landing.ctaLabel}
                  </Link>
                </div>
              </section>

              {/* FAQ */}
              {landing.faq.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-base font-semibold text-zinc-900">Domande frequenti</h2>
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
              {( (landing.related?.length ?? 0) > 0 || (landing.relatedEditorial?.length ?? 0) > 0 ) && (
                <section className="space-y-3 border-t border-zinc-200 pt-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Approfondimenti correlati
                  </h2>
                  <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    {landing.related?.map((s) => {
                      const relatedLanding: LandingConfig | undefined = LANDINGS[s];
                      if (!relatedLanding) return null;
                      return (
                        <li key={`l:${s}`}>
                          <Link
                            href={`/${s}`}
                            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
                          >
                            {relatedLanding.h1}
                          </Link>
                        </li>
                      );
                    })}

                    {landing.relatedEditorial?.map((s) => {
                      const rel = getEditorialBySlug(s);
                      if (!rel) return null;
                      return (
                        <li key={`e:${s}`}>
                          <Link
                            href={`/${s}`}
                            className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 hover:border-zinc-900 hover:text-zinc-900 transition"
                          >
                            {rel.hero.h1}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <EditorialBlocks page={editorial!} />
          )}
          {/* B1: PERCORSO CONSIGLIATO (micro-hub internal linking) */}
          <SuggestedPath currentSlug={slugStr} />
        </main>

        {/* FOOTER */}
        <footer className="mt-4 border-t border-zinc-200 bg-white/80 py-4 text-xs text-zinc-500">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
            <p className="order-2 sm:order-1">© {new Date().getFullYear()} ContrattiChiari.</p>
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