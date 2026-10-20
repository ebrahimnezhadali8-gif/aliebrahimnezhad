import AppScreen from "../AppScreen/AppScreen";
import PhotosGallery from "../../PhotosWindow/PhotosGallery";
import { useContent } from "../../../hooks/useContent";

/** iOS Photos: one album per project, swipe and pinch inside the viewer, Share sends the project link. */
function PhotosApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();

  const share = async (photo: { caption: string; link?: string }) => {
    const url = photo.link ?? window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: photo.caption, url });
        return;
      } catch {
        /* user cancelled or sharing failed — fall through to opening the link */
      }
    }
    window.open(url, "_blank", "noopener");
  };

  return (
    <AppScreen title={t("photos")} onBack={onBack} variant="dark" noPadding>
      <PhotosGallery variant="ios" onShare={share} />
    </AppScreen>
  );
}

export default PhotosApp;
