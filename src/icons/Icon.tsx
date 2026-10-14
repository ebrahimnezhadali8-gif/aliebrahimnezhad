import type { IconName } from "../types";
import { iconPaths } from "./iconPaths";

interface IconProps {
  name: IconName;
  className?: string;
}

/** Renders a named SVG icon. Usage: <Icon name="pdf" /> */
function Icon({ name, className = "" }: IconProps) {
  const svg = iconPaths[name];
  if (!svg) return null;
  return <span className={`icon icon-${name} ${className}`}>{svg}</span>;
}

export default Icon;
