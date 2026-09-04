"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getApprovedReviews, submitReview } from "@/lib/firestore";
import type { Review } from "@/lib/types";

function timestampToDate(value: unknown): Date | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate(): Date }).toDate();
  }
  return null;
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApprovedReviews(productId)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) {
      setError("Please write a short comment.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitReview({
        productId,
        userId: user.uid,
        userName: profile?.name || user.email || "Customer",
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setComment("");
    } catch {
      setError("Couldn't submit your review right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="font-display text-2xl font-semibold mb-6">Customer Reviews</h2>

      {reviews === null && (
        <div className="animate-pulse h-16 rounded-xl bg-mist" />
      )}

      {reviews && reviews.length === 0 && (
        <p className="text-ink-soft mb-8 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          No reviews yet — be the first to share your experience.
        </p>
      )}

      {reviews && reviews.length > 0 && (
        <ul className="mb-10 space-y-5">
          {reviews.map((r) => {
            const date = timestampToDate(r.createdAt);
            return (
              <li key={r.id} className="border-b border-line/60 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.userName}</span>
                  <span className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                  {date && (
                    <span className="text-xs text-ink-soft">
                      {date.toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-soft">{r.comment}</p>
              </li>
            );
          })}
        </ul>
      )}

      {!user && (
        <p className="text-sm text-ink-soft">
          <Link href="/login" className="text-accent-deep font-medium">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {user && submitted && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Thanks! Your review is pending approval and will appear once approved.
        </p>
      )}

      {user && !submitted && (
        <form onSubmit={handleSubmit} className="max-w-md space-y-3">
          <div>
            <p className="text-sm font-medium mb-1.5">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="text-amber-500"
                >
                  <Star className={`h-5 w-5 ${n <= rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product…"
            rows={3}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </section>
  );
}
