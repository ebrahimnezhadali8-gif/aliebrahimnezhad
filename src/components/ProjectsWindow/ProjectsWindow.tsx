import { useState } from "react";
import Window from "../Window/Window";
import ProjectItem from "./ProjectItem";
import ProjectModal from "./ProjectModal";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import type { Project } from "../../types";
import "./ProjectsWindow.css";

function ProjectsWindow() {
  const meta = windowMeta.projects;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <Window id="projects" title={meta.title} icon={meta.icon} width={meta.width} height={meta.height}>
        <div className="projects-window">
          <div className="projects-window__sidebar">
            <div className="projects-window__sec-title">Favorites</div>
            <div className="projects-window__sec-item projects-window__sec-item--active">
              📁 projects
            </div>
            <div className="projects-window__sec-title">Libraries</div>
            <div className="projects-window__sec-item">🖥 Desktop</div>
            <div className="projects-window__sec-item">📄 Documents</div>
          </div>
          <div className="projects-window__main">
            <div className="projects-window__grid" data-testid="projects-grid">
              {siteConfig.projects.map((project) => (
                <ProjectItem key={project.id} project={project} onOpen={setSelectedProject} />
              ))}
            </div>
          </div>
        </div>
      </Window>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

export default ProjectsWindow;
