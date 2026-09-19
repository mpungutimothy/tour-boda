"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Card photograph with a real loading state.
 *
 * The skeleton is not a decoration and not a simulated delay — it covers the
 * gap between the HTML arriving and the JPEG finishing decode, which on a
 * Ugandan mobile connection is a real and visible wait. The image fades in over
 * the shimmer rather than replacing it, so the card never flashes empty.
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
        src={src}
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
