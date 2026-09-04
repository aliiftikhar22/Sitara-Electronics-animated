"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PackageX } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getProducts } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import type { Product } from "@/lib/types";

export default function ProductsClient({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialCategory ?? "all");

  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load products right now. Please try again shortly.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = activeCategory ? p.cat === activeCategory.cat : true;
      const matchesSearch = search
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.cat.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !gridRef.current) return;
      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
      });
    },
    { dependencies: [filtered.length, products], scope: gridRef }
  );

  const setCategory = (slug: string) => {
    setActiveSlug(slug);
    router.replace(slug === "all" ? "/products" : `/products?category=${slug}`, {
      scroll: false,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-3">
            Shop The Wholesale Catalog
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Browse Products
          </h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fans, ACs, ovens..."
            className="w-full rounded-full border border-line bg-paper py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSlug === "all"
              ? "bg-navy text-white"
              : "bg-mist text-ink-soft hover:text-ink"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeSlug === c.slug
                ? "bg-navy text-white"
                : "bg-mist text-ink-soft hover:text-ink"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 mb-8">{error}</p>
      )}

      {!products && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {products && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line py-24 text-center text-ink-soft">
          <PackageX className="h-8 w-8" />
          <p>No products match that search yet.</p>
        </div>
      )}

      {products && filtered.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
