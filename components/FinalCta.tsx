"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SITE } from "@/lib/constants";

export default function FinalCta() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.set(".cta-line", { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(".cta-sub, .cta-actions", { opacity: 0, y: 24 });
      gsap.set(".cta-visual", { opacity: 0, scale: 0.8, rotate: -6 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });

      tl.to(".cta-line", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      })
        .to(".cta-visual", { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: "power4.out" }, "-=0.7")
        .to(".cta-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
        .to(".cta-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-paper to-sky py-28 md:py-40"
    >
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky-mid/40 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 md:px-10 text-center">
        <h2 className="font-display font-semibold tracking-tight leading-[0.95] text-[12vw] sm:text-6xl md:text-7xl">
          <span className="cta-line block overflow-hidden">YOUR NEXT APPLIANCE</span>
          <span className="cta-line block overflow-hidden text-accent">STARTS HERE.</span>
        </h2>

        <div className="cta-visual mt-10 flex justify-center gap-4">
          <Image
            src="/categories/Air conditioner.webp"
            alt=""
            width={140}
            height={140}
            className="w-20 md:w-28 h-auto drop-shadow-xl -rotate-6"
          />
          <Image
            src="/categories/refrigerator.webp"
            alt=""
            width={140}
            height={140}
            className="w-24 md:w-32 h-auto drop-shadow-xl translate-y-4"
          />
          <Image
            src="/categories/oven.webp"
            alt=""
            width={140}
            height={140}
            className="w-20 md:w-28 h-auto drop-shadow-xl rotate-6"
          />
        </div>

        <p className="cta-sub mt-10 text-ink-soft text-base md:text-lg max-w-md mx-auto">
          Genuine wholesale pricing on refrigerators, ACs, washing machines
          and more — from one piece up.
        </p>

        <div className="cta-actions mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-navy px-8 py-4 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5"
          >
            EXPLORE SITARA
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={SITE.whatsapp}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-8 py-4 text-sm font-semibold tracking-wide text-ink transition-colors hover:border-ink/40"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
