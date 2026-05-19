import Link from "next/link";
import { SystemFlowchart } from "./system-flowchart";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-[var(--line-subtle)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
      <h2 className="font-display text-2xl font-normal text-[var(--brand-brown)] md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-ink/80">{children}</div>
    </section>
  );
}

function Callout({ variant = "gold", children }: { variant?: "gold" | "warn"; children: React.ReactNode }) {
  return (
    <div
      className={
        variant === "warn"
          ? "rounded-r-lg border-l-4 border-[var(--accent-red)] bg-[#fff0ed] px-4 py-3 text-sm leading-relaxed"
          : "rounded-r-lg border-l-4 border-[var(--brand-gold)] bg-[#fff8e8] px-4 py-3 text-sm leading-relaxed"
      }
    >
      {children}
    </div>
  );
}

function GuideTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line-subtle)]">
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="bg-[var(--brand-teal)] px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-white"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-[#f9f7f4]" : "bg-white"}>
              {row.map((cell, j) => (
                <td key={j} className="border-t border-[var(--line-subtle)] px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gold)] text-sm font-extrabold text-[var(--brand-brown)]">
            {i + 1}
          </span>
          <p className="pt-0.5 text-sm leading-relaxed md:text-base">
            <strong className="text-ink">{item.title}</strong> — {item.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

const TOC = [
  { id: "why", label: "Why this system" },
  { id: "flow", label: "How it works" },
  { id: "customer", label: "Customer experience" },
  { id: "kitchen", label: "Kitchen dashboard" },
  { id: "admin", label: "Admin & go-live" },
] as const;

export function OwnerTrainingGuide() {
  return (
    <article className="pb-20">
      <header className="layout-page !pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Buddy Dave&apos;s · Owner only</p>
        <h1 className="mt-2 max-w-3xl font-display text-5xl text-[var(--brand-brown)] md:text-6xl">
          Digital ordering training guide
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
          How customers order online, how your kitchen sees tickets instantly, and what to confirm before
          go-live. This guide lives inside the Buddy Dave&apos;s app — it is not downloadable.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal">
          <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
          In-app reference · Sevierville, TN
        </div>
      </header>

      <nav
        aria-label="Guide sections"
        className="layout-page !py-0 mb-8 flex flex-wrap gap-2"
      >
        {TOC.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full border border-[var(--line-subtle)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-brown)] shadow-sm transition hover:border-teal hover:text-teal"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="layout-page !pt-0 space-y-8">
        <Section id="why" title="Why Buddy Dave's needs this">
          <p className="text-lg font-medium text-[var(--brand-brown)]">
            This system turns a phone call or counter conversation into a clear digital ticket your kitchen
            can see, hear, and track — without adding complicated payment processing yet.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Faster kitchen response",
                body: "New orders flash on screen, play a loud alert, and repeat until someone taps Acknowledge.",
              },
              {
                title: "Fewer mistakes",
                body: "Every order has a unique code, customer name, items, and pickup vs drive-thru clearly shown.",
              },
              {
                title: "Professional customer experience",
                body: "Guests browse your real menu, place an order, and track status on their phone.",
              },
              {
                title: "Room to grow",
                body: "Same platform can add photos, hours, online pay, and more menu items when you are ready.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-cream)] p-4"
              >
                <p className="text-sm font-bold text-teal">{card.title}</p>
                <p className="mt-1 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
          <Callout>
            <strong>What makes this demo special:</strong> It is built around your approved five-item menu,
            your branding, and a kitchen-first alert system tested for tablets and loud environments — not a
            generic template.
          </Callout>
          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Three parts of the system</h3>
          <GuideTable
            headers={["Part", "Who uses it", "What it does"]}
            rows={[
              ["Customer website", "Guests on phone or computer", "Menu, cart, checkout, confirmation, track order"],
              [
                "Staff / kitchen dashboard",
                "Line cooks, counter staff",
                "Live queue, loud alerts, status updates (Pending → Preparing → Ready → Done)",
              ],
              ["Admin panel (optional)", "Owner / manager", "Order counts, menu edits, categories"],
            ]}
          />
        </Section>

        <Section id="flow" title="How the whole system works">
          <p>Follow the arrows from customer order to kitchen completion.</p>
          <SystemFlowchart />
          <Callout variant="warn">
            <strong>Important:</strong> The kitchen dashboard refreshes every few seconds. Alerts fire when a{" "}
            <em>new</em> pending order appears. Staff must acknowledge to stop the repeating sound.
          </Callout>
        </Section>

        <Section id="customer" title="Customer experience — step by step">
          <p className="font-medium text-[var(--brand-brown)]">
            What your guests see (about 5 minutes start to finish).
          </p>
          <StepList
            items={[
              {
                title: "Homepage",
                body: "Brand story, highlights of your five signature items, drive-thru message, link to menu.",
              },
              { title: "Menu", body: "Only approved items with prices. Guests tap to add items to cart." },
              { title: "Cart", body: "Review quantities, adjust, proceed to checkout." },
              {
                title: "Checkout",
                body: "Name, phone, pickup or drive-thru, optional pickup time. No credit card — they pay when they arrive.",
              },
              {
                title: "Confirmation",
                body: 'Large pickup code (example: BD-20260516-1234). Clear "what happens next."',
              },
              {
                title: "Track order",
                body: "Guest can refresh to see: Pending → Preparing → Ready → Completed (updates when kitchen changes status).",
              },
            ]}
          />
          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Approved menu (demo)</h3>
          <GuideTable
            headers={["Item", "Price", "Notes"]}
            rows={[
              ["Philly Cheesesteak", "$7.99", "—"],
              ["Double Mushroom Melt", "$7.69", "—"],
              ["Cheese Curds", "$5.99", "—"],
              ["Gallon Fresh Made Rootbeer", "$7.99", "—"],
              ["Rootbeer Float", "$4.99", "Confirm final price with owner"],
            ]}
          />
        </Section>

        <Section id="kitchen" title="Kitchen & staff dashboard">
          <StepList
            items={[
              {
                title: "Sign in",
                body: "At Staff Login (staff and admin accounts). Keep this page open on the kitchen tablet during service.",
              },
              { title: "Active queue", body: "All open orders listed; newest on top in Kitchen Mode." },
              {
                title: "New order alert",
                body: 'Loud sound, red/gold banner, optional fullscreen popup, tab flashes "NEW ORDER." Repeats until acknowledged.',
              },
              {
                title: "Acknowledge",
                body: "Tap on the banner or card so the kitchen confirms someone saw the ticket.",
              },
              {
                title: "Update status",
                body: "Start Preparing → Mark Ready → Mark Completed. Customer tracking page updates automatically.",
              },
              {
                title: "Settings",
                body: "Choose sound vs pop-up vs visual-only; turn on Kitchen Mode; test alerts; mute for 5 minutes during rush if needed.",
              },
            ]}
          />
          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Kitchen Mode (line tablet)</h3>
          <ul className="list-inside list-disc space-y-1 text-sm md:text-base">
            <li>Extra-large order codes and buttons (glove-friendly)</li>
            <li>Sticky alert banner at top of screen</li>
            <li>Fullscreen alert until acknowledged</li>
            <li>
              Toggle ON/OFF in the header: <strong>Kitchen mode ON</strong>
            </li>
          </ul>
          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Alert options (per device)</h3>
          <GuideTable
            headers={["Mode", "Best for"]}
            rows={[
              ["Sound + pop-up", "PC with speakers at counter"],
              ["Sound only", "Kitchen tablet with Bluetooth speaker"],
              ["Pop-up only", "Computer without speakers"],
              ["On-screen only", "Silent environments; relies on flashing screen"],
            ]}
          />
          <Callout>
            <strong>Demo tip:</strong> Use the <strong>Demo incoming order</strong> button on the dashboard to
            practice alerts without placing a real customer order.
          </Callout>
        </Section>

        <Section id="admin" title="Admin, go-live & demo">
          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Admin panel (owner / manager)</h3>
          <p>Sign in with an <strong>admin</strong> account to access:</p>
          <ul className="list-inside list-disc space-y-1 text-sm md:text-base">
            <li>
              <strong>Dashboard</strong> — How many orders are pending, preparing, ready, and today&apos;s count
            </li>
            <li>
              <strong>Menu</strong> — Add, edit, hide, or remove items (when you expand beyond the demo menu)
            </li>
            <li>
              <strong>Categories</strong> — Organize menu sections
            </li>
            <li>
              <strong>Orders</strong> — Full order list for the day
            </li>
          </ul>
          <p className="text-sm">Reports and advanced settings are planned for a later phase.</p>

          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Owner decisions before go-live</h3>
          <p>Check off as you confirm with your team:</p>
          <ul className="space-y-2 text-sm md:text-base">
            {[
              "Rootbeer Float final price",
              "Professional photos for all five menu items",
              "Final business hours on Contact page",
              "Real business phone number",
              "Final logo file in the header",
              "Who gets staff login vs admin login",
              "Kitchen tablet placement + speaker",
              "Hosting and domain when ready for public launch",
              "Whether to add online payments later (Stripe, etc.)",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-bold text-teal" aria-hidden>
                  ☐
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Recommended kitchen setup</h3>
          <div className="grid gap-6 sm:grid-cols-2 text-sm md:text-base">
            <ul className="list-inside list-disc space-y-1">
              <li>10–12″ tablet or touchscreen laptop</li>
              <li>Landscape orientation, always plugged in</li>
              <li>Powered speaker (not built-in tablet speaker alone)</li>
              <li>Chrome or Edge, tab stays open &amp; unmuted</li>
            </ul>
            <ul className="list-inside list-disc space-y-1">
              <li>Stable Wi‑Fi</li>
              <li>Kitchen Mode ON</li>
              <li>Sound enabled once per shift</li>
              <li>Test alert at start of day</li>
            </ul>
          </div>

          <h3 className="font-display text-2xl text-[var(--brand-brown)]">Live demo script (10 minutes)</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm md:text-base">
            <li>Show homepage and menu on your phone.</li>
            <li>Place a test order (pickup, one item).</li>
            <li>Switch to kitchen tablet — show alert, acknowledge, start preparing.</li>
            <li>Refresh track-order on phone — show status change.</li>
            <li>Mark ready, then completed.</li>
            <li>Briefly show Settings → Kitchen Mode and Test Kitchen Alert.</li>
          </ol>

          <p className="border-t border-[var(--line-subtle)] pt-6 text-center text-xs text-ink/55">
            Buddy Dave&apos;s · Sevierville, TN · Digital ordering platform · For owner training and internal use
          </p>
        </Section>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link href="/staff/login" className="btn-diner-teal min-h-11 px-6">
            Staff login
          </Link>
          <Link href="/menu" className="btn-gold min-h-11 px-6">
            View customer menu
          </Link>
        </div>
      </div>
    </article>
  );
}
