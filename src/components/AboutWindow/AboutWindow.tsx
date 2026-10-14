import Window from "../Window/Window";
import Icon from "../../icons/Icon";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import "./AboutWindow.css";

function AboutWindow() {
  const meta = windowMeta.about;

  return (
    <Window
      id="about"
      title={meta.title}
      icon={meta.icon}
      width={meta.width}
      height={meta.height}
    >
      <div className="about-window">
        <div className="about-window__top">
          <div className="about-window__photo">
            <img src="/images/aliebrahimnezhad.webp" alt={siteConfig.name} />
          </div>
          <div>
            <p className="about-window__name">{siteConfig.name}</p>
            <p className="about-window__role">{siteConfig.role}</p>
          </div>
        </div>

        <div className="about-window__text">
          {siteConfig.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="about-window__stats">
          <div className="about-window__stat">
            <div className="about-window__stat-num">
              {siteConfig.stats.experience}
            </div>
            <div className="about-window__stat-lab">Years Exp.</div>
          </div>
          <div className="about-window__stat">
            <div className="about-window__stat-num">
              {siteConfig.stats.projects}
            </div>
            <div className="about-window__stat-lab">Projects</div>
          </div>
          <div className="about-window__stat">
            <div className="about-window__stat-num">
              {siteConfig.stats.technologies}
            </div>
            <div className="about-window__stat-lab">Technologies</div>
          </div>
        </div>

        <div className="about-window__contact">
          <div className="about-window__row">
            <Icon name="email" />
            <span>{siteConfig.email}</span>
          </div>
          <div className="about-window__row">
            <Icon name="phone" />
            <span>{siteConfig.phone}</span>
          </div>
          <div className="about-window__row">
            <Icon name="location" />
            <span>{siteConfig.location}</span>
          </div>
        </div>
      </div>
    </Window>
  );
}

export default AboutWindow;
