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
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {pills.map((p) => {
        const isOn = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={clsx(
              "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition",
              isOn
                ? "bg-[var(--brand-teal)] text-white shadow-sm"
                : "border border-[var(--line-subtle)] bg-white text-[var(--text-muted)] hover:border-teal/30 hover:text-teal"
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
