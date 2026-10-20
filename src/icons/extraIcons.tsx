/** Colourful Windows-7-style app icons (48×48) for the newer desktop apps. */
export const extraIcons = {
  nero: (
    <svg viewBox="0 0 48 48">
      <defs>
        <radialGradient id="nero-disc" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#c6d0de" />
          <stop offset="1" stopColor="#7d8ba3" />
        </radialGradient>
        <linearGradient id="nero-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e1251b" />
          <stop offset="0.6" stopColor="#ff8a1f" />
          <stop offset="1" stopColor="#ffd84a" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="26" r="19" fill="url(#nero-disc)" stroke="#5e6c85" strokeWidth="1.2" />
      <circle cx="22" cy="26" r="6" fill="#eef2f8" stroke="#8a97ad" />
      <circle cx="22" cy="26" r="2.4" fill="#5e6c85" />
      <path d="M33 4c2 5 8 7 8 14 0 5-3.8 8.5-8 8.5S25 23 25 18.5c0-3 1.6-4.4 2.8-6 .6 2 1.6 3 2.7 3C31 11 30.4 7.4 33 4Z" fill="url(#nero-flame)" stroke="#a6240f" strokeWidth="0.8" />
    </svg>
  ),
  minesweeper: (
    <svg viewBox="0 0 48 48">
      <rect x="3" y="3" width="42" height="42" rx="4" fill="#c0c0c0" stroke="#7b7b7b" strokeWidth="1.5" />
      <path d="M3 3h42M3 3v42" stroke="#fff" strokeWidth="3" />
      <g stroke="#111" strokeWidth="2.4" strokeLinecap="round">
        <path d="M24 12v24M12 24h24M15.5 15.5l17 17M32.5 15.5l-17 17" />
      </g>
      <circle cx="24" cy="24" r="9" fill="#151515" />
      <circle cx="21" cy="21" r="2.6" fill="#fff" opacity=".85" />
      <path d="M36 6v10" stroke="#222" strokeWidth="1.6" />
      <path d="M36 6l8 3.5L36 13Z" fill="#e0201b" />
    </svg>
  ),
  solitaire: (
    <svg viewBox="0 0 48 48">
      <rect x="4" y="9" width="24" height="33" rx="3" fill="#2d63b8" stroke="#16397a" strokeWidth="1.4" transform="rotate(-10 16 25)" />
      <g transform="rotate(-10 16 25)" stroke="#8fb1ea" strokeWidth="1" opacity=".7">
        <path d="M7 14l18 24M7 24l12 16M7 34l6 6M13 12l12 16M22 12l4 6" />
      </g>
      <rect x="18" y="7" width="26" height="35" rx="3" fill="#fff" stroke="#6b7686" strokeWidth="1.4" transform="rotate(8 31 24)" />
      <g transform="rotate(8 31 24)">
        <text x="21" y="19" fontSize="9" fontWeight="700" fill="#c4161c" fontFamily="Georgia, serif">A</text>
        <path d="M31 36c-6-4-8-7-5-10 2-2 4-1 5 1 1-2 3-3 5-1 3 3 1 6-5 10Z" fill="#c4161c" />
      </g>
    </svg>
  ),
  freecell: (
    <svg viewBox="0 0 48 48">
      <rect x="2" y="6" width="44" height="36" rx="4" fill="#188a3c" stroke="#0b5a24" strokeWidth="1.4" />
      <rect x="6" y="10" width="9" height="12" rx="1.5" fill="none" stroke="#9fe0b2" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="17" y="10" width="9" height="12" rx="1.5" fill="none" stroke="#9fe0b2" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="22" y="22" width="20" height="18" rx="2" fill="#fff" stroke="#6b7686" strokeWidth="1.2" />
      <text x="25" y="31" fontSize="8" fontWeight="700" fill="#151a22" fontFamily="Georgia, serif">K</text>
      <path d="M33 38c-3-2-4.5-4-3-5.6 1.2-1.2 2.4-.6 3 .6.6-1.2 1.8-1.8 3-.6 1.5 1.6 0 3.6-3 5.6Z" fill="#151a22" />
    </svg>
  ),
  taskmgr: (
    <svg viewBox="0 0 48 48">
      <rect x="3" y="6" width="42" height="30" rx="3" fill="#2a2f38" stroke="#0f1218" strokeWidth="1.5" />
      <rect x="6" y="9" width="36" height="24" fill="#04140a" />
      <path d="M6 28l5-2 4 3 5-9 5 5 5-12 4 8 5-6 2 3" fill="none" stroke="#3dff7a" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 15h36M6 21h36M6 27h36" stroke="#0c4a24" strokeWidth=".8" />
      <rect x="18" y="36" width="12" height="4" fill="#aeb6c4" />
      <rect x="12" y="40" width="24" height="3.5" rx="1.5" fill="#cfd6e2" stroke="#7f8a9e" />
    </svg>
  ),
  paint: (
    <svg viewBox="0 0 48 48">
      <path d="M24 5C12 5 4 14 4 24c0 8 5.5 13 12 13 3 0 4-1.5 4-3.5 0-3.5 3-4.5 5-4.5h9c6 0 10-3 10-8C44 11 35 5 24 5Z" fill="#f7efe0" stroke="#9a835c" strokeWidth="1.5" />
      <circle cx="14" cy="22" r="3.4" fill="#e5392b" />
      <circle cx="20" cy="14" r="3.4" fill="#ffd21f" />
      <circle cx="30" cy="13" r="3.4" fill="#3cb44b" />
      <circle cx="37" cy="20" r="3.4" fill="#2f7ed8" />
      <circle cx="13" cy="31" r="3" fill="#8e44ad" />
      <path d="M33 44l8-18 3 1.5-8 18Z" fill="#c8913a" stroke="#6e4a14" strokeWidth="1" />
      <path d="M33 44l3-.5-1-4Z" fill="#1c1c1c" />
    </svg>
  ),
  media: (
    <svg viewBox="0 0 48 48">
      <defs>
        <radialGradient id="wmp-orb" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffd9a3" />
          <stop offset="0.45" stopColor="#ff8a1c" />
          <stop offset="1" stopColor="#b84a00" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#wmp-orb)" stroke="#8a3b00" strokeWidth="1.4" />
      <ellipse cx="22" cy="14" rx="14" ry="7" fill="#fff" opacity=".28" />
      <path d="M19 15v18l16-9Z" fill="#fff" stroke="#e6e6e6" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  ),
  photos: (
    <svg viewBox="0 0 48 48">
      <defs>
        <linearGradient id="photo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fc4ff" />
          <stop offset="1" stopColor="#d6efff" />
        </linearGradient>
      </defs>
      <rect x="3" y="6" width="42" height="36" rx="3" fill="#fff" stroke="#7a8799" strokeWidth="1.4" />
      <rect x="7" y="10" width="34" height="28" fill="url(#photo-sky)" />
      <circle cx="33" cy="17" r="4.2" fill="#ffd54a" />
      <path d="M7 38l11-14 7 8 5-5 11 11Z" fill="#3fa05a" />
      <path d="M7 38l11-14 5 6-6 8Z" fill="#2c7d42" />
    </svg>
  ),
};
