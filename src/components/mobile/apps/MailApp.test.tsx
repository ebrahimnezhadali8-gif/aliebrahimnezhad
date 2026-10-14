import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MailApp from "./MailApp";
import { siteConfig } from "../../../config/siteConfig";
import { MAILTO_SAFE_LIMIT } from "./mailto";

function fillDraft({ from, subject, body }: { from?: string; subject?: string; body?: string }) {
  if (from !== undefined) fireEvent.change(screen.getByLabelText("Your name"), { target: { value: from } });
  if (subject !== undefined) fireEvent.change(screen.getByLabelText("Subject"), { target: { value: subject } });
  if (body !== undefined) fireEvent.change(screen.getByLabelText("Message"), { target: { value: body } });
}

function sendHref() {
  return screen.getByTestId("mail-send").getAttribute("href") ?? "";
}

describe("MailApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("always addresses the mail to the site owner's real address", () => {
    render(<MailApp onBack={() => {}} />);
    const recipient = screen.getByText(siteConfig.email, { selector: ".mail-app__recipient-addr" });
    expect(recipient).toHaveAttribute("href", `mailto:${siteConfig.email}`);
  });

  it("is a real, actionable mail link — not just a mock of one", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ from: "Sara", subject: "Hello", body: "I would like to hire you." });

    const send = screen.getByTestId("mail-send");
    expect(send.tagName).toBe("A");
    expect(send).toHaveAttribute("href");
    expect(send).not.toHaveAttribute("href", "#");

    const href = sendHref();
    expect(href.startsWith(`mailto:${siteConfig.email}?`)).toBe(true);

    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("from")).toBe("Sara");
    expect(params.get("subject")).toBe("Hello");
    expect(params.get("body")).toBe("I would like to hire you.");
  });

  it("updates the mail link live as the visitor types", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ body: "First" });
    expect(sendHref()).toContain("body=First");

    fillDraft({ body: "Second" });
    expect(sendHref()).toContain("body=Second");
    expect(sendHref()).not.toContain("body=First");
  });

  it("encodes newlines and punctuation so the message survives the mail link", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ subject: "Rate & terms", body: "Line 1\nLine 2 #now" });

    const href = sendHref();
    expect(href).toContain("%26");
    expect(href).toContain("%0A");
    expect(href).toContain("%23");
    expect(href.split("#")).toHaveLength(1);
  });

  it("keeps the draft in one piece and reports how long the link gets", () => {
    render(<MailApp onBack={() => {}} />);
    expect(screen.getByTestId("mail-length")).toHaveTextContent(/characters in the mail link/);

    fillDraft({ body: "x".repeat(500) });
    const lengthText = screen.getByTestId("mail-length").textContent ?? "";
    expect(Number.parseInt(lengthText, 10)).toBeGreaterThan(500);
  });

  it("shows no validation errors before the visitor tries to send", () => {
    render(<MailApp onBack={() => {}} />);
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("explains what is missing when an empty draft is sent", () => {
    render(<MailApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("mail-send"));

    const alerts = screen.getAllByRole("alert").map((node) => node.textContent ?? "");
    expect(alerts.some((text) => /write a message/i.test(text))).toBe(true);
    expect(alerts.some((text) => /subject/i.test(text))).toBe(true);
    // Nothing was "sent", so no confirmation is shown.
    expect(screen.queryByTestId("mail-preview")).not.toBeInTheDocument();
  });

  it("refuses to pretend a too-long draft was sent", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ subject: "Long", body: "x".repeat(MAILTO_SAFE_LIMIT) });
    fireEvent.click(screen.getByTestId("mail-send"));

    expect(screen.getAllByRole("alert").some((n) => /too long/i.test(n.textContent ?? ""))).toBe(true);
    expect(screen.queryByTestId("mail-preview")).not.toBeInTheDocument();
  });

  it("confirms a successful send and previews the first line", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ from: "Sara", subject: "Hello", body: "I would like to hire you.\nSent from my phone." });
    fireEvent.click(screen.getByTestId("mail-send"));

    expect(screen.getByTestId("mail-preview")).toHaveTextContent("I would like to hire you.");
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("clears the confirmation once the draft is edited again", () => {
    render(<MailApp onBack={() => {}} />);
    fillDraft({ subject: "Hello", body: "Hi there." });
    fireEvent.click(screen.getByTestId("mail-send"));
    expect(screen.getByTestId("mail-preview")).toBeInTheDocument();

    fillDraft({ body: "Hi there again." });
    expect(screen.queryByTestId("mail-preview")).not.toBeInTheDocument();
  });

  it("explains up front that nothing is stored on the site", () => {
    render(<MailApp onBack={() => {}} />);
    expect(screen.getByText(/nothing is stored on this site/i)).toBeInTheDocument();
  });

  it("copies the owner address to the clipboard when asked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<MailApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("mail-copy-address"));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(siteConfig.email));
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("does not throw when the clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) },
      configurable: true,
    });

    render(<MailApp onBack={() => {}} />);
    fireEvent.click(screen.getByTestId("mail-copy-address"));
    expect(screen.getByTestId("mail-copy-address")).toBeInTheDocument();
  });

  it("goes back to the home screen when Back is used", () => {
    const onBack = vi.fn();
    render(<MailApp onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
