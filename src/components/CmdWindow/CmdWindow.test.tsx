import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect, type ReactNode } from "react";
import CmdWindow from "./CmdWindow";
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

describe("CmdWindow (UI wiring)", () => {
  it("shows the name banner on open", () => {
    renderWithProviders(
      <OpenOnMount id="cmd">
        <CmdWindow />
      </OpenOnMount>
    );
    expect(screen.getByText("Ali Ebrahimnezhad")).toBeInTheDocument();
  });

  it("typing 'user' and pressing Enter prints the name in the output", () => {
    renderWithProviders(
      <OpenOnMount id="cmd">
        <CmdWindow />
      </OpenOnMount>
    );
    const input = screen.getByLabelText("Command input");
    fireEvent.change(input, { target: { value: "user" } });
    fireEvent.keyDown(input, { key: "Enter" });
    const body = screen.getByTestId("cmd-body");
    expect(body.textContent).toContain("Ali Ebrahimnezhad");
  });

  it("typing 'exit' and pressing Enter closes the window", () => {
    renderWithProviders(
      <OpenOnMount id="cmd">
        <CmdWindow />
      </OpenOnMount>
    );
    fireEvent.change(screen.getByLabelText("Command input"), { target: { value: "exit" } });
    fireEvent.keyDown(screen.getByLabelText("Command input"), { key: "Enter" });
    expect(screen.queryByTestId("window-cmd")).not.toBeInTheDocument();
  });
});
