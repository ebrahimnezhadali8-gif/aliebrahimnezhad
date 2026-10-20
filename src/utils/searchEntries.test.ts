import { describe, it, expect } from "vitest";
import { filterEntries, type SearchEntry } from "./searchEntries";

const entries: SearchEntry[] = [
  { id: "app:notes", kind: "app", title: "Notes", icon: "notes" },
  { id: "project:workchi", kind: "project", title: "Workchi", subtitle: "Order platform", icon: "folder", keywords: ["workchi.ir"] },
  { id: "skill:react", kind: "skill", title: "React", icon: "react" },
  { id: "app:contacts", kind: "app", title: "Contacts", icon: "phone" },
];

describe("filterEntries", () => {
  it("returns nothing for an empty query", () => {
    expect(filterEntries(entries, "  ")).toEqual([]);
  });

  it("is case-insensitive and matches titles", () => {
    expect(filterEntries(entries, "NOTE").map((e) => e.id)).toEqual(["app:notes"]);
  });

  it("ranks prefix matches above substring matches", () => {
    const ids = filterEntries(entries, "co").map((e) => e.id);
    expect(ids[0]).toBe("app:contacts");
  });

  it("matches subtitles and keywords", () => {
    expect(filterEntries(entries, "order").map((e) => e.id)).toEqual(["project:workchi"]);
    expect(filterEntries(entries, "workchi.ir").map((e) => e.id)).toEqual(["project:workchi"]);
  });

  it("respects the limit", () => {
    expect(filterEntries(entries, "o", 2)).toHaveLength(2);
  });
});
