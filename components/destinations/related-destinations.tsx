import Link from "next/link";
import type { Destination } from "@/types/destination";
import { fromPrice } from "@/data/destinations";
import { tierMeta } from "@/data/tiers";
import { formatUGX } from "@/lib/format";
import { TierDot } from "@/components/marketplace/tier-ui";
import { ArrowRight } from "lucide-react";

/** Departure board: the other routes on the network. */
export function RelatedDestinations({
  destinations,
  currentId,
}: {
  destinations: Destination[];
  currentId: string;
}) {
  const related = destinations.filter((d) => d.id !== currentId).slice(0, 3);
  if (related.length === 0) return null;

  const factOf = (d: Destination, label: string) =>
    d.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="telemetry text-primary-ink">07</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="telemetry text-muted-foreground">
            Also on the network
          </span>
        </div>

        <h2 className="mb-8 font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
          Other routes
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group card-glow glass flex flex-col overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.images[0]?.url}
                  alt={d.images[0]?.caption ?? d.name}
                  loading="lazy"
                  className="duotone h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-primary/[0.12] mix-blend-overlay"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5">
                <span className="telemetry text-muted-foreground">
                  {d.category}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight tracking-display">
                  {d.name}
                </h3>

                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <dt className="telemetry text-muted-foreground">Dist</dt>
                    <dd data-readout className="font-mono text-xs text-primary-ink">
                      {factOf(d, "Total distance") ?? "—"}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <dt className="telemetry text-muted-foreground">Time</dt>
                    <dd data-readout className="font-mono text-xs">
                      {factOf(d, "Duration") ?? "—"}
                    </dd>
                  </div>
                </dl>

                {/* Three-tier prices, all visible. */}
                <ul className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-hairline bg-hairline">
                  {d.tiers.map((tier) => (
                    <li
                      key={tier.key}
                      data-tier={tier.key}
                      className="bg-card px-2 py-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <TierDot tierKey={tier.key} />
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted-foreground">
                          {tierMeta(tier.key).shortLabel}
                        </span>
                      </span>
                      <span
                        data-readout
                        className="mt-1 block font-mono text-[0.6875rem] font-semibold tier-text"
                      >
                        {formatUGX(tier.price)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-3">
                  <span data-readout className="font-mono text-sm font-semibold text-primary-ink">
                    From {formatUGX(fromPrice(d))}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-all group-hover:gap-1.5 group-hover:text-primary-ink">
                    Open
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
