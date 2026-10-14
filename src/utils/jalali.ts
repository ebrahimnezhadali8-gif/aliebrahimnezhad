/**
 * Jalali (Shamsi / Solar Hijri) date formatting, built on the platform's own
 * `Intl` implementation (`fa-IR-u-ca-persian`) rather than a hand-rolled
 * conversion table — ICU has been shipping the Persian calendar for years, so
 * this stays correct and tiny.
 */

import { CALENDAR_STORAGE_KEY, isCalendarSystem, type CalendarSystem } from "./calendar";

export { CALENDAR_STORAGE_KEY, isCalendarSystem };
export type { CalendarSystem };

export const JALALI_LOCALE = "fa-IR-u-ca-persian";

/** Persian digits, used so the numbers sit next to the Persian month names. */
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Replaces ASCII digits with Persian ones. Exported so it can be tested alone. */
export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Formats the full date, e.g. "۱۴ مهر ۱۴۰۵" or "14/07/2026". */
export function formatDate(date: Date, calendar: CalendarSystem, locale = "en-GB"): string {
  if (calendar === "jalali") {
    return new Intl.DateTimeFormat(JALALI_LOCALE, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Formats the time, using Persian digits when the Jalali calendar is active. */
export function formatTime(date: Date, calendar: CalendarSystem, locale = "en-GB"): string {
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return calendar === "jalali" ? toPersianDigits(time) : time;
}

/**
 * True when the Jalali formatter actually produced a real year — a guard for
 * environments whose ICU build lacks the Persian calendar, so the UI can fall
 * back to Gregorian instead of showing mojibake. Matches Persian *and* ASCII
 * digits, since the Persian locale emits Persian numerals.
 */
export function supportsJalali(): boolean {
  try {
    const sample = new Date(2026, 0, 1);
    const formatted = new Intl.DateTimeFormat(JALALI_LOCALE, { year: "numeric" }).format(sample);
    return /[0-9۰-۹]/.test(formatted);
  } catch {
    return false;
  }
}