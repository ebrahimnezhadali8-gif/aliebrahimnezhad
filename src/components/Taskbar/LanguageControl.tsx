import { useRef, useState } from "react";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useContent } from "../../hooks/useContent";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { LANGUAGES, type Language } from "../../i18n/language";

const LABELS: Record<Language, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  fa: { short: "فا", full: "فارسی" },
};

/** Tray language picker: click to open a list, then choose a language. */
function LanguageControl() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useDesktopSettings();
  const { t } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="tray-control" ref={ref}>
      <button
        type="button"
        className="taskbar__lang"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={t("language")}
        data-cuelume-press
        data-testid="taskbar-language"
      >
        {LABELS[lang].short}
      </button>
      {open && (
        <div
          className="tray-popover tray-popover--list"
          role="listbox"
          aria-label={t("language")}
          data-testid="taskbar-language-list"
        >
          {LANGUAGES.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === lang}
              className={`tray-option ${option === lang ? "tray-option--active" : ""}`}
              onClick={() => {
                setLang(option);
                setOpen(false);
              }}
              data-testid={`taskbar-language-${option}`}
            >
              <span className="tray-option__check">{option === lang ? "✓" : ""}</span>
              {LABELS[option].full}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageControl;
