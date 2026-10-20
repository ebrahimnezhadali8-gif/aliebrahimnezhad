import { useEffect } from "react";
import Window from "../Window/Window";
import Visualizer from "./Visualizer";
import { useAmbientPlayer } from "./useAmbientPlayer";
import { formatTrackTime } from "./tracks";
import { useWindowManager } from "../../context/WindowManagerContext";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./MediaPlayerWindow.css";

/** Windows Media Player look-alike: playlist, visualizer, seek bar. Silent until you press play. */
function MediaPlayerWindow() {
  const meta = windowMeta.media;
  const { t } = useContent();
  const { openWindows } = useWindowManager();
  const player = useAmbientPlayer();
  const isOpen = Boolean(openWindows.media);

  // Closing the window ends the music.
  useEffect(() => {
    if (!isOpen) player.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Window id="media" title={t("media")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="wmp" data-testid="media-player" data-playing={player.playing}>
        <div className="wmp__main">
          <ul className="wmp__playlist" aria-label={t("playlist")}>
            {player.tracks.map((track, index) => (
              <li key={track.id}>
                <button
                  type="button"
                  className={index === player.index ? "is-current" : ""}
                  onClick={() => player.select(index)}
                  data-testid={`media-track-${track.id}`}
                >
                  <span>{track.title}</span>
                  <small>{track.artist}</small>
                </button>
              </li>
            ))}
          </ul>
          <div className="wmp__stage" style={{ background: `linear-gradient(160deg, ${player.track.colors[1]}33, #05070b 70%)` }}>
            <div className="wmp__title" data-testid="media-title">
              {player.track.title}
            </div>
            <Visualizer colors={player.track.colors} playing={player.playing} className="wmp__viz" />
          </div>
        </div>

        <div className="wmp__controls">
          <input
            className="wmp__seek"
            type="range"
            min={0}
            max={Math.floor(player.duration)}
            value={Math.floor(player.position)}
            onChange={(e) => player.seek(Number(e.target.value))}
            aria-label={t("seek")}
            data-testid="media-seek"
          />
          <div className="wmp__buttons">
            <span className="wmp__time" data-testid="media-time">
              {formatTrackTime(player.position)} / {formatTrackTime(player.duration)}
            </span>
            <button type="button" onClick={player.prev} aria-label={t("previousTrack")} data-testid="media-prev">
              ⏮
            </button>
            <button type="button" className="wmp__play" onClick={player.toggle} aria-label={player.playing ? t("pause") : t("play")} data-testid="media-toggle">
              {player.playing ? "⏸" : "▶"}
            </button>
            <button type="button" onClick={player.next} aria-label={t("nextTrack")} data-testid="media-next">
              ⏭
            </button>
            <span className="wmp__hint">{t("volumeHint")}</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

export default MediaPlayerWindow;
