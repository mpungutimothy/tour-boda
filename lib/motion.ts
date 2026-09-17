"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`. Resolved in an effect rather than during
 * render so the server and the first client paint agree, which keeps this out
 * of hydration-mismatch territory.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export { formatUGX, formatUGXShort, formatNumber } from "@/lib/format";
