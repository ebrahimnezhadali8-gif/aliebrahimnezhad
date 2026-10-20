/** Fake-but-plausible resource usage for the joke Task Manager. */

export const HISTORY_LENGTH = 60;

/** One step of a bounded random walk (0–100). `rng` is injectable for tests. */
export function nextSample(previous: number, rng: () => number = Math.random, step = 12): number {
  const delta = (rng() - 0.5) * 2 * step;
  return Math.min(100, Math.max(0, Math.round(previous + delta)));
}

/** Appends a value and keeps only the newest `HISTORY_LENGTH` points. */
export function pushHistory(history: number[], value: number): number[] {
  const next = [...history, value];
  return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
}

/** SVG polyline points for a 0–100 series drawn in a `width × height` box. */
export function toPoints(history: number[], width: number, height: number): string {
  if (history.length === 0) return "";
  const stepX = history.length > 1 ? width / (HISTORY_LENGTH - 1) : 0;
  const offset = (HISTORY_LENGTH - history.length) * stepX;
  return history
    .map((value, index) => `${(offset + index * stepX).toFixed(1)},${(height - (value / 100) * height).toFixed(1)}`)
    .join(" ");
}

export interface JokeProcess {
  name: string;
  description: string;
  cpu: number;
  memoryMb: number;
}

export const JOKE_PROCESSES: JokeProcess[] = [
  { name: "coffee.exe", description: "Keeps the developer running", cpu: 38, memoryMb: 250 },
  { name: "deadline.exe", description: "Approaching. Always approaching.", cpu: 27, memoryMb: 404 },
  { name: "stackoverflow.exe", description: "Copy, paste, understand later", cpu: 14, memoryMb: 512 },
  { name: "procrastination.exe", description: "Will start right after this", cpu: 9, memoryMb: 128 },
  { name: "it_works_on_my_machine.dll", description: "Cannot be reproduced", cpu: 3, memoryMb: 64 },
  { name: "semicolon_finder.exe", description: "Searching for the missing ;", cpu: 21, memoryMb: 96 },
];
