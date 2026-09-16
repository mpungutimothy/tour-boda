/**
 * Run Google-structured-data conformance checks over every destination's
 * generated JSON-LD.
 *
 * This is a structural conformance check, NOT a call to Google's Rich Results
 * Test — that tool has no public API.
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/validate-schema.ts
 *   node --import ./scripts/ts-alias-loader.mjs scripts/validate-schema.ts --dump kampala-city-heritage
 */
import { destinations } from "../data/destinations";
import { generateDestinationSchema } from "../lib/schema/destination";
import {
  ALL_FEATURES,
  FEATURE_ATTRACTION,
  FEATURE_BREADCRUMB,
  FEATURE_FAQ,
  FEATURE_RATING,
  validateSchemaGraph,
  type Finding,
  type Notes,
} from "./lib/schema-validator";

function collectNotes(graph: Record<string, unknown>): Notes {
  const notes: Notes = {};
  const add = (feature: string, message: string) => {
    const list = notes[feature] ?? [];
    if (!list.includes(message)) list.push(message);
    notes[feature] = list;
  };

  const graphNodes = Array.isArray(graph["@graph"]) ? graph["@graph"] : [];

  for (const node of graphNodes) {
    if (typeof node !== "object" || node === null) continue;
    const record = node as Record<string, unknown>;
    switch (record["@type"]) {
      case "TouristAttraction":
        add(
          FEATURE_ATTRACTION,
          "Not a Google rich-result feature. It documents the place; the Product nodes are what can produce snippets.",
        );
        break;
      case "BreadcrumbList":
        add(
          FEATURE_BREADCRUMB,
          "Markup is valid, but the page does not render a visible breadcrumb trail. Google asks that markup reflect visible content.",
        );
        break;
      case "FAQPage":
        add(
          FEATURE_FAQ,
          "FAQ rich results were deprecated by Google (removed 2026-05-07; docs deleted June 2026). Valid markup, no Google rich result.",
        );
        break;
      default:
        break;
    }
  }

  add(
    FEATURE_RATING,
    "Values are hardcoded placeholders, not collected reviews. Google prohibits marking up fake reviews; ratings not from actual users may trigger a manual action.",
  );

  return notes;
}

const dumpIndex = process.argv.indexOf("--dump");

if (dumpIndex !== -1) {
  const slug = process.argv[dumpIndex + 1];
  const destination = destinations.find((d) => d.slug === slug);
  if (!destination) {
    console.error(`Unknown slug "${slug}". Known: ${destinations.map((d) => d.slug).join(", ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify(generateDestinationSchema(destination), null, 2));
} else {
  const results = destinations.map((destination) => {
    const graph = generateDestinationSchema(destination) as Record<string, unknown>;
    return {
      slug: destination.slug,
      findings: validateSchemaGraph(graph),
      notes: collectNotes(graph),
    };
  });

  const line = "─".repeat(74);
  console.log(`\nStructured data conformance — ${destinations.length} destinations\n${line}`);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const result of results) {
    console.log(`\n${result.slug}`);
    const errors = result.findings.filter((f) => f.level === "error");
    const warnings = result.findings.filter((f) => f.level === "warning");
    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (result.findings.length === 0) {
      console.log("  No errors or warnings.");
    }
    for (const finding of errors) {
      console.log(`  ERROR   [${finding.feature}] ${finding.message}`);
    }
    for (const finding of warnings) {
      console.log(`  WARN    [${finding.feature}] ${finding.message}`);
    }
  }

  console.log(`\n${line}`);
  console.log("Feature rollup (all destinations)\n");
  console.log(`  ${"FEATURE".padEnd(34)} ${"STRUCTURE".padEnd(10)} E / W`);

  for (const feature of ALL_FEATURES) {
    const featureFindings: Finding[] = results.flatMap((r) =>
      r.findings.filter((f) => f.feature === feature),
    );
    const errors = featureFindings.filter((f) => f.level === "error").length;
    const warnings = featureFindings.filter((f) => f.level === "warning").length;
    const suffix =
      feature === FEATURE_ATTRACTION || feature === FEATURE_FAQ
        ? "(no rich result)"
        : feature === FEATURE_RATING
          ? "(policy risk)"
          : "";
    console.log(
      `  ${feature.padEnd(34)} ${(errors > 0 ? "FAIL" : "PASS").padEnd(10)} ${errors} / ${warnings}  ${suffix}`,
    );
  }

  console.log(`\n${line}`);
  console.log("Notices\n");
  const noticeKeys = new Set(results.flatMap((r) => Object.keys(r.notes)));
  for (const feature of ALL_FEATURES) {
    if (!noticeKeys.has(feature)) continue;
    const messages = Array.from(new Set(results.flatMap((r) => r.notes[feature] ?? [])));
    for (const message of messages) {
      console.log(`  • [${feature}] ${message}`);
    }
  }

  console.log(`\n  Total: ${totalErrors} error(s), ${totalWarnings} warning(s)\n`);
}
