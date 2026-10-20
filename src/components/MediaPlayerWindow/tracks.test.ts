import { describe, it, expect } from "vitest";
import {
  TRACKS,
  formatTrackTime,
  nextTrackIndex,
  noteFrequency,
  prevTrackIndex,
  trackDuration,
} from "./tracks";

describe("tracks", () => {
  it("computes note frequencies from A4 = 440 Hz", () => {
    expect(noteFrequency("A4")).toBeCloseTo(440, 5);
    expect(noteFrequency("A3")).toBeCloseTo(220, 5);
    expect(noteFrequency("C4")).toBeCloseTo(261.63, 1);
    expect(noteFrequency("F#3")).toBeCloseTo(185, 0);
    expect(() => noteFrequency("H9")).toThrow();
  });

  it("every note in every track is valid and the playlist is well formed", () => {
    expect(new Set(TRACKS.map((track) => track.id)).size).toBe(TRACKS.length);
    for (const track of TRACKS) {
      expect(trackDuration(track)).toBeGreaterThan(30);
      for (const chord of track.chords) for (const note of chord) expect(noteFrequency(note)).toBeGreaterThan(50);
    }
  });

  it("formats time as m:ss", () => {
    expect(formatTrackTime(0)).toBe("0:00");
    expect(formatTrackTime(65.9)).toBe("1:05");
    expect(formatTrackTime(-3)).toBe("0:00");
  });

  it("wraps through the playlist", () => {
    expect(nextTrackIndex(2, 3)).toBe(0);
    expect(prevTrackIndex(0, 3)).toBe(2);
  });
});
