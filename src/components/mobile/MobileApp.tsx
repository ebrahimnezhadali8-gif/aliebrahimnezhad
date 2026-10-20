import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import SafariApp from "./apps/SafariApp";
import SettingsApp from "./apps/SettingsApp";
import MessagesApp from "./apps/MessagesApp";
import TerminalApp from "./apps/TerminalApp";
import ClockApp from "./apps/ClockApp";
import SpotlightSearch from "./SpotlightSearch";
import { appLabel } from "./appLabel";
import { useContent } from "../../hooks/useContent";
import { track } from "../../utils/analytics";
import type { SearchEntry } from "../../utils/searchEntries";
import { MobileShellContext } from "./MobileShellContext";
import { dockApps, homeScreenApps, type MobileAppId, type MobileIconItem } from "./mobileTypes";
import { siteConfig } from "../../config/siteConfig";
import type { SiteLinks } from "../../types";
import "./MobileApp.css";

/** How far the finger has to travel down from the top edge to open Control Center. */
const PULL_OPEN_THRESHOLD_PX = 36;

function MobileApp() {
  const [booted, setBooted] = useState(false);
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const pullStartY = useRef<number | null>(null);
  const { t, content } = useContent();

  const goHome = useCallback(() => {
    setSpotlightOpen(false);
    setActiveApp(null);
    setControlCenterOpen(false);
  }, []);

  // The desktop "Phone preview" frame has a real Home button outside the iframe.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === "phone-home") goHome();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [goHome]);

  const handleActivate = (item: MobileIconItem) => {
    if (item.action.type === "link") {
      const url = siteConfig.links[item.action.target as keyof SiteLinks];
      if (url) window.open(url, "_blank", "noopener");
      return;
    }
    track("app", item.action.app);
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

  const shell = useMemo(
    () => (activeApp === "settings" ? null : { openSettings: () => { setActiveApp("settings"); setControlCenterOpen(false); } }),
    [activeApp]
  );

  const spotlightEntries = useMemo<SearchEntry[]>(() => {
    const label = appLabel(t);
    return [
      ...[...homeScreenApps, ...dockApps].map((item) => ({
        id: `app:${item.id}`,
        kind: "app" as const,
        title: label(item),
        icon: item.icon,
      })),
      ...content.projects.map((project) => ({
        id: `project:${project.id}`,
        kind: "project" as const,
        title: project.title,
        subtitle: project.tagline,
        icon: "ios4Projects" as const,
        keywords: [...project.tags, project.link],
      })),
      ...content.skills.map((skill) => ({
        id: `skill:${skill.name}`,
        kind: "skill" as const,
        title: skill.name,
        icon: skill.icon,
      })),
    ];
  }, [t, content]);

  const handleSpotlightSelect = (entry: SearchEntry) => {
    setSpotlightOpen(false);
    if (entry.kind === "app") {
      const item = [...homeScreenApps, ...dockApps].find((candidate) => `app:${candidate.id}` === entry.id);
      if (item) handleActivate(item);
    } else {
      setActiveApp(entry.kind === "project" ? "projects" : "skills");
    }
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
      case "safari":
        return <SafariApp onBack={goHome} />;
      case "terminal":
        return <TerminalApp onBack={goHome} />;
      case "clock":
        return <ClockApp onBack={goHome} />;
      case "messages":
        return <MessagesApp onBack={goHome} />;
      case "settings":
        return <SettingsApp onBack={goHome} />;
      default:
        return null;
    }
  };

  return (
    <MobileShellContext.Provider value={shell}>
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
            onOpenSpotlight={() => setSpotlightOpen(true)}
          />
          {activeApp && renderApp()}
          {spotlightOpen && !activeApp && (
            <SpotlightSearch
              entries={spotlightEntries}
              onSelect={handleSpotlightSelect}
              onClose={() => setSpotlightOpen(false)}
            />
          )}
          <ScreenDimmer />
          <MobileControlCenter open={controlCenterOpen} onClose={() => setControlCenterOpen(false)} />
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
    </MobileShellContext.Provider>
  );
}

export default MobileApp;