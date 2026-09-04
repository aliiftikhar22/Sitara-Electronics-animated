"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Refrigerator,
  Wind,
  RobotVacuum,
  Fan,
  Microwave,
  Zap,
  Blender,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Refrigerator,
  Wind,
  WashingMachine: RobotVacuum,
  Fan,
  Microwave,
  Zap,
  Blend: Blender,
};

export default function CategorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".cat-card", {
        opacity: 0,
        y: 48,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-4">
            Shop by Category
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            One wholesale rate, every category.
          </h2>
          <p className="mt-4 text-ink-soft text-base md:text-lg">
            Every category ships at the same wholesale price whether
            you&apos;re furnishing one kitchen or fifty.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon];
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="cat-card group relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-sky transition-colors duration-500 group-hover:bg-sky-mid">
                    <Icon
                      className="h-14 w-14 md:h-16 md:w-16 text-accent-deep transition-transform duration-500 group-hover:scale-110"
                      strokeWidth={1.25}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-navy/0 opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-base md:text-lg leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] md:text-xs text-white/70 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
