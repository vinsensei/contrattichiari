import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { GA4_ID } from "@/lib/gtag";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import CookieBanner from "@/components/CookieBanner";
import MobilePricingCTA from "@/components/MobilePricingCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contratti Chiari – Analizza i tuoi contratti in 30 secondi",
  description:
    "Carica il PDF del tuo contratto e ottieni un’analisi chiara, in italiano semplice.",
  metadataBase: new URL("https://contrattichiari.it"),
  alternates: {
    canonical: "https://contrattichiari.it",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Contratti Chiari – Analizza i tuoi contratti in 30 secondi",
    description: "Analisi contratti con AI: clausole rischiose spiegate in modo chiaro.",
    url: "https://contrattichiari.it",
    siteName: "Contratti Chiari",
    type: "website",
    images: [
      {
        url: "https://contrattichiari.it/og-default.png",
        width: 1200,
        height: 630,
        alt: "Contratti Chiari",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contratti Chiari – Analizza i tuoi contratti in 30 secondi",
    description: "Analisi contratti con AI, in linguaggio semplice.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                window.gtag = window.gtag || gtag;
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20 md:pb-0`}>
        {children}
        <MobilePricingCTA />
        <CookieBanner />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
