import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import SettingsApp from "./SettingsApp";
import SafariApp from "./SafariApp";
import { siteConfig } from "../../../config/siteConfig";
import { MOBILE_WALLPAPERS, MOBILE_WALLPAPER_STORAGE_KEY } from "../../../hooks/useWallpaperCycle";
import { CALENDAR_STORAGE_KEY } from "../../../utils/calendar";
import { THEME_STORAGE_KEY } from "../../../utils/theme";
import { LANGUAGE_STORAGE_KEY } from "../../../i18n/language";
import { BRIGHTNESS_STORAGE_KEY } from "../../../utils/brightness";
import { renderWithProviders } from "../../../test/testUtils";

describe("SettingsApp (mobile)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders every settings group", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    const panel = screen.getByTestId("mobile-settings");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent("Appearance");
    expect(panel).toHaveTextContent("Screen");
    expect(panel).toHaveTextContent("System");
  });

  it("changes the wallpaper from the phone, which was impossible before", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    expect(screen.getByTestId("mobile-wallpaper-0")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByTestId("mobile-wallpaper-1"));
    expect(window.localStorage.getItem(MOBILE_WALLPAPER_STORAGE_KEY)).toBe("1");
    expect(screen.getByTestId("mobile-wallpaper-1")).toHaveAttribute("aria-pressed", "true");
  });

  it("offers every wallpaper in the mobile gallery", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    for (let i = 0; i < MOBILE_WALLPAPERS.length; i += 1) {
      expect(screen.getByTestId(`mobile-wallpaper-${i}`)).toBeInTheDocument();
    }
  });

  it("toggles dark mode", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    const toggle = screen.getByTestId("mobile-settings-dark");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("adjusts brightness and volume", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    fireEvent.change(screen.getByTestId("mobile-settings-brightness"), { target: { value: "60" } });
    expect(window.localStorage.getItem(BRIGHTNESS_STORAGE_KEY)).toBe("0.6");

    fireEvent.change(screen.getByTestId("mobile-settings-volume"), { target: { value: "20" } });
    expect(screen.getByTestId("mobile-settings-volume")).toHaveValue("20");
  });

  it("switches the calendar system", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("mobile-settings-calendar-jalali"));
    expect(screen.getByTestId("mobile-settings-calendar-jalali")).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(CALENDAR_STORAGE_KEY)).toBe("jalali");
  });

  it("switches language: text goes RTL, the layout stays put", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("mobile-settings-lang-fa"));

    expect(document.documentElement.dataset.textDir).toBe("rtl");
    expect(document.documentElement.dir).toBe("ltr");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("fa");
    expect(screen.getByTestId("mobile-settings")).toHaveTextContent("روشنایی");
  });

  it("goes back to the home screen", () => {
    renderWithProviders(<SettingsApp onBack={() => {}} />);
    expect(screen.getByRole("button", { name: /back to home/i })).toBeInTheDocument();
  });
});

describe("SafariApp (mobile)", () => {
  it("embeds the first project live", () => {
    renderWithProviders(<SafariApp onBack={() => {}} />);
    expect(screen.getByTestId("browser-frame")).toHaveAttribute("src", siteConfig.projects[0].link);
  });

  it("can switch to any project", () => {
    renderWithProviders(<SafariApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("browser-fav-boomsv"));
    expect(screen.getByTestId("browser-frame")).toHaveAttribute("src", "https://boomsv.ir");
  });
});