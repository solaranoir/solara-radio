import '../pages/ToolsReadability.css';
import { Link } from 'react-router-dom';

export default function Widget({ title, description, customClass = '', nestedWidget, link, image }) {
  const isAboutMe = title === 'About Me';
  return (
    <div className={`solara-widget ${isAboutMe ? 'solara-about-widget' : ''} ${customClass}`.trim()}>
      {image && <img src={image} alt={isAboutMe ? 'KK7QEA amateur radio QSL card' : title} className="solara-widget__image" />}
      <h2 className="widget-heading">{isAboutMe ? <Link to="/about">About Me</Link> : link ? <a href={link}>{title}</a> : title}</h2>
      {isAboutMe ? <div className="solara-about-widget__preview"><p>I'm Kelly, KK7QEA: software engineer, Extra class amateur radio operator, and a big fan of portable operating, curious projects, and finding the next trail.</p><Link className="solara-about-widget__cta" to="/about">Read my story ↗</Link></div> : <p className="solara-widget__description">{description}</p>}
      {nestedWidget && <div className="solara-widget__nested">{nestedWidget}</div>}
    </div>
  );
}
