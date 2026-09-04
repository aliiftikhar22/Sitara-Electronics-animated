"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import { subscribeToOrder } from "@/lib/firestore";
import { formatPKR } from "@/lib/utils";
import type { Order } from "@/lib/types";

const RECENT_ORDERS_KEY = "sitara-recent-orders";

export default function TrackOrderClient({ initialId }: { initialId?: string }) {
  const [input, setInput] = useState(initialId ?? "");
  const [activeId, setActiveId] = useState<string | null>(initialId ?? null);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, which is unavailable during SSR
      setRecent(JSON.parse(localStorage.getItem(RECENT_ORDERS_KEY) ?? "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const unsubscribe = subscribeToOrder(
      activeId,
      (result) => {
        setOrder(result);
        if (!result) setError("No order found with that ID. Check it and try again.");
      },
      () => setError("Couldn't reach the tracking service right now. Please try again shortly.")
    );
    return unsubscribe;
  }, [activeId]);

  const handleTrack = (id?: string) => {
    const value = (id ?? input).trim().toUpperCase();
    if (!value) {
      setError("Enter an Order ID to track.");
      return;
    }
    setError(null);
    setOrder(undefined);
    setInput(value);
    setActiveId(value);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 pt-32 pb-24">
      <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-3 text-center">
        Order Tracking
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-center mb-3">
        Where&apos;s your order?
      </h1>
      <p className="text-ink-soft text-center mb-10">
        Enter the Order ID you received at checkout to see its current status.
      </p>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="e.g. STE-8K2F9Q"
            className="w-full rounded-full border border-line py-3 pl-11 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={() => handleTrack()}
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Track
        </button>
      </div>

      {recent.length > 0 && !activeId && (
        <div className="flex flex-wrap gap-2 mb-8 text-sm text-ink-soft">
          <span>Your recent orders:</span>
          {recent.map((id) => (
            <button
              key={id}
              onClick={() => handleTrack(id)}
              className="rounded-full border border-line px-3 py-1 hover:border-accent hover:text-accent-deep"
            >
              {id}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">{error}</p>
      )}

      {order === undefined && activeId && !error && (
        <div className="animate-pulse rounded-2xl border border-line p-6 h-40" />
      )}

      {order && (
        <div className="rounded-2xl border border-line p-6">
          <div className="flex items-center justify-between text-sm text-ink-soft mb-6">
            <span>
              Order <b className="text-ink">{order.id}</b>
            </span>
            <span>
              {order.customer.city}
              {order.createdAt ? ` · ${new Date(order.createdAt).toLocaleDateString()}` : ""}
            </span>
          </div>

          <OrderTimeline status={order.status} />

          <div className="mt-8 space-y-2 border-t border-line pt-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <b>{formatPKR(item.price * item.qty)}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-dashed border-line pt-4 font-display font-semibold">
            <span>Total</span>
            <span>{formatPKR(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
