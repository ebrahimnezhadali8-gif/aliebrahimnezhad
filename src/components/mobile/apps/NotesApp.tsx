import { useEffect, useRef, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { loadNotes, saveNotes } from "./notesStorage";
import { useContent } from "../../../hooks/useContent";
import "./NotesApp.css";

interface NotesAppProps {
  onBack: () => void;
}

const SAVE_DEBOUNCE_MS = 400;

function NotesApp({ onBack }: NotesAppProps) {
  const { t } = useContent();
  const [text, setText] = useState(loadNotes);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => saveNotes(text), SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [text]);

  return (
    <AppScreen title={t("notes")} onBack={onBack}>
      <div className="notes-app">
        <textarea
          className="notes-app__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("messagePlaceholder")}
          aria-label={t("notes")}
        />
      </div>
    </AppScreen>
  );
}

export default NotesApp;