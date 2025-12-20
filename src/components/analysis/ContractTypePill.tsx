export default function ContractTypePill({ value }: { value?: string }) {
  if (!value || !value.trim()) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
      {value}
    </span>
  );
}