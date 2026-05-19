# Buddy Dave's — Railway deployment guide

Deploy the GitHub repo **`michealyalley136-cyber/Buddydaves-Webb-App`** as **two Railway services** (web + API) plus **PostgreSQL**.

Monorepo layout:

| Path     | Stack                          |
| -------- | ------------------------------ |
| `web/`   | Next.js 15 storefront + PWA    |
| `server/`| Express + Prisma + PostgreSQL  |

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
| `CORS_ORIGIN`  | Your **web** service public URL, e.g. `https://your-web-service.up.railway.app` (no trailing slash). Comma-separate multiple origins if needed. |
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

Set these **before the build** (Railway injects env at build time for Next.js rewrites).

| Variable               | Value |
| ---------------------- | ----- |
| `API_PROXY_TARGET`     | `https://YOUR-SERVER-SERVICE.up.railway.app` (no trailing slash) |
| `NEXT_PUBLIC_API_URL`  | Same as `API_PROXY_TARGET` (used if any client code calls the API directly) |

How routing works:

- Browser calls **`/api/*`** on the web hostname (same origin).
- Next.js **rewrites** proxy to `API_PROXY_TARGET/api/*` (see `web/next.config.ts`).
- `NEXT_PUBLIC_API_URL` is optional when using the proxy; set it to the server URL for consistency.

`PORT` is set automatically by Railway for `next start`.

---

## 4. Post-deployment test checklist

1. **API health** — `https://YOUR-SERVER.up.railway.app/api/health`
2. **Homepage** — `https://YOUR-WEB.up.railway.app/`
3. **Menu** — add an item to cart
4. **Checkout** — submit pickup or drive-thru order
5. **Staff** — `https://YOUR-WEB.up.railway.app/staff/login`
6. Confirm **new order** appears on dashboard
7. Confirm **sound / visual alert** (allow browser notifications/audio if prompted)
8. Move order: **Pending → Preparing → Ready → Completed**
9. Confirm **no secrets** in page source (no `JWT_SECRET`, no staff passwords in client bundles)

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
| Web 500 / blank page | Redeploy web; ensure `API_PROXY_TARGET` was set **before** build. |
| API CORS errors | Set `CORS_ORIGIN` to exact web URL (https, no trailing slash). |
| `JWT_SECRET is required` | Set `JWT_SECRET` on server service. |
| Database connection failed | Verify `DATABASE_URL` on server; run `prisma db push` or `migrate deploy`. |
| Menu empty | Run `db:seed` or add items via `/admin` after login. |

---

## 9. Related files

- `server/.env.example` — server env template  
- `web/.env.example` — web env template  
- `Buddy-Daves-URLs.txt` — local URL reference (replace localhost in production)  
- `README.md` — local setup and features  
