import type { CalendarSystem } from "./calendar";
import { JALALI_LOCALE, toPersianDigits } from "./jalali";

export interface DayCell {
  date: Date;
  day: number;
  /** Label to print (Persian digits in the Jalali calendar). */
  label: string;
  inMonth: boolean;
  isToday: boolean;
  /** Official fixed-date holiday (Iran, Jalali calendar only). */
  holiday: boolean;
}

export interface MonthView {
  title: string;
  weekdays: string[];
  weeks: DayCell[][];
}


/** Fixed-date Iranian official holidays as "month/day" in the Jalali calendar. */
const JALALI_HOLIDAYS = new Set([
  "1/1", "1/2", "1/3", "1/4", // Nowruz
  "1/12", "1/13", // Islamic Republic Day, Sizdah Bedar
  "3/14", "3/15", // Khomeini's death, 15 Khordad uprising
  "11/22", // Revolution victory
  "12/29", // Oil nationalisation
]);

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface JalaliParts {
  year: number;
  month: number;
  day: number;
}

export function jalaliParts(date: Date): JalaliParts {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { year: read("year"), month: read("month"), day: read("day") };
}

/** First day of the month containing `date`, in the given calendar. */
export function firstOfMonth(date: Date, calendar: CalendarSystem): Date {
  if (calendar === "gregorian") return new Date(date.getFullYear(), date.getMonth(), 1, 12);
  return addDays(startOfDay(date), -(jalaliParts(date).day - 1));
}

export function daysInMonth(date: Date, calendar: CalendarSystem): number {
  const first = firstOfMonth(date, calendar);
  if (calendar === "gregorian") return new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const month = jalaliParts(first).month;
  let length = 29;
  while (jalaliParts(addDays(first, length)).month === month) length += 1;
  return length;
}

/** A date inside the month `delta` months away (always its first day). */
export function shiftMonth(date: Date, calendar: CalendarSystem, delta: number): Date {
  let cursor = firstOfMonth(date, calendar);
  for (let step = 0; step < Math.abs(delta); step += 1) {
    cursor =
      delta > 0
        ? addDays(cursor, daysInMonth(cursor, calendar))
        : firstOfMonth(addDays(cursor, -1), calendar);
  }
  return cursor;
}

/**
 * The cells of a month, padded to whole weeks. Weeks start on Saturday in the
 * Jalali calendar (as in Iran) and on Sunday in the Gregorian one.
 */
export function monthView(anchor: Date, calendar: CalendarSystem, today: Date = new Date()): MonthView {
  const jalali = calendar === "jalali";
  const first = firstOfMonth(anchor, calendar);
  const length = daysInMonth(first, calendar);
  const weekStart = jalali ? 6 : 0;
  const lead = (first.getDay() - weekStart + 7) % 7;
  const total = Math.ceil((lead + length) / 7) * 7;
  const month = jalali ? jalaliParts(first).month : first.getMonth();

  const cells: DayCell[] = Array.from({ length: total }, (_, index) => {
    const date = addDays(first, index - lead);
    const parts = jalali ? jalaliParts(date) : null;
    const day = parts ? parts.day : date.getDate();
    const cellMonth = parts ? parts.month : date.getMonth();
    return {
      date,
      day,
      label: jalali ? toPersianDigits(String(day)) : String(day),
      inMonth: cellMonth === month,
      isToday: sameDay(date, today),
      holiday: parts ? JALALI_HOLIDAYS.has(`${parts.month}/${parts.day}`) : false,
    };
  });

  const locale = jalali ? JALALI_LOCALE : "en-US";
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);
  // 2023-01-01 was a Sunday; walk a week from there to get ordered weekday names.
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: jalali ? "narrow" : "short" });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFormatter.format(new Date(2023, 0, 1 + ((weekStart + i) % 7), 12))
  );

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { title, weekdays, weeks };
}

