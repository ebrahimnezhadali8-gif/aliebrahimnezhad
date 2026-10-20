import { Glyph, SHADOW, Tile } from "./ios4Parts";

/**
 * Full-bleed iPhone 4 (iOS 4) app-icon artwork. Each icon paints its own 60×60
 * background; the glossy highlight and rounded corners are added by
 * `AppIcon.css` (`.app-icon--art`), exactly like iOS did at runtime.
 */

export const ios4Icons = {
  ios4Phone: (
    <Tile id="i4ph" stops={["#8df09a", "#27b647", "#0e7f28"]}>
      <Glyph scale={1.55}>
        <path d="M6.5 10.4c1.6 3.2 4.4 6 7.6 7.6l2.5-2.5c.4-.4.9-.5 1.3-.3 1.4.5 2.9.7 4.4.7.7 0 1.2.5 1.2 1.2v4c0 .7-.5 1.2-1.2 1.2C11 22.3 3.1 14.4 2.5 3.1c0-.7.5-1.2 1.2-1.2h4c.7 0 1.2.5 1.2 1.2 0 1.5.2 3 .7 4.4.2.4.1.9-.3 1.3Z" />
      </Glyph>
    </Tile>
  ),
  ios4Mail: (
    <Tile id="i4ma" stops={["#7ed3fb", "#1d8fe3", "#0a5bbd"]}>
      <g style={{ filter: SHADOW }}>
        <rect x="8" y="16" width="44" height="29" rx="4" fill="#fff" />
        <path d="m10 19.5 20 15 20-15" fill="none" stroke="#2a7fd0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Tile>
  ),
  ios4Messages: (
    <Tile id="i4ms" stops={["#9bf0a6", "#2fc04e", "#12902f"]}>
      <Glyph scale={1.7}>
        <path d="M12 3.4c-4.9 0-8.9 3.3-8.9 7.4 0 2.3 1.3 4.4 3.3 5.7-.1 1.1-.5 2.3-1.2 3.2 1.5-.2 2.9-.9 4-1.9.9.2 1.8.3 2.8.3 4.9 0 8.9-3.3 8.9-7.4S16.9 3.4 12 3.4Z" />
      </Glyph>
    </Tile>
  ),
  ios4Notes: (
    <Tile id="i4no" stops={["#fffef4", "#fbf6d8", "#efe6b4"]}>
      <rect width="60" height="15" fill="#e9bb2a" />
      <rect y="14" width="60" height="1.6" fill="#b98a0e" />
      <g stroke="#9db8dc" strokeWidth="1">
        <path d="M0 27h60M0 35h60M0 43h60M0 51h60" />
      </g>
      <path d="M11 15.6V60" stroke="#e8928c" strokeWidth="1" />
    </Tile>
  ),
  ios4Calculator: (
    <Tile id="i4ca" stops={["#6c7077", "#2d3035", "#131518"]}>
      <rect x="7" y="7" width="46" height="14" rx="2" fill="#1b1d20" stroke="#000" strokeOpacity="0.5" />
      <path d="M44 18.4h5.5M46 12.6l2.2-3" stroke="#e8edf2" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <g fill="#8c9199">
        {[25, 33.5, 42, 50.5].flatMap((y) =>
          [7, 18.5, 30].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="10.5" height="6.6" rx="1.6" />)
        )}
      </g>
      <g fill="#f79a1b">
        {[25, 33.5, 42, 50.5].map((y) => (
          <rect key={y} x="41.5" y={y} width="11.5" height="6.6" rx="1.6" />
        ))}
      </g>
    </Tile>
  ),
  ios4Settings: (
    <Tile id="i4se" stops={["#d3d8df", "#8d95a2", "#555c68"]}>
      <defs>
        <linearGradient id="i4se-gear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1f4f8" />
          <stop offset="1" stopColor="#6c7482" />
        </linearGradient>
      </defs>
      <g transform="translate(6 6)" style={{ filter: SHADOW }}>
        <path
          d="M20.92 9.12 L21.04 3.21 L26.96 3.21 L27.08 9.12 L32.35 11.30 L36.61 7.21 L40.79 11.39 L36.70 15.65 L38.88 20.92 L44.79 21.04 L44.79 26.96 L38.88 27.08 L36.70 32.35 L40.79 36.61 L36.61 40.79 L32.35 36.70 L27.08 38.88 L26.96 44.79 L21.04 44.79 L20.92 38.88 L15.65 36.70 L11.39 40.79 L7.21 36.61 L11.30 32.35 L9.12 27.08 L3.21 26.96 L3.21 21.04 L9.12 20.92 L11.30 15.65 L7.21 11.39 L11.39 7.21 L15.65 11.30Z M30.8 24 A6.8 6.8 0 1 0 17.2 24 A6.8 6.8 0 1 0 30.8 24Z"
          fill="url(#i4se-gear)"
          fillRule="evenodd"
          stroke="#3a404a"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </Tile>
  ),
  ios4Safari: (
    <Tile id="i4sa" stops={["#9ad8ff", "#2b86e6", "#0b50b8"]}>
      <circle cx="30" cy="30" r="22.5" fill="#f7f9fc" stroke="#b9c8dc" strokeWidth="1.2" />
      <circle cx="30" cy="30" r="19.5" fill="none" stroke="#cfd9e6" strokeWidth="0.8" strokeDasharray="1 3.2" />
      <g transform="rotate(45 30 30)">
        <path d="M30 11 34.4 30 30 30 25.6 30Z" fill="#e5413b" />
        <path d="M30 49 25.6 30 30 30 34.4 30Z" fill="#aab4c2" />
      </g>
      <circle cx="30" cy="30" r="2" fill="#6b7686" />
    </Tile>
  ),
  ios4Projects: (
    <Tile id="i4pr" stops={["#7bd0fa", "#1b8fe2", "#0a5ec0"]}>
      <Glyph scale={1.7}>
        <path d="M3 6.6A2.6 2.6 0 0 1 5.6 4h3.3a2 2 0 0 1 1.5.7l1.2 1.4h6.8A2.6 2.6 0 0 1 21 8.7v9.7a2.6 2.6 0 0 1-2.6 2.6H5.6A2.6 2.6 0 0 1 3 18.4Z" />
      </Glyph>
    </Tile>
  ),
  ios4About: (
    <Tile id="i4ab" stops={["#efdcb4", "#c39a5c", "#85602e"]}>
      <rect x="9" y="7" width="42" height="46" rx="3" fill="#fbf6ea" stroke="#6d4a1c" strokeWidth="1.4" />
      <rect x="9" y="7" width="7" height="46" rx="2" fill="#7d5826" />
      <g fill="#8a6a3a">
        <circle cx="33" cy="25" r="7" />
        <path d="M19.5 44c0-7 6-10.5 13.5-10.5S46.5 37 46.5 44Z" />
      </g>
    </Tile>
  ),
  ios4Skills: (
    <Tile id="i4sk" stops={["#d3b0ff", "#8d4aeb", "#5f1fc4"]}>
      <Glyph scale={1.7}>
        <rect x="3" y="13.5" width="4.4" height="7.5" rx="1.6" />
        <rect x="9.8" y="8.5" width="4.4" height="12.5" rx="1.6" />
        <rect x="16.6" y="3.5" width="4.4" height="17.5" rx="1.6" />
      </Glyph>
    </Tile>
  ),
  ios4Resume: (
    <Tile id="i4re" stops={["#ff7a6c", "#e2382d", "#b82020"]}>
      <Glyph scale={1.7}>
        <path d="M6.5 2h7L18 6.5V20a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <g fill="#c62828" opacity=".55">
          <rect x="7.5" y="11" width="9" height="1.6" rx=".8" />
          <rect x="7.5" y="14.4" width="9" height="1.6" rx=".8" />
          <rect x="7.5" y="17.8" width="5.5" height="1.6" rx=".8" />
        </g>
      </Glyph>
    </Tile>
  ),
  ios4Linkedin: (
    <Tile id="i4li" stops={["#3a8bd8", "#0a66c2", "#064a92"]}>
      <Glyph scale={1.6}>
        <path d="M6.9 8.9H4V20h2.9V8.9ZM5.4 4.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-2.7-1.4-4-3.3-4-1.5 0-2.2.8-2.6 1.4V8.9H11V20h2.9v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20H20v-6.4Z" />
      </Glyph>
    </Tile>
  ),
  ios4Telegram: (
    <Tile id="i4te" stops={["#5fcbf8", "#1f9ee0", "#0c78b8"]}>
      <Glyph scale={1.75}>
        <path d="M21.2 4.4 2.9 11.5c-1 .4-1 1 0 1.3l4.7 1.5 1.8 5.5c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.6 3.4c.8.5 1.5.2 1.7-.8L22.5 5.4c.3-1.2-.4-1.7-1.3-1Zm-3.5 3.6-7.3 6.6-.3 3-1.3-4.3 8.2-5.1c.4-.2.7-.1.7.2Z" />
      </Glyph>
    </Tile>
  ),
  /** The classic 2011–2015 Instagram icon: brown leather, rainbow stripe, big lens. */
  ios4Instagram: (
    <Tile id="i4ig" stops={["#f7f2e8", "#e6dccb", "#c9bda6"]}>
      <defs>
        <linearGradient id="i4ig-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a7255" />
          <stop offset="1" stopColor="#5c3f2c" />
        </linearGradient>
        <radialGradient id="i4ig-ring" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#6d6d72" />
          <stop offset="1" stopColor="#101012" />
        </radialGradient>
        <radialGradient id="i4ig-glass" cx="0.38" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#8d9be0" />
          <stop offset="0.45" stopColor="#323c88" />
          <stop offset="1" stopColor="#0d1030" />
        </radialGradient>
      </defs>
      <rect width="60" height="25" fill="url(#i4ig-top)" />
      <rect y="25" width="60" height="1.9" fill="#e5392b" />
      <rect y="26.9" width="60" height="1.9" fill="#f59a1c" />
      <rect y="28.8" width="60" height="1.9" fill="#f6d321" />
      <rect y="30.7" width="60" height="1.9" fill="#4db848" />
      <rect y="32.6" width="60" height="1.9" fill="#2c7fd6" />
      <rect x="6" y="6" width="11" height="9" rx="2" fill="#2e211a" />
      <circle cx="11.5" cy="10.5" r="2.6" fill="#8a6b55" />
      <text x="22" y="14.5" fontSize="7.5" fontStyle="italic" fontWeight="700" fill="#f3e9da" fontFamily="Helvetica, Arial, sans-serif">
        Insta
      </text>
      <rect x="44" y="6" width="10" height="5" rx="1.5" fill="#efe6d6" />
      <circle cx="30" cy="38" r="17.5" fill="url(#i4ig-ring)" stroke="#0a0a0b" strokeWidth="1.2" style={{ filter: SHADOW }} />
      <circle cx="30" cy="38" r="13.2" fill="#17171a" stroke="#4a4a50" strokeWidth="0.8" />
      <circle cx="30" cy="38" r="10.4" fill="url(#i4ig-glass)" />
      <ellipse cx="26" cy="33.5" rx="4.2" ry="2.4" fill="#fff" opacity=".35" transform="rotate(-30 26 33.5)" />
      <circle cx="35" cy="43" r="1.6" fill="#9ab0ff" opacity=".55" />
    </Tile>
  ),
  ios4Terminal: (
    <Tile id="i4tm" stops={["#4a4d54", "#1d1f23", "#08090b"]}>
      <g fill="none" stroke="#46e06a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: SHADOW }}>
        <path d="m15 20 12 10-12 10" />
        <path d="M32 42h14" />
      </g>
    </Tile>
  ),
  ios4Clock: (
    <Tile id="i4ck" stops={["#4a4d54", "#1d1f23", "#08090b"]}>
      <circle cx="30" cy="30" r="23" fill="#fafafa" />
      <g stroke="#222" strokeWidth="2" strokeLinecap="round">
        <path d="M30 10v4M30 46v4M10 30h4M46 30h4" />
      </g>
      <path d="M30 30V17" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="m30 30 8 5" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 30 22 40" stroke="#e5413b" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#e5413b" />
    </Tile>
  ),
};
