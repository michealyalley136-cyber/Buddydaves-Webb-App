# Buddy Dave's — Full-stack ordering platform



Production-style monorepo for **Buddy Dave's** (Sevierville, TN): Next.js storefront + Express/Prisma API + PostgreSQL, JWT auth for staff/admin, and PWA install support.



## Structure



- `web` — Next.js App Router (TypeScript, Tailwind)

- `server` — Express API + Prisma + PostgreSQL



## Logo asset



**Official logo path:** `web/public/images/buddy-daves-logo.png`



| Status | Action |

|--------|--------|

| **Present** | Logo loads in the header and wherever `LogoMark` is used. |
| **Missing** | The app shows a **text fallback** (“Buddy Dave's”). Add the PNG at the path above, then hard-refresh. |



## Prerequisites



- Node 20+

- PostgreSQL database URL



## Setup



1. **Database (server)**



   ```bash

   cd server

   cp .env.example .env

   # edit DATABASE_URL, JWT_SECRET, CORS_ORIGIN

   npm install

   npx prisma db push

   npm run db:seed

   ```



   Seeding writes **`server/DEFAULT_LOGINS.txt`** (gitignored) with local staff/admin credentials.



2. **Web app**



   ```bash

   cd web

   cp .env.example .env.local

   npm install

   ```



3. **Run API + web together (from repo root)**



   ```bash

   npm install

   npm run dev

   ```



   Open **http://localhost:3000** (use the URL printed in the terminal).



   **Clean restart** (if pages look blank or links fail):



   ```bash

   npm run dev:clean

   ```



## Owner demo checklist



### Before the meeting



- [ ] PostgreSQL running; `npm run db:seed` completed in `server/`

- [ ] `npm run dev` from repo root — web on **3000**, API on **4000**

- [ ] Hard-refresh browser (`Ctrl+Shift+R`)

- [ ] Add logo file at `web/public/images/buddy-daves-logo.png` (optional but recommended)

- [ ] Staff logins in `server/DEFAULT_LOGINS.txt` (default password `BuddyDave2026!`)



### Customer demo path (~5 min)



1. **Home** — http://localhost:3000 — brand story, five menu highlights, drive-thru section

2. **Menu** — `/menu` — add Philly Cheesesteak + Cheese Curds (or any items)

3. **Cart** — `/cart` — review quantities → **Proceed to checkout**

4. **Checkout** — `/checkout` — name, phone, pickup vs drive-thru → **Place order**

5. **Confirmation** — `/order/confirmation?code=…` — show pickup code and “what happens next”

6. **Track order** — **Track order** button or `/track-order?code=…` — live status timeline



### Staff demo path (~3 min)



1. **Staff login** — http://localhost:3000/staff/login  

   - Staff: `staff@buddyda.local`  

   - Admin: `admin@buddyda.local`  

   - Password: `BuddyDave2026!` (see `server/DEFAULT_LOGINS.txt` after seed)

2. **Staff dashboard** — `/staff/dashboard` — find the order just placed

3. **Update status** — Pending → Preparing → Ready → Completed

4. **Customer view** — refresh track-order page to show status change



### Admin (optional)



- http://localhost:3000/admin — order summary, menu management (after admin login)



### Approved menu (5 items only)



| Item | Price |

|------|-------|

| Philly Cheesesteak | $7.99 |

| Double Mushroom Melt | $7.69 |

| Cheese Curds | $5.99 |

| Gallon Fresh Made Rootbeer | $7.99 |

| Rootbeer Float | $4.99 *(price pending owner confirmation)* |



No online payments in this build — **pay in store at pickup**.



### Owner questions to confirm



1. **Rootbeer Float price** — Is $4.99 correct?

2. **Menu photos** — Provide final photos for all five items (current images are placeholders).

3. **Business hours** — Final pickup and drive-thru hours for the contact page.

4. **Phone number** — Replace placeholder `(865) 555-0198`.

5. **Logo file** — Supply `buddy-daves-logo.png` for header/branding.

6. **Staff accounts** — Who needs staff vs admin access in production?

7. **Go-live** — Hosting (e.g. Railway), domain, and whether to add online payments later.



## Railway (production)



Deploy as **two services**:



1. **API** — Root directory `server`, build `npm run build`, start `npm run start`, set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.

2. **Web** — Root directory `web`, build `npm run build`, start `npm run start`, set `NEXT_PUBLIC_API_URL` to the public API URL.



Run migrations with `npx prisma migrate deploy` in the server service when you add migrations.



## API (Express)



| Method | Path | Notes |

|--------|------|--------|

| GET | `/api/health` | Liveness |

| GET | `/api/health/db` | DB check |

| POST | `/api/auth/login` | Staff/admin JWT |

| GET | `/api/menu` | Public menu |

| POST | `/api/orders` | Create customer order |

| GET | `/api/orders/:code` | Track order |

| GET | `/api/staff/orders` | `?view=completed` optional |

| PATCH | `/api/staff/orders/:id/status` | Staff/admin |

| GET | `/api/admin/categories` | Admin |

| GET | `/api/admin/menu-items` | Admin |

| POST | `/api/admin/menu-items` | Admin |

| PATCH | `/api/admin/menu-items/:id` | Admin |

| DELETE | `/api/admin/menu-items/:id` | Admin |

| GET | `/api/admin/orders/summary` | Admin |

| GET | `/api/admin/recent-orders` | Admin |



## PWA



- `web/public/manifest.webmanifest`

- `web/public/sw.js` (cleanup / unregister legacy caches)

- Install banner via `beforeinstallprompt` in `InstallPrompt` (customer shell only)



## License



Private project for Buddy Dave's — adjust as needed.


