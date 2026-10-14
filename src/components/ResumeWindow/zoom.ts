export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_STEP = 10;

/** Clamps a zoom percentage to the allowed [ZOOM_MIN, ZOOM_MAX] range. */
export function clampZoom(value: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
}

export function zoomIn(current: number): number {
  return clampZoom(current + ZOOM_STEP);
}

export function zoomOut(current: number): number {
  return clampZoom(current - ZOOM_STEP);
}
