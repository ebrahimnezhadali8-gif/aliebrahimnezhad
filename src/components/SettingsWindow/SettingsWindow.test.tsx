import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useEffect } from "react";
import SettingsWindow from "./SettingsWindow";
import Clock from "../Taskbar/Clock";
import StartMenu from "../StartMenu/StartMenu";
import { useWindowManager } from "../../context/WindowManagerContext";
import { renderWithProviders } from "../../test/testUtils";
import { wallpaperImages, WALLPAPER_STORAGE_KEY } from "../../hooks/useWallpaperCycle";
import { CALENDAR_STORAGE_KEY } from "../../utils/calendar";
import { THEME_STORAGE_KEY } from "../../utils/theme";
import { LANGUAGE_STORAGE_KEY } from "../../i18n/language";
import { BRIGHTNESS_STORAGE_KEY } from "../../utils/brightness";

function OpenSettings() {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    openWindow("settings");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <SettingsWindow />;
}

function OpenStartMenu() {
  const { toggleStartMenu } = useWindowManager();
  useEffect(() => {
    toggleStartMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <StartMenu />;
}

describe("SettingsWindow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the Control Panel-style settings hub", () => {
    renderWithProviders(<OpenSettings />);
    expect(screen.getByTestId("settings-window")).toBeInTheDocument();
  });

  describe("wallpaper", () => {
    it("offers a thumbnail for every wallpaper and marks the active one", () => {
      renderWithProviders(<OpenSettings />);
      for (let i = 0; i < wallpaperImages.length; i += 1) {
        expect(screen.getByTestId(`settings-wallpaper-${i}`)).toBeInTheDocument();
      }
      expect(screen.getByTestId("settings-wallpaper-0")).toHaveAttribute("aria-pressed", "true");
    });

    it("changing the wallpaper repaints the desktop and persists the choice", () => {
      renderWithProviders(<OpenSettings />);
      fireEvent.click(screen.getByTestId("settings-wallpaper-2"));

      expect(screen.getByTestId("settings-wallpaper-2")).toHaveAttribute("aria-pressed", "true");
      expect(window.localStorage.getItem(WALLPAPER_STORAGE_KEY)).toBe("2");
    });

    it("'Next background' cycles the wallpaper", () => {
      renderWithProviders(<OpenSettings />);
      fireEvent.click(screen.getByTestId("settings-next-wallpaper"));
      expect(window.localStorage.getItem(WALLPAPER_STORAGE_KEY)).toBe("1");
      fireEvent.click(screen.getByTestId("settings-next-wallpaper"));
      expect(window.localStorage.getItem(WALLPAPER_STORAGE_KEY)).toBe("2");
    });
  });

  describe("dark mode", () => {
    it("flips the document theme and persists it", () => {
      renderWithProviders(<OpenSettings />);
      const toggle = screen.getByTestId("settings-dark-mode");
      expect(toggle).toHaveAttribute("aria-checked", "false");

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-checked", "true");
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

      fireEvent.click(toggle);
      expect(document.documentElement.dataset.theme).toBe("light");
    });
  });

  describe("screen and sound", () => {
    it("brightness slider changes the value and persists it", () => {
      renderWithProviders(<OpenSettings />);
      fireEvent.change(screen.getByTestId("settings-brightness"), { target: { value: "45" } });
      expect(window.localStorage.getItem(BRIGHTNESS_STORAGE_KEY)).toBe("0.45");
    });

    it("volume slider changes the value", () => {
      renderWithProviders(<OpenSettings />);
      const slider = screen.getByTestId("settings-volume");
      fireEvent.change(slider, { target: { value: "30" } });
      expect(slider).toHaveValue("30");
    });
  });

  describe("calendar", () => {
    it("switches between Gregorian and Jalali and persists the choice", () => {
      renderWithProviders(<OpenSettings />);
      expect(screen.getByTestId("settings-calendar-gregorian")).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(screen.getByTestId("settings-calendar-jalali"));
      expect(screen.getByTestId("settings-calendar-jalali")).toHaveAttribute("aria-pressed", "true");
      expect(window.localStorage.getItem(CALENDAR_STORAGE_KEY)).toBe("jalali");
    });
  });

  describe("language", () => {
    it("switches the interface to Persian: text goes RTL but the page layout is not mirrored", () => {
      renderWithProviders(<OpenSettings />);
      expect(document.documentElement.dataset.textDir).toBe("ltr");

      fireEvent.click(screen.getByTestId("settings-lang-fa"));

      expect(document.documentElement.dataset.textDir).toBe("rtl");
      expect(document.documentElement.dir).toBe("ltr");
      expect(document.documentElement.lang).toBe("fa-IR");
      expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("fa");
      expect(screen.getByTestId("settings-window")).toHaveTextContent("روشنایی");
    });

    it("switches back to English", () => {
      renderWithProviders(<OpenSettings />);
      fireEvent.click(screen.getByTestId("settings-lang-fa"));
      fireEvent.click(screen.getByTestId("settings-lang-en"));

      expect(document.documentElement.dataset.textDir).toBe("ltr");
      expect(screen.getByTestId("settings-window")).toHaveTextContent("Brightness");
    });
  });
});

describe("language switching outside Settings", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("the Start menu offers the same switch", () => {
    renderWithProviders(<OpenStartMenu />);
    const button = screen.getByTestId("start-menu-language");
    expect(button).toHaveTextContent("Language");

    fireEvent.click(button);
    expect(document.documentElement.dataset.textDir).toBe("rtl");
    expect(screen.getByTestId("start-menu")).toHaveTextContent("تنظیمات");
  });
});

describe("Clock", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a Gregorian date by default and follows the calendar chosen in Settings", () => {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, "jalali");
    renderWithProviders(<Clock />);
    expect(screen.getByTestId("taskbar-date").textContent).toMatch(/[۰-۹]/);
  });

  it("is not a toggle: clicking it leaves the calendar alone", () => {
    renderWithProviders(<Clock />);
    fireEvent.click(screen.getByTestId("taskbar-clock"));
    expect(screen.getByTestId("taskbar-date").textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});