import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { SearchProvider } from "@/components/marketplace/search-provider";
import { BrowseView } from "@/components/marketplace/browse-view";

export const metadata: Metadata = {
  title: "All routes",
  description:
    "Browse every Tour-Boda route in Uganda. Filter by district, experience type, date and budget, and compare the three service levels on each one.",
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Marketplace</span>
      </div>

      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
            All routes
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            Guided rides across Uganda, each led by a local boda driver who knows
            the road. Every route sells three ways — self-guided, guided, or the
            full package.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-hairline px-5 py-3">
          <div className="telemetry text-muted-foreground">In catalogue</div>
          <div
            data-readout
            className="mt-1 font-mono text-2xl font-semibold leading-none text-primary"
          >
            {String(destinations.length).padStart(2, "0")}
            <span className="ml-1 text-xs text-muted-foreground">
              routes · {guides.length} guides
            </span>
          </div>
        </div>
      </div>

      <SearchProvider>
        <BrowseView />
      </SearchProvider>
    </div>
  );
}
