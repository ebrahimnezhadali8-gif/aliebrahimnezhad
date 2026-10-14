import { useEffect, useState } from "react";
import "./BootScreen.css";

const BOOT_DURATION_MS = 2000;
const FADE_DURATION_MS = 700;

interface BootScreenProps {
  onFinished?: () => void;
  duration?: number;
}

/** Shows a Windows-style boot animation for a few seconds, then calls onFinished. */
function BootScreen({ onFinished, duration = BOOT_DURATION_MS }: BootScreenProps) {
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
    <div className={`boot-screen ${fadingOut ? "boot-screen--fade-out" : ""}`} data-testid="boot-screen">
      <div className="boot-screen__orb">
        <img src="svg/windows7.png" alt="Windows logo" />
      </div>
      <div className="boot-screen__dots">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      <div className="boot-screen__text">Starting…</div>
    </div>
  );
}

export default BootScreen;