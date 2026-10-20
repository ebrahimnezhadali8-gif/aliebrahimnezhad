import { describe, it, expect } from "vitest";
import {
  BURN_ITEMS,
  DISC_CAPACITY_MB,
  canAdd,
  phaseFor,
  totalSize,
  usage,
  willUnderrun,
} from "./neroLogic";

const byId = (id: string) => BURN_ITEMS.find((item) => item.id === id)!;

describe("nero capacity", () => {
  it("sums sizes and reports usage up to 100%", () => {
    expect(totalSize([byId("resume"), byId("about")])).toBe(3);
    expect(usage([])).toBe(0);
    expect(usage(BURN_ITEMS)).toBe(1);
  });

  it("refuses duplicates and anything that would overflow the disc", () => {
    expect(canAdd([byId("resume")], byId("resume"))).toBe(false);
    expect(canAdd([byId("sources"), byId("demos")], byId("workchi"))).toBe(false);
    expect(canAdd([byId("sources")], byId("workchi"))).toBe(true);
  });

  it("never lets the compilation exceed the capacity when added greedily", () => {
    const chosen: typeof BURN_ITEMS = [];
    for (const item of BURN_ITEMS) if (canAdd(chosen, item)) chosen.push(item);
    expect(totalSize(chosen)).toBeLessThanOrEqual(DISC_CAPACITY_MB);
  });

  it("warns about buffer underrun only for nearly full discs", () => {
    expect(willUnderrun([byId("resume")])).toBe(false);
    expect(willUnderrun([byId("sources"), byId("demos"), byId("skills"), byId("about")])).toBe(true);
  });

  it("walks through the burn phases", () => {
    expect([0, 20, 95].map(phaseFor)).toEqual(["preparing", "writing", "verifying"]);
  });
});
