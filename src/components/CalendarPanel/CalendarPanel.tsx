import { useState } from "react";
import AnalogClock from "../AnalogClock/AnalogClock";
import MonthGrid from "./MonthGrid";
import { useClock } from "../../hooks/useClock";
import { useContent } from "../../hooks/useContent";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { shiftMonth } from "../../utils/calendarGrid";
import { formatDate, formatTime } from "../../utils/jalali";
import "./CalendarPanel.css";

/** The Windows 7 clock flyout: analog clock, long date and a month you can page through. */
function CalendarPanel() {
  const now = useClock();
  const { t } = useContent();
  const { calendar, setCalendar } = useDesktopSettings();
  // The month being viewed is remembered together with the calendar it was chosen in;
  // switching calendar system therefore falls back to the current month.
  const [view, setView] = useState(() => ({ calendar, anchor: new Date() }));
  const anchor = view.calendar === calendar ? view.anchor : now;
  const setAnchor = (update: (current: Date) => Date) =>
    setView({ calendar, anchor: update(anchor) });

  return (
    <div className="calendar-panel" role="dialog" aria-label={t("calendar")} data-testid="calendar-panel">
      <div className="calendar-panel__clock">
        <div className="calendar-panel__face">
          <AnalogClock now={now} face="glass" />
        </div>
        <div className="calendar-panel__text">
          <div className="calendar-panel__time">{formatTime(now, calendar)}</div>
          <div className="calendar-panel__date">{formatDate(now, calendar)}</div>
          <div className="calendar-panel__switch" role="group" aria-label={t("calendar")}>
            {(["gregorian", "jalali"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={option === calendar ? "is-active" : ""}
                aria-pressed={option === calendar}
                onClick={() => setCalendar(option)}
                data-testid={`calendar-panel-${option}`}
              >
                {t(option)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <MonthGrid
        anchor={anchor}
        calendar={calendar}
        today={now}
        onPrev={() => setAnchor((current) => shiftMonth(current, calendar, -1))}
        onNext={() => setAnchor((current) => shiftMonth(current, calendar, 1))}
        prevLabel={t("previousMonth")}
        nextLabel={t("nextMonth")}
      />
    </div>
  );
}

export default CalendarPanel;
