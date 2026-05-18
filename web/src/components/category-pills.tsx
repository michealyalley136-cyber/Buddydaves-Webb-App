"use client";

import clsx from "clsx";

export type Pill = { id: string; label: string };

export function CategoryPills({
  pills,
  active,
  onChange,
}: {
  pills: Pill[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {pills.map((p) => {
        const isOn = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={clsx(
              "whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ring-1 transition",
              isOn
                ? "bg-[var(--brand-brown)] text-[var(--bg-cream)] ring-black/20 shadow-diner"
                : "bg-white/80 text-ink/75 ring-black/10 hover:bg-white"
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
