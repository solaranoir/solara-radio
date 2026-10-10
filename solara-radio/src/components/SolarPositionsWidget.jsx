import { useEffect, useState } from 'react';
import { useGeolocation } from '../context/GeolocationProvider';
import '../styles/solar-dashboard.css';

const PROBABILITIES_URL = 'https://services.swpc.noaa.gov/json/solar_probabilities.json';
const SUN_URL = 'https://api.sunrise-sunset.org/json';

function readableTime(value) {
  if (!value) return 'Unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unavailable' : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function probability(value) {
  return value == null || value === '' ? '—' : `${value}%`;
}

export default function SolarPositionsWidget() {
  const { enabled, location } = useGeolocation();
  const lat = location?.latitude;
  const lon = location?.longitude;
  const hasLocation = enabled && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon));
  const [mode, setMode] = useState('weather');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      setData(null);
      if (mode === 'position' && !hasLocation) {
        setLoading(false);
        return;
      }
      try {
        const url = mode === 'weather'
          ? PROBABILITIES_URL
          : `${SUN_URL}?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lon)}&formatted=0`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const json = await response.json();
        const result = mode === 'weather' ? (Array.isArray(json) ? json[0] : null) : json.results;
        if (!result || (mode === 'position' && json.status !== 'OK')) throw new Error('No valid data returned');
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') setError('Solar data is temporarily unavailable.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [mode, hasLocation, lat, lon]);

  return (
    <div className="solara-solar-widget">
      <div className="solara-solar-tabs" role="group" aria-label="Solar information">
        <button type="button" className={mode === 'weather' ? 'is-active' : ''} aria-pressed={mode === 'weather'} onClick={() => setMode('weather')}>Solar weather</button>
        <button type="button" className={mode === 'position' ? 'is-active' : ''} aria-pressed={mode === 'position'} onClick={() => setMode('position')}>Sunrise & sunset</button>
      </div>
      {loading && <p role="status" className="solara-solar-note">Loading solar data…</p>}
      {error && <p role="alert" className="solara-solar-note">{error}</p>}
      {!loading && !error && mode === 'weather' && data && (
        <>
          <h3 className="solara-solar-subtitle">24-hour flare probability</h3>
          <div className="solara-solar-metrics">
            <div><span>C-class</span><strong>{probability(data.c_class_1_day)}</strong></div>
            <div><span>M-class</span><strong>{probability(data.m_class_1_day)}</strong></div>
            <div><span>X-class</span><strong>{probability(data.x_class_1_day)}</strong></div>
          </div>
          <div className="solara-solar-details">
            <p>10 MeV proton event: <strong>{probability(data['10mev_protons_1_day'])}</strong></p>
            <p>Polar cap absorption: <strong>{data.polar_cap_absorption || 'Unavailable'}</strong></p>
          </div>
          <p className="solara-solar-note">NOAA SWPC forecast probabilities, not observed flare counts.</p>
        </>
      )}
      {!loading && !error && mode === 'position' && !hasLocation && (
        <p className="solara-solar-note">Enable location in Location Settings to see sunrise, sunset, and solar noon for your area. No default location is assumed.</p>
      )}
      {!loading && !error && mode === 'position' && data && (
        <div className="solara-solar-metrics">
          <div><span>Sunrise</span><strong>{readableTime(data.sunrise)}</strong></div>
          <div><span>Solar noon</span><strong>{readableTime(data.solar_noon)}</strong></div>
          <div><span>Sunset</span><strong>{readableTime(data.sunset)}</strong></div>
        </div>
      )}
      <p className="solara-solar-source">Source: <a href="https://www.swpc.noaa.gov/" target="_blank" rel="noopener noreferrer">NOAA SWPC</a>{mode === 'position' && <> · <a href="https://sunrise-sunset.org/api" target="_blank" rel="noopener noreferrer">Sunrise-Sunset API</a></>}</p>
    </div>
  );
}
