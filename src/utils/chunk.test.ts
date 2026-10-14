import { describe, it, expect } from "vitest";
import { chunk } from "./chunk";

describe("chunk", () => {
  it("returns a single group when everything fits", () => {
    expect(chunk([1, 2, 3], 8)).toEqual([[1, 2, 3]]);
  });

  it("splits into fixed-size groups and keeps the order", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("leaves the last group short rather than padding it", () => {
    const groups = chunk([1, 2, 3, 4, 5, 6, 7], 4);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveLength(4);
    expect(groups[1]).toHaveLength(3);
  });

  it("returns one empty group for no items", () => {
    expect(chunk([], 4)).toEqual([[]]);
  });

  it("treats a non-positive size as 'everything in one group'", () => {
    expect(chunk([1, 2, 3], 0)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], -2)).toEqual([[1, 2, 3]]);
  });

  it("never loses or duplicates an item", () => {
    const items = Array.from({ length: 13 }, (_, i) => i);
    expect(chunk(items, 5).flat()).toEqual(items);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    chunk(input, 2);
    expect(input).toEqual([1, 2, 3]);
  });
});
