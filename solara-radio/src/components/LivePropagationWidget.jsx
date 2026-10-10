import { useEffect, useState } from 'react';
import { useGeolocation } from '../context/GeolocationProvider';
import VOACAPPrediction from './VOACAPPrediction';
import '../styles/solar-dashboard.css';

const NOAA_FUNCTION = '/.netlify/functions/noaa';

function Metric({ label, value, explanation }) {
  return <div className="solara-prop-metric"><span title={explanation}>{label}</span><strong>{value ?? '—'}</strong></div>;
}

export default function LivePropagationWidget() {
  const { enabled, location } = useGeolocation();
  const lat = location?.latitude;
  const lon = location?.longitude;
  const hasLocation = enabled && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retried, setRetried] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(NOAA_FUNCTION, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('Invalid NOAA response');
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setData(null);
          setError('Propagation indices are unavailable right now. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [retried]);

  return (
    <div className="solara-prop-widget">
      <div className="solara-prop-heading">
        <h3>Live propagation conditions</h3>
        <button type="button" className="solara-prop-refresh" onClick={() => setRetried(n => n + 1)} disabled={loading}>Refresh</button>
      </div>
      {loading && <p className="solara-solar-note" role="status">Loading NOAA conditions…</p>}
      {error && <p className="solara-solar-note" role="alert">{error}</p>}
      {!loading && data && (
        <>
          <div className="solara-prop-metrics">
            <Metric label="Kp" value={data.kp} explanation="Planetary geomagnetic activity index" />
            <Metric label="Ap" value={data.ap} explanation="Daily geomagnetic activity index" />
            <Metric label="SFI" value={data.sfi} explanation="10.7 cm solar radio flux" />
          </div>
          <div className="solara-prop-scales" aria-label="NOAA space weather scales">
            <Metric label="Geomagnetic · G" value={data.gScale} />
            <Metric label="Radiation · S" value={data.sScale} />
            <Metric label="Radio blackout · R" value={data.rScale} />
          </div>
          {data.warnings?.length > 0 && <p className="solara-solar-note" role="status">Some NOAA sources are temporarily unavailable: {data.warnings.join("; ")}</p>}
          <p className="solara-solar-note">Observed indices and NOAA scales are not band-by-band propagation predictions. Actual HF paths depend on time, frequency, geometry, and ionospheric conditions.</p>
          <p className="solara-solar-note">Source update: {data.time || 'Timestamp unavailable'}</p>
        </>
      )}
      <div className="solara-prop-location">
        {hasLocation ? (
          <>
            <p>Location-enabled propagation prediction</p>
            <VOACAPPrediction txLat={Number(lat)} txLon={Number(lon)} />
          </>
        ) : (
          <p className="solara-solar-note">For location-specific VOACAP predictions, enable geolocation in Location Settings. Global space-weather indices remain available without it.</p>
        )}
      </div>
      <p className="solara-solar-source">Data endpoint: <code>{NOAA_FUNCTION}</code></p>
    </div>
  );
}
