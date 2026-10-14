import { useMemo, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { siteConfig } from "../../../config/siteConfig";
import {
  MAILTO_SAFE_LIMIT,
  buildMailtoHref,
  previewLine,
  summarizeDraft,
  validateDraft,
  type MailDraft,
} from "./mailto";
import "./MailApp.css";

interface MailAppProps {
  onBack: () => void;
}

type DraftProblemField = "recipient" | "from" | "subject" | "body";

const EMPTY_DRAFT: MailDraft = { to: siteConfig.email, from: "", subject: "", body: "" };

/**
 * A genuinely sendable compose sheet.
 *
 * There is no backend, so "Send" hands a fully-formed `mailto:` to the visitor's
 * own mail app — the message really does arrive, with their name, subject and
 * body pre-filled. The form validates first, blocks oversized drafts that mail
 * clients would truncate, and says plainly what happens after sending.
 */
function MailApp({ onBack }: MailAppProps) {
  const [draft, setDraft] = useState<MailDraft>(EMPTY_DRAFT);
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const problems = useMemo(() => validateDraft(draft), [draft]);
  const href = useMemo(() => buildMailtoHref(draft), [draft]);
  const tooLong = problems.some((problem) => problem.message.includes("too long"));

  const update = (field: keyof MailDraft) => (value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSent(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard?.writeText(siteConfig.email);
      setCopied(true);
    } catch {
      // Clipboard blocked (http / older browser) — the address is still
      // selectable on screen, so there is nothing else to recover from.
      setCopied(false);
    }
  };

  const errorFor = (field: DraftProblemField) =>
    showErrors ? problems.find((problem) => problem.field === field)?.message : undefined;

  return (
    <AppScreen title="Mail" onBack={onBack}>
      <form
        className="mail-app"
        data-testid="mail-compose"
        noValidate
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mail-app__recipient">
          <span className="mail-app__recipient-label">To</span>
          <a className="mail-app__recipient-addr" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <button
            type="button"
            className="mail-app__copy"
            onClick={copyAddress}
            data-testid="mail-copy-address"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <label className="mail-app__row">
          <span className="mail-app__label">From</span>
          <input
            className="mail-app__input"
            value={draft.from}
            onChange={(e) => update("from")(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="name"
          />
        </label>

        <label className="mail-app__row">
          <span className="mail-app__label">Subject</span>
          <input
            className="mail-app__input"
            value={draft.subject}
            onChange={(e) => update("subject")(e.target.value)}
            placeholder="What is this about?"
            aria-label="Subject"
          />
        </label>
        {errorFor("subject") && (
          <p className="mail-app__error" role="alert">
            {errorFor("subject")}
          </p>
        )}

        <textarea
          className="mail-app__body"
          value={draft.body}
          onChange={(e) => update("body")(e.target.value)}
          placeholder={`Write your message to ${siteConfig.name}…`}
          aria-label="Message"
          rows={10}
        />
        {errorFor("body") && (
          <p className="mail-app__error" role="alert">
            {errorFor("body")}
          </p>
        )}

        <p className="mail-app__length" data-testid="mail-length">
          {summarizeDraft(draft)}
          {tooLong && ` — keep it under ${MAILTO_SAFE_LIMIT}`}
        </p>

        <a
          className="mail-app__send"
          href={href}
          data-testid="mail-send"
          data-cuelume-press
          onClick={() => {
            setShowErrors(true);
            if (problems.length === 0) setSent(true);
          }}
        >
          Send to {siteConfig.name}
        </a>

        <p className="mail-app__note">
          {sent ? (
            <>
              Your mail app should have opened with the message ready. If nothing happened, email{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> directly.
            </>
          ) : (
            <>
              Sending opens your own mail app with everything pre-filled — nothing is stored on
              this site. Prefer writing directly?{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </>
          )}
        </p>

        {sent && draft.body.trim() && (
          <p className="mail-app__preview" data-testid="mail-preview">
            “{previewLine(draft)}”
          </p>
        )}
      </form>
    </AppScreen>
  );
}

export default MailApp;
