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
        Open the URL from your terminal (e.g. <strong>http://localhost:3000</strong>). If the page is
        blank, stop all Node processes, run <code className="rounded bg-amber-200 px-1">npm run dev</code>,
        then hard-refresh (<kbd className="rounded bg-amber-200 px-1">Ctrl+Shift+R</kbd>).
      </p>
    </div>
  );
}
