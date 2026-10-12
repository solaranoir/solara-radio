const projects = [
  { name: 'Radio Atlas', symbol: '◎', summary: 'A living map of radio propagation and space weather.', description: 'A full-stack amateur radio intelligence platform combining observed reception, ionospheric and NOAA space-weather data, and an interactive globe. Built with Python, FastAPI, PostgreSQL, React, and TypeScript.', link: 'https://github.com/solaranoir/radio-atlas', live: 'https://radio-atlas-frontend.onrender.com/' },
  { name: 'Pocket Satellite Test Lab', symbol: '◈', summary: 'A virtual spacecraft, RF channel, and ground station.', description: 'A Python software/hardware-in-the-loop testbed for simulating spacecraft telemetry, variable RF link quality, packet loss, delay, and outages, with repeatable test scenarios.', link: 'https://github.com/solaranoir/pocketsat-testlab' },
  { name: 'API Rate Limiting Exercise', symbol: '≋', summary: 'Protecting APIs with token-bucket limits.', description: 'A Python/FastAPI proof of concept implementing configurable per-client and per-endpoint token buckets, tier-aware quotas, HTTP 429 responses with Retry-After, and automated tests. In-memory by design, with documented production trade-offs.', link: 'https://github.com/solaranoir/rate-limit-exercise' },
  { name: 'SolaraEcho', symbol: '⌁', summary: 'Research roadmap for RF propagation prediction.', description: 'An evolving Radio Atlas capability exploring received signal strength, path loss, and angle-of-arrival estimation across different radio environments. Research and planning stage.' },
  { name: 'SolaraSignal', symbol: '∿', summary: 'Research roadmap for RF signal detection and classification.', description: 'An evolving signal-analysis capability exploring RF detection, signal family identification, and modulation classification. Research and planning stage.' }
];
export default function CodingProjectsWidget() {
  return <div className="solara-projects-grid">{projects.map((project, index) =>
    <article key={project.name} className={`solara-project-card solara-project-card--${index + 1}`}>
      <div className="solara-project-card__art" aria-hidden="true">{project.symbol}</div>
      <div className="solara-project-card__body"><h3>{project.name}</h3><p>{project.summary}</p>
        <details><summary>Project details</summary><p>{project.description}</p></details>
        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}
        {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" style={{marginLeft:'1rem'}}>Open live app ↗</a>}
      </div>
    </article>)}</div>;
}
