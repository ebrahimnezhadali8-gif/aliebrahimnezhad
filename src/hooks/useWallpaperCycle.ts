export const wallpaperImages = [
  "/images/desctop1.webp",
  "/images/desctop2.webp",
  "/images/desctop3.webp",
] as const;

/**
 * The phone skin has its own gallery of phone-shaped wallpapers (the desktop
 * ones are landscape and are never offered here). It never rotates by itself —
 * the visitor picks one in Settings and it stays.
 */
export const MOBILE_WALLPAPERS = [
  "/images/mobile/aurora.jpg",
  "/images/mobile/waterfall.jpg",
  "/images/mobile/milkyway.jpg",
  "/images/mobile/lighthouse.jpg",
] as const;

export const WALLPAPER_STORAGE_KEY = "portfolio:wallpaper";
export const MOBILE_WALLPAPER_STORAGE_KEY = "portfolio:mobile-wallpaper";