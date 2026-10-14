import { screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect, type ReactNode } from "react";
import Taskbar from "./Taskbar";
import Window from "../Window/Window";
import { useWindowManager } from "../../context/WindowManagerContext";
import { renderWithProviders } from "../../test/testUtils";

function OpenOnMount({ id, children }: { id: string; children?: ReactNode }) {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

describe("Taskbar", () => {
  it("renders the Start button and clock", () => {
    renderWithProviders(<Taskbar />);
    expect(screen.getByRole("button", { name: /start menu/i })).toBeInTheDocument();
    expect(screen.getByTestId("taskbar-clock")).toBeInTheDocument();
  });

  it("keeps the app's taskbar button after minimizing (does not disappear)", () => {
    function Harness() {
      const { openWindow, minimizeWindow } = useWindowManager();
      useEffect(() => {
        openWindow("resume");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <>
          <Taskbar />
          <Window id="resume" title="resume.pdf" icon="pdf">
            <p>body</p>
          </Window>
          <button onClick={() => minimizeWindow("resume")}>minimize</button>
        </>
      );
    }
    renderWithProviders(<Harness />);
    const taskbar = screen.getByTestId("taskbar");
    expect(within(taskbar).getByText("resume.pdf")).toBeInTheDocument();
    fireEvent.click(screen.getByText("minimize"));
    // Window itself is hidden...
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    // ...but its taskbar button is still there.
    expect(within(taskbar).getByText("resume.pdf")).toBeInTheDocument();
  });

  it("clicking a minimized app's taskbar button restores the window", () => {
    function Harness() {
      const { openWindow, minimizeWindow } = useWindowManager();
      useEffect(() => {
        openWindow("resume");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <>
          <Taskbar />
          <Window id="resume" title="resume.pdf" icon="pdf">
            <p>body</p>
          </Window>
          <button onClick={() => minimizeWindow("resume")}>minimize</button>
        </>
      );
    }
    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByText("minimize"));
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByTestId("taskbar")).getByText("resume.pdf"));
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
  });

  it("show-desktop button minimizes all open windows but keeps their taskbar buttons", () => {
    renderWithProviders(
      <OpenOnMount id="resume">
        <Taskbar />
        <Window id="resume" title="resume.pdf" icon="pdf">
          <p>body</p>
        </Window>
      </OpenOnMount>
    );
    expect(screen.getByTestId("window-resume")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /show desktop/i }));
    expect(screen.queryByTestId("window-resume")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("taskbar")).getByText("resume.pdf")).toBeInTheDocument();
  });
});
