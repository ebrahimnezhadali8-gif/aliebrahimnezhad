import { useMemo, useRef, useState } from "react";
import MobileStatusBar from "../StatusBar/MobileStatusBar";
import AppIcon from "./AppIcon";
import MobileDock from "../Dock/MobileDock";
import { APPS_PER_PAGE, ICONS_PER_ROW, homeScreenApps, type MobileIconItem } from "../mobileTypes";
import { chunk } from "../../../utils/chunk";
import { paginate } from "../../../utils/paginate";
import "./MobileHomeScreen.css";

interface MobileHomeScreenProps {
  onActivate: (item: MobileIconItem) => void;
  /** Tapping the status bar pulls the Control Center down, exactly like iOS. */
  onOpenControlCenter?: () => void;
}

function MobileHomeScreen({ onActivate, onOpenControlCenter }: MobileHomeScreenProps) {
  const pages = useMemo(() => paginate(homeScreenApps, APPS_PER_PAGE), []);
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
    <div className="mhome" data-testid="mobile-home-screen">
      <MobileStatusBar onClick={onOpenControlCenter} />

      <div
        className="mhome__pages"
        ref={scrollerRef}
        onScroll={handleScroll}
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
                    <AppIcon key={item.id} item={item} onActivate={onActivate} />
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

      <MobileDock onActivate={onActivate} />
    </div>
  );
}

export default MobileHomeScreen;
