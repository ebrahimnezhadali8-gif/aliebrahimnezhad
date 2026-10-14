import type { DesktopItem } from "../../types";
import Icon from "../../icons/Icon";

interface StartMenuItemProps {
  item: DesktopItem;
  onActivate: (item: DesktopItem) => void;
}

function StartMenuItem({ item, onActivate }: StartMenuItemProps) {
  return (
    <button type="button" className="start-menu__item" data-cuelume-press onClick={() => onActivate(item)}>
      <span className="start-menu__icon">
        <Icon name={item.icon} />
      </span>
      <span className="start-menu__label">{item.label}</span>
    </button>
  );
}

export default StartMenuItem;
