"use client";

type HeaderPrivateProps = {
  userEmail?: string | null;
  planLabel: string;
  plan?: string | null;
  isActive?: boolean;
  onLogout: () => void;
};

export default function HeaderPrivate({
  userEmail,
  planLabel,
  plan,
  isActive,
  onLogout,
}: HeaderPrivateProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
      <a href="/" className="inline-flex items-center">
        <img
          src="/logo.png"
          alt="ContrattoChiaro"
          className="h-9 w-auto"
        />
      </a>
      <div className="flex items-center gap-4 text-sm text-slate-700">
        <div className="flex flex-col items-end">
          {userEmail && <span className="font-medium">{userEmail}</span>}
          <span className="text-xs text-slate-500">
            Piano: {planLabel}
            {!isActive && plan !== "free" && " (non attivo)"}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs"
        >
          Esci
        </button>
      </div>
    </header>
  );
}