import { describe, it, expect, vi, afterEach } from "vitest";
import { handleItemAction } from "./handleItemAction";
import type { DesktopItem, SiteLinks } from "../types";

const links: SiteLinks = {
  linkedin: "https://linkedin.com/in/example",
  github: "https://github.com/example",
  instagram: "https://instagram.com/example",
  telegram: "https://t.me/example",
  google: "https://google.com",
  microsoft: "https://microsoft.com",
};

describe("handleItemAction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens a window for 'window' type items", () => {
    const openWindow = vi.fn();
    const item: DesktopItem = { id: "resume", label: "resume.pdf", icon: "pdf", type: "window", target: "resume" };
    handleItemAction(item, { openWindow, links });
    expect(openWindow).toHaveBeenCalledWith("resume");
  });

  it("opens a new tab for 'link' type items and does not open a window", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const openWindow = vi.fn();
    const item: DesktopItem = { id: "github", label: "github", icon: "github", type: "link", target: "github" };
    handleItemAction(item, { openWindow, links });
    expect(openSpy).toHaveBeenCalledWith(links.github, "_blank", "noopener");
    expect(openWindow).not.toHaveBeenCalled();
  });

  it("does nothing if the link target is unknown", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const item: DesktopItem = { id: "x", label: "x", icon: "github", type: "link", target: "missing" };
    handleItemAction(item, { openWindow: vi.fn(), links });
    expect(openSpy).not.toHaveBeenCalled();
  });
});
