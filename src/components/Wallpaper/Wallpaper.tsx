// src/components/Wallpaper/Wallpaper.tsx
import "./Wallpaper.css";

interface WallpaperProps {
  image: string;
}

function Wallpaper({ image }: WallpaperProps) {
  return (
    <div
      className="wallpaper"
      data-testid="wallpaper"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
}

export default Wallpaper;