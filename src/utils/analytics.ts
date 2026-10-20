/**
 * Privacy-first usage counting: no cookies, no personal data, nothing leaves
 * the browser unless a Plausible domain is configured at build time
 * (`VITE_PLAUSIBLE_DOMAIN`). Counters are kept in localStorage so the owner can
 * run `stats` in the CMD window and see which windows/apps get opened most.
 */

export const ANALYTICS_STORAGE_KEY = "portfolio:analytics";

export type StatCounts = Record<string, number>;

interface PlausibleFn {
  (event: string, options?: { props?: Record<string, string> }): void;
}

export function readStats(): StatCounts {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(ANALYTICS_STORAGE_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const counts: StatCounts = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value)) counts[key] = value;
    }
    return counts;
  } catch {
    return {};
  }
}

/** Records that `kind:name` (e.g. "window:projects") was opened. Never throws. */
export function track(kind: "window" | "app" | "project", name: string): void {
  try {
    const counts = readStats();
    const key = `${kind}:${name}`;
    counts[key] = (counts[key] ?? 0) + 1;
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    /* storage unavailable — counting is best-effort */
  }
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  if (typeof plausible === "function") plausible(`open-${kind}`, { props: { name } });
}

/** Counters sorted by count (desc), then name — ready for display. */
export function sortedStats(counts: StatCounts = readStats()): [string, number][] {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** Injects Plausible's tiny script when a domain is configured; otherwise a no-op. */
export function initAnalytics(domain: string | undefined = import.meta.env.VITE_PLAUSIBLE_DOMAIN): void {
  if (!domain || typeof document === "undefined") return;
  if (document.querySelector("script[data-plausible]")) return;
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://plausible.io/js/script.js";
  script.dataset.domain = domain;
  script.dataset.plausible = "1";
  document.head.appendChild(script);
}
