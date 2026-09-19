import Link from "next/link";
import Image from "next/image";
import { destinations } from "@/data/destinations";
import { guides, totalTripsLed, averageRating } from "@/data/guides";
import { tierMeta } from "@/data/tiers";
import { TRAVELLER_FEES } from "@/data/revenue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/layout/section-heading";
import { asset } from "@/lib/photos";
import { SearchProvider } from "@/components/marketplace/search-provider";
import { SearchBar } from "@/components/marketplace/search-bar";
import { QuickPicks } from "@/components/marketplace/quick-picks";
import { ResultsGrid } from "@/components/marketplace/results-grid";
import { ExperienceGrid } from "@/components/marketplace/experience-grid";
import { TierLegend } from "@/components/marketplace/tier-ui";
import {
  RevenueModel,
  RevenueSummaryStrip,
} from "@/components/marketplace/revenue-model";
import { PartnerRail } from "@/components/marketplace/partners-section";
import { GuideCard } from "@/components/marketplace/guide-card";
import {
  ArrowRight,
  Bike,
  Compass,
  CreditCard,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * The marketplace journey, in the order a traveller actually does it.
 */
const howItWorks = [
  {
    icon: Compass,
    step: "01",
    title: "Search and compare",
    desc: "Filter by place, date, group type and budget. Every route shows three service levels side by side, priced in shillings.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Book and pay",
    desc: "Pick a date and party size, add extras, and pay by MTN or Airtel Money or card. The price you see is the price you pay.",
  },
  {
    icon: Bike,
    step: "03",
    title: "Ride with your guide",
    desc: "Your rider picks you up. Licensed, vetted, and on this road most days of the week.",
  },
];

/**
 * Home.
 *
 * Section rhythm is fixed and deliberate: cream → white → cream → white → dark.
 * The alternation is what gives the page its editorial pacing, so it is
 * expressed once here in band classes rather than improvised per section. Any
 * new section has to join one of the four bands, not invent a fifth.
 *
 * There is exactly one entrance animation on this page — the hero sequence.
 * Everything below it is static on load. Scroll-triggered reveals on every
 * section were removed because they made a marketplace feel like a landing
 * page and delayed content the visitor had already asked for.
 */
export default function Home() {
  const routeCount = destinations.length;
  const guideCount = guides.length;
  const districtCount = new Set(
    destinations.map((destination) => destination.location.district),
  ).size;
  const fromPrice = Math.min(
    ...destinations.flatMap((destination) =>
      destination.tiers.map((tier) => tier.price),
    ),
  );
  const rating = averageRating();
  const trips = totalTripsLed();

  const heroStats = [
    { label: "Destinations", value: String(routeCount) },
    { label: "Districts", value: String(districtCount) },
    { label: "Vetted guides", value: String(guideCount) },
    { label: "From", value: `${(fromPrice / 1000).toFixed(0)}k`, unit: "UGX" },
  ];

  const trustSignals = [
    { label: "Licensed guides", detail: "District or city authority permit on every profile" },
    { label: "Vetted in person", detail: "Interviewed and ride-checked before listing" },
    { label: "No booking fee", detail: "Travellers pay the published price, nothing on top" },
    {
      label: "Partnership-backed",
      detail: "Guide associations, rider groups and site custodians",
    },
  ];

  return (
    <SearchProvider>
      {/* ══ BAND 1 — PHOTOGRAPHIC HERO ════════════════════════════════
          The only dark region outside the header and footer, and the only place
          a photograph sits behind running text. `theme-shell` flips the tokens
          so the headline, the stats and the rule above them become paper and
          dimmed paper without a single hardcoded colour; the search card opts
          back out into the light palette with `theme-body`, so it stays a white
          card whatever is behind it. */}
      <section className="theme-shell relative isolate overflow-hidden border-b border-hairline bg-background">
        {/*
          The one photograph on this site allowed to load eagerly: it is the
          largest contentful paint element on the most-visited page, so
          `priority` is right here and wrong anywhere else.

          `bg-background` on the section above is the fallback — if the file
          ever goes missing the hero is still a dark band with paper text on it,
          rather than paper text on white.

          The src goes through `asset()` deliberately. It is tempting to assume
          next/image applies `basePath` on its own, and it does NOT: with
          `images.unoptimized` set — which this static export requires — the src
          is emitted verbatim. Verified by building with
          NEXT_PUBLIC_BASE_PATH=/tour-boda: next/image produced
          `/images/hero-home.jpg` while the raw <img> elements correctly
          produced `/tour-boda/images/…`. Without `asset()` here the hero would
          be the single image that breaks on a subpath deploy. `asset()` is a
          no-op at the root, so Netlify is unaffected.

          TODO(pre-launch): replace with commissioned or UTB-licensed imagery.
          See the licensing note in lib/photos.ts.
        */}
        <Image
          src={asset("/images/hero-home.jpg")}
          alt="A boda-boda rider carrying a passenger along a street in western Uganda, with mist-covered hills behind"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/*
          Two overlays, and both are load-bearing for WCAG AA.

          The first is the dark wash. Its lightest point is 0.70 rather than the
          0.60 the brief suggested, because the top of this particular frame is
          a bright misty sky: measured against it, the dimmed paper stat labels
          (#C9C2AE) reach only 3.2:1 at 0.60, and 4.8:1 at 0.70.

          The second darkens the left edge under the headline column, so
          legibility does not depend on which photograph is eventually used.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/[0.68] to-black/[0.78]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/[0.45] via-black/20 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-14">
            {/* ---- Headline ---- */}
            <div>
              {/*
                The eyebrow is paper, not gold. Brand gold as 11px text over a
                photograph measures 4.3:1 against a white pixel at this scrim —
                short of the 4.5:1 AA floor — and the brightness of the frame
                under it is not something a future image swap should be able to
                quietly invalidate. Paper clears it everywhere by a wide margin.
              */}
              <p
                className="animate-rise-in font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-foreground"
                style={{ animationDelay: "0ms" }}
              >
                Kampala · Jinja · Entebbe · Mbale · Fort Portal
              </p>

              <h1
                className="animate-rise-in mt-4 font-display text-[2.5rem] font-semibold leading-[1.04] tracking-display-lg text-foreground sm:text-[3.25rem] lg:text-[3.75rem]"
                style={{ animationDelay: "100ms" }}
              >
                Ride Uganda with a guide who knows every road
              </h1>

              <p
                className="animate-rise-in mt-5 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground"
                style={{ animationDelay: "200ms" }}
              >
                Local boda-boda riders take you to the places a coach bus cannot
                reach — and tell you the truth about the road on the way.
              </p>

              {/* ---- Hero stats ---- */}
              <dl
                className="animate-rise-in mt-9 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-7 sm:grid-cols-4"
                style={{ animationDelay: "300ms" }}
              >
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-1.5 font-display text-2xl font-semibold leading-none tracking-display text-foreground">
                      {stat.value}
                      {stat.unit ? (
                        <span className="ml-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {stat.unit}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ---- Search card ----
                 `theme-body` is the light island: it re-asserts the light
                 palette inside the dark hero, so the card keeps its white
                 surface, dark ink and light dividers and the fields inside it
                 stay legible. Offset against the band below on large screens. */}
            <div
              className="theme-body animate-rise-in lg:translate-y-10"
              style={{ animationDelay: "400ms" }}
            >
              <SearchBar className="shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BAND 2 — WHITE: quick picks, trust, destinations ══════════ */}
      <section className="border-b border-hairline bg-background">
        {/* ---- Quick picks ----
             Moved out of the hero when the hero became photographic. Cream is
             reserved for the guides band below, so the page alternates
             dark hero → white → cream → white rather than tinting every
             section. */}
        <div className="border-b border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Start from your plan
            </p>
            <QuickPicks />
          </div>
        </div>

        {/* ---- Trust bar ---- */}
        <div className="border-b border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {trustSignals.map((signal) => (
                <li key={signal.label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full dot-trust"
                  />
                  <span>
                    <span className="block font-sans text-sm font-semibold text-foreground">
                      {signal.label}
                    </span>
                    <span className="mt-0.5 block font-sans text-xs leading-relaxed text-muted-foreground">
                      {signal.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Destinations ---- */}
        <div
          id="results"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
        >
          <SectionHeading
            id="results-heading"
            eyebrow={`${routeCount} rides across ${districtCount} districts`}
            title="Destinations that match your filters"
            lead="Same road, same rider, three levels of service. Choose a level on any card and the price changes with it."
            action={
              <Button asChild variant="outline">
                <Link href="/tours">
                  Open the full marketplace
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            }
          />

          <ResultsGrid />

          <div className="mt-14">
            <TierLegend />
          </div>
        </div>

        {/* ---- Browse by experience ---- */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Pick your kind of day"
              title="Eight ways to see Uganda"
              lead="Choose one and the catalogue filters to it. Choose it again to clear."
            />
            <ExperienceGrid />
          </div>
        </div>
      </section>

      {/* ══ BAND 3 — CREAM: meet your guides ══════════════════════════ */}
      <section
        className="band-cream border-b border-hairline"
        aria-labelledby="guides-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            id="guides-heading"
            eyebrow="Meet your guides"
            title="The person who actually rides with you"
            lead={
              <>
                <span className="numeric-emphasis">{rating.toFixed(1)}</span>{" "}
                average rating across{" "}
                <span className="numeric-emphasis">
                  {trips.toLocaleString("en-UG")}
                </span>{" "}
                completed trips. Licence numbers and vetting dates are on every
                profile.
              </>
            }
            action={
              <Button asChild variant="outline">
                <Link href="/guides">
                  All {guideCount} guides
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            }
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 3).map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ BAND 4 — WHITE: how it works, the model, partners ═════════ */}
      <section className="bg-background">
        {/* ---- How it works ---- */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from idea to road"
          />

          <ol className="grid gap-6 sm:grid-cols-3">
            {howItWorks.map((step) => (
              <li
                key={step.title}
                className="rounded-lg border border-hairline bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold leading-none tracking-display text-primary-ink">
                    {step.step}
                  </span>
                  <step.icon
                    className="h-5 w-5 text-muted-foreground"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-display">
                  {step.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- Where the money goes ---- */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
              id="model-heading"
              eyebrow="The model"
              title="Where the money goes"
              lead="One price, split three ways. The rider and guide take the majority, the destination that delivers the day is paid directly, and the platform keeps the rest to run the system."
              action={<RevenueSummaryStrip className="shrink-0" />}
            />

            <RevenueModel />

            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/how-it-works">
                  Read the full model
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ---- Partners ---- */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              id="partners-heading"
              eyebrow="In partnership with"
              title="Guide associations, rider groups, and the sites themselves"
              action={
                <Button asChild variant="outline">
                  <Link href="/how-it-works#partners">
                    The full ecosystem
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              }
            />
            <PartnerRail />
          </div>
        </div>

        {/* ---- Newsletter ---- */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 rounded-lg border border-hairline bg-card p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
              <div>
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary-ink">
                  Trip ideas
                </p>
                <h2 className="mt-2.5 font-display text-3xl font-semibold leading-tight tracking-display sm:text-4xl">
                  Find your Uganda
                </h2>
                <p className="mt-3 max-w-lg font-sans text-base leading-relaxed text-muted-foreground">
                  One email a month with new routes, seasonal conditions, and
                  guides who just joined.
                </p>
              </div>

              <div>
                <form className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="trip-ideas-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="trip-ideas-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                  <Button type="submit" className="shrink-0">
                    Get trip ideas
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                </form>
                <p className="mt-3 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
                  Prototype: this form validates but does not submit anywhere,
                  and no list is stored.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/tours">
                  Find your ride
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/book/custom-destination-tour">
                  <Plus className="mr-2 h-4 w-4" aria-hidden />
                  Build a custom route
                </Link>
              </Button>
              <span className="ml-1 hidden items-center gap-2 font-sans text-xs text-muted-foreground sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-primary-ink" aria-hidden />
                Booking fee for travellers:{" "}
                <span className="numeric-emphasis font-mono">
                  {TRAVELLER_FEES.bookingFee === 0
                    ? "none"
                    : TRAVELLER_FEES.bookingFee}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Why Tour-Boda — the three claims, stated once. */}
        <div className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Vetted, not just listed",
                  desc: "Every guide holds a district or city authority licence and is re-verified in person. The licence number is on the profile.",
                },
                {
                  icon: Bike,
                  title: "Local guides",
                  desc: "Our riders grew up here. They know the woman who sells the best rolex at Nakawa, and which pothole floods first.",
                },
                {
                  icon: Compass,
                  title: "Sixty per cent to the road",
                  desc: "The operator and guide take the majority of every booking. The split is published, not implied.",
                },
              ].map((item) => (
                <div key={item.title} className="border-t-2 border-primary pt-5">
                  <item.icon
                    className="h-6 w-6 text-primary-ink"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-display">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier names are surfaced once for screen readers reading the hero stats. */}
      <p className="sr-only">
        Service levels:{" "}
        {destinations[0]?.tiers.map((tier) => tierMeta(tier.key).name).join(", ")}.
      </p>
    </SearchProvider>
  );
}
