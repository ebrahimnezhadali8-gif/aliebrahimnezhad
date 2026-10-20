import { useEffect, useState } from "react";
import PhotoViewer, { type Photo } from "./PhotoViewer";
import { usePhotoAlbums } from "../../hooks/usePhotoAlbums";
import { useContent } from "../../hooks/useContent";
import { PHOTOS_EVENT, takePendingAlbum } from "./photoBus";
import "./PhotosGallery.css";

interface PhotosGalleryProps {
  /** Mobile uses the OS share sheet; the desktop copies/opens the project link. */
  onShare?: (photo: Photo) => void;
  /** "grid" = Windows Explorer-style thumbnails; "ios" = square iOS Photos grid. */
  variant?: "windows" | "ios";
}

/** Album picker + thumbnail grid + full-screen viewer, shared by the desktop and phone Photos apps. */
function PhotosGallery({ onShare, variant = "windows" }: PhotosGalleryProps) {
  const { t } = useContent();
  const albums = usePhotoAlbums();
  const [albumId, setAlbumId] = useState<string | null>(() => takePendingAlbum());
  const [viewing, setViewing] = useState<number | null>(null);

  // "View screenshots" buttons elsewhere ask for a specific album, even while open.
  useEffect(() => {
    const onRequest = () => {
      const requested = takePendingAlbum();
      if (requested) {
        setAlbumId(requested);
        setViewing(null);
      }
    };
    window.addEventListener(PHOTOS_EVENT, onRequest);
    return () => window.removeEventListener(PHOTOS_EVENT, onRequest);
  }, []);

  const album = albums.find((candidate) => candidate.id === albumId) ?? null;

  if (!album) {
    return (
      <div className={`photos photos--${variant}`} data-testid="photos-albums">
        <div className="photos__albums">
          {albums.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              className="photos__album"
              onClick={() => setAlbumId(candidate.id)}
              data-testid={`album-${candidate.id}`}
            >
              <img src={candidate.photos[0].src} alt="" loading="lazy" />
              <span className="photos__album-name">{candidate.title}</span>
              <span className="photos__album-count">{candidate.photos.length}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`photos photos--${variant}`} data-testid="photos-grid">
      <div className="photos__head">
        <button type="button" onClick={() => setAlbumId(null)} data-testid="photos-back">
          ← {t("albums")}
        </button>
        <strong>{album.title}</strong>
      </div>
      <div className="photos__thumbs">
        {album.photos.map((photo, index) => (
          <button key={photo.src} type="button" className="photos__thumb" onClick={() => setViewing(index)} data-testid={`photo-${index}`}>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
          </button>
        ))}
      </div>
      {viewing !== null && (
        <PhotoViewer
          photos={album.photos}
          index={viewing}
          onIndex={setViewing}
          onClose={() => setViewing(null)}
          onShare={onShare}
        />
      )}
    </div>
  );
}

export default PhotosGallery;
