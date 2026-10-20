import { useMemo } from "react";
import { siteConfig } from "../config/siteConfig";
import { useContent } from "./useContent";
import type { Photo } from "../components/PhotosWindow/PhotoViewer";

export interface PhotoAlbum {
  id: string;
  title: string;
  photos: Photo[];
}

/** One album per project, in the active language; projects without screenshots are skipped. */
export function usePhotoAlbums(): PhotoAlbum[] {
  const { content } = useContent();
  return useMemo(
    () =>
      content.projects
        .filter((project) => (siteConfig.gallery[project.id] ?? []).length > 0)
        .map((project) => ({
          id: project.id,
          title: project.title,
          photos: (siteConfig.gallery[project.id] ?? []).map((src, index) => ({
            src,
            caption: `${project.title} — ${index + 1}`,
            link: project.link,
          })),
        })),
    [content.projects]
  );
}
