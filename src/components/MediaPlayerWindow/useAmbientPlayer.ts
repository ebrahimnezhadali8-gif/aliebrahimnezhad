import { useCallback, useEffect, useState } from "react";
import { ambientPlayer } from "./ambientPlayer";
import { TRACKS, nextTrackIndex, prevTrackIndex, trackDuration } from "./tracks";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";

/** React binding for the shared generative player: current track, play state, position and controls. */
export function useAmbientPlayer() {
  const { volume } = useDesktopSettings();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(ambientPlayer.isPlaying);
  const [position, setPosition] = useState(ambientPlayer.position);

  // Reflect the engine's state (it may have been started by the other skin's app).
  useEffect(() => {
    const sync = () => {
      setPlaying(ambientPlayer.isPlaying);
      setPosition(ambientPlayer.position);
      const current = ambientPlayer.currentTrack;
      if (current) setIndex(Math.max(0, TRACKS.findIndex((track) => track.id === current.id)));
    };
    sync();
    return ambientPlayer.subscribe(sync);
  }, []);

  // The slider that already controls UI sounds also controls the music.
  useEffect(() => {
    ambientPlayer.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setPosition(ambientPlayer.position), 250);
    return () => clearInterval(timer);
  }, [playing]);

  const select = useCallback((target: number) => {
    const wrapped = ((target % TRACKS.length) + TRACKS.length) % TRACKS.length;
    setIndex(wrapped);
    ambientPlayer.play(TRACKS[wrapped]);
  }, []);

  useEffect(() => {
    ambientPlayer.onEnded = () => select(nextTrackIndex(index, TRACKS.length));
    return () => {
      ambientPlayer.onEnded = null;
    };
  }, [index, select]);

  const toggle = useCallback(() => {
    if (ambientPlayer.isPlaying) ambientPlayer.pause();
    else if (!ambientPlayer.resume()) ambientPlayer.play(TRACKS[index]);
  }, [index]);

  const seek = useCallback(
    (seconds: number) => {
      const track = ambientPlayer.currentTrack ?? TRACKS[index];
      ambientPlayer.play(track, Math.max(0, Math.min(trackDuration(track) - 1, seconds)));
    },
    [index]
  );

  return {
    tracks: TRACKS,
    index,
    track: TRACKS[index],
    playing,
    position,
    duration: trackDuration(TRACKS[index]),
    select,
    toggle,
    seek,
    next: () => select(nextTrackIndex(index, TRACKS.length)),
    prev: () => select(prevTrackIndex(index, TRACKS.length)),
    stop: () => ambientPlayer.stop(),
  };
}
