import type { DesktopItem } from "../../types";
import Icon from "../../icons/Icon";
import "./DesktopIcons.css";

interface DesktopIconProps {
  item: DesktopItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onActivate: (item: DesktopItem) => void;
}

function DesktopIcon({ item, selected, onSelect, onActivate }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? "desktop-icon--selected" : ""}`}
      data-testid={`desktop-icon-${item.id}`}
      data-cuelume-press
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
        onActivate(item);
      }}
    >
      <span className="desktop-icon__glyph">
        <Icon name={item.icon} />
      </span>
      <span className="desktop-icon__label">{item.label}</span>
    </button>
  );
}

export default DesktopIcon;
