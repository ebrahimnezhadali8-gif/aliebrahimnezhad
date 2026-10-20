import { describe, it, expect } from "vitest";
import { HISTORY_LENGTH, nextSample, pushHistory, toPoints } from "./perfSim";

describe("perfSim", () => {
  it("random-walks but never leaves 0–100", () => {
    let value = 50;
    let seed = 1;
    const rng = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 500; i += 1) {
      value = nextSample(value, rng, 30);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    expect(nextSample(100, () => 1, 50)).toBe(100);
    expect(nextSample(0, () => 0, 50)).toBe(0);
  });

  it("keeps only the newest samples", () => {
    let history: number[] = [];
    for (let i = 0; i < HISTORY_LENGTH + 10; i += 1) history = pushHistory(history, i);
    expect(history).toHaveLength(HISTORY_LENGTH);
    expect(history[history.length - 1]).toBe(HISTORY_LENGTH + 9);
  });

  it("maps values to polyline points, 100% at the top", () => {
    expect(toPoints([], 100, 50)).toBe("");
    const points = toPoints(Array(HISTORY_LENGTH).fill(100), 590, 50);
    expect(points.startsWith("0.0,0.0")).toBe(true);
    expect(points.endsWith("590.0,0.0")).toBe(true);
    expect(toPoints([0], 100, 50)).toMatch(/,50\.0$/);
  });
});
