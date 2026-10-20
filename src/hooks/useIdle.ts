import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "wheel", "touchstart", "pointerdown"] as const;

/**
 * True after `timeoutMs` without user input. `wake()` clears it manually (the
 * lock screen's unlock slider uses that). Disabled → always false, no listeners.
 */
export function useIdle(timeoutMs: number, enabled = true) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const arm = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), timeoutMs);
  }, [timeoutMs]);

  const wake = useCallback(() => {
    setIdle(false);
    arm();
  }, [arm]);

  useEffect(() => {
    if (!enabled) {
      clearTimeout(timer.current);
      return;
    }
    arm();
    // While idle, input is handled by whatever is on screen (screensaver / lock
    // screen), so only count activity that happens while *not* idle.
    const onActivity = () => {
      setIdle((current) => {
        if (!current) arm();
        return current;
      });
    };
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    return () => {
      clearTimeout(timer.current);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, [enabled, arm]);

  // Disabling the feature (or never enabling it) means "not idle", whatever the last state was.
  return { idle: enabled && idle, wake };
}
