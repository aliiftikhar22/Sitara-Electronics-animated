"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { value: "10+", label: "Product Categories" },
  { value: "1 pc", label: "Minimum Order" },
  { value: "1,500+", label: "Units Supplied" },
  { value: "0", label: "Hidden Charges" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (reduced) {
        gsap.set([".hero-eyebrow", line1Ref.current, line2Ref.current, ".hero-sub", ".hero-actions", ".hero-stats", productRef.current], {
          opacity: 1,
          clipPath: "none",
          filter: "none",
          y: 0,
          scale: 1,
        });
      } else {
        gsap.set(".hero-eyebrow", { opacity: 0, y: 16 });
        gsap.set([line1Ref.current, line2Ref.current], {
          clipPath: "inset(0% 0% 100% 0%)",
          filter: "blur(14px)",
          y: 40,
        });
        gsap.set(".hero-sub", { opacity: 0, y: 24 });
        gsap.set(".hero-actions", { opacity: 0, y: 24 });
        gsap.set(".hero-stats > div", { opacity: 0, y: 16 });
        gsap.set(productRef.current, { opacity: 0, scale: 0.85, rotate: -6 });

        tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.7 })
          .to(
            line1Ref.current,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "blur(0px)",
              y: 0,
              duration: 1.1,
              letterSpacing: "0.02em",
            },
            "-=0.35"
          )
          .to(
            line2Ref.current,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "blur(0px)",
              y: 0,
              duration: 1.1,
              letterSpacing: "0.02em",
            },
            "-=0.85"
          )
          .to(
            productRef.current,
            { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: "power4.out" },
            "-=1"
          )
          .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, "-=0.7")
          .to(".hero-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
          .to(".hero-stats > div", { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.4");

        // continuous float + rotation on the hero product
        gsap.to(productRef.current, {
          y: "+=18",
          rotate: 2.5,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.6,
        });

        // scroll-tied scale/fade as the hero exits
        gsap.to(productRef.current, {
          scale: 1.15,
          y: "-=60",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".hero-copy", {
          opacity: 0,
          y: -40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "60% top",
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const handleMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 24;
        const y = (e.clientY / innerHeight - 0.5) * 16;
        gsap.to(productRef.current, { x, y: y - 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      };
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-b from-sky via-mist to-paper pt-24"
    >
      <div className="pointer-events-none absolute -top-40 -right-40 h-[38rem] w-[38rem] rounded-full bg-sky-mid/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-7xl w-full px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div className="hero-copy">
          <p className="hero-eyebrow text-xs md:text-sm font-medium tracking-[0.3em] text-accent-deep uppercase mb-5">
            Lahore&apos;s Wholesale Appliance House
          </p>
          <h1 className="font-display font-semibold leading-[0.95] tracking-tight text-[15vw] sm:text-[9vw] md:text-[5.2vw]">
            <span ref={line1Ref} className="block overflow-hidden">
              SITARA
            </span>
            <span ref={line2Ref} className="block overflow-hidden text-accent">
              ELECTRONICS
            </span>
          </h1>
          <p className="hero-sub mt-6 max-w-md text-ink-soft text-base md:text-lg leading-relaxed">
            Refrigerators, ACs, washing machines, fans, ovens and more —
            genuine wholesale pricing whether you&apos;re furnishing one
            kitchen or fifty.
          </p>
          <div className="hero-actions mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              EXPLORE PRODUCTS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:border-ink/40"
            >
              SHOP NOW
            </Link>
          </div>
          <div className="hero-stats mt-12 grid grid-cols-4 gap-4 max-w-lg">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl md:text-2xl font-semibold text-navy">
                  {s.value}
                </div>
                <div className="text-[11px] md:text-xs text-ink-soft mt-1 leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div ref={productRef} className="relative w-[80%] max-w-sm md:max-w-md">
            <div className="absolute inset-0 rounded-full bg-white/60 blur-2xl scale-90" />
            <Image
              src="/categories/Air conditioner.webp"
              alt="Sitara Electronics split inverter AC"
              width={640}
              height={640}
              priority
              className="relative drop-shadow-[0_35px_60px_rgba(10,23,48,0.25)] w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
