import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root (parent of `web/`) so tracing & inference match this project, not a stray lockfile. */
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  /** Proxy API in dev so the browser can use same-origin `/api/*` (avoids CORS / wrong port). */
  async rewrites() {
    const api = process.env.API_PROXY_TARGET ?? "http://localhost:4000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
