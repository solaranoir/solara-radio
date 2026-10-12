import Sidebar from '../components/Sidebar';
import HamRadioResourcesWidget from '../components/HamRadioResourcesWidget';
import './ToolsReadability.css';
export default function Tools() {
  return <main className="solara-tools-page">
    <p className="solara-eyebrow">Field station · Utility desk</p>
    <h1>Radio Tools</h1>
    <p className="solara-muted">Grid locators, UTC time, propagation maps, reception reports and more. Location-based tools request permission when needed.</p>
    <div className="solara-tools-page__grid"><section className="solara-surface"><h2>Station utilities</h2><Sidebar /></section><section className="solara-surface"><h2>Amateur radio resources</h2><HamRadioResourcesWidget /></section></div>
  </main>;
}
