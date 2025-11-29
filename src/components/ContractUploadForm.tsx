"use client";

import { FormEvent, useRef, useState } from "react";

type ContractUploadFormProps = {
  /**
   * Funzione chiamata alla submit:
   * riceve il File e deve lanciare la logica di analisi (fetch, redirect, ecc.).
   */
  onAnalyze: (file: File) => Promise<void>;

  /**
   * Testo descrittivo sopra il form (opzionale).
   */
  description?: string;

  /**
   * Testo in basso a sinistra (step / hint, opzionale).
   */
  bottomLeftText?: string;

  /**
   * Testo in basso a destra (es. “passo successivo…”, opzionale).
   */
  bottomRightText?: string;

  /**
   * Label del bottone di submit.
   */
  submitLabel?: string;
};

export function ContractUploadForm({
  onAnalyze,
  description = "Carica il PDF o una scansione leggibile. Il motore di intelligenza artificiale legge il contratto, individua le clausole critiche e ti restituisce un riassunto chiaro prima che tu decida se firmare.",
  bottomLeftText = "Passaggio 1 · Caricamento contratto",
  bottomRightText = "Passaggio successivo: analisi e risultato",
  submitLabel = "Inizia l'analisi gratuita",
}: ContractUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const baseDropzoneClasses =
    "relative rounded-2xl border border-dashed px-6 py-10 text-center shadow-sm transition";
  const inactiveClasses =
    "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50";
  const activeClasses = "border-sky-400 bg-sky-50";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!file) {
      setErrorMsg("Seleziona un file prima di continuare.");
      return;
    }

    if (file.size === 0) {
      setErrorMsg("Il file è vuoto.");
      return;
    }

    try {
      setSubmitting(true);
      await onAnalyze(file);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message || "Errore durante l'analisi del contratto."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const LoaderOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white/90 px-6 py-5 shadow-lg">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs">
            🤖
          </span>
          Motore AI in esecuzione
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500" />
          <div className="flex flex-col text-left">
            <p className="text-sm font-medium text-zinc-800">
              Analisi in corso… stiamo leggendo e interpretando le clausole.
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              L&apos;intelligenza artificiale individua clausole critiche,
              rischi e punti da rinegoziare nel contratto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {submitting && <LoaderOverlay />}

      <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Analizza un nuovo contratto
        </h1>
        <p className="text-sm text-slate-600 mb-4">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropzone AI */}
          <div
            className={`${baseDropzoneClasses} ${
              isHighlighted ? activeClasses : inactiveClasses
            }`}
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-800">
              <span aria-hidden="true">🤖</span>
              <span>Analisi con intelligenza artificiale</span>
            </div>

            <div className="mt-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <span className="text-xl" aria-hidden="true">
                📄
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-900">
              Trascina qui il tuo contratto
            </p>
            <p className="mt-1 text-xs text-slate-500">
              PDF o documenti leggibili. Oppure
            </p>

            <label
              htmlFor="contract-upload-input"
              className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-800"
            >
              Scegli un file dal dispositivo
            </label>

            {/* Input file invisibile ma cliccabile su tutta l'area */}
            <input
              id="contract-upload-input"
              ref={fileInputRef}
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              required
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={() => {
                const selected = fileInputRef.current?.files?.[0] ?? null;
                setFile(selected);
                if (selected) {
                  setFileName(selected.name);
                  setIsHighlighted(true);
                  setErrorMsg(null);
                } else {
                  setFileName(null);
                  setIsHighlighted(false);
                }
              }}
              onClick={() => {
                // reset per permettere di riselezionare lo stesso file
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                setFile(null);
                setFileName(null);
                setIsHighlighted(false);
              }}
            />

            {fileName && (
              <p className="mt-3 text-[11px] font-medium text-slate-700">
                File selezionato:{" "}
                <span className="font-semibold">{fileName}</span>
              </p>
            )}

            <p className="mt-2 text-[11px] text-slate-500">
              Il documento viene usato solo per l&apos;analisi e non conservato
              oltre il necessario.
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600">{errorMsg}</p>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <p>{bottomLeftText}</p>
            <p>{bottomRightText}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Analisi in corso..." : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}