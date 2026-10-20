import { useState } from "react";
import BootScreen from "./components/BootScreen/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { DesktopSettingsProvider, useDesktopSettings } from "./context/DesktopSettingsContext";
import { useIsMobile } from "./hooks/useIsMobile";
import MobileApp from "./components/mobile/MobileApp";
import PhoneFrame from "./components/PhoneFrame/PhoneFrame";

/** Windows desktop, or — when the visitor opted in — the phone skin in a device frame. */
function DesktopShell() {
  const [booted, setBooted] = useState(false);
  const { phonePreview } = useDesktopSettings();

  if (phonePreview) return <PhoneFrame />;

  return (
    <WindowManagerProvider>
      {!booted && <BootScreen onFinished={() => setBooted(true)} />}
      <Desktop visible={booted} />
    </WindowManagerProvider>
  );
}

function App() {
  const isMobile = useIsMobile();

  // Phone and tablet both get the iPhone-style skin. It has its own boot screen
  // and its own navigation state, so it doesn't use WindowManagerProvider — but
  // it does share DesktopSettingsProvider so brightness/volume stay in sync with
  // the Windows taskbar and persist across reloads.
  if (isMobile) {
    return (
      <DesktopSettingsProvider>
        <MobileApp />
      </DesktopSettingsProvider>
    );
  }

  return (
    <DesktopSettingsProvider>
      <DesktopShell />
    </DesktopSettingsProvider>
  );
}

export default App;
