// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Contratti Chiari",
    short_name: "Contratti Chiari",
    description: "Analisi dei tuoi contratti in 30 secondi, con l’AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#005BFF",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
  };
}