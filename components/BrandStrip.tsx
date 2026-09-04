"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRANDS } from "@/lib/constants";

export default function BrandStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion() || !trackRef.current) return;
    const track = trackRef.current;
    const width = track.scrollWidth / 2;
    gsap.to(track, {
      x: -width,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
  }, { scope: trackRef });

  const items = [...BRANDS, ...BRANDS];

  return (
    <section className="bg-paper border-y border-line py-10 overflow-hidden">
      <p className="text-center text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-6">
        Trusted Brands
      </p>
      <div ref={trackRef} className="flex items-center gap-16 w-max px-8">
        {items.map((b, i) => (
          <Image
            key={`${b.name}-${i}`}
            src={b.image}
            alt={b.name}
            width={110}
            height={44}
            className="h-9 w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
          />
        ))}
      </div>
    </section>
  );
}
