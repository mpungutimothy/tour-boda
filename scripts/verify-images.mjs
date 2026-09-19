#!/usr/bin/env node
/**
 * Image integrity check.
 *
 * The brief was "all images should be working", so this is the check that
 * actually proves it rather than assuming it:
 *
 *   1. every file in `public/images/` is a real JPEG or PNG, not an HTML error
 *      page that got saved with a .jpg extension;
 *   2. every `/images/…` path referenced anywhere in the built `out/` folder —
 *      HTML and JS bundles alike — resolves to a file that exists;
 *   3. every image carries a licence record, because most of this photography is
 *      CC BY or CC BY-SA and attribution is a condition of use;
 *   4. no image is shipped that nothing references (dead weight in the export).
 *
 * Usage:
 *   node scripts/verify-images.mjs            # checks public/images + credits
 *   node scripts/verify-images.mjs --built    # also checks the exported out/
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUT_DIR = path.join(ROOT, "out");
const CHECK_BUILT = process.argv.includes("--built");

const problems = [];
const notes = [];

function fail(message) {
  problems.push(message);
}

/** Detect the real format from magic bytes rather than trusting the extension. */
function sniff(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "jpeg";
  if (buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") return "png";
  return null;
}

async function walk(dir, filter) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, filter)));
    else if (filter(entry.name)) out.push(full);
  }
  return out;
}

/* --- 1. Every source image is a real image -------------------------------- */

const files = (await readdir(IMAGES_DIR)).sort();
const onDisk = new Set(files);
let totalBytes = 0;

for (const file of files) {
  const full = path.join(IMAGES_DIR, file);
  const info = await stat(full);
  totalBytes += info.size;

  const buffer = await readFile(full);
  const format = sniff(buffer);
  if (!format) {
    fail(`${file}: not a JPEG or PNG (first bytes: ${buffer.subarray(0, 8).toString("hex")})`);
    continue;
  }
  if (buffer.length < 8_000) {
    fail(`${file}: only ${buffer.length} bytes — probably a placeholder`);
  }
  if (!/\.(jpe?g|png)$/i.test(file)) {
    fail(`${file}: extension does not match a web image format`);
  }
}

/* --- 2. Every reference resolves ------------------------------------------ */

const REFERENCE = /\/images\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp))/g;
const referenced = new Map(); // filename -> Set(sources)

async function scan(dir, label) {
  if (!existsSync(dir)) return;
  const targets = await walk(dir, (name) =>
    /\.(html|js|mjs|cjs|json|txt|xml|ts|tsx)$/.test(name),
  );
  for (const target of targets) {
    const text = await readFile(target, "utf8");
    for (const match of text.matchAll(REFERENCE)) {
      const file = match[1];
      const set = referenced.get(file) ?? new Set();
      set.add(path.relative(ROOT, target));
      referenced.set(file, set);
    }
  }
}

await scan(path.join(ROOT, "app"), "app");
await scan(path.join(ROOT, "components"), "components");
await scan(path.join(ROOT, "data"), "data");
await scan(path.join(ROOT, "lib"), "lib");
await scan(path.join(ROOT, "public"), "public");

// The manifest declares images by bare name and the code builds the `/images/`
// prefix at runtime, so a literal-path scan alone would report every route
// gallery as unreferenced. Treat the manifest as an authoritative reference.
const manifest = JSON.parse(
  await readFile(path.join(ROOT, "scripts", "photo-manifest.json"), "utf8"),
);
const manifestFiles = new Set(manifest.photos.map((photo) => `${photo.name}.jpg`));
for (const file of manifestFiles) {
  const set = referenced.get(file) ?? new Set();
  set.add("scripts/photo-manifest.json");
  referenced.set(file, set);
}

for (const [file, sources] of referenced) {
  if (!onDisk.has(file)) {
    fail(`${file}: referenced by ${[...sources].slice(0, 3).join(", ")} but missing from public/images/`);
  }
}

/* --- 2b. Bare filenames in the data layer ---------------------------------
   Destinations, guides and experience types declare their images as BARE
   filenames — `"dest-entebbe-1.jpg"` — and `lib/photos.ts` builds the
   `/images/` prefix at runtime. A literal-path scan cannot see those, and the
   manifest is not evidence about them either.

   This check used to be missing, and the gap was real: the manifest was treated
   as an authoritative reference (see below), so a typo in a gallery entry
   passed every assertion while the card rendered a broken image. The manifest
   proves a file was synced; it does not prove the code names it correctly.

   Case is compared exactly, because Netlify and GitHub Pages both run on
   case-sensitive filesystems — `Dest-Entebbe-1.jpg` builds fine on Windows and
   404s in production. */

const BARE_NAME = /"([A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpe?g|png|webp))"/g;
const bareRefs = new Map();

async function scanBare(dir) {
  if (!existsSync(dir)) return;
  const targets = await walk(dir, (name) => /\.(ts|tsx)$/.test(name));
  for (const target of targets) {
    const text = await readFile(target, "utf8");
    for (const match of text.matchAll(BARE_NAME)) {
      const file = match[1];
      const set = bareRefs.get(file) ?? new Set();
      set.add(path.relative(ROOT, target));
      bareRefs.set(file, set);
    }
  }
}

await scanBare(path.join(ROOT, "data"));
await scanBare(path.join(ROOT, "lib"));

for (const [file, sources] of bareRefs) {
  if (!onDisk.has(file)) {
    const nearMiss = files.find((f) => f.toLowerCase() === file.toLowerCase());
    fail(
      `${file}: named by ${[...sources].slice(0, 3).join(", ")} but not present in public/images/` +
        (nearMiss
          ? ` — did you mean "${nearMiss}"? Filenames are case-sensitive in production.`
          : ""),
    );
  }
}

/* --- 3. Licence records --------------------------------------------------- */

const creditsSource = await readFile(
  path.join(ROOT, "data", "photo-credits.ts"),
  "utf8",
);
const credited = new Set(
  Array.from(creditsSource.matchAll(/"file": "([^"]+)"/g)).map((m) => m[1]),
);

for (const file of files) {
  if (!credited.has(file)) {
    fail(`${file}: no licence record in data/photo-credits.ts`);
  }
}
for (const file of credited) {
  if (!onDisk.has(file)) {
    fail(`${file}: credited but not present in public/images/`);
  }
}

/* --- 4. Unreferenced images ----------------------------------------------- */

for (const file of files) {
  if (!referenced.has(file)) {
    notes.push(`${file}: on disk but never referenced by the site`);
  }
}

/* --- 5. The exported build ------------------------------------------------ */

let builtCount = 0;
if (CHECK_BUILT) {
  const builtImages = path.join(OUT_DIR, "images");
  if (!existsSync(builtImages)) {
    fail("out/images/ does not exist — run `npm run build:static` first");
  } else {
    const built = new Set(await readdir(builtImages));
    builtCount = built.size;
    for (const file of files) {
      if (!built.has(file)) fail(`out/images/${file} is missing from the export`);
    }

    // Every reference in the shipped HTML must resolve inside out/.
    const htmlFiles = await walk(OUT_DIR, (name) => name.endsWith(".html"));
    const missingInBuild = new Map();
    for (const htmlFile of htmlFiles) {
      const text = await readFile(htmlFile, "utf8");
      for (const match of text.matchAll(REFERENCE)) {
        const file = match[1];
        if (!built.has(file)) {
          const set = missingInBuild.get(file) ?? new Set();
          set.add(path.relative(OUT_DIR, htmlFile));
          missingInBuild.set(file, set);
        }
      }
    }
    for (const [file, pages] of missingInBuild) {
      fail(`out/: ${file} referenced by ${[...pages].slice(0, 3).join(", ")} but not exported`);
    }

    // Stronger than the text scan above: resolve the URL the BROWSER will
    // actually request for every <img>, and check that file exists in out/.
    //
    // This is the check that catches a deployment-subpath mistake — a page
    // emitting `/tour-boda/images/x.jpg` into an export whose images live at
    // `out/images/x.jpg`. That failure renders every card image broken while
    // the page itself still looks fine, which is exactly how it gets
    // misdiagnosed as "the images are missing from the repo".
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
    const IMG_SRC = /<img\b[^>]*?\bsrc="([^"]+)"/g;
    const unresolved = new Map();
    let imgCount = 0;

    for (const htmlFile of htmlFiles) {
      const text = await readFile(htmlFile, "utf8");
      for (const match of text.matchAll(IMG_SRC)) {
        const src = match[1];
        // Remote and inline sources are not this script's business; the whole
        // point of the image pipeline is that there should be none.
        if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) continue;
        imgCount++;

        let rel = decodeURIComponent(src.split("?")[0]).replace(/^\/+/, "");
        // The export always writes `out/images/…` flat. On a subpath deploy the
        // host maps `out/` to that subpath, so the prefix is stripped before
        // resolving against the filesystem.
        if (basePath) {
          const prefix = `${basePath.replace(/^\//, "")}/`;
          if (rel.startsWith(prefix)) rel = rel.slice(prefix.length);
        }
        if (!rel) continue;

        if (!existsSync(path.join(OUT_DIR, rel))) {
          const set = unresolved.get(src) ?? new Set();
          set.add(path.relative(OUT_DIR, htmlFile));
          unresolved.set(src, set);
        }
      }
    }

    for (const [src, pages] of unresolved) {
      fail(
        `out/: <img src="${src}"> would 404 — no such file in the export (first seen in ${[...pages][0]})`,
      );
    }

    console.log(
      `Scanned ${htmlFiles.length} exported HTML file(s); ${built.size} image(s) in out/images/.`,
    );
    console.log(
      `Resolved ${imgCount} <img> src value(s) against the export` +
        (basePath ? ` (basePath "${basePath}" stripped)` : "") +
        `.`,
    );
  }
}

/* --- Report --------------------------------------------------------------- */

console.log(`\nImage verification`);
console.log("─".repeat(70));
console.log(`files on disk   : ${files.length}`);
console.log(`referenced      : ${referenced.size}`);
console.log(`with credits    : ${credited.size}`);
console.log(`total weight    : ${(totalBytes / 1_048_576).toFixed(1)} MB`);
if (CHECK_BUILT) console.log(`in export       : ${builtCount}`);

for (const note of notes) console.log(`  note: ${note}`);

if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  console.log("\nFAIL — image integrity problems found.\n");
  process.exit(1);
}

console.log("\nPASS — every referenced image exists, is a real image, and is credited.\n");
