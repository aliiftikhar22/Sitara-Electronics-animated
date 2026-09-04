"use client";

import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { deleteOrder, updateOrderStatus } from "@/lib/firestore";
import { formatPKR } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["confirmed", "preparing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersTab({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(id);
    } catch {
      alert("Could not delete order.");
    }
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
    } catch {
      alert("Could not update status.");
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <p className="text-ink-soft">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-line">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="flex items-center gap-1.5 font-mono text-sm"
                >
                  {expanded === order.id ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  {order.id}
                </button>
                <span className="text-sm text-ink-soft">{order.customer.name}</span>
                <span className="text-sm text-ink-soft">{order.customer.phone}</span>
                <span className="text-sm text-ink-soft">{order.customer.city}</span>
                <span className="font-display font-semibold text-sm ml-auto">
                  {formatPKR(order.total)}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-line px-2 py-1.5 text-xs capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(order.id)}
                  aria-label="Delete order"
                  className="rounded-lg border border-line p-1.5 text-red-600 hover:border-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {expanded === order.id && (
                <div className="border-t border-line px-4 py-3 text-sm space-y-2">
                  <p className="text-ink-soft">
                    {order.customer.address}
                    {order.customer.notes ? ` — ${order.customer.notes}` : ""}
                  </p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.name} × {item.qty}
                        {item.color ? ` (${item.color})` : ""}
                      </span>
                      <span>{formatPKR(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
