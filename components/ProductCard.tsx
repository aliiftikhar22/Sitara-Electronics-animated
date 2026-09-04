"use client";

import Link from "next/link";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { formatPKR } from "@/lib/utils";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(10,23,48,0.25)]">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-mist"
      >
        {product.image ? (
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft text-sm">
            No photo yet
          </div>
        )}
        {(product.save ?? 0) > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-deep px-2.5 py-1 text-[11px] font-semibold text-white">
            -{product.save}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-navy/60 text-xs font-semibold uppercase tracking-wide text-white">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-accent-deep">
          {product.cat}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 font-display text-sm md:text-base font-semibold leading-snug text-ink line-clamp-2 transition-colors group-hover:text-accent-deep">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-navy">
            {formatPKR(product.price)}
          </span>
          {product.old && product.old > product.price && (
            <span className="text-xs text-ink-soft line-through">
              {formatPKR(product.old)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-ink/40"
          >
            VIEW
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
              })
            }
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center justify-center rounded-full bg-navy p-2.5 text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
