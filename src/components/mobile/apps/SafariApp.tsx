import AppScreen from "../AppScreen/AppScreen";
import BrowserView from "../../Browser/BrowserView";
import "./SafariApp.css";

/** Mobile Safari, showing each portfolio project live inside the phone skin. */
function SafariApp({ onBack }: { onBack: () => void }) {
  return (
    <AppScreen title="Safari" onBack={onBack} noPadding>
      <BrowserView flavour="safari" testId="safari-browser" />
    </AppScreen>
  );
}

export default SafariApp;