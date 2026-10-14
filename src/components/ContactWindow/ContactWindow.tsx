import Window from "../Window/Window";
import Icon from "../../icons/Icon";
import { windowMeta } from "../../config/siteConfig";
import { useContent } from "../../hooks/useContent";
import "./ContactWindow.css";

function ContactWindow() {
  const meta = windowMeta.contact;
  const { content, t } = useContent();

  return (
    <Window id="contact" title={t("contact")} icon={meta.icon} width={meta.width} height={meta.height}>
      <div className="contact-window">
        <div className="contact-window__avatar">
          <img src="/images/aliebrahimnezhad.webp" alt={content.name} />
        </div>
        <div className="contact-window__name">{content.name}</div>
        <div className="contact-window__role">{content.role}</div>

        <a className="contact-window__row" href={`mailto:${content.email}`}>
          <Icon name="email" />
          <span>{content.email}</span>
        </a>
        <a className="contact-window__row" href={`tel:${content.phone.replace(/\s+/g, "")}`}>
          <Icon name="phone" />
          <span>{content.phone}</span>
        </a>
        <div className="contact-window__row">
          <Icon name="location" />
          <span>{content.location}</span>
        </div>
      </div>
    </Window>
  );
}

export default ContactWindow;