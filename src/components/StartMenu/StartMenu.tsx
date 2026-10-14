import { useRef } from "react";
import Icon from "../../icons/Icon";
import StartMenuItem from "./StartMenuItem";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { handleItemAction } from "../../utils/handleItemAction";
import { siteConfig } from "../../config/siteConfig";
import { useContent, useDesktopItems } from "../../hooks/useContent";
import type { DesktopItem } from "../../types";
import "./StartMenu.css";

function StartMenu() {
  const { startMenuOpen, closeStartMenu, openWindow } = useWindowManager();
  const { lang, toggleLang } = useDesktopSettings();
  const { content, t } = useContent();
  const { desktopItems, startMenuExtraItems } = useDesktopItems();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, closeStartMenu, "#start-btn");

  if (!startMenuOpen) return null;

  const activate = (item: DesktopItem) => {
    handleItemAction(item, { openWindow, links: siteConfig.links });
    closeStartMenu();
  };

  const restart = () => {
    window.location.reload();
  };

  return (
    <div id="start-menu" className="start-menu" ref={ref} data-testid="start-menu">
      <div className="start-menu__header">
        <div className="start-menu__avatar">
          <Icon name="user" />
        </div>
        <b>{content.name}</b>
      </div>
      <div className="start-menu__list">
        {desktopItems.map((item) => (
          <StartMenuItem key={item.id} item={item} onActivate={activate} />
        ))}
        <div className="start-menu__divider" />
        {startMenuExtraItems.map((item) => (
          <StartMenuItem key={item.id} item={item} onActivate={activate} />
        ))}
      </div>
      <div className="start-menu__footer">
        <button
          type="button"
          className="start-menu__lang"
          onClick={toggleLang}
          aria-label={t("language")}
          title={t("language")}
          data-cuelume-press
          data-testid="start-menu-language"
        >
          <Icon name="globe" className="start-menu__lang-icon" />
          <span>{t("language")}</span>
          <span className="start-menu__lang-value">{lang === "fa" ? "فارسی" : "English"}</span>
        </button>
        <button
          type="button"
          className="start-menu__power"
          onClick={restart}
          aria-label={t("restart")}
          title={t("restart")}
          data-cuelume-press
          data-testid="start-menu-power"
        >
          <span className="start-menu__power-icon">
            <Icon name="power" />
          </span>
          <span>{t("restart")}</span>
        </button>
      </div>
    </div>
  );
}

export default StartMenu;