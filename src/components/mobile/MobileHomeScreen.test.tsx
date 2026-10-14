import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { renderWithProviders } from "../../test/testUtils";
import { APPS_PER_PAGE, ICONS_PER_ROW, dockApps, homeScreenApps } from "./mobileTypes";
import HomeScreen from "./HomeScreen/MobileHomeScreen";

function bootHome() {
  return renderWithProviders(<HomeScreen onActivate={() => {}} />);
}

describe("iOS home-screen icons", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("every app has a label and a themed icon", () => {
    for (const item of [...homeScreenApps, ...dockApps]) {
      expect(item.label.trim().length).toBeGreaterThan(0);
      expect(["system", "brand"]).toContain(item.theme.kind);
      if (item.theme.kind === "system") {
        // System tiles must supply a gradient, or the glyph lands on white.
        expect(item.theme.background).toMatch(/gradient/);
        expect(item.theme.ink).toBe("#ffffff");
      } else {
        expect(item.theme.background).toBeUndefined();
      }
    }
  });

  it("brand apps carry their real logo, everything else uses a white iOS glyph", () => {
    // A glyph that is a full-bleed colour shape (Telegram's blue disc, LinkedIn's
    // blue card) would look wrong on a gradient tile, so those get iOS versions.
    const offLimits = new Set(["github", "instagram"]);
    for (const item of [...homeScreenApps, ...dockApps]) {
      if (offLimits.has(item.icon)) continue;
      expect(item.icon.startsWith("ios"), `${item.id} should use an iOS glyph`).toBe(true);
    }

    // GitHub and Instagram keep their official artwork on a white tile.
    const brandIcons = [...homeScreenApps, ...dockApps]
      .filter((item) => item.theme.kind === "brand")
      .map((item) => item.icon);
    expect(new Set(brandIcons)).toEqual(new Set(["github", "instagram"]));
  });

  it("the dock holds exactly four slots, like iOS", () => {
    expect(dockApps).toHaveLength(4);
  });

  it("every item keeps a unique id so test ids never collide", () => {
    const ids = [...homeScreenApps, ...dockApps].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("paints system icons with the gradient and the white ink colour", () => {
    bootHome();
    const tile = screen.getByTestId("app-icon-notes").querySelector(".app-icon__tile") as HTMLElement;
    expect(tile.style.background).toContain("gradient");
    expect(tile.style.color).toBe("rgb(255, 255, 255)");
  });

  it("leaves brand icons on an untinted (white) tile so the logo keeps its colours", () => {
    bootHome();
    const tile = screen.getByTestId("app-icon-github").querySelector(".app-icon__tile") as HTMLElement;
    expect(tile.style.background).toBe("");
    expect(tile.style.color).toBe("");
  });

  it("gives every icon an accessible name from its label", () => {
    bootHome();
    for (const item of homeScreenApps) {
      expect(screen.getByTestId(`app-icon-${item.id}`)).toHaveAttribute("aria-label", item.label);
    }
  });

  it("reports which app was activated", () => {
    const onActivate = vi.fn();
    renderWithProviders(<HomeScreen onActivate={onActivate} />);
    const notes = homeScreenApps.find((item) => item.id === "notes");
    fireEvent.click(screen.getByTestId(`app-icon-${notes!.id}`));
    expect(onActivate).toHaveBeenCalledWith(notes);
  });

  it("opens the Control Center when the status bar is tapped", () => {
    const onOpenControlCenter = vi.fn();
    renderWithProviders(<HomeScreen onActivate={() => {}} onOpenControlCenter={onOpenControlCenter} />);
    fireEvent.click(screen.getByRole("button", { name: "Open Control Center" }));
    expect(onOpenControlCenter).toHaveBeenCalledTimes(1);
  });
});

describe("home-screen centring", () => {
  it("keeps every page full-bleed and centres the content inside it", () => {
    // Regression guard: capping the *page* width and relying on `margin: auto`
    // silently pushed the icons to the left edge, because a second page overflows
    // the scroller and leaves no free space for auto margins to absorb.
    bootHome();
    const page = screen.getByTestId("mobile-home-page-0");
    expect(page.className).toBe("mhome__page");
    expect(page.querySelector(":scope > .mhome__grid")).not.toBeNull();
  });

  it("builds explicit rows of four icons rather than a bare CSS grid", () => {
    // A partially-filled CSS grid row hugs the left edge; explicit rows get
    // centred as a whole, which is what keeps a short row balanced.
    bootHome();
    const rows = screen.getByTestId("mobile-home-pages").querySelectorAll(".mhome__row");
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.querySelectorAll(".app-icon").length).toBeLessThanOrEqual(ICONS_PER_ROW);
    }
    // Page 1 holds APPS_PER_PAGE icons => exactly two full rows.
    const firstRows = screen.getByTestId("mobile-home-page-0").querySelectorAll(".mhome__row");
    expect(firstRows).toHaveLength(APPS_PER_PAGE / ICONS_PER_ROW);
    for (const row of firstRows) {
      expect(row.className).not.toMatch(/--partial/);
      expect(row.querySelectorAll(".app-icon")).toHaveLength(ICONS_PER_ROW);
    }
  });

  it("marks a short row as partial so it can be centred", () => {
    bootHome();
    const rows = Array.from(
      screen.getByTestId("mobile-home-pages").querySelectorAll(".mhome__row")
    );
    const partial = rows.filter((row) => row.className.includes("--partial"));
    // 10 apps over 8-per-page => the last page has 2 icons in one partial row.
    expect(partial).toHaveLength(1);
    expect(partial[0].querySelectorAll(".app-icon")).toHaveLength(
      homeScreenApps.length % ICONS_PER_ROW
    );
  });

  it("renders every configured icon exactly once across all pages", () => {
    bootHome();
    const rendered = Array.from(
      screen.getByTestId("mobile-home-pages").querySelectorAll(".app-icon")
    ).map((node) => node.getAttribute("data-testid"));
    expect(rendered.sort()).toEqual(homeScreenApps.map((item) => `app-icon-${item.id}`).sort());
  });

  it("the dock centres its four icons the same way", () => {
    bootHome();
    const dock = screen.getByTestId("mobile-dock");
    expect(dock.querySelectorAll(".app-icon")).toHaveLength(4);
    expect(dock.querySelectorAll(".app-icon__tile")).toHaveLength(4);
  });
});
