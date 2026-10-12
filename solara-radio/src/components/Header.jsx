import { Link } from 'react-router-dom';
import { Radio, ExternalLink, Menu, MapPin } from 'lucide-react';
import LocationSettings from './LocationSettings';
import './LocationSettings.css';
import { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const links = [
  ['Home', '/'], ['Solar', '/#solar-conditions'], ['POTA', '/#pota-finder'],
  ['Playlists', '/#playlists'], ['Satellites', '/#satellite-passes'],
  ['Tools', '/tools'], ['Resume', '/resume'], ['Projects', '/#coding-projects'], ['About', '/about'],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  return <header className="solara-site-header">
    <div className="solara-header-inner">
      <Link className="solara-header-brand" to="/" onClick={() => setOpen(false)} aria-label="Solara Radio home">
        <Radio size={32} aria-hidden="true" />
        <span><strong>Solara Radio</strong><small>Broadcasts from the backcountry of space and sky.</small></span>
      </Link>
      <button type="button" className="solara-menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="solara-main-nav" aria-label="Toggle navigation"><Menu size={23}/></button>
      <nav id="solara-main-nav" aria-label="Main navigation" className={`solara-header-nav ${open ? 'is-open' : ''}`}>
        {links.map(([label, href]) => href.startsWith('/#') ? <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a> : <Link key={label} to={href} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
      <div className="solara-header-actions">
        <button type="button" className="solara-location-header-button" onClick={() => setLocationOpen(true)} aria-label="Open location settings" title="Location settings"><MapPin size={18} /> <span>Location</span></button>
        <a href="https://github.com/solaranoir/radio-atlas" target="_blank" rel="noopener noreferrer" className="solara-atlas-link">Radio Atlas ↗</a>
        <a href="https://www.qrz.com/db/KK7QEA" target="_blank" rel="noopener noreferrer" aria-label="QRZ KK7QEA"><ExternalLink size={18}/></a>
        <a href="https://github.com/solaranoir" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub size={17}/></a>
        <a href="https://www.linkedin.com/in/kelly-simer" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin size={17}/></a>
      </div>
    </div>
    <LocationSettings open={locationOpen} onClose={() => setLocationOpen(false)} />
  </header>;
}
