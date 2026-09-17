/** UGX formatting, shared by server and client components. */

export function formatUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString("en-UG")}`;
}

/** Compact form for cards and chips: UGX 85k / UGX 1.2m. */
export function formatUGXShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`;
  }
  if (amount >= 10_000) {
    return `UGX ${Math.round(amount / 1000)}k`;
  }
  return formatUGX(amount);
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-UG");
}

/** yyyy-mm-dd for a Date, in local time. */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** "Fri 4 Apr 2026" for a yyyy-mm-dd string. Empty input returns "". */
export function formatDateLabel(value: string): string {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Add hours to a date, skipping nothing — used for lead-time checks. */
export function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
