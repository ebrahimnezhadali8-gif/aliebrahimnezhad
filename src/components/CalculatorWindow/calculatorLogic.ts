export type CalcOperator = "+" | "-" | "×" | "÷";

export interface CalcState {
  display: string;
  previousValue: number | null;
  operator: CalcOperator | null;
  waitingForOperand: boolean;
}

export const initialCalcState: CalcState = {
  display: "0",
  previousValue: null,
  operator: null,
  waitingForOperand: false,
};

export type CalcAction =
  | { type: "digit"; digit: string }
  | { type: "decimal" }
  | { type: "operator"; operator: CalcOperator }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "clearEntry" }
  | { type: "backspace" }
  | { type: "toggleSign" }
  | { type: "percent" };

/** Applies a single arithmetic operation. Division by zero yields "Cannot divide by zero" via NaN, handled by the caller. */
export function applyOperator(a: number, b: number, operator: CalcOperator): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

/** Formats a number for display, trimming floating point noise. */
function formatResult(value: number): string {
  if (Number.isNaN(value)) return "Cannot divide by 0";
  if (!Number.isFinite(value)) return "Overflow";
  // Avoid excessive floating point tails (e.g. 0.1 + 0.2).
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

export function calculatorReducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case "digit": {
      if (state.waitingForOperand) {
        return { ...state, display: action.digit, waitingForOperand: false };
      }
      if (state.display === "0") {
        return { ...state, display: action.digit };
      }
      // Keep the display at a sane length, like a real calculator.
      if (state.display.replace("-", "").replace(".", "").length >= 12) return state;
      return { ...state, display: state.display + action.digit };
    }

    case "decimal": {
      if (state.waitingForOperand) {
        return { ...state, display: "0.", waitingForOperand: false };
      }
      if (state.display.includes(".")) return state;
      return { ...state, display: state.display + "." };
    }

    case "operator": {
      const inputValue = parseFloat(state.display);
      if (state.previousValue === null) {
        return { ...state, previousValue: inputValue, operator: action.operator, waitingForOperand: true };
      }
      if (state.waitingForOperand) {
        return { ...state, operator: action.operator };
      }
      const result = applyOperator(state.previousValue, inputValue, state.operator as CalcOperator);
      return {
        display: formatResult(result),
        previousValue: result,
        operator: action.operator,
        waitingForOperand: true,
      };
    }

    case "equals": {
      if (state.operator === null || state.previousValue === null) return state;
      const inputValue = parseFloat(state.display);
      const result = applyOperator(state.previousValue, inputValue, state.operator);
      return {
        display: formatResult(result),
        previousValue: null,
        operator: null,
        waitingForOperand: true,
      };
    }

    case "clear":
      return initialCalcState;

    case "clearEntry":
      return { ...state, display: "0" };

    case "backspace": {
      if (state.waitingForOperand) return state;
      const next = state.display.length > 1 ? state.display.slice(0, -1) : "0";
      return { ...state, display: next === "-" ? "0" : next };
    }

    case "toggleSign": {
      if (state.display === "0") return state;
      return {
        ...state,
        display: state.display.startsWith("-") ? state.display.slice(1) : `-${state.display}`,
      };
    }

    case "percent": {
      const value = parseFloat(state.display) / 100;
      return { ...state, display: formatResult(value) };
    }

    default:
      return state;
  }
}
