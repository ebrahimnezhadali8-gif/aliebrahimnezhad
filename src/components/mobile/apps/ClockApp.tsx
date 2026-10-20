import AppScreen from "../AppScreen/AppScreen";
import { useClock } from "../../../hooks/useClock";
import { useContent } from "../../../hooks/useContent";
import { formatDate, formatTime } from "../../../utils/jalali";
import "./ClockApp.css";

/** A big clock showing the date in both calendars at once. */
function ClockApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  const now = useClock();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  return (
    <AppScreen title={t("clockApp")} onBack={onBack} variant="dark">
      <div className="clock-app" data-testid="mobile-clock">
        <svg className="clock-app__face" viewBox="0 0 100 100" role="img" aria-label={formatTime(now, "gregorian")}>
          <circle cx="50" cy="50" r="47" fill="#f7f7f7" stroke="#d0d0d0" strokeWidth="2" />
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1="50"
              y1="8"
              x2="50"
              y2={i % 3 === 0 ? 15 : 12}
              stroke="#222"
              strokeWidth={i % 3 === 0 ? 2.2 : 1.2}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <line x1="50" y1="50" x2="50" y2="28" stroke="#111" strokeWidth="3.2" strokeLinecap="round" transform={`rotate(${hours * 30} 50 50)`} />
          <line x1="50" y1="50" x2="50" y2="17" stroke="#111" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${minutes * 6} 50 50)`} />
          <line x1="50" y1="56" x2="50" y2="13" stroke="#e5413b" strokeWidth="1" strokeLinecap="round" transform={`rotate(${seconds * 6} 50 50)`} />
          <circle cx="50" cy="50" r="2.4" fill="#e5413b" />
        </svg>
        <div className="clock-app__time" data-testid="clock-time">
          {formatTime(now, "gregorian")}
        </div>
        <div className="clock-app__dates">
          <span>{formatDate(now, "gregorian")}</span>
          <span>{formatDate(now, "jalali")}</span>
        </div>
      </div>
    </AppScreen>
  );
}

export default ClockApp;
