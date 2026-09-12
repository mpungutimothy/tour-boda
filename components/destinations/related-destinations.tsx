import Link from "next/link";
import type { Destination } from "@/types/destination";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatUGX } from "@/lib/motion";

export function RelatedDestinations({ destinations, currentId }: { destinations: Destination[]; currentId: string }) {
  const related = destinations.filter((d) => d.id !== currentId);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-6 font-serif text-xl font-semibold">Other Tours You Might Like</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {related.map((d) => (
          <Link
            key={d.id}
            href={`/destinations/${d.slug}`}
            className="group overflow-hidden rounded-lg border border-border bg-card shadow-warm-sm transition-shadow hover:shadow-warm-md"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.images[0]?.url}
                alt={d.images[0]?.caption ?? d.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <Badge variant="secondary" className="mb-2">{d.category}</Badge>
              <h3 className="font-serif text-lg font-semibold text-ink">{d.name}</h3>
              <p className="mt-1 font-sans text-sm text-muted-foreground">{d.location.region}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-primary">
                  From {formatUGX(Math.min(...d.tiers.map((t) => t.price)))}
                </span>
                <span className="flex items-center gap-1 font-sans text-sm text-primary group-hover:gap-2 transition-all">
                  View Tour
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
