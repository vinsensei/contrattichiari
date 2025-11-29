// app/sitemap.ts
import { LANDINGS } from "@/lib/landingConfig";

export default function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://contrattochiaro.it";

  return Object.values(LANDINGS).map((landing) => ({
    url: `${baseUrl}${landing.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));
}