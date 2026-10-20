import { describe, it, expect } from "vitest";
import { PHOTOS_EVENT, requestAlbum, takePendingAlbum } from "./photoBus";

describe("photoBus", () => {
  it("hands an album over exactly once and announces it", () => {
    let heard: string | null = null;
    const listener = (event: Event) => {
      heard = (event as CustomEvent<string>).detail;
    };
    window.addEventListener(PHOTOS_EVENT, listener);
    requestAlbum("workchi");
    window.removeEventListener(PHOTOS_EVENT, listener);

    expect(heard).toBe("workchi");
    expect(takePendingAlbum()).toBe("workchi");
    expect(takePendingAlbum()).toBeNull();
  });
});
