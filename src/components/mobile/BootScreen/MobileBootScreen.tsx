import { useEffect, useState } from "react";
import Icon from "../../../icons/Icon";
import "./MobileBootScreen.css";

const BOOT_DURATION_MS = 2200;
const FADE_DURATION_MS = 500;

interface MobileBootScreenProps {
  onFinished?: () => void;
  duration?: number;
}

/**
 * iPhone boot screen: black, the Apple logo, and a thin progress bar that fills
 * from left to right — the classic iOS startup, rather than a generic spinner.
 */
function MobileBootScreen({ onFinished, duration = BOOT_DURATION_MS }: MobileBootScreenProps) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), duration);
    const doneTimer = setTimeout(() => onFinished?.(), duration + FADE_DURATION_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onFinished]);

  return (
    <div
      className={`mboot ${fadingOut ? "mboot--fade-out" : ""}`}
      data-testid="mobile-boot-screen"
    >
      <div className="mboot__logo" aria-label="Apple" role="img">
        <Icon name="apple" />
      </div>
      <div
        className="mboot__progress"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="mboot__progress-fill" />
      </div>
    </div>
  );
}

export default MobileBootScreen;
