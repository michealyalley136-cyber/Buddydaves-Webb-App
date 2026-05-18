import { Suspense } from "react";
import { TrackOrderBody } from "./track-order-body";

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-ink/60">Loading…</div>
      }
    >
      <TrackOrderBody />
    </Suspense>
  );
}
