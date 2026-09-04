"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { OrderStatus } from "@/lib/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeIndex = STEPS.findIndex((s) => s.key === status);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".timeline-step", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: rootRef, dependencies: [status] }
  );

  if (status === "cancelled") {
    return (
      <div className="rounded-xl bg-red-50 px-5 py-4 text-red-700">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= activeIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className="timeline-step flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                  done
                    ? "border-accent-deep bg-accent-deep text-white"
                    : "border-line bg-paper text-ink-soft"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] md:text-xs text-center w-20 ${
                  done ? "text-ink font-medium" : "text-ink-soft"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1 md:mx-2 h-0.5 flex-1 transition-colors ${
                  i < activeIndex ? "bg-accent" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
