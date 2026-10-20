import { Tile } from "../../../icons/ios4Parts";
import { useClock } from "../../../hooks/useClock";
import { handAngles, timeInZone } from "../../../utils/analogClock";

/** The Clock icon whose hands really move, like the one on an iPhone. */
export function LiveClockIcon() {
  const now = useClock();
  const angles = handAngles(timeInZone(now));
  return (
    <Tile id="live-clock" stops={["#4a4d54", "#1d1f23", "#08090b"]}>
      <circle cx="30" cy="30" r="23" fill="#fafafa" />
      <g stroke="#222" strokeWidth="2" strokeLinecap="round">
        <path d="M30 10v4M30 46v4M10 30h4M46 30h4" />
      </g>
      <path d="M30 30V19" stroke="#111" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angles.hour} 30 30)`} />
      <path d="M30 30V13" stroke="#111" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${angles.minute} 30 30)`} />
      <path d="M30 34V11" stroke="#e5413b" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${angles.second} 30 30)`} />
      <circle cx="30" cy="30" r="2" fill="#e5413b" />
    </Tile>
  );
}

/** The Calendar icon showing today's weekday and day-of-month. */
export function LiveCalendarIcon() {
  const now = useClock();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(now).toUpperCase();
  return (
    <Tile id="live-cal" stops={["#ffffff", "#f4f4f4", "#e2e2e2"]}>
      <rect width="60" height="17" fill="#d63c32" />
      <text x="30" y="12.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
        {weekday}
      </text>
      <text x="30" y="47" textAnchor="middle" fontSize="31" fontWeight="300" fill="#1c1c1e" fontFamily="Helvetica, Arial, sans-serif">
        {now.getDate()}
      </text>
    </Tile>
  );
}
