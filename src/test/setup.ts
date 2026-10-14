import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom ships a 1024x768 window, which `useIsMobile` correctly treats as a
// phone-sized viewport. Pin a realistic desktop size so the Windows suite
// exercises the desktop skin by default; tests that care about widths override
// window.innerWidth themselves (see useIsMobile.test.ts).
window.innerWidth = 1440;
window.innerHeight = 900;

// jsdom has no Web Audio API; cuelume is safe as a no-op there, but we mock
// it explicitly so tests never depend on (or fail because of) real audio.
vi.mock("cuelume", () => ({
  bind: vi.fn(),
  play: vi.fn(),
  setEnabled: vi.fn(),
  setVolume: vi.fn(),
}));

// jsdom does not implement matchMedia at all. Default every test to a
// "desktop" viewport (matches: false) so components using useIsMobile don't
// crash and existing desktop-suite tests keep exercising the Windows UI.
// Tests that specifically need to simulate a mobile/tablet width (see
// useIsMobile.test.ts) override window.matchMedia themselves.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

// Node 22+ ships a global `localStorage` object that is only a working
// implementation when the runtime is started with `--localstorage-file`.
// jsdom inherits that stub instead of installing its own, so `getItem` and
// friends come back undefined and every storage-backed feature blows up.
// Detect it and install a spec-shaped in-memory Storage.
function isUsableStorage(candidate: unknown): boolean {
  if (!candidate || typeof candidate !== "object") return false;
  const store = candidate as Storage;
  return (
    typeof store.getItem === "function" &&
    typeof store.setItem === "function" &&
    typeof store.removeItem === "function" &&
    typeof store.clear === "function"
  );
}

if (!isUsableStorage(window.localStorage)) {
  const createMemoryStorage = (): Storage => {
    const entries = new Map<string, string>();
    return {
      get length() {
        return entries.size;
      },
      key(index: number) {
        return [...entries.keys()][index] ?? null;
      },
      getItem(key: string) {
        return entries.has(String(key)) ? (entries.get(String(key)) as string) : null;
      },
      setItem(key: string, value: string) {
        entries.set(String(key), String(value));
      },
      removeItem(key: string) {
        entries.delete(String(key));
      },
      clear() {
        entries.clear();
      },
    };
  };

  Object.defineProperty(window, "localStorage", {
    value: createMemoryStorage(),
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: window.localStorage,
    configurable: true,
    writable: true,
  });
}
