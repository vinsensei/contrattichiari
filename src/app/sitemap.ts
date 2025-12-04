// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { landingSlugs, getLandingBySlug } from "@/lib/landingConfig";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://contrattichiari.it")
    .replace(/\/+$/, ""); // toglie eventuale "/" finale

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pagine statiche principali
  const staticRoutes: MetadataRoute.Sitemap = [
    "/", // home
    "/pricing",
    "/login",
    "/register",
    "/upload",
    "/privacy",
    "/termini",
    "/dashboard",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  // Landing generate da LANDINGS / [slug]
  const landingRoutes: MetadataRoute.Sitemap = landingSlugs
    .map((slug) => {
      const landing = getLandingBySlug(slug);
      if (!landing) return null;

      return {
        url: `${BASE_URL}${landing.path}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return [...staticRoutes, ...landingRoutes];
}