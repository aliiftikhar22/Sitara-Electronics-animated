"use client";

import { Package, ClipboardList, Clock, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import type { Order, Product } from "@/lib/types";

const LOW_STOCK_THRESHOLD = 3;

export default function AdminDashboardTab({
  products,
  orders,
}: {
  products: Product[];
  orders: Order[];
}) {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "confirmed" || o.status === "preparing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock != null && p.stock <= LOW_STOCK_THRESHOLD);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package },
    { label: "Total Orders", value: totalOrders, icon: ClipboardList },
    { label: "Pending Orders", value: pendingOrders, icon: Clock },
    { label: "Delivered Orders", value: deliveredOrders, icon: CheckCircle2 },
    { label: "Total Sales", value: formatPKR(totalSales), icon: TrendingUp },
    { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line p-5">
            <s.icon className="h-5 w-5 text-accent-deep mb-3" />
            <div className="font-display text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-ink-soft mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div>
          <h3 className="font-display font-semibold mb-3">Low Stock</h3>
          <ul className="space-y-2">
            {lowStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm"
              >
                <span>{p.name}</span>
                <span className="font-semibold text-red-600">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
