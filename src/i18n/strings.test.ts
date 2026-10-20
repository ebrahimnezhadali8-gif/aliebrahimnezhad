import { describe, it, expect } from "vitest";
import { uiStrings, translate, type UiStrings } from "./strings";
import { directionFor, htmlLangFor, isLanguage, LANGUAGES } from "./language";

describe("language helpers", () => {
  it("knows exactly two languages", () => {
    expect(LANGUAGES).toEqual(["en", "fa"]);
  });

  it("maps Persian to RTL and English to LTR", () => {
    expect(directionFor("fa")).toBe("rtl");
    expect(directionFor("en")).toBe("ltr");
  });

  it("emits a full locale tag for the html lang attribute", () => {
    expect(htmlLangFor("fa")).toBe("fa-IR");
    expect(htmlLangFor("en")).toBe("en");
  });

  it("rejects anything that is not a supported language", () => {
    expect(isLanguage("fa")).toBe(true);
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage("de")).toBe(false);
    expect(isLanguage(null)).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
  });
});

describe("ui strings", () => {
  const keys = Object.keys(uiStrings.en) as Array<keyof UiStrings>;

  it("translates every English key into Persian", () => {
    const missing = keys.filter((key) => !uiStrings.fa[key] || !uiStrings.fa[key].trim());
    expect(missing).toEqual([]);
  });

  it("has no extra Persian keys that English lacks", () => {
    const extra = Object.keys(uiStrings.fa).filter(
      (key) => !(key in uiStrings.en)
    );
    expect(extra).toEqual([]);
  });

  it("gives each Persian string a real translation, not the English one", () => {
    // Brand names legitimately stay identical; everything else should change.
    const brandNames = new Set(["github", "linkedin", "instagram", "telegram", "safari", "nero"]);
    const identical = keys.filter(
      (key) => !brandNames.has(key) && uiStrings.fa[key] === uiStrings.en[key]
    );
    expect(identical).toEqual([]);
  });

  it("keeps Persian strings free of stray HTML or placeholder braces", () => {
    for (const key of keys) {
      const value = uiStrings.fa[key];
      expect(value, key).not.toMatch(/[<>{}]/);
    }
  });

  it("lookups go through the requested language", () => {
    expect(translate("en", "settings")).toBe("Settings");
    expect(translate("fa", "settings")).toBe("تنظیمات");
    expect(translate("fa", "brightness")).toBe("روشنایی");
  });
});