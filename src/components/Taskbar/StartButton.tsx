import { useRef } from "react";

interface StartButtonProps {
  onClick: () => void;
  /** Easter egg: three quick clicks. */
  onTripleClick?: () => void;
}

const TRIPLE_CLICK_MS = 700;

function StartButton({ onClick, onTripleClick }: StartButtonProps) {
  const clicks = useRef<number[]>([]);

  const handleClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < TRIPLE_CLICK_MS), now];
    if (clicks.current.length >= 3 && onTripleClick) {
      clicks.current = [];
      onTripleClick();
      return;
    }
    onClick();
  };

  return (
    <button
      type="button"
      id="start-btn"
      className="start-btn"
      onClick={handleClick}
      aria-label="Start menu"
      data-cuelume-press
    >
      <img src="/svg/windows7.png" alt="" className="start-btn__icon" />
      <span>Start</span>
    </button>
  );
}

export default StartButton;