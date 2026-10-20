import { describe, it, expect } from "vitest";
import { daysInMonth, firstOfMonth, jalaliParts, monthView, shiftMonth } from "./calendarGrid";
import { supportsJalali } from "./jalali";

const noon = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);

describe("gregorian month view", () => {
  it("pads to whole Sunday-first weeks and marks today", () => {
    const view = monthView(noon(2026, 2, 10), "gregorian", noon(2026, 2, 10));
    expect(view.weeks.every((week) => week.length === 7)).toBe(true);
    expect(view.weekdays[0]).toMatch(/sun/i);
    // Feb 2026 starts on a Sunday and has 28 days → exactly four rows.
    expect(view.weeks).toHaveLength(4);
    expect(view.weeks[0][0].label).toBe("1");
    const today = view.weeks.flat().filter((cell) => cell.isToday);
    expect(today).toHaveLength(1);
    expect(today[0].day).toBe(10);
  });

  it("knows month lengths including leap years", () => {
    expect(daysInMonth(noon(2024, 2, 5), "gregorian")).toBe(29);
    expect(daysInMonth(noon(2026, 2, 5), "gregorian")).toBe(28);
  });

  it("shifts across year boundaries in both directions", () => {
    expect(shiftMonth(noon(2026, 12, 15), "gregorian", 1)).toEqual(noon(2027, 1, 1));
    expect(shiftMonth(noon(2026, 1, 15), "gregorian", -1)).toEqual(noon(2025, 12, 1));
  });
});

describe.skipIf(!supportsJalali())("jalali month view", () => {
  it("converts a known date: 2026-03-21 is 1 Farvardin 1405", () => {
    expect(jalaliParts(noon(2026, 3, 21))).toEqual({ year: 1405, month: 1, day: 1 });
  });

  it("finds the first of the Jalali month and its length", () => {
    const first = firstOfMonth(noon(2026, 4, 5), "jalali");
    expect(jalaliParts(first)).toEqual({ year: 1405, month: 1, day: 1 });
    expect(daysInMonth(noon(2026, 4, 5), "jalali")).toBe(31);
  });

  it("uses Saturday-first weeks, Persian digits and flags Nowruz as a holiday", () => {
    const view = monthView(noon(2026, 3, 25), "jalali", noon(2026, 3, 25));
    expect(view.weeks.every((week) => week.length === 7)).toBe(true);
    const holidays = view.weeks.flat().filter((cell) => cell.inMonth && cell.holiday);
    expect(holidays.map((cell) => cell.day)).toEqual([1, 2, 3, 4, 12, 13]);
    expect(view.weeks[1][0].label).toMatch(/[۰-۹]/);
  });

  it("moves between Jalali months", () => {
    const next = shiftMonth(noon(2026, 3, 25), "jalali", 1);
    expect(jalaliParts(next)).toEqual({ year: 1405, month: 2, day: 1 });
    const back = shiftMonth(next, "jalali", -1);
    expect(jalaliParts(back)).toEqual({ year: 1405, month: 1, day: 1 });
  });
});
