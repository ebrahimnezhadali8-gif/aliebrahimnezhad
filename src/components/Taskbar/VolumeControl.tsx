import { useRef, useState } from "react";
import Icon from "../../icons/Icon";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useContent } from "../../hooks/useContent";
import { useOutsideClick } from "../../hooks/useOutsideClick";

function VolumeControl() {
  const [open, setOpen] = useState(false);
  const { volume, volumePercent, setVolume } = useDesktopSettings();
  const { t } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="tray-control" ref={ref}>
      <button
        type="button"
        id="volume-btn"
        className="tray-btn"
        aria-label={t("volume")}
        aria-expanded={open}
        title={t("volume")}
        data-cuelume-press
        data-testid="volume-btn"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="speaker" className={volume === 0 ? "tray-btn__icon--muted" : ""} />
      </button>
      {open && (
        <div
          className="tray-popover"
          data-testid="volume-popover"
          role="dialog"
          aria-label={t("volume")}
        >
          <Icon name="speaker" className="tray-popover__icon" />
          <input
            type="range"
            className="tray-popover__slider"
            min={0}
            max={100}
            value={volumePercent}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label={t("volume")}
            aria-valuetext={`${volumePercent}%`}
            data-testid="volume-slider"
          />
          <span className="tray-popover__pct">{volumePercent}%</span>
        </div>
      )}
    </div>
  );
}

export default VolumeControl;