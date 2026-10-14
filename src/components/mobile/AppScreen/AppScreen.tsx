import type { ReactNode } from "react";
import MobileStatusBar from "../StatusBar/MobileStatusBar";
import { useContent } from "../../../hooks/useContent";
import "./AppScreen.css";

interface AppScreenProps {
  /** Translated title supplied by the parent, or a literal string. */
  title: string;
  onBack: () => void;
  variant?: "light" | "dark";
  /** Render the body edge-to-edge (no padding) — used by the PDF viewer and Calculator. */
  noPadding?: boolean;
  children: ReactNode;
}

function AppScreen({ title, onBack, variant = "light", noPadding = false, children }: AppScreenProps) {
  const { t } = useContent();

  return (
    <div className={`app-screen app-screen--${variant}`} data-testid={`app-screen-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <MobileStatusBar variant={variant === "dark" ? "light" : "dark"} />
      <div className="app-screen__header">
        <button
          type="button"
          className="app-screen__back"
          onClick={onBack}
          data-cuelume-press
          aria-label={`${t("backToHome")} — ${title}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5 8 12l7 7" />
          </svg>
          {t("backLabel")}
        </button>
        <span className="app-screen__title">{title}</span>
        <span className="app-screen__spacer" />
      </div>
      <div className={`app-screen__body ${noPadding ? "app-screen__body--flush" : ""}`}>{children}</div>
    </div>
  );
}

export default AppScreen;