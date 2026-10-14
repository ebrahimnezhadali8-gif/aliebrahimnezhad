import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  MAX_BRIGHTNESS,
  clampBrightness,
  dimOpacityFor,
  readStoredBrightness,
  storeBrightness,
} from "../utils/brightness";

export interface DesktopSettingsValue {
  /** 0.3 (dimmest) → 1 (brightest). */
  brightness: number;
  /** Opacity of the dimming overlay drawn over the desktop; 0 means "not dimmed". */
  dimOpacity: number;
  /** Brightness as a whole percentage — handy for the tray label. */
  brightnessPercent: number;
  setBrightness: (value: number) => void;
}

const DesktopSettingsContext = createContext<DesktopSettingsValue | null>(null);

/**
 * Holds desktop-wide "display" settings. Currently just the screen brightness
 * used by the taskbar's brightness popover; the desktop reads `dimOpacity` and
 * paints a black overlay to dim wallpaper, icons and open windows alike.
 *
 * Kept separate from `WindowManagerProvider` so window management tests don't
 * have to care about presentation settings (and vice-versa).
 */
export function DesktopSettingsProvider({ children }: { children: ReactNode }) {
  const [brightness, setBrightnessState] = useState<number>(readStoredBrightness);

  const setBrightness = useCallback((value: number) => {
    setBrightnessState((current) => {
      const next = clampBrightness(value);
      if (next !== current) storeBrightness(next);
      return next;
    });
  }, []);

  const value = useMemo<DesktopSettingsValue>(
    () => ({
      brightness,
      dimOpacity: dimOpacityFor(brightness),
      brightnessPercent: Math.round(brightness * 100),
      setBrightness,
    }),
    [brightness, setBrightness]
  );

  return <DesktopSettingsContext.Provider value={value}>{children}</DesktopSettingsContext.Provider>;
}

/**
 * Reads the desktop display settings.
 *
 * Falls back to full brightness when used outside a provider so isolated
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
    };
  }
  return ctx;
}
