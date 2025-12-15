"use client";

import { useState } from "react";
import { WHY_YOU_SEE_THIS } from "@/lib/whyYouSeeThis";

type Props = {
  id: keyof typeof WHY_YOU_SEE_THIS;
};

export default function WhyYouSeeThis({ id }: Props) {
  const [open, setOpen] = useState(false);
  const data = WHY_YOU_SEE_THIS[id];

  if (!data) return null;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition"
      >
        ⓘ Perché lo vedo
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[280px] rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-700 shadow-lg">
          <p className="font-medium text-zinc-900 mb-1">
            {data.title}
          </p>
          <p>{data.text}</p>
        </div>
      )}
    </div>
  );
}