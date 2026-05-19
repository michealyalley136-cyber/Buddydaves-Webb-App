"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useStaffAuth } from "@/context/staff-auth-context";
import { useStaffAlerts } from "@/context/staff-alerts-context";
import { StaffShell } from "./staff-shell";
import { apiGet, apiSend } from "@/lib/api";
import { StaffOrderCard, type StaffOrderRow } from "@/components/staff-order-card";
import { OrderListSkeleton } from "@/components/loading-skeletons";
import { StaffAlertSettingsPanel } from "@/components/staff-alert-settings-panel";
import { StaffNewOrderAlertBanner } from "@/components/staff-new-order-alert-banner";
import { StaffNewOrderAlertModal } from "@/components/staff-new-order-alert-modal";
import { sortOrdersKitchenFirst, useStaffOrderAlerts } from "@/hooks/use-staff-order-alerts";
import { getMuteRemainingMs, wantsSound, wantsPopup } from "@/lib/staff-alert-settings";

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
  const [demoBusy, setDemoBusy] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { audioUnlocked, settings, notificationPermission } = useStaffAlerts();

  const isActiveQueue = mode === "active";
  const kitchenMode = settings.kitchenMode && isActiveQueue;
  const alerts = useStaffOrderAlerts(rows, isActiveQueue);

  const qs = mode === "completed" ? "?view=completed" : "";

  const loadOrders = useCallback(
    async (silent = false) => {
      if (!silent) setRows(null);
      try {
        const r = await apiGet<{ orders: StaffOrderRow[] }>(`/api/staff/orders${qs}`, token);
        setRows(r.orders);
        setLastRefresh(new Date());
      } catch {
        if (!silent) setRows([]);
      }
    },
    [token, qs]
  );

  useEffect(() => {
    void loadOrders();
    if (!isActiveQueue) return;
    const id = window.setInterval(() => void loadOrders(true), 5000);
    return () => window.clearInterval(id);
  }, [loadOrders, isActiveQueue]);

  useEffect(() => {
    alerts.registerOnNewAlert(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [alerts.registerOnNewAlert]);

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

  async function onDemoOrder() {
    setDemoBusy(true);
    try {
      await apiSend("/api/staff/demo-order", { method: "POST", token });
      await loadOrders(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setDemoBusy(false);
    }
  }

  const title = mode === "completed" ? "Completed orders" : "Active queue";

  if (!rows) return <OrderListSkeleton />;

  const displayRows = kitchenMode ? sortOrdersKitchenFirst(rows) : rows;

  const needsAlertSetup =
    (wantsSound(settings) && !audioUnlocked) ||
    (wantsPopup(settings) &&
      notificationPermission !== "granted" &&
      notificationPermission !== "unsupported");

  const showModal =
    alerts.unacknowledgedOrders.length > 0 &&
    alerts.hasActiveAlert &&
    (alerts.forceFullscreenModal || alerts.showVisualFallback || needsAlertSetup);

  const muteRemaining = getMuteRemainingMs(settings);

  return (
    <>
      {showModal && (
        <StaffNewOrderAlertModal
          orders={alerts.unacknowledgedOrders}
          onAcknowledge={alerts.acknowledgeOrder}
          onAcknowledgeAll={alerts.acknowledgeAll}
          kitchenMode={kitchenMode}
        />
      )}

      <section ref={topRef} className={clsx(kitchenMode && "bd-kitchen-queue")}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-gold)]">Kitchen</p>
            <h2 className={clsx("font-display", kitchenMode ? "text-5xl" : "text-4xl")}>{title}</h2>
            {isActiveQueue && (
              <p className="mt-1 text-xs text-white/50">
                Live queue · refreshes every 5s
                {lastRefresh ? ` · Updated ${lastRefresh.toLocaleTimeString()}` : ""}
                {kitchenMode ? " · Kitchen mode" : ""}
                {muteRemaining > 0 ? ` · Muted ${Math.ceil(muteRemaining / 60000)}m` : ""}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isActiveQueue && (
              <>
                <button
                  type="button"
                  onClick={() => void onDemoOrder()}
                  disabled={demoBusy}
                  className="rounded-full border border-dashed border-[var(--brand-gold)]/60 bg-[var(--brand-gold)]/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-gold)] touch-manipulation disabled:opacity-50"
                >
                  {demoBusy ? "Creating…" : "Demo incoming order"}
                </button>
                <Link
                  href="/staff/dashboard?view=settings"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80"
                >
                  Alerts
                </Link>
              </>
            )}
            {isActiveQueue && needsAlertSetup && (
              <Link
                href="/staff/dashboard?view=settings"
                className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)]"
              >
                Set up alerts
              </Link>
            )}
          </div>
        </div>

        {isActiveQueue && alerts.unacknowledgedOrders.length > 0 && (
          <div className={clsx("mt-4", kitchenMode && "-mx-4 sm:mx-0")}>
            <StaffNewOrderAlertBanner
              orders={alerts.unacknowledgedOrders}
              onAcknowledgeAll={alerts.acknowledgeAll}
              showVisualFallback={alerts.showVisualFallback}
              kitchenMode={kitchenMode}
              secondsUntilRepeat={alerts.secondsUntilRepeat}
              isMuted={alerts.isMuted}
            />
          </div>
        )}

        <div className={clsx("mt-6 space-y-4", kitchenMode && "space-y-6")}>
          {displayRows.length === 0 ? (
            <p
              className={clsx(
                "rounded-2xl border border-white/10 bg-[#1b1f24] text-white/65",
                kitchenMode ? "p-8 text-lg" : "p-6 text-sm"
              )}
            >
              No orders in this view right now.
            </p>
          ) : (
            displayRows.map((o) => (
              <StaffOrderCard
                key={o.id}
                order={o}
                onStatus={onStatus}
                busy={busy}
                isAlerting={alerts.isOrderAlerting(o.id)}
                onAcknowledge={alerts.acknowledgeOrder}
                kitchenMode={kitchenMode}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
