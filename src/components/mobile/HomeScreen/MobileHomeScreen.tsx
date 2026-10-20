import { useMemo, useRef, useState } from "react";
import MobileStatusBar from "../StatusBar/MobileStatusBar";
import AppIcon from "./AppIcon";
import MobileDock from "../Dock/MobileDock";
import { APPS_PER_PAGE, ICONS_PER_ROW, homeScreenApps, type MobileIconItem } from "../mobileTypes";
import Icon from "../../../icons/Icon";
import { useContent } from "../../../hooks/useContent";
import { appLabel } from "../appLabel";
import { useDesktopSettings } from "../../../context/DesktopSettingsContext";
import { chunk } from "../../../utils/chunk";
import { paginate } from "../../../utils/paginate";
import "./MobileHomeScreen.css";

interface MobileHomeScreenProps {
  onActivate: (item: MobileIconItem) => void;
  /** Tapping the status bar pulls the Control Center down, exactly like iOS. */
  onOpenControlCenter?: () => void;
  /** Pulling the icon grid down (or tapping the magnifier) opens Spotlight search. */
  onOpenSpotlight?: () => void;
}

function MobileHomeScreen({ onActivate, onOpenControlCenter, onOpenSpotlight }: MobileHomeScreenProps) {
  const { t } = useContent();
  const { mobileWallpaper } = useDesktopSettings();
  const pullStart = useRef<{ x: number; y: number } | null>(null);
  const label = useMemo(() => appLabel(t), [t]);

  const pages = paginate(homeScreenApps, APPS_PER_PAGE);
  const [page, setPage] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(0, next), pages.length - 1);
    setPage(clamped);
    const scroller = scrollerRef.current;
    // `scrollTo` is missing in some environments (jsdom, very old browsers) —
    // the dot state still updates, the animation is just skipped.
    if (scroller && typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: "smooth" });
    }
  };

  // Keep the dots in sync when the user swipes the pages instead of tapping them.
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) return;
    setPage(Math.round(scroller.scrollLeft / scroller.clientWidth));
  };

  return (
    <div
      className="mhome"
      data-testid="mobile-home-screen"
      style={{ backgroundImage: `url(${mobileWallpaper})` }}
    >
      <MobileStatusBar variant="light" onClick={onOpenControlCenter} />

      <div
        className="mhome__pages"
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={(e) => {
          pullStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          const start = pullStart.current;
          if (!start || !onOpenSpotlight) return;
          // A mostly-vertical downward drag, like iOS 4's pull-to-search.
          if (e.clientY - start.y > 56 && Math.abs(e.clientX - start.x) < 30) {
            pullStart.current = null;
            onOpenSpotlight();
          }
        }}
        onPointerUp={() => {
          pullStart.current = null;
        }}
        onPointerCancel={() => {
          pullStart.current = null;
        }}
        data-testid="mobile-home-pages"
      >
        {pages.map((apps, pageIndex) => (
          <div
            key={pageIndex}
            className="mhome__page"
            data-testid={`mobile-home-page-${pageIndex}`}
            aria-hidden={pageIndex !== page}
          >
            {/*
              Explicit rows rather than a bare CSS grid: a partially-filled row
              would otherwise cling to the left edge, whereas centring each row
              keeps a short last row balanced at any screen width.
            */}
            <div className="mhome__grid">
              {chunk(apps, ICONS_PER_ROW).map((row, rowIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  className={`mhome__row ${row.length < ICONS_PER_ROW ? "mhome__row--partial" : ""}`}
                  key={rowIndex}
                  data-testid={`mobile-home-row-${pageIndex}-${rowIndex}`}
                >
                  {row.map((item) => (
                    <AppIcon
                      key={item.id}
                      item={item}
                      label={label(item)}
                      onActivate={onActivate}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mhome__dots"
        data-testid="mobile-home-dots"
        role="tablist"
        aria-label="Home screen pages"
      >
        {onOpenSpotlight && (
          <button
            type="button"
            className="mhome__search"
            aria-label={t("search")}
            onClick={onOpenSpotlight}
            data-testid="mobile-spotlight-open"
            data-cuelume-press
          >
            <Icon name="search" />
          </button>
        )}
        {pages.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            className={`mhome__dot ${index === page ? "mhome__dot--active" : ""}`}
            aria-label={`Page ${index + 1}`}
            aria-selected={index === page}
            onClick={() => index === page || goToPage(index)}
          />
        ))}
      </div>

      <MobileDock onActivate={onActivate} label={label} />
    </div>
  );
}

export default MobileHomeScreen;