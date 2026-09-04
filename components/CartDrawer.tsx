"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/lib/useCart";
import { useEscapeKey } from "@/lib/useEscapeKey";
import { formatPKR } from "@/lib/utils";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { items, total, updateQty, remove } = useCart();
  useEscapeKey(onClose, open);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !overlayRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      gsap.set([panelRef.current, overlayRef.current], { display: "block" });
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        panelRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(panelRef.current, {
        xPercent: 100,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          gsap.set([panelRef.current, overlayRef.current], { display: "none" });
        },
      });
    }
  }, [open]);

  const goToCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-[60] hidden bg-navy/40 backdrop-blur-sm"
        style={{ opacity: 0 }}
      />
      <aside
        ref={panelRef}
        className="fixed right-0 top-0 z-[70] hidden h-full w-full max-w-sm flex-col bg-paper shadow-2xl"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h3 className="font-display text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-soft">
              <ShoppingBag className="h-8 w-8" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.color ?? ""}`}
                  className="flex gap-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                    {item.image && (
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    {item.color && (
                      <p className="text-xs text-ink-soft">{item.color}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.qty - 1, item.color)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-line"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.qty + 1, item.color)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-line"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-semibold">
                        {formatPKR(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.productId, item.color)}
                    aria-label="Remove item"
                    className="self-start text-ink-soft hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="font-display text-lg font-semibold">
                {formatPKR(total)}
              </span>
            </div>
            <button
              onClick={goToCheckout}
              className="w-full rounded-full bg-navy py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
