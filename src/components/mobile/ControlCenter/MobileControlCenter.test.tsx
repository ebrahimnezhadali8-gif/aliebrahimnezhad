import { screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders } from "../../../test/testUtils";
import MobileControlCenter from "./MobileControlCenter";

function openPanel() {
  return renderWithProviders(<MobileControlCenter open onClose={() => {}} />);
}

describe("MobileControlCenter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing while closed", () => {
    renderWithProviders(<MobileControlCenter open={false} onClose={() => {}} />);
    expect(screen.queryByTestId("mobile-control-center")).not.toBeInTheDocument();
  });

  it("is a dialog labelled Control Center", () => {
    openPanel();
    expect(screen.getByRole("dialog", { name: "Control Center" })).toBeInTheDocument();
  });

  it("offers both a brightness and a volume slider", () => {
    openPanel();
    expect(screen.getByLabelText("Screen brightness")).toBeInTheDocument();
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
  });

  it("brightness starts at 100% and dims the screen when pulled down", () => {
    renderWithProviders(
      <>
        <div data-testid="surface" />
        <MobileControlCenter open onClose={() => {}} />
      </>
    );
    const slider = screen.getByLabelText("Screen brightness");
    expect(slider).toHaveValue("100");

    fireEvent.change(slider, { target: { value: "50" } });
    expect(slider).toHaveValue("50");
    expect(screen.getByTestId("mobile-control-center")).toHaveTextContent("Brightness 50%");
  });

  it("volume can be turned all the way down and back up", () => {
    openPanel();
    const slider = screen.getByLabelText("Volume");

    fireEvent.change(slider, { target: { value: "0" } });
    expect(slider).toHaveValue("0");
    expect(screen.getByTestId("mobile-control-center")).toHaveTextContent("Volume 0%");

    fireEvent.change(slider, { target: { value: "80" } });
    expect(slider).toHaveValue("80");
  });

  it("persists the brightness so it survives a reload", () => {
    openPanel();
    fireEvent.change(screen.getByLabelText("Screen brightness"), { target: { value: "40" } });
    expect(window.localStorage.getItem("portfolio:brightness")).toBe("0.4");
  });

  it("exposes the familiar iOS connectivity toggles as pressed/unpressed buttons", () => {
    openPanel();
    for (const name of ["Airplane", "Wi-Fi", "Bluetooth", "Focus", "Rotation"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed");
    }
  });

  it("toggles a switch on and off", () => {
    openPanel();
    const wifi = screen.getByRole("button", { name: "Wi-Fi" });
    expect(wifi).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(wifi);
    expect(wifi).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(wifi);
    expect(wifi).toHaveAttribute("aria-pressed", "true");
  });

  it("closes when the area behind the panel is tapped", () => {
    const onClose = vi.fn();
    renderWithProviders(<MobileControlCenter open onClose={onClose} />);
    fireEvent.click(screen.getByTestId("control-center-scrim"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    renderWithProviders(<MobileControlCenter open onClose={onClose} />);
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
