import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import { PartnerRail } from "@/components/marketplace/partners-section";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tour-Boda Uganda connects travellers with local boda-boda guides for authentic, personalized tours. Learn who we are and why we exist.",
};

const aboutImage =
  "https://images.pexels.com/photos/38520450/pexels-photo-38520450.jpeg?auto=compress&cs=tinysrgb&w=1920";

const sections = [
  {
    index: "01",
    title: "Who we are",
    body: "Tour-Boda was started in 2024 by two Ugandans who were tired of watching tourists get herded onto buses and charged twice what a ride should cost. We knew the boda riders in our neighbourhoods — the ones who had been driving the same roads for ten, fifteen, twenty years — and we knew they were being left out of the tourism economy entirely. So we built something that puts them first. A rider joins our platform, we meet them in person, we ride with them once to check the route, and then their tours go live. That is the whole vetting process. No franchise fees, no tourism degree required, no middleman skimming off the top.",
  },
  {
    index: "02",
    title: "Why we exist",
    body: "The standard tourist experience in Uganda follows a script: a hotel desk books you a minibus, the minibus takes you to four places in three hours, and you leave having seen the inside of a vehicle more than the country. The driver is paid a flat wage and the company takes the margin. We think there is a better way. A boda ride puts you in the air, on the road, next to the people selling mangoes and the kids waving from fences. The guide is the person doing the driving — not someone reporting to a dispatcher — and the money you pay goes to them, not to a booking office in another city. That is the whole point.",
  },
  {
    index: "03",
    title: "Who we work with",
    body: "Every rider on our platform is licensed by the Kampala Capital City Authority or the relevant district council. They carry a spare helmet and a first-aid kit. They have done the route they are guiding at least fifty times — not a number we picked for marketing, but the point where someone stops needing to check a map. Some of our guides are former wildlife rangers. One studied tourism at Makerere. Another spent six years as a fishing boat hand on Lake Victoria before switching to a boda. They are not generic tour guides. They are people who grew up on the roads they ride, and that is the difference you feel on the back of the bike.",
  },
  {
    index: "04",
    title: "How we keep prices fair",
    body: "We price every tour in Ugandan shillings at local rates. The figure you see on a tour page is the figure you pay — no tourist markup, no dollar conversion that quietly inflates at checkout, no surprise fuel surcharge. The guide sets the price with us based on distance, fuel, and time, and we take a small percentage to keep the website running. If a tour costs UGX 85,000, the rider gets the lion's share of 85,000 shillings. That is how it should work, and in our experience, it is how most riders and most travellers want it to work.",
  },
  {
    index: "05",
    title: "How the money is split",
    body: "Every booking is split three ways. The boda operator and the guide share 60%, the destination or community that actually delivers the day receives 25%, and the platform keeps 15% to run the booking system, vet the guides and administer insurance. On the cheapest route we publish — a UGX 60,000 Entebbe afternoon — the rider still takes more than a third of the ticket. The traveller pays one price and no booking fee; the platform's share comes out of the package, not on top of it.",
  },
  {
    index: "06",
    title: "Who we work with",
    body: "None of this runs on our own authority. Riders are licensed by the city or district authority and vetted against the Uganda Tour Guides Association's standards. Route access depends on the sites themselves — the Buganda Kingdom's clan elders at Kasubi Tombs, the Uganda Wildlife Education Centre, the Sipi Falls Guides Association, the Kibale community tourism group. Each of those relationships is listed on our model page with an honest note of where it currently stands, including the ones still only under discussion.",
  },
];

export default function AboutPage() {
  const routeCount = destinations.length;

  return (
    <div>
      {/* Header — night road */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="telemetry text-primary">00</span>
            <span className="h-px flex-1 bg-hairline" />
            <span className="telemetry text-muted-foreground">Who we are</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
            About Tour-Boda
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            A small team connecting travellers with local boda-boda drivers across
            Uganda. No office towers, no call centres — just riders who know the
            road and a booking system that pays them fairly.
          </p>
        </div>
      </section>

      {/* Body — reading band */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div style={{ maxWidth: "65ch" }}>
            {sections.map((section, i) => (
              <div key={section.title} className={i > 0 ? "mt-12" : undefined}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="telemetry text-primary">{section.index}</span>
                  <span className="h-px flex-1 bg-hairline" />
                </div>
                <h2 className="mb-3 font-display text-2xl font-bold tracking-display">
                  {section.title}
                </h2>
                <p className="font-sans text-[1.0625rem] leading-[1.75] text-muted-foreground">
                  {section.body}
                </p>

                {/* Image break sits after the first section. */}
                {i === 0 ? (
                  <figure className="my-12">
                    <div className="overflow-hidden rounded-lg border border-hairline">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={aboutImage}
                        alt="Boda boda riders on a road in Uganda with mountains in the background"
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="max-w-[58ch] font-sans text-sm text-muted-foreground">
                        Boda riders on the Jinja Road. Most of our guides have been
                        on these routes for over a decade.
                      </p>
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                        Jinja Road
                      </span>
                    </figcaption>
                  </figure>
                ) : null}
              </div>
            ))}
          </div>

          {/* Ecosystem */}
          <div className="mt-14 border-t border-hairline pt-8" style={{ maxWidth: "65ch" }}>
            <div className="mb-3 flex items-center gap-3">
              <span className="telemetry text-primary">07</span>
              <span className="h-px flex-1 bg-hairline" />
              <span className="telemetry text-muted-foreground">Ecosystem</span>
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold tracking-display">
              In partnership with
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-muted-foreground">
              Institutional permission is what makes a mobility marketplace
              legal and repeatable. These are the relationships it depends on.
            </p>
            <PartnerRail />
            <Button asChild variant="link" className="mt-4 px-0">
              <Link href="/how-it-works#partners">
                Every relationship, with its status
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>

          {/* CTA */}
          <div
            className="mt-14 flex flex-col items-start gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between"
            style={{ maxWidth: "65ch" }}
          >
            <div>
              <h2 className="font-display text-xl font-bold tracking-display">
                Ready to ride?
              </h2>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {routeCount} routes, led by guides who know every road on them.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/tours">
                See the routes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
