const MESSAGES_STORAGE_KEY = "mobile-messages";

export interface ChatMessage {
  id: number;
  from: "me" | "ali";
  text: string;
}

/** Reads the saved conversation, or [] if nothing (valid) has been saved. */
export function loadMessages(): ChatMessage[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof m.id === "number" &&
        (m.from === "me" || m.from === "ali") &&
        typeof m.text === "string"
    );
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Persistence is a nicety; never crash the chat over it.
  }
}
