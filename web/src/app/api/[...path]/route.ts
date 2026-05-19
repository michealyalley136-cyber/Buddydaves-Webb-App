import { NextRequest, NextResponse } from "next/server";

function resolveBackendBase(): string | null {
  const configured =
    process.env.API_PROXY_TARGET?.trim() ||
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  return configured ? configured.replace(/\/$/, "") : null;
}

let loggedTarget = false;
function logProxyTargetOnce(base: string) {
  if (loggedTarget) return;
  loggedTarget = true;
  console.log(`[web/api-proxy] Backend target: ${base}`);
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, context: RouteContext): Promise<NextResponse> {
  const backend =
    resolveBackendBase() ??
    (process.env.NODE_ENV === "development" ? "http://localhost:4000" : null);

  if (!backend) {
    return NextResponse.json(
      {
        error:
          "API proxy not configured. Set API_PROXY_TARGET on the web service to your Express server URL.",
      },
      { status: 502 }
    );
  }

  logProxyTargetOnce(backend);

  const { path } = await context.params;
  const incoming = new URL(req.url);
  const target = `${backend}/api/${path.join("/")}${incoming.search}`;

  const headers = new Headers();
  const authorization = req.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const method = req.method;
  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream request failed";
    console.error("[web/api-proxy] Fetch failed:", message);
    return NextResponse.json({ error: "API unavailable" }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("Content-Type", upstreamType);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export function GET(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export function POST(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export function PUT(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export function PATCH(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}

export function DELETE(req: NextRequest, context: RouteContext) {
  return proxy(req, context);
}
