/**
 * `mailto:` is the only way to hand a message to the visitor's real mail app
 * without running a backend, so getting the encoding right matters: an
 * unescaped `&`, `#` or newline silently truncates the draft.
 */

export interface MailDraft {
  /** Recipient — always the site owner's address. */
  to: string;
  /** Sender's own name, so the owner knows who wrote. */
  from: string;
  subject: string;
  body: string;
}

/**
 * Mail clients cap `mailto:` URLs at wildly different lengths (some near 2 KB).
 * We stay well under the most restrictive and warn the visitor instead of
 * silently losing the end of their message.
 */
export const MAILTO_SAFE_LIMIT = 1800;

export interface DraftProblem {
  field: keyof MailDraft | "recipient";
  message: string;
}

/** True when the address looks like a real email address. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());
}

/**
 * Builds the `mailto:` href. Values are percent-encoded so punctuation in the
 * subject or body can never break out of the query string.
 */
export function buildMailtoHref({ to, from, subject, body }: MailDraft): string {
  const params = new URLSearchParams();
  if (from.trim()) params.set("from", from.trim());
  if (subject.trim()) params.set("subject", subject.trim());
  if (body.trim()) params.set("body", body);
  return `mailto:${to.trim()}${params.toString() ? `?${params.toString()}` : ""}`;
}

/**
 * Everything that would make the send fail or arrive useless. An empty array
 * means the draft is good to go.
 */
export function validateDraft(draft: MailDraft): DraftProblem[] {
  const problems: DraftProblem[] = [];

  if (!draft.to.trim()) {
    problems.push({ field: "recipient", message: "No recipient address is configured." });
  } else if (!isValidEmail(draft.to)) {
    problems.push({ field: "recipient", message: "The configured recipient address looks invalid." });
  }

  if (!draft.body.trim()) {
    problems.push({ field: "body", message: "Write a message before sending." });
  }

  if (!draft.subject.trim()) {
    problems.push({ field: "subject", message: "Add a subject so the message is easy to spot." });
  }

  if (buildMailtoHref(draft).length > MAILTO_SAFE_LIMIT) {
    problems.push({
      field: "body",
      message: `This draft is too long for a mail link (max ~${MAILTO_SAFE_LIMIT} characters). Shorten it or email ${draft.to} directly.`,
    });
  }

  return problems;
}

/** Human-readable character count, so the visitor can see the link getting long. */
export function summarizeDraft(draft: MailDraft): string {
  const href = buildMailtoHref(draft);
  return `${href.length} characters in the mail link`;
}

/** A one-line preview of the message, e.g. for the "sent" confirmation. */
export function previewLine(draft: MailDraft): string {
  const firstLine = draft.body.trim().split("\n").find((line) => line.trim().length > 0) ?? "";
  return firstLine.length > 64 ? `${firstLine.slice(0, 61)}…` : firstLine;
}
