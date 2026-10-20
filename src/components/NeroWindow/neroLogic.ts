/** Capacity of a standard CD-R, in MB. */
export const DISC_CAPACITY_MB = 700;

export interface BurnItem {
  id: string;
  name: string;
  sizeMb: number;
  /** What the visitor gets for "burning" this item. */
  kind: "resume" | "project" | "skills" | "about" | "extras";
}

/** Everything that can be dragged onto the disc. Sizes are deliberately a bit absurd. */
export const BURN_ITEMS: BurnItem[] = [
  { id: "resume", name: "Resume.pdf", sizeMb: 2, kind: "resume" },
  { id: "workchi", name: "Projects\\Workchi", sizeMb: 180, kind: "project" },
  { id: "narvash", name: "Projects\\Narvash", sizeMb: 140, kind: "project" },
  { id: "boomsv", name: "Projects\\BoomSazegan", sizeMb: 120, kind: "project" },
  { id: "skills", name: "Skills.dat", sizeMb: 45, kind: "skills" },
  { id: "about", name: "About-me.txt", sizeMb: 1, kind: "about" },
  { id: "sources", name: "SourceCode.zip", sizeMb: 350, kind: "extras" },
  { id: "demos", name: "DemoVideos", sizeMb: 260, kind: "extras" },
];

export function totalSize(items: BurnItem[]): number {
  return items.reduce((sum, item) => sum + item.sizeMb, 0);
}

export function canAdd(items: BurnItem[], candidate: BurnItem): boolean {
  if (items.some((item) => item.id === candidate.id)) return false;
  return totalSize(items) + candidate.sizeMb <= DISC_CAPACITY_MB;
}

/** Fraction of the disc in use (0–1, never above 1). */
export function usage(items: BurnItem[]): number {
  return Math.min(1, totalSize(items) / DISC_CAPACITY_MB);
}

/**
 * A disc that is nearly full is risky to write: above this usage the burn can
 * fail with the classic "buffer underrun" — the joke the whole window is built on.
 */
export const UNDERRUN_THRESHOLD = 0.9;

/** Percent at which a too-full disc fails. */
export const UNDERRUN_AT_PERCENT = 87;

export function willUnderrun(items: BurnItem[]): boolean {
  return usage(items) >= UNDERRUN_THRESHOLD;
}

export type BurnPhase = "preparing" | "writing" | "verifying";

export function phaseFor(percent: number): BurnPhase {
  if (percent < 8) return "preparing";
  if (percent < 92) return "writing";
  return "verifying";
}
