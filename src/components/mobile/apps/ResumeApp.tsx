import AppScreen from "../AppScreen/AppScreen";
import "./ResumeApp.css";

interface ResumeAppProps {
  onBack: () => void;
}

const RESUME_URL = "/resume.pdf";

function ResumeApp({ onBack }: ResumeAppProps) {
  return (
    <AppScreen title="Résumé" onBack={onBack} noPadding>
      <div className="resume-app">
        <div className="resume-app__bar">
          <a className="resume-app__action" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
          <a className="resume-app__action resume-app__action--secondary" href={RESUME_URL} download="resume.pdf">
            Download
          </a>
        </div>
        <iframe src={RESUME_URL} title="resume" className="resume-app__frame" />
      </div>
    </AppScreen>
  );
}

export default ResumeApp;
