import Window from "../Window/Window";
import Icon from "../../icons/Icon";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./AboutWindow.css";

function AboutWindow() {
  const meta = windowMeta.about;
  const { content, t } = useContent();

  return (
    <Window
      id="about"
      title={t("about")}
      icon={meta.icon}
      width={meta.width}
      height={meta.height}
    >
      <div className="about-window">
        <div className="about-window__top">
          <div className="about-window__photo">
            <img src="/images/aliebrahimnezhad.webp" alt={content.name} />
          </div>
          <div>
            <p className="about-window__name">{content.name}</p>
            <p className="about-window__role">{content.role}</p>
          </div>
        </div>

        <div className="about-window__text">
          {content.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="about-window__stats">
          <div className="about-window__stat">
            <div className="about-window__stat-num">{content.stats.experience}</div>
            <div className="about-window__stat-lab">{t("yearsExp")}</div>
          </div>
          <div className="about-window__stat">
            <div className="about-window__stat-num">{content.stats.projects}</div>
            <div className="about-window__stat-lab">{t("projectsStat")}</div>
          </div>
          <div className="about-window__stat">
            <div className="about-window__stat-num">{content.stats.technologies}</div>
            <div className="about-window__stat-lab">{t("technologies")}</div>
          </div>
        </div>

        <div className="about-window__contact">
          <a className="about-window__row" href={`mailto:${content.email}`}>
            <Icon name="email" />
            <span>{content.email}</span>
          </a>
          <a className="about-window__row" href={`tel:${content.phone.replace(/\s+/g, "")}`}>
            <Icon name="phone" />
            <span>{content.phone}</span>
          </a>
          <div className="about-window__row">
            <Icon name="location" />
            <span>{content.location}</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

export default AboutWindow;
