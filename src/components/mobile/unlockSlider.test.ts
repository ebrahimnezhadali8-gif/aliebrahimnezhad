import { describe, it, expect } from "vitest";
import { clampDrag, isUnlocked } from "./unlockSlider";

describe("unlock slider", () => {
  it("clamps drags to the track", () => {
    expect(clampDrag(-30, 200)).toBe(0);
    expect(clampDrag(500, 200)).toBe(200);
    expect(clampDrag(80, 200)).toBe(80);
    expect(clampDrag(NaN, 200)).toBe(0);
  });

  it("unlocks only near the far end", () => {
    expect(isUnlocked(100, 200)).toBe(false);
    expect(isUnlocked(180, 200)).toBe(true);
    expect(isUnlocked(10, 0)).toBe(false);
  });
});
