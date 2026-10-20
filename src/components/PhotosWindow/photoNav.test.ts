import { describe, it, expect } from "vitest";
import { MAX_ZOOM, MIN_ZOOM, clampZoom, distance, nextIndex, pinchZoom, prevIndex, swipeDirection } from "./photoNav";

describe("photo navigation", () => {
  it("wraps in both directions", () => {
    expect(nextIndex(2, 3)).toBe(0);
    expect(prevIndex(0, 3)).toBe(2);
    expect(nextIndex(0, 0)).toBe(0);
  });

  it("keeps zoom within bounds and survives NaN", () => {
    expect(clampZoom(0.2)).toBe(MIN_ZOOM);
    expect(clampZoom(99)).toBe(MAX_ZOOM);
    expect(clampZoom(NaN)).toBe(MIN_ZOOM);
  });

  it("scales a pinch proportionally to the finger distance", () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(pinchZoom(1, 100, 200)).toBe(2);
    expect(pinchZoom(2, 100, 10)).toBe(MIN_ZOOM);
    expect(pinchZoom(1, 0, 50)).toBe(1);
  });

  it("only treats long horizontal drags as swipes", () => {
    expect(swipeDirection(-80)).toBe(-1);
    expect(swipeDirection(80)).toBe(1);
    expect(swipeDirection(20)).toBe(0);
  });
});
