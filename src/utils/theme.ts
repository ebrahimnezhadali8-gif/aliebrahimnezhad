export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio:theme";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}