import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MAX_BRIGHTNESS,
  clampBrightness,
  dimOpacityFor,
  readStoredBrightness,
  storeBrightness,
} from "../utils/brightness";
import {
  LANGUAGE_STORAGE_KEY,
  directionFor,
  htmlLangFor,
  isLanguage,
  type Language,
} from "../i18n/language";
import { CALENDAR_STORAGE_KEY, isCalendarSystem, type CalendarSystem } from "../utils/jalali";
import { THEME_STORAGE_KEY, isThemeMode, type ThemeMode } from "../utils/theme";
import {
  MOBILE_WALLPAPERS,
  MOBILE_WALLPAPER_STORAGE_KEY,
  WALLPAPER_STORAGE_KEY,
  wallpaperImages,
} from "../hooks/useWallpaperCycle";
import { clampVolume, getVolumeLevel, setVolumeLevel } from "../utils/sound";

const WALLPAPER_CYCLE_MS = 2 * 60 * 1000;

export interface DesktopSettingsValue {
  /** 0.3 (dimmest) → 1 (brightest). */
  brightness: number;
  /** Opacity of the dimming overlay drawn over the desktop; 0 means "not dimmed". */
  dimOpacity: number;
  /** Brightness as a whole percentage — handy for the tray label. */
  brightnessPercent: number;
  setBrightness: (value: number) => void;

  /** Master volume (0–1). Writing it also drives the real audio gain. */
  volume: number;
  volumePercent: number;
  setVolume: (value: number) => void;

  wallpaper: string;
  wallpaperIndex: number;
  setWallpaperIndex: (index: number) => void;
  nextWallpaper: () => void;
  previousWallpaper: () => void;

  /** The phone skin cycles its own gallery, led by the iPhone-era sky. */
  mobileWallpaper: string;
  mobileWallpaperIndex: number;
  setMobileWallpaperIndex: (index: number) => void;
  nextMobileWallpaper: () => void;

  theme: ThemeMode;
  toggleTheme: () => void;

  calendar: CalendarSystem;
  toggleCalendar: () => void;
  setCalendar: (calendar: CalendarSystem) => void;

  lang: Language;
  dir: "ltr" | "rtl";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const DesktopSettingsContext = createContext<DesktopSettingsValue | null>(null);

function readStoredNumber(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredString(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the setting still applies for this session */
  }
}

/** True when a stored index actually points at an existing item. */
function isValidIndex(index: number | null, length: number): boolean {
  return index !== null && Number.isInteger(index) && index >= 0 && index < length;
}

/** Wraps an index into `[0, length)`, so "next" from the last item returns to the first. */
function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Every device-wide preference that isn't window management: screen brightness,
 * wallpaper, light/dark theme, calendar system and interface language.
 *
 * Shared by the Windows shell *and* the phone skin so a setting changed in
 * either place applies everywhere and survives a reload.
 */
export function DesktopSettingsProvider({ children }: { children: ReactNode }) {
  const [brightness, setBrightnessState] = useState<number>(readStoredBrightness);
  const [volume, setVolumeState] = useState<number>(getVolumeLevel);

  const initialWallpaper = readStoredNumber(WALLPAPER_STORAGE_KEY);
  const [wallpaperIndex, setWallpaperIndexState] = useState<number>(() =>
    isValidIndex(initialWallpaper, wallpaperImages.length) ? initialWallpaper! : 0
  );

  const initialMobileWallpaper = readStoredNumber(MOBILE_WALLPAPER_STORAGE_KEY);
  const [mobileWallpaperIndex, setMobileWallpaperIndexState] = useState<number>(() =>
    isValidIndex(initialMobileWallpaper, MOBILE_WALLPAPERS.length) ? initialMobileWallpaper! : 0
  );

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = readStoredString(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "light";
  });

  const [calendar, setCalendarState] = useState<CalendarSystem>(() => {
    const stored = readStoredString(CALENDAR_STORAGE_KEY);
    return isCalendarSystem(stored) ? stored : "gregorian";
  });

  const [lang, setLangState] = useState<Language>(() => {
    const stored = readStoredString(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
    // First visit: follow the browser's language, the way a real site would.
    if (typeof navigator !== "undefined" && /^fa\b/i.test(navigator.language ?? "")) return "fa";
    return "en";
  });

  // <html lang> follows the language for screen readers and fonts. The page
  // itself stays `dir="ltr"` on purpose: flipping it would mirror the whole OS
  // (Start button, taskbar, window chrome). Only *text* turns right-to-left,
  // through the `data-text-dir` rules in theme.css.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLangFor(lang);
    root.dir = "ltr";
    root.dataset.textDir = directionFor(lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setBrightness = useCallback((value: number) => {
    setBrightnessState((current) => {
      const next = clampBrightness(value);
      if (next !== current) storeBrightness(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState((current) => {
      const next = clampVolume(value);
      if (next !== current) setVolumeLevel(next);
      return next;
    });
  }, []);

  const setWallpaperIndex = useCallback((index: number) => {
    setWallpaperIndexState((current) => {
      const next = wrapIndex(index, wallpaperImages.length);
      if (next !== current) writeStored(WALLPAPER_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const nextWallpaper = useCallback(
    () =>
      setWallpaperIndexState((current) => {
        const next = wrapIndex(current + 1, wallpaperImages.length);
        writeStored(WALLPAPER_STORAGE_KEY, String(next));
        return next;
      }),
    []
  );

  const previousWallpaper = useCallback(
    () =>
      setWallpaperIndexState((current) => {
        const next = wrapIndex(current - 1, wallpaperImages.length);
        writeStored(WALLPAPER_STORAGE_KEY, String(next));
        return next;
      }),
    []
  );

  const setMobileWallpaperIndex = useCallback((index: number) => {
    setMobileWallpaperIndexState((current) => {
      const next = wrapIndex(index, MOBILE_WALLPAPERS.length);
      if (next !== current) writeStored(MOBILE_WALLPAPER_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const nextMobileWallpaper = useCallback(
    () =>
      setMobileWallpaperIndexState((current) => {
        const next = wrapIndex(current + 1, MOBILE_WALLPAPERS.length);
        writeStored(MOBILE_WALLPAPER_STORAGE_KEY, String(next));
        return next;
      }),
    []
  );

  // Gentle wallpaper rotation, like the real thing.
  useEffect(() => {
    const timer = setInterval(nextWallpaper, WALLPAPER_CYCLE_MS);
    return () => clearInterval(timer);
  }, [nextWallpaper]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: ThemeMode = current === "light" ? "dark" : "light";
      writeStored(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setCalendar = useCallback((next: CalendarSystem) => {
    setCalendarState((current) => {
      if (next !== current) writeStored(CALENDAR_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const toggleCalendar = useCallback(
    () => setCalendar(calendar === "jalali" ? "gregorian" : "jalali"),
    [calendar, setCalendar]
  );

  const setLang = useCallback((next: Language) => {
    setLangState((current) => {
      if (next !== current) writeStored(LANGUAGE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const toggleLang = useCallback(() => setLang(lang === "en" ? "fa" : "en"), [lang, setLang]);

  const value = useMemo<DesktopSettingsValue>(
    () => ({
      brightness,
      dimOpacity: dimOpacityFor(brightness),
      brightnessPercent: Math.round(brightness * 100),
      setBrightness,
      volume,
      volumePercent: Math.round(volume * 100),
      setVolume,
      wallpaper: wallpaperImages[wallpaperIndex] ?? wallpaperImages[0],
      wallpaperIndex,
      setWallpaperIndex,
      nextWallpaper,
      previousWallpaper,
      mobileWallpaper: MOBILE_WALLPAPERS[mobileWallpaperIndex] ?? MOBILE_WALLPAPERS[0],
      mobileWallpaperIndex,
      setMobileWallpaperIndex,
      nextMobileWallpaper,
      theme,
      toggleTheme,
      calendar,
      toggleCalendar,
      setCalendar,
      lang,
      dir: directionFor(lang),
      setLang,
      toggleLang,
    }),
    [
      brightness,
      setBrightness,
      volume,
      setVolume,
      wallpaperIndex,
      setWallpaperIndex,
      nextWallpaper,
      previousWallpaper,
      mobileWallpaperIndex,
      setMobileWallpaperIndex,
      nextMobileWallpaper,
      theme,
      toggleTheme,
      calendar,
      toggleCalendar,
      setCalendar,
      lang,
      setLang,
      toggleLang,
    ]
  );

  return <DesktopSettingsContext.Provider value={value}>{children}</DesktopSettingsContext.Provider>;
}

/**
 * Reads the device-wide preferences.
 *
 * Falls back to sane defaults when used outside a provider so isolated
 * component tests (e.g. a single taskbar widget) can render on their own.
 */
export function useDesktopSettings(): DesktopSettingsValue {
  const ctx = useContext(DesktopSettingsContext);
  if (!ctx) {
    return {
      brightness: MAX_BRIGHTNESS,
      dimOpacity: 0,
      brightnessPercent: 100,
      setBrightness: () => {},
      volume: 1,
      volumePercent: 100,
      setVolume: () => {},
      wallpaper: wallpaperImages[0],
      wallpaperIndex: 0,
      setWallpaperIndex: () => {},
      nextWallpaper: () => {},
      previousWallpaper: () => {},
      mobileWallpaper: MOBILE_WALLPAPERS[0],
      mobileWallpaperIndex: 0,
      setMobileWallpaperIndex: () => {},
      nextMobileWallpaper: () => {},
      theme: "light",
      toggleTheme: () => {},
      calendar: "gregorian",
      toggleCalendar: () => {},
      setCalendar: () => {},
      lang: "en",
      dir: "ltr",
      setLang: () => {},
      toggleLang: () => {},
    };
  }
  return ctx;
}