import Icon from "../../../icons/Icon";
import { LiveCalendarIcon, LiveClockIcon } from "./LiveIcons";
import type { MobileIconItem } from "../mobileTypes";
import "./AppIcon.css";

interface AppIconProps {
  item: MobileIconItem;
  /** Overrides `item.label`, so app names can follow the interface language. */
  label?: string;
  onActivate: (item: MobileIconItem) => void;
  /** Dock icons skip the text label underneath. */
  showLabel?: boolean;
}

/**
 * One home-screen icon: a glossy iOS "squircle" tile holding either a white
 * system glyph or the product's real brand logo, plus the label beneath it.
 */
function AppIcon({ item, label, onActivate, showLabel = true }: AppIconProps) {
  const kind = item.theme.kind;
  const text = label ?? item.label;

  return (
    <button
      type="button"
      className={`app-icon app-icon--${kind}`}
      onClick={() => onActivate(item)}
      data-testid={`app-icon-${item.id}`}
      aria-label={text}
      data-cuelume-press
    >
      <span
        className="app-icon__tile"
        style={
          kind !== "system" ? undefined : { background: item.theme.background, color: item.theme.ink ?? "#fff" }
        }
      >
        <span className="app-icon__glyph">
          {item.id === "clock" ? (
            <span className="icon icon-live-clock">
              <LiveClockIcon />
            </span>
          ) : item.id === "calendar" ? (
            <span className="icon icon-live-calendar">
              <LiveCalendarIcon />
            </span>
          ) : (
            <Icon name={item.icon} />
          )}
        </span>
      </span>
      {showLabel && <span className="app-icon__label">{text}</span>}
    </button>
  );
}

export default AppIcon;