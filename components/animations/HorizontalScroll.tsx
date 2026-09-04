"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const WORDS = ["SITARA", "WHOLESALE", "QUALITY", "TRUST", "ELECTRONICS", "GENUINE"];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !trackRef.current) return;
      const track = trackRef.current;
      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
          pin: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const text = WORDS.join("  •  ") + "  •  ";

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-navy py-10 md:py-14"
    >
      <div
        ref={trackRef}
        className="whitespace-nowrap font-display font-semibold text-white/90 leading-none"
        style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
      >
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </section>
  );
}
