"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-6 pt-32 pb-24 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-accent-deep" />
      <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 text-ink-soft">
        We couldn&apos;t load this page right now — it might just be a
        connection hiccup. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
