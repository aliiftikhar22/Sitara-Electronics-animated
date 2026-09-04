"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".testimonial-card", {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-4 text-center">
          ★ Google Reviews
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-center mb-14">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="testimonial-card rounded-2xl border border-line p-6 flex flex-col"
            >
              <div className="flex gap-0.5 text-amber-500 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-ink-soft text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-5 font-medium text-sm">{t.name}</p>
              <p className="text-xs text-ink-soft">Google Review</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
