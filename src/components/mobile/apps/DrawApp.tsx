import AppScreen from "../AppScreen/AppScreen";
import PaintCanvas from "../../PaintWindow/PaintCanvas";
import { useContent } from "../../../hooks/useContent";

/** A finger-painting pad (the phone's take on Paint) with save-to-PNG and "send to Ali". */
function DrawApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  return (
    <AppScreen title={t("drawApp")} onBack={onBack} noPadding>
      <PaintCanvas width={640} height={640} fluid />
    </AppScreen>
  );
}

export default DrawApp;
