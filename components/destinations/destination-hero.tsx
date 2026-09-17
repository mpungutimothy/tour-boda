import type { Destination } from "@/types/destination";
import {
  InstrumentCluster,
  Readout,
  ScrimTag,
} from "@/components/instrument/readouts";

/**
 * Instrument-cluster hero: the route's real figures presented the way a bike
 * presents them — distance, duration, departure, conditions.
 *
 * Server component: the reveal is CSS-only (see the reduced-motion block in
 * globals.css), so this ships no JavaScript.
 */
export function DestinationHero({ destination }: { destination: Destination }) {
  const hero = destination.images[0];

  const fact = (label: string) =>
    destination.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())
      ?.value;

  const candidates = [
    { label: "Distance", value: fact("Total distance"), tone: "data" as const },
    { label: "Duration", value: fact("Duration"), tone: "signal" as const },
    { label: "Departs", value: fact("Starting point"), tone: "default" as const },
    { label: "Conditions", value: fact("Best time"), tone: "default" as const },
  ];
  const readouts = candidates.filter(
    (r): r is { label: string; value: string; tone: "default" | "signal" | "data" } =>
      typeof r.value === "string" && r.value.length > 0,
  );

  return (
    <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden">
      {/* Windscreen: the road ahead. */}
      <div className="absolute inset-0 -z-10">
        {hero ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero.url}
            alt={hero.caption || destination.name}
            className="h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/70 to-scrim/25" />
        <div className="pointer-events-none absolute inset-0 glow-mesh opacity-70" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pb-14">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <ScrimTag tone="signal">{destination.category}</ScrimTag>
            <ScrimTag>{destination.location.region}</ScrimTag>
          </div>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-display text-on-scrim sm:text-6xl lg:text-7xl">
            {destination.name}
          </h1>

          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-on-scrim/70">
            Guide <span className="text-on-scrim">{destination.author.name}</span>
          </p>
        </div>

        {/* The cluster. */}
        <div className="mt-10 border-t border-on-scrim/20 pt-6">
          <InstrumentCluster onScrim>
            {readouts.map((readout, i) => (
              <div
                key={readout.label}
                className="animate-readout-in"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Readout
                  onScrim
                  label={readout.label}
                  value={readout.value}
                  tone={readout.tone}
                />
              </div>
            ))}
          </InstrumentCluster>
        </div>
      </div>
    </section>
  );
}
