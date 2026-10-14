import { describe, it, expect } from "vitest";
import { calculatorReducer, applyOperator, initialCalcState, type CalcState } from "./calculatorLogic";

function type(state: CalcState, keys: string[]): CalcState {
  return keys.reduce((s, key) => {
    if (key === "=") return calculatorReducer(s, { type: "equals" });
    if (key === "C") return calculatorReducer(s, { type: "clear" });
    if (key === ".") return calculatorReducer(s, { type: "decimal" });
    if (["+", "-", "×", "÷"].includes(key)) {
      return calculatorReducer(s, { type: "operator", operator: key as "+" | "-" | "×" | "÷" });
    }
    return calculatorReducer(s, { type: "digit", digit: key });
  }, state);
}

describe("applyOperator", () => {
  it("adds, subtracts, multiplies and divides correctly", () => {
    expect(applyOperator(2, 3, "+")).toBe(5);
    expect(applyOperator(5, 3, "-")).toBe(2);
    expect(applyOperator(4, 3, "×")).toBe(12);
    expect(applyOperator(9, 3, "÷")).toBe(3);
  });

  it("returns NaN for division by zero (surfaced as an error message by the reducer)", () => {
    expect(Number.isNaN(applyOperator(5, 0, "÷"))).toBe(true);
  });
});

describe("calculatorReducer", () => {
  it("computes 2 + 3 = 5", () => {
    const result = type(initialCalcState, ["2", "+", "3", "="]);
    expect(result.display).toBe("5");
  });

  it("computes 12 × 4 = 48", () => {
    const result = type(initialCalcState, ["1", "2", "×", "4", "="]);
    expect(result.display).toBe("48");
  });

  it("chains operators: 2 + 3 + 4 = 9 (evaluates left to right)", () => {
    const result = type(initialCalcState, ["2", "+", "3", "+", "4", "="]);
    expect(result.display).toBe("9");
  });

  it("shows a friendly message on divide by zero instead of crashing", () => {
    const result = type(initialCalcState, ["5", "÷", "0", "="]);
    expect(result.display).toBe("Cannot divide by 0");
  });

  it("supports decimals: 1.5 + 2.25 = 3.75", () => {
    const result = type(initialCalcState, ["1", ".", "5", "+", "2", ".", "2", "5", "="]);
    expect(result.display).toBe("3.75");
  });

  it("ignores a second decimal point in the same number", () => {
    const result = type(initialCalcState, ["1", ".", "2", "."]);
    expect(result.display).toBe("1.2");
  });

  it("clear (C) resets to the initial state", () => {
    const mid = type(initialCalcState, ["9", "+", "1"]);
    const result = calculatorReducer(mid, { type: "clear" });
    expect(result).toEqual(initialCalcState);
  });

  it("backspace removes the last digit, and empties to 0 rather than going blank", () => {
    let state = type(initialCalcState, ["1", "2", "3"]);
    state = calculatorReducer(state, { type: "backspace" });
    expect(state.display).toBe("12");
    state = calculatorReducer(state, { type: "backspace" });
    state = calculatorReducer(state, { type: "backspace" });
    expect(state.display).toBe("0");
  });

  it("toggleSign flips between positive and negative", () => {
    let state = type(initialCalcState, ["5"]);
    state = calculatorReducer(state, { type: "toggleSign" });
    expect(state.display).toBe("-5");
    state = calculatorReducer(state, { type: "toggleSign" });
    expect(state.display).toBe("5");
  });

  it("percent converts the current value to a hundredth", () => {
    const state = calculatorReducer(type(initialCalcState, ["5", "0"]), { type: "percent" });
    expect(state.display).toBe("0.5");
  });
});
