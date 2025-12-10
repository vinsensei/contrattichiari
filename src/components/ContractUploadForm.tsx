"use client";

import { useState, useRef, FormEvent } from "react";

type ContractUploadFormProps = {
  onAnalyze: (file: File) => Promise<void>;
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setErrorMsg(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0] || null;
    if (dropped) {
      setFile(dropped);
      setErrorMsg(null);
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

    setErrorMsg(null);
    setIsLoading(true);

    try {
      await onAnalyze(file);
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
      <div className="text-center max-w-xl mx-auto space-y-2 animate-fade-in-up delay-1 mt-xs-0 mt-20">
        <h1 className="text-3xl md:text-4xl tracking-tight text-slate-900">
          Da oggi i tuoi contratti sono chiari
        </h1>
        <p className="text-sm text-slate-500 mb-10">
          Carica il PDF e ti evidenziamo rischi, clausole nascoste e punti da
          chiarire.
        </p>
      </div>

      {/* Upload area */}
      <div
        className={`relative flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 transition animate-fade-in-up delay-2 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50/60"
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
          <div className="relative inline-flex h-30 w-30 items-center justify-center rounded-full border border-slate-200 bg-white overflow-hidden">
            {/* ripple rings */}
            <span className="pointer-events-none absolute inset-0 rounded-full border border-slate-300/70 animate-ripple" />
            <span className="pointer-events-none absolute inset-0 rounded-full border border-slate-300/40 animate-ripple-slow" />
            {/* centered icon */}
            {file ? (
              <img src="uploadok.svg" className="relative z-10 w-10 h-auto" />
            ) : (
              <img src="upload.svg" className="relative z-10 w-10 h-auto" />
            )}
          </div>

          <div
            className={`mt-2 rounded-full px-3 py-1 text-[11px] font-medium text-slate-700 ${
              isDragging ? "bg-white" : "bg-slate-100"
            }`}
          >
            {file ? (
              <span>
                File selezionato:{" "}
                <span className="font-semibold truncate max-w-xs inline-block align-middle">
                  {file.name}
                </span>
              </span>
            ) : (
              <>
                <span>Carica il tuo contratto</span>
              </>
            )}
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-[2px] border-slate-300 border-t-slate-900" />
              <span>
                Sto leggendo il tuo contratto. Il file non viene mai salvato
              </span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

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
