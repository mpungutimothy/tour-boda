import type { Metadata } from "next";
import Link from "next/link";
import { destinations, fromPrice } from "@/data/destinations";
import { guides } from "@/data/guides";
import { REVENUE_SPLIT, TRAVELLER_FEES } from "@/data/revenue";
import { ADD_ONS } from "@/data/add-ons";
import { TIER_META, TIER_ORDER } from "@/data/tiers";
import { PRICING_RULES } from "@/lib/marketplace/pricing";
import { RevenueModel, RevenueSummaryStrip } from "@/components/marketplace/revenue-model";
import { PartnersSection } from "@/components/marketplace/partners-section";
import { TierDot } from "@/components/marketplace/tier-ui";
import { Button } from "@/components/ui/button";
import { SectionMark } from "@/components/instrument/readouts";
import { RouteLine } from "@/components/motion/route-line";
import { formatUGX } from "@/lib/format";
import { ArrowRight, Bike, Coins, CreditCard, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "How the platform works",
  description:
    "The Tour-Boda model: how a booking is priced, how the revenue is split between the boda operator, the destination and the platform, and who we work with.",
};

const PIPELINE = [
  {
    icon: Users,
    title: "Demand",
    body: "Travellers search by district, experience type, date, group and budget. Three service levels on every route mean a price exists for a UGX 60,000 afternoon and for a two-day package.",
  },
  {
    icon: CreditCard,
    title: "Transaction",
    body: "The booking flow quotes an itemised price — party size, solo supplement, group rate, components, add-ons and VAT — then takes payment by mobile money or card. No booking fee is added to the traveller.",
  },
  {
    icon: Bike,
    title: "Fulfilment",
    body: "A vetted guide is assigned, the rider is dispatched, and the trip runs. Payment is released to the operator once the trip ends, not before.",
  },
  {
    icon: Coins,
    title: "Settlement",
    body: "The package is split 60 / 25 / 15 between the operator and guide, the destination that delivered the day, and the platform. Operators are paid by mobile money within 24 hours of the trip ending.",
  },
];

export default function HowItWorksPage() {
  const cheapest = Math.min(
    ...destinations.map((destination) => fromPrice(destination)),
  );

  return (
    <div>
      {/* ---- Header ---- */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="telemetry text-primary">00</span>
            <span className="h-px flex-1 bg-hairline" />
            <span className="telemetry text-muted-foreground">The model</span>
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-display sm:text-5xl">
            A marketplace for the last mile of Ugandan tourism
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            Boda-bodas already move most people around Ugandan towns. This
            platform turns that fleet into licensed, priced, bookable tourism
            capacity — and pays the rider the majority of every booking.
          </p>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-4">
            {[
              { label: "Routes", value: String(destinations.length) },
              { label: "Guides", value: String(guides.length) },
              { label: "Add-ons", value: String(ADD_ONS.length) },
              { label: "From", value: formatUGX(cheapest) },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-4">
                <dt className="telemetry text-muted-foreground">{stat.label}</dt>
                <dd
                  data-readout
                  className="mt-1.5 font-mono text-xl font-bold leading-none text-primary"
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Pipeline ---- */}
      <section
        className="border-b border-hairline bg-background"
        aria-labelledby="pipeline-heading"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionMark index="01">How a booking moves</SectionMark>
          <h2
            id="pipeline-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Four stages, one transaction
          </h2>

          <ol className="mt-10 space-y-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            {PIPELINE.map((stage, index) => (
              <li
                key={stage.title}
                className="flex flex-col gap-4 bg-background p-6 sm:flex-row sm:items-start sm:gap-6"
              >
                <span className="flex shrink-0 items-center gap-3 sm:w-40">
                  <span className="font-mono text-2xl font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <stage.icon
                    className="h-5 w-5 text-primary"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="font-display text-base font-semibold tracking-display">
                    {stage.title}
                  </span>
                </span>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {stage.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Revenue ---- */}
      <section
        className="border-b border-hairline"
        aria-labelledby="revenue-heading"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionMark index="02">Revenue</SectionMark>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2
                id="revenue-heading"
                className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
              >
                The split, on a real package
              </h2>
              <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
                Worked below on the Kampala City Heritage Guided Tour — the
                route&apos;s most-booked level — so the percentages can be
                checked against a price the catalogue actually publishes.
              </p>
            </div>
            <RevenueSummaryStrip className="shrink-0" />
          </div>

          <RevenueModel destinationSlug="kampala-city-heritage" tierKey="guided" />

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
            {REVENUE_SPLIT.map((party) => (
              <div key={party.id} className="bg-background p-5">
                <p className="font-mono text-3xl font-bold leading-none text-primary">
                  {Math.round(party.share * 100)}%
                </p>
                <h3 className="mt-3 font-display text-base font-semibold tracking-display">
                  {party.label}
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
                  {party.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-hairline bg-background/60 p-5">
            <p className="telemetry text-muted-foreground">Traveller fees</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              Booking fee:{" "}
              <span data-readout className="font-mono text-primary">
                {formatUGX(TRAVELLER_FEES.bookingFee)}
              </span>
              . {TRAVELLER_FEES.note}
            </p>
          </div>
        </div>
      </section>

      {/* ---- Pricing rules ---- */}
      <section
        className="border-b border-hairline bg-background"
        aria-labelledby="pricing-heading"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionMark index="03">Pricing</SectionMark>
          <h2
            id="pricing-heading"
            className="max-w-xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            How a price is built
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            Every line in a quote comes from one of these rules, and the booking
            summary names the rule that moved the number.
          </p>

          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
            {[
              {
                title: "Per person, per level",
                body: `Each of the three service levels has its own per-person price. The published figure is for a party of two, which is the baseline the operator priced the route against.`,
              },
              {
                title: `Children at ${PRICING_RULES.childRate * 100}%`,
                body: "Under-12s ride at half the adult rate, and count as half for capacity and for the group threshold.",
              },
              {
                title: `Solo supplement ${PRICING_RULES.privateRideSupplement * 100}%`,
                body: "A single traveller pays for the empty second seat on the bike. It is shown as its own line rather than hidden in the fare.",
              },
              {
                title: `Group rate −${PRICING_RULES.groupDiscountRate * 100}%`,
                body: `Parties of ${PRICING_RULES.groupDiscountMinAdults} or more adult-equivalents get 10% off the package. Multiple bodas are dispatched as needed.`,
              },
              {
                title: "Components move both ways",
                body: "Ask for a licensed guide on a self-guided tier and it is added at cost. Drop meals from a package that includes them and the value comes back off. The ride itself is never removable.",
              },
              {
                title: `VAT at ${PRICING_RULES.vatRate * 100}%, included`,
                body: "Prices are quoted VAT inclusive. The booking summary extracts the VAT portion so it can be accounted for, but never adds it on top.",
              },
            ].map((rule) => (
              <div key={rule.title} className="bg-background p-5">
                <h3 className="font-display text-base font-semibold tracking-display">
                  {rule.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {rule.body}
                </p>
              </div>
            ))}
          </div>

          {/* ---- Tier comparison, the commercial summary ---- */}
          <div className="mt-10 overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">
                What each service level includes
              </caption>
              <thead>
                <tr className="border-b border-hairline bg-surface">
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    Service level
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    Transport
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    Guide
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    Meals
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    Capacity
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIER_ORDER.map((key) => {
                  const meta = TIER_META[key];
                  return (
                    <tr key={key} data-tier={key} className="border-b border-hairline">
                      <th scope="row" className="px-4 py-3 text-left">
                        <span className="flex items-center gap-2">
                          <TierDot tierKey={key} />
                          <span className="font-display text-sm font-semibold tracking-display">
                            {meta.name}
                          </span>
                        </span>
                        <span className="mt-1 block font-sans text-xs font-normal text-muted-foreground">
                          {meta.tagline}
                        </span>
                      </th>
                      <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                        Always — it is the product
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                        {key === "freelance" ? "Optional add-on" : "Included"}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-muted-foreground">
                        {key === "experience" ? "Included" : "Optional add-on"}
                      </td>
                      <td
                        data-readout
                        className="px-4 py-3 font-mono text-xs text-muted-foreground"
                      >
                        1–2 / 3–6 / 3–8 riders
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- Partners ---- */}
      <section
        id="partners"
        className="border-b border-hairline"
        aria-labelledby="partners-heading"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionMark index="04">Ecosystem</SectionMark>
          <h2
            id="partners-heading"
            className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-display sm:text-4xl"
          >
            Who has to say yes for this to work
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            A mobility marketplace lives or dies on institutional permission:
            rider licensing, route access, and the sites and communities that
            deliver the day. Each relationship is listed with where it actually
            stands.
          </p>

          <PartnersSection className="mt-10" />
        </div>
      </section>

      {/* ---- Close ---- */}
      <section className="relative overflow-hidden bg-scrim">
        <div
          aria-hidden
          className="topo pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <RouteLine className="mx-auto h-auto w-full max-w-md" />
          <h2 className="mt-8 font-display text-3xl font-bold leading-tight tracking-display text-on-scrim sm:text-4xl">
            Three regions, one network
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-relaxed text-on-scrim/75">
            Every route is ridden by a local guide who knows the road by name,
            and every booking pays the majority of its value back to the road.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/tours">
                Browse the marketplace
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-on-scrim/30 bg-on-scrim/10 text-on-scrim hover:bg-on-scrim/20 hover:text-on-scrim"
            >
              <Link href="/guides">Meet the guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
