import { useClock } from "../../hooks/useClock";

function Clock() {
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <div className="taskbar-clock" data-testid="taskbar-clock">
      <span className="taskbar-clock__time">{time}</span>
      <span className="taskbar-clock__date">{date}</span>
    </div>
  );
}

export default Clock;
