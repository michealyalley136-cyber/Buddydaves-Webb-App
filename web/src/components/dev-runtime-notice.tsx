"use client";

/** Big visible banner in dev — wrong port / stale server causes blank or broken pages. */
export function DevRuntimeNotice() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      className="relative z-[100] border-b-2 border-amber-500 bg-amber-100 px-4 py-3 text-center text-sm text-amber-950 shadow-md"
      role="alert"
    >
      <p className="font-bold">Development mode</p>
      <p className="mt-1">
        Open <strong>http://localhost:3000</strong> from the terminal. If the screen is blank, run{" "}
        <code className="rounded bg-amber-200 px-1">npm run dev:clean</code>, then hard-refresh (
        <kbd className="rounded bg-amber-200 px-1">Ctrl+Shift+R</kbd>).
      </p>
      <p className="mt-2 text-xs text-amber-900/90">
        Do not run <code className="rounded bg-amber-200 px-1">npm run build</code> while{" "}
        <code className="rounded bg-amber-200 px-1">npm run dev</code> is running — it corrupts the cache and
        causes a blank page.
      </p>
    </div>
  );
}
