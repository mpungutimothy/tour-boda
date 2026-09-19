/**
 * Canonical site origin.
 *
 * Assets are stored locally and referenced as `/images/…`, which is correct for
 * `<img src>` but wrong for Open Graph tags and JSON-LD: those are read by
 * crawlers with no page context, so a relative path is meaningless to them.
 * Everything that leaves the HTML document goes through `absoluteUrl`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tour-boda.ug"
).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
