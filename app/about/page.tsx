import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Tour-Boda Uganda connects travellers with local boda-boda guides for authentic, personalized tours. Learn who we are and why we exist.",
};

const aboutImage =
  "https://images.pexels.com/photos/38520450/pexels-photo-38520450.jpeg?auto=compress&cs=tinysrgb&w=1920";

export default function AboutPage() {
  return (
    <div>
      {/* Page header */}
      <section className="paper-grain border-b border-border/40 bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">About Tour-Boda</h1>
          <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground">
            We are a small team connecting travellers with local boda-boda drivers across Uganda.
            No office towers, no call centres — just riders who know the road and a booking system
            that pays them fairly.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div style={{ maxWidth: "65ch" }} className="space-y-6">
          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">Who we are</h2>
            <p className="font-sans text-[1.0625rem] leading-[1.75] text-ink/90">
              Tour-Boda was started in 2024 by two Ugandans who were tired of watching tourists get
              herded onto buses and charged twice what a ride should cost. We knew the boda riders
              in our neighbourhoods — the ones who had been driving the same roads for ten, fifteen,
              twenty years — and we knew they were being left out of the tourism economy entirely.
              So we built something that puts them first. A rider joins our platform, we meet them in
              person, we ride with them once to check the route, and then their tours go live. That is
              the whole vetting process. No franchise fees, no tourism degree required, no middleman
              skimming off the top.
            </p>
          </div>

          {/* Image break */}
          <figure className="my-10 overflow-hidden rounded-lg shadow-warm-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutImage}
              alt="Boda boda riders on a road in Uganda with mountains in the background"
              className="h-full w-full object-cover"
            />
            <figcaption className="bg-card px-4 py-3">
              <p className="font-sans text-sm text-ink">
                Boda riders on the Jinja Road. Most of our guides have been on these routes for over a decade.
              </p>
            </figcaption>
          </figure>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">Why we exist</h2>
            <p className="font-sans text-[1.0625rem] leading-[1.75] text-ink/90">
              The standard tourist experience in Uganda follows a script: a hotel desk books you a
              minibus, the minibus takes you to four places in three hours, and you leave having
              seen the inside of a vehicle more than the country. The driver is paid a flat wage and
              the company takes the margin. We think there is a better way. A boda ride puts you in
              the air, on the road, next to the people selling mangoes and the kids waving from
              fences. The guide is the person doing the driving — not someone reporting to a
              dispatcher — and the money you pay goes to them, not to a booking office in another
              city. That is the whole point.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">Who we work with</h2>
            <p className="font-sans text-[1.0625rem] leading-[1.75] text-ink/90">
              Every rider on our platform is licensed by the Kampala Capital City Authority or the
              relevant district council. They carry a spare helmet and a first-aid kit. They have
              done the route they are guiding at least fifty times — not a number we picked for
              marketing, but the point where someone stops needing to check a map. Some of our guides
              are former wildlife rangers. One studied tourism at Makerere. Another spent six years as
              a fishing boat hand on Lake Victoria before switching to a boda. They are not generic
              tour guides. They are people who grew up on the roads they ride, and that is the
              difference you feel on the back of the bike.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">How we keep prices fair</h2>
            <p className="font-sans text-[1.0625rem] leading-[1.75] text-ink/90">
              We price every tour in Ugandan shillings at local rates. The figure you see on a tour
              page is the figure you pay — no tourist markup, no dollar conversion that quietly
              inflates at checkout, no surprise fuel surcharge. The guide sets the price with us
              based on distance, fuel, and time, and we take a small percentage to keep the website
              running. If a tour costs UGX 85,000, the rider gets the lion&apos;s share of 85,000
              shillings. That is how it should work, and in our experience, it is how most riders and
              most travellers want it to work.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 border-t border-border/60 pt-8" style={{ maxWidth: "65ch" }}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold text-ink">Ready to ride?</h3>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                Browse six tours led by guides who know every road on the route.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/tours">
                See the tours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
