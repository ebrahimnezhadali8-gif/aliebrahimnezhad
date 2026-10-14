import { useEffect, useRef, useState } from "react";
import Icon from "../../icons/Icon";
import type { IconName } from "../../types";

interface SkillBarProps {
  name: string;
  pct: number;
  icon: IconName;
}

function SkillBar({ name, pct, icon }: SkillBarProps) {
  const [width, setWidth] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(timeoutRef.current);
  }, [pct]);

  return (
    <div className="skill-bar">
      <div className="skill-bar__head">
        <span className="skill-bar__icon">
          <Icon name={icon} />
        </span>
        <span className="skill-bar__name">{name}</span>
        <span className="skill-bar__pct">{pct}%</span>
      </div>
      <div className="skill-bar__track">
        <div className="skill-bar__fill" style={{ width: `${width}%` }} data-testid={`skill-fill-${name}`} />
      </div>
    </div>
  );
}

export default SkillBar;
