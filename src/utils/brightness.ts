export const BRIGHTNESS_STORAGE_KEY = "portfolio:brightness";

/** Windows never lets you turn the panel fully black — keep a readable floor. */
export const MIN_BRIGHTNESS = 0.3;
export const MAX_BRIGHTNESS = 1;

/** Clamps any input (including NaN / Infinity) into the usable brightness range. */
export function clampBrightness(value: number): number {
  if (!Number.isFinite(value)) return MAX_BRIGHTNESS;
  return Math.min(MAX_BRIGHTNESS, Math.max(MIN_BRIGHTNESS, value));
}

/** How opaque the dimming overlay has to be for a given brightness level (1 → clear). */
export function dimOpacityFor(brightness: number): number {
  return 1 - clampBrightness(brightness);
}

/** Reads the persisted brightness, falling back to full brightness. */
export function readStoredBrightness(): number {
  if (typeof window === "undefined") return MAX_BRIGHTNESS;
  try {
    const raw = window.localStorage.getItem(BRIGHTNESS_STORAGE_KEY);
    return raw === null ? MAX_BRIGHTNESS : clampBrightness(Number(raw));
  } catch {
    // Private-mode browsers throw on access — full brightness is a safe default.
    return MAX_BRIGHTNESS;
  }
}

/** Persists the brightness so it survives a reload. Never throws. */
export function storeBrightness(brightness: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BRIGHTNESS_STORAGE_KEY, String(clampBrightness(brightness)));
  } catch {
    /* storage unavailable — the setting still applies for this session */
  }
}
