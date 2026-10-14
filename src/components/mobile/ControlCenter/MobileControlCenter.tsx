import { useEffect, useRef, useState } from "react";
import Icon from "../../../icons/Icon";
import { useDesktopSettings } from "../../../context/DesktopSettingsContext";
import { getVolumeLevel, setVolumeLevel } from "../../../utils/sound";
import { MIN_BRIGHTNESS } from "../../../utils/brightness";
import "./MobileControlCenter.css";

export interface ControlCenterToggle {
  id: string;
  label: string;
  icon: "airplane" | "wifi" | "bluetooth" | "moon" | "rotationLock";
  /** `on` paints the toggle in its active iOS colour. */
  active: boolean;
  onToggle: () => void;
}

interface MobileControlCenterProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The iOS Control Center: a translucent panel that drops down over the screen
 * when you pull down from the top edge. The brightness and volume sliders are
 * wired to the same state the Windows taskbar uses, so both skins stay in sync
 * and persist across reloads.
 */
function MobileControlCenter({ open, onClose }: MobileControlCenterProps) {
  const { brightnessPercent, setBrightness } = useDesktopSettings();
  const [volume, setVolume] = useState(() => getVolumeLevel());
  const [airplane, setAirplane] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [focus, setFocus] = useState(false);
  const [rotationLock, setRotationLock] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVolumeLevel(volume);
  }, [volume]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const volumePercent = Math.round(volume * 100);

  const toggles: ControlCenterToggle[] = [
    { id: "airplane", label: "Airplane", icon: "airplane", active: airplane, onToggle: () => setAirplane((v) => !v) },
    { id: "wifi", label: "Wi-Fi", icon: "wifi", active: wifi, onToggle: () => setWifi((v) => !v) },
    { id: "bluetooth", label: "Bluetooth", icon: "bluetooth", active: bluetooth, onToggle: () => setBluetooth((v) => !v) },
    { id: "focus", label: "Focus", icon: "moon", active: focus, onToggle: () => setFocus((v) => !v) },
    { id: "rotation", label: "Rotation", icon: "rotationLock", active: rotationLock, onToggle: () => setRotationLock((v) => !v) },
  ];

  return (
    <>
      {/* Tapping the wallpaper behind the panel dismisses it, as on iOS. */}
      <div className="mcc__scrim" data-testid="control-center-scrim" onClick={onClose} />
      <div
        className="mcc"
        ref={panelRef}
        data-testid="mobile-control-center"
        role="dialog"
        aria-label="Control Center"
      >
        <div className="mcc__sliders">
          <label className="mcc__slider" data-testid="cc-brightness">
            <Icon name="sun" className="mcc__slider-icon" />
            <input
              type="range"
              className="mcc__range"
              min={Math.round(MIN_BRIGHTNESS * 100)}
              max={100}
              step={5}
              value={brightnessPercent}
              aria-label="Screen brightness"
              aria-valuetext={`${brightnessPercent}%`}
              onChange={(e) => setBrightness(Number(e.target.value) / 100)}
            />
          </label>
          <label className="mcc__slider" data-testid="cc-volume">
            <Icon name="speaker" className="mcc__slider-icon" />
            <input
              type="range"
              className="mcc__range"
              min={0}
              max={100}
              step={5}
              value={volumePercent}
              aria-label="Volume"
              aria-valuetext={`${volumePercent}%`}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
            />
          </label>
        </div>

        <div className="mcc__toggles">
          {toggles.map((toggle) => (
            <button
              key={toggle.id}
              type="button"
              className={`mcc__toggle ${toggle.active ? "mcc__toggle--on" : ""}`}
              aria-pressed={toggle.active}
              onClick={toggle.onToggle}
              data-cuelume-press
            >
              <span className="mcc__toggle-icon">
                <Icon name={toggle.icon} />
              </span>
              <span className="mcc__toggle-label">{toggle.label}</span>
            </button>
          ))}
        </div>

        <p className="mcc__hint">
          Brightness {brightnessPercent}% · Volume {volumePercent}%
        </p>
      </div>
    </>
  );
}

export default MobileControlCenter;
