import Window from "../Window/Window";
import PhotosGallery from "./PhotosGallery";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import { useWindowManager } from "../../context/WindowManagerContext";
import { PHOTOS_EVENT } from "./photoBus";
import { useEffect } from "react";

/** Windows Photo Viewer-style window with one album per project. */
function PhotosWindow() {
  const meta = windowMeta.photos;
  const { t } = useContent();
  const { openWindow } = useWindowManager();

  // A "View screenshots" button anywhere can ask for an album; make sure we're open.
  useEffect(() => {
    const onRequest = () => openWindow("photos");
    window.addEventListener(PHOTOS_EVENT, onRequest);
    return () => window.removeEventListener(PHOTOS_EVENT, onRequest);
  }, [openWindow]);

  return (
    <Window id="photos" title={t("photos")} icon={meta.icon} width={meta.width} height={meta.height}>
      <PhotosGallery
        onShare={(photo) => {
          if (photo.link) window.open(photo.link, "_blank", "noopener");
        }}
      />
    </Window>
  );
}

export default PhotosWindow;
