"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const POINTS = [
  {
    word: "QUALITY",
    copy: "Genuine manufacturer warranty on every unit — no grey-market imports.",
  },
  {
    word: "VALUE",
    copy: "One wholesale price whether you buy a single iron or a container load.",
  },
  {
    word: "TRUST",
    copy: "Sourced directly, sold honestly — no layered distributors, no hidden markups.",
  },
  {
    word: "TECHNOLOGY",
    copy: "The latest from Haier, Dawlance, Gaba National, Canon and Kenwood.",
  },
  {
    word: "SERVICE",
    copy: "Same-week delivery from our Lahore warehouse, single piece or full truckload.",
  },
];

export default function WhySitara() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".why-heading", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      const rows = gsap.utils.toArray<HTMLElement>(".why-row");
      rows.forEach((row) => {
        const word = row.querySelector(".why-word");
        const copy = row.querySelector(".why-copy");
        gsap.set(word, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(copy, { opacity: 0, x: 24 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
        tl.to(word, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
          ease: "power3.out",
        }).to(
          copy,
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.35"
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="why" ref={sectionRef} className="bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <p className="why-heading text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-4">
          Why Sitara
        </p>
        <h2 className="why-heading font-display text-4xl md:text-5xl font-semibold tracking-tight mb-16 max-w-2xl">
          Wholesale, without the wholesale headache.
        </h2>

        <div className="divide-y divide-line">
          {POINTS.map((p) => (
            <div
              key={p.word}
              className="why-row grid md:grid-cols-2 items-center gap-2 md:gap-10 py-8 md:py-10"
            >
              <h3 className="why-word overflow-hidden font-display text-4xl md:text-6xl font-semibold tracking-tight text-navy">
                {p.word}
              </h3>
              <p className="why-copy text-ink-soft text-base md:text-lg max-w-md">
                {p.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
