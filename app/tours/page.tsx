import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { SearchProvider } from "@/components/marketplace/search-provider";
import { BrowseView } from "@/components/marketplace/browse-view";
import { ExperienceGrid } from "@/components/marketplace/experience-grid";
import { PhotoBand } from "@/components/visual/photo-band";

export const metadata: Metadata = {
  title: "All destinations",
  description:
    "Browse every Tour-Boda route in Uganda. Filter by district, experience type, date and budget, and compare the three service levels on each one.",
};

export default function ToursPage() {
  return (
    <div>
      <PageHeader
        eyebrow="The marketplace"
        title="All destinations"
        lead="Guided rides across Uganda, each led by a local boda driver who knows the road. Every route sells three ways — self-guided, guided, or the full package."
        aside={
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline break-words">
            <div className="bg-card px-3 py-3 sm:px-5 sm:py-3.5">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Destinations
              </dt>
              <dd
                data-readout
                className="mt-1.5 font-display text-2xl font-semibold leading-none text-foreground"
              >
                {String(destinations.length).padStart(2, "0")}
              </dd>
            </div>
            <div className="bg-card px-3 py-3 sm:px-5 sm:py-3.5">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Guides
              </dt>
              <dd
                data-readout
                className="mt-1.5 font-display text-2xl font-semibold leading-none text-foreground"
              >
                {String(guides.length).padStart(2, "0")}
              </dd>
            </div>
          </dl>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <SearchProvider>
          <BrowseView />

          {/* Browsing by picture is often faster than browsing by filter. */}
          <section
            className="mt-16 border-t border-hairline pt-14"
            aria-labelledby="tours-experience-heading"
          >
            <SectionHeading
              id="tours-experience-heading"
              eyebrow="Or start from the kind of day"
              title="Eight ways to see Uganda"
              lead="Pick one and the results above filter to it."
            />
            <ExperienceGrid />
          </section>
        </SearchProvider>
      </div>

      <PhotoBand
        image="/images/brand-boda-rank.jpg"
        alt="Rows of boda-boda motorcycles waiting at a staging point"
        eyebrow="The fleet"
        title="Every rider on this list is licensed, vetted, and on the road this week"
        body="Not a directory of people who once drove somewhere. Each profile carries the authority that issued the licence, the number, and the date we last checked it in person."
        height="short"
      />
    </div>
  );
}
