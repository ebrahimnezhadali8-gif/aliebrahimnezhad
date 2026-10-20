import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useEffect } from "react";
import StartMenu from "./StartMenu/StartMenu";
import Taskbar from "./Taskbar/Taskbar";
import RecycleBinWindow from "./RecycleBinWindow/RecycleBinWindow";
import SettingsWindow from "./SettingsWindow/SettingsWindow";
import MobileControlCenter from "./mobile/ControlCenter/MobileControlCenter";
import TerminalApp from "./mobile/apps/TerminalApp";
import ClockApp from "./mobile/apps/ClockApp";
import { useWindowManager } from "../context/WindowManagerContext";
import { renderWithProviders } from "../test/testUtils";
import { PHONE_PREVIEW_KEY } from "../test/keys";

function Open({ id, children }: { id: string; children: React.ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

function OpenStart() {
  const { toggleStartMenu } = useWindowManager();
  useEffect(() => {
    toggleStartMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <StartMenu />;
}

describe("desktop extras", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => document.documentElement.removeAttribute("data-theme"));

  it("Start menu search finds apps, projects and skills", () => {
    renderWithProviders(<OpenStart />);
    fireEvent.change(screen.getByTestId("start-menu-search"), { target: { value: "workchi" } });
    expect(screen.getByTestId("start-menu-results")).toHaveTextContent(/workchi/i);
    fireEvent.change(screen.getByTestId("start-menu-search"), { target: { value: "zzzzqq" } });
    expect(screen.getByTestId("start-menu-results")).toHaveTextContent("No results");
  });

  it("triple-clicking Start shows the blue screen; a key press dismisses it", () => {
    renderWithProviders(<Taskbar />);
    const start = screen.getByRole("button", { name: /start menu/i });
    fireEvent.click(start);
    fireEvent.click(start);
    fireEvent.click(start);
    expect(screen.getByTestId("bsod")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "a" });
    expect(screen.queryByTestId("bsod")).not.toBeInTheDocument();
  });

  it("the Recycle Bin refuses to be emptied, with a joke", () => {
    renderWithProviders(
      <Open id="recycle">
        <RecycleBinWindow />
      </Open>
    );
    expect(screen.getByTestId("recycle-window")).toHaveTextContent("node_modules");
    fireEvent.click(screen.getByTestId("recycle-empty"));
    expect(screen.getByTestId("recycle-nope")).toBeInTheDocument();
  });

  it("Settings can turn the phone preview frame on", () => {
    renderWithProviders(
      <Open id="settings">
        <SettingsWindow />
      </Open>
    );
    fireEvent.click(screen.getByTestId("settings-phone-preview"));
    expect(window.localStorage.getItem(PHONE_PREVIEW_KEY)).toBe("1");
  });
});

describe("phone extras", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => document.documentElement.removeAttribute("data-theme"));

  it("Control Center has six toggles (3+3), including Dark Mode", () => {
    renderWithProviders(<MobileControlCenter open onClose={() => {}} />);
    const toggles = screen.getByTestId("mobile-control-center").querySelectorAll(".mcc__toggle");
    expect(toggles).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: /dark mode/i }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("Terminal runs commands like the CMD window", () => {
    renderWithProviders(<TerminalApp onBack={() => {}} />);
    const input = screen.getByTestId("mobile-terminal-input");
    fireEvent.change(input, { target: { value: "whoami" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByTestId("mobile-terminal")).toHaveTextContent("guest$ whoami");
  });

  it("Clock shows both calendars", () => {
    renderWithProviders(<ClockApp onBack={() => {}} />);
    expect(screen.getByTestId("mobile-clock").textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(screen.getByTestId("mobile-clock").textContent).toMatch(/[۰-۹]/);
  });
});
