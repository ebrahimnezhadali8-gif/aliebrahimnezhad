import Icon from "../../icons/Icon";
import type { IconName } from "../../types";

interface TaskbarAppProps {
  id: string;
  title: string;
  icon: IconName;
  active: boolean;
  minimized: boolean;
  onClick: (id: string) => void;
}

function TaskbarApp({ id, title, icon, active, minimized, onClick }: TaskbarAppProps) {
  return (
    <button
      type="button"
      className={`taskbar-app ${active ? "taskbar-app--active" : ""} ${minimized ? "taskbar-app--minimized" : ""}`}
      onClick={() => onClick(id)}
      data-cuelume-press
    >
      <span className="taskbar-app__icon">
        <Icon name={icon} />
      </span>
      <span className="taskbar-app__label">{title}</span>
    </button>
  );
}

export default TaskbarApp;
