import { useEffect, useReducer } from "react";
import Window from "../Window/Window";
import { calculatorReducer, initialCalcState, type CalcOperator } from "./calculatorLogic";
import { windowMeta } from "../../config/siteConfig";
import { useWindowManager } from "../../context/WindowManagerContext";
import "./CalculatorWindow.css";

const KEY_OPERATORS: Record<string, CalcOperator> = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

function CalculatorWindow() {
  const meta = windowMeta.calculator;
  const [state, dispatch] = useReducer(calculatorReducer, initialCalcState);
  const { openWindows, activeWindowId } = useWindowManager();

  const isOpen = Boolean(openWindows.calculator) && !openWindows.calculator.minimized;
  const isFocused = activeWindowId === "calculator";

  // Only listens for keystrokes while the calculator window is open AND focused,
  // so typing elsewhere (e.g. inside the cmd window) doesn't leak into it.
  useEffect(() => {
    if (!isOpen || !isFocused) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        dispatch({ type: "digit", digit: e.key });
        return;
      }
      if (e.key === ".") {
        dispatch({ type: "decimal" });
        return;
      }
      if (KEY_OPERATORS[e.key]) {
        dispatch({ type: "operator", operator: KEY_OPERATORS[e.key] });
        return;
      }
      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        dispatch({ type: "equals" });
        return;
      }
      if (e.key === "Backspace") {
        dispatch({ type: "backspace" });
        return;
      }
      if (e.key === "Escape") {
        dispatch({ type: "clear" });
        return;
      }
      if (e.key === "Delete") {
        dispatch({ type: "clearEntry" });
        return;
      }
      if (e.key === "%") {
        dispatch({ type: "percent" });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFocused]);

  return (
    <Window id="calculator" title={meta.title} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="calculator">
        <div className="calculator__display" data-testid="calculator-display">
          {state.display}
        </div>

        <div className="calculator__grid">
          <button type="button" className="calc-btn calc-btn--fn" onClick={() => dispatch({ type: "clearEntry" })}>
            CE
          </button>
          <button type="button" className="calc-btn calc-btn--fn" onClick={() => dispatch({ type: "clear" })}>
            C
          </button>
          <button type="button" className="calc-btn calc-btn--fn" onClick={() => dispatch({ type: "backspace" })}>
            &#9003;
          </button>
          <button
            type="button"
            className="calc-btn calc-btn--op"
            onClick={() => dispatch({ type: "operator", operator: "÷" })}
          >
            ÷
          </button>

          {["7", "8", "9"].map((d) => (
            <button key={d} type="button" className="calc-btn" onClick={() => dispatch({ type: "digit", digit: d })}>
              {d}
            </button>
          ))}
          <button
            type="button"
            className="calc-btn calc-btn--op"
            onClick={() => dispatch({ type: "operator", operator: "×" })}
          >
            ×
          </button>

          {["4", "5", "6"].map((d) => (
            <button key={d} type="button" className="calc-btn" onClick={() => dispatch({ type: "digit", digit: d })}>
              {d}
            </button>
          ))}
          <button
            type="button"
            className="calc-btn calc-btn--op"
            onClick={() => dispatch({ type: "operator", operator: "-" })}
          >
            &minus;
          </button>

          {["1", "2", "3"].map((d) => (
            <button key={d} type="button" className="calc-btn" onClick={() => dispatch({ type: "digit", digit: d })}>
              {d}
            </button>
          ))}
          <button
            type="button"
            className="calc-btn calc-btn--op"
            onClick={() => dispatch({ type: "operator", operator: "+" })}
          >
            +
          </button>

          <button type="button" className="calc-btn calc-btn--wide" onClick={() => dispatch({ type: "toggleSign" })}>
            &plusmn;
          </button>
          <button type="button" className="calc-btn" onClick={() => dispatch({ type: "digit", digit: "0" })}>
            0
          </button>
          <button type="button" className="calc-btn" onClick={() => dispatch({ type: "decimal" })}>
            .
          </button>
          <button type="button" className="calc-btn calc-btn--eq" onClick={() => dispatch({ type: "equals" })}>
            =
          </button>
        </div>
      </div>
    </Window>
  );
}

export default CalculatorWindow;