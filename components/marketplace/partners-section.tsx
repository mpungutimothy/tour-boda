import {
  PARTNERS,
  PARTNER_KINDS,
  PARTNER_STATUS_LABEL,
  partnersByKind,
  type PartnerStatus,
} from "@/data/partners";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

/**
 * Ecosystem credibility.
 *
 * Every mark carries its real status, including the ones that are still only
 * targets. A panel that asks "is this signed?" gets the answer from the page,
 * which is worth more than a wall of logos that implies more than exists.
 */

const STATUS_STYLE: Record<PartnerStatus, string> = {
  signed: "border-success/45 bg-success/10 text-success",
  "in-discussion": "border-primary/45 bg-primary/10 text-primary",
  placeholder: "border-hairline text-muted-foreground",
};

export function PartnersSection({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-10", className)}>
      {PARTNER_KINDS.map((kind) => {
        const members = partnersByKind(kind.id);
        if (members.length === 0) return null;

        return (
          <section key={kind.id} aria-labelledby={`partner-kind-${kind.id}`}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3
                id={`partner-kind-${kind.id}`}
                className="font-display text-lg font-semibold tracking-display"
              >
                {kind.label}
              </h3>
              <p className="max-w-xl font-sans text-xs leading-relaxed text-muted-foreground">
                {kind.blurb}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((partner) => (
                <li
                  key={partner.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-hairline bg-background p-4 transition-colors hover:border-primary/40"
                >
                  {/* Wordmark plate stands in for a logo lock-up. */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-display text-sm font-semibold leading-snug tracking-display text-foreground">
                        {partner.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em]",
                          STATUS_STYLE[partner.status],
                        )}
                      >
                        {PARTNER_STATUS_LABEL[partner.status]}
                      </span>
                    </div>
                    <p className="mt-2.5 font-sans text-xs leading-relaxed text-muted-foreground">
                      {partner.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="flex items-start gap-2.5 rounded-lg border border-hairline bg-background/60 p-4 font-sans text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          aria-hidden
        />
        <span>
          Partner marks shown are representative placeholders for this
          prototype, and the status on each one reflects where the relationship
          actually stands. Names are used to describe the intended ecosystem,
          not to imply an existing endorsement. Confirmed partners will be
          published with their agreement reference.
        </span>
      </p>
    </div>
  );
}

/** Condensed logo rail for the homepage — names only, no status. */
export function PartnerRail({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "scroll-x scroll-fade -mx-4 gap-3 px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0",
        className,
      )}
    >
      {PARTNERS.slice(0, 8).map((partner) => (
        <li
          key={partner.id}
          className="shrink-0 snap-start rounded-md border border-hairline bg-background/60 px-3.5 py-2.5"
        >
          <span className="block max-w-[14rem] truncate font-display text-xs font-semibold tracking-display text-muted-foreground">
            {partner.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
