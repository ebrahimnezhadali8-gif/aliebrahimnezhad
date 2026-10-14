import type { Project } from "../../types";
import { projectDomain } from "../../config/siteConfig";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="project-modal-backdrop"
      data-testid="project-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="project-modal" role="dialog" aria-label={project.title}>
        <div className="project-modal__head">
          <div className="project-modal__head-text">
            {project.logo && (
              <span className="project-modal__logo">
                <img src={project.logo} alt={`${project.title} logo`} />
              </span>
            )}
            <span className="project-modal__head-labels">
              <b>{project.title}</b>
              <span className="project-modal__year">{project.year}</span>
            </span>
          </div>
          <button
            type="button"
            className="project-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            &#10005;
          </button>
        </div>
        <div className="project-modal__body">
          <p className="project-modal__tagline">{project.tagline}</p>
          {project.desc.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}

          <h4 className="project-modal__section">Highlights</h4>
          <ul className="project-modal__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight.slice(0, 32)}>{highlight}</li>
            ))}
          </ul>

          <h4 className="project-modal__section">Built with</h4>
          <div className="project-modal__tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <a
            className="project-modal__link"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.linkLabel} ↗
          </a>
          <span className="project-modal__domain">{projectDomain(project.link)}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
