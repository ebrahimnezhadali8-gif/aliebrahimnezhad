import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useState } from "react";
import BrightnessControl from "./BrightnessControl";
import Taskbar from "./Taskbar";
import { renderWithProviders } from "../../test/testUtils";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { BRIGHTNESS_STORAGE_KEY, MIN_BRIGHTNESS } from "../../utils/brightness";

/** Mirrors what `Desktop` renders: a dimming overlay driven by the same context. */
function DesktopDimmedSurface() {
  const { dimOpacity, brightnessPercent } = useDesktopSettings();
  return (
    <>
      {dimOpacity > 0 && (
        <div data-testid="screen-dimmer" style={{ opacity: dimOpacity }} aria-hidden="true" />
      )}
      <span data-testid="brightness-readout">{brightnessPercent}%</span>
    </>
  );
}

function setBrightnessSlider(percent: number) {
  fireEvent.change(screen.getByTestId("brightness-slider"), { target: { value: String(percent) } });
}

describe("BrightnessControl", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("sits in the taskbar next to the volume control", () => {
    renderWithProviders(<Taskbar />);
    const systray = screen.getByTestId("brightness-btn").parentElement?.parentElement;
    expect(systray).toBeTruthy();
    expect(systray).toContainElement(screen.getByTestId("brightness-btn"));
    expect(systray).toContainElement(screen.getByTestId("volume-btn"));
  });

  it("starts closed, so the desktop is never dimmed by surprise", () => {
    renderWithProviders(<BrightnessControl />);
    expect(screen.queryByTestId("brightness-popover")).not.toBeInTheDocument();
  });

  it("opens a slider popover when the sun button is clicked, and toggles closed again", () => {
    renderWithProviders(<BrightnessControl />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.getByTestId("brightness-popover")).toBeInTheDocument();
    expect(screen.getByTestId("brightness-btn")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.queryByTestId("brightness-popover")).not.toBeInTheDocument();
    expect(screen.getByTestId("brightness-btn")).toHaveAttribute("aria-expanded", "false");
  });

  it("starts at full brightness", () => {
    renderWithProviders(<BrightnessControl />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.getByTestId("brightness-slider")).toHaveValue("100");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("lowers the brightness and dims the desktop when the slider is dragged down", () => {
    renderWithProviders(
      <>
        <DesktopDimmedSurface />
        <BrightnessControl />
      </>
    );
    fireEvent.click(screen.getByTestId("brightness-btn"));
    setBrightnessSlider(40);

    expect(screen.getByTestId("brightness-slider")).toHaveValue("40");
    expect(screen.getByTestId("brightness-readout")).toHaveTextContent("40%");

    const dimmer = screen.getByTestId("screen-dimmer");
    expect(dimmer).toBeInTheDocument();
    expect(Number.parseFloat(dimmer.style.opacity)).toBeCloseTo(0.6);
  });

  it("removes the dimming overlay entirely when brightness goes back to 100%", () => {
    renderWithProviders(
      <>
        <DesktopDimmedSurface />
        <BrightnessControl />
      </>
    );
    fireEvent.click(screen.getByTestId("brightness-btn"));
    setBrightnessSlider(40);
    expect(screen.getByTestId("screen-dimmer")).toBeInTheDocument();

    setBrightnessSlider(100);
    expect(screen.queryByTestId("screen-dimmer")).not.toBeInTheDocument();
  });

  it("will not go below the readable minimum, even if asked for 0%", () => {
    renderWithProviders(
      <>
        <DesktopDimmedSurface />
        <BrightnessControl />
      </>
    );
    fireEvent.click(screen.getByTestId("brightness-btn"));
    setBrightnessSlider(0);
    expect(screen.getByTestId("brightness-readout")).toHaveTextContent(`${MIN_BRIGHTNESS * 100}%`);
  });

  it("the slider's minimum matches the readable floor", () => {
    renderWithProviders(<BrightnessControl />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.getByTestId("brightness-slider")).toHaveAttribute("min", String(MIN_BRIGHTNESS * 100));
  });

  it("persists the chosen brightness so it survives a reload", () => {
    renderWithProviders(<BrightnessControl />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    setBrightnessSlider(55);
    expect(window.localStorage.getItem(BRIGHTNESS_STORAGE_KEY)).toBe("0.55");
  });

  it("restores a previously saved brightness on mount", () => {
    window.localStorage.setItem(BRIGHTNESS_STORAGE_KEY, "0.5");
    renderWithProviders(
      <>
        <DesktopDimmedSurface />
        <BrightnessControl />
      </>
    );
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.getByTestId("brightness-slider")).toHaveValue("50");
    expect(screen.getByTestId("brightness-readout")).toHaveTextContent("50%");
  });

  it("shows a 'dimmed' hint only while the screen is actually dimmed", () => {
    renderWithProviders(<BrightnessControl />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.queryByText("dimmed")).not.toBeInTheDocument();

    setBrightnessSlider(60);
    expect(screen.getByText("dimmed")).toBeInTheDocument();
  });

  it("closes when clicking outside the popover, but not when clicking inside it", () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button type="button" data-testid="outside-button">
            outside
          </button>
          <div onClick={() => setOpen(false)}>
            <BrightnessControl />
          </div>
          <span data-testid="outside-clicks">{open ? "open" : "closed"}</span>
        </div>
      );
    }
    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByTestId("brightness-btn"));
    expect(screen.getByTestId("brightness-popover")).toBeInTheDocument();

    // Inside the popover → stays open.
    fireEvent.mouseDown(screen.getByTestId("brightness-slider"));
    expect(screen.getByTestId("brightness-popover")).toBeInTheDocument();

    // Truly outside → closes.
    fireEvent.mouseDown(screen.getByTestId("outside-button"));
    expect(screen.queryByTestId("brightness-popover")).not.toBeInTheDocument();
  });
});
