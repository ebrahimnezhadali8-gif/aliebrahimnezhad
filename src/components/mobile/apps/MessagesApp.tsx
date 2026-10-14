import { useEffect, useRef, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { loadMessages, saveMessages, type ChatMessage } from "./messagesStorage";
import { useContent } from "../../../hooks/useContent";
import { siteConfig } from "../../../config/siteConfig";
import "./MessagesApp.css";

const REPLY_DELAY_MS = 900;

/**
 * The built-in Messages app: a small iMessage-style thread with Ali. Messages
 * stay on this device (localStorage) — it is a chat UI, not a server — and the
 * first message gets a friendly auto-reply that points to Telegram for speed.
 */
function MessagesApp({ onBack }: { onBack: () => void }) {
  const { t, content } = useContent();
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (typeof endRef.current?.scrollIntoView === "function") {
      endRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const alreadyReplied = messages.some((m) => m.from === "ali");
    setMessages((current) => [...current, { id: Date.now(), from: "me", text }]);
    setDraft("");
    if (alreadyReplied) return;

    setTyping(true);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages((current) => [...current, { id: Date.now() + 1, from: "ali", text: t("messagesReply") }]);
    }, REPLY_DELAY_MS);
  };

  const hasReply = messages.some((m) => m.from === "ali");

  return (
    <AppScreen title={content.name.split(" ")[0]} onBack={onBack} noPadding>
      <div className="messages-app" data-testid="mobile-messages">
        <div className="messages-app__thread">
          <div className="messages-app__stamp">{t("today")}</div>
          <div className="messages-app__bubble messages-app__bubble--them">{t("messagesGreeting")}</div>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`messages-app__bubble messages-app__bubble--${m.from === "me" ? "me" : "them"}`}
              data-testid={`message-${m.from}`}
            >
              {m.text}
            </div>
          ))}
          {typing && <div className="messages-app__bubble messages-app__bubble--them messages-app__typing">•••</div>}
          {hasReply && (
            <a
              className="messages-app__link"
              href={siteConfig.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="messages-telegram"
            >
              {t("openTelegram")}
            </a>
          )}
          <div ref={endRef} />
        </div>
        <form
          className="messages-app__composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            className="messages-app__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("messagesPlaceholder")}
            aria-label={t("message")}
            data-testid="messages-input"
          />
          <button type="submit" className="messages-app__send" disabled={!draft.trim()} data-testid="messages-send">
            {t("send")}
          </button>
        </form>
      </div>
    </AppScreen>
  );
}

export default MessagesApp;
