export default function RouteLoading({ label = 'page' }) {
  return (
    <div className="page-container" role="status" aria-live="polite">
      <div className="page-content py-10">
        <div className="h-8 w-56 animate-pulse rounded bg-[#2e3d29]/60" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-[#2e3d29]/40" />
        <p className="sr-only">Loading {label}…</p>
      </div>
    </div>
  );
}
