import { useMemo, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import MonthGrid from "../../CalendarPanel/MonthGrid";
import { useClock } from "../../../hooks/useClock";
import { useContent } from "../../../hooks/useContent";
import { useDesktopSettings } from "../../../context/DesktopSettingsContext";
import { siteConfig } from "../../../config/siteConfig";
import { shiftMonth } from "../../../utils/calendarGrid";
import { formatDate } from "../../../utils/jalali";
import { buildMailtoHref } from "./mailto";
import "./CalendarApp.css";

function isoDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** iOS 4-style Calendar: month grid, the day's events, the career timeline and a "Book a call" mail link. */
function CalendarApp({ onBack }: { onBack: () => void }) {
  const { t, content } = useContent();
  const { calendar } = useDesktopSettings();
  const now = useClock();
  const [anchor, setAnchor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  const events = useMemo(
    () => siteConfig.events.filter((event) => event.date === isoDay(selected)),
    [selected]
  );
  const timeline = useMemo(
    () => [...content.projects].sort((a, b) => Number(b.year) - Number(a.year)),
    [content.projects]
  );

  const bookHref = buildMailtoHref({
    to: siteConfig.email,
    from: "",
    subject: `${t("bookCallSubject")} — ${formatDate(selected, calendar)}`,
    body: `${formatDate(selected, calendar)}\n`,
  });

  return (
    <AppScreen title={t("calendarApp")} onBack={onBack}>
      <div className="calendar-app" data-testid="mobile-calendar">
        <div className="calendar-app__card">
          <MonthGrid
            anchor={anchor}
            calendar={calendar}
            today={now}
            selected={selected}
            onSelect={setSelected}
            onPrev={() => setAnchor((current) => shiftMonth(current, calendar, -1))}
            onNext={() => setAnchor((current) => shiftMonth(current, calendar, 1))}
            prevLabel={t("previousMonth")}
            nextLabel={t("nextMonth")}
          />
        </div>

        <div className="calendar-app__card">
          <h3 className="calendar-app__heading" data-testid="calendar-selected">
            {formatDate(selected, calendar)}
          </h3>
          {events.length === 0 ? (
            <p className="calendar-app__empty">{t("noEvents")}</p>
          ) : (
            <ul className="calendar-app__events">
              {events.map((event) => (
                <li key={`${event.date}-${event.title}`}>{event.title}</li>
              ))}
            </ul>
          )}
          <a className="calendar-app__book" href={bookHref} data-testid="calendar-book" data-cuelume-press>
            {t("bookCall")}
          </a>
        </div>

        <div className="calendar-app__card">
          <h3 className="calendar-app__heading">{t("timeline")}</h3>
          <ul className="calendar-app__timeline">
            {timeline.map((project) => (
              <li key={project.id}>
                <span className="calendar-app__year">{project.year}</span>
                <span>{project.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppScreen>
  );
}

export default CalendarApp;
