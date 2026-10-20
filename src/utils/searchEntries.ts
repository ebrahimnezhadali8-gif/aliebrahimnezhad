import type { IconName } from "../types";

export type SearchKind = "app" | "project" | "skill";

export interface SearchEntry {
  /** Unique across kinds, e.g. "app:notes", "project:workchi". */
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  icon: IconName;
  /** Extra words that should match but aren't shown (tags, domain …). */
  keywords?: string[];
}

function normalise(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
}

/**
 * Ranks entries for a query: a title that starts with the query beats one that
 * merely contains it, which beats a match in the subtitle/keywords. Entries
 * that don't match at all are dropped. Pure so the ranking is testable alone.
 */
export function filterEntries(entries: SearchEntry[], query: string, limit = 12): SearchEntry[] {
  const q = normalise(query);
  if (!q) return [];

  const scored: { entry: SearchEntry; score: number; order: number }[] = [];
  entries.forEach((entry, order) => {
    const title = normalise(entry.title);
    let score = 0;
    if (title.startsWith(q)) score = 3;
    else if (title.includes(q)) score = 2;
    else if (
      [entry.subtitle ?? "", ...(entry.keywords ?? [])].some((text) => normalise(text).includes(q))
    ) {
      score = 1;
    }
    if (score > 0) scored.push({ entry, score, order });
  });

  return scored
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map((item) => item.entry);
}
