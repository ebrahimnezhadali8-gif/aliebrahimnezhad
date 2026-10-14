import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalculatorApp from "./CalculatorApp";

describe("CalculatorApp (mobile)", () => {
  it("renders every digit and all 4 operator keys (÷ × − +) — regression guard for the broken 3-column layout", () => {
    render(<CalculatorApp onBack={() => {}} />);
    for (const d of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      expect(screen.getByRole("button", { name: d })).toBeInTheDocument();
    }
    for (const op of ["÷", "×", "−", "+", "="]) {
      expect(screen.getByRole("button", { name: op })).toBeInTheDocument();
    }
  });

  it("computes 7 + 8 = 15 through real button clicks", () => {
    render(<CalculatorApp onBack={() => {}} />);
    fireEvent.click(screen.getByText("7"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("8"));
    fireEvent.click(screen.getByText("="));
    expect(screen.getByTestId("mobile-calculator-display").textContent).toBe("15");
  });

  it("C clears the display back to 0", () => {
    render(<CalculatorApp onBack={() => {}} />);
    fireEvent.click(screen.getByText("9"));
    fireEvent.click(screen.getByText("C"));
    expect(screen.getByTestId("mobile-calculator-display").textContent).toBe("0");
  });

  it("lays the keys out in five rows, four per row except the last", () => {
    render(<CalculatorApp onBack={() => {}} />);
    const rows = screen.getByTestId("mobile-calculator-keys").querySelectorAll(".ios-calc__row");
    expect(rows).toHaveLength(5);
    expect(rows[0].querySelectorAll("button")).toHaveLength(4);
    expect(rows[4].querySelectorAll("button")).toHaveLength(3);
  });

  it("uses the iOS key palette: grey functions, orange operators, dark digits", () => {
    render(<CalculatorApp onBack={() => {}} />);
    expect(screen.getByRole("button", { name: "C" }).className).toMatch(/--fn$/);
    expect(screen.getByRole("button", { name: "÷" }).className).toMatch(/--op$/);
    expect(screen.getByRole("button", { name: "7" }).className).not.toMatch(/--/);
  });

  it("gives the wide zero key its own modifier so it spans two columns", () => {
    render(<CalculatorApp onBack={() => {}} />);
    expect(screen.getByRole("button", { name: "0" }).className).toMatch(/--wide$/);
  });

  it("computes a full expression with decimals, and % divides by 100", () => {
    render(<CalculatorApp onBack={() => {}} />);
    for (const key of ["1", "2", ".", "5", "×", "2", "="]) {
      fireEvent.click(screen.getByRole("button", { name: key }));
    }
    expect(screen.getByTestId("mobile-calculator-display").textContent).toBe("25");

    fireEvent.click(screen.getByRole("button", { name: "C" }));
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    fireEvent.click(screen.getByRole("button", { name: "%" }));
    expect(screen.getByTestId("mobile-calculator-display").textContent).toBe("0.05");
  });

  it("± flips the sign of the current number", () => {
    render(<CalculatorApp onBack={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "8" }));
    fireEvent.click(screen.getByRole("button", { name: "±" }));
    expect(screen.getByTestId("mobile-calculator-display").textContent).toBe("-8");
  });

  it("goes back to the home screen", () => {
    const onBack = vi.fn();
    render(<CalculatorApp onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
