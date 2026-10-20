import { useMemo } from "react";
import { siteConfig, windowMeta } from "../config/siteConfig";
import { faContent } from "../i18n/fa";
import { translate, type UiStrings } from "../i18n/strings";
import { useDesktopSettings } from "../context/DesktopSettingsContext";
import type { DesktopItem, Project, Skill } from "../types";

export interface LocalisedContent {
  name: string;
  role: string;
  phone: string;
  email: string;
  location: string;
  about: string[];
  skills: Skill[];
  projects: Project[];
  stats: { experience: string; projects: string; technologies: string };
}

/**
 * Merges the English `siteConfig` with the Persian translation.
 *
 * Only prose fields are translated; links, logos and technology tags are shared,
 * and projects are matched by `id` so a project can never go missing from one
 * language. Falls back field-by-field to English if a translation is absent.
 */
export function getContent(lang: "en" | "fa"): LocalisedContent {
  const base = siteConfig;
  if (lang !== "fa") {
    return {
      name: base.name,
      role: base.role,
      phone: base.phone,
      email: base.email,
      location: base.location,
      about: base.about,
      skills: base.skills,
      projects: base.projects,
      stats: base.stats,
    };
  }

  const faById = new Map(faContent.projects.map((project) => [project.id, project]));

  const projects: Project[] = base.projects.map((project) => {
    const fa = faById.get(project.id);
    if (!fa) return project;
    return {
      ...project,
      title: fa.title,
      tagline: fa.tagline,
      desc: fa.desc,
      highlights: [...fa.highlights],
      linkLabel: fa.linkLabel,
    };
  });

  return {
    name: base.name,
    role: faContent.role,
    phone: base.phone,
    email: base.email,
    location: base.location,
    about: [...faContent.about],
    // Technology names stay in Latin script — that is how they are written in
    // every Persian job posting too.
    skills: base.skills,
    projects,
    stats: { ...faContent.stats },
  };
}

/** Localised copy plus a `t()` helper for UI chrome, in one hook. */
export function useContent() {
  const { lang } = useDesktopSettings();

  return useMemo(() => {
    const content = getContent(lang);
    const t = (key: keyof UiStrings) => translate(lang, key);
    return { content, t, lang };
  }, [lang]);
}

/** Window titles, translated where there is a word for it (cmd's stays a path). */
const WINDOW_TITLE_STRINGS: Record<string, keyof UiStrings> = {
  resume: "resume",
  projects: "projects",
  about: "about",
  skills: "skills",
  contact: "contact",
  calculator: "calculator",
  ie: "browser",
  settings: "settings",
  recycle: "recycleBin",
};

/**
 * Resolves a window id to its title in the active language, so the taskbar
 * button matches whatever language the window itself opened in.
 */
export function useWindowTitle() {
  const { t } = useContent();

  return (id: string): string => {
    const key = WINDOW_TITLE_STRINGS[id];
    if (key) return t(key);
    return windowMeta[id]?.title ?? id;
  };
}

/** Desktop items and start-menu entries, with their labels translated. */
export function useDesktopItems() {
  const { content, t } = useContent();

  const translateItems = (items: DesktopItem[]): DesktopItem[] =>
    items.map((item) => {
      switch (item.id) {
        case "resume":
          return { ...item, label: t("resume") };
        case "projects":
          return { ...item, label: t("projects") };
        case "about":
          return { ...item, label: t("about") };
        case "skills":
          return { ...item, label: t("skills") };
        case "calculator":
          return { ...item, label: t("calculator") };
        case "ie":
          return { ...item, label: t("browser") };
        case "settings":
          return { ...item, label: t("settings") };
        case "phone":
          return { ...item, label: t("contact") };
        case "recycle":
          return { ...item, label: t("recycleBin") };
        case "google":
          return { ...item, label: "Google" };
        case "microsoft":
          return { ...item, label: "Microsoft" };
        default:
          return item;
      }
    });

  return {
    content,
    desktopItems: translateItems(siteConfig.desktopItems),
    startMenuExtraItems: translateItems(siteConfig.startMenuExtraItems),
  };
}