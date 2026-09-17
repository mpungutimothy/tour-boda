/**
 * Ecosystem and partnership marks.
 *
 * ⚠️  PITCH PROTOTYPE. These are representative placeholders, not executed
 * agreements. `status` records where each relationship actually stands so the
 * page never overstates it — a panel that asks "is this signed?" gets a
 * straight answer from the page itself.
 */

export type PartnerKind =
  | "association"
  | "government"
  | "operator"
  | "destination";

export type PartnerStatus = "signed" | "in-discussion" | "placeholder";

export interface Partner {
  id: string;
  name: string;
  kind: PartnerKind;
  role: string;
  status: PartnerStatus;
}

export const PARTNER_KINDS: { id: PartnerKind; label: string; blurb: string }[] = [
  {
    id: "association",
    label: "Guiding standards",
    blurb:
      "Guide licensing, code of conduct and continuing training. No guide goes live on the platform without association-aligned vetting.",
  },
  {
    id: "government",
    label: "Government & licensing",
    blurb:
      "Rider permits, route permissions and the regulatory basis for carrying paying passengers.",
  },
  {
    id: "operator",
    label: "Boda operators",
    blurb:
      "Rider associations and SACCOs supply the fleet. Riders keep the majority share on every booking.",
  },
  {
    id: "destination",
    label: "Destinations & experiences",
    blurb:
      "The sites, communities and hosts that actually deliver the day. Paid directly, within 24 hours.",
  },
];

export const PARTNERS: Partner[] = [
  {
    id: "utga",
    name: "Uganda Tour Guides Association",
    kind: "association",
    role: "Guide vetting, licensing standards and code of conduct",
    status: "in-discussion",
  },
  {
    id: "utb",
    name: "Uganda Tourism Board",
    kind: "government",
    role: "Destination marketing and operator registration",
    status: "placeholder",
  },
  {
    id: "mtwa",
    name: "Ministry of Tourism, Wildlife and Antiquities",
    kind: "government",
    role: "Policy alignment for community tourism revenue sharing",
    status: "placeholder",
  },
  {
    id: "kcca",
    name: "Kampala Capital City Authority",
    kind: "government",
    role: "Boda rider permits and city route permissions",
    status: "placeholder",
  },
  {
    id: "kbra",
    name: "Kampala Boda Boda Riders Association",
    kind: "operator",
    role: "Rider recruitment, fleet standards and dispute resolution",
    status: "in-discussion",
  },
  {
    id: "jinja-sacco",
    name: "Jinja Boda Operators SACCO",
    kind: "operator",
    role: "Eastern region fleet and rider savings scheme",
    status: "placeholder",
  },
  {
    id: "entebbe-coop",
    name: "Entebbe Rider Cooperative",
    kind: "operator",
    role: "Entebbe and airport-transfer riders",
    status: "placeholder",
  },
  {
    id: "buganda",
    name: "Kasubi Tombs — Buganda Kingdom",
    kind: "destination",
    role: "Heritage site access and clan-elder guiding",
    status: "placeholder",
  },
  {
    id: "uwec",
    name: "Uganda Wildlife Education Centre",
    kind: "destination",
    role: "Wildlife entry, keeper talks and school programmes",
    status: "placeholder",
  },
  {
    id: "sipi-assoc",
    name: "Sipi Falls Guides Association",
    kind: "destination",
    role: "Waterfall trails, abseiling and coffee-farm hosts",
    status: "placeholder",
  },
  {
    id: "kibale-community",
    name: "Kibale Community Tourism Association",
    kind: "destination",
    role: "Village walks, craft cooperatives and homestay hosts",
    status: "in-discussion",
  },
];

export function partnersByKind(kind: PartnerKind): Partner[] {
  return PARTNERS.filter((partner) => partner.kind === kind);
}

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  signed: "Agreement signed",
  "in-discussion": "In discussion",
  placeholder: "Target partner",
};
