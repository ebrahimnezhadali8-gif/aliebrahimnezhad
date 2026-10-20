export type Tool = "pen" | "eraser";

export const PALETTE = [
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200",
  "#22b14c", "#00a2e8", "#3f48cc", "#a349a4", "#ffffff", "#c3c3c3",
];

export const CANVAS_BACKGROUND = "#ffffff";
export const MIN_SIZE = 1;
export const MAX_SIZE = 40;

export interface StrokeStyle {
  color: string;
  width: number;
}

export function clampSize(size: number): number {
  if (!Number.isFinite(size)) return MIN_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(size)));
}

/** The eraser paints the paper colour and is twice as wide, like a real eraser block. */
export function strokeStyleFor(tool: Tool, color: string, size: number): StrokeStyle {
  const width = clampSize(size);
  return tool === "eraser" ? { color: CANVAS_BACKGROUND, width: width * 2 } : { color, width };
}

/** Converts a client-space point into canvas pixels, accounting for CSS scaling. */
export function toCanvasPoint(
  client: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number },
  canvas: { width: number; height: number }
): { x: number; y: number } {
  const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
  const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
  return { x: (client.x - rect.left) * scaleX, y: (client.y - rect.top) * scaleY };
}

/** Subject line + body for the "send my drawing" mail (browsers can't attach files to mailto). */
export function drawingMailBody(fileName: string): string {
  return `Hi! I drew something for you.\n\nI saved it as ${fileName} — I'll attach it to this message.\n`;
}
