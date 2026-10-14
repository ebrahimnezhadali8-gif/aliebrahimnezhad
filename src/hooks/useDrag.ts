import { useCallback, useRef, useState } from "react";

export interface Position {
  x: number;
  y: number;
}

/**
 * Makes an element draggable within the viewport.
 * Returns the current position plus a mouseDown handler to attach to the drag handle.
 */
export function useDrag(initialPosition: Position) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const onMouseDown = useCallback(
    (event: React.MouseEvent) => {
      dragState.current.dragging = true;
      dragState.current.offsetX = event.clientX - position.x;
      dragState.current.offsetY = event.clientY - position.y;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!dragState.current.dragging) return;
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 40;
        setPosition({
          x: Math.min(Math.max(0, moveEvent.clientX - dragState.current.offsetX), maxX),
          y: Math.min(Math.max(0, moveEvent.clientY - dragState.current.offsetY), maxY),
        });
      };

      const onMouseUp = () => {
        dragState.current.dragging = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [position]
  );

  return { position, setPosition, onMouseDown };
}
