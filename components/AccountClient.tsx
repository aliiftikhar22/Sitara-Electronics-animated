"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Package, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/lib/auth";
import { getOrdersByUid } from "@/lib/firestore";
import { formatPKR } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function AccountClient() {
  const router = useRouter();
  const { user, profile, loading, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getOrdersByUid(user.uid)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [user]);

  if (loading || !user) {
    return <div className="pt-32 pb-24 text-center text-ink-soft">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 pt-32 pb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-2">
            My Account
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {profile?.name ?? user.email}
          </h1>
          <p className="text-ink-soft text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink/40"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="mb-8 flex items-center gap-3 rounded-xl bg-navy px-5 py-4 text-white"
        >
          <ShieldCheck className="h-5 w-5" />
          <span className="font-medium">Open Admin Dashboard</span>
        </Link>
      )}

      <h2 className="font-display text-xl font-semibold mb-4">Order History</h2>

      {orders === null && (
        <div className="animate-pulse rounded-xl border border-line h-24" />
      )}

      {orders && orders.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center text-ink-soft">
          <Package className="h-8 w-8" />
          <p>No orders placed while signed in yet.</p>
          <Link href="/track-order" className="text-accent-deep font-medium text-sm">
            Track an order by ID instead →
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/track-order?id=${order.id}`}
                className="flex items-center justify-between rounded-xl border border-line px-5 py-4 hover:border-accent"
              >
                <div>
                  <p className="font-mono text-sm">{order.id}</p>
                  <p className="text-xs text-ink-soft capitalize">{order.status}</p>
                </div>
                <span className="font-display font-semibold">
                  {formatPKR(order.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
