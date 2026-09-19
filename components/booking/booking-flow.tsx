"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type {
  AddOnSelection,
  BookingReference,
  BookingStep,
  Party,
  PaymentMethod,
  PaymentMethodMeta,
} from "@/types/marketplace";
import type { Destination, GroupType, TierKey } from "@/types/destination";
import { GROUP_TYPES, groupTypeMeta } from "@/data/group-types";
import { addOnById, addOnsForTier } from "@/data/add-ons";
import { getGuide, type Guide } from "@/data/guides";
import { tierMeta } from "@/data/tiers";
import {
  COMPONENT_LABELS,
  COMPONENT_ORDER,
  PRICING_RULES,
  buildQuote,
  canToggleOff,
  passengerCount,
  requirementsForTier,
  type ComponentKey,
  type Requirements,
} from "@/lib/marketplace/pricing";
import {
  formatDateLabel,
  formatUGX,
  toDateInputValue,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/marketplace/guide-card";
import { TierBadge, TierTabs } from "@/components/marketplace/tier-ui";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bike,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "tier", label: "Service level" },
  { id: "details", label: "Date & party" },
  { id: "summary", label: "Review" },
  { id: "payment", label: "Payment" },
  { id: "confirmed", label: "Confirmed" },
];

const PAYMENT_METHODS: PaymentMethodMeta[] = [
  {
    id: "mtn",
    label: "MTN Mobile Money",
    hint: "Approve the prompt on your phone",
    kind: "mobile-money",
  },
  {
    id: "airtel",
    label: "Airtel Money",
    hint: "Approve the prompt on your phone",
    kind: "mobile-money",
  },
  {
    id: "card",
    label: "Visa or Mastercard",
    hint: "Processed in UGX, no FX markup",
    kind: "card",
  },
];

const COMPONENT_ICON: Record<ComponentKey, typeof Bike> = {
  transport: Bike,
  guide: BadgeCheck,
  meals: UtensilsCrossed,
};

/** Prototype booking reference. Not a real reservation. */
function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < bytes.length; i += 1) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `TB-${code}`;
}

function toSelection(
  id: string,
  quantity: number,
): AddOnSelection | null {
  const addOn = addOnById(id);
  if (!addOn) return null;
  return {
    id: addOn.id,
    name: addOn.name,
    unit: addOn.unit,
    unitPrice: addOn.price,
    quantity,
  };
}

/* -------------------------------------------------------------------------- */
/*  Flow                                                                       */
/* -------------------------------------------------------------------------- */

export function BookingFlow({
  destination,
  initialTier,
}: {
  destination: Destination;
  initialTier: TierKey;
}) {
  const isQuotation = destination.pricingMode === "quotation";

  const [step, setStep] = useState<BookingStep>("tier");
  const [tierKey, setTierKey] = useState<TierKey>(initialTier);
  const tier = destination.tiers.find((entry) => entry.key === tierKey) ??
    destination.tiers[0];

  const [party, setParty] = useState<Party>({ adults: 2, children: 0 });
  const [groupType, setGroupType] = useState<GroupType | "">("couple");
  const [requirements, setRequirements] = useState<Requirements>(() =>
    requirementsForTier(tier),
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState<BookingReference | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Changing tier resets the toggles to that tier's defaults and drops add-ons
  // the new tier does not offer — otherwise a stale selection could survive a
  // downgrade and quote something the tier cannot deliver.
  useEffect(() => {
    setRequirements(requirementsForTier(tier));
  }, [tier]);

  const availableAddOns = useMemo(
    () => addOnsForTier(tierKey).filter((addOn) => destination.addOnIds.includes(addOn.id)),
    [tierKey, destination.addOnIds],
  );

  useEffect(() => {
    setSelectedAddOns((current) =>
      current.filter((selection) =>
        availableAddOns.some((addOn) => addOn.id === selection.id),
      ),
    );
  }, [availableAddOns]);

  const maxParty = tier.maxParty;
  const clampedParty: Party = useMemo(() => {
    const total = passengerCount(party);
    if (total <= maxParty) return party;
    const adults = Math.min(party.adults, maxParty);
    const children = Math.min(party.children, maxParty - adults);
    return { adults, children };
  }, [party, maxParty]);

  useEffect(() => {
    if (clampedParty.adults !== party.adults || clampedParty.children !== party.children) {
      setParty(clampedParty);
    }
  }, [clampedParty, party]);

  const quote = useMemo(
    () =>
      buildQuote({
        destination,
        tier,
        party,
        requirements,
        addOns: selectedAddOns,
      }),
    [destination, tier, party, requirements, selectedAddOns],
  );

  const leadTimeHours = useMemo(() => {
    if (!date) return null;
    const target = new Date(`${date}T${time || "09:00"}:00`).getTime();
    return (target - Date.now()) / (1000 * 60 * 60);
  }, [date, time]);

  const leadTimeTooShort =
    leadTimeHours !== null && leadTimeHours < destination.minLeadTimeHours;

  const guides = destination.guideIds
    .map((id) => getGuide(id))
    .filter((guide): guide is Guide => guide !== undefined)
    .filter((guide) => guide.tierKeys.includes(tier.key));

  const stepIndex = STEPS.findIndex((entry) => entry.id === step);

  function validateDetails(): boolean {
    const next: Record<string, string> = {};
    if (!date) next.date = "Choose a date.";
    if (!contact.name.trim()) next.name = "We need a name for the booking.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      next.email = "Enter an email we can send the confirmation to.";
    }
    if (!/^[0-9+\s-]{9,15}$/.test(contact.phone.trim())) {
      next.phone = "Enter a reachable phone number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (step === "tier") {
      setStep("details");
      return;
    }
    if (step === "details") {
      if (!validateDetails()) return;
      setStep("summary");
      return;
    }
    if (step === "summary") {
      setStep("payment");
    }
  }

  function goBack() {
    if (step === "summary") setStep("details");
    else if (step === "details") setStep("tier");
    else if (step === "payment") setStep("summary");
  }

  function submit() {
    setErrors({});
    const next: Record<string, string> = {};
    if (!isQuotation) {
      if (paymentMethod === "card") {
        if (!/^[0-9\s]{13,19}$/.test(paymentDetail.trim())) {
          next.payment = "Enter a 16-digit card number.";
        }
      } else if (!/^[0-9]{9,10}$/.test(paymentDetail.replace(/\s/g, ""))) {
        next.payment = "Enter the mobile money number, digits only.";
      }
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setProcessing(true);
    // Simulated processor round trip. No gateway is called and no money moves.
    window.setTimeout(() => {
      setReference({
        code: makeReference(),
        createdAt: new Date().toISOString(),
        paymentMethod,
        paymentDetail: isQuotation ? "—" : paymentDetail,
        total: quote.total,
      });
      setProcessing(false);
      setStep("confirmed");
    }, 1500);
  }

  /* ------------------------------------------------------------------ render */

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
      <div className="min-w-0">
        {/* ---- Stepper ---- */}
        <div className="mb-8">
          <ol className="scroll-x gap-2 pb-4">
            {STEPS.map((entry, index) => {
              const done = index < stepIndex;
              const current = index === stepIndex;
              return (
                <li key={entry.id} className="shrink-0">
                  <span
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors",
                      current
                        ? "border-primary bg-primary/[0.12] text-primary-ink"
                        : done
                          ? "border-success/[0.45] bg-success/10 text-success"
                          : "border-hairline text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <Check className="h-3 w-3" aria-hidden />
                    ) : (
                      <span data-readout>{index + 1}</span>
                    )}
                    {entry.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Progress rail — where you are in the booking, drawn to scale. */}
          <span aria-hidden className="track-dots relative block h-[3px]">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{
                width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </span>
        </div>

        {/* ---- Step: service level ---- */}
        {step === "tier" ? (
          <section aria-labelledby="step-tier">
            <h2
              id="step-tier"
              className="font-display text-2xl font-bold tracking-display"
            >
              Choose your service level
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              Three levels on the same route. Every price below is per person for
              a party of two; the next step adjusts it for your actual party.
            </p>

            <div className="mt-6 grid gap-4">
              {destination.tiers.map((entry) => {
                const active = entry.key === tier.key;
                const meta = tierMeta(entry.key);
                return (
                  <button
                    key={entry.key}
                    type="button"
                    data-tier={entry.key}
                    onClick={() => setTierKey(entry.key)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-lg border bg-card p-4 text-left transition-all duration-200 sm:p-5",
                      active
                        ? "tier-border tier-ring"
                        : "border-hairline hover:border-primary/40",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <TierBadge tierKey={entry.key}>{meta.shortLabel}</TierBadge>
                        <h3 className="mt-2.5 font-display text-lg font-semibold leading-tight tracking-display">
                          {meta.name}
                        </h3>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                          {meta.summary}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {entry.badge ? (
                          <span className="mb-1.5 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] tier-text">
                            {entry.badge}
                          </span>
                        ) : null}
                        <span
                          data-readout
                          className="block font-mono text-xl font-bold leading-none tier-text"
                        >
                          {formatUGX(entry.price)}
                        </span>
                        <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
                          per person
                        </span>
                      </div>
                    </div>

                    <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                      {entry.inclusions.slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-sans text-xs leading-snug text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-hairline pt-3 font-mono text-[0.625rem] uppercase tracking-[0.12em]">
                      {COMPONENT_ORDER.map((key) => {
                        const included = entry.components[key].included;
                        return (
                          <span
                            key={key}
                            className={cn(
                              "flex items-center gap-1.5",
                              included ? "text-success" : "text-muted-foreground/60",
                            )}
                          >
                            {included ? (
                              <Check className="h-3 w-3" aria-hidden />
                            ) : (
                              <X className="h-3 w-3" aria-hidden />
                            )}
                            {COMPONENT_LABELS[key]}
                          </span>
                        );
                      })}
                      <span data-readout className="text-muted-foreground">
                        up to {entry.maxParty} riders
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {guides.length > 0 ? (
              <div className="mt-6 rounded-lg border border-hairline bg-background/60 p-4">
                <p className="telemetry text-muted-foreground">
                  Who leads this tier
                </p>
                <ul className="mt-3 space-y-3">
                  {guides.map((guide) => (
                    <li key={guide.id} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-card font-display text-xs font-bold text-primary-ink">
                        {guide.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part.charAt(0))
                          .join("")}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="font-display text-sm font-semibold">
                            {guide.name}
                          </span>
                          <RatingStars rating={guide.rating} />
                          <span data-readout className="font-mono text-[0.625rem] text-muted-foreground">
                            {guide.rating.toFixed(1)} · {guide.reviewCount} reviews
                          </span>
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-success">
                          <ShieldCheck className="h-3 w-3" aria-hidden />
                          {guide.licence.authority} · {guide.licence.number}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ---- Step: date & party ---- */}
        {step === "details" ? (
          <section aria-labelledby="step-details" className="space-y-8">
            <div>
              <h2
                id="step-details"
                className="font-display text-2xl font-bold tracking-display"
              >
                When, and who is riding
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
                {destination.name} · {tierMeta(tier.key).name}. This route needs{" "}
                {destination.minLeadTimeHours} hours&apos; notice.
              </p>
            </div>

            {/* Date + time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="book-date" className="telemetry text-muted-foreground">
                  Date
                </Label>
                <Input
                  id="book-date"
                  type="date"
                  min={toDateInputValue(new Date())}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "book-date-error" : undefined}
                />
                {errors.date ? (
                  <p id="book-date-error" className="font-sans text-xs text-destructive">
                    {errors.date}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-time" className="telemetry text-muted-foreground">
                  Start time
                </Label>
                <Input
                  id="book-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </div>
            </div>

            {leadTimeTooShort ? (
              <p className="flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/[0.08] p-3.5 font-sans text-xs leading-relaxed text-warning">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                That is inside the {destination.minLeadTimeHours}-hour notice
                window for this route. You can still send the request, and the
                guide will confirm or propose another time.
              </p>
            ) : null}

            {/* Group type */}
            <fieldset className="space-y-2.5">
              <legend className="telemetry text-muted-foreground">
                Group type
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {GROUP_TYPES.map((group) => {
                  const active = groupType === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setGroupType(group.id);
                        setParty(group.defaultParty);
                      }}
                      title={group.hint}
                      className={cn(
                        "rounded-md border px-3 py-1.5 font-sans text-xs transition-all duration-200",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-hairline text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>
              <p className="font-sans text-xs text-muted-foreground">
                {groupType
                  ? groupTypeMeta(groupType)?.hint
                  : "Choose a group type, or set the party size directly below."}
              </p>
            </fieldset>

            {/* Party steppers */}
            <fieldset className="space-y-3">
              <legend className="telemetry text-muted-foreground">
                Party size · this tier carries up to {maxParty}
              </legend>
              <PartyStepper
                label="Adults"
                hint="Aged 12 and over"
                value={party.adults}
                min={1}
                max={maxParty - party.children}
                onChange={(adults) => setParty((current) => ({ ...current, adults }))}
              />
              <PartyStepper
                label="Children"
                hint={`Under 12 · ${
                  PRICING_RULES.childRate * 100
                }% of the adult rate`}
                value={party.children}
                min={0}
                max={maxParty - party.adults}
                onChange={(children) => setParty((current) => ({ ...current, children }))}
              />
              <p className="font-sans text-xs text-muted-foreground">
                {passengerCount(party)} {passengerCount(party) === 1 ? "rider" : "riders"}{" "}
                · {quote.bodas} {quote.bodas === 1 ? "boda" : "bodas"} on the road.
              </p>
            </fieldset>

            {/* Requirements */}
            <fieldset className="space-y-3">
              <legend className="telemetry text-muted-foreground">
                What the package must include
              </legend>
              {COMPONENT_ORDER.map((key) => {
                const component = tier.components[key];
                const Icon = COMPONENT_ICON[key];
                const locked = component.included && !canToggleOff(tier, key);
                return (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 rounded-md border border-hairline bg-background/50 p-3.5"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-sans text-sm text-foreground">
                        <Icon className="h-4 w-4 text-primary-ink" aria-hidden />
                        {COMPONENT_LABELS[key]}
                        {locked ? (
                          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                            included, not removable
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block font-sans text-xs leading-relaxed text-muted-foreground">
                        {component.included
                          ? locked
                            ? "The ride is the product — this cannot be taken out."
                            : `Included. Take it out and ${formatUGX(component.value)} per person comes off.`
                          : `Not included. Add it for ${formatUGX(component.value)} per person.`}
                      </span>
                    </span>
                    <Switch
                      id={`req-${key}`}
                      checked={requirements[key]}
                      disabled={locked}
                      onCheckedChange={(checked) =>
                        setRequirements((current) => ({ ...current, [key]: checked }))
                      }
                      aria-label={COMPONENT_LABELS[key]}
                    />
                  </div>
                );
              })}
            </fieldset>

            {/* Add-ons */}
            {availableAddOns.length > 0 ? (
              <fieldset className="space-y-3">
                <legend className="telemetry text-muted-foreground">
                  Add-ons
                </legend>
                <ul className="space-y-2">
                  {availableAddOns.map((addOn) => {
                    const selected = selectedAddOns.some(
                      (entry) => entry.id === addOn.id,
                    );
                    return (
                      <li key={addOn.id}>
                        <div
                          className={cn(
                            "flex items-start gap-3 rounded-md border p-3.5 transition-colors",
                            selected
                              ? "border-primary/50 bg-primary/[0.06]"
                              : "border-hairline bg-background/50",
                          )}
                        >
                          <Checkbox
                            checked={selected}
                            onChange={(checked) =>
                              setSelectedAddOns((current) =>
                                checked
                                  ? [
                                      ...current.filter((entry) => entry.id !== addOn.id),
                                      toSelection(addOn.id, 1)!,
                                    ].filter(Boolean)
                                  : current.filter((entry) => entry.id !== addOn.id),
                              )
                            }
                            label={addOn.name}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-sans text-sm text-foreground">
                              {addOn.name}
                            </span>
                            <span className="mt-1 block font-sans text-xs leading-relaxed text-muted-foreground">
                              {addOn.description}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span
                              data-readout
                              className="block font-mono text-sm font-semibold text-primary-ink"
                            >
                              {formatUGX(addOn.price)}
                            </span>
                            <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted-foreground">
                              {addOn.unit.replace("per-", "per ")}
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ) : null}

            {/* Contact */}
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="telemetry mb-1 text-muted-foreground">
                Who we are booking for
              </legend>
              <div className="space-y-2">
                <Label htmlFor="book-name" className="telemetry text-muted-foreground">
                  Full name
                </Label>
                <Input
                  id="book-name"
                  value={contact.name}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, name: event.target.value }))
                  }
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <p className="font-sans text-xs text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-phone" className="telemetry text-muted-foreground">
                  Phone
                </Label>
                <Input
                  id="book-phone"
                  inputMode="tel"
                  placeholder="+256 7xx xxx xxx"
                  value={contact.phone}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, phone: event.target.value }))
                  }
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone ? (
                  <p className="font-sans text-xs text-destructive">{errors.phone}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="book-email" className="telemetry text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="book-email"
                  type="email"
                  value={contact.email}
                  onChange={(event) =>
                    setContact((current) => ({ ...current, email: event.target.value }))
                  }
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? (
                  <p className="font-sans text-xs text-destructive">{errors.email}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="book-notes" className="telemetry text-muted-foreground">
                  Anything the guide should know
                </Label>
                <Textarea
                  id="book-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Dietary needs, mobility, a stop you would like to add."
                />
              </div>
            </fieldset>
          </section>
        ) : null}

        {/* ---- Step: review ---- */}
        {step === "summary" ? (
          <section aria-labelledby="step-summary">
            <h2
              id="step-summary"
              className="font-display text-2xl font-bold tracking-display"
            >
              Check the details
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              Every line below is traceable to a choice you made. Nothing is
              added at checkout.
            </p>

            {isQuotation && destination.quoteNote ? (
              <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-primary/[0.35] bg-primary/[0.07] p-3.5 font-sans text-xs leading-relaxed text-primary-ink">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {destination.quoteNote}
              </p>
            ) : null}

            <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
              <SummaryCell label="Route" value={destination.name} />
              <SummaryCell
                label="Service level"
                value={tierMeta(tier.key).name}
              />
              <SummaryCell label="Date" value={formatDateLabel(date) || "—"} />
              <SummaryCell label="Start" value={time || "—"} />
              <SummaryCell
                label="Party"
                value={`${party.adults} adult${party.adults === 1 ? "" : "s"}${
                  party.children > 0
                    ? `, ${party.children} child${party.children === 1 ? "" : "ren"}`
                    : ""
                }`}
              />
              <SummaryCell
                label="Guide"
                value={guides[0]?.name ?? "Assigned on confirmation"}
              />
            </dl>

            <QuoteTable
              lines={quote.lines}
              subtotal={quote.subtotal}
              addOnTotal={quote.addOnTotal}
              total={quote.total}
              vatIncluded={quote.vatIncluded}
            />
          </section>
        ) : null}

        {/* ---- Step: payment ---- */}
        {step === "payment" && !reference ? (
          <section aria-labelledby="step-payment">
            <h2
              id="step-payment"
              className="font-display text-2xl font-bold tracking-display"
            >
              {isQuotation ? "Request the quote" : "Pay and confirm"}
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              {isQuotation
                ? "No payment is taken now. The planner sends an itemised quote within 48 hours and you approve it in writing before anything is charged."
                : "Prices are quoted and charged in Ugandan shillings, VAT included. There is no booking fee."}
            </p>

            {!isQuotation ? (
              <>
                <div
                  role="radiogroup"
                  aria-label="Payment method"
                  className="mt-6 grid gap-3"
                >
                  {PAYMENT_METHODS.map((method) => {
                    const active = paymentMethod === method.id;
                    const Icon =
                      method.kind === "mobile-money" ? Smartphone : CreditCard;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          setPaymentDetail("");
                        }}
                        className={cn(
                          "flex items-center gap-3.5 rounded-lg border p-4 text-left transition-all duration-200",
                          active
                            ? "border-primary bg-primary/[0.07] shadow-glow-sm"
                            : "border-hairline bg-card hover:border-primary/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
                            active
                              ? "border-primary/50 bg-primary/15 text-primary-ink"
                              : "border-hairline text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-sm font-semibold tracking-display">
                            {method.label}
                          </span>
                          <span className="mt-0.5 block font-sans text-xs text-muted-foreground">
                            {method.hint}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            active ? "border-primary bg-primary" : "border-hairline",
                          )}
                        >
                          {active ? (
                            <Check
                              className="h-2.5 w-2.5 text-primary-foreground"
                              aria-hidden
                            />
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="pay-detail" className="telemetry text-muted-foreground">
                    {paymentMethod === "card"
                      ? "Card number"
                      : "Mobile money number"}
                  </Label>
                  <div className="relative">
                    {paymentMethod === "card" ? (
                      <CreditCard
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                    ) : (
                      <Phone
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                    )}
                    <Input
                      id="pay-detail"
                      inputMode="numeric"
                      className="pl-9"
                      placeholder={
                        paymentMethod === "card"
                          ? "4242 4242 4242 4242"
                          : "770123456"
                      }
                      value={paymentDetail}
                      onChange={(event) => setPaymentDetail(event.target.value)}
                      aria-invalid={Boolean(errors.payment)}
                    />
                  </div>
                  {errors.payment ? (
                    <p className="font-sans text-xs text-destructive">
                      {errors.payment}
                    </p>
                  ) : null}
                </div>

                <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-hairline bg-background/60 p-3.5 font-sans text-xs leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" aria-hidden />
                  Prototype payment. No gateway is contacted, no card or mobile
                  money details are transmitted or stored, and no money moves.
                </p>
              </>
            ) : null}
          </section>
        ) : null}

        {/* ---- Step: confirmed ---- */}
        {step === "confirmed" && reference ? (
          <section aria-labelledby="step-confirmed">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-success/[0.45] bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" aria-hidden />
            </span>
            <h2
              id="step-confirmed"
              className="mt-5 font-display text-3xl font-bold tracking-display"
            >
              {isQuotation ? "Quote requested" : "Booking confirmed"}
            </h2>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
              {isQuotation
                ? "The custom desk has your request. You will receive an itemised quote within 48 hours, and nothing is charged until you approve it."
                : "Your guide has the details and will call the number you gave us to confirm the meeting point."}
            </p>

            <div className="mt-6 rounded-lg border border-hairline bg-card p-5">
              <p className="telemetry text-muted-foreground">Reference</p>
              <p className="mt-2 font-mono text-3xl font-bold tracking-[0.08em] text-primary-ink">
                {reference.code}
              </p>
              <dl className="mt-5 grid gap-3 border-t border-hairline pt-5 sm:grid-cols-2">
                <SummaryCell label="Route" value={destination.name} compact />
                <SummaryCell
                  label="Service level"
                  value={tierMeta(tier.key).name}
                  compact
                />
                <SummaryCell
                  label="Departure"
                  value={`${formatDateLabel(date)} · ${time}`}
                  compact
                />
                <SummaryCell
                  label="Party"
                  value={`${party.adults} adult${party.adults === 1 ? "" : "s"}${
                    party.children > 0 ? `, ${party.children} children` : ""
                  }`}
                  compact
                />
                <SummaryCell
                  label={isQuotation ? "Indicative total" : "Paid"}
                  value={formatUGX(reference.total)}
                  compact
                />
                <SummaryCell
                  label="Method"
                  value={
                    isQuotation
                      ? "No payment taken"
                      : PAYMENT_METHODS.find((method) => method.id === reference.paymentMethod)
                          ?.label ?? "—"
                  }
                  compact
                />
              </dl>
            </div>

            <ol className="mt-6 space-y-3">
              {[
                isQuotation
                  ? "The planner reviews the route and prices each line."
                  : "Your rider calls to confirm the meeting point and time.",
                "You get an email with the guide's name, number and the route notes.",
                isQuotation
                  ? "You approve the itemised quote, then pay a 30% deposit."
                  : "Payment is held and released to the operator after the trip ends.",
              ].map((line, index) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    data-readout
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[0.625rem] text-primary-ink"
                  >
                    {index + 1}
                  </span>
                  <span className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* ---- Nav ---- */}
        {step !== "confirmed" ? (
          <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === "tier"}
              className="font-mono text-[0.6875rem] uppercase tracking-[0.12em]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Back
            </Button>

            {step === "payment" ? (
              // `loading` keeps the label mounted and prepends the spinner, so
              // the button does not change width or wording mid-click. The
              // previous version swapped "Pay UGX 279,000" for "Processing",
              // which made the whole footer row shift at the moment of click.
              <Button
                type="button"
                size="lg"
                onClick={submit}
                loading={processing}
                loadingLabel="Processing your payment"
                className="min-w-[13rem]"
              >
                {isQuotation ? (
                  <>
                    Request quotation
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </>
                ) : (
                  <>
                    Pay {formatUGX(quote.total)}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </>
                )}
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={goNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-9 flex flex-wrap gap-3 border-t border-hairline pt-6">
            <Button asChild size="lg">
              <Link href="/tours">
                Browse more routes
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/guides">Meet the guides</Link>
            </Button>
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {processing ? "Processing payment" : ""}
        </p>
      </div>

      {/* ---- Sticky price panel ---- */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="plate rounded-lg p-5">
          {/* Thumbnail bleeds to the plate edge, so the price panel always shows
              the thing being priced. Booking blind is the fastest way to lose
              trust at the payment step. */}
          {destination.images[0] ? (
            <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={destination.images[0].url}
                alt=""
                loading="lazy"
                className="duotone h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-primary/[0.12] mix-blend-overlay"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-scrim/90 to-transparent"
              />
              <span className="absolute inset-x-3 bottom-2.5 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-on-scrim">
                <MapPin className="h-3 w-3" aria-hidden />
                {destination.location.district}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <span className="telemetry text-muted-foreground">Your selection</span>
            <TierBadge tierKey={tier.key} />
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold leading-tight tracking-display">
            {destination.name}
          </h3>
          <p className="mt-1 font-sans text-xs text-muted-foreground">
            {tierMeta(tier.key).name}
            {date ? ` · ${formatDateLabel(date)}` : ""}
          </p>

          <div className="mt-4">
            <TierTabs
              tiers={destination.tiers}
              value={tier.key}
              onChange={setTierKey}
              label="Service level"
            />
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-hairline pt-4 font-sans text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Package</dt>
              <dd data-readout className="font-mono text-foreground">
                {formatUGX(quote.subtotal)}
              </dd>
            </div>
            {quote.addOnTotal > 0 ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Add-ons</dt>
                <dd data-readout className="font-mono text-foreground">
                  {formatUGX(quote.addOnTotal)}
                </dd>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Booking fee</dt>
              <dd data-readout className="font-mono text-success">
                {formatUGX(0)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-hairline pt-4">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              Total
            </span>
            <span className="text-right">
              <span
                data-readout
                className="block font-mono text-2xl font-bold leading-none text-primary-ink"
              >
                {formatUGX(quote.total)}
              </span>
              <span
                data-readout
                className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
              >
                {formatUGX(quote.perPerson)} per person · incl. VAT
              </span>
            </span>
          </div>

          <p className="mt-4 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
            {formatUGX(quote.vatIncluded)} of the total is VAT. {quote.passengers}{" "}
            {quote.passengers === 1 ? "rider" : "riders"} on {quote.bodas}{" "}
            {quote.bodas === 1 ? "boda" : "bodas"}.
          </p>
        </div>

        <p className="mt-3 px-1 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
          Prototype booking. Payments are simulated and no booking is sent to a
          rider.
        </p>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function SummaryCell({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? undefined : "bg-card p-4"}>
      <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 font-sans text-sm text-foreground">{value}</dd>
    </div>
  );
}

function QuoteTable({
  lines,
  subtotal,
  addOnTotal,
  total,
  vatIncluded,
}: {
  lines: { label: string; detail: string; amount: number; credit?: boolean }[];
  subtotal: number;
  addOnTotal: number;
  total: number;
  vatIncluded: number;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-hairline">
      <table className="w-full text-left">
        <caption className="sr-only">Price breakdown for this booking</caption>
        <tbody>
          {lines.map((line, index) => (
            <tr key={`${line.label}-${index}`} className="border-b border-hairline">
              <th scope="row" className="px-4 py-3 text-left align-top font-normal">
                <span className="block font-sans text-sm text-foreground">
                  {line.label}
                </span>
                {line.detail ? (
                  <span className="mt-0.5 block font-sans text-xs leading-snug text-muted-foreground">
                    {line.detail}
                  </span>
                ) : null}
              </th>
              <td
                data-readout
                className={cn(
                  "w-32 px-4 py-3 text-right align-top font-mono text-sm",
                  line.credit ? "text-success" : "text-foreground",
                )}
              >
                {line.credit ? "−" : ""}
                {formatUGX(Math.abs(line.amount))}
              </td>
            </tr>
          ))}
          <tr className="bg-background/60">
            <th scope="row" className="px-4 py-3 text-left font-sans text-sm text-muted-foreground">
              Package subtotal
            </th>
            <td data-readout className="px-4 py-3 text-right font-mono text-sm">
              {formatUGX(subtotal)}
            </td>
          </tr>
          {addOnTotal > 0 ? (
            <tr className="bg-background/60">
              <th scope="row" className="px-4 py-3 text-left font-sans text-sm text-muted-foreground">
                Add-ons
              </th>
              <td data-readout className="px-4 py-3 text-right font-mono text-sm">
                {formatUGX(addOnTotal)}
              </td>
            </tr>
          ) : null}
          <tr className="bg-card">
            <th scope="row" className="px-4 py-4 text-left font-display text-base font-semibold">
              Total
            </th>
            <td className="px-4 py-4 text-right">
              <span
                data-readout
                className="font-mono text-xl font-bold text-primary-ink"
              >
                {formatUGX(total)}
              </span>
              <span
                data-readout
                className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
              >
                includes {formatUGX(vatIncluded)} VAT
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PartyStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const canDecrease = value > min;
  const canIncrease = value < max;
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-hairline bg-background/50 p-3.5">
      <span className="min-w-0">
        <span className="block font-sans text-sm text-foreground">{label}</span>
        <span className="mt-0.5 block font-sans text-xs text-muted-foreground">
          {hint}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={!canDecrease}
          aria-label={`One fewer ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary-ink disabled:opacity-40 disabled:hover:border-hairline disabled:hover:text-muted-foreground"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden />
        </button>
        <span
          data-readout
          aria-live="polite"
          className="w-7 text-center font-mono text-base font-semibold text-foreground"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={!canIncrease}
          aria-label={`One more ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary-ink disabled:opacity-40 disabled:hover:border-hairline disabled:hover:text-muted-foreground"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </button>
      </span>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-hairline hover:border-primary/50",
      )}
    >
      {checked ? <Check className="h-3 w-3" aria-hidden /> : null}
    </button>
  );
}
