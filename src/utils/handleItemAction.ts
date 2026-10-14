import type { DesktopItem, SiteLinks } from "../types";

interface HandleItemActionDeps {
  openWindow: (id: string) => void;
  links: SiteLinks;
}

/**
 * Executes the action described by a desktop/start-menu item.
 * "window" items open a window by id; "link" items open an external URL
 * (looked up from siteConfig.links by key) in a new tab.
 */
export function handleItemAction(item: DesktopItem, { openWindow, links }: HandleItemActionDeps): void {
  if (item.type === "link") {
    const url = links[item.target as keyof SiteLinks];
    if (url) window.open(url, "_blank", "noopener");
    return;
  }
  openWindow(item.target);
}
