import { describe, it, expect } from "vitest";
import { getContent } from "./useContent";
import { siteConfig } from "../config/siteConfig";
import { faContent } from "../i18n/fa";

describe("getContent", () => {
  it("returns the English config untouched for 'en'", () => {
    const content = getContent("en");
    expect(content.name).toBe(siteConfig.name);
    expect(content.role).toBe(siteConfig.role);
    expect(content.about).toBe(siteConfig.about);
    expect(content.projects).toBe(siteConfig.projects);
    expect(content.stats).toBe(siteConfig.stats);
  });

  it("translates the role, about copy and stats for 'fa'", () => {
    const content = getContent("fa");
    expect(content.role).toBe(faContent.role);
    expect(content.about).toEqual([...faContent.about]);
    expect(content.stats).toEqual({ ...faContent.stats });
    expect(content.about.length).toBe(siteConfig.about.length);
  });

  it("keeps factual fields shared across languages", () => {
    const fa = getContent("fa");
    expect(fa.email).toBe(siteConfig.email);
    expect(fa.phone).toBe(siteConfig.phone);
    expect(fa.location).toBe(siteConfig.location);
    expect(fa.skills).toBe(siteConfig.skills);
  });

  it("translates project prose but keeps ids, links, logos and tags", () => {
    const en = getContent("en");
    const fa = getContent("fa");

    expect(fa.projects).toHaveLength(en.projects.length);
    fa.projects.forEach((project, index) => {
      const source = en.projects[index];
      expect(project.id).toBe(source.id);
      expect(project.link).toBe(source.link);
      expect(project.logo).toBe(source.logo);
      expect(project.year).toBe(source.year);
      expect(project.tags).toEqual(source.tags);

      expect(project.title).toBe(faContent.projects[index].title);
      expect(project.desc).toBe(faContent.projects[index].desc);
      expect(project.highlights).toEqual([...faContent.projects[index].highlights]);
    });
  });

  it("uses Persian numerals for the Persian stats", () => {
    expect(getContent("fa").stats.experience).toMatch(/[۰-۹]/);
  });

  it("never hands out the shared arrays, so a caller can't mutate the config", () => {
    const fa = getContent("fa");
    fa.about.push("tampered");
    fa.projects[0].highlights.push("tampered");

    expect(getContent("fa").about).toHaveLength(siteConfig.about.length);
    expect(getContent("fa").projects[0].highlights).not.toContain("tampered");
    expect(siteConfig.about).not.toContain("tampered");
  });
});