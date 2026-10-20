import { describe, it, expect, beforeEach } from "vitest";
import { ANALYTICS_STORAGE_KEY, readStats, sortedStats, track } from "./analytics";

describe("analytics", () => {
  beforeEach(() => window.localStorage.clear());

  it("counts opens per kind and name", () => {
    track("window", "projects");
    track("window", "projects");
    track("app", "notes");
    expect(readStats()).toEqual({ "window:projects": 2, "app:notes": 1 });
  });

  it("sorts by count, most opened first", () => {
    track("app", "a");
    track("app", "b");
    track("app", "b");
    expect(sortedStats()[0]).toEqual(["app:b", 2]);
  });

  it("ignores corrupted storage instead of throwing", () => {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, "not json");
    expect(readStats()).toEqual({});
    expect(() => track("app", "x")).not.toThrow();
  });
});
