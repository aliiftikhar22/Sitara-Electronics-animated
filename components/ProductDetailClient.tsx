"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, ArrowLeft, CircleCheck } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import ReviewsSection from "@/components/ReviewsSection";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { addToCart } from "@/lib/cart";
import { formatPKR } from "@/lib/utils";
import type { Product } from "@/lib/types";
import Link from "next/link";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const gallery = useMemo(
    () => (product.images && product.images.length ? product.images : [product.image]).filter(Boolean),
    [product.images, product.image]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );

  // Some legacy specs duplicate the structured colors array as raw text
  // ("Colour Option: Off White") — hide that line when swatches already
  // show the same information.
  const displaySpecs = useMemo(() => {
    const specs = product.specs ?? [];
    if (!product.colors || product.colors.length === 0) return specs;
    return specs.filter((s) => !/^colou?r option/i.test(s.trim()));
  }, [product.specs, product.colors]);
  const [added, setAdded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".pd-fade", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: rootRef }
  );

  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: activeColor,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  const selectColor = (colorName: string, imageIndex: number) => {
    setActiveColor(colorName);
    if (Number.isInteger(imageIndex) && gallery[imageIndex]) {
      setActiveImage(imageIndex);
    }
  };

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-6 md:px-10 pt-28 pb-24">
      <Link
        href="/products"
        className="pd-fade inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="pd-fade">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
            {gallery[activeImage] ? (
              <SmartImage
                src={gallery[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-soft">
                No photo yet
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors ${
                    activeImage === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  <SmartImage src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="pd-fade text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-3">
            {product.cat}
          </p>
          <h1 className="pd-fade font-display text-3xl md:text-4xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <div className="pd-fade mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-navy">
              {formatPKR(product.price)}
            </span>
            {product.old && product.old > product.price && (
              <span className="text-base text-ink-soft line-through">
                {formatPKR(product.old)}
              </span>
            )}
            {(product.save ?? 0) > 0 && (
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-deep">
                Save {product.save}%
              </span>
            )}
          </div>

          <p className="pd-fade mt-3 text-sm">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : product.stock != null ? (
              <span className="font-medium text-green-700">
                In stock — {product.stock} available
              </span>
            ) : (
              <span className="font-medium text-green-700">In stock</span>
            )}
          </p>

          {product.description && (
            <p className="pd-fade mt-5 text-ink-soft leading-relaxed">
              {product.description}
            </p>
          )}

          {displaySpecs.length > 0 && (
            <ul className="pd-fade mt-5 flex flex-wrap gap-2">
              {displaySpecs.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-mist px-3 py-1.5 text-xs text-ink-soft"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="pd-fade mt-6">
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => selectColor(c.name, c.imageIndex)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      activeColor === c.name
                        ? "border-accent bg-accent/5"
                        : "border-line"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ background: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-fade mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors hover:border-ink/40 disabled:opacity-40 disabled:pointer-events-none"
            >
              {added ? <CircleCheck className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {added ? "Added" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} />
    </div>
  );
}
