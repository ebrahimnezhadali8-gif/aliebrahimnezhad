import type { IconName, SiteLinks } from "../../types";

export type MobileAppId =
  | "resume"
  | "notes"
  | "projects"
  | "about"
  | "skills"
  | "calculator"
  | "phone"
  | "mail"
  | "safari"
  | "terminal"
  | "clock"
  | "calendar"
  | "photos"
  | "music"
  | "mines"
  | "draw"
  | "messages"
  | "settings";

export type MobileAction =
  | { type: "app"; app: MobileAppId }
  | { type: "link"; target: keyof SiteLinks };

/**
 * How an app icon is painted, mirroring how iOS distinguishes the two kinds of
 * icon on a home screen:
 *  - `system`  → a coloured gradient tile with a white glyph (Notes, Mail, …)
 *  - `brand`   → a white tile carrying the product's real logo (GitHub, Instagram, …)
 *  - `art`     → full-bleed iPhone 4 artwork that paints its own background
 */
export interface MobileIconTheme {
  kind: "system" | "brand" | "art";
  /** `background` for system tiles; `none` so brand logos sit on white. */
  background?: string;
  /** Glyph colour on top of the tile. */
  ink?: string;
}

export interface MobileIconItem {
  id: string;
  label: string;
  icon: IconName;
  theme: MobileIconTheme;
  action: MobileAction;
}

const brand: MobileIconTheme = { kind: "brand" };

/** Full-bleed iPhone 4 artwork: the icon draws its own background. */
const art: MobileIconTheme = { kind: "art" };

/**
 * Home screen — the same content as the desktop, re-skinned for iOS.
 * Six system apps on page one, the brand shortcuts on page two.
 */
export const homeScreenApps: MobileIconItem[] = [
  { id: "resume", label: "Résumé", icon: "ios4Resume", theme: art, action: { type: "app", app: "resume" } },
  { id: "notes", label: "Notes", icon: "ios4Notes", theme: art, action: { type: "app", app: "notes" } },
  { id: "projects", label: "Projects", icon: "ios4Projects", theme: art, action: { type: "app", app: "projects" } },
  { id: "about", label: "About Me", icon: "ios4About", theme: art, action: { type: "app", app: "about" } },
  { id: "skills", label: "Skills", icon: "ios4Skills", theme: art, action: { type: "app", app: "skills" } },
  { id: "calculator", label: "Calculator", icon: "ios4Calculator", theme: art, action: { type: "app", app: "calculator" } },
  { id: "terminal", label: "Terminal", icon: "ios4Terminal", theme: art, action: { type: "app", app: "terminal" } },
  { id: "clock", label: "Clock", icon: "ios4Clock", theme: art, action: { type: "app", app: "clock" } },
  { id: "calendar", label: "Calendar", icon: "ios4Calendar", theme: art, action: { type: "app", app: "calendar" } },
  { id: "photos", label: "Photos", icon: "ios4Photos", theme: art, action: { type: "app", app: "photos" } },
  { id: "music", label: "Music", icon: "ios4Music", theme: art, action: { type: "app", app: "music" } },
  { id: "mines", label: "Minesweeper", icon: "ios4Mines", theme: art, action: { type: "app", app: "mines" } },
  { id: "draw", label: "Draw", icon: "ios4Draw", theme: art, action: { type: "app", app: "draw" } },
  { id: "github", label: "GitHub", icon: "github", theme: brand, action: { type: "link", target: "github" } },
  { id: "linkedin", label: "LinkedIn", icon: "ios4Linkedin", theme: art, action: { type: "link", target: "linkedin" } },
  { id: "instagram", label: "Instagram", icon: "ios4Instagram", theme: art, action: { type: "link", target: "instagram" } },
  { id: "telegram", label: "Telegram", icon: "ios4Telegram", theme: art, action: { type: "link", target: "telegram" } },
  { id: "settings", label: "Settings", icon: "ios4Settings", theme: art, action: { type: "app", app: "settings" } },
];

/**
 * Bottom dock — exactly 4 slots, like iOS. Phone and Mail open dedicated app
 * screens; Messages and GitHub are quick-access shortcuts, matching what is
 * already on the home screen so nothing is duplicated.
 */
export const dockApps: MobileIconItem[] = [
  { id: "dock-phone", label: "Phone", icon: "ios4Phone", theme: art, action: { type: "app", app: "phone" } },
  { id: "dock-mail", label: "Mail", icon: "ios4Mail", theme: art, action: { type: "app", app: "mail" } },
  { id: "dock-messages", label: "Messages", icon: "ios4Messages", theme: art, action: { type: "app", app: "messages" } },
  { id: "dock-safari", label: "Safari", icon: "ios4Safari", theme: art, action: { type: "app", app: "safari" } },
];

export const APP_TITLES: Record<MobileAppId, string> = {
  resume: "Résumé",
  notes: "Notes",
  projects: "Projects",
  about: "About Me",
  skills: "Skills",
  calculator: "Calculator",
  phone: "Phone",
  mail: "Mail",
  safari: "Safari",
  terminal: "Terminal",
  clock: "Clock",
  calendar: "Calendar",
  photos: "Photos",
  music: "Music",
  mines: "Minesweeper",
  draw: "Draw",
  messages: "Messages",
  settings: "Settings",
};

/** Icons per row on the home screen — the iPhone 4 is exactly four wide. */
export const ICONS_PER_ROW = 4;

/** Rows per home-screen page — the iPhone 4 grid is 4×4. */
export const ROWS_PER_PAGE = 4;

/** Icons per home-screen page (four full rows). */
export const APPS_PER_PAGE = ICONS_PER_ROW * ROWS_PER_PAGE;
