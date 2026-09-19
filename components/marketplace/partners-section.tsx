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
  // Small badge text on white, so gold drops to the stronger tone (#8A5A16,
  // 5.9:1) rather than the price tone (#A8701F, 4.2:1 — fine at 28px, not at
  // 11px). Green is already deep enough at #3F5C44.
  signed: "border-success/40 bg-success/10 text-success",
  "in-discussion": "border-primary/40 bg-primary/10 text-primary-ink",
  placeholder: "border-hairline text-muted-foreground",
};

const STATUS_DOT: Record<PartnerStatus, string> = {
  signed: "bg-success",
  "in-discussion": "bg-primary",
  placeholder: "border border-hairline",
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
                  className="flex flex-col justify-between gap-4 rounded-lg border border-hairline bg-card p-4 transition-colors hover:border-primary"
                >
                  {/* Wordmark plate stands in for a logo lock-up. */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-display text-base font-semibold leading-snug tracking-display text-foreground">
                        {partner.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em]",
                          STATUS_STYLE[partner.status],
                        )}
                      >
                        {PARTNER_STATUS_LABEL[partner.status]}
                      </span>
                    </div>
                    <p className="mt-2.5 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {partner.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="flex items-start gap-2.5 rounded-lg border border-hairline bg-field p-4 font-sans text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink"
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

/** Condensed partner rail — bordered white pills with a status dot. */
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
          className="flex shrink-0 snap-start items-center gap-2.5 rounded-full border border-hairline bg-card px-4 py-2.5"
          title={`${PARTNER_STATUS_LABEL[partner.status]} — ${partner.role}`}
        >
          <span
            aria-hidden
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              STATUS_DOT[partner.status],
            )}
          />
          <span className="block max-w-[15rem] truncate font-sans text-[0.8125rem] font-medium text-foreground">
            {partner.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
