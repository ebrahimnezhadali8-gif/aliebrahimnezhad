import AppScreen from "../AppScreen/AppScreen";
import Icon from "../../../icons/Icon";
import { siteConfig } from "../../../config/siteConfig";
import "./AboutApp.css";

interface AboutAppProps {
  onBack: () => void;
}

function AboutApp({ onBack }: AboutAppProps) {
  return (
    <AppScreen title="About Me" onBack={onBack}>
      <div className="about-app">
        <div className="about-app__photo">
          <img src="/images/aliebrahimnezhad.webp" alt={siteConfig.name} />
        </div>
        <div className="about-app__name">{siteConfig.name}</div>
        <div className="about-app__role">{siteConfig.role}</div>

        <div className="about-app__stats">
          <div className="about-app__stat">
            <div className="about-app__stat-num">{siteConfig.stats.experience}</div>
            <div className="about-app__stat-lab">Years</div>
          </div>
          <div className="about-app__stat">
            <div className="about-app__stat-num">{siteConfig.stats.projects}</div>
            <div className="about-app__stat-lab">Projects</div>
          </div>
          <div className="about-app__stat">
            <div className="about-app__stat-num">{siteConfig.stats.technologies}</div>
            <div className="about-app__stat-lab">Tech</div>
          </div>
        </div>

        <div className="about-app__card">
          {siteConfig.about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="about-app__card about-app__contact">
          <a className="about-app__row" href={`mailto:${siteConfig.email}`}>
            <Icon name="email" />
            <span>{siteConfig.email}</span>
          </a>
          <a className="about-app__row" href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>
            <Icon name="phone" />
            <span>{siteConfig.phone}</span>
          </a>
          <div className="about-app__row">
            <Icon name="location" />
            <span>{siteConfig.location}</span>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}

export default AboutApp;
