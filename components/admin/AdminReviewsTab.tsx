"use client";

import { Check, Trash2, Star } from "lucide-react";
import { deleteReview, setReviewApproved } from "@/lib/firestore";
import type { Review } from "@/lib/types";

export default function AdminReviewsTab({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Reviews ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="text-ink-soft">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{r.userName}</span>
                  <span className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                  {!r.approved && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!r.approved && (
                    <button
                      onClick={() => setReviewApproved(r.id, true)}
                      aria-label="Approve"
                      className="rounded-lg border border-line p-1.5 text-green-700 hover:border-green-300"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    aria-label="Delete"
                    className="rounded-lg border border-line p-1.5 text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink-soft">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
