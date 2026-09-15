import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tour-Boda Uganda. We read every message and replies usually come within a day.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">Contact</h1>
        <p className="mt-4 max-w-xl font-sans text-lg leading-relaxed text-muted-foreground">
          We read every message. Replies usually come within a day — from a real person in Kampala.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Contact details sidebar */}
        <aside className="lg:border-l lg:border-border/60 lg:pl-8">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Reach us directly</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Office</p>
                    <p className="mt-0.5 font-sans text-sm text-ink">
                      Plot 14, Acacia Avenue<br />
                      Kololo, Kampala<br />
                      Uganda
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                    <p className="mt-0.5 font-mono text-sm text-ink">+256 700 123 456</p>
                    <p className="font-sans text-xs text-muted-foreground">Mon–Sat, 8 AM – 6 PM EAT</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                    <p className="mt-0.5 font-mono text-sm text-ink">hello@tour-boda.ug</p>
                    <p className="font-sans text-xs text-muted-foreground">Replies within a day</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-md bg-surface p-4">
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Visiting Kampala soon? Drop by the office — we always have tea ready and a map on the
                wall. No appointment needed.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
