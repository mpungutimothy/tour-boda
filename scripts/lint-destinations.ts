/**
 * Run the editorial linter over every destination narrative in data/destinations.ts.
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/lint-destinations.ts
 *
 * Add --json for machine-readable output.
 */
import { destinations } from "../data/destinations";
import { validateContent } from "../lib/content/validate";

const asJson = process.argv.includes("--json");

interface Report {
  slug: string;
  name: string;
  passed: boolean;
  words: number;
  bannedPhrases: { phrase: string; count: number; contexts: string[] }[];
  missingRequiredElements: { key: string; label: string; hint: string }[];
}

const reports: Report[] = destinations.map((destination) => {
  const result = validateContent(destination.narrative, "destination");
  return {
    slug: destination.slug,
    name: destination.name,
    passed: result.passed,
    words: destination.narrative.trim().split(/\s+/).length,
    bannedPhrases: result.bannedPhrases.map((hit) => ({
      phrase: hit.phrase,
      count: hit.count,
      contexts: hit.contexts,
    })),
    missingRequiredElements: result.missingRequiredElements.map((element) => ({
      key: element.key,
      label: element.label,
      hint: element.hint,
    })),
  };
});

if (asJson) {
  console.log(JSON.stringify(reports, null, 2));
} else {
  const line = "─".repeat(72);
  console.log(`\nEditorial lint — ${reports.length} destination narratives\n${line}`);

  for (const report of reports) {
    console.log(
      `\n${report.passed ? "PASS" : "FAIL"}  ${report.name}  (${report.slug}, ${report.words} words)`,
    );

    if (report.bannedPhrases.length === 0) {
      console.log("  banned phrases: none");
    } else {
      console.log(`  banned phrases: ${report.bannedPhrases.length} unique`);
      for (const hit of report.bannedPhrases) {
        console.log(`    • "${hit.phrase}" ×${hit.count}`);
        for (const context of hit.contexts) {
          console.log(`        ${context}`);
        }
      }
    }

    if (report.missingRequiredElements.length === 0) {
      console.log("  required elements: all 5 present");
    } else {
      console.log(
        `  required elements missing: ${report.missingRequiredElements.length}/5`,
      );
      for (const element of report.missingRequiredElements) {
        console.log(`    • ${element.label} (${element.key})`);
      }
    }
  }

  const failed = reports.filter((report) => !report.passed);
  const totalBanned = reports.reduce(
    (sum, report) => sum + report.bannedPhrases.reduce((n, hit) => n + hit.count, 0),
    0,
  );
  const totalMissing = reports.reduce(
    (sum, report) => sum + report.missingRequiredElements.length,
    0,
  );

  console.log(`\n${line}`);
  console.log(
    `Summary: ${reports.length - failed.length}/${reports.length} pass · ${totalBanned} banned-phrase occurrences · ${totalMissing} missing required elements`,
  );
  if (failed.length > 0) {
    console.log(`Failing: ${failed.map((report) => report.slug).join(", ")}`);
  }
  console.log();
}
