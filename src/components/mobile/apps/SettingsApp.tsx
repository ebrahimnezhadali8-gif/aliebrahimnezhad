import { useState } from "react";
import AppScreen from "../AppScreen/AppScreen";
import { useDesktopSettings } from "../../../context/DesktopSettingsContext";
import { useContent } from "../../../hooks/useContent";
import { MOBILE_WALLPAPERS } from "../../../hooks/useWallpaperCycle";
import { LANGUAGES } from "../../../i18n/language";
import { MIN_BRIGHTNESS } from "../../../utils/brightness";
import "./SettingsApp.css";

/** The iOS Settings app, wired to the very same state the Windows taskbar uses. */
function SettingsApp({ onBack }: { onBack: () => void }) {
  const { t } = useContent();
  const {
    mobileWallpaperIndex,
    setMobileWallpaperIndex,
    theme,
    toggleTheme,
    calendar,
    setCalendar,
    lang,
    setLang,
    brightnessPercent,
    setBrightness,
    volumePercent,
    setVolume,
  } = useDesktopSettings();

  const [wallpapers] = useState<string[]>([...MOBILE_WALLPAPERS]);

  return (
    <AppScreen title={t("settings")} onBack={onBack}>
      <div className="settings-app" data-testid="mobile-settings">
        <section className="settings-app__group">
          <h3 className="settings-app__legend">{t("appearance")}</h3>
          <div className="settings-app__row">
            <span className="settings-app__label">{t("darkMode")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={t("darkMode")}
              className="settings-app__switch"
              data-testid="mobile-settings-dark"
              onClick={toggleTheme}
            >
              <span className="settings-app__knob" />
            </button>
          </div>

          <div className="settings-app__row settings-app__row--stack">
            <span className="settings-app__label">{t("wallpaper")}</span>
            <div className="settings-app__wallpapers" role="group" aria-label={t("wallpaper")}>
              {wallpapers.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`settings-app__thumb ${index === mobileWallpaperIndex ? "settings-app__thumb--active" : ""}`}
                  style={{ backgroundImage: `url(${image})` }}
                  aria-label={`${t("wallpaper")} ${index + 1}`}
                  aria-pressed={index === mobileWallpaperIndex}
                  onClick={() => setMobileWallpaperIndex(index)}
                  data-testid={`mobile-wallpaper-${index}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="settings-app__group">
          <h3 className="settings-app__legend">{t("screen")}</h3>
          <div className="settings-app__row settings-app__row--stack">
            <span className="settings-app__label">{t("brightness")}</span>
            <input
              type="range"
              className="settings-app__range"
              min={Math.round(MIN_BRIGHTNESS * 100)}
              max={100}
              step={5}
              value={brightnessPercent}
              aria-label={t("brightness")}
              onChange={(e) => setBrightness(Number(e.target.value) / 100)}
              data-testid="mobile-settings-brightness"
            />
          </div>
          <div className="settings-app__row settings-app__row--stack">
            <span className="settings-app__label">{t("volume")}</span>
            <input
              type="range"
              className="settings-app__range"
              min={0}
              max={100}
              step={5}
              value={volumePercent}
              aria-label={t("volume")}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              data-testid="mobile-settings-volume"
            />
          </div>
        </section>

        <section className="settings-app__group">
          <h3 className="settings-app__legend">{t("system")}</h3>
          <div className="settings-app__row">
            <span className="settings-app__label">{t("calendar")}</span>
            <div className="settings-app__langs" role="group" aria-label={t("calendar")}>
              {(["gregorian", "jalali"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className="settings-app__lang"
                  aria-pressed={option === calendar}
                  onClick={() => setCalendar(option)}
                  data-testid={`mobile-settings-calendar-${option}`}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-app__row">
            <span className="settings-app__label">{t("language")}</span>
            <div className="settings-app__langs" role="group" aria-label={t("language")}>
              {LANGUAGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="settings-app__lang"
                  aria-pressed={option === lang}
                  onClick={() => setLang(option)}
                  data-testid={`mobile-settings-lang-${option}`}
                >
                  {option === "fa" ? "فارسی" : "English"}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppScreen>
  );
}

export default SettingsApp;