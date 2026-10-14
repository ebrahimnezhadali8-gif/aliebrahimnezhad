import { useEffect, type RefObject } from "react";

/** Calls onOutside when a mousedown happens outside the given ref, unless the click target matches ignoreSelector. */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  ignoreSelector?: string
): void {
  useEffect(() => {
    function handle(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(target) && !(ignoreSelector && target.closest(ignoreSelector))) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside, ignoreSelector]);
}