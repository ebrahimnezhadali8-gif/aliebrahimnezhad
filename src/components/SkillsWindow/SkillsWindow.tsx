import Window from "../Window/Window";
import SkillBar from "./SkillBar";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import "./SkillsWindow.css";

function SkillsWindow() {
  const meta = windowMeta.skills;

  return (
    <Window id="skills" title={meta.title} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="skills-window">
        {siteConfig.skills.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} pct={skill.pct} icon={skill.icon} />
        ))}
      </div>
    </Window>
  );
}

export default SkillsWindow;
