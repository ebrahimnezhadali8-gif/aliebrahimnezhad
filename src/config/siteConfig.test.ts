import { describe, it, expect } from "vitest";
import { projectDomain, siteConfig, windowMeta } from "./siteConfig";
import { iconPaths } from "../icons/iconPaths";
import { wallpaperImages } from "../hooks/useWallpaperCycle";

const WINDOW_IDS = [
  "resume",
  "projects",
  "about",
  "skills",
  "contact",
  "calculator",
  "cmd",
] as const;

describe("siteConfig integrity", () => {
  it("every desktop item has a unique id, a label and an icon", () => {
    const ids = siteConfig.desktopItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of siteConfig.desktopItems) {
      expect(item.label.trim().length).toBeGreaterThan(0);
      expect(iconPaths[item.icon]).toBeDefined();
    }
  });

  it("every start-menu-only item also has a known icon", () => {
    for (const item of siteConfig.startMenuExtraItems) {
      expect(iconPaths[item.icon]).toBeDefined();
    }
  });

  it("no id is shared between desktop items and start-menu extras", () => {
    const desktopIds = new Set(siteConfig.desktopItems.map((item) => item.id));
    for (const item of siteConfig.startMenuExtraItems) {
      expect(desktopIds.has(item.id)).toBe(false);
    }
  });

  it("every 'link' item points at a configured URL and every 'window' item at a known window", () => {
    for (const item of [...siteConfig.desktopItems, ...siteConfig.startMenuExtraItems]) {
      if (item.type === "link") {
        const url = siteConfig.links[item.target as keyof typeof siteConfig.links];
        expect(url, `${item.id} has no URL`).toBeTruthy();
        expect(url).toMatch(/^https?:\/\//);
      } else {
        expect(Object.keys(windowMeta), `${item.id} has no window meta`).toContain(item.target);
      }
    }
  });

  it("has window meta for every window that can be opened", () => {
    for (const id of WINDOW_IDS) {
      const meta = windowMeta[id];
      expect(meta, `missing meta for ${id}`).toBeDefined();
      expect(iconPaths[meta.icon]).toBeDefined();
      expect(meta.width).toBeGreaterThan(0);
      expect(meta.height).toBeGreaterThan(0);
    }
  });

  it("every skill is named, uses a real icon and stays within 0–100%", () => {
    const names = siteConfig.skills.map((skill) => skill.name);
    expect(new Set(names).size).toBe(names.length);
    for (const skill of siteConfig.skills) {
      expect(iconPaths[skill.icon], `no icon for skill ${skill.name}`).toBeDefined();
      expect(skill.pct).toBeGreaterThan(0);
      expect(skill.pct).toBeLessThanOrEqual(100);
    }
  });

  it("inlines the official brand marks for the headline technologies", () => {
    // These are the icons that had to be the real, official logos.
    expect(iconPaths.postgres).toBeDefined();
    expect(iconPaths.nextjs).toBeDefined();
    expect(iconPaths.nestjs).toBeDefined();
    expect(iconPaths.express).toBeDefined();
  });

  it("has at least one Next.js and one NestJS skill, using the official icons", () => {
    const next = siteConfig.skills.find((skill) => /next\.?js/i.test(skill.name));
    const nest = siteConfig.skills.find((skill) => /nest/i.test(skill.name));
    expect(next?.icon).toBe("nextjs");
    expect(nest?.icon).toBe("nestjs");
  });

  it("PostgreSQL is listed with the official Postgres icon", () => {
    const pg = siteConfig.skills.find((skill) => /postgres/i.test(skill.name));
    expect(pg?.icon).toBe("postgres");
  });

  it("every project is complete, unique and links to a real https URL", () => {
    const ids = siteConfig.projects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const project of siteConfig.projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.tagline.trim().length).toBeGreaterThan(0);
      expect(project.desc.length).toBeGreaterThan(80);
      expect(project.highlights.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeGreaterThan(0);
      expect(project.link).toMatch(/^https:\/\//);
      expect(project.linkLabel.toLowerCase()).toContain(projectDomain(project.link).split(".")[0]);
      expect(project.year).toMatch(/^\d{4}$/);
    }
  });

  it("contains the three published projects", () => {
    expect(siteConfig.projects.map((p) => p.link)).toEqual([
      "https://workchi.ir",
      "https://narvash.com",
      "https://boomsv.ir",
    ]);
  });

  it("Workchi is dated to the current year", () => {
    const workchi = siteConfig.projects.find((p) => p.id === "workchi");
    expect(workchi?.year).toBe(String(new Date().getFullYear()));
  });

  it("Narvash is built on WordPress, not a custom framework", () => {
    const narvash = siteConfig.projects.find((p) => p.id === "narvash");
    expect(narvash?.tags).toContain("WordPress");
    expect(narvash?.tags.join(" ")).not.toMatch(/Next\.js|NestJS|Express/);
  });

  it("Workchi and Narvash ship their own logo image, pointing at /public/images", () => {
    const logos = siteConfig.projects.filter((p) => p.logo).map((p) => p.logo);
    expect(logos).toContain("/images/workchi.jpg");
    expect(logos).toContain("/images/narvash.jpg");
    for (const project of siteConfig.projects) {
      if (!project.logo) continue;
      expect(project.logo).toMatch(/^\/images\/[\w.-]+\.(png|jpe?g|webp|svg|gif)$/);
      expect(project.logo).not.toMatch(/\s/);
    }
  });

  it("about copy and stats are populated", () => {
    expect(siteConfig.about.length).toBeGreaterThanOrEqual(3);
    for (const paragraph of siteConfig.about) {
      expect(paragraph.trim().length).toBeGreaterThan(40);
    }
    expect(siteConfig.stats.experience).toMatch(/^\+\d+$/);
  });
});

describe("projectDomain", () => {
  it("strips the scheme and any trailing slash", () => {
    expect(projectDomain("https://workchi.ir")).toBe("workchi.ir");
    expect(projectDomain("https://narvash.com/")).toBe("narvash.com");
    expect(projectDomain("http://boomsv.ir")).toBe("boomsv.ir");
  });
});

describe("wallpaper cycle", () => {
  it("offers more than one wallpaper", () => {
    expect(wallpaperImages.length).toBeGreaterThan(1);
  });
});
