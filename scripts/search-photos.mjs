#!/usr/bin/env node
/**
 * Development tool: search Wikimedia Commons for candidate photography.
 *
 * Commons is used because every file carries machine-readable licence and
 * author metadata, which lets `scripts/sync-photos.mjs` write accurate
 * attribution rather than hand-typed guesses.
 *
 * Usage:  node scripts/search-photos.mjs "sipi falls" "kampala market" ...
 */

const API = "https://commons.wikimedia.org/w/api.php";
const UA =
  "TourBodaPrototype/1.0 (marketplace prototype; contact: prototype@example.com)";

async function search(term, limit = 8) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${term}`,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "1600",
  });

  const res = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for "${term}"`);
  const json = await res.json();
  const pages = json?.query?.pages;
  if (!pages) return [];

  return Object.values(pages)
    .filter((page) => page.imageinfo?.[0])
    .map((page) => {
      const info = page.imageinfo[0];
      const meta = info.extmetadata ?? {};
      const strip = (value) =>
        (value ?? "")
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();
      return {
        title: page.title.replace(/^File:/, ""),
        width: info.width,
        height: info.height,
        ratio: Math.round((info.width / info.height) * 100) / 100,
        artist: strip(meta.Artist?.value) || "Unknown",
        licence: strip(meta.LicenseShortName?.value) || "Unstated",
        thumb: info.thumburl,
      };
    })
    // Prefer landscape frames: the site's image slots are 16/10 and 4/3.
    .sort((a, b) => Math.abs(a.ratio - 1.5) - Math.abs(b.ratio - 1.5));
}

const terms = process.argv.slice(2);
if (terms.length === 0) {
  console.error("Give at least one search term.");
  process.exit(1);
}

for (const term of terms) {
  console.log(`\n=== ${term} ===`);
  try {
    const results = await search(term);
    if (results.length === 0) console.log("  (no results)");
    for (const r of results) {
      console.log(
        `  ${String(r.width).padStart(5)}x${String(r.height).padEnd(5)} r${String(
          r.ratio,
        ).padEnd(5)} ${r.licence.padEnd(16)} ${r.title}`,
      );
      console.log(`         by ${r.artist}`);
    }
  } catch (error) {
    console.log(`  ERROR ${error.message}`);
  }
}
