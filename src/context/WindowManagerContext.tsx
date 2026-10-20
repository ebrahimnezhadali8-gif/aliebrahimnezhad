import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { WindowState } from "../types";
import { track } from "../utils/analytics";
import { playOpenSound, playCloseSound, playMinimizeSound } from "../utils/sound";

interface WindowManagerContextValue {
  /** windowId -> state, only present while the window is open (minimized or not). */
  openWindows: Record<string, WindowState>;
  activeWindowId: string | null;
  startMenuOpen: boolean;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  showDesktop: () => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

/**
 * Provides window-management state to every component in the tree.
 *
 * Important distinction: `minimizeWindow` hides a window but keeps it in
 * `openWindows` (so its taskbar button stays put and it can be restored).
 * Only `closeWindow` removes it entirely. This mirrors real Windows 7
 * behaviour: clicking "—" tucks the window away; only "✕" ends it.
 */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<Record<string, WindowState>>({});
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [topZ, setTopZ] = useState(10);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const openWindow = useCallback(
    (id: string) => {
      track("window", id);
      setOpenWindows((prev) => {
        const alreadyOpen = id in prev;
        const nextZ = topZ + 1;
        if (!alreadyOpen) playOpenSound();
        else if (prev[id].minimized) playMinimizeSound();
        return { ...prev, [id]: { zIndex: nextZ, minimized: false } };
      });
      setTopZ((z) => z + 1);
      setActiveWindowId(id);
      setStartMenuOpen(false);
    },
    [topZ]
  );

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      if (!(id in prev)) return prev;
      playCloseSound();
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setOpenWindows((prev) => {
        if (!(id in prev)) return prev;
        if (prev[id].minimized) playMinimizeSound();
        return { ...prev, [id]: { zIndex: topZ + 1, minimized: false } };
      });
      setTopZ((z) => z + 1);
      setActiveWindowId(id);
    },
    [topZ]
  );

  /** Hides the window visually but keeps it registered (taskbar button remains). */
  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      if (!(id in prev)) return prev;
      playMinimizeSound();
      return { ...prev, [id]: { ...prev[id], minimized: true } };
    });
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const toggleStartMenu = useCallback(() => setStartMenuOpen((v) => !v), []);
  const closeStartMenu = useCallback(() => setStartMenuOpen(false), []);

  const showDesktop = useCallback(() => {
    setOpenWindows((prev) => {
      const next: Record<string, WindowState> = {};
      for (const id of Object.keys(prev)) {
        next[id] = { ...prev[id], minimized: true };
      }
      return next;
    });
    setActiveWindowId(null);
  }, []);

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      openWindows,
      activeWindowId,
      startMenuOpen,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleStartMenu,
      closeStartMenu,
      showDesktop,
    }),
    [
      openWindows,
      activeWindowId,
      startMenuOpen,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleStartMenu,
      closeStartMenu,
      showDesktop,
    ]
  );

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return ctx;
}
