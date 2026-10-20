/**
 * A tiny hand-off between "View screenshots" buttons and the Photos app/window:
 * the button records which album to show, then opens Photos, which picks it up.
 * (A module variable beats URL state here — there is no router.)
 */
let pendingAlbum: string | null = null;

export const PHOTOS_EVENT = "portfolio:photos-open";

export function requestAlbum(albumId: string): void {
  pendingAlbum = albumId;
  window.dispatchEvent(new CustomEvent(PHOTOS_EVENT, { detail: albumId }));
}

/** Returns the requested album once, then clears it. */
export function takePendingAlbum(): string | null {
  const album = pendingAlbum;
  pendingAlbum = null;
  return album;
}
