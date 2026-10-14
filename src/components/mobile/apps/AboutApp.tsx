import AppScreen from "../AppScreen/AppScreen";
import Icon from "../../../icons/Icon";
import { useContent } from "../../../hooks/useContent";
import "./AboutApp.css";

interface AboutAppProps {
  onBack: () => void;
}

function AboutApp({ onBack }: AboutAppProps) {
  const { content, t } = useContent();

  return (
    <AppScreen title={t("aboutApp")} onBack={onBack}>
      <div className="about-app">
        <div className="about-app__photo">
          <img src="/images/aliebrahimnezhad.webp" alt={content.name} />
        </div>
        <div className="about-app__name">{content.name}</div>
        <div className="about-app__role">{content.role}</div>

        <div className="about-app__stats">
          <div className="about-app__stat">
            <div className="about-app__stat-num">{content.stats.experience}</div>
            <div className="about-app__stat-lab">{t("years")}</div>
          </div>
          <div className="about-app__stat">
            <div className="about-app__stat-num">{content.stats.projects}</div>
            <div className="about-app__stat-lab">{t("projectsStat")}</div>
          </div>
          <div className="about-app__stat">
            <div className="about-app__stat-num">{content.stats.technologies}</div>
            <div className="about-app__stat-lab">{t("tech")}</div>
          </div>
        </div>

        <div className="about-app__card">
          {content.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <div className="about-app__card about-app__contact">
          <a className="about-app__row" href={`mailto:${content.email}`}>
            <Icon name="email" />
            <span>{content.email}</span>
          </a>
          <a className="about-app__row" href={`tel:${content.phone.replace(/\s+/g, "")}`}>
            <Icon name="phone" />
            <span>{content.phone}</span>
          </a>
          <div className="about-app__row">
            <Icon name="location" />
            <span>{content.location}</span>
          </div>
        </div>
      </div>
    </AppScreen>
  );
}

export default AboutApp;