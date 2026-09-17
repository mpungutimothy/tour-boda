import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
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
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Radio check</span>
      </div>

      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
          Contact
        </h1>
        <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
          We read every message. Replies usually come within a day — from a real
          person in Kampala.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="rounded-lg border border-hairline bg-background p-6 text-foreground sm:p-8">
          <ContactForm />
        </div>

        <aside className="lg:border-l lg:border-hairline lg:pl-8">
          <span className="telemetry text-muted-foreground">Direct</span>

          <ul className="mt-5 space-y-6">
            {details.map((detail) => (
              <li key={detail.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline text-primary">
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
        </aside>
      </div>
    </div>
  );
}
