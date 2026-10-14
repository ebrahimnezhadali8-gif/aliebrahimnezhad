import { useRef, useState } from "react";
import Icon from "../../icons/Icon";
import { MIN_BRIGHTNESS } from "../../utils/brightness";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";

/**
 * Windows 7 style "screen brightness" tray widget, sitting right next to the
 * volume control. Clicking the sun opens a popover with a slider that dims or
 * brightens the whole desktop.
 */
function BrightnessControl() {
  const [open, setOpen] = useState(false);
  const { dimOpacity, brightnessPercent, setBrightness } = useDesktopSettings();
  const ref = useRef<HTMLDivElement>(null);
  const sliderMin = Math.round(MIN_BRIGHTNESS * 100);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="tray-control" ref={ref}>
      <button
        type="button"
        id="brightness-btn"
        className="tray-btn"
        aria-label="Screen brightness"
        aria-expanded={open}
        title="Screen brightness"
        data-cuelume-press
        data-testid="brightness-btn"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="sun" />
      </button>
      {open && (
        <div
          className="tray-popover"
          data-testid="brightness-popover"
          role="dialog"
          aria-label="Screen brightness"
        >
          <Icon name="sun" className="tray-popover__icon" />
          <input
            type="range"
            className="tray-popover__slider"
            min={sliderMin}
            max={100}
            step={5}
            value={brightnessPercent}
            onChange={(e) => setBrightness(Number(e.target.value) / 100)}
            aria-label="Screen brightness level"
            aria-valuetext={`${brightnessPercent}%`}
            data-testid="brightness-slider"
          />
          <span className="tray-popover__pct">{brightnessPercent}%</span>
          {dimOpacity > 0 && <span className="tray-popover__hint">dimmed</span>}
        </div>
      )}
    </div>
  );
}

export default BrightnessControl;
