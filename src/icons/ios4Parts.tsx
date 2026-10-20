import type { ReactNode } from "react";

export type Stops = [string, string, string];

export function Tile({ id, stops, children }: { id: string; stops: Stops; children: ReactNode }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.55" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <rect width="60" height="60" fill={`url(#${id}-bg)`} />
      {children}
    </svg>
  );
}

export const SHADOW = "drop-shadow(0 1.2px 0.8px rgba(0,0,0,0.35))";

/** A white 24-unit glyph centred on the tile. */
export function Glyph({ children, scale = 1.6 }: { children: ReactNode; scale?: number }) {
  const offset = 30 - 12 * scale;
  return (
    <g fill="#fff" style={{ filter: SHADOW }} transform={`translate(${offset} ${offset}) scale(${scale})`}>
      {children}
    </g>
  );
}

