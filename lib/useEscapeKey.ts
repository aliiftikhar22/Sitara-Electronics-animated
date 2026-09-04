"use client";

import { useEffect } from "react";

/** Calls `onEscape` when Escape is pressed while `active` — used to let
 * keyboard users dismiss drawers/modals without a mouse. */
export function useEscapeKey(onEscape: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
