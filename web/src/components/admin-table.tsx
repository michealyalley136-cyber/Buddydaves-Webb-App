import clsx from "clsx";
import type { ReactNode } from "react";

export function AdminTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, ReactNode>[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[color-mix(in_oklab,var(--brand-teal)_8%,white)] text-xs font-bold uppercase tracking-[0.16em] text-ink/70">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={clsx("px-4 py-3", c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-subtle)]">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-black/[0.02]">
                {columns.map((c) => (
                  <td key={c.key} className={clsx("px-4 py-3 align-middle", c.className)}>
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
