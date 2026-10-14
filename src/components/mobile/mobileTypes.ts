import type { IconName, SiteLinks } from "../../types";

export type MobileAppId =
  | "resume"
  | "notes"
  | "projects"
  | "about"
  | "skills"
  | "calculator"
  | "phone"
  | "mail";

export type MobileAction =
  | { type: "app"; app: MobileAppId }
  | { type: "link"; target: keyof SiteLinks };

/**
 * How an app icon is painted, mirroring how iOS distinguishes the two kinds of
 * icon on a home screen:
 *  - `system`  → a coloured gradient tile with a white glyph (Notes, Mail, …)
 *  - `brand`   → a white tile carrying the product's real logo (GitHub, Instagram, …)
 */
export interface MobileIconTheme {
  kind: "system" | "brand";
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

const system = (background: string): MobileIconTheme => ({
  kind: "system",
  background,
  ink: "#ffffff",
});

const brand: MobileIconTheme = { kind: "brand" };

/**
 * Home screen — the same content as the desktop, re-skinned for iOS.
 * Six system apps on page one, the brand shortcuts on page two.
 */
export const homeScreenApps: MobileIconItem[] = [
  { id: "resume", label: "Résumé", icon: "iosDocument", theme: system("linear-gradient(180deg,#ff6f61 0%,#e5372c 55%,#c62828 100%)"), action: { type: "app", app: "resume" } },
  { id: "notes", label: "Notes", icon: "iosNotes", theme: system("linear-gradient(180deg,#ffe680 0%,#f8c33c 55%,#eda908 100%)"), action: { type: "app", app: "notes" } },
  { id: "projects", label: "Projects", icon: "iosFolder", theme: system("linear-gradient(180deg,#6fcbf7 0%,#1a8fe0 55%,#0a63c4 100%)"), action: { type: "app", app: "projects" } },
  { id: "about", label: "About Me", icon: "iosUser", theme: system("linear-gradient(180deg,#a8d8ff 0%,#3f8ae6 55%,#1c5fd0 100%)"), action: { type: "app", app: "about" } },
  { id: "skills", label: "Skills", icon: "iosSkills", theme: system("linear-gradient(180deg,#cfaaff 0%,#8b47ea 55%,#6320c7 100%)"), action: { type: "app", app: "skills" } },
  { id: "calculator", label: "Calculator", icon: "iosCalculator", theme: system("linear-gradient(180deg,#55555c 0%,#26262b 55%,#101013 100%)"), action: { type: "app", app: "calculator" } },
  { id: "github", label: "GitHub", icon: "github", theme: brand, action: { type: "link", target: "github" } },
  { id: "linkedin", label: "LinkedIn", icon: "iosLinkedin", theme: system("linear-gradient(180deg,#2b7fd4 0%,#0a66c2 55%,#074a92 100%)"), action: { type: "link", target: "linkedin" } },
  { id: "instagram", label: "Instagram", icon: "instagram", theme: brand, action: { type: "link", target: "instagram" } },
  { id: "telegram", label: "Telegram", icon: "iosTelegram", theme: system("linear-gradient(180deg,#4fc3f7 0%,#1c9ade 55%,#0d7cbb 100%)"), action: { type: "link", target: "telegram" } },
];

/**
 * Bottom dock — exactly 4 slots, like iOS. Phone and Mail open dedicated app
 * screens; Messages and GitHub are quick-access shortcuts, matching what is
 * already on the home screen so nothing is duplicated.
 */
export const dockApps: MobileIconItem[] = [
  { id: "dock-phone", label: "Phone", icon: "iosPhone", theme: system("linear-gradient(180deg,#7ce88a 0%,#25b845 55%,#12872f 100%)"), action: { type: "app", app: "phone" } },
  { id: "dock-mail", label: "Mail", icon: "iosMail", theme: system("linear-gradient(180deg,#6fcbf7 0%,#1a8fe0 55%,#0a63c4 100%)"), action: { type: "app", app: "mail" } },
  { id: "dock-messages", label: "Messages", icon: "iosMessages", theme: system("linear-gradient(180deg,#8ce99a 0%,#2fc44e 55%,#189a33 100%)"), action: { type: "link", target: "telegram" } },
  { id: "dock-github", label: "GitHub", icon: "github", theme: brand, action: { type: "link", target: "github" } },
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
};

/** Icons per row on the home screen — the iPhone 4 is exactly four wide. */
export const ICONS_PER_ROW = 4;

/** Icons per home-screen page (two full rows). */
export const APPS_PER_PAGE = ICONS_PER_ROW * 2;
