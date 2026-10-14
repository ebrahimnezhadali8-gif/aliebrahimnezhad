import { useState } from "react";
import type { DesktopItem } from "../../types";
import DesktopIcon from "./DesktopIcon";
import { useWindowManager } from "../../context/WindowManagerContext";
import { handleItemAction } from "../../utils/handleItemAction";
import { siteConfig } from "../../config/siteConfig";
import { useDesktopItems } from "../../hooks/useContent";
import "./DesktopIcons.css";

interface DesktopIconsProps {
  items?: DesktopItem[];
  /** Controlled by the desktop's right-click context menu ("Show desktop icons"). */
  visible?: boolean;
}

function DesktopIcons({ items = siteConfig.desktopItems, visible = true }: DesktopIconsProps) {
  const { openWindow } = useWindowManager();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { desktopItems } = useDesktopItems();

  if (!visible) return null;

  // When the caller supplies its own list (tests), honour it; otherwise use the
  // translated labels from the config.
  const resolved = items === siteConfig.desktopItems ? desktopItems : items;

  return (
    <div className="desktop-icons" data-testid="desktop-icons">
      {resolved.map((item) => (
        <DesktopIcon
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={setSelectedId}
          onActivate={(it) => handleItemAction(it, { openWindow, links: siteConfig.links })}
        />
      ))}
    </div>
  );
}

export default DesktopIcons;