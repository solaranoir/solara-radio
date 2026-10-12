import { Download, ExternalLink, FileText } from 'lucide-react';
import './Resume.css';

const RESUME_PDF = '/Kelly_Simer_Resume.pdf';

export default function Resume() {
  return (
    <main className="solara-resume-page">
      <p className="solara-eyebrow">Engineering · Reliability · Legal operations</p>
      <div className="solara-resume-page__heading">
        <div>
          <h1>Resume</h1>
          <p className="solara-muted">Kelly Simer · Software Engineer | Reliability &amp; Legal Operations Specialist</p>
        </div>
        <div className="solara-resume-page__actions">
          <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="solara-resume-page__button solara-resume-page__button--secondary"><ExternalLink size={17} aria-hidden="true"/> View PDF</a>
          <a href={RESUME_PDF} download="Kelly_Simer_Resume.pdf" className="solara-resume-page__button solara-resume-page__button--primary"><Download size={17} aria-hidden="true"/> Download resume</a>
        </div>
      </div>
      <section className="solara-surface solara-resume-page__surface" aria-label="Embedded resume">
        <div className="solara-resume-page__document-label"><FileText size={18} aria-hidden="true"/> Two-page resume · PDF</div>
        <object data={`${RESUME_PDF}#view=FitH`} type="application/pdf" className="solara-resume-page__viewer" aria-label="Kelly Simer resume PDF">
          <p>Your browser cannot display the PDF inline. <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer">Open the resume in a new tab.</a></p>
        </object>
      </section>
    </main>
  );
}
