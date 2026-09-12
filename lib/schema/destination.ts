import type { Destination } from "@/types/destination";

const SITE_URL = "https://tour-boda.ug";

interface SchemaObject {
  [key: string]: unknown;
}

export function generateTouristAttraction(destination: Destination): SchemaObject {
  const description = destination.narrative.slice(0, 300);

  return {
    "@type": "TouristAttraction",
    "@id": `${SITE_URL}/destinations/${destination.slug}#attraction`,
    name: destination.name,
    description,
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
    image: destination.images.map((img) => img.url),
    sameAs: [`${SITE_URL}/destinations/${destination.slug}`],
    openingHours: "Mo-Su",
  };
}

export function generateProducts(destination: Destination): SchemaObject[] {
  return destination.tiers.map((tier) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/destinations/${destination.slug}#tier-${tier.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${destination.name} — ${tier.name}`,
    description: tier.inclusions.join(", "),
    brand: { "@type": "Brand", name: "Tour-Boda Uganda" },
    category: destination.category,
    offers: {
      "@type": "Offer",
      price: tier.price,
      priceCurrency: "UGX",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: tier.price,
        priceCurrency: "UGX",
      },
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/destinations/${destination.slug}`,
    },
  }));
}

export function generateAggregateRating(destination: Destination): SchemaObject {
  return {
    "@type": "AggregateRating",
    "@id": `${SITE_URL}/destinations/${destination.slug}#rating`,
    ratingValue: "4.8",
    reviewCount: "12",
    bestRating: "5",
    worstRating: "1",
  };
}

export function generateReview(destination: Destination): SchemaObject {
  return {
    "@type": "Review",
    "@id": `${SITE_URL}/destinations/${destination.slug}#review`,
    author: {
      "@type": "Person",
      name: destination.author.name,
    },
    reviewBody: destination.narrative.slice(0, 200),
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateFAQPage(destination: Destination): SchemaObject {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/destinations/${destination.slug}#faq`,
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

export function generateBreadcrumbList(destination: Destination): SchemaObject {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/destinations/${destination.slug}#breadcrumb`,
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
        "@type": "ListItem",
        position: 3,
        name: destination.name,
        item: `${SITE_URL}/destinations/${destination.slug}`,
      },
    ],
  };
}

export function generateDestinationSchema(destination: Destination): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateTouristAttraction(destination),
      ...generateProducts(destination),
      generateAggregateRating(destination),
      generateReview(destination),
      generateFAQPage(destination),
      generateBreadcrumbList(destination),
    ],
  };
}
