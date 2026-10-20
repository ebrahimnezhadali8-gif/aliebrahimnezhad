import { useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { requestAlbum } from "../../PhotosWindow/photoBus";
import { projectDomain, siteConfig } from "../../../config/siteConfig";
import type { Project } from "../../../types";
import Icon from "../../../icons/Icon";
import { useContent } from "../../../hooks/useContent";
import "./ProjectsApp.css";

interface ProjectsAppProps {
  onBack: () => void;
  /** Opens the Photos app (the album has already been requested). */
  onOpenPhotos?: () => void;
}

function ProjectsApp({ onBack, onOpenPhotos }: ProjectsAppProps) {
  const { content, t } = useContent();
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <AppScreen title={selected.title} onBack={() => setSelected(null)}>
        <div className="projects-app__detail">
          {selected.logo && (
            <img
              className="projects-app__detail-logo"
              src={selected.logo}
              alt={`${selected.title} logo`}
            />
          )}
          <p className="projects-app__tagline">{selected.tagline}</p>
          {selected.desc.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="projects-app__desc">
              {paragraph}
            </p>
          ))}

          <div className="projects-app__section-label">{t("highlights")}</div>
          <ul className="projects-app__highlights">
            {selected.highlights.map((highlight) => (
              <li key={highlight.slice(0, 32)}>{highlight}</li>
            ))}
          </ul>

          <div className="projects-app__section-label">{t("builtWith")}</div>
          <div className="projects-app__tags">
            {selected.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <a
            className="projects-app__link-btn"
            href={selected.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {selected.linkLabel}
          </a>
          {onOpenPhotos && siteConfig.gallery[selected.id]?.length > 0 && (
            <button
              type="button"
              className="projects-app__shots-btn"
              onClick={() => {
                requestAlbum(selected.id);
                onOpenPhotos();
              }}
              data-testid="project-view-screenshots"
            >
              {t("viewScreenshots")}
            </button>
          )}
          <span className="projects-app__domain">{projectDomain(selected.link)}</span>
        </div>
      </AppScreen>
    );
  }

  return (
    <AppScreen title={t("projectsApp")} onBack={onBack}>
      <div className="projects-app__list">
        {content.projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="projects-app__row"
            data-testid={`mobile-project-${project.id}`}
            onClick={() => setSelected(project)}
            data-cuelume-press
          >
            <span className="projects-app__row-icon">
              {project.logo ? (
                <img src={project.logo} alt={`${project.title} logo`} loading="lazy" />
              ) : (
                <Icon name="folderSmall" />
              )}
            </span>
            <span className="projects-app__row-text">
              <span className="projects-app__row-title">{project.title}</span>
              <span className="projects-app__row-sub">{project.tagline}</span>
            </span>
            <span className="projects-app__chevron" aria-hidden="true">
              &#8250;
            </span>
          </button>
        ))}
      </div>
    </AppScreen>
  );
}

export default ProjectsApp;