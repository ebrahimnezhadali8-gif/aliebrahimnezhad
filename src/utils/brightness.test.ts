import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  BRIGHTNESS_STORAGE_KEY,
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
  clampBrightness,
  dimOpacityFor,
  readStoredBrightness,
  storeBrightness,
} from "./brightness";

describe("brightness helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("clampBrightness", () => {
    it("passes through values already inside the allowed range", () => {
      expect(clampBrightness(0.75)).toBe(0.75);
      expect(clampBrightness(MAX_BRIGHTNESS)).toBe(MAX_BRIGHTNESS);
      expect(clampBrightness(MIN_BRIGHTNESS)).toBe(MIN_BRIGHTNESS);
    });

    it("never goes below the readable floor, so the desktop can't become pure black", () => {
      expect(clampBrightness(0)).toBe(MIN_BRIGHTNESS);
      expect(clampBrightness(-5)).toBe(MIN_BRIGHTNESS);
    });

    it("never goes above full brightness", () => {
      expect(clampBrightness(2)).toBe(MAX_BRIGHTNESS);
      expect(clampBrightness(Number.POSITIVE_INFINITY)).toBe(MAX_BRIGHTNESS);
    });

    it("falls back to full brightness for non-numbers", () => {
      expect(clampBrightness(Number.NaN)).toBe(MAX_BRIGHTNESS);
    });
  });

  describe("dimOpacityFor", () => {
    it("is fully transparent at full brightness", () => {
      expect(dimOpacityFor(1)).toBe(0);
    });

    it("darkens as brightness drops", () => {
      expect(dimOpacityFor(0.8)).toBeCloseTo(0.2);
      expect(dimOpacityFor(0.3)).toBeCloseTo(0.7);
    });

    it("is never negative even for out-of-range brightness", () => {
      expect(dimOpacityFor(5)).toBe(0);
    });
  });

  describe("storage round-trip", () => {
    it("defaults to full brightness when nothing was ever saved", () => {
      expect(readStoredBrightness()).toBe(MAX_BRIGHTNESS);
    });

    it("persists and restores a chosen level", () => {
      storeBrightness(0.45);
      expect(window.localStorage.getItem(BRIGHTNESS_STORAGE_KEY)).toBe("0.45");
      expect(readStoredBrightness()).toBeCloseTo(0.45);
    });

    it("clamps before storing so a bad value can never be written", () => {
      storeBrightness(-3);
      expect(readStoredBrightness()).toBe(MIN_BRIGHTNESS);
    });

    it("ignores a corrupt stored value instead of throwing", () => {
      window.localStorage.setItem(BRIGHTNESS_STORAGE_KEY, "not-a-number");
      expect(readStoredBrightness()).toBe(MAX_BRIGHTNESS);
    });

    it("survives storage being unavailable (private browsing)", () => {
      const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      expect(readStoredBrightness()).toBe(MAX_BRIGHTNESS);

      const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      expect(() => storeBrightness(0.5)).not.toThrow();
      expect(getItem).toBeDefined();
      expect(setItem).toBeDefined();
    });
  });
});
