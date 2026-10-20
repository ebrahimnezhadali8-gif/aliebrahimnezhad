import { useMemo, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import StartMenuItem from "./StartMenuItem";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { handleItemAction } from "../../utils/handleItemAction";
import { siteConfig } from "../../config/siteConfig";
import { useContent, useDesktopItems } from "../../hooks/useContent";
import type { DesktopItem } from "../../types";
import { filterEntries, type SearchEntry } from "../../utils/searchEntries";
import "./StartMenu.css";

function StartMenu() {
  const { startMenuOpen, closeStartMenu, openWindow } = useWindowManager();
  const { lang, toggleLang } = useDesktopSettings();
  const { content, t } = useContent();
  const { desktopItems, startMenuExtraItems } = useDesktopItems();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const entries = useMemo<SearchEntry[]>(
    () => [
      ...[...desktopItems, ...startMenuExtraItems].map((item) => ({
        id: `app:${item.id}`,
        kind: "app" as const,
        title: item.label,
        icon: item.icon,
      })),
      ...content.projects.map((project) => ({
        id: `project:${project.id}`,
        kind: "project" as const,
        title: project.title,
        subtitle: project.tagline,
        icon: "folder" as const,
        keywords: [...project.tags, project.link],
      })),
      ...content.skills.map((skill) => ({
        id: `skill:${skill.name}`,
        kind: "skill" as const,
        title: skill.name,
        icon: skill.icon,
      })),
    ],
    [desktopItems, startMenuExtraItems, content]
  );
  const results = useMemo(() => filterEntries(entries, query, 8), [entries, query]);
  useOutsideClick(ref, closeStartMenu, "#start-btn");

  if (!startMenuOpen) return null;

  const activate = (item: DesktopItem) => {
    handleItemAction(item, { openWindow, links: siteConfig.links });
    closeStartMenu();
  };

  const activateResult = (entry: SearchEntry) => {
    if (entry.kind === "app") {
      const item = [...desktopItems, ...startMenuExtraItems].find((c) => `app:${c.id}` === entry.id);
      if (item) handleItemAction(item, { openWindow, links: siteConfig.links });
    } else {
      openWindow(entry.kind === "project" ? "projects" : "skills");
    }
    setQuery("");
    closeStartMenu();
  };

  const kindLabel = { app: t("kindApp"), project: t("kindProject"), skill: t("kindSkill") };

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
      <div className="start-menu__search">
        <Icon name="search" className="start-menu__search-icon" />
        <input
          type="search"
          className="start-menu__search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          data-testid="start-menu-search"
        />
      </div>
      {query.trim() !== "" ? (
        <div className="start-menu__list" data-testid="start-menu-results">
          {results.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="start-menu__item"
              data-cuelume-press
              onClick={() => activateResult(entry)}
              data-testid={`start-result-${entry.id}`}
            >
              <span className="start-menu__icon">
                <Icon name={entry.icon} />
              </span>
              <span className="start-menu__label">{entry.title}</span>
              <span className="start-menu__kind">{kindLabel[entry.kind]}</span>
            </button>
          ))}
          {results.length === 0 && <div className="start-menu__empty">{t("noResults")}</div>}
        </div>
      ) : (
      <div className="start-menu__list">
        {desktopItems.map((item) => (
          <StartMenuItem key={item.id} item={item} onActivate={activate} />
        ))}
        <div className="start-menu__divider" />
        {startMenuExtraItems.map((item) => (
          <StartMenuItem key={item.id} item={item} onActivate={activate} />
        ))}
      </div>
      )}
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