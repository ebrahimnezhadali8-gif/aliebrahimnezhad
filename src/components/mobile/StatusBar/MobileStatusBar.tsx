import { useClock } from "../../../hooks/useClock";
import "./MobileStatusBar.css";

interface MobileStatusBarProps {
  /** Dark text for light backgrounds (default), or light text for dark app screens. */
  variant?: "dark" | "light";
  /** On the home screen the whole bar pulls the Control Center down, like iOS. */
  onClick?: () => void;
}

function MobileStatusBar({ variant = "dark", onClick }: MobileStatusBarProps) {
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  const interactive = Boolean(onClick);

  return (
    <div
      className={`mstatus mstatus--${variant} ${interactive ? "mstatus--tappable" : ""}`}
      data-testid="mobile-status-bar"
      {...(interactive
        ? {
            onClick,
            role: "button",
            tabIndex: 0,
            "aria-label": "Open Control Center",
            "aria-expanded": false,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            },
          }
        : {})}
    >
      <span className="mstatus__time">{time}</span>
      <span className="mstatus__right" aria-hidden="true">
        <svg className="mstatus__signal" viewBox="0 0 20 12">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        <svg className="mstatus__wifi" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 18.4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Zm0-7.8c2.3 0 4.5.9 6.1 2.4a1.4 1.4 0 0 0 2-2A12 12 0 0 0 12 7.2c-3 0-5.8 1.1-8 3.1a1.4 1.4 0 0 0 2 2 8.6 8.6 0 0 1 6-1.7Zm0-6.4c3.9 0 7.6 1.5 10.4 4a1.4 1.4 0 1 0 2-2A17 17 0 0 0 12 1.4a17 17 0 0 0-12.4 4.8 1.4 1.4 0 0 0 2 2A15.4 15.4 0 0 1 12 4.2Z"
          />
        </svg>
        <svg className="mstatus__battery" viewBox="0 0 27 13">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.2"
            stroke="currentColor"
            fill="none"
            strokeOpacity="0.45"
          />
          <rect x="23.6" y="4" width="2.2" height="5" rx="1.1" fill="currentColor" fillOpacity="0.45" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

export default MobileStatusBar;
