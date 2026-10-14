import Window from "../Window/Window";
import BrowserView from "../Browser/BrowserView";
import { useContent } from "../../hooks/useContent";

/**
 * Internet Explorer on the Windows desktop, showing the portfolio's projects
 * live so an employer can click through the real product without ever leaving
 * the OS skin.
 */
function IEWindow() {
  const { t } = useContent();

  return (
    <Window id="ie" title={t("browser")} icon="ie" width={920} height={620}>
      <BrowserView flavour="ie" testId="ie-browser" />
    </Window>
  );
}

export default IEWindow;