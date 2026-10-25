const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/**
 * "3 days ago" / "in 2 hours", in the viewer's locale (`useLocale()`), for
 * timestamps a person scans rather than reads exactly (session sign-in times).
 * Picks the largest whole unit; anything under a minute reads "just now",
 * because "0 minutes ago" and "12 seconds ago" are both noise in a list.
 * `now` is injectable so tests do not depend on the clock.
 */
export function relativeTime(date: Date, locale: string | undefined, now = Date.now()): string {
  const seconds = Math.round((date.getTime() - now) / 1000);
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return format.format(Math.trunc(seconds / size), unit);
  }
  return "just now";
}
