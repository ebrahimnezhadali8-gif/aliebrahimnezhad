import Window from "../Window/Window";
import { siteConfig, windowMeta } from "../../config/siteConfig";
import "./ContactWindow.css";

function ContactWindow() {
  const meta = windowMeta.contact;
  const telHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <Window
      id="contact"
      title={meta.title}
      icon={meta.icon}
      width={meta.width}
      height={meta.height}
    >
      <div className="contact-window">
        <div className="contact-window__photo">
          <img src="/images/aliebrahimnezhad.webp" alt={siteConfig.name} />
        </div>
        <div className="contact-window__name">{siteConfig.name}</div>
        <div className="contact-window__role">{siteConfig.role}</div>
        <div className="contact-window__phone">{siteConfig.phone}</div>
        <a className="contact-window__call" href={telHref}>
          Call
        </a>
      </div>
    </Window>
  );
}

export default ContactWindow;
