import type { OrderResponse } from "@/lib/api";

const STORAGE_KEY = "buddy-daves-last-order";

export type LastOrderSnapshot = Pick<
  OrderResponse,
  "code" | "total" | "orderType" | "customerName" | "items"
>;

export function saveLastOrder(order: LastOrderSnapshot) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* ignore quota errors */
  }
}

export function loadLastOrder(): LastOrderSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastOrderSnapshot;
    if (!parsed?.code || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}
