// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { landingSlugs, getLandingBySlug } from "@/lib/landingConfig";

// Dominio principale (già corretto)
const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://contrattichiari.it")
    .replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  //
  // --- 1. ROTTE STATICHE ---
  //
  const staticPages = [
    { path: "/", priority: 1.0, freq: "daily" },
    { path: "/pricing", priority: 0.7, freq: "weekly" },
    { path: "/login", priority: 0.5, freq: "monthly" },
    { path: "/register", priority: 0.5, freq: "monthly" },
    { path: "/upload", priority: 0.8, freq: "weekly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/termini", priority: 0.3, freq: "yearly" },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, freq }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: freq as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority,
    })
  );

  //
  // --- 2. LANDING SEO DINAMICHE ---
  //
  const landingRoutes: MetadataRoute.Sitemap = landingSlugs
    .map((slug) => {
      const landing = getLandingBySlug(slug);
      if (!landing) return null;

      return {
        url: `${BASE_URL}${landing.path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  //
  // --- RETURN COMPLETO ---
  //
  return [...staticRoutes, ...landingRoutes];
}