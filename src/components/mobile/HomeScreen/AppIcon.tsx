import Icon from "../../../icons/Icon";
import type { MobileIconItem } from "../mobileTypes";
import "./AppIcon.css";

interface AppIconProps {
  item: MobileIconItem;
  onActivate: (item: MobileIconItem) => void;
  /** Dock icons skip the text label underneath. */
  showLabel?: boolean;
}

/**
 * One home-screen icon: a rounded iOS "squircle" tile holding either a white
 * system glyph or the product's real brand logo, plus the label beneath it.
 */
function AppIcon({ item, onActivate, showLabel = true }: AppIconProps) {
  const isBrand = item.theme.kind === "brand";

  return (
    <button
      type="button"
      className={`app-icon ${isBrand ? "app-icon--brand" : "app-icon--system"}`}
      onClick={() => onActivate(item)}
      data-testid={`app-icon-${item.id}`}
      aria-label={item.label}
      data-cuelume-press
    >
      <span
        className="app-icon__tile"
        style={
          isBrand
            ? undefined
            : { background: item.theme.background, color: item.theme.ink ?? "#fff" }
        }
      >
        <span className="app-icon__glyph">
          <Icon name={item.icon} />
        </span>
      </span>
      {showLabel && <span className="app-icon__label">{item.label}</span>}
    </button>
  );
}

export default AppIcon;
