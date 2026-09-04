import type { CartItem } from "@/lib/types";

const CART_KEY = "sitara-cart";
export const CART_UPDATED_EVENT = "sitara-cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

export function getCart(): CartItem[] {
  return readCart();
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1): CartItem[] {
  const items = readCart();
  const existing = items.find(
    (i) => i.productId === item.productId && i.color === item.color
  );
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, existing.stock ?? Infinity);
  } else {
    items.push({ ...item, qty });
  }
  writeCart(items);
  return items;
}

export function updateQty(productId: string, qty: number, color?: string): CartItem[] {
  let items = readCart();
  if (qty <= 0) {
    items = items.filter((i) => !(i.productId === productId && i.color === color));
  } else {
    items = items.map((i) =>
      i.productId === productId && i.color === color ? { ...i, qty } : i
    );
  }
  writeCart(items);
  return items;
}

export function removeFromCart(productId: string, color?: string): CartItem[] {
  return updateQty(productId, 0, color);
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0);
}
