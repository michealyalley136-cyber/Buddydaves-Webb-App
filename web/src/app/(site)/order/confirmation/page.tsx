import { Suspense } from "react";
import { ConfirmationBody } from "./confirmation-body";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-sm text-ink/60">Loading…</div>
      }
    >
      <ConfirmationBody />
    </Suspense>
  );
}
