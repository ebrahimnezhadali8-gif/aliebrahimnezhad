/**
 * Jalali (Persian / Solar Hijri) calendar support. The heavy lifting is in
 * `utils/jalali.ts`; this only owns the "gregorian | jalali" preference and how
 * it is persisted.
 */

export type CalendarSystem = "gregorian" | "jalali";

export const CALENDAR_STORAGE_KEY = "portfolio:calendar";

export function isCalendarSystem(value: unknown): value is CalendarSystem {
  return value === "gregorian" || value === "jalali";
}