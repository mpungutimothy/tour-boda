/**
 * Published-copy regression check.
 *
 * Usage:
 *   node scripts/compare-narratives.mjs [gitRef] [pathAtThatRef]
 *
 * Compares every destination narrative in the working tree against the same
 * narrative at a git ref, byte for byte. The routes were restructured (content
 * split from commerce configuration) as part of the marketplace build, and this
 * is the check that proves the restructuring did not touch a single word of
 * published copy.
 *
 * Defaults to `HEAD`, and finds the content file at that ref automatically so
 * it keeps working across the move from `data/destinations.ts` to
 * `data/routes/core.ts`.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ref = process.argv[2] ?? "HEAD";
const explicitPath = process.argv[3];

const CANDIDATE_PATHS = [
  "data/routes/core.ts",
  "data/destinations.ts",
  "data/routes/extra.ts",
];

function show(refArg, path) {
  try {
    return execFileSync("git", ["show", `${refArg}:${path}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

/** Pull every `narrative: "..."` string literal out of a data source file. */
function narratives(source) {
  const out = [];
  const pattern = /narrative:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    out.push(JSON.parse(`"${match[1]}"`));
  }
  return out;
}

// Working tree: read the assembled sources directly, so a narrative added to
// either file is picked up.
const workingPaths = ["data/routes/core.ts", "data/routes/extra.ts"];
const currentSource = workingPaths
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
const current = narratives(currentSource);

if (explicitPath) CANDIDATE_PATHS.unshift(explicitPath);

let baseline = null;
let usedPath = "";
for (const path of CANDIDATE_PATHS) {
  const source = show(ref, path);
  if (!source) continue;
  const parsed = narratives(source);
  if (parsed.length > 0) {
    baseline = parsed;
    usedPath = path;
    break;
  }
}

if (!baseline) {
  console.error(
    `Could not find destination narratives at ${ref}. Tried: ${CANDIDATE_PATHS.join(", ")}`,
  );
  process.exit(1);
}

console.log(`\nPublished-copy check — ${ref}:${usedPath} vs working tree`);
console.log("─".repeat(70));
console.log(`baseline narratives: ${baseline.length}`);
console.log(`working narratives : ${current.length}`);

// Any narrative present at the ref must still be present verbatim. New
// narratives (added routes) are allowed and reported separately.
let changed = 0;
let unchanged = 0;
for (const original of baseline) {
  if (current.includes(original)) {
    unchanged += 1;
    continue;
  }
  changed += 1;
  const partial = current.find(
    (entry) => entry.slice(0, 60) === original.slice(0, 60),
  );
  console.log(
    `\n  CHANGED (${original.length} chars -> ${partial ? partial.length : "MISSING"})`,
  );
  if (partial) {
    let i = 0;
    while (i < original.length && original[i] === partial[i]) i += 1;
    console.log(`    first difference at char ${i}:`);
    console.log(
      `      ref:     ...${JSON.stringify(original.slice(Math.max(0, i - 40), i + 40))}`,
    );
    console.log(
      `      working: ...${JSON.stringify(partial.slice(Math.max(0, i - 40), i + 40))}`,
    );
  }
}

const added = current.length - unchanged;
console.log(
  `\n  ${unchanged} unchanged, ${changed} changed, ${added} new narrative(s)`,
);

if (changed > 0) {
  console.log("\nFAIL — published copy was modified.\n");
  process.exit(1);
}
console.log("\nPASS — every narrative published at that ref is byte-identical.\n");
