import { useCallback, useEffect, useState } from "react";

export const wallpaperImages = ["/images/desctop1.webp", "/images/desctop2.webp", "/images/desctop3.webp"] as const;

const CYCLE_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export function useWallpaperCycle() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % wallpaperImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  return { wallpaper: wallpaperImages[index], next };
}