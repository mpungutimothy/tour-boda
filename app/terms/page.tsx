import type { Metadata } from "next";
import Link from "next/link";
import { TRAVELLER_FEES } from "@/data/revenue";
import { PROTOTYPE_NOTICE } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "How pricing, cancellation and rain days work on the Tour-Boda prototype.",
};

/**
 * Terms.
 *
 * Kept to the handful of commitments a traveller actually asks about — what the
 * price includes, when a booking can still be cancelled, and what happens when
 * it rains — because a page of unread boilerplate is worse than a short page
 * that answers the three real questions.
 */
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">02</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Legal</span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
        Booking terms
      </h1>

      <p className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.07] p-4 font-sans text-sm leading-relaxed text-primary-ink">
        This is a prototype. Bookings made here are simulated, no payment is
        taken, and no ride is dispatched.
      </p>

      <div className="mt-10 space-y-8 font-sans text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            The price you see
          </h2>
          <p className="mt-3">
            Every route is quoted in Ugandan shillings, and the figure shown on a
            card is the figure the booking step produces for the same tier and
            the same party. There is no booking fee for the traveller
            {TRAVELLER_FEES.bookingFee === 0
              ? " — the platform's share comes out of the operator's side, not yours"
              : ""}
            . Value Added Tax is shown as its own line rather than folded into
            the headline price, so the split is legible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            What each service level includes
          </h2>
          <p className="mt-3">
            The three levels are cumulative. Boda Freelance is transport with a
            licensed rider; Guided Tour adds the guide and the commentary;
            Experience Tour adds meals, entries and the add-ons. Each tier states
            its own inclusions and exclusions on the route page, and the booking
            step lets you remove the components that can be removed and prices
            the difference immediately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Cancellation and lead time
          </h2>
          <p className="mt-3">
            Each route publishes a minimum notice period, and the booking step
            enforces it before it will take a date. Cancelling inside that window
            releases the rider's day, which is why the window exists — a boda
            rider who has turned down other work for your date has already lost
            the income.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Rain, and days that do not work
          </h2>
          <p className="mt-3">
            Ugandan afternoon rain is short and heavy. Rides pause under shelter
            and resume; a pause is not a cancellation. For community-hosted
            routes the opposite applies: if the village has a funeral or a
            harvest, the day is rearranged or cancelled and refunded in full,
            because the village is not a set.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Safety
          </h2>
          <p className="mt-3">
            Helmets are provided and required by Ugandan law. Every guide listed
            holds a district or city authority licence and is re-verified in
            person. Two riders per boda is the limit; larger parties are quoted
            across several bikes automatically.
          </p>
        </section>
      </div>

      <p className="mt-12 rounded-lg border border-hairline bg-background/60 p-3.5 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
        <span className="font-mono uppercase tracking-[0.14em] text-primary-ink">
          {PROTOTYPE_NOTICE.label}.
        </span>{" "}
        {PROTOTYPE_NOTICE.detail}
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary-ink"
        >
          ← Back to the marketplace
        </Link>
      </div>
    </div>
  );
}
