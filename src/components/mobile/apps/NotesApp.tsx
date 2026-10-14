import { useEffect, useRef, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { loadNotes, saveNotes } from "./notesStorage";
import "./NotesApp.css";

interface NotesAppProps {
  onBack: () => void;
}

const SAVE_DEBOUNCE_MS = 400;

function NotesApp({ onBack }: NotesAppProps) {
  const [text, setText] = useState(loadNotes);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => saveNotes(text), SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [text]);

  return (
    <AppScreen title="Notes" onBack={onBack}>
      <div className="notes-app">
        <textarea
          className="notes-app__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing…"
          aria-label="Notes"
        />
      </div>
    </AppScreen>
  );
}

export default NotesApp;
