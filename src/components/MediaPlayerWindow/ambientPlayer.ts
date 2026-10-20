import { getAudioContext } from "../../utils/synth";
import { getVolumeLevel } from "../../utils/sound";
import { noteFrequency, trackDuration, type Track } from "./tracks";

/** Peak loudness of the pad mix before the master volume is applied. */
const BASE_GAIN = 0.16;

type Listener = () => void;

/**
 * A small generative music engine: schedules soft chord pads on WebAudio and
 * exposes an analyser for the visualizer. One instance is shared by the desktop
 * Media Player and the phone's Music app, so they never play over each other.
 */
class AmbientPlayer {
  private nodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private master: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private track: Track | null = null;
  private startedAt = 0;
  private offset = 0;
  private playing = false;
  private endTimer: ReturnType<typeof setTimeout> | undefined;
  private listeners = new Set<Listener>();
  /** Called when a track finishes by itself (so the UI can move to the next one). */
  onEnded: (() => void) | null = null;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  get currentTrack(): Track | null {
    return this.track;
  }

  get analyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  /** Playback position in seconds. */
  get position(): number {
    const ctx = getAudioContext();
    if (!this.track) return 0;
    if (!this.playing || !ctx) return this.offset;
    return Math.min(trackDuration(this.track), this.offset + (ctx.currentTime - this.startedAt));
  }

  setVolume(volume: number): void {
    if (this.master) this.master.gain.value = Math.max(0, Math.min(1, volume)) * BASE_GAIN;
  }

  play(track: Track, fromSeconds = 0): boolean {
    const ctx = getAudioContext();
    if (!ctx) return false;
    this.teardown();

    this.track = track;
    this.offset = fromSeconds;
    this.startedAt = ctx.currentTime;
    this.playing = true;

    this.master = ctx.createGain();
    this.master.gain.value = getVolumeLevel() * BASE_GAIN;
    this.analyserNode = ctx.createAnalyser();
    this.analyserNode.fftSize = 128;
    this.master.connect(this.analyserNode);
    this.analyserNode.connect(ctx.destination);

    const progression = [...track.chords, ...track.chords];
    progression.forEach((chord, index) => {
      const chordStart = index * track.chordSeconds;
      const chordEnd = chordStart + track.chordSeconds;
      if (chordEnd <= fromSeconds) return;
      const startIn = Math.max(0, chordStart - fromSeconds);
      const length = chordEnd - Math.max(chordStart, fromSeconds);
      const when = ctx.currentTime + startIn;

      chord.forEach((note, voice) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = track.wave;
        osc.frequency.value = noteFrequency(note);
        osc.detune.value = (voice - 1.5) * 4; // gentle chorus
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(0.28, when + Math.min(1.4, length / 3));
        gain.gain.linearRampToValueAtTime(0.0001, when + length);
        osc.connect(gain);
        gain.connect(this.master!);
        osc.start(when);
        osc.stop(when + length + 0.05);
        this.nodes.push({ osc, gain });
      });
    });

    this.endTimer = setTimeout(() => {
      this.playing = false;
      this.offset = 0;
      this.emit();
      this.onEnded?.();
    }, (trackDuration(track) - fromSeconds) * 1000);

    this.emit();
    return true;
  }

  pause(): void {
    if (!this.playing || !this.track) return;
    this.offset = this.position;
    this.playing = false;
    this.teardown();
    this.emit();
  }

  resume(): boolean {
    if (!this.track || this.playing) return false;
    return this.play(this.track, this.offset);
  }

  stop(): void {
    this.playing = false;
    this.offset = 0;
    this.teardown();
    this.emit();
  }

  private teardown(): void {
    clearTimeout(this.endTimer);
    for (const { osc } of this.nodes) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
    }
    this.nodes = [];
    this.master?.disconnect();
    this.master = null;
  }
}

export const ambientPlayer = new AmbientPlayer();
