import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides, totalTripsLed, averageRating } from "@/data/guides";
import { tierMeta } from "@/data/tiers";
import { TRAVELLER_FEES } from "@/data/revenue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstrumentCluster, Readout, SectionMark } from "@/components/instrument/readouts";
import { CountUp, CountUpCurrency } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { SearchProvider } from "@/components/marketplace/search-provider";
import { SearchBar } from "@/components/marketplace/search-bar";
import { QuickPicks } from "@/components/marketplace/quick-picks";
import { ResultsGrid } from "@/components/marketplace/results-grid";
import { TierLegend } from "@/components/marketplace/tier-ui";
import { RevenueModel, RevenueSummaryStrip } from "@/components/marketplace/revenue-model";
import { PartnerRail } from "@/components/marketplace/partners-section";
import { GuideCard } from "@/components/marketplace/guide-card";
import {
  ArrowRight,
  Bike,
  Compass,
  CreditCard,
  Plus,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

const heroImage =
  "https://images.pexels.com/photos/38520450/pexels-photo-38520450.jpeg?auto=compress&cs=tinysrgb&w=1920";

/** The marketplace journey, in the order a traveller actually does it. */
const howItWorks = [
  {
    icon: Compass,
    title: "Search and compare",
    desc: "Filter by place, date, group type and budget. Every route shows three service levels side by side, priced in shillings.",
  },
  {
    icon: CreditCard,
    title: "Book and pay",
    desc: "Pick a date and party size, add extras, and pay by MTN or Airtel Money or card. The price you see is the price you pay.",
  },
  {
    icon: Bike,
    title: "Ride with your guide",
    desc: "Your rider picks you up. Licensed, vetted, and on this road most days of the week.",
  },
];

const whyTourBoda = [
  {
    icon: ShieldCheck,
    title: "Vetted, not just listed",
    desc: "Every guide holds a district or city authority licence, and is re-verified in person. The licence number is on the profile.",
  },
  {
    icon: Users,
    title: "Local guides",
    desc: "Our riders grew up here. They know the woman who sells the best rolex at Nakawa, and which pothole floods first.",
  },
  {
    icon: Wallet,
    title: "Sixty per cent to the road",
    desc: "The operator and guide take the majority of every booking. The split is published, not implied.",
  },
];

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

  return (
    <SearchProvider>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            className="duotone h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-primary/16 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/80 to-scrim/40" />
          <div className="pointer-events-none absolute inset-0 glow-mesh opacity-70" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="max-w-3xl">
            <span className="telemetry text-on-scrim/60">
              Kampala · Jinja · Entebbe · Mbale · Fort Portal
            </span>

            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.94] tracking-display-lg text-on-scrim sm:text-6xl lg:text-7xl">
              Ride Uganda with a guide who knows every road
            </h1>

            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-on-scrim/85 sm:text-lg">
              Local boda-boda riders take you to the places a coach bus cannot
              reach — and tell you the truth about the road on the way.
            </p>
          </div>

          {/* Live figures — every one derived from the published catalogue. */}
          <div className="mt-10 border-t border-on-scrim/20 pt-6">
            <InstrumentCluster onScrim>
              <Readout
                onScrim
                label="Routes"
                value={<CountUp value={routeCount} />}
                tone="data"
              />
              <Readout
                onScrim
                label="Service levels"
                value={<CountUp value={3} />}
                hint="Every route, three tiers"
              />
              <Readout
                onScrim
                label="Vetted guides"
                value={<CountUp value={guideCount} />}
              />
              <Readout
                onScrim
                label="From"
                value={<CountUpCurrency value={fromPrice} />}
                unit="UGX"
                tone="signal"
              />
              <Readout
                onScrim
                label="Booking fee"
                value={<CountUp value={TRAVELLER_FEES.bookingFee} pad={1} durationMs={600} />}
                hint="Paid by us, not you"
              />
            </InstrumentCluster>
          </div>
        </div>
      </section>

      {/* ── Search: the marketplace itself ───────────────────────────── */}
      <section
        id="search"
        className="relative border-b border-hairline bg-background"
        aria-labelledby="search-heading"
      >
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <h2 id="search-heading" className="sr-only">
            Search tours
          </h2>

          {/* Pulled up over the hero edge so the filter bar is above the fold. */}
          <div className="relative -mt-20 sm:-mt-24">
            <SearchBar className="shadow-xl" />
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="telemetry text-primary">01</span>
              <span className="h-px flex-1 bg-hairline" />
              <span className="telemetry text-muted-foreground">
                Start from your plan
              </span>
            </div>
            <QuickPicks />
          </div>
        </div>
      </section>

      {/* ── Live results ─────────────────────────────────────────────── */}
      <section
        id="results"
        className="border-b border-hairline"
        aria-labelledby="results-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionMark index="02">
            <span id="results-heading">
              {routeCount} rides across {districtCount} districts
            </span>
          </SectionMark>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl">
              Routes that match your filters
            </h2>
            <Button asChild variant="link" className="shrink-0 px-0">
              <Link href="/tours">
                Open the full marketplace
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ResultsGrid />

          {/* The three service levels, explained once, above the fold of results. */}
          <div className="mt-12">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-xl font-semibold tracking-display">
                Every route sells three ways
              </h3>
              <p className="max-w-xl font-sans text-xs leading-relaxed text-muted-foreground">
                Same road, same rider, three levels of service. Pick the level on
                any card and the price changes with it.
              </p>
            </div>
            <TierLegend />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section
        className="border-b border-hairline bg-background text-foreground"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="03">How it works</SectionMark>
          <h2
            id="how-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Three steps from idea to road
          </h2>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="bg-background p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <step.icon
                    className="h-5 w-5 text-primary"
                    strokeWidth={1.5}
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
      </section>

      {/* ── The model ────────────────────────────────────────────────── */}
      <section
        id="model"
        className="relative overflow-hidden border-b border-hairline"
        aria-labelledby="model-heading"
      >
        <div
          aria-hidden
          className="glow-accent pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="04">The model</SectionMark>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2
                id="model-heading"
                className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
              >
                Where the money goes
              </h2>
              <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
                One price, split three ways. The rider and guide take the
                majority, the destination that delivers the day is paid
                directly, and the platform keeps the rest to run the system.
              </p>
            </div>
            <RevenueSummaryStrip className="shrink-0" />
          </div>

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
      </section>

      {/* ── Guides ───────────────────────────────────────────────────── */}
      <section
        className="border-b border-hairline bg-background"
        aria-labelledby="guides-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="05">Meet your guides</SectionMark>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="guides-heading"
                className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
              >
                The person who actually rides with you
              </h2>
              <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
                <span data-readout className="font-mono text-foreground">
                  {averageRating().toFixed(1)}
                </span>{" "}
                average rating across{" "}
                <span data-readout className="font-mono text-foreground">
                  {totalTripsLed().toLocaleString("en-UG")}
                </span>{" "}
                completed trips. Licence numbers and vetting dates are on every
                profile.
              </p>
            </div>
            <Button asChild variant="link" className="shrink-0 px-0">
              <Link href="/guides">
                All {guideCount} guides
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 3).map((guide) => (
              <Reveal key={guide.id} className="h-full">
                <GuideCard guide={guide} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────────────── */}
      <section
        className="border-b border-hairline bg-background text-foreground"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="06">Why Tour-Boda</SectionMark>
          <h2
            id="why-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Three things we get right
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {whyTourBoda.map((item) => (
              <div key={item.title} className="border-t-2 border-primary/70 pt-5">
                <item.icon
                  className="h-6 w-6 text-primary"
                  strokeWidth={1.5}
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
      </section>

      {/* ── Partners ─────────────────────────────────────────────────── */}
      <section
        className="border-b border-hairline bg-background"
        aria-labelledby="partners-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionMark index="07">In partnership with</SectionMark>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <h2
              id="partners-heading"
              className="max-w-2xl font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl"
            >
              Guide associations, rider groups, and the sites themselves
            </h2>
            <Button asChild variant="link" className="shrink-0 px-0">
              <Link href="/how-it-works#partners">
                The full ecosystem
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <PartnerRail />
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-hairline bg-scrim">
        <div className="paper-grain mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionMark index="08">
            <span className="text-on-scrim/60">Trip ideas</span>
          </SectionMark>
          <h2 className="font-display text-4xl font-bold leading-[0.98] tracking-display text-on-scrim sm:text-5xl">
            Find your Uganda
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-base leading-relaxed text-on-scrim/75">
            One email a month with new routes, seasonal conditions, and guides
            who just joined.
          </p>

          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="trip-ideas-email" className="sr-only">
              Email address
            </label>
            <Input
              id="trip-ideas-email"
              type="email"
              placeholder="you@example.com"
              required
              className="border-on-scrim/25 bg-on-scrim/5 text-on-scrim placeholder:text-on-scrim/40"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Get trip ideas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-on-scrim/50">
            One email a month. Unsubscribe anytime.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-on-scrim/15 pt-8">
            <Button asChild size="lg">
              <Link href="/tours">
                Find your ride
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-on-scrim/30 bg-on-scrim/10 text-on-scrim hover:bg-on-scrim/20 hover:text-on-scrim"
            >
              <Link href="/book/custom-destination-tour">
                <Plus className="mr-2 h-4 w-4" aria-hidden />
                Build a custom route
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tier names are surfaced once for screen readers reading the hero stats. */}
      <p className="sr-only">
        Service levels: {destinations[0]?.tiers.map((tier) => tierMeta(tier.key).name).join(", ")}.
      </p>
    </SearchProvider>
  );
}
