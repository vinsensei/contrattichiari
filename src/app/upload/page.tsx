"use client";

import Head from "next/head";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContractUploadForm from "@/components/ContractUploadForm";
import HeaderPublic from "@/components/HeaderPublic";
import { gaEvent } from "@/lib/gtag";

function UploadPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get("from");

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://contrattichiari.it/" />
      </Head>
      <div className="min-h-screen bg-slate-50">
        {/* HEADER comune */}
        <HeaderPublic />

        <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
            {/* titolo + testo... */}

            <ContractUploadForm
              bottomLeftText=""
              bottomRightText=""
              onAnalyze={async (file) => {
                const fd = new FormData();
                fd.set("file", file);
                if (fromSlug) fd.set("from", fromSlug);

                // GA4: evento di inizio analisi anonima
                gaEvent("anonymous_analysis_started", {
                  from_slug: fromSlug || "(none)",
                  file_size: file.size,
                  file_type: file.type || "(unknown)",
                });

                const res = await fetch("/api/analysis/anonymous", {
                  method: "POST",
                  body: fd,
                });

                if (!res.ok) {
                  // GA4: analisi fallita
                  gaEvent("anonymous_analysis_failed", {
                    from_slug: fromSlug || "(none)",
                    http_status: res.status,
                  });

                  throw new Error("Errore durante l'analisi del contratto.");
                }

                const data = (await res.json()) as { analysisId: string };

                // GA4: analisi creata
                gaEvent("anonymous_analysis_created", {
                  analysis_id: data.analysisId,
                  from_slug: fromSlug || "(none)",
                });

                const search = new URLSearchParams();
                search.set("analysisId", data.analysisId);
                if (fromSlug) search.set("from", fromSlug);

                router.push(`/register?${search.toString()}`);
              }}
            />
        </main>
      </div>
    </>
  );
}


export default function UploadPage() {
  return (
    <Suspense fallback={null}>
      <UploadPageInner />
    </Suspense>
  );
}