import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { PARTNERS } from "@/data/partners";
import { REVENUE_SPLIT } from "@/data/revenue";
import { PROTOTYPE_NOTICE } from "@/lib/demo";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

/** Grouped so the footer reads as a site map rather than a link dump. */
const SITEMAP: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Plan a trip",
    links: [
      { label: "All destinations", href: "/tours" },
      { label: "Guides", href: "/guides" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Build a custom route", href: "/book/custom-destination-tour" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Partnerships", href: "/how-it-works#partners" },
      { label: "Photography credits", href: "/credits" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Booking terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Design system", href: "/styleguide" },
    ],
  },
];

/**
 * Site footer.
 *
 * The dark half of the bookend, and the only place on the site where the whole
 * ecosystem is listed at once — which is exactly what a pitch panel looks for
 * and what a traveller never needs to see. Grouped as a sitemap so both
 * audiences can find their shelf.
 *
 * Partner marks are chips rather than logos: the relationships are real but the
 * permission to display institutional marks is not yet in place, and inventing
 * a logo for a government body is not a thing to do on a pitch page.
 */
export function Footer() {
  const routes = destinations.length;
  const guideCount = guides.length;
  const districtCount = new Set(
    destinations.map((destination) => destination.location.district),
  ).size;

  const socials = [
    { label: "Instagram", Icon: Instagram, url: "https://instagram.com/tourbodauganda" },
    { label: "Facebook", Icon: Facebook, url: "https://facebook.com/tourbodauganda" },
    { label: "LinkedIn", Icon: Linkedin, url: "https://linkedin.com/company/tourbodauganda" },
    { label: "YouTube", Icon: Youtube, url: "https://youtube.com/@tourbodauganda" },
  ];

  return (
    <footer className="theme-shell border-t border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* ---- Brand + sitemap ---- */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-baseline gap-2"
              aria-label="Tour-Boda Uganda, home"
            >
              <span className="font-display text-2xl font-semibold leading-none tracking-display text-foreground">
                Tour-Boda
              </span>
              <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Uganda
              </span>
            </Link>

            <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
              A marketplace for the last mile of Ugandan tourism. Local
              boda-boda riders, licensed and vetted, bookable at a published
              price in shillings.
            </p>

            {/* Revenue split, stated once more at the bottom of every page. */}
            <div className="mt-6 rounded-lg border border-hairline p-3.5">
              <p className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Where your money goes
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {REVENUE_SPLIT.map((party) => (
                  <li
                    key={party.id}
                    className="flex items-baseline justify-between gap-3 font-sans text-xs"
                  >
                    <span className="text-muted-foreground">
                      {party.shortLabel}
                    </span>
                    <span className="numeric-emphasis font-mono text-xs">
                      {Math.round(party.share * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {SITEMAP.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ---- Partner credibility chips ---- */}
        <div className="mt-12 border-t border-hairline pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-foreground">
              Ecosystem
            </h2>
            <p className="font-sans text-xs text-muted-foreground">
              {routes} routes · {guideCount} guides · {districtCount} districts
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {PARTNERS.map((partner) => (
              <li key={partner.id}>
                <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 font-sans text-xs text-muted-foreground">
                  <span
                    aria-hidden
                    className={
                      partner.status === "signed"
                        ? "h-1.5 w-1.5 rounded-full bg-success"
                        : "h-1.5 w-1.5 rounded-full border border-hairline"
                    }
                  />
                  {partner.name}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/how-it-works#partners"
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-primary-ink transition-opacity hover:opacity-80"
          >
            Every relationship, with its status
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        {/* ---- Social ---- */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-hairline pt-8">
          <ul className="flex items-center gap-2">
            {socials.map(({ label, Icon, url }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={`${label} (placeholder handle)`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors hover:border-primary hover:text-primary-ink"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-[0.6875rem] text-muted-foreground">
            Placeholder handles — no accounts are live yet.
          </p>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Tour-Boda Uganda. Prices in
            Ugandan shillings.
          </p>
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Legal"
          >
            {[
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Photo credits", href: "/credits" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---- Prototype disclosure ---- */}
        <p className="mt-8 rounded-lg border border-hairline p-3.5 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
          <span className="font-semibold uppercase tracking-[0.12em] text-primary-ink">
            {PROTOTYPE_NOTICE.label}.
          </span>{" "}
          {PROTOTYPE_NOTICE.detail}
        </p>
      </div>
    </footer>
  );
}
