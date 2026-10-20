import Window from "../Window/Window";
import { useDesktopSettings } from "../../context/DesktopSettingsContext";
import { useContent } from "../../hooks/useContent";
import { wallpaperImages } from "../../hooks/useWallpaperCycle";
import { LANGUAGES } from "../../i18n/language";
import { MIN_BRIGHTNESS } from "../../utils/brightness";
import "./SettingsWindow.css";

/** Windows 7 "Control Panel"-style settings hub for the Windows skin. */
function SettingsWindow() {
  const { t } = useContent();
  const {
    wallpaperIndex,
    setWallpaperIndex,
    nextWallpaper,
    theme,
    toggleTheme,
    calendar,
    setCalendar,
    lang,
    setLang,
    phonePreview,
    setPhonePreview,
    clockGadget,
    setClockGadget,
    screensaver,
    setScreensaver,
    brightnessPercent,
    setBrightness,
    volumePercent,
    setVolume,
  } = useDesktopSettings();

  return (
    <Window id="settings" title={t("settings")} icon="settings" width={520} height={600}>
      <div className="settings-window" data-testid="settings-window">
        <section className="settings-window__group">
          <h3 className="settings-window__legend">{t("appearance")}</h3>

          <div className="settings-window__row">
            <span className="settings-window__label">{t("darkMode")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={t("darkMode")}
              className={`settings-window__switch ${theme === "dark" ? "settings-window__switch--on" : ""}`}
              onClick={toggleTheme}
              data-testid="settings-dark-mode"
            >
              <span className="settings-window__knob" />
            </button>
          </div>

          <div className="settings-window__row settings-window__row--stack">
            <span className="settings-window__label">{t("wallpaper")}</span>
            <div className="settings-window__wallpapers" role="group" aria-label={t("wallpaper")}>
              {wallpaperImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`settings-window__thumb ${index === wallpaperIndex ? "settings-window__thumb--active" : ""}`}
                  style={{ backgroundImage: `url(${image})` }}
                  aria-label={`${t("wallpaper")} ${index + 1}`}
                  aria-pressed={index === wallpaperIndex}
                  onClick={() => setWallpaperIndex(index)}
                  data-testid={`settings-wallpaper-${index}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="settings-window__ghost"
              onClick={nextWallpaper}
              data-testid="settings-next-wallpaper"
            >
              {t("nextBackground")}
            </button>
          </div>
        </section>

        <section className="settings-window__group">
          <h3 className="settings-window__legend">{t("screen")}</h3>
          <div className="settings-window__row settings-window__row--stack">
            <span className="settings-window__label">{t("brightness")}</span>
            <input
              type="range"
              className="settings-window__range"
              min={Math.round(MIN_BRIGHTNESS * 100)}
              max={100}
              step={5}
              value={brightnessPercent}
              aria-label={t("brightness")}
              onChange={(e) => setBrightness(Number(e.target.value) / 100)}
              data-testid="settings-brightness"
            />
            <span className="settings-window__value">{brightnessPercent}%</span>
          </div>
          <div className="settings-window__row settings-window__row--stack">
            <span className="settings-window__label">{t("volume")}</span>
            <input
              type="range"
              className="settings-window__range"
              min={0}
              max={100}
              step={5}
              value={volumePercent}
              aria-label={t("volume")}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              data-testid="settings-volume"
            />
            <span className="settings-window__value">{volumePercent}%</span>
          </div>
        </section>

        <section className="settings-window__group">
          <h3 className="settings-window__legend">{t("system")}</h3>
          <div className="settings-window__row">
            <span className="settings-window__label" title={t("screensaverHint")}>
              {t("screensaver")}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={screensaver}
              aria-label={t("screensaver")}
              className={`settings-window__switch ${screensaver ? "settings-window__switch--on" : ""}`}
              onClick={() => setScreensaver(!screensaver)}
              data-testid="settings-screensaver"
            >
              <span className="settings-window__knob" />
            </button>
          </div>
          <div className="settings-window__row">
            <span className="settings-window__label">{t("clockGadget")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={clockGadget}
              aria-label={t("clockGadget")}
              className={`settings-window__switch ${clockGadget ? "settings-window__switch--on" : ""}`}
              onClick={() => setClockGadget(!clockGadget)}
              data-testid="settings-clock-gadget"
            >
              <span className="settings-window__knob" />
            </button>
          </div>
          <div className="settings-window__row">
            <span className="settings-window__label" title={t("phonePreviewHint")}>
              {t("phonePreview")}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={phonePreview}
              aria-label={t("phonePreview")}
              className={`settings-window__switch ${phonePreview ? "settings-window__switch--on" : ""}`}
              onClick={() => setPhonePreview(!phonePreview)}
              data-testid="settings-phone-preview"
            >
              <span className="settings-window__knob" />
            </button>
          </div>
          <div className="settings-window__row settings-window__row--lang">
            <span className="settings-window__label">{t("calendar")}</span>
            <div className="settings-window__langs" role="group" aria-label={t("calendar")}>
              {(["gregorian", "jalali"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`settings-window__lang ${option === calendar ? "settings-window__lang--active" : ""}`}
                  aria-pressed={option === calendar}
                  onClick={() => setCalendar(option)}
                  data-testid={`settings-calendar-${option}`}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-window__row settings-window__row--lang">
            <span className="settings-window__label">{t("language")}</span>
            <div className="settings-window__langs" role="group" aria-label={t("language")}>
              {LANGUAGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`settings-window__lang ${option === lang ? "settings-window__lang--active" : ""}`}
                  aria-pressed={option === lang}
                  onClick={() => setLang(option)}
                  data-testid={`settings-lang-${option}`}
                >
                  {option === "fa" ? "فارسی" : "English"}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Window>
  );
}

export default SettingsWindow;