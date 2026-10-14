import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WindowManagerProvider, useWindowManager } from "./WindowManagerContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <WindowManagerProvider>{children}</WindowManagerProvider>
);

describe("WindowManagerContext", () => {
  it("openWindow adds the window as open and not minimized, and makes it active", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    expect(result.current.openWindows.resume).toBeDefined();
    expect(result.current.openWindows.resume.minimized).toBe(false);
    expect(result.current.activeWindowId).toBe("resume");
  });

  it("minimizeWindow keeps the window registered (still in openWindows) but marks it minimized", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    act(() => result.current.minimizeWindow("resume"));
    // Still present -> taskbar button must remain.
    expect(result.current.openWindows.resume).toBeDefined();
    expect(result.current.openWindows.resume.minimized).toBe(true);
    // No longer the active/focused window.
    expect(result.current.activeWindowId).toBeNull();
  });

  it("closeWindow removes the window entirely (unlike minimize)", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    act(() => result.current.closeWindow("resume"));
    expect(result.current.openWindows.resume).toBeUndefined();
  });

  it("focusWindow restores a minimized window (clears minimized flag) and makes it active", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    act(() => result.current.minimizeWindow("resume"));
    act(() => result.current.focusWindow("resume"));
    expect(result.current.openWindows.resume.minimized).toBe(false);
    expect(result.current.activeWindowId).toBe("resume");
  });

  it("openWindow on an already-open window restores it instead of duplicating state", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    act(() => result.current.minimizeWindow("resume"));
    act(() => result.current.openWindow("resume"));
    expect(Object.keys(result.current.openWindows)).toEqual(["resume"]);
    expect(result.current.openWindows.resume.minimized).toBe(false);
  });

  it("showDesktop minimizes all open windows rather than closing them", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.openWindow("resume"));
    act(() => result.current.openWindow("about"));
    act(() => result.current.showDesktop());
    expect(result.current.openWindows.resume.minimized).toBe(true);
    expect(result.current.openWindows.about.minimized).toBe(true);
    expect(result.current.activeWindowId).toBeNull();
  });

  it("opening a window closes the start menu", () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });
    act(() => result.current.toggleStartMenu());
    expect(result.current.startMenuOpen).toBe(true);
    act(() => result.current.openWindow("resume"));
    expect(result.current.startMenuOpen).toBe(false);
  });
});
