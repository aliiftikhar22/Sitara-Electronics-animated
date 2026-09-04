"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { deleteProduct } from "@/lib/firestore";
import { formatPKR } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function AdminProductsTab({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
    } catch {
      alert("Could not delete product.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">Products ({products.length})</h2>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-ink-soft">No products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="py-3 pr-4">Photo</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line/60">
                  <td className="py-3 pr-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-mist">
                      {p.image && <SmartImage src={p.image} alt={p.name} fill className="object-cover" />}
                    </div>
                  </td>
                  <td className="py-3 pr-4 max-w-xs truncate">{p.name}</td>
                  <td className="py-3 pr-4">{p.cat}</td>
                  <td className="py-3 pr-4">{formatPKR(p.price)}</td>
                  <td className="py-3 pr-4">{p.stock ?? "—"}</td>
                  <td className="py-3 pr-4">
                    {p.active === false ? (
                      <span className="text-red-600">Hidden</span>
                    ) : (
                      <span className="text-green-700">Active</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        aria-label="Edit"
                        className="rounded-lg border border-line p-1.5 hover:border-ink/40"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        aria-label="Delete"
                        className="rounded-lg border border-line p-1.5 text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== undefined && (
        <ProductFormModal product={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
