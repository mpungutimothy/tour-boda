export interface KeyFact {
  label: string;
  value: string;
}

export interface DestinationLocation {
  lat: number;
  lng: number;
  region: string;
}

export interface DestinationImage {
  url: string;
  caption: string;
  credit: string;
}

export interface DestinationAuthor {
  name: string;
  bio: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface TourTier {
  name: string;
  price: number;
  duration: string;
  inclusions: string[];
  bestFor: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: string;
  narrative: string;
  keyFacts: KeyFact[];
  location: DestinationLocation;
  images: DestinationImage[];
  author: DestinationAuthor;
  faqs: FAQ[];
  tiers: TourTier[];
}
