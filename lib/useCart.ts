"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CART_UPDATED_EVENT,
  cartCount,
  cartTotal,
  clearCart,
  getCart,
  removeFromCart,
  updateQty,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

export function useCart() {
  // Starts empty (matching SSR) and is filled client-side after mount —
  // reading localStorage during the initial render would mismatch the
  // server-rendered HTML, which has no access to it.
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, which is unavailable during SSR
    setItems(getCart());
    const handler = (e: Event) => {
      setItems((e as CustomEvent<CartItem[]>).detail ?? getCart());
    };
    window.addEventListener(CART_UPDATED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    items,
    count: cartCount(items),
    total: cartTotal(items),
    updateQty: useCallback((productId: string, qty: number, color?: string) => {
      setItems(updateQty(productId, qty, color));
    }, []),
    remove: useCallback((productId: string, color?: string) => {
      setItems(removeFromCart(productId, color));
    }, []),
    clear: useCallback(() => {
      clearCart();
      setItems([]);
    }, []),
  };
}
