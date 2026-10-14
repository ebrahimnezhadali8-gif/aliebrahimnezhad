import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect, type ReactNode } from "react";
import CalculatorWindow from "./CalculatorWindow";
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

describe("CalculatorWindow (UI wiring)", () => {
  it("computes 7 + 8 = 15 through real button clicks", () => {
    renderWithProviders(
      <OpenOnMount id="calculator">
        <CalculatorWindow />
      </OpenOnMount>
    );
    fireEvent.click(screen.getByText("7"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("8"));
    fireEvent.click(screen.getByText("="));
    expect(screen.getByTestId("calculator-display").textContent).toBe("15");
  });

  it("C clears the display back to 0", () => {
    renderWithProviders(
      <OpenOnMount id="calculator">
        <CalculatorWindow />
      </OpenOnMount>
    );
    fireEvent.click(screen.getByText("9"));
    fireEvent.click(screen.getByText("C"));
    expect(screen.getByTestId("calculator-display").textContent).toBe("0");
  });
});
