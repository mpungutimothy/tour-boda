/**
 * Structural conformance checks for JSON-LD, transcribed from Google's
 * structured-data documentation. Pure functions — no filesystem or CLI here.
 *
 * Sources:
 *   - General structured data guidelines (sd-policies)
 *   - Product snippet (Product, Review, Offer)
 *   - Review snippet (Review, AggregateRating)
 *   - Breadcrumb (BreadcrumbList)
 *   - FAQ rich result (removed from Google Search in 2026)
 */

export interface Finding {
  level: "error" | "warning";
  feature: string;
  message: string;
}

/** Feature -> informational note. Notes never affect pass/fail. */
export type Notes = Record<string, string[]>;

export const FEATURE_PRODUCT = "Product snippet";
export const FEATURE_RATING = "Review snippet (AggregateRating)";
export const FEATURE_BREADCRUMB = "Breadcrumb";
export const FEATURE_FAQ = "FAQ";
export const FEATURE_ATTRACTION = "TouristAttraction";
export const FEATURE_GRAPH = "Graph integrity";

export const ALL_FEATURES = [
  FEATURE_ATTRACTION,
  FEATURE_PRODUCT,
  FEATURE_RATING,
  FEATURE_BREADCRUMB,
  FEATURE_FAQ,
  FEATURE_GRAPH,
];

const ISO_4217 = /^[A-Z]{3}$/;

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function nodesOf(graph: Record<string, unknown>): Record<string, unknown>[] {
  const graphValue = graph["@graph"];
  return Array.isArray(graphValue)
    ? (graphValue.filter(isObject) as Record<string, unknown>[])
    : [graph];
}

export function typeOf(node: Record<string, unknown>): string {
  const value = node["@type"];
  return typeof value === "string" ? value : "(missing @type)";
}

/* -------------------------------------------------------------------------- */
/*  Feature validators                                                         */
/* -------------------------------------------------------------------------- */

export function validateProduct(node: Record<string, unknown>, findings: Finding[]): void {
  const feature = FEATURE_PRODUCT;
  const at = `Product "${String(node.name ?? "(unnamed)")}"`;

  if (!node.name) {
    findings.push({ level: "error", feature, message: `${at}: missing required "name".` });
  }

  // Required: at least one of offers / review / aggregateRating.
  if (!node.offers && !node.review && !node.aggregateRating) {
    findings.push({
      level: "error",
      feature,
      message: `${at}: needs at least one of "offers", "review", "aggregateRating".`,
    });
  }

  if (!node.image) {
    findings.push({ level: "warning", feature, message: `${at}: missing recommended "image".` });
  } else {
    const images = Array.isArray(node.image) ? node.image : [node.image];
    for (const image of images) {
      if (typeof image !== "string" || !image.startsWith("http")) {
        findings.push({
          level: "error",
          feature,
          message: `${at}: image URL must be absolute and crawlable (got ${JSON.stringify(image)}).`,
        });
      }
    }
  }
  if (!node.description) {
    findings.push({ level: "warning", feature, message: `${at}: missing recommended "description".` });
  }
  if (!node.brand) {
    findings.push({ level: "warning", feature, message: `${at}: missing recommended "brand".` });
  }

  const offer = node.offers;
  if (isObject(offer)) {
    if (offer.price === undefined && !offer.priceSpecification) {
      findings.push({
        level: "error",
        feature,
        message: `${at}: Offer needs "price" or "priceSpecification".`,
      });
    }
    if (offer.priceCurrency === undefined) {
      findings.push({ level: "error", feature, message: `${at}: Offer missing required "priceCurrency".` });
    } else if (typeof offer.priceCurrency !== "string" || !ISO_4217.test(offer.priceCurrency)) {
      findings.push({
        level: "error",
        feature,
        message: `${at}: "priceCurrency" must be ISO 4217 (got ${JSON.stringify(offer.priceCurrency)}).`,
      });
    }
    if (offer.price !== undefined && typeof offer.price !== "number") {
      findings.push({
        level: "warning",
        feature,
        message: `${at}: "price" should be a number, not a string.`,
      });
    }
    if (!offer.availability) {
      findings.push({
        level: "warning",
        feature,
        message: `${at}: Offer missing recommended "availability".`,
      });
    }
  } else if (offer !== undefined) {
    findings.push({
      level: "error",
      feature,
      message: `${at}: "offers" must be an object or an array of objects.`,
    });
  }
}

export function validateAggregateRating(
  node: Record<string, unknown>,
  findings: Finding[],
): void {
  const feature = FEATURE_RATING;
  const ratingValue = node.ratingValue;

  if (ratingValue === undefined) {
    findings.push({ level: "error", feature, message: `AggregateRating missing required "ratingValue".` });
  } else if (typeof ratingValue !== "number") {
    findings.push({
      level: "warning",
      feature,
      message: `AggregateRating "ratingValue" should be a number.`,
    });
  }

  if (node.ratingCount === undefined && node.reviewCount === undefined) {
    findings.push({
      level: "error",
      feature,
      message: `AggregateRating needs "ratingCount" or "reviewCount".`,
    });
  }

  const best = typeof node.bestRating === "number" ? node.bestRating : 5;
  const worst = typeof node.worstRating === "number" ? node.worstRating : 1;
  if (typeof ratingValue === "number" && (ratingValue < worst || ratingValue > best)) {
    findings.push({
      level: "error",
      feature,
      message: `AggregateRating "ratingValue" ${ratingValue} outside ${worst}–${best}.`,
    });
  }
}

export function validateBreadcrumb(node: Record<string, unknown>, findings: Finding[]): void {
  const feature = FEATURE_BREADCRUMB;
  const items = node.itemListElement;

  if (!Array.isArray(items) || items.length === 0) {
    findings.push({
      level: "error",
      feature,
      message: `BreadcrumbList missing required "itemListElement".`,
    });
    return;
  }

  items.forEach((rawItem, index) => {
    if (!isObject(rawItem)) {
      findings.push({ level: "error", feature, message: `itemListElement[${index}] is not an object.` });
      return;
    }
    const expected = index + 1;
    if (rawItem.position !== expected) {
      findings.push({
        level: "error",
        feature,
        message: `itemListElement[${index}] position should be ${expected}, got ${JSON.stringify(rawItem.position)}.`,
      });
    }
    if (!rawItem.name) {
      findings.push({ level: "error", feature, message: `itemListElement[${index}] missing required "name".` });
    }
    // `item` is required for every crumb except the last.
    if (index < items.length - 1 && !rawItem.item) {
      findings.push({
        level: "error",
        feature,
        message: `itemListElement[${index}] ("${String(rawItem.name)}") needs "item" — only the final crumb may omit it.`,
      });
    }
  });
}

export function validateFaq(node: Record<string, unknown>, findings: Finding[]): void {
  const feature = FEATURE_FAQ;
  const mainEntity = node.mainEntity;

  if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
    findings.push({ level: "error", feature, message: `FAQPage missing "mainEntity" array.` });
    return;
  }

  mainEntity.forEach((rawQuestion, index) => {
    if (!isObject(rawQuestion) || rawQuestion["@type"] !== "Question") {
      findings.push({ level: "error", feature, message: `mainEntity[${index}] is not a Question.` });
      return;
    }
    if (!rawQuestion.name) {
      findings.push({ level: "error", feature, message: `mainEntity[${index}] Question missing "name".` });
    }
    const answer = rawQuestion.acceptedAnswer;
    if (!isObject(answer) || !answer.text) {
      findings.push({
        level: "error",
        feature,
        message: `mainEntity[${index}] Question missing "acceptedAnswer.text".`,
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  Graph-level checks                                                         */
/* -------------------------------------------------------------------------- */

export function validateGraph(graph: Record<string, unknown>, findings: Finding[]): void {
  const feature = FEATURE_GRAPH;

  if (graph["@context"] !== "https://schema.org") {
    findings.push({
      level: "error",
      feature,
      message: `Root "@context" should be "https://schema.org" (got ${JSON.stringify(graph["@context"])}).`,
    });
  }

  if (!Array.isArray(graph["@graph"])) {
    findings.push({ level: "warning", feature, message: `No "@graph" array at the root.` });
  }

  const nodes = nodesOf(graph);
  const seen = new Map<string, number>();

  for (const node of nodes) {
    if (!node["@type"]) {
      findings.push({ level: "error", feature, message: `A node is missing "@type".` });
    }
    const id = node["@id"];
    if (typeof id === "string") {
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }
  }

  for (const [id, count] of Array.from(seen.entries())) {
    if (count > 1) {
      findings.push({ level: "error", feature, message: `Duplicate @id "${id}" (${count}×).` });
    }
  }

  // A rating or review emitted as a loose sibling in @graph cannot be
  // associated with the item it rates. Google's docs describe two supported
  // shapes: nested inside the item, or linked via @id.
  for (const node of nodes) {
    const type = typeOf(node);
    if (type === "AggregateRating" || type === "Rating" || type === "Review") {
      findings.push({
        level: "error",
        feature,
        message: `${type} node "${String(node["@id"] ?? "(no @id)")}" is a top-level @graph entry; it must be nested inside the item it rates.`,
      });
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Combined entry point                                                       */
/* -------------------------------------------------------------------------- */

/** Validate any JSON-LD graph object and return its findings. */
export function validateSchemaGraph(graph: Record<string, unknown>): Finding[] {
  const findings: Finding[] = [];
  validateGraph(graph, findings);

  for (const node of nodesOf(graph)) {
    switch (typeOf(node)) {
      case "Product":
        validateProduct(node, findings);
        if (isObject(node.aggregateRating)) {
          validateAggregateRating(node.aggregateRating, findings);
        }
        break;
      case "AggregateRating":
        validateAggregateRating(node, findings);
        break;
      case "BreadcrumbList":
        validateBreadcrumb(node, findings);
        break;
      case "FAQPage":
        validateFaq(node, findings);
        break;
      default:
        break;
    }
  }

  return findings;
}
