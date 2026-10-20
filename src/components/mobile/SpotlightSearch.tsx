import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import { useContent } from "../../hooks/useContent";
import { filterEntries, type SearchEntry } from "../../utils/searchEntries";
import "./SpotlightSearch.css";

interface SpotlightSearchProps {
  entries: SearchEntry[];
  onSelect: (entry: SearchEntry) => void;
  onClose: () => void;
}

/** iOS-style Spotlight: type, see matching apps / projects / skills, tap one. */
function SpotlightSearch({ entries, onSelect, onClose }: SpotlightSearchProps) {
  const { t } = useContent();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => filterEntries(entries, query), [entries, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const kindLabel = { app: t("kindApp"), project: t("kindProject"), skill: t("kindSkill") };

  return (
    <div className="spotlight" data-testid="mobile-spotlight" role="dialog" aria-label={t("search")}>
      <div className="spotlight__bar">
        <Icon name="search" className="spotlight__glass" />
        <input
          ref={inputRef}
          className="spotlight__input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          data-testid="spotlight-input"
        />
        <button type="button" className="spotlight__cancel" onClick={onClose} data-testid="spotlight-cancel">
          {t("backLabel")}
        </button>
      </div>
      <ul className="spotlight__results" data-testid="spotlight-results">
        {results.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="spotlight__row"
              onClick={() => onSelect(entry)}
              data-testid={`spotlight-${entry.id}`}
            >
              <span className="spotlight__icon">
                <Icon name={entry.icon} />
              </span>
              <span className="spotlight__text">
                <span className="spotlight__title">{entry.title}</span>
                {entry.subtitle && <span className="spotlight__sub">{entry.subtitle}</span>}
              </span>
              <span className="spotlight__kind">{kindLabel[entry.kind]}</span>
            </button>
          </li>
        ))}
        {query.trim() !== "" && results.length === 0 && <li className="spotlight__empty">{t("noResults")}</li>}
      </ul>
    </div>
  );
}

export default SpotlightSearch;
