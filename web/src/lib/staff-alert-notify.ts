import type { StaffAlertSettings } from "@/lib/staff-alert-settings";
import { wantsPopup } from "@/lib/staff-alert-settings";

export function showDesktopNotification(
  title: string,
  body: string,
  tag?: string
): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;
  try {
    new Notification(title, {
      body,
      tag: tag ?? "bd-staff-alert",
      requireInteraction: true,
      icon: "/images/buddy-daves-logo.png",
    });
    return true;
  } catch {
    return false;
  }
}

export function showNewOrderNotification(orderCode: string, orderId: string): boolean {
  return showDesktopNotification(
    "New Buddy Dave's Order",
    `Order ${orderCode} is ready for review.`,
    `bd-order-${orderId}`
  );
}

export function showTestNotification(): boolean {
  return showDesktopNotification(
    "Buddy Dave's — Test Alert",
    "If you see this, pop-up notifications are working on this computer.",
    "bd-staff-test"
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.requestPermission();
}

export function canUsePopup(settings: StaffAlertSettings): boolean {
  return wantsPopup(settings);
}

export function vibrateAlert(pattern: number | number[] = [200, 100, 200]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
