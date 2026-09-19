import type { Metadata } from "next";
import Link from "next/link";
import { PROTOTYPE_NOTICE } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the Tour-Boda prototype does and does not do with your data.",
};

/**
 * Privacy notice.
 *
 * Written to be literally true of this build. There is no analytics, no cookie
 * banner and no server, so the honest answer to "what happens to what I type"
 * is "nothing leaves the page" — and saying that plainly is more credible in a
 * pitch than boilerplate imported from a template.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Legal</span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
        Privacy
      </h1>

      <p className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.07] p-4 font-sans text-sm leading-relaxed text-primary-ink">
        This is a prototype. It has no server, no database and no analytics.
        Nothing you type into it is transmitted anywhere or stored.
      </p>

      <div className="mt-10 space-y-8 font-sans text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            What this build actually does
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              The search, comparison, pricing and booking flow all run inside
              your browser, against a catalogue bundled with the site.
            </li>
            <li>
              The payment step is simulated. No card number, mobile money number
              or PIN is collected, transmitted or logged, because no payment
              processor is connected.
            </li>
            <li>
              Booking references are generated locally and are not saved. They
              will not work anywhere else, and reloading the page discards them.
            </li>
            <li>
              The enquiry and newsletter forms are deliberately inert — they
              validate what you typed and then stop. Wired up, they would need a
              backend and a stated retention period before this notice could
              describe them.
            </li>
            <li>
              No cookies are set and no third-party scripts are loaded.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Prototype data
          </h2>
          <p className="mt-3">
            Guide names, licence numbers, ratings, review counts and vetting
            dates in this build are illustrative sample values rather than
            records. They are labelled as such throughout the site and in the
            site footer. Real deployment would replace them with verified
            operator records before any of it was shown to a traveller.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Photography
          </h2>
          <p className="mt-3">
            Photographs are used under Creative Commons and Pexels licences, and
            are credited on the{" "}
            <Link
              href="/credits"
              className="text-primary-ink underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
            >
              photography credits
            </Link>{" "}
            page. No photograph in this build is a portrait of the named guide.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold tracking-display text-foreground">
            Before this goes live
          </h2>
          <p className="mt-3">
            A production version would need a named data controller, a lawful
            basis for processing bookings and payment details, a retention
            schedule, and the Uganda Data Protection and Privacy Act 2019
            obligations that follow from handling traveller identity documents
            and mobile money references.
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
