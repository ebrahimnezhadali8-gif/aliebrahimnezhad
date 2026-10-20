/**
 * The built-in playlist is *generated* in the browser (soft chord pads through
 * WebAudio) rather than shipped as audio files, so there is no licensing to
 * worry about and the page stays tiny.
 */

const NOTE_OFFSETS: Record<string, number> = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };

/** Frequency in Hz of a note like "A4" (440 Hz) or "C#3". */
export function noteFrequency(note: string): number {
  const match = /^([A-G]#?)(-?\d)$/.exec(note);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const semitonesFromA4 = NOTE_OFFSETS[match[1]] + (Number(match[2]) - 4) * 12 - 9;
  return 440 * 2 ** (semitonesFromA4 / 12);
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Chord progression, each chord a list of note names. Played twice per track. */
  chords: string[][];
  chordSeconds: number;
  wave: OscillatorType;
  /** Two accent colours for the album art and visualizer. */
  colors: [string, string];
}

export const TRACKS: Track[] = [
  {
    id: "morning",
    title: "Quiet Morning",
    artist: "Portfolio Ensemble",
    chords: [
      ["C3", "E3", "G3", "B3"],
      ["A2", "C3", "E3", "G3"],
      ["F2", "A2", "C3", "E3"],
      ["G2", "B2", "D3", "E3"],
    ],
    chordSeconds: 5,
    wave: "triangle",
    colors: ["#ffb347", "#ff6a5c"],
  },
  {
    id: "tide",
    title: "Slow Tide",
    artist: "Portfolio Ensemble",
    chords: [
      ["D3", "F3", "A3", "E4"],
      ["A#2", "D3", "F3", "A3"],
      ["G2", "A#2", "D3", "F3"],
      ["A2", "D3", "E3", "G3"],
    ],
    chordSeconds: 6,
    wave: "sine",
    colors: ["#4fc3f7", "#5b6bff"],
  },
  {
    id: "window",
    title: "Night Window",
    artist: "Portfolio Ensemble",
    chords: [
      ["E3", "G3", "B3", "D4"],
      ["C3", "E3", "G3", "B3"],
      ["A2", "C3", "E3", "G3"],
      ["B2", "E3", "F#3", "B3"],
    ],
    chordSeconds: 6,
    wave: "sine",
    colors: ["#a78bfa", "#2a2f6b"],
  },
];

/** A track plays its progression twice. */
export function trackDuration(track: Track): number {
  return track.chords.length * track.chordSeconds * 2;
}

/** m:ss, clamped at zero. */
export function formatTrackTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function nextTrackIndex(index: number, length: number): number {
  return length <= 0 ? 0 : (index + 1) % length;
}

export function prevTrackIndex(index: number, length: number): number {
  return length <= 0 ? 0 : (index - 1 + length) % length;
}
