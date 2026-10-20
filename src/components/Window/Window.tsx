import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "../../icons/Icon";
import type { IconName } from "../../types";
import { useDrag } from "../../hooks/useDrag";
import { useWindowManager } from "../../context/WindowManagerContext";
import "./Window.css";

interface WindowProps {
  id: string;
  title: string;
  icon: IconName;
  width?: number;
  height?: number;
  children?: ReactNode;
}

/**
 * A draggable, closable "Windows 7" style window chrome.
 * Renders nothing while closed OR minimized — but stays registered in the
 * window manager (and therefore in the taskbar) while minimized.
 */
function Window({
  id,
  title,
  icon,
  width = 480,
  height = 400,
  children,
}: WindowProps) {
  const {
    openWindows,
    activeWindowId,
    closeWindow,
    focusWindow,
    minimizeWindow,
  } = useWindowManager();
  const state = openWindows[id];
  const isOpen = Boolean(state) && !state.minimized;
  const zIndex = state?.zIndex ?? 0;
  const [isMaximized, setIsMaximized] = useState(false);
  const registered = useRef(false);

  const centredX = Math.max(20, (window.innerWidth - width) / 2 - 60);
  const centredY = Math.max(20, (window.innerHeight - height) / 2 - 60);
  const { position, setPosition, onMouseDown } = useDrag({ x: centredX, y: centredY });

  // Cascade: each newly opened window steps 18px down-right of the previous
  // one (wrapping every 6), so stacked windows never hide each other's title bars.
  useEffect(() => {
    if (!state) {
      registered.current = false;
      return;
    }
    if (registered.current) return;
    registered.current = true;
    const offset = ((Object.keys(openWindows).length - 1) % 6) * 18;
    setPosition({ x: centredX + offset, y: centredY + offset });
  }, [state, openWindows, setPosition, centredX, centredY]);

  if (!isOpen) return null;

  const toggleMaximize = () => setIsMaximized((v) => !v);

  const style = isMaximized
    ? { left: 0, top: 0, width: "100%", zIndex }
    : { left: position.x, top: position.y, width, height, zIndex };

  return (
    <div
      className={`win7-window ${activeWindowId === id ? "win7-window--active" : ""} ${
        isMaximized ? "win7-window--maximized" : ""
      }`}
      style={style}
      onMouseDown={() => focusWindow(id)}
      data-testid={`window-${id}`}
      role="dialog"
      aria-label={title}
    >
      <div
        className="win7-window__titlebar"
        onMouseDown={isMaximized ? undefined : onMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <span className="win7-window__ticon">
          <Icon name={icon} />
        </span>
        <span className="win7-window__title">{title}</span>
        <div className="win7-window__btns">
          <button
            type="button"
            className="win7-window__btn"
            aria-label="Minimize"
            data-cuelume-press
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
          >
            &#8212;
          </button>
          <button
            type="button"
            className="win7-window__btn"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            data-cuelume-press
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
          >
            {isMaximized ? "\u2751" : "\u2610"}
          </button>
          <button
            type="button"
            className="win7-window__btn win7-window__btn--close"
            aria-label="Close"
            data-cuelume-press
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
          >
            &#10005;
          </button>
        </div>
      </div>
      <div className="win7-window__body">{children}</div>
    </div>
  );
}

export default Window;
