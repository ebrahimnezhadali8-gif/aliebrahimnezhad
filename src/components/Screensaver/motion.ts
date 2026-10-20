export interface Mover {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Advances a point one step and bounces it off the edges of a `width × height` box. */
export function stepMover(mover: Mover, width: number, height: number): Mover {
  let { x, y, vx, vy } = mover;
  x += vx;
  y += vy;
  if (x < 0) {
    x = -x;
    vx = Math.abs(vx);
  } else if (x > width) {
    x = 2 * width - x;
    vx = -Math.abs(vx);
  }
  if (y < 0) {
    y = -y;
    vy = Math.abs(vy);
  } else if (y > height) {
    y = 2 * height - y;
    vy = -Math.abs(vy);
  }
  return { x, y, vx, vy };
}

export interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  hue: number;
}

/** Moves a bubble up; once it leaves the top it respawns at the bottom with fresh traits. */
export function stepBubble(bubble: Bubble, width: number, height: number, rng: () => number = Math.random): Bubble {
  const y = bubble.y - bubble.speed;
  if (y + bubble.radius < 0) {
    return {
      x: rng() * width,
      y: height + bubble.radius,
      radius: 8 + rng() * 38,
      speed: 0.5 + rng() * 1.6,
      hue: Math.floor(rng() * 360),
    };
  }
  return { ...bubble, y, x: bubble.x + Math.sin(y / 40) * 0.4 };
}

export type ScreensaverKind = "text" | "bubbles" | "mystify";

export const SCREENSAVER_KINDS: ScreensaverKind[] = ["text", "bubbles", "mystify"];

export function pickScreensaver(rng: () => number = Math.random): ScreensaverKind {
  return SCREENSAVER_KINDS[Math.floor(rng() * SCREENSAVER_KINDS.length) % SCREENSAVER_KINDS.length];
}
