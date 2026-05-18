export function MenuGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] shadow-sm"
        >
          <div className="aspect-[16/11] animate-pulse bg-black/10" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-full animate-pulse rounded bg-black/10" />
            <div className="h-10 w-full animate-pulse rounded-full bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}
