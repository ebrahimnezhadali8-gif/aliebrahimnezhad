import { useEffect, useState } from "react";
import AnalogClock from "../AnalogClock/AnalogClock";
import { useDrag } from "../../hooks/useDrag";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useContent } from "../../hooks/useContent";
import "./ClockGadget.css";

const GADGET_SIZE = 140;

/** A Windows 7 sidebar-style analog clock gadget you can drag around the desktop. */
function ClockGadget() {
  const { clockGadget, setClockGadget } = useDesktopSettings();
  const { t } = useContent();
  const { position, onMouseDown } = useDrag({
    x: Math.max(20, window.innerWidth - GADGET_SIZE - 40),
    y: 30,
  });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!clockGadget) return;
    // ~12 fps is plenty for a sweeping hand and far cheaper than a rAF loop.
    const timer = setInterval(() => setNow(new Date()), 80);
    return () => clearInterval(timer);
  }, [clockGadget]);

  if (!clockGadget) return null;

  return (
    <div
      className="clock-gadget"
      style={{ left: position.x, top: position.y, width: GADGET_SIZE }}
      onMouseDown={onMouseDown}
      onContextMenu={(e) => e.stopPropagation()}
      data-testid="clock-gadget"
    >
      <button
        type="button"
        className="clock-gadget__close"
        aria-label={t("close")}
        title={t("close")}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setClockGadget(false)}
        data-testid="clock-gadget-close"
      >
        ✕
      </button>
      <AnalogClock now={now} face="glass" smooth label={t("clockApp")} />
    </div>
  );
}

export default ClockGadget;
