import AppScreen from "../AppScreen/AppScreen";
import { siteConfig } from "../../../config/siteConfig";
import "./PhoneApp.css";

interface PhoneAppProps {
  onBack: () => void;
}

function PhoneApp({ onBack }: PhoneAppProps) {
  const telHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <AppScreen title="Phone" onBack={onBack}>
      <div className="phone-app">
        <div className="phone-app__photo">
          <img src="/images/aliebrahimnezhad.webp" alt={siteConfig.name} />
        </div>
        <div className="phone-app__name">{siteConfig.name}</div>
        <div className="phone-app__number">{siteConfig.phone}</div>
        <a className="phone-app__call" href={telHref} data-cuelume-press>
          <svg viewBox="0 0 24 24" fill="#fff">
            <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
          </svg>
          Call
        </a>
      </div>
    </AppScreen>
  );
}

export default PhoneApp;
