import { screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useEffect, type ReactNode } from "react";
import Taskbar from "./Taskbar";
import Window from "../Window/Window";
import { useWindowManager } from "../../context/WindowManagerContext";
import { renderWithProviders } from "../../test/testUtils";
import { windowMeta } from "../../config/siteConfig";

function OpenOnMount({ id, children }: { id: string; children?: ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

/** Harness that opens a window and renders the taskbar. */
function TaskbarHarness({ id }: { id: string }) {
  const { openWindow, minimizeWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Taskbar />
      <Window id={id} title={windowMeta[id].title} icon={windowMeta[id].icon}>
        <p>body</p>
      </Window>
      <button onClick={() => minimizeWindow(id)}>minimize</button>
    </>
  );
}

describe("Taskbar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the Start button and clock", () => {
    renderWithProviders(<Taskbar />);
    expect(screen.getByRole("button", { name: /start menu/i })).toBeInTheDocument();
    expect(screen.getByTestId("taskbar-clock")).toBeInTheDocument();
  });

  it("offers a language picker in the notification area", () => {
    renderWithProviders(<Taskbar />);
    const button = screen.getByTestId("taskbar-language");
    expect(button).toHaveTextContent("EN");
    fireEvent.click(button);
    fireEvent.click(screen.getByTestId("taskbar-language-fa"));
    expect(button).toHaveTextContent("فا");
    expect(document.documentElement.dataset.textDir).toBe("rtl");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("has a Settings button next to the tray widgets", () => {
    renderWithProviders(<Taskbar />);
    expect(screen.getByTestId("taskbar-settings")).toBeInTheDocument();
  });

  it("keeps the app's taskbar button after minimizing (does not disappear)", () => {
    renderWithProviders(<TaskbarHarness id="resume" />);
    const taskbar = screen.getByTestId("taskbar");
    expect(within(taskbar).getByText("Résumé")).toBeInTheDocument();
    fireEvent.click(screen.getByText("minimize"));
    // Window itself is hidden...
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    // ...but its taskbar button is still there.
    expect(within(taskbar).getByText("Résumé")).toBeInTheDocument();
  });

  it("clicking a minimized app's taskbar button restores the window", () => {
    renderWithProviders(<TaskbarHarness id="resume" />);
    fireEvent.click(screen.getByText("minimize"));
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByTestId("taskbar")).getByText("Résumé"));
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
  });

  it("show-desktop button minimizes all open windows but keeps their taskbar buttons", () => {
    renderWithProviders(
      <OpenOnMount id="resume">
        <Taskbar />
        <Window id="resume" title={windowMeta.resume.title} icon="pdf">
          <p>body</p>
        </Window>
      </OpenOnMount>
    );
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show desktop/i }));
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("taskbar")).getByText("Résumé")).toBeInTheDocument();
  });
});