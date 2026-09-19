import type { Destination, TourTier } from "@/types/destination";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Site-wide identity, so every node can be attributed to one publisher.
 */
const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Tour-Boda Uganda",
  url: SITE_URL,
} as const;

/**
 * NOTE: there is no `aggregateRating` anywhere in this graph, and there must
 * not be until real reviews exist.
 *
 * A previous version emitted a hardcoded 4.8/5 from 12 reviewers. Nothing in
 * `data/routes/` stores customer reviews, so that markup asserted ratings no
 * user ever gave. Google's structured data guidelines: "Don't mark up
 * irrelevant or misleading content, such as fake reviews", and reviews not by
 * actual users "may result in manual action" — which would remove rich-result
 * eligibility for the affected pages.
 *
 * `generateAggregateRating` now returns `null` unconditionally. Wire it to a
 * real review store before changing that.
 */

interface SchemaObject {
  [key: string]: unknown;
}

function destinationUrl(slug: string): string {
  return `${SITE_URL}/destinations/${slug}`;
}

function tierId(tier: TourTier): string {
  return tier.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* -------------------------------------------------------------------------- */
/*  TouristAttraction — the page's main entity                                 */
/* -------------------------------------------------------------------------- */

export function generateTouristAttraction(destination: Destination): SchemaObject {
  const url = destinationUrl(destination.slug);

  return {
    "@type": "TouristAttraction",
    "@id": `${url}#attraction`,
    name: destination.name,
    description: destination.narrative,
    url,
    mainEntityOfPage: url,
    // Absolute, because structured data is consumed out of page context.
    image: destination.images.map((img) => absoluteUrl(img.url)),
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.location.region,
      addressCountry: "UG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.location.lat,
      longitude: destination.location.lng,
    },
    touristType: destination.category,
    isAccessibleForFree: false,
    provider: ORGANIZATION,
    // NOTE: `openingHours` was removed. The data model has no opening-hours
    // field, and the previous hardcoded "Mo-Su" asserted 24/7 access that the
    // page never states.
    //
    // NOTE: no `aggregateRating` here. Google supports review snippets for
    // Product (and a fixed list of other types); TouristAttraction is not on
    // that list, so a rating attached to this node would be ignored.
  };
}

/* -------------------------------------------------------------------------- */
/*  Products — one per tour tier                                               */
/* -------------------------------------------------------------------------- */

export function generateProduct(
  destination: Destination,
  tier: TourTier,
): SchemaObject {
  const url = destinationUrl(destination.slug);

  const product: SchemaObject = {
    "@type": "Product",
    "@id": `${url}#tier-${tierId(tier)}`,
    name: `${destination.name} — ${tier.name}`,
    description: tier.bestFor,
    url,
    image: destination.images.map((img) => absoluteUrl(img.url)),
    category: destination.category,
    brand: {
      "@type": "Brand",
      name: "Tour-Boda Uganda",
    },
    isPartOf: { "@id": `${url}#attraction` },
    offers: generateOffer(destination, tier),
  };

  const rating = generateAggregateRating();
  if (rating) {
    product.aggregateRating = rating;
  }

  return product;
}

export function generateProducts(destination: Destination): SchemaObject[] {
  return destination.tiers.map((tier) => generateProduct(destination, tier));
}

function generateOffer(destination: Destination, tier: TourTier): SchemaObject {
  const url = destinationUrl(destination.slug);

  return {
    "@type": "Offer",
    "@id": `${url}#tier-${tierId(tier)}-offer`,
    url,
    name: tier.name,
    price: tier.price,
    priceCurrency: "UGX",
    // `description` carries the quotation caveat for bespoke routes, so no
    // consumer treats an indicative figure as a firm offer.
    ...(destination.pricingMode === "quotation" && destination.quoteNote
      ? { description: destination.quoteNote }
      : {}),
    // UnitPriceSpecification restates the same price in structured form. Google
    // accepts either `price` or `priceSpecification`; supplying both is valid
    // and keeps the unit semantics explicit for other consumers.
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: tier.price,
      priceCurrency: "UGX",
      valueAddedTaxIncluded: true,
      // The published price is per person, at the standard party of two.
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 2,
        unitText: "person",
      },
    },
    // A boda carries two passengers, so maximum party size is a real
    // constraint rather than merchandising.
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: tier.maxParty,
      unitText: "person",
    },
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: ORGANIZATION,
    // `priceValidUntil` is deliberately omitted: no expiry exists in the data,
    // and inventing one would misstate how long the price holds.
  };
}

/* -------------------------------------------------------------------------- */
/*  Ratings                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Returns the aggregate rating to nest inside each Product, or `null` when no
 * real review data exists. See the note at the top of this file: this always
 * returns `null` today, deliberately.
 */
export function generateAggregateRating(): SchemaObject | null {
  return null;
}

/* -------------------------------------------------------------------------- */
/*  FAQPage                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * NOTE: Google deprecated the FAQ rich result — it stopped appearing in Search
 * on 7 May 2026, and the documentation was removed in June 2026. This markup is
 * still valid schema.org and remains useful to other consumers (AI answers,
 * aggregators), but it will not produce a Google rich result. It is kept
 * because the FAQ content is genuinely visible on the page.
 */
export function generateFAQPage(destination: Destination): SchemaObject | null {
  if (destination.faqs.length === 0) return null;

  const url = destinationUrl(destination.slug);

  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: destination.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  BreadcrumbList                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The destination page renders a visible breadcrumb trail in its hero, so this
 * markup reflects content a reader can actually see — which is what Google's
 * guidelines ask for.
 */
export function generateBreadcrumbList(destination: Destination): SchemaObject {
  const url = destinationUrl(destination.slug);

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tours",
        item: `${SITE_URL}/tours`,
      },
      {
        // Final crumb: Google treats `item` as optional for the last element.
        "@type": "ListItem",
        position: 3,
        name: destination.name,
        item: url,
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Graph                                                                      */
/* -------------------------------------------------------------------------- */

export function generateDestinationSchema(destination: Destination): SchemaObject {
  const faq = generateFAQPage(destination);

  return {
    "@context": "https://schema.org",
    "@graph": [
      generateTouristAttraction(destination),
      ...generateProducts(destination),
      ...(faq ? [faq] : []),
      generateBreadcrumbList(destination),
    ],
  };
}
