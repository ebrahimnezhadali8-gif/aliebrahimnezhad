import { useClock } from "../../hooks/useClock";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { formatDate, formatTime } from "../../utils/jalali";

/** Tray clock. The calendar system (Gregorian / Jalali) is chosen in Settings. */
function Clock() {
  const now = useClock();
  const { calendar } = useDesktopSettings();

  return (
    <div className="taskbar-clock" data-testid="taskbar-clock">
      <span className="taskbar-clock__time">{formatTime(now, calendar)}</span>
      <span className="taskbar-clock__date" data-testid="taskbar-date">
        {formatDate(now, calendar)}
      </span>
    </div>
  );
}

export default Clock;
