import { describe, it, expect } from "vitest";
import { handAngles, isDaytime, timeInZone } from "./analogClock";

describe("handAngles", () => {
  it("points straight up at 12:00:00", () => {
    expect(handAngles({ hours: 12, minutes: 0, seconds: 0, milliseconds: 0 })).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  it("puts the hour hand at 90° at 3:00 and 180° at 6:00", () => {
    expect(handAngles({ hours: 3, minutes: 0, seconds: 0, milliseconds: 0 }).hour).toBe(90);
    expect(handAngles({ hours: 18, minutes: 0, seconds: 0, milliseconds: 0 }).hour).toBe(180);
  });

  it("creeps the hour hand with the minutes", () => {
    expect(handAngles({ hours: 6, minutes: 30, seconds: 0, milliseconds: 0 }).hour).toBe(195);
  });

  it("sweeps the second hand only when asked", () => {
    const parts = { hours: 0, minutes: 0, seconds: 10, milliseconds: 500 };
    expect(handAngles(parts).second).toBe(60);
    expect(handAngles(parts, true).second).toBe(63);
  });
});

describe("timeInZone", () => {
  it("shifts the hour by the zone offset (UTC vs Tokyo is +9h)", () => {
    const noonUtc = new Date("2026-01-15T12:00:00Z");
    expect(timeInZone(noonUtc, "UTC").hours).toBe(12);
    expect(timeInZone(noonUtc, "Asia/Tokyo").hours).toBe(21);
  });

  it("falls back to local time for an unknown zone instead of throwing", () => {
    expect(() => timeInZone(new Date(), "Nope/Nowhere")).not.toThrow();
  });
});

describe("isDaytime", () => {
  it("is day from 06:00 to 17:59", () => {
    expect(isDaytime({ hours: 6, minutes: 0, seconds: 0, milliseconds: 0 })).toBe(true);
    expect(isDaytime({ hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })).toBe(false);
  });
});
