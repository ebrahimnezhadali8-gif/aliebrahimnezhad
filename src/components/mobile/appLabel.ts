import type { UiStrings } from "../../i18n/strings";
import type { MobileIconItem } from "./mobileTypes";

/** iOS apps keep their brand name; the system apps follow the interface language. */
export function appLabel(t: (key: keyof UiStrings) => string) {
  return (item: MobileIconItem): string => {
    switch (item.id) {
      case "resume":
        return t("resume");
      case "notes":
        return t("notes");
      case "projects":
        return t("projectsApp");
      case "about":
        return t("aboutApp");
      case "skills":
        return t("skills");
      case "calculator":
        return t("calculatorApp");
      case "safari":
        return t("safari");
      case "settings":
        return t("settingsApp");
      case "dock-messages":
        return t("messagesApp");
      case "terminal":
        return t("terminalApp");
      case "clock":
        return t("clockApp");
      case "calendar":
        return t("calendarApp");
      case "photos":
        return t("photos");
      case "music":
        return t("musicApp");
      case "mines":
        return t("minesweeper");
      case "draw":
        return t("drawApp");
      case "dock-safari":
        return t("safari");
      case "dock-phone":
        return t("phone");
      case "dock-mail":
        return t("mail");
      default:
        // Brand names (GitHub, LinkedIn, Instagram, Telegram) stay as-is in
        // every language — that is how they are actually written.
        return item.label;
    }
  };
}
