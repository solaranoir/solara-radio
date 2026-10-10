import { Link } from 'react-router-dom';
import { Radio, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/minedamnesia', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kelly-simer', Icon: FaLinkedin },
  { label: 'QRZ · KK7QEA', href: 'https://www.qrz.com/db/KK7QEA', Icon: ExternalLink },
];

export default function Header() {
  return (
    <header className="solara-site-header border-b border-white/10 bg-[#0B1D29]/95 text-[#F2C79D]">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-3 no-underline" aria-label="Solara Radio home">
          <span className="rounded-xl border border-[#24666D] bg-[#0C2F34] p-2 text-[#EC935E]"><Radio size={27} aria-hidden="true" /></span>
          <span className="flex flex-col">
            <span className="font-heading text-2xl font-bold leading-tight text-[#F2C79D]">Solara Radio</span>
            <span className="text-xs tracking-wide text-[#A3B68D]">Backcountry signals · KK7QEA</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a href="/#conditions" className="hover:text-[#EC935E]">Conditions</a>
          <a href="/#field-tools" className="hover:text-[#EC935E]">Field tools</a>
          <a href="/#about" className="hover:text-[#EC935E]">About / QSL</a>
          <a href="/#projects" className="hover:text-[#EC935E]">Projects</a>
        </nav>
      </div>
      <div className="border-t border-white/5 bg-[#0C2F34]/70">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-end gap-5 px-5 py-2 text-xs lg:px-10">
          {externalLinks.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#F2C79D] hover:text-[#EC935E]">
              <Icon size={14} aria-hidden="true" />{label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
