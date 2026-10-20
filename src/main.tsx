import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/dark.css";
import App from "./App.tsx";
import { initSounds } from "./utils/sound";
import { initAnalytics } from "./utils/analytics";

function Root() {
  useEffect(() => {
    initSounds();
    initAnalytics();
  }, []);
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
