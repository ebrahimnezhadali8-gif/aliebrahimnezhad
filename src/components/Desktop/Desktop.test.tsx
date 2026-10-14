import { screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import Desktop from "./Desktop";
import { renderWithProviders } from "../../test/testUtils";

describe("Desktop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the wallpaper, desktop icons and taskbar", () => {
    renderWithProviders(<Desktop />);
    expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-icons")).toBeInTheDocument();
    expect(screen.getByTestId("taskbar")).toBeInTheDocument();
  });

  it("right-click opens the context menu, and unchecking 'Show desktop icons' hides the icons", () => {
    renderWithProviders(<Desktop />);
    fireEvent.contextMenu(screen.getByTestId("desktop"));
    expect(screen.getByTestId("desktop-context-menu")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Show desktop icons"));
    expect(screen.queryByTestId("desktop-icons")).not.toBeInTheDocument();
  });

  it("'Next background' swaps the wallpaper image", () => {
    renderWithProviders(<Desktop />);
    const before = screen.getByTestId("wallpaper").style.backgroundImage;
    fireEvent.contextMenu(screen.getByTestId("desktop"));
    fireEvent.click(screen.getByText("Next background"));
    const after = screen.getByTestId("wallpaper").style.backgroundImage;
    expect(after).not.toBe(before);
  });

  it("'Refresh' flashes the screen once", () => {
    vi.useFakeTimers();
    try {
      renderWithProviders(<Desktop />);
      fireEvent.contextMenu(screen.getByTestId("desktop"));
      fireEvent.click(screen.getByText("Refresh"));
      expect(screen.getByTestId("refresh-flash")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.queryByTestId("refresh-flash")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the screen undimmed while brightness is at 100%", () => {
    renderWithProviders(<Desktop />);
    expect(screen.queryByTestId("screen-dimmer")).not.toBeInTheDocument();
  });

  it("dims the desktop once the tray brightness slider is lowered", () => {
    renderWithProviders(<Desktop />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    fireEvent.change(screen.getByTestId("brightness-slider"), { target: { value: "50" } });

    const dimmer = screen.getByTestId("screen-dimmer");
    expect(dimmer).toBeInTheDocument();
    expect(Number.parseFloat(dimmer.style.opacity)).toBeCloseTo(0.5);

    fireEvent.change(screen.getByTestId("brightness-slider"), { target: { value: "100" } });
    expect(screen.queryByTestId("screen-dimmer")).not.toBeInTheDocument();
  });

  it("does not open the context menu when the Start menu is dismissed by clicking elsewhere", () => {
    renderWithProviders(<Desktop />);
    fireEvent.contextMenu(screen.getByTestId("desktop"));
    expect(screen.getByTestId("desktop-context-menu")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("taskbar"));
    expect(screen.queryByTestId("desktop-context-menu")).not.toBeInTheDocument();
  });
});
