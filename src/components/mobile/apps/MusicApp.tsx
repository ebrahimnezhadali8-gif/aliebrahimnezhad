import { useEffect } from "react";
import AppScreen from "../AppScreen/AppScreen";
import Visualizer from "../../MediaPlayerWindow/Visualizer";
import { useAmbientPlayer } from "../../MediaPlayerWindow/useAmbientPlayer";
import { formatTrackTime } from "../../MediaPlayerWindow/tracks";
import { ambientPlayer } from "../../MediaPlayerWindow/ambientPlayer";
import { useContent } from "../../../hooks/useContent";
import "./MusicApp.css";

/** iPod-style Music app over the same generative playlist as the desktop player. */
function MusicApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  const player = useAmbientPlayer();

  // Leaving the app (Back, home indicator, …) ends playback, like closing the desktop player.
  useEffect(() => () => ambientPlayer.stop(), []);

  return (
    <AppScreen title={t("musicApp")} onBack={onBack} variant="dark">
      <div className="music-app" data-testid="mobile-music" data-playing={player.playing}>
        <div
          className={`music-app__art ${player.playing ? "is-playing" : ""}`}
          style={{ background: `linear-gradient(145deg, ${player.track.colors[0]}, ${player.track.colors[1]})` }}
        >
          <Visualizer colors={["#ffffff", "#ffffffaa"]} playing={player.playing} className="music-app__viz" />
        </div>

        <div className="music-app__meta">
          <strong data-testid="music-title">{player.track.title}</strong>
          <span>{player.track.artist}</span>
        </div>

        <input
          className="music-app__seek"
          type="range"
          min={0}
          max={Math.floor(player.duration)}
          value={Math.floor(player.position)}
          onChange={(e) => player.seek(Number(e.target.value))}
          aria-label={t("seek")}
        />
        <div className="music-app__times">
          <span>{formatTrackTime(player.position)}</span>
          <span>-{formatTrackTime(player.duration - player.position)}</span>
        </div>

        <div className="music-app__controls">
          <button type="button" onClick={player.prev} aria-label={t("previousTrack")}>
            ⏮
          </button>
          <button type="button" className="music-app__play" onClick={player.toggle} aria-label={player.playing ? t("pause") : t("play")} data-testid="music-toggle">
            {player.playing ? "⏸" : "▶"}
          </button>
          <button type="button" onClick={player.next} aria-label={t("nextTrack")}>
            ⏭
          </button>
        </div>

        <ul className="music-app__list">
          {player.tracks.map((track, index) => (
            <li key={track.id}>
              <button type="button" className={index === player.index ? "is-current" : ""} onClick={() => player.select(index)}>
                <span>{track.title}</span>
                <small>{track.artist}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppScreen>
  );
}

export default MusicApp;
