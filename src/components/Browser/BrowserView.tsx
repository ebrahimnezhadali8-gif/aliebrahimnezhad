import { useState } from "react";
import { useContent } from "../../hooks/useContent";
import { projectDomain } from "../../config/siteConfig";
import "./BrowserView.css";

export interface BrowserTarget {
  id: string;
  title: string;
  /** Bare origin, e.g. "https://workchi.ir". */
  url: string;
  logo?: string;
}

interface BrowserViewProps {
  /** `ie` gives the Windows Internet Explorer chrome, `safari` the iOS one. */
  flavour: "ie" | "safari";
  /** Rendered inside the test id `browser-frame`. */
  testId?: string;
}

/**
 * A real in-OS browser showing each portfolio project live.
 *
 * `iframe` embedding is best-effort by nature: most production sites send
 * `X-Frame-Options: DENY`, so the frame legitimately stays blank. Rather than
 * pretend, the chrome always offers an "open in a real tab" escape hatch plus a
 * short explanation, which is what a thoughtful implementation would do anyway.
 */
function BrowserView({ flavour, testId }: BrowserViewProps) {
  const { content } = useContent();
  const [activeId, setActiveId] = useState(content.projects[0]?.id ?? "");
  const [reloadKey, setReloadKey] = useState(0);

  const active = content.projects.find((project) => project.id === activeId) ?? content.projects[0];
  if (!active) return null;

  const openExternally = () => window.open(active.link, "_blank", "noopener");

  return (
    <div className={`browser browser--${flavour}`} data-testid={testId}>
      <div className="browser__chrome">
        <div className="browser__addressbar">
          <button
            type="button"
            className="browser__nav"
            aria-label={flavour === "safari" ? "Back" : "Go back"}
            onClick={() => setActiveId(content.projects[0]?.id ?? activeId)}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="browser__nav"
            aria-label={flavour === "safari" ? "Forward" : "Go forward"}
            onClick={() => setActiveId(content.projects[content.projects.length - 1]?.id ?? activeId)}
          >
            &#8250;
          </button>
          <span className="browser__url" data-testid="browser-url">
            <span className="browser__url-icon" aria-hidden="true" />
            {projectDomain(active.link)}
          </span>
          <button
            type="button"
            className="browser__nav"
            aria-label="Reload"
            data-testid="browser-reload"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            &#8635;
          </button>
        </div>

        <div className="browser__favorites" role="tablist" aria-label="Favorites">
          {content.projects.map((project) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={project.id === active.id}
              className={`browser__fav ${project.id === active.id ? "browser__fav--active" : ""}`}
              onClick={() => setActiveId(project.id)}
              title={project.tagline}
              data-testid={`browser-fav-${project.id}`}
            >
              {project.logo && (
                <img src={project.logo} alt="" aria-hidden="true" className="browser__fav-logo" />
              )}
              <span className="browser__fav-label">{project.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="browser__stage">
        <iframe
          key={`${active.id}-${reloadKey}`}
          className="browser__frame"
          src={active.link}
          title={`${active.title} preview`}
          data-testid="browser-frame"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        />
        <div className="browser__hint" data-testid="browser-hint">
          <span>{active.title} — {active.tagline}</span>
          <button
            type="button"
            className="browser__external"
            onClick={openExternally}
            data-testid="browser-open-external"
          >
            Open in browser ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrowserView;