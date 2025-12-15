// app/(marketing)/argomenti/page.tsx
import Link from "next/link";
import HeaderPublic from "@/components/HeaderPublic";
import { EDITORIAL_PAGES } from "@/lib/editorialConfig";

type Topic = "generale" | "affitto" | "lavoro" | "mutuo" | "condominio" | "separazione" | "utenze";

type TopicConfig = {
  slug: Topic;
  title: string;
  subtitle: string;
  // quali slug appartengono al topic
  match: (slugNorm: string) => boolean;
};

function normalizeSlug(input: string) {
  return input.startsWith("/") ? input.slice(1) : input;
}

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
    title: "Generale",
    subtitle: "Clausole e rischi trasversali (non legati a un singolo argomento).",
    match: (s) =>
      (isGlobalClauseOrRisk(s) && !slugHasAnyKeyword(s, ALL_KEYWORDS)) ||
      s === "perche-lo-vedo",
  },
  affitto: {
    slug: "affitto",
    title: "Affitto",
    subtitle: "Guide, clausole e rischi principali in un unico indice.",
    match: (s) =>
      s.startsWith("contratti/affitto") ||
      s.startsWith("affitto/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.affitto)),
  },
  lavoro: {
    slug: "lavoro",
    title: "Lavoro",
    subtitle: "Contratti, clausole e rischi comuni nel lavoro.",
    match: (s) =>
      s.startsWith("contratti/lavoro") ||
      s.startsWith("lavoro/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.lavoro)),
  },
  mutuo: {
    slug: "mutuo",
    title: "Mutuo",
    subtitle: "Guide e rischi più frequenti nei mutui.",
    match: (s) =>
      s.startsWith("contratti/mutuo") ||
      s.startsWith("mutuo/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.mutuo)),
  },
  condominio: {
    slug: "condominio",
    title: "Condominio",
    subtitle: "Casi tipici, clausole e rischi in ambito condominiale.",
    match: (s) =>
      s.startsWith("contratti/condominio") ||
      s.startsWith("condominio/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.condominio)),
  },
  separazione: {
    slug: "separazione",
    title: "Separazione",
    subtitle: "Guide e rischi comuni nelle separazioni e accordi.",
    match: (s) =>
      s.startsWith("contratti/separazione") ||
      s.startsWith("separazione/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.separazione)),
  },
  utenze: {
    slug: "utenze",
    title: "Utenze",
    subtitle: "Bollette, forniture: guide e rischi ricorrenti.",
    match: (s) =>
      s.startsWith("contratti/utenze") ||
      s.startsWith("utenze/") ||
      (isGlobalClauseOrRisk(s) && slugHasAnyKeyword(s, TOPIC_KEYWORDS.utenze)),
  },
};

function countPagesForTopic(topic: Topic) {
  const cfg = TOPICS[topic];
  let n = 0;

  for (const p of EDITORIAL_PAGES) {
    const slugNorm = normalizeSlug(p.slug);
    if (cfg.match(slugNorm)) n++;
  }

  return n;
}

export default function ArgomentiIndexPage() {
  // mostra SOLO topic con contenuti (killer SEO: niente pagine vuote)
  const topics = (Object.keys(TOPICS) as Topic[])
    .map((t) => ({
      ...TOPICS[t],
      count: countPagesForTopic(t),
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <HeaderPublic />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 space-y-10">
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            ContrattiChiari • Argomenti
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950">
            Argomenti
          </h1>
          <p className="text-sm md:text-base text-zinc-600">
            Indici SEO automatici: scegli un argomento e vai dritto a guide, clausole e rischi.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/argomenti/${t.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-900 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-zinc-950">{t.title}</div>
                  <div className="mt-1 text-sm text-zinc-600">{t.subtitle}</div>
                </div>
                <div className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                  {t.count} pagine
                </div>
              </div>
            </Link>
          ))}
        </section>

        {!topics.length ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Nessun argomento disponibile: non ci sono ancora pagine editoriali associate.
          </div>
        ) : null}
      </main>

      <footer className="mt-4 border-t border-zinc-200 bg-white/80 py-4 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} ContrattiChiari.</p>
          <div className="order-1 flex flex-wrap items-center justify-center gap-4 sm:order-2">
            <Link href="/privacy" className="hover:text-zinc-800">Privacy policy</Link>
            <Link href="/termini" className="hover:text-zinc-800">Termini e condizioni</Link>
            <Link href="/" className="hover:text-zinc-800">Torna alla home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}