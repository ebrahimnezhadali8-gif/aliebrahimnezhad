import Window from "../Window/Window";
import PaintCanvas from "./PaintCanvas";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";

/** Windows Paint: draw something and send it to the site owner. */
function PaintWindow() {
  const meta = windowMeta.paint;
  const { t } = useContent();

  return (
    <Window id="paint" title={t("paint")} icon={meta.icon} width={meta.width} height={meta.height}>
      <PaintCanvas />
    </Window>
  );
}

export default PaintWindow;
