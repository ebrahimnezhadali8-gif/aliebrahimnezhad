export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

/** Index of the next photo, wrapping from the last back to the first. */
export function nextIndex(index: number, length: number): number {
  return length <= 0 ? 0 : (index + 1) % length;
}

export function prevIndex(index: number, length: number): number {
  return length <= 0 ? 0 : (index - 1 + length) % length;
}

export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return MIN_ZOOM;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/** Distance between two touch points. */
export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** New zoom for a pinch that started at `startDistance` with zoom `startZoom`. */
export function pinchZoom(startZoom: number, startDistance: number, currentDistance: number): number {
  if (startDistance <= 0) return clampZoom(startZoom);
  return clampZoom(startZoom * (currentDistance / startDistance));
}

/** What a horizontal swipe of `deltaX` px means: -1 = next photo, 1 = previous, 0 = too small. */
export function swipeDirection(deltaX: number, threshold = 50): -1 | 0 | 1 {
  if (deltaX <= -threshold) return -1;
  if (deltaX >= threshold) return 1;
  return 0;
}
