# Buddy Dave's — Railway deployment guide

Deploy the GitHub repo **`michealyalley136-cyber/Buddydaves-Webb-App`** as **two Railway services** (web + API) plus **PostgreSQL**.

Monorepo layout:

| Path     | Stack                          |
| -------- | ------------------------------ |
| `web/`   | Next.js 15 storefront + PWA    |
| `server/`| Express + Prisma + PostgreSQL  |

---

## Deployed URLs (current)

| Service | URL |
| ------- | --- |
| **Live website** | https://web-production-3bbed.up.railway.app/ |
| **Menu** | https://web-production-3bbed.up.railway.app/menu |
| **Staff login** | https://web-production-3bbed.up.railway.app/staff/login |
| **API health (via web proxy)** | https://web-production-3bbed.up.railway.app/api/health |
| **API health (server direct)** | https://server-production-e915.up.railway.app/api/health |
| **Menu (server direct)** | https://server-production-e915.up.railway.app/api/menu |
| **Menu (via web proxy)** | https://web-production-3bbed.up.railway.app/api/menu |

Full production URL list: **`Buddy-Daves-URLs.txt`** (PRODUCTION sections).

**Server `CORS_ORIGIN` should be:** `https://web-production-3bbed.up.railway.app` (no trailing slash)

---

## 1. Railway project setup

1. Create a **new Railway project**.
2. **Add PostgreSQL** (Railway plugin). Copy the **`DATABASE_URL`** variable.
3. **Add service — Server (API)**  
   - Connect GitHub repo `michealyalley136-cyber/Buddydaves-Webb-App`  
   - Set **Root Directory** to `server` (see below).
4. **Add service — Web (frontend)**  
   - Same repo  
   - Set **Root Directory** to `web`.

Deploy **server first** (database + API), then **web** (needs the server public URL).

---

## 2. Server service settings

| Setting          | Value                                      |
| ---------------- | ------------------------------------------ |
| **Root Directory** | `server`                               |
| **Build Command**  | `npm install && npm run build`         |
| **Start Command**  | `npm start`                            |

### Server environment variables

| Variable       | Value |
| -------------- | ----- |
| `NODE_ENV`     | `production` |
| `DATABASE_URL` | Paste from Railway PostgreSQL (`${{Postgres.DATABASE_URL}}` reference) |
| `JWT_SECRET`   | Generate a **new** long random string (64+ chars). Never use the dev default. |
| `CORS_ORIGIN`  | Your **web** service public URL, e.g. `https://web-production-3bbed.up.railway.app` (no trailing slash). Comma-separate multiple origins if needed. |
| `PORT`         | Railway sets this automatically; optional `4000` for local parity. |

`CORS_ORIGIN` is **required** in production. The API does **not** use open wildcard CORS in production.

### Database schema (first deploy)

This repo currently has **no `prisma/migrations` folder**. Use one of:

**Temporary first deployment (schema sync):**

Run once from the server service shell (Railway → service → Shell), or as a one-off command:

```bash
npx prisma db push && npx prisma generate
```

Optional seed (creates staff/admin users — **only for initial setup**):

```bash
npm run db:seed
```

Credentials are written to `DEFAULT_LOGINS.txt` on the server filesystem (gitignored). Copy them securely; do not commit.

**Preferred once migrations exist:**

```bash
npx prisma migrate deploy
```

Add migration files locally with `npx prisma migrate dev` before switching production to `migrate deploy`.

### Server health check

After deploy, open:

```text
https://YOUR-SERVER-SERVICE.up.railway.app/api/health
```

Expect JSON like `{ "ok": true, ... }`.

Database check:

```text
https://YOUR-SERVER-SERVICE.up.railway.app/api/health/db
```

---

## 3. Web service settings

| Setting          | Value                                      |
| ---------------- | ------------------------------------------ |
| **Root Directory** | `web`                                  |
| **Build Command**  | `npm install && npm run build`         |
| **Start Command**  | `npm start`                            |

### Web environment variables

Set these on the **web** service (build **and** runtime — the App Router proxy reads env at request time).

| Variable | Value |
| -------- | ----- |
| `API_PROXY_TARGET` | `https://server-production-e915.up.railway.app` |
| `API_URL` | `https://server-production-e915.up.railway.app` |
| `NEXT_PUBLIC_API_URL` | *(leave empty)* |
| `NEXT_PUBLIC_FORCE_DIRECT_API` | `false` |

How routing works:

- The **browser** calls **`/api/*`** on the web hostname (same origin) — no CORS.
- Next.js **`web/src/app/api/[...path]/route.ts`** proxies to `API_PROXY_TARGET/api/*` at runtime.
- **`web/next.config.ts` rewrites** remain as a fallback for the same paths.
- Do **not** set `NEXT_PUBLIC_API_URL` in production unless you intentionally set `NEXT_PUBLIC_FORCE_DIRECT_API=true` (direct browser → server calls can trigger CORS errors).

`PORT` is set automatically by Railway for `next start`.

---

## 4. Post-deployment test checklist

1. **API health (server)** — `https://server-production-e915.up.railway.app/api/health`
2. **Menu JSON (server)** — `https://server-production-e915.up.railway.app/api/menu`
3. **Menu JSON (web proxy)** — `https://web-production-3bbed.up.railway.app/api/menu`
4. **Homepage** — `https://web-production-3bbed.up.railway.app/`
5. **Menu page** — open `/menu` on phone and desktop; items should load
6. **Menu cart** — add an item to cart
7. **Checkout** — submit pickup or drive-thru order
8. **Staff** — `https://web-production-3bbed.up.railway.app/staff/login`
9. Confirm **new order** appears on dashboard
10. Confirm **sound / visual alert** (allow browser notifications/audio if prompted)
11. Move order: **Pending → Preparing → Ready → Completed**
12. Confirm **no secrets** in page source (no `JWT_SECRET`, no staff passwords in client bundles)

### After pushing code — Railway order

1. **Redeploy server**
2. In **server** shell:

   ```bash
   npx prisma db push && npx prisma generate
   npm run db:seed
   ```

3. **Redeploy web**

---

## 5. Local development (unchanged)

From repo root:

```bash
npm install
npm run dev
```

- Web: http://localhost:3000  
- API: http://localhost:4000  
- API via proxy: http://localhost:3000/api/...

Copy env templates:

```bash
cp server/.env.example server/.env
cp web/.env.example web/.env.local
```

---

## 6. Local build verification

From repo root:

```bash
npm install
npm run build
```

From `server/`:

```bash
npx prisma generate
npm run build
```

From `web/`:

```bash
npm run build
```

Do **not** run `npm run build` while `npm run dev` is running (corrupts `web/.next`).

---

## 7. Security reminders

- Never commit `.env`, `.env.local`, `Buddy-Daves-Logins.txt`, or `DEFAULT_LOGINS.txt`.
- Rotate `JWT_SECRET` if it was ever exposed.
- Set `CORS_ORIGIN` only to your real web origin(s).
- Use strong unique passwords for staff/admin after seeding.

---

## 8. Troubleshooting

| Issue | Fix |
| ----- | --- |
| Web 500 / blank page | Redeploy web; set `API_PROXY_TARGET` and `API_URL` on the web service. |
| **Menu: “Check your connection”** | Browser should call `/api/menu` on the **web** host (not the server URL). Clear `NEXT_PUBLIC_API_URL` or set `NEXT_PUBLIC_FORCE_DIRECT_API=false`. Test `https://web-production-3bbed.up.railway.app/api/menu`. |
| API CORS errors | Usually caused by `NEXT_PUBLIC_API_URL` pointing at the server. Leave it empty; use same-origin `/api/*`. Set server `CORS_ORIGIN` to the web URL only if you force direct API calls. |
| Web `/api/menu` **502** “API proxy not configured” | Set `API_PROXY_TARGET` on the **web** service and redeploy. |
| `JWT_SECRET is required` | Set `JWT_SECRET` on server service. |
| Database connection failed | Verify `DATABASE_URL` on server; run `prisma db push` or `migrate deploy`. |
| Menu empty | Run `db:seed` on server or add items via `/admin` after login. |
| **Menu: connection error** / server `/api/menu` **503** | Database or Prisma issue — check server logs for `[menu] Failed to load menu`. Run `npx prisma db push && npm run db:seed` in server shell. |
| `/api/health` OK but `/api/menu` empty | Run `db:seed`. Seed creates 5 approved items (Philly Cheesesteak, Double Mushroom Melt, Cheese Curds, Gallon Fresh Made Rootbeer, Rootbeer Float). |

---

## 9. Related files

- `server/.env.example` — server env template  
- `web/.env.example` — web env template  
- `Buddy-Daves-URLs.txt` — local URL reference (replace localhost in production)  
- `README.md` — local setup and features  
