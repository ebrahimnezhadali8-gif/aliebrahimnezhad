import { describe, it, expect } from "vitest";
import {
  JALALI_LOCALE,
  formatDate,
  formatTime,
  supportsJalali,
  toPersianDigits,
} from "./jalali";

/** Persian digits back to ASCII, so two formatted strings can be compared. */
function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

describe("toPersianDigits", () => {
  it("maps every ASCII digit", () => {
    expect(toPersianDigits("0123456789")).toBe("۰۱۲۳۴۵۶۷۸۹");
  });

  it("leaves non-digits untouched", () => {
    expect(toPersianDigits("1405/07/14 AM")).toBe("۱۴۰۵/۰۷/۱۴ AM");
  });

  it("is a no-op on text that is already Persian", () => {
    expect(toPersianDigits("۱۴۰۵")).toBe("۱۴۰۵");
  });

  it("returns an empty string for empty input", () => {
    expect(toPersianDigits("")).toBe("");
  });
});

describe("formatDate", () => {
  const sample = new Date(2026, 6, 14); // 14 July 2026 local time

  it("formats a Gregorian date as day/month/year", () => {
    expect(formatDate(sample, "gregorian", "en-GB")).toMatch(/^\d{2}\/\d{2}\/2026$/);
  });

  it("formats a Jalali date with Persian digits", () => {
    const formatted = formatDate(sample, "jalali");
    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/\d/);
  });

  it("puts the Jalali year roughly six centuries behind the Gregorian one", () => {
    // 14 July 2026 falls in the Jalali year 1405.
    const jalaliYear = Number(toLatinDigits(formatDate(sample, "jalali")).match(/\d{4}/)?.[0]);
    expect(jalaliYear).toBe(1405);
    expect(2026 - jalaliYear).toBeGreaterThan(600);
  });

  it("both calendars describe the same day", () => {
    // 14 July 2026 is 23 Tir 1405.
    expect(toLatinDigits(formatDate(sample, "jalali"))).toContain("23");
  });
});

describe("formatTime", () => {
  const sample = new Date(2026, 6, 14, 9, 5);

  it("formats Gregorian time with ASCII digits", () => {
    const formatted = formatTime(sample, "gregorian");
    expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    expect(formatted).not.toMatch(/[۰-۹]/);
  });

  it("formats Jalali time with Persian digits", () => {
    const formatted = formatTime(sample, "jalali");
    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/\d/);
  });

  it("both calendars report the same wall-clock time", () => {
    expect(toLatinDigits(formatTime(sample, "jalali"))).toBe(formatTime(sample, "gregorian"));
  });
});

describe("supportsJalali", () => {
  it("detects a working Persian calendar in this runtime", () => {
    expect(supportsJalali()).toBe(true);
  });

  it("uses the documented locale", () => {
    expect(JALALI_LOCALE).toContain("persian");
  });
});