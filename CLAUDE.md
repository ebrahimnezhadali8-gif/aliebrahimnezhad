# CLAUDE.md

## What this project is

A personal **résumé / portfolio website** for Ali Ebrahimnezhad (full-stack developer) that renders as an
operating system, in two skins:

- **Desktop (viewport > 1024px, or > 1366px on non-touch):** a **Windows 7** desktop — boot screen, Aero
  wallpapers, desktop icons, draggable windows, taskbar, Start menu, tray (brightness / volume / clock),
  right-click context menu, plus mini apps (Calculator, CMD).
- **Mobile (viewport ≤ 1024px, or ≤ 1366px with a coarse pointer):** an **iPhone 4 / iOS 4-style** phone UI —
  Apple-logo boot, glossy squircle app icons, scroll-snap home pages with dots, dock, status bar,
  Control Center (pull down from the top), home-indicator bar, and apps (Résumé, Notes, Projects, About Me,
  Skills, Calculator, Phone, Mail). The design reference size is **320×480** (iPhone 4); it must stay
  usable there and scale up for larger phones and tablets.

Skin selection lives in `src/hooks/useIsMobile.ts` (`shouldUseMobileSkin`) and is applied in `src/App.tsx`.
Both skins share `DesktopSettingsProvider` (brightness + volume persist in `localStorage`).

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # tsc -b && vite build
npm test             # vitest run (jsdom)   — ~80s for the full suite
npm run lint         # oxlint (a few known react-compiler warnings in Window.tsx / contexts)
```

## Where things are

- `src/config/siteConfig.ts` — **all personal content** (name, links, about text, skills, projects). Edit here
  only; it has an integrity test (`siteConfig.test.ts`).
- `src/components/*` — desktop skin (Window, Taskbar, StartMenu, DesktopIcons, ResumeWindow, …).
- `src/components/mobile/*` — phone skin. `HomeScreen/`, `Dock/`, `StatusBar/`, `ControlCenter/`,
  `AppScreen/` (shared app chrome with Back button), `apps/*` (one folder-less file pair per app).
- `src/icons/iconPaths.tsx` + `Icon.tsx` — inline SVG icon set. `<Icon>` renders `<span class="icon icon-NAME">`.
- `src/context/WindowManagerContext.tsx` — open / minimized / active window state (desktop only).
- `public/` — `resume.pdf`, wallpapers, project logos, official brand SVGs.

## Conventions

- Plain CSS per component (`Foo.tsx` + `Foo.css` side by side); Bootstrap is only used for utilities.
- Each mobile app owns its own CSS file — don't park app CSS in another app's stylesheet.
- TypeScript strict; shared types in `src/types/index.ts` (add new icons to `IconName` **and** `iconPaths`).
- Tests are co-located (`*.test.ts(x)`), Vitest + Testing Library. Test behaviour that would break UX, not
  every presentational component. Update the test count in `README.md` when it changes.

## Gotchas learned the hard way

- **`<Icon>`'s wrapper span is `display: block`.** Any container that must centre an icon has to make the
  `.icon` span a flex box (see `.app-icon__glyph .icon` in `AppIcon.css`) — otherwise the SVG hugs the left edge.
- Mobile browsers often render an `<iframe src="*.pdf">` blank, so the mobile Résumé app also exposes
  **Open PDF / Download** links.
- When checking the mobile skin in a browser, emulate **320×480** *and reload* — the skin is picked at load/resize
  time. If the preview pane itself is narrower than 1025px you get the phone skin even at "desktop" size.
- The Vite dev server can briefly serve an empty module right after a file is rewritten; `touch` the file and
  reload if you see "does not provide an export named 'default'".
- Git Bash on this Windows machine ignores `TZ=...`. For **Tehran time** use PowerShell:
  `[System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTime]::UtcNow,'Iran Standard Time')`.

## Working agreement (from the owner)

- Log every change you make in **`worker.md`** (newest entry last) with the **Tehran date and time**.
- Put product / UX suggestions in **`idea.md`**, one idea at a time, each with a title and an explanation.
- The owner writes in Persian; reply in Persian, keep code and identifiers in English.
