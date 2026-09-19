import { PHOTO_CREDITS, creditFor, type PhotoCredit } from "@/data/photo-credits";
import type { DestinationImage } from "@/types/destination";

/**
 * Photography helpers.
 *
 * Every photograph on the site is a first-party asset in `public/images/`, so
 * nothing depends on a third party staying up or on a venue having wifi. The
 * credit for each one is generated from the source file's own licence metadata
 * by `scripts/sync-photos.mjs`, which means attribution can never drift out of
 * sync with the image it belongs to.
 */

/** Local URL for a file in `public/images/`. */
export function imagePath(file: string): string {
  return `/images/${file}`;
}

/** The credit record for a local image path. */
export function creditForPath(url: string): PhotoCredit | undefined {
  const file = url.split("/").pop();
  return file ? creditFor(file) : undefined;
}

/**
 * Human-readable attribution, e.g.
 * "Sandra Aceng · CC BY-SA 4.0 · Wikimedia Commons".
 */
export function creditLine(url: string): string | undefined {
  const credit = creditForPath(url);
  if (!credit) return undefined;
  return [credit.artist, credit.licence, credit.source].filter(Boolean).join(" · ");
}

/** Alt text for a photograph, preferring the recorded subject. */
export function altFor(url: string, fallback = ""): string {
  return creditForPath(url)?.subject ?? fallback;
}

/**
 * Declare a route gallery as `[filename, caption]` pairs.
 *
 * Keeps the `/images/` prefix and the credit lookup out of the editorial files,
 * so a writer editing a caption cannot accidentally break an image path.
 */
export function gallery(
  entries: ReadonlyArray<readonly [file: string, caption: string]>,
): DestinationImage[] {
  return entries.map(([file, caption]) => ({ url: imagePath(file), caption }));
}

export { PHOTO_CREDITS };
export type { PhotoCredit };
