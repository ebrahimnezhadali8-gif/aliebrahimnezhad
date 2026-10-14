import { useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { playClickSound } from "../../utils/sound";
import "./ContextMenu.css";

export interface ContextMenuState {
  x: number;
  y: number;
}

export interface ContextMenuLabels {
  showIcons: string;
  nextBackground: string;
  refresh: string;
}

interface ContextMenuProps {
  state: ContextMenuState | null;
  onClose: () => void;
  iconsVisible: boolean;
  onToggleIcons: () => void;
  onNextBackground: () => void;
  onRefresh: () => void;
  /** Translated labels, supplied by the desktop so this stays language-agnostic. */
  labels: ContextMenuLabels;
}

const MENU_WIDTH = 240;
const MENU_HEIGHT = 160;

function ContextMenu({
  state,
  onClose,
  iconsVisible,
  onToggleIcons,
  onNextBackground,
  onRefresh,
  labels,
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  if (!state) return null;

  const run = (fn: () => void) => {
    playClickSound();
    fn();
    onClose();
  };

  // Keep the menu on-screen even if the click happened near an edge.
  const left = Math.min(Math.max(0, state.x), Math.max(0, window.innerWidth - MENU_WIDTH - 8));
  const top = Math.min(Math.max(0, state.y), Math.max(0, window.innerHeight - MENU_HEIGHT - 8));

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left, top }}
      data-testid="desktop-context-menu"
      role="menu"
    >
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={iconsVisible}
        onClick={() => run(onToggleIcons)}
      >
        <span className="context-menu__check">{iconsVisible ? "✓" : ""}</span>
        {labels.showIcons}
      </button>
      <div className="context-menu__divider" />
      <button type="button" role="menuitem" onClick={() => run(onNextBackground)}>
        <span className="context-menu__check" />
        {labels.nextBackground}
      </button>
      <button type="button" role="menuitem" onClick={() => run(onRefresh)}>
        <span className="context-menu__check" />
        {labels.refresh}
      </button>
    </div>
  );
}

export default ContextMenu;