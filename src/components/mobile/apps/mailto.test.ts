import { describe, it, expect } from "vitest";
import {
  MAILTO_SAFE_LIMIT,
  buildMailtoHref,
  isValidEmail,
  previewLine,
  summarizeDraft,
  validateDraft,
  type MailDraft,
} from "./mailto";

const draft = (overrides: Partial<MailDraft> = {}): MailDraft => ({
  to: "owner@site.com",
  from: "Sara",
  subject: "Project enquiry",
  body: "Hi, I found your portfolio.",
  ...overrides,
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("ali@example.com")).toBe(true);
    expect(isValidEmail("  ali@example.co.uk  ")).toBe(true);
  });

  it("rejects things that are not addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("ali")).toBe(false);
    expect(isValidEmail("ali@")).toBe(false);
    expect(isValidEmail("ali@example")).toBe(false);
    expect(isValidEmail("ali example@test.com")).toBe(false);
  });
});

describe("buildMailtoHref", () => {
  it("points at the recipient and includes every field that was filled in", () => {
    const href = buildMailtoHref(draft());
    expect(href.startsWith("mailto:owner@site.com?")).toBe(true);
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("from")).toBe("Sara");
    expect(params.get("subject")).toBe("Project enquiry");
    expect(params.get("body")).toBe("Hi, I found your portfolio.");
  });

  it("produces a bare mailto: link when nothing else was typed", () => {
    expect(buildMailtoHref(draft({ from: "", subject: "", body: "" }))).toBe("mailto:owner@site.com");
  });

  it("omits individual params that are blank", () => {
    const href = buildMailtoHref(draft({ from: "", subject: "", body: "" }));
    expect(href).not.toContain("?");
  });

  it("percent-encodes punctuation so it cannot break out of the query string", () => {
    const href = buildMailtoHref(
      draft({ subject: "Q1 & Q2 = urgent?", body: "line one\nline two #hash" })
    );
    expect(href).toContain("subject=Q1+%26+Q2+%3D+urgent%3F");
    expect(href).toContain("body=line+one%0Aline+two+%23hash");
    // A raw '#' would silently truncate the URL in a browser.
    expect(href.split("#")).toHaveLength(1);
  });

  it("trims the recipient and the sender name", () => {
    const href = buildMailtoHref(draft({ to: "  owner@site.com ", from: "  Sara  " }));
    expect(href).toBe(
      "mailto:owner@site.com?from=Sara&subject=Project+enquiry&body=Hi%2C+I+found+your+portfolio."
    );
  });
});

describe("validateDraft", () => {
  it("passes a complete draft", () => {
    expect(validateDraft(draft())).toEqual([]);
  });

  it("requires a message body", () => {
    const problems = validateDraft(draft({ body: "   " }));
    expect(problems).toContainEqual({ field: "body", message: "Write a message before sending." });
  });

  it("requires a subject", () => {
    const problems = validateDraft(draft({ subject: "" }));
    expect(problems.some((p) => p.field === "subject")).toBe(true);
  });

  it("flags a missing or malformed recipient address", () => {
    expect(validateDraft(draft({ to: "" })).some((p) => p.field === "recipient")).toBe(true);
    expect(validateDraft(draft({ to: "nope" })).some((p) => p.field === "recipient")).toBe(true);
  });

  it("does not require the sender's name — mail clients fill that in", () => {
    expect(validateDraft(draft({ from: "" }))).toEqual([]);
  });

  it("blocks drafts too long for a mail link instead of letting them truncate", () => {
    const problems = validateDraft(draft({ body: "x".repeat(MAILTO_SAFE_LIMIT) }));
    const tooLong = problems.find((p) => p.message.includes("too long"));
    expect(tooLong).toBeDefined();
    expect(tooLong?.message).toContain("owner@site.com");
  });

  it("accepts a draft that is just under the limit", () => {
    const problems = validateDraft(draft({ body: "x".repeat(1000) }));
    expect(problems.some((p) => p.message.includes("too long"))).toBe(false);
  });
});

describe("summarizeDraft", () => {
  it("reports the length of the generated link", () => {
    const summary = summarizeDraft(draft());
    expect(summary).toBe(`${buildMailtoHref(draft()).length} characters in the mail link`);
  });
});

describe("previewLine", () => {
  it("uses the first non-blank line", () => {
    expect(previewLine(draft({ body: "\n\nHello there\nmore" }))).toBe("Hello there");
  });

  it("truncates a very long first line", () => {
    const preview = previewLine(draft({ body: "y".repeat(200) }));
    expect(preview).toHaveLength(62);
    expect(preview.endsWith("…")).toBe(true);
  });

  it("returns an empty string when there is no content", () => {
    expect(previewLine(draft({ body: "  \n " }))).toBe("");
  });
});
