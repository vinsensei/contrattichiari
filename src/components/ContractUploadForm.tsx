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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 transition ${
          isDragging ? "border-indigo-400 bg-indigo-50/60" : "border-slate-300 bg-white"
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

        <div className="pointer-events-none flex flex-col items-center gap-3 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-sm">
            <span className="text-lg">📄</span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">
              Trascina qui il tuo contratto oppure{" "}
              <span className="underline decoration-slate-400">seleziona un file</span>
            </p>
            <p className="text-xs text-slate-500">
              Supportiamo PDF fino a 10 MB. I dati vengono analizzati in modo sicuro e non
              vengono riutilizzati.
            </p>
          </div>

          {file && (
            <div className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
              File selezionato:{" "}
              <span className="font-semibold truncate max-w-xs inline-block align-middle">
                {file.name}
              </span>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-[2px] border-slate-300 border-t-slate-900" />
              <span>Sto leggendo il tuo contratto</span>
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

      {errorMsg && (
        <p className="text-xs text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
        <span>{bottomLeftText}</span>
        <span className="text-right">{bottomRightText}</span>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!file || isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
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