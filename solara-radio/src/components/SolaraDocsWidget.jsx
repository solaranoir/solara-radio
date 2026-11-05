import { FaBook } from 'react-icons/fa';

export const SOLARA_DOCS_URL = 'https://docworkspace-web.onrender.com';

/** Tools-page entry for Solara Docs, the invite-only field-notes workspace (separate deployment). */
export default function SolaraDocsWidget() {
  return (
    <div className="sidebar-widget">
      <h3 className="sidebar-heading">
        <FaBook size={16} className="inline" aria-hidden="true" /> Solara Docs
      </h3>
      <p className="text-sm mb-2">
        Field notes, activation plans and technical write-ups. Import .docx or Markdown, attach
        logs, share read-only.
      </p>
      <p className="text-sm mb-4">
        <strong>Invite only</strong> · sign in with GitHub or Google.
      </p>
      <a
        href={SOLARA_DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block sidebar-button"
      >
        Open Solara Docs ↗<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
