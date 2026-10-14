import Icon from "../../../icons/Icon";
import { useClock } from "../../../hooks/useClock";
import { useDesktopSettings } from "../../../context/DesktopSettingsContext";
import { formatDate, formatTime } from "../../../utils/jalali";
import { useMobileShell } from "../MobileShellContext";
import { useContent } from "../../../hooks/useContent";
import "./MobileStatusBar.css";

interface MobileStatusBarProps {
  /** Dark text for light backgrounds (default), or light text for dark app screens. */
  variant?: "dark" | "light";
  /** On the home screen the whole bar pulls the Control Center down, like iOS. */
  onClick?: () => void;
}

function MobileStatusBar({ variant = "dark", onClick }: MobileStatusBarProps) {
  const now = useClock();
  const { calendar } = useDesktopSettings();
  const { t } = useContent();
  const shell = useMobileShell();

  const interactive = Boolean(onClick);
  const date = formatDate(now, calendar);

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
      <span className="mstatus__time">{formatTime(now, calendar)}</span>

      {shell && (
        <button
          type="button"
          className="mstatus__gear"
          aria-label={t("settings")}
          title={t("settings")}
          data-testid="status-settings"
          data-cuelume-press
          onClick={(e) => {
            e.stopPropagation();
            shell.openSettings();
          }}
        >
          <Icon name="gear" />
        </button>
      )}

      <span className="mstatus__date" data-testid="status-date">
        {date}
      </span>

      <span className="mstatus__right" aria-hidden="true">
        <svg className="mstatus__signal" viewBox="0 0 20 12">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        <svg className="mstatus__wifi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M2.5 9.2a14 14 0 0 1 19 0" />
          <path d="M5.8 12.9a9.2 9.2 0 0 1 12.4 0" />
          <path d="M9.1 16.4a4.6 4.6 0 0 1 5.8 0" />
          <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none" />
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