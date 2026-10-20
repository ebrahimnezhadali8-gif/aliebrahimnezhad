import { useId } from "react";
import { handAngles, timeInZone } from "../../utils/analogClock";
import "./AnalogClock.css";

interface AnalogClockProps {
  now: Date;
  /** IANA zone, e.g. "Asia/Tehran". Omit for the visitor's own zone. */
  timeZone?: string;
  /** "light" = white iOS face, "dark" = black face, "glass" = Windows 7 gadget. */
  face?: "light" | "dark" | "glass";
  /** Sweeping second hand (needs a ticking `now` faster than 1 s to look smooth). */
  smooth?: boolean;
  className?: string;
  label?: string;
}

/** A pure-SVG analog clock shared by the Windows gadget, calendar panel and iPhone Clock app. */
function AnalogClock({ now, timeZone, face = "light", smooth = false, className = "", label }: AnalogClockProps) {
  const id = useId();
  const parts = timeInZone(now, timeZone);
  const angles = handAngles(parts, smooth);
  const ink = face === "dark" ? "#f2f2f2" : face === "glass" ? "#f4f9ff" : "#161616";

  return (
    <svg
      className={`analog-clock analog-clock--${face} ${className}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label ?? `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}`}
      data-testid="analog-clock"
    >
      <defs>
        <radialGradient id={`${id}-glass`} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#6fb4ff" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#1c4f93" stopOpacity="0.92" />
          <stop offset="1" stopColor="#0b2347" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f7fa" />
          <stop offset="1" stopColor="#7e8794" />
        </linearGradient>
      </defs>
      {face === "glass" && <circle cx="50" cy="50" r="48" fill={`url(#${id}-rim)`} />}
      <circle
        cx="50"
        cy="50"
        r={face === "glass" ? 44 : 47}
        fill={face === "glass" ? `url(#${id}-glass)` : face === "dark" ? "#0d0d0f" : "#f9f9f9"}
        stroke={face === "dark" ? "#3a3a3d" : "#cfcfcf"}
        strokeWidth="1.6"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="50"
          y1={face === "glass" ? 10 : 8}
          x2="50"
          y2={(face === "glass" ? 10 : 8) + (i % 3 === 0 ? 7 : 4)}
          stroke={ink}
          strokeWidth={i % 3 === 0 ? 2.4 : 1.2}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <line x1="50" y1="54" x2="50" y2="28" stroke={ink} strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${angles.hour} 50 50)`} data-testid="hand-hour" />
      <line x1="50" y1="56" x2="50" y2="16" stroke={ink} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${angles.minute} 50 50)`} data-testid="hand-minute" />
      <line x1="50" y1="60" x2="50" y2="13" stroke="#e5413b" strokeWidth="1.1" strokeLinecap="round" transform={`rotate(${angles.second} 50 50)`} data-testid="hand-second" />
      <circle cx="50" cy="50" r="2.5" fill="#e5413b" />
    </svg>
  );
}

export default AnalogClock;
