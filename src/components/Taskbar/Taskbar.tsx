import StartButton from "./StartButton";
import TaskbarApp from "./TaskbarApp";
import Clock from "./Clock";
import VolumeControl from "./VolumeControl";
import BrightnessControl from "./BrightnessControl";
import { useWindowManager } from "../../context/WindowManagerContext";
import { windowMeta } from "../../config/siteConfig";
import "./Taskbar.css";

function Taskbar() {
  const { openWindows, activeWindowId, toggleStartMenu, focusWindow, showDesktop } = useWindowManager();
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
            title={windowMeta[id]?.title ?? id}
            icon={windowMeta[id]?.icon ?? "folder"}
            active={activeWindowId === id}
            minimized={openWindows[id].minimized}
            onClick={focusWindow}
          />
        ))}
      </div>
      <div className="taskbar__systray">
        <BrightnessControl />
        <VolumeControl />
        <span className="taskbar__network" aria-hidden="true" title="Network">
          📶
        </span>
        <Clock />
      </div>
      <button
        type="button"
        className="taskbar__show-desktop"
        aria-label="Show desktop"
        onClick={showDesktop}
      />
    </div>
  );
}

export default Taskbar;