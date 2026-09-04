export default function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="aspect-square animate-pulse bg-mist" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-mist" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-mist" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-mist" />
        <div className="h-9 w-full animate-pulse rounded-full bg-mist" />
      </div>
    </div>
  );
}
