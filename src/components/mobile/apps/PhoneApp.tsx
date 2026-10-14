import AppScreen from "../AppScreen/AppScreen";
import { useContent } from "../../../hooks/useContent";
import "./PhoneApp.css";

interface PhoneAppProps {
  onBack: () => void;
}

function PhoneApp({ onBack }: PhoneAppProps) {
  const { content, t } = useContent();
  const telHref = `tel:${content.phone.replace(/\s+/g, "")}`;

  return (
    <AppScreen title={t("phone")} onBack={onBack}>
      <div className="phone-app">
        <div className="phone-app__photo">
          <img src="/images/aliebrahimnezhad.webp" alt={content.name} />
        </div>
        <div className="phone-app__name">{content.name}</div>
        <div className="phone-app__number">{content.phone}</div>
        <a className="phone-app__call" href={telHref} data-cuelume-press>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 10.4c1.6 3.2 4.4 6 7.6 7.6l2.5-2.5c.4-.4.9-.5 1.3-.3 1.4.5 2.9.7 4.4.7.7 0 1.2.5 1.2 1.2v4c0 .7-.5 1.2-1.2 1.2C11 22.3 3.1 14.4 2.5 3.1c0-.7.5-1.2 1.2-1.2h4c.7 0 1.2.5 1.2 1.2 0 1.5.2 3 .7 4.4.2.4.1.9-.3 1.3Z" />
          </svg>
          {t("tel")}
        </a>
      </div>
    </AppScreen>
  );
}

export default PhoneApp;