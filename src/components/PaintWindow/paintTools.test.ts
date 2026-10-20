import { describe, it, expect } from "vitest";
import { MAX_SIZE, MIN_SIZE, clampSize, drawingMailBody, strokeStyleFor, toCanvasPoint } from "./paintTools";

describe("paint tools", () => {
  it("clamps brush sizes", () => {
    expect(clampSize(0)).toBe(MIN_SIZE);
    expect(clampSize(500)).toBe(MAX_SIZE);
    expect(clampSize(NaN)).toBe(MIN_SIZE);
    expect(clampSize(7.6)).toBe(8);
  });

  it("draws with the chosen colour, but erases with white at double width", () => {
    expect(strokeStyleFor("pen", "#ed1c24", 6)).toEqual({ color: "#ed1c24", width: 6 });
    expect(strokeStyleFor("eraser", "#ed1c24", 6)).toEqual({ color: "#ffffff", width: 12 });
  });

  it("maps client coordinates to canvas pixels when the canvas is CSS-scaled", () => {
    const rect = { left: 100, top: 50, width: 400, height: 200 };
    const canvas = { width: 800, height: 400 };
    expect(toCanvasPoint({ x: 300, y: 150 }, rect, canvas)).toEqual({ x: 400, y: 200 });
    expect(toCanvasPoint({ x: 0, y: 0 }, { left: 0, top: 0, width: 0, height: 0 }, canvas)).toEqual({ x: 0, y: 0 });
  });

  it("mentions the saved file in the mail body", () => {
    expect(drawingMailBody("drawing.png")).toContain("drawing.png");
  });
});
