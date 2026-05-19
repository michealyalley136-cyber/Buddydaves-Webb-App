function resolveApiBase() {
  const configured =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.API_URL?.trim() ||
    (typeof window === "undefined" ? process.env.API_PROXY_TARGET?.trim() : "");
  if (configured) return configured.replace(/\/$/, "");
  // Browser: same-origin `/api/*` (proxied to Express in next.config rewrites)
  if (typeof window !== "undefined") return "";
  return "http://localhost:4000";
}

export const API_BASE = resolveApiBase();

export class ApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(body);
    this.status = status;
    this.body = body;
  }
}

async function parseError(res: Response) {
  const t = await res.text();
  try {
    const j = JSON.parse(t) as { error?: string };
    return j.error ?? t;
  } catch {
    return t || res.statusText;
  }
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!r.ok) throw new ApiError(r.status, await parseError(r));
  return r.json() as Promise<T>;
}

export async function apiSend<T>(
  path: string,
  init: RequestInit & { token?: string | null }
): Promise<T> {
  const { token, headers, ...rest } = init;
  const headerObj: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  if (token) headerObj.Authorization = `Bearer ${token}`;
  const r = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: headerObj,
  });
  if (r.status === 204) return undefined as T;
  if (!r.ok) throw new ApiError(r.status, await parseError(r));
  return (await r.json()) as T;
}

export type MenuCategoryDto = {
  id: string;
  name: string;
  slug: string;
  items: {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    priceCents: number;
    imageUrl: string | null;
  }[];
};

export type MenuResponse = { categories: MenuCategoryDto[] };

export type OrderPayload = {
  orderType: "pickup" | "drive_thru";
  customerName: string;
  phone: string;
  pickupTime?: string;
  notes?: string;
  items: { menuItemId: string; quantity: number }[];
};

export type OrderResponse = {
  id: string;
  code: string;
  status: string;
  orderType: string;
  total: number;
  customerName: string;
  phone: string;
  pickupTime: string | null;
  notes: string | null;
  createdAt: string;
  items: { id: string; name: string; quantity: number; price: number }[];
};

export type TrackOrderResponse = OrderResponse & { updatedAt: string };
