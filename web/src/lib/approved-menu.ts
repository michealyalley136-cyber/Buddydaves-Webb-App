/** Owner-approved menu — keep in sync with server/prisma/seed.ts */
export const APPROVED_MENU_ITEM_NAMES = [
  "Philly Cheesesteak",
  "Double Mushroom Melt",
  "Cheese Curds",
  "Gallon Fresh Made Rootbeer",
  "Rootbeer Float",
] as const;

export const APPROVED_MENU_COUNT = APPROVED_MENU_ITEM_NAMES.length;

export type ApprovedMenuItemName = (typeof APPROVED_MENU_ITEM_NAMES)[number];

const approvedSet = new Set<string>(APPROVED_MENU_ITEM_NAMES);

export function isApprovedMenuItemName(name: string): boolean {
  return approvedSet.has(name);
}

/** Shown once on menu (and optionally homepage). */
export const PHOTOS_PENDING_NOTE =
  "Photos shown are placeholders — pending owner confirmation.";

/** Shown only on Rootbeer Float menu card / homepage feature. */
export const ROOTBEER_FLOAT_PRICE_NOTE =
  "Rootbeer Float price pending owner confirmation ($4.99 shown for demo).";

export const BUSINESS_HOURS_PENDING_NOTE =
  "Final business hours pending owner confirmation.";

export const PHONE_PENDING_NOTE = "Phone number pending owner confirmation.";

export function getMenuItemPendingNote(name: string): string | null {
  if (name === "Rootbeer Float") return ROOTBEER_FLOAT_PRICE_NOTE;
  return null;
}
