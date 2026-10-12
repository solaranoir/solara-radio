import { useState } from 'react';
import Widget from '../components/Widget';
import CodingProjectsWidget from '../components/CodingProjectsWidget';
import SolarPositionsWidget from '../components/SolarPositionsWidget';
import SpotifySCMEmbedWidget from '../components/SpotifySCMEmbedWidget';
import LivePropagationWidget from '../components/LivePropagationWidget';
import PotaHikingPlantsTabs from '../components/PotaHikingPlantsTabs';
import SatellitePassWidget from '../components/SatellitePassWidget';
import MorseCodePracticeWidget from '../components/MorseCodePracticeWidget';

function ExpandablePanel({ title, children, initiallyOpen = true, id, className = "" }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <section className={`solara-surface solara-expandable ${className}`.trim()} id={id}>
      <div className="solara-section-heading">
        <h2>{title}</h2>
        <button type="button" className="solara-expand-toggle" aria-expanded={open}
          aria-controls={`${id}-body`} onClick={() => setOpen((value) => !value)}>
          {open ? 'Collapse −' : 'Expand +'}
        </button>
      </div>
      <div id={`${id}-body`} hidden={!open}>{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="solara-home">
     <section
       className="solara-hero"
       aria-labelledby="solara-hero-title"
       style={{
         backgroundImage:
           "linear-gradient(90deg, rgba(11,29,41,0.8) 0%, rgba(11,29,41,0.15) 75%), url('/solara-hero.png')"
       }}
      >
        <div className="solara-hero__content">
          <p className="solara-eyebrow">Amateur radio · Space · Nature · Technology</p>
          <h1 className="solara-hero__title" id="solara-hero-title">Signals from a Wilder Universe</h1>
          <p className="solara-hero__subtitle">Amateur radio, astronomy, hiking, and technology, connected by curiosity.</p>
          <div className="solara-hero-actions">
            <a className="solara-button-primary" href="#solara-tools">Explore the tools ↓</a>
            <a className="solara-button-secondary" href="#about-me">About me</a>
          </div>
        </div>
      </section>

      <div className="solara-dashboard solara-dashboard--command" id="solara-tools">
        <ExpandablePanel id="solar-conditions" className="solara-area-solar" title="Solar Conditions">
          <div className="solara-solar-cluster">
            <SolarPositionsWidget />
            <LivePropagationWidget />
          </div>
        </ExpandablePanel>

        <section className="solara-surface solara-atlas solara-area-atlas" aria-labelledby="atlas-heading">
          <p className="solara-eyebrow">Explore the science behind the signal</p>
          <h2 id="atlas-heading">Solara Radio Atlas</h2>
          <p>Explore propagation, ionospheric data, and signal analysis in the companion research project.</p>
          <a className="solara-atlas__preview" href="https://radio-atlas-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" aria-label="Open the live Radio Atlas interactive globe">
            <img src="/radio-atlas-preview.webp" alt="Radio Atlas interface showing a three-dimensional Earth globe with auroral activity, observation filters, and radio-activity replay controls" loading="lazy" />
            <span className="solara-atlas__preview-label">Explore the interactive globe ↗</span>
          </a>
          <div className="solara-atlas__actions">
            <a className="solara-button-primary" href="https://radio-atlas-frontend.onrender.com/" target="_blank" rel="noopener noreferrer">Launch Radio Atlas ↗</a>
            <a className="solara-atlas__code-link" href="https://github.com/solaranoir/radio-atlas" target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a>
          </div>
        </section>

        <div className="solara-area-pota">
          <ExpandablePanel id="pota-finder" title="POTA · Parks and Field Exploration">
            <PotaHikingPlantsTabs />
          </ExpandablePanel>
        </div>

        <div className="solara-entertainment-row">
        <section className="solara-surface solara-area-playlists" id="playlists" aria-label="Giddy Up Galaxy playlists">
          <div className="solara-section-heading"><h2>Giddy Up Galaxy</h2></div>
          <SpotifySCMEmbedWidget />
        </section>
        <ExpandablePanel id="satellite-passes" className="solara-area-satellite" title="Satellite Pass Predictor" initiallyOpen={false}>
          <SatellitePassWidget />
        </ExpandablePanel>
        <ExpandablePanel id="morse-practice" className="solara-area-morse" title="Morse Code Practice" initiallyOpen={false}>
          <MorseCodePracticeWidget />
        </ExpandablePanel>

        </div>

        <section className="solara-surface solara-about solara-area-about" id="about-me" aria-label="About me and QSL card">
          <Widget title="About Me" description="Software developer and Extra class amateur radio operator." image="/qsl.png" />
        </section>

        <div className="solara-area-projects">
          <ExpandablePanel id="projects" title="Featured Coding Projects">
            <CodingProjectsWidget />
          </ExpandablePanel>
        </div>
        <section className="solara-tools-cta solara-surface">
          <div><p className="solara-eyebrow">Field station</p><h2>Looking for more radio tools?</h2><p>Grid locator, UTC clock, MUF maps, reception reports, and radio resources now have their own workspace.</p></div>
          <a className="solara-button-primary" href="/tools">Open the Tools Desk ↗</a>
        </section>
      </div>
    </main>
  );
}
