import Window from "../Window/Window";
import MinesweeperGame from "./MinesweeperGame";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./MinesweeperWindow.css";

function MinesweeperWindow() {
  const meta = windowMeta.minesweeper;
  const { t } = useContent();

  return (
    <Window id="minesweeper" title={t("minesweeper")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="minesweeper-window">
        <MinesweeperGame />
      </div>
    </Window>
  );
}

export default MinesweeperWindow;
