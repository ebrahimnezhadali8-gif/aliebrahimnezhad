import { useState } from "react";
import Window from "../Window/Window";
import ProjectItem from "./ProjectItem";
import ProjectModal from "./ProjectModal";
import { requestAlbum } from "../PhotosWindow/photoBus";
import { windowMeta } from "../../config/siteConfig";
import type { Project } from "../../types";
import { useContent } from "../../hooks/useContent";
import "./ProjectsWindow.css";

function ProjectsWindow() {
  const meta = windowMeta.projects;
  const { content, t } = useContent();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <Window id="projects" title={t("projects")} icon={meta.icon} width={meta.width} height={meta.height}>
        <div className="projects-window">
          <div className="projects-window__sidebar">
            <div className="projects-window__sec-title">{t("favorites")}</div>
            <div className="projects-window__sec-item projects-window__sec-item--active">
              📁 {t("projects")}
            </div>
            <div className="projects-window__sec-title">{t("address")}</div>
            <div className="projects-window__sec-item">🖥 {t("home")}</div>
          </div>
          <div className="projects-window__main">
            <div className="projects-window__grid" data-testid="projects-grid">
              {content.projects.map((project) => (
                <ProjectItem key={project.id} project={project} onOpen={setSelectedProject} />
              ))}
            </div>
          </div>
        </div>
      </Window>
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        headings={{ highlights: t("highlights"), builtWith: t("builtWith") }}
        screenshotsLabel={t("viewScreenshots")}
        onViewScreenshots={(project) => {
          setSelectedProject(null);
          requestAlbum(project.id);
        }}
      />
    </>
  );
}

export default ProjectsWindow;