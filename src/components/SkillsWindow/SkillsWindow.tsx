import Window from "../Window/Window";
import SkillBar from "./SkillBar";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./SkillsWindow.css";

function SkillsWindow() {
  const meta = windowMeta.skills;
  const { content, t } = useContent();

  return (
    <Window id="skills" title={t("skills")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="skills-window">
        {content.skills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} pct={skill.pct} icon={skill.icon} />
        ))}
      </div>
    </Window>
  );
}

export default SkillsWindow;