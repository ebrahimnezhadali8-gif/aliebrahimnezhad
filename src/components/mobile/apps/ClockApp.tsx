import AppScreen from "../AppScreen/AppScreen";
import AnalogClock from "../../AnalogClock/AnalogClock";
import { useClock } from "../../../hooks/useClock";
import { useContent } from "../../../hooks/useContent";
import { formatDate, formatTime } from "../../../utils/jalali";
import { isDaytime, timeInZone } from "../../../utils/analogClock";
import type { UiStrings } from "../../../i18n/strings";
import "./ClockApp.css";

const CITIES: { zone: string; label: keyof UiStrings }[] = [
  { zone: "Asia/Tehran", label: "cityTehran" },
  { zone: "Europe/London", label: "cityLondon" },
  { zone: "America/New_York", label: "cityNewYork" },
  { zone: "Asia/Tokyo", label: "cityTokyo" },
];

/** Big local clock, both calendars, and a World Clock whose faces turn dark at night. */
function ClockApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  const now = useClock();

  return (
    <AppScreen title={t("clockApp")} onBack={onBack} variant="dark">
      <div className="clock-app" data-testid="mobile-clock">
        <div className="clock-app__face">
          <AnalogClock now={now} face="light" />
        </div>
        <div className="clock-app__time" data-testid="clock-time">
          {formatTime(now, "gregorian")}
        </div>
        <div className="clock-app__dates">
          <span>{formatDate(now, "gregorian")}</span>
          <span>{formatDate(now, "jalali")}</span>
        </div>

        <h3 className="clock-app__heading">{t("worldClock")}</h3>
        <div className="clock-app__world" data-testid="world-clock">
          {CITIES.map((city) => {
            const day = isDaytime(timeInZone(now, city.zone));
            return (
              <div key={city.zone} className="clock-app__city" data-testid={`city-${city.zone}`} data-daytime={day}>
                <AnalogClock now={now} timeZone={city.zone} face={day ? "light" : "dark"} label={t(city.label)} />
                <span className="clock-app__city-name">{t(city.label)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AppScreen>
  );
}

export default ClockApp;
