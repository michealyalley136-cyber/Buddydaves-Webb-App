"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStaffAuth } from "@/context/staff-auth-context";
import { useStaffAlerts } from "@/context/staff-alerts-context";
import { StaffShell } from "./staff-shell";
import { apiGet, apiSend } from "@/lib/api";
import { StaffOrderCard, type StaffOrderRow } from "@/components/staff-order-card";
import { OrderListSkeleton } from "@/components/loading-skeletons";
import { StaffAlertSettingsPanel } from "@/components/staff-alert-settings-panel";
import { StaffNewOrderAlertBanner } from "@/components/staff-new-order-alert-banner";
import { StaffNewOrderAlertModal } from "@/components/staff-new-order-alert-modal";
import { useStaffOrderAlerts } from "@/hooks/use-staff-order-alerts";
import { wantsSound, wantsPopup } from "@/lib/staff-alert-settings";

export function StaffDashboardPage() {
  return (
    <StaffShell>
      <StaffDashboardContent />
    </StaffShell>
  );
}

function StaffDashboardContent() {
  const { token } = useStaffAuth();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "settings") {
    return <StaffAlertSettingsPanel />;
  }

  if (view === "audit") {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#1b1f24] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-gold)]">Daily audit</p>
        <h2 className="mt-2 font-display text-3xl">Shift notes &amp; counts</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/65">
          Placeholder for cash drawer reconciliation, comps, and waste logging.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-white/70">
          <li>• Open tickets snapshot (coming soon)</li>
          <li>• Menu 86 list (coming soon)</li>
          <li>• Staff sign-off (coming soon)</li>
        </ul>
      </section>
    );
  }

  const mode = view === "completed" ? "completed" : "active";
  if (!token) {
    return (
      <p className="rounded-2xl border border-white/10 bg-[#1b1f24] p-6 text-sm text-white/65">
        Session expired — sign in again from the staff login page.
      </p>
    );
  }
  return <OrdersPanel token={token} mode={mode} />;
}

function OrdersPanel({ token, mode }: { token: string; mode: "active" | "completed" }) {
  const [rows, setRows] = useState<StaffOrderRow[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { audioUnlocked, settings, notificationPermission } = useStaffAlerts();

  const isActiveQueue = mode === "active";
  const alerts = useStaffOrderAlerts(rows, isActiveQueue);

  const qs = mode === "completed" ? "?view=completed" : "";

  async function loadOrders(silent = false) {
    if (!silent) setRows(null);
    try {
      const r = await apiGet<{ orders: StaffOrderRow[] }>(`/api/staff/orders${qs}`, token);
      setRows(r.orders);
      setLastRefresh(new Date());
    } catch {
      if (!silent) setRows([]);
    }
  }

  useEffect(() => {
    void loadOrders();
    if (!isActiveQueue) return;
    const id = window.setInterval(() => void loadOrders(true), 5000);
    return () => window.clearInterval(id);
  }, [token, qs, isActiveQueue]);

  async function onStatus(id: string, status: string) {
    setBusy(id);
    try {
      await apiSend(`/api/staff/orders/${id}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status }),
      });
      alerts.acknowledgeOrder(id);
      await loadOrders(true);
    } finally {
      setBusy(null);
    }
  }

  const title = mode === "completed" ? "Completed orders" : "Active queue";

  if (!rows) return <OrderListSkeleton />;

  const needsAlertSetup =
    (wantsSound(settings) && !audioUnlocked) ||
    (wantsPopup(settings) &&
      notificationPermission !== "granted" &&
      notificationPermission !== "unsupported");

  const showModal =
    alerts.unacknowledgedOrders.length > 0 &&
    alerts.hasActiveAlert &&
    (alerts.showVisualFallback || needsAlertSetup);

  return (
    <>
      {showModal && (
        <StaffNewOrderAlertModal
          orders={alerts.unacknowledgedOrders}
          onAcknowledge={alerts.acknowledgeOrder}
          onAcknowledgeAll={alerts.acknowledgeAll}
        />
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-gold)]">Kitchen</p>
            <h2 className="font-display text-4xl">{title}</h2>
            {isActiveQueue && (
              <p className="mt-1 text-xs text-white/50">
                Live queue · refreshes every 5s
                {lastRefresh ? ` · Updated ${lastRefresh.toLocaleTimeString()}` : ""}
              </p>
            )}
          </div>
          {isActiveQueue && needsAlertSetup && (
            <Link
              href="/staff/dashboard?view=settings"
              className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)]"
            >
              Set up alerts in Settings
            </Link>
          )}
        </div>

        {isActiveQueue && alerts.unacknowledgedOrders.length > 0 && (
          <div className="mt-4">
            <StaffNewOrderAlertBanner
              orders={alerts.unacknowledgedOrders}
              onAcknowledgeAll={alerts.acknowledgeAll}
              showVisualFallback={alerts.showVisualFallback}
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          {rows.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-[#1b1f24] p-6 text-sm text-white/65">
              No orders in this view right now.
            </p>
          ) : (
            rows.map((o) => (
              <StaffOrderCard
                key={o.id}
                order={o}
                onStatus={onStatus}
                busy={busy}
                isAlerting={alerts.isOrderAlerting(o.id)}
                onAcknowledge={alerts.acknowledgeOrder}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
