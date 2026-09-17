import Link from "next/link";
import type { Destination } from "@/types/destination";
import { ArrowRight } from "lucide-react";
import { formatUGX } from "@/lib/motion";

/** Departure board: the other routes on the network. */
export function RelatedDestinations({
  destinations,
  currentId,
}: {
  destinations: Destination[];
  currentId: string;
}) {
  const related = destinations.filter((d) => d.id !== currentId);
  if (related.length === 0) return null;

  const factOf = (d: Destination, label: string) =>
    d.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;

  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="telemetry text-primary">06</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="telemetry text-muted-foreground">Also on the network</span>
        </div>

        <h2 className="mb-8 font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
          Other routes
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {related.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group card-glow glass flex flex-col overflow-hidden rounded-lg sm:flex-row"
            >
              <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.images[0]?.url}
                  alt={d.images[0]?.caption ?? d.name}
                  loading="lazy"
                  className="duotone h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5">
                <span className="telemetry text-muted-foreground">{d.category}</span>
                <h3 className="mt-1.5 font-display text-lg font-semibold uppercase leading-tight tracking-[0.02em]">
                  {d.name}
                </h3>

                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <dt className="telemetry text-muted-foreground">Dist</dt>
                    <dd data-readout className="font-mono text-xs text-primary">
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

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-3">
                  <span data-readout className="font-mono text-sm font-semibold text-primary">
                    From {formatUGX(Math.min(...d.tiers.map((t) => t.price)))}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-all group-hover:gap-1.5 group-hover:text-primary">
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
