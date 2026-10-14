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
});
