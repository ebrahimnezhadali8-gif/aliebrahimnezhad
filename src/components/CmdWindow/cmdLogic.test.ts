import { describe, it, expect } from "vitest";
import { runCommand } from "./cmdLogic";
import { siteConfig } from "../../config/siteConfig";

describe("runCommand", () => {
  it("user reports the configured name and role", () => {
    expect(runCommand("user")).toEqual({
      type: "text",
      lines: [siteConfig.name, siteConfig.role],
    });
  });

  it("whoami is an alias for user", () => {
    expect(runCommand("whoami")).toEqual(runCommand("user"));
  });

  it("help lists the available commands", () => {
    const result = runCommand("help");
    expect(result.type).toBe("text");
    if (result.type === "text") {
      expect(result.lines[0]).toMatch(/available commands/i);
      expect(result.lines.some((l) => l.includes("user"))).toBe(true);
      expect(result.lines.some((l) => l.includes("whoami"))).toBe(true);
    }
  });

  it("cls and clear both return a 'clear' action", () => {
    expect(runCommand("cls")).toEqual({ type: "clear" });
    expect(runCommand("clear")).toEqual({ type: "clear" });
  });

  it("exit returns an 'exit' action", () => {
    expect(runCommand("exit")).toEqual({ type: "exit" });
  });

  it("an unknown command returns a helpful error instead of crashing", () => {
    const result = runCommand("frobnicate");
    expect(result.type).toBe("text");
    if (result.type === "text") {
      expect(result.lines[0]).toMatch(/not recognized/i);
    }
  });

  it("is case-insensitive", () => {
    expect(runCommand("USER")).toEqual(runCommand("user"));
  });

  it("an empty line produces no output and no crash", () => {
    expect(runCommand("   ")).toEqual({ type: "text", lines: [] });
  });

  it("date uses the injected clock so it's deterministic in tests", () => {
    const fixed = new Date(2026, 0, 15, 9, 30);
    const result = runCommand("date", fixed);
    expect(result).toEqual({
      type: "text",
      lines: [fixed.toLocaleDateString(), fixed.toLocaleTimeString()],
    });
  });

  it("hides the easter eggs from help", () => {
    const result = runCommand("help");
    if (result.type === "text") {
      expect(result.lines.join(" ")).not.toMatch(/matrix|hire-me/i);
    }
  });

  it("sudo hire-me points to the real email", () => {
    const result = runCommand("sudo hire-me");
    expect(result.type).toBe("text");
    if (result.type === "text") expect(result.lines.join(" ")).toContain(siteConfig.email);
  });

  it("matrix prints a stable glyph rain", () => {
    expect(runCommand("matrix")).toEqual(runCommand("matrix"));
    const result = runCommand("matrix");
    if (result.type === "text") expect(result.lines.length).toBeGreaterThan(8);
  });

  it("stats says so when nothing was recorded, and lists counts afterwards", () => {
    window.localStorage.clear();
    const empty = runCommand("stats");
    if (empty.type === "text") expect(empty.lines[0]).toMatch(/no activity/i);
    window.localStorage.setItem("portfolio:analytics", JSON.stringify({ "window:projects": 3 }));
    const full = runCommand("stats");
    if (full.type === "text") expect(full.lines.join(" ")).toContain("window:projects");
  });
});
