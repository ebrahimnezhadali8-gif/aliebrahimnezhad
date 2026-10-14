export type Language = "en" | "fa";

export const LANGUAGES: Language[] = ["en", "fa"];

export const LANGUAGE_STORAGE_KEY = "portfolio:language";

/** Persian reads right-to-left; English left-to-right. */
export function directionFor(lang: Language): "ltr" | "rtl" {
  return lang === "fa" ? "rtl" : "ltr";
}

/** The tag React wants on <html lang>. */
export function htmlLangFor(lang: Language): string {
  return lang === "fa" ? "fa-IR" : "en";
}

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "fa";
}