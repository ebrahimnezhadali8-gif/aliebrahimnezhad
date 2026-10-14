import { describe, it, expect } from "vitest";
import { clampZoom, zoomIn, zoomOut, ZOOM_MIN, ZOOM_MAX } from "./zoom";

describe("PDF zoom helpers", () => {
  it("does not zoom in past ZOOM_MAX", () => {
    expect(zoomIn(ZOOM_MAX)).toBe(ZOOM_MAX);
    expect(zoomIn(ZOOM_MAX - 5)).toBe(ZOOM_MAX);
  });

  it("does not zoom out past ZOOM_MIN", () => {
    expect(zoomOut(ZOOM_MIN)).toBe(ZOOM_MIN);
    expect(zoomOut(ZOOM_MIN + 5)).toBe(ZOOM_MIN);
  });

  it("steps by 10 within range", () => {
    expect(zoomIn(100)).toBe(110);
    expect(zoomOut(100)).toBe(90);
  });

  it("clampZoom clamps out-of-range values", () => {
    expect(clampZoom(500)).toBe(ZOOM_MAX);
    expect(clampZoom(-20)).toBe(ZOOM_MIN);
    expect(clampZoom(120)).toBe(120);
  });
});
