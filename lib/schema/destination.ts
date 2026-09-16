import type { Destination, TourTier } from "@/types/destination";

const SITE_URL = "https://tour-boda.ug";

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
 * ⚠️  POLICY RISK — READ BEFORE SHIPPING
 *
 * These values are hardcoded placeholders. Nothing in `data/destinations.ts`
 * stores real customer reviews, so this markup asserts a 4.8/5 rating from 12
 * reviewers that no user ever gave.
 *
 * Google's General structured data guidelines state: "Don't mark up irrelevant
 * or misleading content, such as fake reviews", and "reviews or ratings not by
 * actual users may result in manual action". A structured data manual action
 * removes rich-result eligibility for the affected pages.
 *
 * Replace this with real, collected review data — or set it to `null` to omit
 * aggregateRating from the output entirely.
 */
const DESTINATION_RATING: { ratingValue: number; reviewCount: number } | null = {
  ratingValue: 4.8,
  reviewCount: 12,
};

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
    image: destination.images.map((img) => img.url),
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
    image: destination.images.map((img) => img.url),
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
    // UnitPriceSpecification restates the same price in structured form. Google
    // accepts either `price` or `priceSpecification`; supplying both is valid
    // and keeps the unit semantics explicit for other consumers.
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: tier.price,
      priceCurrency: "UGX",
      valueAddedTaxIncluded: true,
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
 * real review data exists. See the DESTINATION_RATING warning above.
 */
export function generateAggregateRating(): SchemaObject | null {
  if (!DESTINATION_RATING) return null;

  return {
    "@type": "AggregateRating",
    ratingValue: DESTINATION_RATING.ratingValue,
    reviewCount: DESTINATION_RATING.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
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
 * ⚠️  The destination page does not currently render a visible breadcrumb
 * trail. Google's guidelines say not to mark up content that is not visible to
 * readers, so this node is at risk of being treated as invisible markup until a
 * breadcrumb UI is added to the page. `components/ui/breadcrumb.tsx` already
 * exists and is unused.
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
