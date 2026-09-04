"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ClipboardList, Star, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/lib/auth";
import {
  subscribeToAllOrders,
  subscribeToAllProducts,
  subscribeToReviews,
} from "@/lib/firestore";
import AdminDashboardTab from "@/components/admin/AdminDashboardTab";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import AdminOrdersTab from "@/components/admin/AdminOrdersTab";
import AdminReviewsTab from "@/components/admin/AdminReviewsTab";
import type { Order, Product, Review } from "@/lib/types";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "reviews", label: "Reviews", icon: Star },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminShell() {
  const router = useRouter();
  const { profile } = useAuth();
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubs = [
      subscribeToAllProducts(setProducts, () => setError("Couldn't load products.")),
      subscribeToAllOrders(setOrders, () => setError("Couldn't load orders.")),
      subscribeToReviews(setReviews, () => setError("Couldn't load reviews.")),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10 pt-28 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-accent-deep uppercase mb-2">
            Admin
          </p>
          <h1 className="font-display text-2xl font-semibold">
            {profile?.name ?? "Dashboard"}
          </h1>
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

      <div className="mb-8 flex gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-accent text-accent-deep"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {tab === "dashboard" && <AdminDashboardTab products={products} orders={orders} />}
      {tab === "products" && <AdminProductsTab products={products} />}
      {tab === "orders" && <AdminOrdersTab orders={orders} />}
      {tab === "reviews" && <AdminReviewsTab reviews={reviews} />}
    </div>
  );
}
