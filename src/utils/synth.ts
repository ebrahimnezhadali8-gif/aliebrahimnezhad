/**
 * Tiny WebAudio helpers for sounds that aren't covered by cuelume: the CD
 * writer's motor in Nero and the generative tracks in the media player. Every
 * function is a harmless no-op where WebAudio is unavailable (tests, old browsers).
 */
import { getVolumeLevel } from "./sound";

type AudioCtor = typeof AudioContext;

let shared: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    shared ??= new Ctor();
    if (shared.state === "suspended") void shared.resume();
    return shared;
  } catch {
    return null;
  }
}

/** A low spinning-disc whirr that ramps up like a CD burner. Returns a function that stops it. */
export function startMotor(): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const level = getVolumeLevel() * 0.05;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  const body = ctx.createOscillator();
  body.type = "sawtooth";
  body.frequency.setValueAtTime(40, ctx.currentTime);
  body.frequency.linearRampToValueAtTime(95, ctx.currentTime + 1.4);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  body.connect(filter);
  filter.connect(gain);
  gain.gain.linearRampToValueAtTime(level, ctx.currentTime + 0.4);
  body.start();

  return () => {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.35);
    body.stop(now + 0.4);
  };
}

/** A short two-tone "ding" used for completion / error chimes. */
export function playChime(kind: "success" | "error"): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const level = getVolumeLevel() * 0.12;
  const notes = kind === "success" ? [660, 880] : [330, 220];
  notes.forEach((frequency, index) => {
    const start = ctx.currentTime + index * 0.16;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(level, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.45);
  });
}
