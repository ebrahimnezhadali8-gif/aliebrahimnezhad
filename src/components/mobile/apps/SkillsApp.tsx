import { useEffect, useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import Icon from "../../../icons/Icon";
import { siteConfig } from "../../../config/siteConfig";
import "./SkillsApp.css";

interface SkillsAppProps {
  onBack: () => void;
}

function SkillsApp({ onBack }: SkillsAppProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <AppScreen title="Skills" onBack={onBack}>
      <div className="skills-app">
        {siteConfig.skills.map((skill) => (
          <div className="skills-app__row" key={skill.name}>
            <div className="skills-app__head">
              <span className="skills-app__icon">
                <Icon name={skill.icon} />
              </span>
              <span className="skills-app__name">{skill.name}</span>
              <span className="skills-app__pct">{skill.pct}%</span>
            </div>
            <div className="skills-app__track">
              <div
                className="skills-app__fill"
                style={{ width: animate ? `${skill.pct}%` : "0%" }}
                data-testid={`mobile-skill-fill-${skill.name}`}
              />
            </div>
          </div>
        ))}
      </div>
    </AppScreen>
  );
}

export default SkillsApp;
