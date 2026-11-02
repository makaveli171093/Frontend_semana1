export function SkeletonMetricCard() {
  return (
    <article
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-9 w-9 rounded-full bg-slate-200" />
      </div>

      <div className="mt-5 h-10 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-40 rounded bg-slate-100" />
    </article>
  );
}
