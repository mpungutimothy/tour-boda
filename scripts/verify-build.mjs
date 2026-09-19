/**
 * Build-asset audit: does every utility class the source asks for actually
 * exist in the shipped CSS?
 *
 * This exists because of a real bug. The hero overlay was written as
 * `from-black/70 via-black/68 to-black/78`. Tailwind's default opacity scale
 * contains 70 but NOT 68 or 78, so two of the three stops were silently dropped
 * and the gradient rendered as black/70 → transparent. Nothing failed: the
 * build was clean, the typecheck was clean, the class names were right there in
 * the source, and the contrast audit passed because it modelled the values that
 * were *intended* rather than the ones that shipped.
 *
 * A class name in JSX is a request, not a guarantee. This script closes that gap
 * by checking the requests against the built CSS.
 *
 * Run after a build:  node scripts/verify-build.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");

if (!existsSync(OUT)) {
  console.error("out/ does not exist — run `npm run build:static` first.");
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const problems = [];

/* --- the built CSS, as one string ----------------------------------------- */

const cssDir = path.join(OUT, "_next", "static", "css");
if (!existsSync(cssDir)) {
  console.error("No CSS bundle found in out/_next/static/css.");
  process.exit(1);
}
const css = walk(cssDir)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

/**
 * Tailwind escapes `/`, `[`, `]`, `.` and `%` in class selectors, e.g.
 * `from-black/70` is emitted as `.from-black\/70`. Build that escaped form.
 */
function selectorFor(cls) {
  return (
    "." +
    cls.replace(/[./[\]%(),#:]/g, (ch) => "\\" + ch)
  );
}

/**
 * Present if the selector appears followed by any character that can legally
 * end a class selector. The `,` case matters: `:root,.theme-body{…}` is a
 * selector list, so testing only for `.theme-body{` reports a false negative on
 * a class that shipped perfectly well.
 */
function inCss(cls) {
  const sel = selectorFor(cls);
  return ["{", ":", ",", " ", ">", "~", "+"].some((next) =>
    css.includes(sel + next),
  );
}

/* --- 1. Every opacity-modified utility in the source must have shipped ------
   Only classes carrying a `/` shade modifier are checked, because those are the
   ones with a finite scale behind them and therefore the ones that can vanish
   without a word. Plain utilities like `flex` or `mt-4` are not at risk. */

const SOURCE_DIRS = ["app", "components"];
const CLASS_ATTR = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;
// e.g. from-black/70, bg-scrim/85, via-scrim/[0.15], text-foreground/60
const SHADED =
  /(?:^|\s)(-?(?:from|via|to|bg|text|border|ring|divide|fill|stroke|shadow|outline|decoration|placeholder|caret|accent)-[a-z0-9-]+\/(?:\[[0-9.]+\]|\d{1,3}))(?=\s|$)/g;

const requested = new Map(); // class -> Set(source file)

for (const dir of SOURCE_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (!/\.(tsx|ts)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(CLASS_ATTR)) {
      const value = match[1] ?? match[2] ?? "";
      for (const cls of value.matchAll(SHADED)) {
        const name = cls[1];
        const set = requested.get(name) ?? new Set();
        set.add(path.relative(ROOT, file));
        requested.set(name, set);
      }
    }
  }
}

for (const [cls, sources] of requested) {
  if (!inCss(cls)) {
    const [prefix, alpha] = cls.split("/");
    const scale = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100];
    const hint =
      alpha && !alpha.startsWith("[") && !scale.includes(Number(alpha))
        ? ` — ${alpha} is not in Tailwind's default opacity scale; use ${prefix}/[0.${alpha.padStart(2, "0")}] instead`
        : "";
    problems.push(`${cls}: requested by ${[...sources][0]} but absent from the built CSS${hint}`);
  }
}

/* --- 2. Load-bearing classes that must exist, named explicitly ------------- */

const REQUIRED = [
  // Route loading UI
  "route-progress",
  "skeleton",
  // Header treatment
  "glass-nav",
  "theme-shell",
  "theme-body",
  // Section rhythm
  "band-cream",
  // Hero overlay — the four layers the contrast audit models
  "from-black/70",
  "via-black/[0.68]",
  "to-black/[0.78]",
  "from-black/[0.45]",
  "via-black/20",
  "bg-gradient-to-br",
  "bg-gradient-to-r",
  // Card behaviour
  "card-lift",
];

for (const cls of REQUIRED) {
  if (!inCss(cls)) problems.push(`${cls}: required by the design system but absent from the built CSS`);
}

/* --- 3. Routes and static assets ------------------------------------------ */

const REQUIRED_ROUTES = [
  "index.html",
  "tours.html",
  "guides.html",
  "about.html",
  "contact.html",
  "how-it-works.html",
  "credits.html",
  "privacy.html",
  "terms.html",
  "destinations/jinja-nile.html",
  "book/jinja-nile.html",
];

for (const route of REQUIRED_ROUTES) {
  if (!existsSync(path.join(OUT, route))) problems.push(`out/${route} was not exported`);
}

for (const asset of ["icon.svg", ".nojekyll", "images/hero-home.jpg", "robots.txt"]) {
  if (!existsSync(path.join(OUT, asset))) problems.push(`out/${asset} is missing from the export`);
}

/* --- 4. Nothing should reference a remote image ---------------------------- */

const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
const remoteImages = new Set();
for (const file of htmlFiles) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/<img\b[^>]*?\bsrc="(https?:\/\/[^"]+)"/g)) {
    remoteImages.add(match[1]);
  }
}
for (const url of remoteImages) {
  problems.push(`remote <img src>: ${url} — photography is meant to be self-hosted`);
}

/* --- 5. Every page links an icon and a hero preload ------------------------ */

const home = readFileSync(path.join(OUT, "index.html"), "utf8");
if (!/rel="icon"/.test(home)) {
  problems.push("index.html has no <link rel=\"icon\"> — browsers will request /favicon.ico and log a 404");
}
const preloads = home.match(/rel="preload" as="image"/g) ?? [];
if (preloads.length === 0) problems.push("index.html preloads no image — the hero is not prioritised");
if (preloads.length > 1) {
  problems.push(
    `index.html preloads ${preloads.length} images — only the hero should compete for the initial connection`,
  );
}

/* --- Report ---------------------------------------------------------------- */

console.log("\nBuild asset audit");
console.log("─".repeat(70));
console.log(`shaded utility classes requested : ${requested.size}`);
console.log(`CSS bundles scanned              : ${walk(cssDir).length}`);
console.log(`HTML files scanned               : ${htmlFiles.length}`);

if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  ✗ ${problem}`);
  console.log("\nFAIL — the built assets do not match what the source asks for.\n");
  process.exit(1);
}

console.log("\nPASS — every shaded utility shipped, critical classes present, routes exported.\n");
