"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (menuItemId: string, quantity: number) => void;
  removeLine: (menuItemId: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "buddy-daves-cart-v2";

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.menuItemId === "string" &&
    typeof o.name === "string" &&
    typeof o.price === "number" &&
    Number.isFinite(o.price) &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    o.quantity > 0 &&
    (o.imageUrl === null || typeof o.imageUrl === "string")
  );
}

function load(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(load());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addItem = useCallback((item: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.menuItemId === item.menuItemId);
      if (idx === -1) return [...prev, { ...item, quantity: qty }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      return next;
    });
  }, []);

  const setQty = useCallback((menuItemId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.menuItemId !== menuItemId);
      return prev.map((l) =>
        l.menuItemId === menuItemId ? { ...l, quantity } : l
      );
    });
  }, []);

  const removeLine = useCallback((menuItemId: string) => {
    setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    return { lines, addItem, setQty, removeLine, clear, subtotal, count };
  }, [lines, addItem, setQty, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
