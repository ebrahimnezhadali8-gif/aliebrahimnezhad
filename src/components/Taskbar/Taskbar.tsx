import StartButton from "./StartButton";
import TaskbarApp from "./TaskbarApp";
import Clock from "./Clock";
import LanguageControl from "./LanguageControl";
import Icon from "../../icons/Icon";
import VolumeControl from "./VolumeControl";
import BrightnessControl from "./BrightnessControl";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useContent, useWindowTitle } from "../../hooks/useContent";
import { windowMeta } from "../../config/siteConfig";
import "./Taskbar.css";

function Taskbar() {
  const { openWindows, activeWindowId, toggleStartMenu, focusWindow, showDesktop, openWindow } =
    useWindowManager();
  const { t } = useContent();
  const windowTitle = useWindowTitle();
  const openIds = Object.keys(openWindows);

  return (
    <div id="taskbar" className="taskbar" data-testid="taskbar">
      <StartButton onClick={toggleStartMenu} />
      <div className="taskbar__sep" />
      <div className="taskbar__items">
        {openIds.map((id) => (
          <TaskbarApp
            key={id}
            id={id}
            title={windowTitle(id)}
            icon={windowMeta[id]?.icon ?? "folder"}
            active={activeWindowId === id}
            minimized={openWindows[id].minimized}
            onClick={focusWindow}
          />
        ))}
      </div>
      <div className="taskbar__systray">
        <button
          type="button"
          className="tray-btn"
          onClick={() => openWindow("settings")}
          aria-label={t("settings")}
          title={t("settings")}
          data-cuelume-press
          data-testid="taskbar-settings"
        >
          <Icon name="gear" />
        </button>
        <LanguageControl />
        <BrightnessControl />
        <VolumeControl />
        <span className="taskbar__network" aria-hidden="true" title="Network">
          <Icon name="wifi" />
        </span>
        <Clock />
      </div>
      <button
        type="button"
        className="taskbar__show-desktop"
        aria-label={t("showDesktop")}
        onClick={showDesktop}
      />
    </div>
  );
}

export default Taskbar;