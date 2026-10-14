interface StartButtonProps {
  onClick: () => void;
}

function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      type="button"
      id="start-btn"
      className="start-btn"
      onClick={onClick}
      aria-label="Start menu"
      data-cuelume-press
    >
      <img src="/svg/windows7.png" alt="" className="start-btn__icon" />
      <span>Start</span>
    </button>
  );
}

export default StartButton;