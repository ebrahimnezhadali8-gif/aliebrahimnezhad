export interface ClockParts {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface HandAngles {
  hour: number;
  minute: number;
  second: number;
}

/** Wall-clock time in an IANA zone (or the visitor's own zone when omitted). */
export function timeInZone(date: Date, timeZone?: string): ClockParts {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
      timeZone,
    }).formatToParts(date);
    const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
    return {
      hours: read("hour") % 24,
      minutes: read("minute"),
      seconds: read("second"),
      milliseconds: date.getMilliseconds(),
    };
  } catch {
    // Unknown zone name: fall back to the local clock rather than crashing.
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
    };
  }
}

/**
 * Clockwise angle in degrees (0 = 12 o'clock) for each hand. The hour hand
 * creeps with the minutes and the minute hand with the seconds, like a real
 * movement; `smoothSeconds` also folds in the milliseconds for a sweeping hand.
 */
export function handAngles(parts: ClockParts, smoothSeconds = false): HandAngles {
  const seconds = parts.seconds + (smoothSeconds ? parts.milliseconds / 1000 : 0);
  const minutes = parts.minutes + parts.seconds / 60;
  const hours = (parts.hours % 12) + minutes / 60;
  return {
    hour: hours * 30,
    minute: minutes * 6,
    second: seconds * 6,
  };
}

/** True between 06:00 and 18:00 — decides whether a clock face is light or dark. */
export function isDaytime(parts: ClockParts): boolean {
  return parts.hours >= 6 && parts.hours < 18;
}
