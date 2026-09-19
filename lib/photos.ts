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
 *
 * ---------------------------------------------------------------------------
 * DEPLOYMENT NOTE — why `asset()` exists. Read before adding an image.
 *
 * Next.js automatically prefixes `basePath` onto `/_next/*` bundles and onto
 * `next/link` hrefs, but it does NOT touch a raw `<img src="/images/…">`. This
 * app renders images with plain `<img>` (see `CardImage`), so on any host that
 * serves the site from a SUBPATH — a GitHub Pages project site at
 * `/tour-boda/`, for example — every hardcoded `/images/…` requests the domain
 * root instead and 404s. The page itself keeps working, which is what makes the
 * failure so easy to misread as "the images are missing from the repo".
 *
 * `asset()` closes that gap: it prefixes `NEXT_PUBLIC_BASE_PATH` when the build
 * is deployed under a subpath and is a no-op otherwise, so the same code is
 * correct on Netlify (root) and on GitHub Pages (subpath) with no edits.
 *
 * ---------------------------------------------------------------------------
 * TODO(pre-launch) — IMAGE LICENSING, see also PROTOTYPE_NOTICE.photography.
 *
 * The photography currently shipped is licensed, self-hosted and credited —
 * it is NOT hotlinked and NOT unlicensed — but it is also NOT commissioned
 * work about these specific operators. Every file is a Wikimedia Commons
 * photograph under CC BY / CC BY-SA / public domain, chosen to match its
 * caption as closely as possible.
 *
 * Before this is presented as a production product, each of the following must
 * be replaced with original photography or imagery licensed from the Uganda
 * Tourism Board's media resources:
 *
 *   - `guide-photo-*.jpg` — posed portraits of real, named guides, who have
 *     consented. These are currently NOT consented portraits of the people
 *     they are captioned as, and `data/guides.ts` renders a monogram instead
 *     wherever no portrait exists.
 *   - `dest-*.jpg`, `exp-*.jpg` — the specific road, site or activity sold on
 *     that card, so the card cannot misrepresent what a traveller receives.
 *   - `hero-home.jpg`, `brand-*.jpg` — brand-level imagery.
 * ---------------------------------------------------------------------------
 */

/**
 * Subpath the site is served from, e.g. `/tour-boda` on a GitHub Pages project
 * site. Empty string (the default) means "served from the domain root", which
 * is the Netlify case.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
  /\/+$/,
  "",
);

/**
 * Prefix a site-absolute path with the deployment subpath.
 *
 * Idempotent by design: passing an already-prefixed path returns it unchanged,
 * so it is safe to apply at both the data layer (`imagePath`) and the render
 * layer (`CardImage`) without any risk of a doubled `/tour-boda/tour-boda/`.
 * Absolute URLs and bare relative paths are passed through untouched.
 */
export function asset(path: string): string {
  if (!BASE_PATH) return path;
  if (/^https?:\/\//i.test(path) || !path.startsWith("/")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

/** Local URL for a file in `public/images/`, basepath-correct. */
export function imagePath(file: string): string {
  return asset(`/images/${file}`);
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
