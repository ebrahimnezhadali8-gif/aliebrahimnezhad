import { useState } from "react";
import BootScreen from "./components/BootScreen/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { DesktopSettingsProvider } from "./context/DesktopSettingsContext";
import { useIsMobile } from "./hooks/useIsMobile";
import MobileApp from "./components/mobile/MobileApp";

function App() {
  const [booted, setBooted] = useState(false);
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
      <WindowManagerProvider>
        {!booted && <BootScreen onFinished={() => setBooted(true)} />}
        <Desktop visible={booted} />
      </WindowManagerProvider>
    </DesktopSettingsProvider>
  );
}

export default App;
