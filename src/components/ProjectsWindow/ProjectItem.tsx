import type { Project } from "../../types";
import { projectDomain } from "../../config/siteConfig";

interface ProjectItemProps {
  project: Project;
  onOpen: (project: Project) => void;
}

function ProjectItem({ project, onOpen }: ProjectItemProps) {
  return (
    <button
      type="button"
      className="project-item"
      data-testid={`project-item-${project.id}`}
      data-cuelume-press
      onClick={() => onOpen(project)}
    >
      <span className="project-item__logo">
        {project.logo ? (
          <img src={project.logo} alt={`${project.title} logo`} loading="lazy" />
        ) : (
          <span className="project-item__logo-fallback" aria-hidden="true" />
        )}
      </span>
      <span className="project-item__label">{project.title}</span>
      <span className="project-item__sub">{projectDomain(project.link)}</span>
    </button>
  );
}

export default ProjectItem;
