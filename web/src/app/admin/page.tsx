"use client";

import { useEffect, useState } from "react";
import { useStaffAuth } from "@/context/staff-auth-context";
import { apiGet } from "@/lib/api";

type Summary = { pending: number; preparing: number; ready: number; todayOrders: number };

export default function AdminHomePage() {
  const { token } = useStaffAuth();
  const [s, setS] = useState<Summary | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<Summary>("/api/admin/orders/summary", token).then(setS).catch(() => setS(null));
  }, [token]);

  const cards = [
    { label: "Pending", value: s?.pending ?? "—", tone: "text-[var(--brand-brown)]" },
    { label: "Preparing", value: s?.preparing ?? "—", tone: "text-teal" },
    { label: "Ready", value: s?.ready ?? "—", tone: "text-[var(--accent-red)]" },
    { label: "Orders today", value: s?.todayOrders ?? "—", tone: "text-ink/80" },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-[var(--brand-brown)]">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Snapshot of the line — pair this with the staff board for real-time firepower.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">{c.label}</p>
            <p className={`mt-2 font-display text-4xl ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
