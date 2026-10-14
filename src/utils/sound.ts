import { bind, play, setVolume as cuelumeSetVolume, setEnabled } from "cuelume";

const VOLUME_KEY = "portfolio:volume";
let bound = false;

function loadStoredVolume(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(VOLUME_KEY);
  const parsed = raw !== null ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 1;
}

/** Binds cuelume's data-attribute listeners once for the whole document. Safe to call repeatedly. */
export function initSounds(): void {
  if (bound) return;
  bind();
  cuelumeSetVolume(loadStoredVolume());
  bound = true;
}

/** Sets the master volume (0–1) for all UI sounds and persists it across reloads. */
export function setVolumeLevel(volume: number): void {
  const clamped = Math.min(1, Math.max(0, volume));
  cuelumeSetVolume(clamped);
  setEnabled(clamped > 0);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(VOLUME_KEY, String(clamped));
  }
}

/** Reads the currently stored master volume (0–1). */
export function getVolumeLevel(): number {
  return loadStoredVolume();
}

/** Sound played when a window/folder opens. */
export function playOpenSound(): void {
  play("bloom");
}

/** Sound played when a window/folder closes. */
export function playCloseSound(): void {
  play("droplet");
}

/** Sound played when a window is minimized or restored from the taskbar. */
export function playMinimizeSound(): void {
  play("whisper");
}

/** Sound played for a generic click/toggle (context menu items, calculator keys, etc.). */
export function playClickSound(): void {
  play("tick");
}