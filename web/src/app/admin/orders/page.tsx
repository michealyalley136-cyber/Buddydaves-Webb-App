"use client";

import { useEffect, useState } from "react";
import { useStaffAuth } from "@/context/staff-auth-context";
import { apiGet } from "@/lib/api";
import { AdminTable } from "@/components/admin-table";

type Row = {
  id: string;
  code: string;
  status: string;
  customerName: string;
  total: number;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const { token } = useStaffAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!token) return;
    apiGet<{ orders: Row[] }>("/api/admin/recent-orders", token)
      .then((r) => setRows(r.orders))
      .catch(() => setRows([]));
  }, [token]);

  if (!rows) return <p className="text-sm text-ink/60">Loading orders…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-[var(--brand-brown)]">Orders</h1>
        <p className="mt-2 text-sm text-ink/70">Recently completed tickets — extend with filters as you grow.</p>
      </div>
      <AdminTable
        columns={[
          { key: "code", label: "Code" },
          { key: "customer", label: "Customer" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
        ]}
        rows={rows.map((o) => ({
          code: o.code,
          customer: o.customerName,
          total: `$${o.total.toFixed(2)}`,
          status: o.status,
        }))}
      />
    </div>
  );
}
