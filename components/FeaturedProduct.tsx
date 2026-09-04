"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { formatPKR } from "@/lib/utils";
import type { Product } from "@/lib/types";

const WORDS = ["GENUINE.", "RELIABLE.", "AFFORDABLE."];

export default function FeaturedProduct({ product }: { product: Product | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(wordsRef.current?.children ?? [], { opacity: 0, display: "none" });
        gsap.set(wordsRef.current?.children[2] ?? null, { opacity: 1, display: "block" });
        gsap.set(detailsRef.current, { opacity: 1, y: 0 });
        return;
      }

      const words = gsap.utils.toArray<HTMLElement>(".featured-word");
      gsap.set(words, { opacity: 0, y: 20 });
      gsap.set(words[0], { opacity: 1, y: 0 });
      gsap.set(detailsRef.current, { opacity: 0, y: 24 });
      gsap.set(imageRef.current, { scale: 0.85, rotate: -8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: pinRef.current,
        },
      });

      tl.to(imageRef.current, { scale: 1.05, rotate: -2, duration: 1, ease: "none" })
        .to(words[0], { opacity: 0, y: -20, duration: 0.4 }, 0.35)
        .to(words[1], { opacity: 1, y: 0, duration: 0.4 }, 0.4)
        .to(imageRef.current, { scale: 1.15, rotate: 3, duration: 1, ease: "none" }, 0.6)
        .to(words[1], { opacity: 0, y: -20, duration: 0.4 }, 0.75)
        .to(words[2], { opacity: 1, y: 0, duration: 0.4 }, 0.8)
        .to(detailsRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.85)
        .to(imageRef.current, { scale: 1.25, rotate: 0, duration: 1, ease: "none" }, 0.85);
    },
    { scope: sectionRef, dependencies: [product?.id] }
  );

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative bg-navy text-white"
    >
      <div ref={pinRef} className="min-h-[100svh] flex items-center overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] text-sky-mid uppercase mb-6">
              Featured
            </p>
            <div ref={wordsRef} className="relative h-24 md:h-32">
              {WORDS.map((w) => (
                <h2
                  key={w}
                  className="featured-word absolute inset-0 font-display text-5xl md:text-7xl font-semibold tracking-tight"
                >
                  {w}
                </h2>
              ))}
            </div>
            <div ref={detailsRef} className="mt-8">
              {product ? (
                <>
                  <h3 className="font-display text-2xl font-semibold">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-white/60 max-w-sm">
                    From our real wholesale catalog — full manufacturer
                    warranty, same-week delivery from our Lahore warehouse.
                  </p>
                  <div className="mt-4 flex items-baseline gap-3">
                    {product.old && product.old > product.price && (
                      <span className="text-white/60 line-through text-sm">
                        {formatPKR(product.old)}
                      </span>
                    )}
                    <span className="font-display text-2xl text-sky-mid font-semibold">
                      {formatPKR(product.price)}
                    </span>
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-navy transition-transform hover:-translate-y-0.5"
                  >
                    VIEW PRODUCT
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-semibold">
                    New stock arriving soon
                  </h3>
                  <p className="mt-2 text-white/60 max-w-sm">
                    Browse the full wholesale catalog while we update
                    today&apos;s featured pick.
                  </p>
                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-navy transition-transform hover:-translate-y-0.5"
                  >
                    VIEW PRODUCTS
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div ref={imageRef} className="relative w-[75%] max-w-sm">
              <div className="absolute inset-0 rounded-full bg-sky-mid/20 blur-3xl scale-90" />
              {product?.image ? (
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  width={520}
                  height={640}
                  className="relative w-full h-auto drop-shadow-[0_35px_70px_rgba(0,0,0,0.45)]"
                />
              ) : (
                <SmartImage
                  src="/categories/refrigerator.webp"
                  alt="Sitara Electronics appliances"
                  width={520}
                  height={640}
                  className="relative w-full h-auto drop-shadow-[0_35px_70px_rgba(0,0,0,0.45)]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
