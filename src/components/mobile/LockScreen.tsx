import { useRef, useState } from "react";
import { useClock } from "../../hooks/useClock";
import { useContent } from "../../hooks/useContent";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { formatDate, formatTime } from "../../utils/jalali";
import { clampDrag, isUnlocked } from "./unlockSlider";
import "./LockScreen.css";

const HANDLE_WIDTH = 52;
const DEFAULT_MAX = 230;

/** iOS 4 lock screen: big clock, date and "slide to unlock". Shown after a minute of inactivity. */
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useClock();
  const { t } = useContent();
  const { calendar, mobileWallpaper } = useDesktopSettings();
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [max, setMax] = useState(DEFAULT_MAX);

  const measure = () => Math.max(1, (trackRef.current?.clientWidth ?? DEFAULT_MAX + HANDLE_WIDTH + 8) - HANDLE_WIDTH - 8);

  const finish = () => {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (isUnlocked(offset, measure())) onUnlock();
    else setOffset(0);
  };

  return (
    <div
      className="lockscreen"
      style={{ backgroundImage: `url(${mobileWallpaper})` }}
      data-testid="lock-screen"
    >
      <div className="lockscreen__clock">
        <div className="lockscreen__time" data-testid="lock-time">
          {formatTime(now, calendar)}
        </div>
        <div className="lockscreen__date">{formatDate(now, calendar)}</div>
      </div>

      <div className="lockscreen__slider" ref={trackRef} data-testid="lock-slider">
        <span className="lockscreen__label" style={{ opacity: 1 - offset / max }}>
          {t("slideToUnlock")}
        </span>
        <button
          type="button"
          className="lockscreen__handle"
          style={{ transform: `translateX(${offset}px)`, transition: dragging ? "none" : "transform 0.25s ease" }}
          aria-label={t("unlock")}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            startX.current = e.clientX;
            setMax(measure());
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (startX.current === null) return;
            setOffset(clampDrag(e.clientX - startX.current, measure()));
          }}
          onPointerUp={finish}
          onPointerCancel={finish}
          onKeyDown={(e) => {
            // Keyboard / accessibility route: Enter or Space unlocks directly.
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onUnlock();
            }
          }}
          data-testid="lock-handle"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default LockScreen;
