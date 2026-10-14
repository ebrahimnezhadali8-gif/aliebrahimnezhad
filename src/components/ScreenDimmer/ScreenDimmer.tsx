import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import "./ScreenDimmer.css";

/**
 * Black overlay used to dim the screen when the brightness control is lowered.
 * Rendered by both skins (Windows desktop and the iPhone-style mobile skin) and
 * deliberately kept *below* the taskbar / Start menu so the shell stays usable.
 */
function ScreenDimmer() {
  const { dimOpacity } = useDesktopSettings();

  if (dimOpacity <= 0) return null;

  return (
    <div
      className="screen-dimmer"
      data-testid="screen-dimmer"
      style={{ opacity: dimOpacity }}
      aria-hidden="true"
    />
  );
}

export default ScreenDimmer;
