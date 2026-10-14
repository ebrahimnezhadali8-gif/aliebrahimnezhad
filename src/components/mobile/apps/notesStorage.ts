const NOTES_STORAGE_KEY = "mobile-notes-content";

/** Reads the saved note text, or "" if nothing has been saved yet. */
export function loadNotes(): string {
  try {
    return localStorage.getItem(NOTES_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Persists the note text. Silently no-ops if storage is unavailable (e.g. private browsing limits). */
export function saveNotes(text: string): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, text);
  } catch {
    // Ignore storage errors — losing persistence is preferable to crashing the app.
  }
}
