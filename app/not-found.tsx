import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 pt-32 pb-24 text-center">
      <SearchX className="mx-auto h-10 w-10 text-accent-deep" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
