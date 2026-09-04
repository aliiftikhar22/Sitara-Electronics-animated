"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { compressImage } from "@/lib/imageCompress";
import { saveProduct, type ProductInput } from "@/lib/firestore";
import { CATEGORIES } from "@/lib/constants";
import { useEscapeKey } from "@/lib/useEscapeKey";
import type { Product, ProductColor } from "@/lib/types";

export default function ProductFormModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  useEscapeKey(onClose, true);
  const [name, setName] = useState(product?.name ?? "");
  const [cat, setCat] = useState(product?.cat ?? CATEGORIES[0].cat);
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [old, setOld] = useState(product?.old?.toString() ?? "");
  const [specs, setSpecs] = useState((product?.specs ?? []).join(", "));
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [active, setActive] = useState(product?.active !== false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length ? product.images : product?.image ? [product.image] : []
  );
  const [colors, setColors] = useState<ProductColor[]>(product?.colors ?? []);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [colorImageIndex, setColorImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed]);
    } catch {
      setError("One or more images could not be processed.");
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (!colorName.trim() || images.length === 0) return;
    setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex, imageIndex: colorImageIndex }]);
    setColorName("");
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const priceNum = parseFloat(price);
    if (!name.trim() || Number.isNaN(priceNum)) {
      setError("Name and price are required.");
      return;
    }
    const oldNum = old ? parseFloat(old) : null;
    const save = oldNum && oldNum > priceNum ? Math.round(100 - (priceNum / oldNum) * 100) : 0;

    const input: ProductInput = {
      name: name.trim(),
      cat,
      price: priceNum,
      old: oldNum,
      save,
      specs: specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: images[0] ?? "",
      images,
      colors,
      active,
      featured,
      ...(stock ? { stock: parseInt(stock, 10) } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
    };

    setSubmitting(true);
    try {
      await saveProduct(input, product?.id);
      onClose();
    } catch {
      setError("Could not save product — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-paper p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                list="category-options"
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <datalist id="category-options">
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Leave blank if unknown"
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Wholesale Price *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Old Price</label>
              <input
                type="number"
                value={old}
                onChange={(e) => setOld(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Specs (comma separated)</label>
            <input
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Photos</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm" />
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element -- base64 preview thumbnail */}
                    <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[10px] text-white"
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-navy/80 text-center text-[9px] text-white">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Colors</label>
            {colors.length > 0 && (
              <ul className="mb-2 space-y-1.5">
                {colors.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ background: c.hex }}
                    />
                    <span>{c.name}</span>
                    <span className="text-ink-soft text-xs">
                      Photo {c.imageIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="ml-auto text-ink-soft hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {images.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="Color name"
                  className="w-32 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-8 w-10 rounded border border-line"
                />
                <select
                  value={colorImageIndex}
                  onChange={(e) => setColorImageIndex(Number(e.target.value))}
                  className="rounded-lg border border-line px-2 py-1.5 text-sm"
                >
                  {images.map((_, i) => (
                    <option key={i} value={i}>
                      Photo {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addColor}
                  className="rounded-lg bg-mist px-3 py-1.5 text-sm font-medium"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Active (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Saving…" : product ? "Save Changes" : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
