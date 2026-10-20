import { useEffect, useState, type MouseEvent } from "react";
import Wallpaper from "../Wallpaper/Wallpaper";
import DesktopIcons from "../DesktopIcons/DesktopIcons";
import Taskbar from "../Taskbar/Taskbar";
import StartMenu from "../StartMenu/StartMenu";
import ContextMenu, { type ContextMenuState } from "../ContextMenu/ContextMenu";
import { useContent } from "../../hooks/useContent";
import ResumeWindow from "../ResumeWindow/ResumeWindow";
import ProjectsWindow from "../ProjectsWindow/ProjectsWindow";
import AboutWindow from "../AboutWindow/AboutWindow";
import SkillsWindow from "../SkillsWindow/SkillsWindow";
import ContactWindow from "../ContactWindow/ContactWindow";
import CalculatorWindow from "../CalculatorWindow/CalculatorWindow";
import CmdWindow from "../CmdWindow/CmdWindow";
import IEWindow from "../IEWindow/IEWindow";
import SettingsWindow from "../SettingsWindow/SettingsWindow";
import ClockGadget from "../ClockGadget/ClockGadget";
import NeroWindow from "../NeroWindow/NeroWindow";
import MinesweeperWindow from "../MinesweeperWindow/MinesweeperWindow";
import SolitaireWindow from "../SolitaireWindow/SolitaireWindow";
import FreeCellWindow from "../FreeCellWindow/FreeCellWindow";
import TaskManagerWindow from "../TaskManagerWindow/TaskManagerWindow";
import PaintWindow from "../PaintWindow/PaintWindow";
import MediaPlayerWindow from "../MediaPlayerWindow/MediaPlayerWindow";
import PhotosWindow from "../PhotosWindow/PhotosWindow";
import Screensaver from "../Screensaver/Screensaver";
import { useIdle } from "../../hooks/useIdle";
import { useWindowManager } from "../../context/WindowManagerContext";
import RecycleBinWindow from "../RecycleBinWindow/RecycleBinWindow";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import ScreenDimmer from "../ScreenDimmer/ScreenDimmer";
import "./Desktop.css";

/** Inactivity before the screensaver starts. */
const SCREENSAVER_AFTER_MS = 60_000;

interface DesktopProps {
  visible?: boolean;
}

function DesktopInner({ visible }: { visible: boolean }) {
  const { wallpaper, nextWallpaper, screensaver } = useDesktopSettings();
  const { openWindow } = useWindowManager();
  const { idle, wake } = useIdle(SCREENSAVER_AFTER_MS, screensaver && visible);
  const { t } = useContent();
  const [iconsVisible, setIconsVisible] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [flashRefresh, setFlashRefresh] = useState(false);

  // Ctrl+Shift+Esc opens Task Manager, like the real thing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "Escape") {
        event.preventDefault();
        openWindow("taskmgr");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openWindow]);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    // Only open our custom menu for empty desktop space — real windows/icons
    // still get normal browser behavior via stopPropagation where relevant.
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={`desktop ${visible ? "desktop--visible" : ""}`}
      data-testid="desktop"
      onContextMenu={handleContextMenu}
    >
      <Wallpaper image={wallpaper} />
      <DesktopIcons visible={iconsVisible} />
      <ClockGadget />

      <ResumeWindow />
      <ProjectsWindow />
      <AboutWindow />
      <SkillsWindow />
      <ContactWindow />
      <CalculatorWindow />
      <CmdWindow />
      <IEWindow />
      <SettingsWindow />
      <RecycleBinWindow />
      <NeroWindow />
      <MinesweeperWindow />
      <SolitaireWindow />
      <FreeCellWindow />
      <TaskManagerWindow />
      <PaintWindow />
      <MediaPlayerWindow />
      <PhotosWindow />

      {/* Screen-brightness dimmer. Sits above wallpaper/icons/windows but below
          the taskbar and Start menu, so the shell stays usable when dimmed. */}
      <ScreenDimmer />

      <StartMenu />
      <Taskbar />

      <ContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(null)}
        iconsVisible={iconsVisible}
        onToggleIcons={() => setIconsVisible((v) => !v)}
        onNextBackground={nextWallpaper}
        labels={{
          showIcons: t("showDesktopIcons"),
          nextBackground: t("nextBackgroundTooltip"),
          refresh: t("refresh"),
        }}
        onRefresh={() => {
          setFlashRefresh(true);
          setTimeout(() => setFlashRefresh(false), 220);
        }}
      />
      {idle && <Screensaver onDismiss={wake} />}
      {flashRefresh && <div className="desktop__refresh-flash" data-testid="refresh-flash" />}
    </div>
  );
}

/** Top-level desktop surface. Fades in once `visible` is true (after boot). */
function Desktop({ visible = true }: DesktopProps) {
  return <DesktopInner visible={visible} />;
}

export default Desktop;
