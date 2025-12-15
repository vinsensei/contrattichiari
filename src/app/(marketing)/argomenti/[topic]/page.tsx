// app/(marketing)/argomenti/[topic]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EDITORIAL_PAGES } from "@/lib/editorialConfig";
import HeaderPublic from "@/components/HeaderPublic";

type Topic = "generale" | "affitto" | "lavoro" | "mutuo" | "condominio" | "separazione" | "utenze";

type TopicConfig = {
  slug: Topic;
  meta: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
  };
  // Decide quali pagine appartengono al topic.
  match: (slugNorm: string) => boolean;
  // Dove porta la CTA “Analizza il contratto”
  uploadFrom: string;
  cta?: {
    title: string;
    text: string;
  };
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  affitto: ["affitto"],
  lavoro: ["lavoro"],
  mutuo: ["mutuo"],
  condominio: ["condominio"],
  separazione: ["separazione"],
  utenze: ["utenze"],
};

function isGlobalClauseOrRisk(s: string) {
  return s.startsWith("clausole/") || s.startsWith("rischi/");
}

function slugHasAnyKeyword(s: string, keywords: string[]) {
  const low = s.toLowerCase();
  return keywords.some((k) => low.includes(k));
}

const ALL_KEYWORDS = [
  ...TOPIC_KEYWORDS.affitto,
  ...TOPIC_KEYWORDS.lavoro,
  ...TOPIC_KEYWORDS.mutuo,
  ...TOPIC_KEYWORDS.condominio,
  ...TOPIC_KEYWORDS.separazione,
  ...TOPIC_KEYWORDS.utenze,
];

const TOPICS: Record<Topic, TopicConfig> = {
  generale: {
    slug: "generale",
    meta: {
      title: "Clausole e rischi: indice generale – ContrattiChiari",
      description:
        "Indice generale: clausole e rischi più comuni, organizzati in modo semplice. Usa gli argomenti specifici per affitto, lavoro, mutuo e altro.",
      h1: "Generale",
      subtitle: "Clausole e rischi trasversali (non legati a un singolo argomento).",
    },
    match: (s) =>
      (isGlobalClauseOrRisk(s) && !slugHasAnyKeyword(s, ALL_KEYWORDS)) ||
      s === "perche-lo-vedo",
    uploadFrom: "",
    cta: {
      title: "Hai un contratto da analizzare?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  affitto: {
    slug: "affitto",
    meta: {
      title: "Affitto: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su affitto: guide pratiche, clausole importanti e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Affitto",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    // match: contratti/affitto, affitto/, clausole/ o rischi/ SOLO se contiene affitto
    match: (s) =>
      s.startsWith("contratti/affitto") ||
      s.startsWith("affitto/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.affitto)),
    uploadFrom: "contratti/affitto",
    cta: {
      title: "Hai un contratto di affitto?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  lavoro: {
    slug: "lavoro",
    meta: {
      title: "Lavoro: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su lavoro: guide pratiche, clausole e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Lavoro",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    match: (s) =>
      s.startsWith("contratti/lavoro") ||
      s.startsWith("lavoro/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.lavoro)),
    uploadFrom: "contratti/lavoro",
    cta: {
      title: "Hai un contratto di lavoro?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  mutuo: {
    slug: "mutuo",
    meta: {
      title: "Mutuo: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su mutuo: guide pratiche, clausole e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Mutuo",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    match: (s) =>
      s.startsWith("contratti/mutuo") ||
      s.startsWith("mutuo/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.mutuo)),
    uploadFrom: "contratti/mutuo",
    cta: {
      title: "Hai un contratto di mutuo?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  condominio: {
    slug: "condominio",
    meta: {
      title: "Condominio: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su condominio: guide pratiche, clausole e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Condominio",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    match: (s) =>
      s.startsWith("contratti/condominio") ||
      s.startsWith("condominio/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.condominio)),
    uploadFrom: "contratti/condominio",
    cta: {
      title: "Hai un contratto condominiale?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  separazione: {
    slug: "separazione",
    meta: {
      title: "Separazione: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su separazione: guide pratiche, clausole e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Separazione",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    match: (s) =>
      s.startsWith("contratti/separazione") ||
      s.startsWith("separazione/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.separazione)),
    uploadFrom: "contratti/separazione",
    cta: {
      title: "Hai un accordo di separazione?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
  utenze: {
    slug: "utenze",
    meta: {
      title: "Utenze: guide, clausole e rischi – ContrattiChiari",
      description:
        "Indice rapido su utenze: guide pratiche, clausole e rischi più comuni. Navigazione ordinata e aggiornata.",
      h1: "Utenze",
      subtitle: "Guide, clausole e rischi: tutto in un indice ordinato.",
    },
    match: (s) =>
      s.startsWith("contratti/utenze") ||
      s.startsWith("utenze/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.utenze)),
    uploadFrom: "contratti/utenze",
    cta: {
      title: "Hai un contratto di utenze?",
      text: "Caricalo e ottieni un’analisi chiara in pochi secondi.",
    },
  },
};

function topicMeta(topic: string) {
  const key = topic as Topic;
  return TOPICS[key]?.meta ?? null;
}

function normalizeSlug(input: string) {
  // EDITORIAL_PAGES potrebbe usare chiavi tipo "/affitto/rischi/..."
  return input.startsWith("/") ? input.slice(1) : input;
}

function slugBelongsToTopic(slug: string, topic: Topic) {
  const s = normalizeSlug(slug);
  return TOPICS[topic]?.match(s) ?? false;
}

function getKindFromSlug(slug: string) {
  const s = normalizeSlug(slug);

  // Clausole / Rischi (sia con prefisso topic che con slug globali)
  if (s.includes("/clausole") || s.startsWith("clausole/")) return "clausole";
  if (s.includes("/rischi") || s.startsWith("rischi/")) return "rischi";

  // Hub / guide
  if (s.includes("guida-rapida") || s.startsWith("contratti/")) return "guide";

  return "guide";
}

function getItemsByTopic(topic: Topic) {
  const pages = EDITORIAL_PAGES.map((page) => {
    const slug = page.slug;
    return { slug, slugNorm: normalizeSlug(slug), page };
  }).filter(({ slugNorm }) => slugBelongsToTopic(slugNorm, topic));

  const buckets: Record<"guide" | "clausole" | "rischi", typeof pages> = {
    guide: [],
    clausole: [],
    rischi: [],
  };

  for (const it of pages) {
    const k = getKindFromSlug(it.slugNorm) as "guide" | "clausole" | "rischi";
    buckets[k].push(it);
  }

  const sortByTitle = (a: (typeof pages)[number], b: (typeof pages)[number]) => {
    const at = a.page.hero?.h1 ?? a.slug;
    const bt = b.page.hero?.h1 ?? b.slug;
    return at.localeCompare(bt, "it", { sensitivity: "base" });
  };

  buckets.guide.sort(sortByTitle);
  buckets.clausole.sort(sortByTitle);
  buckets.rischi.sort(sortByTitle);

  return buckets;
}

export function generateStaticParams() {
  return (Object.keys(TOPICS) as Topic[]).map((t) => ({ topic: t }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;

  const meta = topicMeta(topic);
  if (!meta) {
    return {
      title: "Argomento non trovato – ContrattiChiari",
      description: "Questo argomento non esiste.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://contrattichiari.it";
  const url = `${baseUrl}/argomenti/${topic}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

function Section({
  title,
  items,
}: {
  title: string;
  items: { slug: string; slugNorm: string; page: any }[];
}) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map(({ slug, slugNorm, page }) => (
          <li key={slug}>
            <Link
              href={`/${slugNorm}`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-900 transition"
            >
              <div className="text-sm font-medium text-zinc-900">
                {page.hero?.h1 ?? slugNorm}
              </div>
              {page.hero?.subtitle ? (
                <div className="mt-1 text-xs text-zinc-600">
                  {page.hero.subtitle}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function TopicIndexPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  const meta = topicMeta(topic);
  if (!meta) return notFound();

  const buckets = getItemsByTopic(topic as Topic);

  // safety: se non trova niente, 404 (evita pagine vuote indicizzate)
  const total =
    buckets.guide.length + buckets.clausole.length + buckets.rischi.length;
  if (!total) return notFound();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <HeaderPublic />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 space-y-10">
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            ContrattiChiari • Argomenti
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950">
            {meta.h1}
          </h1>
          <p className="text-sm md:text-base text-zinc-600">{meta.subtitle}</p>
        </section>

        <div className="space-y-10">
          <Section title="Guide" items={buckets.guide} />
          <Section title="Clausole" items={buckets.clausole} />
          <Section title="Rischi" items={buckets.rischi} />
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
          <div className="text-sm font-semibold text-zinc-900">
            {TOPICS[topic as Topic].cta?.title}
          </div>
          <p className="mt-1 text-xs text-zinc-600">
            {TOPICS[topic as Topic].cta?.text}
          </p>
          <div className="mt-4">
            <Link
              href={
                (() => {
                  const from = TOPICS[topic as Topic].uploadFrom;
                  return from
                    ? `/upload?from=${encodeURIComponent(from)}`
                    : "/upload";
                })()
              }
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Analizza il contratto
            </Link>
          </div>
        </section>
      </main>

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
  );
}