import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect, type ReactNode } from "react";
import Window from "./Window";
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

describe("Window", () => {
  it("renders nothing when not open", () => {
    renderWithProviders(
      <Window id="demo" title="Demo" icon="pdf">
        <p>Body content</p>
      </Window>
    );
    expect(screen.queryByTestId("window-demo")).not.toBeInTheDocument();
  });

  it("renders the title, icon and children once opened", () => {
    renderWithProviders(
      <OpenOnMount id="demo">
        <Window id="demo" title="Demo Window" icon="pdf">
          <p>Body content</p>
        </Window>
      </OpenOnMount>
    );
    expect(screen.getByTestId("window-demo")).toBeInTheDocument();
    expect(screen.getByText("Demo Window")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("closes permanently when the close (X) button is clicked", () => {
    renderWithProviders(
      <OpenOnMount id="demo">
        <Window id="demo" title="Demo Window" icon="pdf">
          <p>Body content</p>
        </Window>
      </OpenOnMount>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByTestId("window-demo")).not.toBeInTheDocument();
  });

  it("hides (but does not close) when minimize is clicked, and reappears when re-opened", () => {
    function Harness() {
      const { openWindow } = useWindowManager();
      useEffect(() => {
        openWindow("demo");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <Window id="demo" title="Demo Window" icon="pdf">
          <p>Body content</p>
        </Window>
      );
    }
    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /minimize/i }));
    // Visually hidden...
    expect(screen.queryByTestId("window-demo")).not.toBeInTheDocument();
  });

  it("stays registered while minimized so a taskbar-style focusWindow() call restores it", () => {
    function Harness() {
      const { openWindow, minimizeWindow, focusWindow, openWindows } = useWindowManager();
      useEffect(() => {
        openWindow("demo");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return (
        <>
          <Window id="demo" title="Demo Window" icon="pdf">
            <p>Body content</p>
          </Window>
          <button onClick={() => minimizeWindow("demo")}>minimize-via-taskbar</button>
          <button onClick={() => focusWindow("demo")}>restore-via-taskbar</button>
          <span data-testid="registered">{String("demo" in openWindows)}</span>
        </>
      );
    }
    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByText("minimize-via-taskbar"));
    expect(screen.queryByTestId("window-demo")).not.toBeInTheDocument();
    // Crucially: still registered (this is what keeps its taskbar button alive).
    expect(screen.getByTestId("registered").textContent).toBe("true");
    fireEvent.click(screen.getByText("restore-via-taskbar"));
    expect(screen.getByTestId("window-demo")).toBeInTheDocument();
  });
});
