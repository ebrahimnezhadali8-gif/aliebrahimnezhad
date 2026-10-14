import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BootScreen from "./BootScreen";

describe("BootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the boot screen initially", () => {
    render(<BootScreen onFinished={() => {}} duration={3000} />);
    expect(screen.getByTestId("boot-screen")).toBeInTheDocument();
    expect(screen.getByText("Starting…")).toBeInTheDocument();
  });

  it("does not call onFinished before the duration elapses", () => {
    const onFinished = vi.fn();
    render(<BootScreen onFinished={onFinished} duration={3000} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onFinished).not.toHaveBeenCalled();
  });

  it("calls onFinished after the boot duration plus fade-out", () => {
    const onFinished = vi.fn();
    render(<BootScreen onFinished={onFinished} duration={3000} />);
    act(() => {
      vi.advanceTimersByTime(3000 + 900);
    });
    expect(onFinished).toHaveBeenCalledTimes(1);
  });

  it("adds the fade-out class once the duration elapses", () => {
    render(<BootScreen onFinished={() => {}} duration={3000} />);
    const el = screen.getByTestId("boot-screen");
    expect(el.className).not.toMatch(/fade-out/);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(el.className).toMatch(/fade-out/);
  });
});
