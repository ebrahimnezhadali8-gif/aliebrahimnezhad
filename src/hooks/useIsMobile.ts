import { useEffect, useState } from "react";

/**
 * Anything at or below this width is treated as a phone (or a small tablet held
 * in portrait) and gets the iPhone skin.
 */
export const PHONE_MAX_WIDTH_PX = 1024;

/**
 * Tablets in landscape are wider than a phone but still obviously not a desktop.
 * We only route those to the phone skin when the device reports a coarse
 * pointer (a real touch screen), so a narrow desktop window still gets Windows.
 */
export const TABLET_MAX_WIDTH_PX = 1366;

/** True when the viewport should render the iPhone skin instead of the Windows desktop. */
export function shouldUseMobileSkin(width: number, coarsePointer: boolean): boolean {
  if (width <= PHONE_MAX_WIDTH_PX) return true;
  return coarsePointer && width <= TABLET_MAX_WIDTH_PX;
}

function readCoarsePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function computeIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return shouldUseMobileSkin(window.innerWidth, readCoarsePointer());
}

/** True for phone- and tablet-sized viewports; updates live on resize/orientation change. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(computeIsMobile);

  useEffect(() => {
    const mql = typeof window.matchMedia === "function" ? window.matchMedia("(pointer: coarse)") : null;
    const handler = () => setIsMobile(shouldUseMobileSkin(window.innerWidth, mql?.matches ?? false));
    handler();
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    mql?.addEventListener("change", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
      mql?.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}
