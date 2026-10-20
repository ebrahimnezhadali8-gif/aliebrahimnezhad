import { describe, it, expect } from "vitest";
import { SCREENSAVER_KINDS, pickScreensaver, stepBubble, stepMover } from "./motion";

describe("stepMover", () => {
  it("moves in a straight line inside the box", () => {
    expect(stepMover({ x: 10, y: 10, vx: 2, vy: 3 }, 100, 100)).toEqual({ x: 12, y: 13, vx: 2, vy: 3 });
  });

  it("bounces off every wall and keeps the point inside", () => {
    expect(stepMover({ x: 99, y: 50, vx: 4, vy: 0 }, 100, 100)).toEqual({ x: 97, y: 50, vx: -4, vy: 0 });
    expect(stepMover({ x: 1, y: 50, vx: -4, vy: 0 }, 100, 100)).toEqual({ x: 3, y: 50, vx: 4, vy: 0 });
    expect(stepMover({ x: 50, y: 99, vx: 0, vy: 5 }, 100, 100).vy).toBe(-5);
    expect(stepMover({ x: 50, y: 1, vx: 0, vy: -5 }, 100, 100).vy).toBe(5);
  });

  it("never escapes over many steps", () => {
    let mover = { x: 50, y: 50, vx: 7.3, vy: -5.1 };
    for (let i = 0; i < 2000; i += 1) {
      mover = stepMover(mover, 120, 80);
      expect(mover.x).toBeGreaterThanOrEqual(0);
      expect(mover.x).toBeLessThanOrEqual(120);
      expect(mover.y).toBeGreaterThanOrEqual(0);
      expect(mover.y).toBeLessThanOrEqual(80);
    }
  });
});

describe("stepBubble", () => {
  it("floats upward", () => {
    const next = stepBubble({ x: 40, y: 100, radius: 10, speed: 2, hue: 100 }, 200, 200);
    expect(next.y).toBe(98);
  });

  it("respawns below the screen once it has left the top", () => {
    const next = stepBubble({ x: 40, y: -20, radius: 10, speed: 2, hue: 100 }, 200, 300, () => 0.5);
    expect(next.y).toBeGreaterThan(300);
    expect(next.x).toBe(100);
  });
});

describe("pickScreensaver", () => {
  it("returns a known kind for any rng value", () => {
    for (const value of [0, 0.34, 0.99, 1]) {
      expect(SCREENSAVER_KINDS).toContain(pickScreensaver(() => value));
    }
  });
});
