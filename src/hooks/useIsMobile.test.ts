import { describe, it, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  PHONE_MAX_WIDTH_PX,
  TABLET_MAX_WIDTH_PX,
  shouldUseMobileSkin,
  useIsMobile,
} from "./useIsMobile";

/**
 * Mocks matchMedia so only the `(pointer: coarse)` query is meaningful, and
 * drives the hook off an explicit viewport width.
 */
function mockViewport(width: number, coarsePointer: boolean) {
  window.innerWidth = width;
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes("pointer: coarse") ? coarsePointer : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

describe("shouldUseMobileSkin", () => {
  it("uses the phone skin for a typical phone width", () => {
    expect(shouldUseMobileSkin(390, false)).toBe(true);
    expect(shouldUseMobileSkin(430, false)).toBe(true);
  });

  it("uses the phone skin for a tablet in portrait, even with a mouse", () => {
    expect(shouldUseMobileSkin(768, false)).toBe(true);
    expect(shouldUseMobileSkin(PHONE_MAX_WIDTH_PX, false)).toBe(true);
  });

  it("uses the phone skin for a tablet in landscape (touch screen)", () => {
    expect(shouldUseMobileSkin(1024, true)).toBe(true);
    expect(shouldUseMobileSkin(1180, true)).toBe(true);
    expect(shouldUseMobileSkin(TABLET_MAX_WIDTH_PX, true)).toBe(true);
  });

  it("keeps the Windows desktop on a wide window even if it reports touch", () => {
    expect(shouldUseMobileSkin(TABLET_MAX_WIDTH_PX + 1, true)).toBe(false);
    expect(shouldUseMobileSkin(1920, true)).toBe(false);
  });

  it("keeps the Windows desktop on a narrow window that has no touch screen", () => {
    expect(shouldUseMobileSkin(PHONE_MAX_WIDTH_PX + 1, false)).toBe(false);
  });
});

describe("useIsMobile", () => {
  const original = window.matchMedia;
  const originalWidth = window.innerWidth;

  afterEach(() => {
    window.matchMedia = original;
    window.innerWidth = originalWidth;
  });

  it("is true for a phone width", () => {
    mockViewport(390, false);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
  });

  it("is true for a landscape tablet with a coarse pointer", () => {
    mockViewport(1180, true);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
  });

  it("is false for a desktop-width viewport", () => {
    mockViewport(1440, false);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });

  it("is false for a narrow desktop window with no touch screen", () => {
    mockViewport(PHONE_MAX_WIDTH_PX + 1, false);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });
});
