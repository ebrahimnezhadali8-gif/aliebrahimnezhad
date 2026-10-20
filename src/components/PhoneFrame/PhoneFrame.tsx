import { useEffect, useRef, useState } from "react";
import { useContent } from "../../hooks/useContent";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import "./PhoneFrame.css";

/** Device outline in CSS px: the 320×480 screen plus bezel, speaker and Home button. */
const DEVICE_WIDTH = 372;
const DEVICE_HEIGHT = 700;

/**
 * Optional desktop "Phone preview": the real phone skin, shown inside an iPhone 4
 * frame. The screen is an <iframe> of this very app, so it gets a genuine
 * 320px-wide viewport (media queries and all) and lands on the phone skin by itself.
 */
function PhoneFrame() {
  const { t } = useContent();
  const { setPhonePreview } = useDesktopSettings();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(() => fit());

  useEffect(() => {
    const onResize = () => setScale(fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="phone-frame" data-testid="phone-frame">
      <button
        type="button"
        className="phone-frame__exit"
        onClick={() => setPhonePreview(false)}
        data-testid="phone-frame-exit"
      >
        ← {t("exitPreview")}
      </button>
      <div
        className="phone-frame__device"
        style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, transform: `scale(${scale})` }}
      >
        <span className="phone-frame__speaker" aria-hidden="true" />
        <span className="phone-frame__camera" aria-hidden="true" />
        <iframe
          ref={frameRef}
          className="phone-frame__screen"
          src="/"
          title="iPhone preview"
          data-testid="phone-frame-screen"
        />
        <button
          type="button"
          className="phone-frame__home"
          aria-label="Home"
          onClick={() => frameRef.current?.contentWindow?.postMessage({ type: "phone-home" }, window.location.origin)}
        />
      </div>
    </div>
  );
}

function fit(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(1, (window.innerHeight - 70) / DEVICE_HEIGHT);
}

export default PhoneFrame;
