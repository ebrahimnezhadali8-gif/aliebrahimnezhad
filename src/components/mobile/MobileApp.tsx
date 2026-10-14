import { useCallback, useRef, useState } from "react";
import MobileBootScreen from "./BootScreen/MobileBootScreen";
import MobileHomeScreen from "./HomeScreen/MobileHomeScreen";
import MobileControlCenter from "./ControlCenter/MobileControlCenter";
import ScreenDimmer from "../ScreenDimmer/ScreenDimmer";
import ResumeApp from "./apps/ResumeApp";
import NotesApp from "./apps/NotesApp";
import ProjectsApp from "./apps/ProjectsApp";
import AboutApp from "./apps/AboutApp";
import SkillsApp from "./apps/SkillsApp";
import CalculatorApp from "./apps/CalculatorApp";
import PhoneApp from "./apps/PhoneApp";
import MailApp from "./apps/MailApp";
import type { MobileAppId, MobileIconItem } from "./mobileTypes";
import { siteConfig } from "../../config/siteConfig";
import type { SiteLinks } from "../../types";
import "./MobileApp.css";

/** How far the finger has to travel down from the top edge to open Control Center. */
const PULL_OPEN_THRESHOLD_PX = 36;

function MobileApp() {
  const [booted, setBooted] = useState(false);
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const pullStartY = useRef<number | null>(null);

  const goHome = useCallback(() => {
    setActiveApp(null);
    setControlCenterOpen(false);
  }, []);

  const handleActivate = (item: MobileIconItem) => {
    if (item.action.type === "link") {
      const url = siteConfig.links[item.action.target as keyof SiteLinks];
      if (url) window.open(url, "_blank", "noopener");
      return;
    }
    setActiveApp(item.action.app);
  };

  /**
   * Pull-down-from-the-top-edge gesture. We track the pointer ourselves rather
   * than using `touch-action`, so it works with a mouse on a desktop browser and
   * with touch on a real phone without hijacking vertical scrolling.
   */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.clientY > PULL_OPEN_THRESHOLD_PX) return;
    pullStartY.current = event.clientY;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const startY = pullStartY.current;
    if (startY === null) return;
    if (event.clientY - startY >= PULL_OPEN_THRESHOLD_PX) {
      setControlCenterOpen(true);
      pullStartY.current = null;
    }
  };

  const handlePointerUp = () => {
    pullStartY.current = null;
  };

  const renderApp = () => {
    switch (activeApp) {
      case "resume":
        return <ResumeApp onBack={goHome} />;
      case "notes":
        return <NotesApp onBack={goHome} />;
      case "projects":
        return <ProjectsApp onBack={goHome} />;
      case "about":
        return <AboutApp onBack={goHome} />;
      case "skills":
        return <SkillsApp onBack={goHome} />;
      case "calculator":
        return <CalculatorApp onBack={goHome} />;
      case "phone":
        return <PhoneApp onBack={goHome} />;
      case "mail":
        return <MailApp onBack={goHome} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="mobile-root"
      data-testid="mobile-root"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {!booted && <MobileBootScreen onFinished={() => setBooted(true)} />}

      {booted && (
        <>
          <MobileHomeScreen
            onActivate={handleActivate}
            onOpenControlCenter={() => setControlCenterOpen(true)}
          />
          {activeApp && renderApp()}
          <ScreenDimmer />
          <MobileControlCenter
            open={controlCenterOpen}
            onClose={() => setControlCenterOpen(false)}
          />
          {/* iOS home indicator: tapping it returns to the home screen. */}
          <button
            type="button"
            className="mobile-root__home-indicator"
            aria-label="Home"
            onClick={goHome}
            data-cuelume-press
          />
        </>
      )}
    </div>
  );
}

export default MobileApp;
