import { useState } from 'react';
import Widget from '../components/Widget';
import CodingProjectsWidget from '../components/CodingProjectsWidget';
import SolarPositionsWidget from '../components/SolarPositionsWidget';
import SpotifySCMEmbedWidget from '../components/SpotifySCMEmbedWidget';
import Sidebar from '../components/Sidebar';
import LivePropagationWidget from '../components/LivePropagationWidget';
import HamRadioResourcesWidget from '../components/HamRadioResourcesWidget';
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
          <p className="solara-muted">A companion project to Solara Radio.</p>
          <a className="solara-button-primary" href="https://github.com/minedamnesia" target="_blank" rel="noopener noreferrer">Explore my projects ↗</a>
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
        <div className="solara-area-resources">
          <ExpandablePanel id="resources" title="Amateur Radio Resources" initiallyOpen={false}>
            <HamRadioResourcesWidget />
          </ExpandablePanel>
        </div>
        <div className="solara-area-utilities">
          <ExpandablePanel id="other-utilities" title="Additional Radio Utilities" initiallyOpen={false}>
            <p className="solara-muted">Grid locator, UTC conversion, MUF maps, reception reports, and more.</p>
            <Sidebar />
          </ExpandablePanel>
        </div>
      </div>
    </main>
  );
}
