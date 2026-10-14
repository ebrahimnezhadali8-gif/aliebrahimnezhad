# Windows 7 Style Portfolio — React + TypeScript + Bootstrap

A personal portfolio site styled as a Windows 7 desktop, rewritten in
**TypeScript** with real bug fixes and new features on top of the previous
JavaScript version.

## 1. Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Recreating from scratch:

```bash
npm create vite@latest win7-portfolio-ts -- --template react-ts
cd win7-portfolio-ts
npm install
npm install bootstrap prop-types cuelume
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

## 2. Scripts

| Command             | What it does                                     |
|----------------------|---------------------------------------------------|
| `npm run dev`          | Vite dev server with hot reload                   |
| `npm run build`         | Type-checks (`tsc -b`) then builds to `dist/`      |
| `npm run preview`       | Preview the production build locally               |
| `npm test`               | Run the full test suite once                        |
| `npm run test:watch`      | Run tests in watch mode                              |

## 3. What changed from the previous (JS) version — bug fixes

- **Minimize no longer closes the window.** The window manager now tracks a
  real `minimized` flag separate from "closed". Clicking **−** hides the
  window but keeps its taskbar button; only **✕** removes it for good.
  Clicking its taskbar button (or Start Menu entry) restores it exactly
  where it was. Covered by tests in `WindowManagerContext.test.tsx`,
  `Window.test.tsx`, and `Taskbar.test.tsx`.
- **Desktop icons use a responsive CSS Grid** (`grid-auto-flow: column`) so a
  column wraps instead of icons getting cut off at the bottom. Icons are
  intentionally **not** draggable — placement is owned entirely by the grid.
- **Resume window** is much bigger (820×680) and its toolbar now matches
  Chrome's built-in dark PDF viewer, with **working** zoom (50%–200%, via a
  tested pure `zoom.ts` module), a fit-to-page reset, download and print.
- **Projects window** is bigger (860×600) and more usable as an Explorer-style
  browser.
- **Screen brightness control** in the notification area, right next to the
  volume slider. Clicking the sun opens a slider (30%–100%) that dims the
  wallpaper, icons and open windows via a black overlay — while deliberately
  leaving the taskbar and Start menu usable. The level persists across
  reloads (`utils/brightness.ts` + `DesktopSettingsContext`, both tested).
- **Right-click on the desktop** opens a real context menu:
  - **Show desktop icons** — a checkbox toggle; unchecking it hides every
    desktop icon (tested end-to-end in `Desktop.test.tsx`).
  - **Next background** — cycles through the Aero-style wallpaper images.
  - **Refresh** — a brief flash, like real Windows.
- **Sound effects** via the `cuelume` package: opening/closing/minimizing a
  window each play a distinct sound, and icon/button presses have tactile
  feedback. Wired once in `main.tsx` via `initSounds()`.

## 4. New apps

- **Calculator** (`components/CalculatorWindow`) — a Windows 7-style simple
  calculator (+ − × ÷, %, ±, backspace, C/CE). The actual arithmetic lives in
  a framework-free `calculatorLogic.ts` reducer, fully unit-tested
  (12 tests covering chained operators, decimals, divide-by-zero, etc.).
- **CMD** (`components/CmdWindow`) — a Windows 7 `cmd.exe` look-alike. On
  open it shows a banner with **"Ali Ebrahimnezhad"** in a bold monospace
  CLI style, then a working prompt supporting `help`, `user`/`whoami`, `ver`,
  `date`, `dir`, `cls`/`clear`, and `exit` (closes the window). Right-click
  inside it is disabled, like a real terminal. Command parsing lives in a
  pure `cmdLogic.ts` module, unit-tested separately from the UI, and the
  banner/user output is sourced from `siteConfig` so it never goes stale.

## 4b. Content

`siteConfig.projects` holds three published projects, each with a tagline, a
description split on blank lines into paragraphs, feature highlights,
technologies, a live URL, a year and — where available — the project's own
logo image:

| Project                   | URL             | Year | Built with                             | Logo                   |
|---------------------------|-----------------|------|----------------------------------------|------------------------|
| **Workchi**               | `workchi.ir`    | 2026 | Next.js + TypeScript, Express, MySQL  | `public/images/workchi.jpg` |
| **Narvash**               | `narvash.com`   | 2025 | WordPress + WooCommerce, PHP, MySQL   | `public/images/narvash.jpg` |
| **Boom Sazegan Varzash**  | `boomsv.ir`     | 2025 | Next.js + TypeScript, Express, PostgreSQL | —                    |

A project's `logo` is rendered in the Explorer grid, in the detail modal's
title bar and in the mobile list/detail; projects without one fall back to a
neutral folder placeholder.

Skill icons use the **official** brand marks (downloaded from
[Simple Icons](https://simpleicons.org) and kept in `public/brand/*.svg`, with
the same path data inlined in `icons/iconPaths.tsx`): PostgreSQL, Next.js,
NestJS, Express, React, TypeScript, Node.js and MySQL.

## 4c. The phone / tablet skin (`components/mobile`)

Below `PHONE_MAX_WIDTH_PX` (1024px) — and up to `TABLET_MAX_WIDTH_PX` (1366px)
when the device reports a coarse pointer, i.e. a touch screen — the site renders
an iPhone-style UI instead of the Windows desktop. It shares
`DesktopSettingsProvider` with the desktop, so brightness and volume stay in
sync and persist between the two.

- **No device frame.** The UI fills the viewport exactly; there is no fake
  phone body, speaker slot or hardware Home button. Navigation uses an iOS
  **home indicator** bar at the bottom edge and a `‹ Back` control in each
  app's header.
- **Boot screen** — black, the Apple logo, and a hairline progress bar sweeping
  left to right, the real iOS startup rather than a spinner.
- **Home screen** — four icons wide, iOS squircle tiles. System apps
  (Résumé, Notes, Projects, About Me, Skills, Calculator) get a coloured
  gradient tile with a white glyph; brand apps (GitHub, LinkedIn, Instagram,
  Telegram) get their real logo on a white tile, exactly as iOS does. Pages are
  a scroll-snap pager with working page dots, and a four-slot dock at the
  bottom.
- **Status bar** — clock, signal, Wi-Fi and battery. Tapping it (or dragging
  down from the very top edge) opens the **Control Center**.
- **Control Center** (`components/mobile/ControlCenter`) — a translucent panel
  that drops in from the top, with working vertical **brightness** and
  **volume** sliders plus the familiar Airplane / Wi-Fi / Bluetooth / Focus /
  Rotation switches. Dismissed by tapping outside or pressing Escape.
- **Mail really sends.** `apps/mailto.ts` builds a correctly percent-encoded
  `mailto:` and `apps/MailApp.tsx` validates before handing it over, so the
  visitor's own mail app opens with their name, subject and body pre-filled and
  the message actually arrives. Over-long drafts (past `MAILTO_SAFE_LIMIT`)
  are blocked with an explanation instead of being silently truncated.

## 5. Editing your real content

Everything personal lives in one file:

```
src/config/siteConfig.ts
```

Name, phone, email, social links, about-me text, skills, and the project
list. Nothing else needs to change — every component reads from here, and
TypeScript will tell you if you break the shape.

Replace `public/resume.pdf` with your real resume (same filename).

## 6. Project structure

```
src/
  App.tsx / main.tsx          Boot sequence -> Desktop, Bootstrap + cuelume init
  styles/theme.css             Global CSS variables + resets

  types/index.ts                Shared TypeScript types (WindowId, DesktopItem, ...)
  config/siteConfig.ts           ALL editable content (+ a config-integrity test)

  context/WindowManagerContext.tsx   Open/minimized/active window state (the core fix)
  context/DesktopSettingsContext.tsx  Screen brightness state for the tray + desktop
  hooks/useDrag.ts, useClock.ts, useOutsideClick.ts, useWallpaperCycle.ts

  icons/iconPaths.tsx, Icon.tsx        Inline SVG icon set (official brand marks)
  public/brand/*.svg                   The same official logos as standalone files
  public/images/*.jpg                  Wallpapers, profile photo and project logos
  utils/handleItemAction.ts             "open a window OR open a link" logic
  utils/sound.ts                         cuelume wrapper (open/close/minimize sounds)
  utils/brightness.ts                    Brightness clamping + persistence (pure)

  components/
    BootScreen/                 3-second boot animation
    Desktop/                    Wires everything together + right-click menu
    Wallpaper/                  Cyclable Aero wallpapers
    DesktopIcons/                 Responsive icon grid, hideable (not draggable)
    ContextMenu/                   Right-click menu (icons toggle, background, refresh)
    Taskbar/                     Start button, running/minimized app buttons, clock,
                                  brightness + volume tray controls
    StartMenu/                    Pinned items + external links
    Window/                       Generic draggable window shell (open/minimize/close)
    ResumeWindow/                  Chrome-style PDF viewer with real zoom
    ProjectsWindow/                 Explorer-style project browser + detail modal
    AboutWindow/, SkillsWindow/, ContactWindow/
    CalculatorWindow/                Simple Windows 7-style calculator (new)
    CmdWindow/                        cmd.exe look-alike terminal (new)
    ScreenDimmer/                     Shared brightness dimmer (both skins)
    mobile/                           iPhone-style skin for phones AND tablets
      MobileApp.tsx                     Viewport-filling root + pull-down gesture
      BootScreen/                        Apple logo + iOS progress bar
      HomeScreen/                        Squircle app icons, scroll-snap pages, dots
      Dock/, StatusBar/, AppScreen/     iOS chrome
      ControlCenter/                     Drop-down panel: brightness, volume, switches
      apps/                              Résumé, Notes, Projects, About, Skills,
                                         Calculator, Phone, Mail
  utils/
    paginate.ts                       Fixed-size paging for the home screen (pure)

  test/
    setup.ts                    Vitest + jest-dom + cuelume mock + localStorage shim
    testUtils.tsx                 renderWithProviders() helper
```

## 7. Testing philosophy

Per the brief, tests are **not** written for every single component — only
where a bug would actually break the user experience:

- **Window manager core** (open/close/minimize/focus/restore) — this is the
  bug that was reported, so it's thoroughly covered.
- **Window** itself — confirms minimize truly keeps it open/restorable.
- **Taskbar** — confirms a minimized app's button survives and restores it.
- **DesktopIcons / ContextMenu / Desktop** — the icon-visibility toggle,
  wallpaper cycling, and the brightness→dimmer wiring, since a silent
  regression there is invisible until a user actually right-clicks.
- **Brightness helpers** — pure clamping/storage module, so the edge cases
  (NaN, out-of-range, blocked storage, corrupt persisted value) are pinned
  down precisely.
- **ProjectsWindow** — listing, logo rendering, the detail modal (tagline,
  highlights, safe outbound `target="_blank"` link) and its close paths.
- **The phone/tablet skin** — splash → home screen handover, the absence of a
  device frame, iOS vs. brand icon tiles, page dots, pull-down Control Center
  (tap, keyboard and top-edge drag), brightness→dimmer wiring, volume
  persistence, and the home indicator returning home.
- **MailApp** — that the send control is a real `<a>` with a live, correctly
  encoded `mailto:` (never `#`), that it updates as you type, that validation
  blocks empty/oversized drafts, and that the clipboard path degrades safely.
- **mailto helpers** — encoding, validation, the length guard and the preview
  line, all as pure functions.
- **useIsMobile / shouldUseMobileSkin** — phones, tablets in portrait and
  landscape-with-touch, and narrow desktop windows all route correctly.
- **paginate** — the home-screen paging maths, including the never-empty case.
- **Calculator logic** and **cmd command logic** — pure functions, so the
  actual math/command behavior is tested directly, plus a couple of thin UI
  tests confirming clicks/typing reach that logic correctly.
- **handleItemAction** — the shared "open window vs. open link" decision.
- **siteConfig integrity** — ids are unique, every icon exists, every project
  URL is real `https`, every skill has an icon and a sane percentage, the
  official brand marks for PostgreSQL/Next.js/NestJS are wired up, Workchi is
  dated to the current year, Narvash is a WordPress project, and any project
  logo points at a real-looking path under `/public/images`.
- **BootScreen / App** — the boot-to-desktop timing sequence.

Purely presentational components with no real interaction risk (About,
Skills, Contact display) are left untested, intentionally, to keep the suite
focused on what actually protects the user experience.

Current status: **247 tests passing across 30 test files.**

## 8. Notes

- Bootstrap's CSS is imported globally for utility classes; the Windows 7
  aesthetic itself is hand-written CSS per component.
- Most icons are inline SVG; brand logos are the official Simple Icons paths.
- `cuelume` sounds only play in real browsers (no Web Audio in test/SSR
  environments) — mocked in `test/setup.ts` so tests never depend on audio.
- `test/setup.ts` also replaces `localStorage` when it detects Node's
  `--localstorage-file`-less stub, which otherwise shadows jsdom's
  implementation and breaks every storage-backed feature under test.
- Storage access in app code is always wrapped so a blocked/full
  `localStorage` (Safari private mode) degrades to a session-only setting
  instead of throwing.
- `test/setup.ts` pins `window.innerWidth` to a desktop size, because jsdom's
  1024px default would otherwise correctly route to the phone skin.
