import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";
import { PHONE_MAX_WIDTH_PX, TABLET_MAX_WIDTH_PX } from "./hooks/useIsMobile";

/** Mocks the viewport the way `useIsMobile` reads it: width + coarse pointer. */
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

describe("App", () => {
  const originalMatchMedia = window.matchMedia;
  const originalWidth = window.innerWidth;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalWidth;
  });

  it("shows the boot screen first, with the desktop present but invisible underneath", () => {
    mockViewport(1440, false);
    render(<App />);
    expect(screen.getByTestId("boot-screen")).toBeInTheDocument();
    expect(screen.getByTestId("desktop")).toBeInTheDocument();
    expect(screen.getByTestId("desktop").className).not.toMatch(/desktop--visible/);
  });

  it("removes the boot screen and reveals the desktop after the boot duration", () => {
    mockViewport(1440, false);
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(3000 + 900);
    });
    expect(screen.queryByTestId("boot-screen")).not.toBeInTheDocument();
    expect(screen.getByTestId("desktop").className).toMatch(/desktop--visible/);
  });

  it("renders the iPhone skin instead of the Windows desktop on a phone width", () => {
    mockViewport(390, true);
    render(<App />);
    expect(screen.getByTestId("mobile-root")).toBeInTheDocument();
    expect(screen.queryByTestId("desktop")).not.toBeInTheDocument();
  });

  it("renders the iPhone skin on a tablet in portrait", () => {
    mockViewport(768, true);
    render(<App />);
    expect(screen.getByTestId("mobile-root")).toBeInTheDocument();
    expect(screen.queryByTestId("desktop")).not.toBeInTheDocument();
  });

  it("renders the iPhone skin on a touch-screen tablet in landscape too", () => {
    mockViewport(TABLET_MAX_WIDTH_PX, true);
    render(<App />);
    expect(screen.getByTestId("mobile-root")).toBeInTheDocument();
    expect(screen.queryByTestId("desktop")).not.toBeInTheDocument();
  });

  it("keeps the Windows desktop on a narrow window that has no touch screen", () => {
    mockViewport(PHONE_MAX_WIDTH_PX + 1, false);
    render(<App />);
    expect(screen.getByTestId("desktop")).toBeInTheDocument();
    expect(screen.queryByTestId("mobile-root")).not.toBeInTheDocument();
  });
});
