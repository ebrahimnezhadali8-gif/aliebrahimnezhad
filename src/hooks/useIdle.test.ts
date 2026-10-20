import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useIdle } from "./useIdle";

describe("useIdle", () => {
  afterEach(() => vi.useRealTimers());

  it("turns idle after the timeout without input", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle(1000));
    expect(result.current.idle).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.idle).toBe(true);
  });

  it("any input before the timeout restarts the countdown", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle(1000));
    act(() => {
      vi.advanceTimersByTime(800);
      window.dispatchEvent(new Event("mousemove"));
      vi.advanceTimersByTime(800);
    });
    expect(result.current.idle).toBe(false);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.idle).toBe(true);
  });

  it("wake() clears idle and re-arms", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle(1000));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => result.current.wake());
    expect(result.current.idle).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.idle).toBe(true);
  });

  it("never goes idle when disabled", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useIdle(1000, false));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.idle).toBe(false);
  });
});
