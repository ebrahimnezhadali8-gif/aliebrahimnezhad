import PdfViewer from "../../PdfViewer/PdfViewer";
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
        <div className="resume-app__frame">
          <PdfViewer url={RESUME_URL} fallbackHref={RESUME_URL} />
        </div>
      </div>
    </AppScreen>
  );
}

export default ResumeApp;
