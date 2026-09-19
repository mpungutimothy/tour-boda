"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/photos";

/**
 * Card photograph with a real loading state.
 *
 * The skeleton is not a decoration and not a simulated delay — it covers the
 * gap between the HTML arriving and the JPEG finishing decode, which on a
 * Ugandan mobile connection is a real and visible wait. The image fades in over
 * the shimmer rather than replacing it, so the card never flashes empty.
 *
 * The `src` is passed through `asset()` so that a deployment under a subpath
 * (GitHub Pages) resolves correctly. It is idempotent, so sources that already
 * carry the prefix — anything built via `imagePath()` — are left alone.
 *
 * `sizes` and explicit dimensions are deliberately absent: the export ships
 * unoptimized local files and every slot has a fixed aspect ratio, so the
 * layout is stable before the bytes land and there is nothing to reserve.
 */
export function CardImage({
  src,
  alt,
  className,
  wrapperClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  /**
   * Reveal the image if the browser already finished it.
   *
   * The image renders at `opacity-0` until `load` fires, which is what makes
   * the fade work. But on a repeat visit, a warm cache or a fast connection the
   * bytes can arrive BEFORE React hydrates — and then the `load` event has
   * already been and gone, so the handler below never runs, `loaded` stays
   * false, and the photograph sits at `opacity-0` permanently. That failure
   * looks exactly like a broken image while every byte is present and the
   * network panel shows 200s.
   *
   * `complete` is the browser's own answer to "have you got this yet", so it is
   * checked on mount via the ref callback. Cheap, and it removes the whole
   * class of race.
   */
  const measure = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <span className={cn("absolute inset-0 block overflow-hidden", wrapperClassName)}>
      {/* Shimmer placeholder, cream-to-tan, swept left to right. */}
      <span
        aria-hidden
        className={cn(
          "skeleton absolute inset-0 block transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={measure}
        src={asset(src)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "relative h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </span>
  );
}
