export type WindowId =
  | "resume"
  | "projects"
  | "about"
  | "skills"
  | "contact"
  | "calculator"
  | "cmd"
  | "ie"
  | "settings";

export type IconName =
  | "folder"
  | "folderSmall"
  | "pdf"
  | "github"
  | "linkedin"
  | "instagram"
  | "telegram"
  | "google"
  | "microsoft"
  | "phone"
  | "user"
  | "skills"
  | "react"
  | "nextjs"
  | "nestjs"
  | "express"
  | "ts"
  | "node"
  | "mysql"
  | "postgres"
  | "contactPerson"
  | "windowsLogo"
  | "windowsLogoLight"
  | "email"
  | "location"
  | "calculator"
  | "cmd"
  | "power"        // جدید
  | "wordpress"    // جدید
  | "speaker"      // جدید
  | "sun"          // روشنایی صفحه
  | "mail"
  | "notes"
  | "chrome"
  | "messages"
  // --- iOS-style glyphs for the phone/tablet skin (all use currentColor) ---
  | "apple"
  | "iosDocument"
  | "iosNotes"
  | "iosFolder"
  | "iosSkills"
  | "iosCalculator"
  | "iosPhone"
  | "iosMail"
  | "iosUser"
  | "iosMessages"
  | "iosTelegram"
  | "iosLinkedin"
  | "wifi"
  | "airplane"
  | "bluetooth"
  | "moon"
  | "rotationLock"
  | "ie"
  | "safari"
  | "settings"
  | "gear"
  | "contrast"
  | "search"
  | "recycle"
  | "clock"
  | "terminal"
  | "iosSettings"
  | "ios4Phone"
  | "ios4Mail"
  | "ios4Messages"
  | "ios4Notes"
  | "ios4Calculator"
  | "ios4Settings"
  | "ios4Safari"
  | "ios4Projects"
  | "ios4About"
  | "ios4Skills"
  | "ios4Resume"
  | "ios4Linkedin"
  | "ios4Telegram"
  | "ios4Terminal"
  | "ios4Calendar"
  | "ios4Instagram"
  | "ios4Clock"
  | "nero"
  | "minesweeper"
  | "solitaire"
  | "freecell"
  | "taskmgr"
  | "paint"
  | "media"
  | "photos"
  | "ios4Photos"
  | "ios4Music"
  | "ios4Mines"
  | "ios4Draw"
  | "globe";

export type ItemType = "window" | "link";

export interface DesktopItem {
  id: string;
  label: string;
  icon: IconName;
  type: ItemType;
  /** Window id (for type "window") or a key into siteConfig.links (for type "link"). */
  target: string;
}

export interface WindowMeta {
  title: string;
  icon: IconName;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  title: string;
  /** One short line shown under the title in listings. */
  tagline: string;
  /** A couple of paragraphs describing what the product does and why. */
  desc: string;
  /** Concrete feature bullets. */
  highlights: string[];
  tags: string[];
  link: string;
  /** Text of the outbound link button ("Visit workchi.ir"). */
  linkLabel: string;
  year: string;
  /** Path to the project's own logo/brand image, when one is available. */
  logo?: string;
}

/** A dated entry shown in the Calendar apps; `date` is an ISO day, e.g. "2026-03-21". */
export interface CalendarEvent {
  date: string;
  title: string;
}

export interface Skill {
  name: string;
  pct: number;
  icon: IconName;
}

export interface SiteLinks {
  linkedin: string;
  github: string;
  instagram: string;
  telegram: string;
  google: string;
  microsoft: string;
}

/** Per-window runtime state tracked by the window manager. */
export interface WindowState {
  zIndex: number;
  minimized: boolean;
}