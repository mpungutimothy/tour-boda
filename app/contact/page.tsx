import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { PhotoBand } from "@/components/visual/photo-band";
import { asset, creditLine } from "@/lib/photos";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tour-Boda Uganda. We read every message and replies usually come within a day.",
};

const details = [
  {
    icon: MapPin,
    label: "Office",
    lines: ["Plot 14, Acacia Avenue", "Kololo, Kampala", "Uganda"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+256 700 123 456", "Mon–Sat, 8 AM – 6 PM EAT"],
    mono: true,
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["hello@tour-boda.ug", "Replies within a day"],
    mono: true,
  },
];

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        lead="We read every message. Replies usually come within a day — from a real person in Kampala."
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <div className="rounded-lg border border-hairline bg-card p-6 text-foreground sm:p-8">
            <ContactForm />
          </div>

          <aside className="lg:border-l lg:border-hairline lg:pl-8">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Direct
            </span>

          <ul className="mt-5 space-y-6">
            {details.map((detail) => (
              <li key={detail.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline text-primary-ink">
                  <detail.icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="telemetry text-muted-foreground">{detail.label}</p>
                  <div className="mt-1.5 space-y-0.5">
                    {detail.lines.map((line, i) => (
                      <p
                        key={line}
                        className={
                          detail.mono && i === 0
                            ? "font-mono text-sm text-foreground"
                            : "font-sans text-xs leading-relaxed text-muted-foreground"
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-hairline pt-6">
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Visiting Kampala soon? Drop by the office — there is always tea
              ready and a map on the wall. No appointment needed.
            </p>
          </div>

          <figure className="mt-6 overflow-hidden rounded-lg border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/images/dest-kampala-4.jpg")}
              alt="Produce stalls inside Nakasero Market, Kampala"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-hairline bg-card px-3 py-2">
              <span className="font-sans text-[0.6875rem] text-muted-foreground">
                Nakasero market, twenty minutes from the office
              </span>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                {creditLine("/images/dest-kampala-4.jpg")}
              </span>
            </figcaption>
          </figure>
        </aside>
        </div>
      </div>

      <PhotoBand
        image="/images/dest-custom-1.jpg"
        alt="Open road running through green hills in western Uganda"
        eyebrow="Not in the catalogue?"
        title="Tell us the trip you have in mind and we will price it"
        body="The custom desk quotes routes that are not on this page — film crews, birdwatchers, family groups, and people who just want to see one particular lake."
        height="short"
      />
    </div>
  );
}
