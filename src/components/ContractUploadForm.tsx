"use client";

import Link from "next/link";
import { useState, useRef, FormEvent } from "react";

type ContractUploadFormProps = {
  onAnalyze: (file: File) => Promise<{ analysisId?: string } | void>;
  bottomLeftText?: string;
  bottomRightText?: string;
};

export default function ContractUploadForm({
  onAnalyze,
  bottomLeftText,
  bottomRightText,
}: ContractUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisCreated, setAnalysisCreated] = useState<{ analysisId?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_MB = 10;
  const MAX_BYTES = MAX_MB * 1024 * 1024;

  // Keep conservative: these are the formats we promise in copy.
  const ALLOWED_MIMES = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ]);

  const friendlyFormatList = "PDF, DOCX, JPG o PNG";

  const validateFile = (f: File): string | null => {
    // Some browsers may provide empty mime for certain drags; fallback to extension.
    const name = (f.name || "").toLowerCase();
    const ext = name.includes(".") ? name.split(".").pop() : "";
    const byExtAllowed = ext === "pdf" || ext === "docx" || ext === "jpg" || ext === "jpeg" || ext === "png";

    const mimeOk = f.type ? ALLOWED_MIMES.has(f.type) : byExtAllowed;
    if (!mimeOk) {
      return `Formato non supportato. Usa ${friendlyFormatList}.`;
    }

    if (f.size > MAX_BYTES) {
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      return `File troppo grande (${sizeMb} MB). Limite massimo: ${MAX_MB} MB.`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) {
      setFile(null);
      setErrorMsg(null);
      return;
    }

    const err = validateFile(selected);
    if (err) {
      setFile(null);
      setErrorMsg(err);
      // allow re-picking the same file
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFile(selected);
    setErrorMsg(null);
    setAnalysisCreated(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0] || null;
    if (dropped) {
      const err = validateFile(dropped);
      if (err) {
        setFile(null);
        setErrorMsg(err);
        return;
      }

      setFile(dropped);
      setErrorMsg(null);
      setAnalysisCreated(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || isLoading) return;

    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setAnalysisCreated(null);

    try {
      const res = await onAnalyze(file);
      // If caller returns an id we keep it; otherwise we still show success.
      if (res && typeof res === "object" && "analysisId" in res) {
        setAnalysisCreated({ analysisId: res.analysisId });
      } else {
        setAnalysisCreated({});
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Si è verificato un errore durante l'analisi. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 animate-fade-in-up delay-1 mt-0 md:mt-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-slate-900">
          Da oggi i tuoi contratti sono chiari
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-10">
          Carica il PDF e ti evidenziamo rischi, clausole nascoste e punti da chiarire.
        </p>
    </div>

      {/* Upload area */}
      <div
        className={`relative flex min-h-[260px] sm:min-h-[450px] flex-col items-center justify-center
    rounded-2xl sm:rounded-3xl
    border border-dashed
    px-4 sm:px-6
    py-6 sm:py-10
    transition
    animate-fade-in-up delay-2
    ${
      isDragging
        ? "border-[#1E41FF] bg-[rgba(30,65,255,0.06)]"
        : "border-slate-300 bg-white"
    }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Click area overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 cursor-pointer"
          aria-label="Carica contratto"
        />

        <div className="pointer-events-none flex flex-col items-center gap-4 text-center">
          <div className="relative inline-flex h-20 w-20 sm:h-30 sm:w-30 items-center justify-center rounded-full border border-slate-200 bg-white overflow-hidden">
            {/* ripple rings – solo desktop */}
            <span className="pointer-events-none absolute inset-0 hidden sm:block rounded-full border border-slate-300/70 animate-ripple" />
            <span className="pointer-events-none absolute inset-0 hidden sm:block rounded-full border border-slate-300/40 animate-ripple-slow" />

            {file ? (
              <img
                src="/uploadok.svg"
                className="relative z-10 w-8 sm:w-10 h-auto"
              />
            ) : (
              <img
                src="/upload.svg"
                className="relative z-10 w-8 sm:w-10 h-auto"
              />
            )}
          </div>

          <div
            className={`mt-3 rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-medium
          ${isDragging ? "bg-white text-[#1E41FF]" : "bg-slate-100 text-slate-700"}`}
          >
            {file ? (
              <span>
                File selezionato:{" "}
                <span className="font-semibold truncate max-w-[180px] inline-block align-middle">
                  {file.name}
                </span>
              </span>
            ) : (
              <p className="text-xs text-slate-600">
                {friendlyFormatList} · max {MAX_MB} MB
              </p>
            )}
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-[2px] border-slate-300 border-t-[#1E41FF]" />
              <span>
                Sto leggendo il contratto. Il file non viene mai salvato.
              </span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-700 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2">
          {errorMsg}
        </p>
      )}

      {analysisCreated && (
        <div className="mb-6">
          <div className="rounded-xl border border-green-200 bg-green-50/70 px-3 py-2 text-xs text-green-900">
            <div className="flex items-start gap-2">
              <span aria-hidden>✅</span>
              <div>
                <p className="font-medium">Analisi creata con successo 🎉</p>
                <p className="mt-0.5">
                  L’analisi è stata salvata ed è ora consultabile.
                  <Link
                    href={analysisCreated?.analysisId ? `/analysis/${analysisCreated.analysisId}` : "/dashboard/analyses"}
                    className="ml-1 underline underline-offset-2 font-medium"
                  >
                    {analysisCreated?.analysisId ? "Apri l’ultima analisi" : "Vai alle tue analisi"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 animate-fade-in-up delay-4">
        <span>{bottomLeftText}</span>
        <span className="text-right">{bottomRightText}</span>
      </div>

      {/* Call to action con fade-in bottom-to-top */}
      <div className="flex justify-center pt-4 animate-fade-in-up delay-4">
        <button
          type="submit"
          disabled={!file || isLoading}
          className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-slate-200 border-t-slate-50" />
              Analisi in corso…
            </>
          ) : (
            <>Avvia analisi rapida</>
          )}
        </button>
      </div>
    </form>
  );
}
