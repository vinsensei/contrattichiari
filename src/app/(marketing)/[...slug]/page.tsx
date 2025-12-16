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
        Se stai leggendo questa pagina, probabilmente ti serve anche uno di
        questi passaggi.
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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://contrattichiari.it";
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
              className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
              {b.title && (
                <h2 className="text-base font-semibold text-zinc-900">
                  {b.title}
                </h2>
              )}

              <ul className="space-y-3">
                {b.items.map((it) => (
                  <li key={it} className="flex items-start gap-4">
                    {/* Indicatore */}
                    <span
                      className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "#2ABEFF" }}
                    />

                    {/* Testo */}
                    <p className="text-sm leading-relaxed text-[#0B1A4A]">
                      {it}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (b.type === "examples") {
          return (
            <section key={idx} className="space-y-4">
              {b.title && (
                <h2 className="text-base sm:text-lg font-semibold text-zinc-950">
                  {b.title}
                </h2>
              )}

              <div className="rounded-2xl border border-zinc-200 bg-white px-5 sm:px-6">
                {b.items.map((ex, i) => (
                  <div
                    key={ex.title}
                    className={[
                      "flex items-center gap-3 sm:gap-4 py-5 sm:py-6",
                      i === 0 ? "" : "border-t",
                    ].join(" ")}
                    style={
                      i === 0
                        ? undefined
                        : { borderTopColor: "rgba(134, 134, 134, 0.18)" }
                    }
                  >
                    <div
                      className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-[6px] border flex items-center justify-center shrink-0"
                      style={{
                        borderColor: "rgba(42, 190, 255, 0.35)",
                        backgroundColor: "rgba(42, 190, 255, 0.08)",
                      }}
                    >
                      <img
                        alt=""
                        loading="lazy"
                        width={20}
                        height={20}
                        className="opacity-80 sm:w-[24px] sm:h-[24px]"
                        src="/icons/uploadok.svg"
                        style={{ color: "transparent" }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3
                        className="text-sm sm:text-base font-semibold leading-snug"
                        style={{ color: "#0B2A3A" }}
                      >
                        {ex.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm leading-snug"
                        style={{ color: "#0B2A3A" }}
                      >
                        <span className="line-clamp-2 sm:line-clamp-none">
                          {ex.text}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (b.type === "checklist") {
          return (
            <section key={idx} className="space-y-4">
              {b.title && (
                <h2 className="text-base sm:text-lg font-semibold text-zinc-950">
                  {b.title}
                </h2>
              )}

              <ul className="space-y-2">
                {b.items.map((it) => (
                  <li
                    key={it}
                    className="
              flex items-start gap-3
              rounded-xl border border-zinc-200 bg-white
              px-4 py-3
            "
                  >
                    {/* Icona check */}
                    <span
                      className="
                mt-0.5 inline-flex h-5 w-5 shrink-0
                items-center justify-center
                rounded-full bg-zinc-900 text-zinc-50
              "
                      aria-hidden
                    >
                      <svg viewBox="0 0 20 20" className="h-3 w-3">
                        <path
                          d="M5 10l3 3 7-7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    {/* Testo */}
                    <span className="text-sm text-zinc-800 leading-snug">
                      {it}
                    </span>
                  </li>
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
            <section key={idx} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-zinc-950">
                  Domande frequenti
                </h2>
                <p className="text-sm text-zinc-600">
                  Risposte rapide, senza linguaggio legale.
                </p>
              </div>

              <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                {b.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary
                      className="
                      list-none cursor-pointer select-none
                      px-5 py-4
                      flex items-center justify-between gap-4
                      hover:bg-zinc-50
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20
                      transition
                    "
                    >
                      <span className="text-sm md:text-[15px] font-medium text-zinc-950">
                        {item.q}
                      </span>

                      {/* Chevron */}
                      <span
                        className="
                        shrink-0 inline-flex h-8 w-8 items-center justify-center
                        rounded-full border border-zinc-200 bg-white
                        group-open:rotate-180 transition-transform
                      "
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="h-4 w-4 text-zinc-600"
                        >
                          <path
                            d="M5.5 7.5L10 12l4.5-4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="px-5 pb-5 pt-0">
                      <div className="text-sm text-zinc-700 leading-relaxed">
                        {item.a}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* LINK CORRELATI (editorial + landing) */}
      {((page.related?.editorial?.length ?? 0) > 0 ||
        (page.related?.landings?.length ?? 0) > 0) && (
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

  const prettySlug = slugStr.replace(/\//g, " · ").replace(/-/g, " ");

  const landing = getLandingBySlug(slugStr);
  const editorial = landing ? null : getEditorialBySlug(slugStr);

  if (!landing && !editorial) return notFound();

  return (
    <Suspense fallback={null}>
      <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <HeaderPublic />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 sm:px-6 space-y-14">
          {/* HERO FULL-BLEED */}
          <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-b from-zinc-100 to-zinc-50 border-b border-zinc-200">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 space-y-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                ContrattiChiari • {prettySlug}
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950">
                {landing ? landing.h1 : editorial!.hero.h1}
              </h1>

              {(landing?.subtitle || editorial?.hero.subtitle) && (
                <p className="max-w-3xl text-sm md:text-base text-zinc-600 leading-relaxed">
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
                    Carica il PDF, una scansione o una foto leggibile del
                    contratto.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* WHY YOU SEE THIS (solo su alcune pagine) */}
          {(() => {
            const whyId = getWhyId(slugStr);
            return whyId ? <WhyYouSeeThis id={whyId} /> : null;
          })()}

          {/* BODY */}
          {landing ? (
            <>
              {landing.problemBlocks.length > 0 && (
                <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-zinc-900">
                    Problemi frequenti in questo tipo di contratto
                  </h2>

                  <ul className="space-y-4">
                    {landing.problemBlocks.map((item) => (
                      <li key={item} className="flex items-start gap-4">
                        {/* Indicatore problema */}
                        <span
                          className="mt-2 h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: "#2ABEFF" }}
                          aria-hidden
                        />

                        {/* Testo */}
                        <p className="text-sm leading-relaxed text-[#0B1A4A]">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* COME FUNZIONA */}
              <section
                className="grid gap-6 rounded-2xl border border-zinc-200 p-6 text-sm sm:grid-cols-[1.3fr,1.1fr]"
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
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: "#2ABEFF" }}
                      >
                        1
                      </span>
                      <span>
                        <strong>Carica il contratto</strong> – PDF, foto o
                        scansione del documento.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: "#2ABEFF" }}
                      >
                        2
                      </span>
                      <span>
                        <strong>Analisi gratuita</strong> – ti mostriamo subito
                        i punti critici principali.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: "#2ABEFF" }}
                      >
                        3
                      </span>
                      <span>
                        <strong>Analisi completa</strong> – PDF, storico e
                        dettaglio se vuoi approfondire.
                      </span>
                    </li>
                  </ol>

                  <p className="text-xs italic text-zinc-600">
                    Linguaggio semplice, senza tecnicismi inutili.
                  </p>
                </div>

                {/* COLONNA DESTRA */}
                <div
                  className="space-y-3 rounded-xl p-4"
                  style={{ backgroundColor: "rgba(42, 190, 255, 0.08)" }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: "#0B2A3A" }}
                  >
                    Cosa ottieni
                  </p>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#0B2A3A" }}
                  >
                    Una lettura chiara del contratto: clausole sbilanciate,
                    rischi concreti per te e punti che puoi provare a
                    rinegoziare prima di firmare.
                  </p>
                </div>
              </section>

              {/* COSA CONTROLLIAMO */}
              {landing.checks.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-base font-semibold text-zinc-900">
                    Cosa controlliamo in questo contratto
                  </h2>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      {landing.checks.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          {/* icona */}
                          <span
                            className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                            style={{
                              backgroundColor: "rgba(42, 190, 255, 0.18)",
                            }}
                          >
                            <svg
                              viewBox="0 0 20 20"
                              className="h-3.5 w-3.5"
                              fill="none"
                            >
                              <path
                                d="M5 10l3 3 7-7"
                                stroke="#0B2A3A"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>

                          {/* testo */}
                          <span className="text-sm text-[#0B2A3A] leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  Ricevi in pochi secondi un’analisi chiara e leggibile, prima
                  di firmare.
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
                <section className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-zinc-950">
                      Domande frequenti
                    </h2>
                    <p className="text-sm text-zinc-600">
                      Risposte rapide, senza gergo.
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                    {landing.faq.map((item) => (
                      <details key={item.question} className="group">
                        <summary
                          className="
                            list-none cursor-pointer select-none
                            px-5 py-4
                            flex items-center justify-between gap-4
                            hover:bg-zinc-50
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20
                            transition
                          "
                        >
                          <span className="text-sm md:text-[15px] font-medium text-zinc-950">
                            {item.question}
                          </span>

                          {/* chevron */}
                          <span
                            className="
                              shrink-0 inline-flex h-8 w-8 items-center justify-center
                              rounded-full border border-zinc-200 bg-white
                              group-open:rotate-180 transition-transform
                            "
                            aria-hidden="true"
                          >
                            <svg
                              viewBox="0 0 20 20"
                              className="h-4 w-4 text-zinc-600"
                            >
                              <path
                                d="M5.5 7.5L10 12l4.5-4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </summary>

                        <div className="px-5 pb-5 pt-0">
                          <div className="text-sm text-zinc-700 leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* LINK CORRELATI */}
              {((landing.related?.length ?? 0) > 0 ||
                (landing.relatedEditorial?.length ?? 0) > 0) && (
                <section className="space-y-3 border-t border-zinc-200 pt-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Approfondimenti correlati
                  </h2>
                  <ul className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    {landing.related?.map((s) => {
                      const relatedLanding: LandingConfig | undefined =
                        LANDINGS[s];
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
