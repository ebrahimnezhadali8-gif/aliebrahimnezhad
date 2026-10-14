import { describe, it, expect, beforeEach } from "vitest";
import { loadNotes, saveNotes } from "./notesStorage";

describe("notesStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty string when nothing has been saved yet", () => {
    expect(loadNotes()).toBe("");
  });

  it("round-trips saved text", () => {
    saveNotes("Remember to update the resume.");
    expect(loadNotes()).toBe("Remember to update the resume.");
  });

  it("overwrites previous content on subsequent saves", () => {
    saveNotes("first draft");
    saveNotes("second draft");
    expect(loadNotes()).toBe("second draft");
  });

  it("persists an empty string (clearing notes) rather than falling back to old content", () => {
    saveNotes("something");
    saveNotes("");
    expect(loadNotes()).toBe("");
  });
});
