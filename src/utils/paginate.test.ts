import { describe, it, expect } from "vitest";
import { paginate } from "./paginate";

describe("paginate", () => {
  it("returns a single page when everything fits", () => {
    expect(paginate([1, 2, 3], 8)).toEqual([[1, 2, 3]]);
  });

  it("splits into fixed-size pages and keeps the order", () => {
    expect(paginate([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns one empty page for no items, so the pager is never blank", () => {
    expect(paginate([], 8)).toEqual([[]]);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    paginate(input, 2);
    expect(input).toEqual([1, 2, 3]);
  });

  it("treats a non-positive page size as 'everything on one page'", () => {
    expect(paginate([1, 2, 3], 0)).toEqual([[1, 2, 3]]);
    expect(paginate([1, 2, 3], -1)).toEqual([[1, 2, 3]]);
  });

  it("never loses an item", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const flat = paginate(items, 4).flat();
    expect(flat).toEqual(items);
  });
});
