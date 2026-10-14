import { useEffect, useState, useRef } from "react";
import Icon from "../../icons/Icon";
import { getVolumeLevel, setVolumeLevel } from "../../utils/sound";
import { useOutsideClick } from "../../hooks/useOutsideClick";

function VolumeControl() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(() => getVolumeLevel());
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  useEffect(() => {
    setVolumeLevel(volume);
  }, [volume]);

  return (
    <div className="tray-control" ref={ref}>
      <button
        type="button"
        id="volume-btn"
        className="tray-btn"
        aria-label="Volume"
        aria-expanded={open}
        title="Volume"
        data-cuelume-press
        data-testid="volume-btn"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon
          name="speaker"
          className={volume === 0 ? "tray-btn__icon--muted" : ""}
        />
      </button>
      {open && (
        <div
          className="tray-popover"
          data-testid="volume-popover"
          role="dialog"
          aria-label="Volume"
        >
          <Icon name="speaker" className="tray-popover__icon" />
          <input
            type="range"
            className="tray-popover__slider"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label="Volume level"
            aria-valuetext={`${Math.round(volume * 100)}%`}
            data-testid="volume-slider"
          />
          <span className="tray-popover__pct">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
}

export default VolumeControl;
