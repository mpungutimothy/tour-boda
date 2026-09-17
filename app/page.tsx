import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InstrumentCluster,
  Readout,
  SectionMark,
} from "@/components/instrument/readouts";
import { CountUp, CountUpCurrency } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { RouteLine } from "@/components/motion/route-line";
import {
  ArrowRight,
  MapPin,
  Compass,
  CreditCard,
  Bike,
  ShieldCheck,
  Users,
  Wallet,
  Heart,
  Locate,
} from "lucide-react";

const heroImage =
  "https://images.pexels.com/photos/38520450/pexels-photo-38520450.jpeg?auto=compress&cs=tinysrgb&w=1920";

const howItWorks = [
  {
    icon: Compass,
    title: "Choose your route",
    desc: "Filter by region, duration or price. Every listing states the real distance and the honest catch.",
  },
  {
    icon: CreditCard,
    title: "Book in shillings",
    desc: "Reserve online at local rates. The price you see is the price you pay.",
  },
  {
    icon: Bike,
    title: "Ride with your guide",
    desc: "Your rider picks you up. Licensed, and on this road most days of the week.",
  },
];

const intentPrompts = [
  { icon: Wallet, question: "What can I do this Saturday with UGX 50,000?" },
  { icon: Locate, question: "Somewhere within 20 km of me" },
  { icon: Heart, question: "A quiet half-day, no crowds" },
];

const whyTourBoda = [
  {
    icon: ShieldCheck,
    title: "Safety",
    desc: "Every guide carries a spare helmet and a first-aid kit. You ride with someone who has done this road a hundred times.",
  },
  {
    icon: Users,
    title: "Local guides",
    desc: "Our riders grew up here. They know the woman who sells the best rolex at Nakawa, and which pothole floods first.",
  },
  {
    icon: Wallet,
    title: "Fair prices",
    desc: "You pay in shillings at local rates. No tourist markup, no hidden fees.",
  },
];

/** Read a key fact off a destination without hardcoding any figure. */
function factOf(d: (typeof destinations)[number], label: string) {
  return d.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;
}

export default function Home() {
  const routeCount = destinations.length;
  const guideCount = guides.length;
  const fromPrice = Math.min(
    ...destinations.flatMap((d) => d.tiers.map((t) => t.price)),
  );

  return (
    <>
      {/* ── Dawn: the instrument cluster ─────────────────────────────── */}
      <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Boda boda riders on a road in Uganda with mountains behind"
            className="duotone h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-primary/12 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/75 to-scrim/30" />
          <div className="pointer-events-none absolute inset-0 glow-mesh opacity-70" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <div className="max-w-3xl">
            <span className="telemetry text-on-scrim/60">
              Kampala · Jinja · Entebbe
            </span>

            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.94] tracking-display text-on-scrim sm:text-6xl lg:text-7xl">
              Ride Uganda with a guide who knows every road
            </h1>

            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-on-scrim/80 sm:text-lg">
              Local boda-boda riders take you to the places a coach bus cannot
              reach — and tell you the truth about the road on the way.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                <Link href="#featured-routes">See the routes</Link>
              </Button>
            </div>
          </div>

          {/* Live figures — all derived from the published data. */}
          <div className="mt-12 border-t border-on-scrim/20 pt-6">
            <InstrumentCluster onScrim>
              <Readout
                onScrim
                label="Routes"
                value={<CountUp value={routeCount} />}
                tone="data"
              />
              <Readout
                onScrim
                label="Local guides"
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
                label="Booking fees"
                value={<CountUp value={0} pad={1} durationMs={600} />}
                hint="No markup, ever"
              />
            </InstrumentCluster>
          </div>
        </div>
      </section>

      {/* ── Dawn cont.: the routes as route cards ────────────────────── */}
      <section
        id="featured-routes"
        className="border-t border-hairline"
        aria-labelledby="featured-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="01">Featured routes</SectionMark>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2
              id="featured-heading"
              className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
            >
              Three rides, three regions
            </h2>
            <Button asChild variant="link" className="shrink-0 px-0">
              <Link href="/tours">
                All routes
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => {
              const price = Math.min(...d.tiers.map((t) => t.price));
              return (
                <Reveal key={d.id} delay={i * 90} className="h-full">
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="group card-glow glass flex h-full flex-col overflow-hidden rounded-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.images[0]?.url}
                        alt={d.images[0]?.caption ?? d.name}
                        className="duotone h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-primary/12 mix-blend-overlay"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-scrim/90 to-transparent" />

                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-on-scrim/25 bg-scrim/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim backdrop-blur-sm">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {d.category}
                      </span>

                      {/* Route progress track — position within the network. */}
                      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2.5">
                        <span className="track-dots relative block h-[3px] flex-1">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full bg-primary"
                            style={{ width: `${((i + 1) / routeCount) * 100}%` }}
                          />
                        </span>
                        <span
                          data-readout
                          className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim"
                        >
                          {String(i + 1).padStart(2, "0")}/{String(routeCount).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-xl font-semibold leading-tight tracking-display">
                        {d.name}
                      </h3>

                      <p className="mt-2 flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                        {d.location.region}
                      </p>

                      {/* Real route figures, in place of the invented rating. */}
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-4">
                        <div>
                          <dt className="telemetry text-muted-foreground">Distance</dt>
                          <dd data-readout className="mt-1 font-mono text-sm text-primary">
                            {factOf(d, "Total distance") ?? "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="telemetry text-muted-foreground">Duration</dt>
                          <dd data-readout className="mt-1 font-mono text-sm">
                            {factOf(d, "Duration") ?? "—"}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4">
                        <span data-readout className="font-mono text-sm font-semibold text-primary">
                          From {price.toLocaleString("en-UG")}
                          <span className="ml-1 text-[0.625rem] uppercase tracking-wider text-muted-foreground">
                            UGX
                          </span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-all group-hover:gap-2 group-hover:text-primary">
                          Open
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section
        className="border-y border-hairline bg-background text-foreground"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="02">How it works</SectionMark>
          <h2
            id="how-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Three steps from idea to road
          </h2>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <li key={step.title} className="bg-background p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase tracking-[0.02em]">
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

      {/* ── Intent ───────────────────────────────────────────── */}
      <section
        className="bg-background text-foreground"
        aria-labelledby="intent-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="03">Start from your plan</SectionMark>
          <h2
            id="intent-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            What are you looking for?
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {intentPrompts.map((prompt) => (
              <Link
                key={prompt.question}
                href="/tours"
                className="group flex items-start gap-4 rounded-lg border border-hairline bg-card p-6 transition-colors hover:border-primary/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <prompt.icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-base font-semibold leading-snug">
                    {prompt.question}
                  </span>
                  <span className="mt-2 flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary transition-all group-hover:gap-2">
                    Browse routes
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────── */}
      <section
        className="border-t border-hairline bg-background text-foreground"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionMark index="04">Why Tour-Boda</SectionMark>
          <h2
            id="why-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Three things we get right
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {whyTourBoda.map((item) => (
              <div key={item.title} className="border-t-2 border-primary/70 pt-5">
                <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-[0.02em]">
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

      {/* ── Dusk: close ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-hairline bg-scrim">
        <div className="paper-grain mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionMark index="05">
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
        </div>
      </section>
    </>
  );
}
