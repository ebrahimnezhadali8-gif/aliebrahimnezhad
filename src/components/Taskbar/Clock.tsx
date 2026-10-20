import { useRef, useState } from "react";
import { useClock } from "../../hooks/useClock";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useContent } from "../../hooks/useContent";
import { formatDate, formatTime } from "../../utils/jalali";
import CalendarPanel from "../CalendarPanel/CalendarPanel";

/**
 * Tray clock. Clicking it opens the calendar flyout (analog clock + month);
 * the calendar *system* itself (Gregorian / Jalali) is chosen in Settings or in
 * the flyout, never by the click that opens it.
 */
function Clock() {
  const now = useClock();
  const { calendar } = useDesktopSettings();
  const { t } = useContent();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="taskbar-clock-wrap" ref={ref}>
      <button
        type="button"
        className="taskbar-clock"
        data-testid="taskbar-clock"
        aria-expanded={open}
        aria-label={t("calendar")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="taskbar-clock__time">{formatTime(now, calendar)}</span>
        <span className="taskbar-clock__date" data-testid="taskbar-date">
          {formatDate(now, calendar)}
        </span>
      </button>
      {open && <CalendarPanel />}
    </div>
  );
}

export default Clock;
