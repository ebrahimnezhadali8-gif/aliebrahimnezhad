import { useReducer } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { calculatorReducer, initialCalcState, type CalcAction } from "../../CalculatorWindow/calculatorLogic";
import "./CalculatorApp.css";

interface CalculatorAppProps {
  onBack: () => void;
}

interface CalcKey {
  label: string;
  action: CalcAction;
  variant?: "fn" | "op" | "wide";
}

// Laid out as explicit rows (rendered with flexbox, not CSS grid) — this
// avoids a real cross-browser bug where CSS Grid + aspect-ratio items,
// combined with the wide "0" button's column-span, mis-measure sibling
// rows and blow some buttons up into giant ellipses.
const ROWS: CalcKey[][] = [
  [
    { label: "C", action: { type: "clear" }, variant: "fn" },
    { label: "±", action: { type: "toggleSign" }, variant: "fn" },
    { label: "%", action: { type: "percent" }, variant: "fn" },
    { label: "÷", action: { type: "operator", operator: "÷" }, variant: "op" },
  ],
  [
    { label: "7", action: { type: "digit", digit: "7" } },
    { label: "8", action: { type: "digit", digit: "8" } },
    { label: "9", action: { type: "digit", digit: "9" } },
    { label: "×", action: { type: "operator", operator: "×" }, variant: "op" },
  ],
  [
    { label: "4", action: { type: "digit", digit: "4" } },
    { label: "5", action: { type: "digit", digit: "5" } },
    { label: "6", action: { type: "digit", digit: "6" } },
    { label: "−", action: { type: "operator", operator: "-" }, variant: "op" },
  ],
  [
    { label: "1", action: { type: "digit", digit: "1" } },
    { label: "2", action: { type: "digit", digit: "2" } },
    { label: "3", action: { type: "digit", digit: "3" } },
    { label: "+", action: { type: "operator", operator: "+" }, variant: "op" },
  ],
  [
    { label: "0", action: { type: "digit", digit: "0" }, variant: "wide" },
    { label: ".", action: { type: "decimal" } },
    { label: "=", action: { type: "equals" }, variant: "op" },
  ],
];

function CalculatorApp({ onBack }: CalculatorAppProps) {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalcState);

  return (
    <AppScreen title="Calculator" onBack={onBack} variant="dark" noPadding>
      <div className="ios-calc">
        <div className="ios-calc__display" data-testid="mobile-calculator-display">
          {state.display}
        </div>
        <div className="ios-calc__keys" data-testid="mobile-calculator-keys">
          {ROWS.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="ios-calc__row" key={rowIndex}>
              {row.map((key) => (
                <button
                  key={key.label}
                  type="button"
                  className={`ios-calc__btn ${key.variant ? `ios-calc__btn--${key.variant}` : ""}`}
                  onClick={() => dispatch(key.action)}
                >
                  {key.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppScreen>
  );
}

export default CalculatorApp;
