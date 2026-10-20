import { useMemo } from "react";
import type { CalendarSystem } from "../../utils/calendar";
import { monthView } from "../../utils/calendarGrid";
import "./MonthGrid.css";

interface MonthGridProps {
  /** Any date inside the month to show. */
  anchor: Date;
  calendar: CalendarSystem;
  today: Date;
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}

/** Month header (with ‹ ›) plus a 7-column day grid; shared by the desktop panel and the iPhone Calendar. */
function MonthGrid({ anchor, calendar, today, selected, onSelect, onPrev, onNext, prevLabel, nextLabel }: MonthGridProps) {
  const view = useMemo(() => monthView(anchor, calendar, today), [anchor, calendar, today]);
  const isSelected = (date: Date) =>
    Boolean(selected) &&
    selected!.getFullYear() === date.getFullYear() &&
    selected!.getMonth() === date.getMonth() &&
    selected!.getDate() === date.getDate();

  return (
    <div className="month-grid" data-testid="month-grid">
      <div className="month-grid__head">
        <button type="button" className="month-grid__nav" onClick={onPrev} aria-label={prevLabel} data-testid="month-prev">
          ‹
        </button>
        <span className="month-grid__title" data-testid="month-title">
          {view.title}
        </span>
        <button type="button" className="month-grid__nav" onClick={onNext} aria-label={nextLabel} data-testid="month-next">
          ›
        </button>
      </div>
      <div className="month-grid__weekdays" aria-hidden="true">
        {view.weekdays.map((name, i) => (
          <span key={`${name}-${i}`}>{name}</span>
        ))}
      </div>
      <div className="month-grid__days">
        {view.weeks.flat().map((cell) => (
          <button
            key={cell.date.getTime()}
            type="button"
            className={[
              "month-grid__day",
              cell.inMonth ? "" : "month-grid__day--muted",
              cell.isToday ? "month-grid__day--today" : "",
              cell.holiday ? "month-grid__day--holiday" : "",
              isSelected(cell.date) ? "month-grid__day--selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect?.(cell.date)}
            data-testid={cell.isToday ? "month-today" : undefined}
            aria-current={cell.isToday ? "date" : undefined}
          >
            {cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;
