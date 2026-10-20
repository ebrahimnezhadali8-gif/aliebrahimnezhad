import AppScreen from "../AppScreen/AppScreen";
import MinesweeperGame from "../../MinesweeperWindow/MinesweeperGame";
import { useContent } from "../../../hooks/useContent";

/** Touch Minesweeper: tap to open, long-press (or the flag toggle) to flag. Beginner and Intermediate fit a phone. */
function MinesApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  return (
    <AppScreen title={t("minesweeper")} onBack={onBack} variant="dark">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <MinesweeperGame levels={["beginner", "intermediate"]} cellSize={17} />
      </div>
    </AppScreen>
  );
}

export default MinesApp;
