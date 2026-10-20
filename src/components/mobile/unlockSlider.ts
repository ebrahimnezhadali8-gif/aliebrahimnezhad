/** Keeps a drag within the slider track: 0 … max. */
export function clampDrag(delta: number, max: number): number {
  if (!Number.isFinite(delta)) return 0;
  return Math.min(Math.max(0, delta), Math.max(0, max));
}

/** The slider unlocks once it is dragged at least `threshold` (default 85 %) of the way. */
export function isUnlocked(offset: number, max: number, threshold = 0.85): boolean {
  return max > 0 && offset / max >= threshold;
}
