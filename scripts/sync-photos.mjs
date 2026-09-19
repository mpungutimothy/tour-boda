#!/usr/bin/env node
/**
 * Sync every photograph the site uses into `public/images/`.
 *
 * Why self-host? The prototype originally hotlinked Wikimedia and Pexels. That
 * makes the site depend on two third parties staying up, serving the exact
 * bytes, and not rate-limiting a demo — and it silently breaks the moment the
 * exported `out/` folder is opened offline or from a venue with no wifi. These
 * images are now first-party assets, so the static export is self-contained.
 *
 * Commons is the source because every file carries machine-readable licence and
 * author metadata. The script reads that metadata from the API and writes
 * `data/photo-credits.ts` from it, so attribution is generated rather than
 * hand-typed — hand-typed credits are how you end up shipping "not not phil"
 * as an author name.
 *
 * Usage:
 *   node scripts/sync-photos.mjs            # download anything missing
 *   node scripts/sync-photos.mjs --force    # re-download everything
 */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const UA =
  "TourBodaPrototype/1.0 (marketplace prototype; contact: prototype@example.com)";

const OUT_DIR = path.join(process.cwd(), "public", "images");
const CREDITS_FILE = path.join(process.cwd(), "data", "photo-credits.ts");
const MANIFEST_FILE = path.join(
  process.cwd(),
  "scripts",
  "photo-manifest.json",
);
const FORCE = process.argv.includes("--force");

/**
 * Widths are chosen per slot rather than one global maximum: a 1920px hero and
 * a 640px thumbnail cost very different amounts of bandwidth, and shipping the
 * hero size everywhere would triple the weight of the export for no visible
 * gain. Commons resizes server-side, so we never download a 6,000px original.
 */
const HERO = 1920;
const WIDE = 1600;
const TILE = 900;
const THUMB = 800;

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function stripHtml(value) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Resolve one Commons file title to a sized URL plus its licence metadata. */
async function resolveCommons(title, width) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: `File:${title}`,
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: String(width),
  });

  const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);
  const json = await res.json();

  const page = Object.values(json?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`no imageinfo for "${title}"`);

  const meta = info.extmetadata ?? {};
  const artist = stripHtml(meta.Artist?.value) || "Unknown";
  const licence = stripHtml(meta.LicenseShortName?.value) || "See source";
  const licenceUrl = stripHtml(meta.LicenseUrl?.value);

  return {
    url: info.thumburl ?? info.url,
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
    artist,
    licence,
    licenceUrl,
    pageUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(
      title.replace(/ /g, "_"),
    )}`,
  };
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // Guard against an HTML error page or a Commons "file not found" notice
  // being written out and called a JPEG.
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng =
    buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG";
  if (!isJpeg && !isPng) {
    throw new Error(`not an image (${buffer.length} bytes): ${url}`);
  }
  if (buffer.length < 8_000) {
    throw new Error(`suspiciously small (${buffer.length} bytes): ${url}`);
  }

  await writeFile(dest, buffer);
  return {
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex").slice(0, 12),
  };
}

function formatBytes(n) {
  return n > 1_048_576
    ? `${(n / 1_048_576).toFixed(1)} MB`
    : `${Math.round(n / 1024)} KB`;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_FILE, "utf8"));
  await mkdir(OUT_DIR, { recursive: true });

  const credits = [];
  const failures = [];
  let downloaded = 0;
  let skipped = 0;
  let totalBytes = 0;

  for (const entry of manifest.photos) {
    const file = `${entry.name}.jpg`;
    const dest = path.join(OUT_DIR, file);

    try {
      let source;
      if (entry.commons) {
        source = await resolveCommons(entry.commons, entry.width ?? TILE);
      } else {
        // Pexels CDN URLs are not human-readable. Point the credit at the photo
        // page instead, so the link on the credits page goes somewhere a person
        // can actually check the licence.
        const pexelsId = entry.url.match(/\/photos\/(\d+)\//)?.[1];
        source = {
          url: entry.url,
          artist: entry.artist ?? "Pexels",
          licence: entry.licence ?? "Pexels License",
          licenceUrl: entry.licenceUrl ?? "https://www.pexels.com/license/",
          pageUrl:
            entry.pageUrl ??
            (pexelsId
              ? `https://www.pexels.com/photo/${pexelsId}/`
              : entry.url.split("?")[0]),
        };
      }

      let stat;
      if (!FORCE && (await exists(dest))) {
        stat = { bytes: (await readFile(dest)).length, sha256: "cached" };
        skipped += 1;
      } else {
        stat = await download(source.url, dest);
        downloaded += 1;
      }
      totalBytes += stat.bytes;

      credits.push({
        file,
        context: entry.context,
        subject: entry.subject,
        artist: source.artist,
        licence: source.licence,
        licenceUrl: source.licenceUrl ?? "",
        pageUrl: source.pageUrl,
        source: entry.commons ? "Wikimedia Commons" : "Pexels",
      });

      console.log(
        `  ok    ${file.padEnd(34)} ${formatBytes(stat.bytes).padStart(8)}  ${
          entry.commons ? source.licence : "Pexels"
        }`,
      );
    } catch (error) {
      failures.push({ name: entry.name, message: error.message });
      console.log(`  FAIL  ${file.padEnd(34)} ${error.message}`);
    }
  }

  // ---- Generate the credits module -------------------------------------
  const header = `/**
 * Photo credits — GENERATED FILE, do not edit by hand.
 *
 * Produced by \`scripts/sync-photos.mjs\` from the licence metadata attached to
 * each source file. Re-run the script after changing \`photo-manifest.json\`.
 *
 * Every image on this site is a real photograph of a real place in Uganda, and
 * each one carries the attribution its licence requires. Images are stored
 * locally in \`public/images/\` so the static export has no third-party
 * dependency at runtime.
 */

export interface PhotoCredit {
  /** Filename inside \`public/images/\`. */
  file: string;
  /** Where on the site this photograph appears. */
  context: string;
  /** What the photograph actually shows. */
  subject: string;
  artist: string;
  licence: string;
  licenceUrl: string;
  pageUrl: string;
  source: "Wikimedia Commons" | "Pexels";
}

export const PHOTO_CREDITS: PhotoCredit[] = `;

  const body = JSON.stringify(credits, null, 2);
  const footer = `;

const BY_FILE = new Map(PHOTO_CREDITS.map((credit) => [credit.file, credit]));

export function creditFor(file: string): PhotoCredit | undefined {
  return BY_FILE.get(file);
}

/** All distinct licences in use, for the credits page summary. */
export function licenceSummary(): { licence: string; count: number }[] {
  const counts = new Map();
  for (const credit of PHOTO_CREDITS) {
    counts.set(credit.licence, (counts.get(credit.licence) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([licence, count]) => ({ licence, count }))
    .sort((a, b) => b.count - a.count);
}
`;

  await writeFile(CREDITS_FILE, `${header}${body}${footer}`, "utf8");

  console.log(
    `\n${credits.length} images · ${downloaded} downloaded · ${skipped} cached · ${formatBytes(
      totalBytes,
    )} total`,
  );
  if (failures.length > 0) {
    console.log(`\n${failures.length} FAILED:`);
    for (const failure of failures) {
      console.log(`  ${failure.name}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

await main();
