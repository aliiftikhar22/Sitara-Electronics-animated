"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/lib/useCart";
import { useAuth } from "@/components/AuthProvider";
import { formatPKR } from "@/lib/utils";
import { createOrder, generateOrderId, getProductById } from "@/lib/firestore";
import type { Order } from "@/lib/types";

const RECENT_ORDERS_KEY = "sitara-recent-orders";

function rememberOrder(id: string) {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(RECENT_ORDERS_KEY) ?? "[]");
    const next = [id, ...ids.filter((x) => x !== id)].slice(0, 10);
    localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(next));
  } catch {
    // non-critical
  }
}

export default function CheckoutClient() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const availability = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          if (product && product.stock != null && product.stock < item.qty) {
            return { ok: false, name: product.name, stock: product.stock };
          }
          return { ok: true };
        })
      );
      const unavailable = availability.find((a) => !a.ok);
      if (unavailable && !unavailable.ok) {
        setError(
          `${unavailable.name} only has ${unavailable.stock} left in stock. Please adjust your cart.`
        );
        setSubmitting(false);
        return;
      }

      // Firestore rejects `undefined` field values, so optional fields
      // (color, notes) are only included when actually present.
      const order: Order = {
        id: generateOrderId(),
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          ...(i.color ? { color: i.color } : {}),
        })),
        total,
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
          ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        },
        status: "confirmed",
        createdAt: Date.now(),
        ...(user ? { uid: user.uid } : {}),
      };

      await createOrder(order);
      rememberOrder(order.id);
      clear();
      setConfirmedOrder(order);
    } catch (err) {
      console.error("checkout error", err);
      setError("Couldn't place your order right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-32 pb-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          Order confirmed
        </h1>
        <p className="mt-3 text-ink-soft">
          Thanks, {confirmedOrder.customer.name.split(" ")[0]} — save this ID
          to track your order anytime.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-accent bg-accent/5 py-4 font-mono text-xl tracking-wide text-accent-deep">
          {confirmedOrder.id}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Total: <b className="text-ink">{formatPKR(confirmedOrder.total)}</b>{" "}
          · Cash on Delivery · {confirmedOrder.customer.city}
        </p>
        <Link
          href={`/track-order?id=${confirmedOrder.id}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5"
        >
          Track This Order
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-32 pb-24 text-center text-ink-soft">
        <ShoppingBag className="mx-auto h-10 w-10" />
        <p className="mt-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold tracking-wide text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 md:px-10 pt-32 pb-24">
      <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-3">
        Checkout
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-10">
        Complete your order
      </h1>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              value={form.name}
              onChange={update("name")}
              required
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={update("phone")}
              required
              type="tel"
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="city">
              City *
            </label>
            <input
              id="city"
              value={form.city}
              onChange={update("city")}
              required
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              value={form.address}
              onChange={update("address")}
              required
              rows={3}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={update("notes")}
              rows={2}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="rounded-xl bg-mist px-4 py-3 text-sm text-ink-soft">
            Payment method: <b className="text-ink">Cash on Delivery</b>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-4 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place Order"}
          </button>
        </form>

        <div className="rounded-2xl border border-line p-6 h-fit">
          <h2 className="font-display font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.color ?? ""}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mist">
                  {item.image && (
                    <SmartImage src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-ink-soft">Qty {item.qty}</p>
                </div>
                <span className="text-sm font-medium">
                  {formatPKR(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-dashed border-line pt-4 font-display font-semibold">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
