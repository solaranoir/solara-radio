import { useEffect, useMemo, useState } from 'react';
import { useGeolocation } from '../context/GeolocationProvider';
import { API_BASE_URL } from '../config/api';

const SATELLITES = [
  { name: 'AO-07 (AMSAT-OSCAR 7)', noradId: 7530 },
  { name: 'AO-73 (FUNcube-1)', noradId: 39444 },
  { name: 'AO-91 (RadFxSat)', noradId: 43017 },
  { name: 'AO-92 (Fox-1D)', noradId: 43137 },
  { name: 'CAS-4A', noradId: 42761 },
  { name: 'CAS-4B', noradId: 42759 },
  { name: 'FO-29 (JAS-2)', noradId: 24278 },
  { name: 'Hubble Space Telescope', noradId: 20580 },
  { name: 'ISS (ZARYA)', noradId: 25544 },
  { name: 'JO-97 (JY1SAT)', noradId: 43803 },
  { name: 'LilacSat-2 (CAS-3H)', noradId: 40908 }, 
  { name: 'NOAA 15', noradId: 25338 },
  { name: 'NO-84 (PSAT)', noradId: 40654 },
  { name: 'PO-101 (Diwata-2)', noradId: 43678 },
  { name: 'SO-50 (SaudiSat-1C)', noradId: 27607 },
  { name: 'TEVEL-1', noradId: 51031 },
  { name: 'TEVEL-2', noradId: 51032 },
  { name: 'Tiangong Space Station (CSS)', noradId: 48274 },
  { name: 'TO-108 (CAS-6)', noradId: 44881 },
  { name: 'UKube-1', noradId: 40074 },
  { name: 'XW-2A', noradId: 40903 },
  { name: 'XW-2B', noradId: 40911 },
  { name: 'XW-2F', noradId: 40910 }
];

const validLat = value => value !== '' && Number.isFinite(Number(value)) && Number(value) >= -90 && Number(value) <= 90;
const validLon = value => value !== '' && Number.isFinite(Number(value)) && Number(value) >= -180 && Number(value) <= 180;
const timeLabel = seconds => new Date(seconds * 1000).toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
const compass = angle => Number.isFinite(Number(angle)) ? `${Math.round(Number(angle))}°` : '—';

export default function SatellitePassWidget() {
  const { location, enabled, error: geoError, setEnabled } = useGeolocation();
  const [noradId, setNoradId] = useState(25544);
  const [manual, setManual] = useState(true);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedAt, setFetchedAt] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer); }, []);
  const latitude = manual ? lat : location?.latitude;
  const longitude = manual ? lon : location?.longitude;
  const ready = validLat(latitude) && validLon(longitude);
  useEffect(() => {
    if (!ready) { setPasses([]); setFetchedAt(null); return; }
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(''); setPasses([]);
      try {
        const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude), noradId: String(noradId) });
        const response = await fetch(`${API_BASE_URL}/api/satellite-passes?${params}`, { signal: controller.signal });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || `Satellite service returned ${response.status}`);
        if (!Array.isArray(json.passes)) throw new Error('Unexpected satellite pass response.');
        const upcoming = json.passes.filter(p => Number.isFinite(Number(p.startUTC)) && Number(p.startUTC) * 1000 + Number(p.duration || 0) * 1000 > Date.now()).sort((a,b) => a.startUTC - b.startUTC);
        setPasses(upcoming); setFetchedAt(new Date());
      } catch (err) { if (err.name !== 'AbortError') setError(err.message || 'Unable to load satellite passes.'); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [latitude, longitude, noradId, ready, refresh]);
  const next = useMemo(() => passes.find(p => (Number(p.startUTC) + Number(p.duration || 0)) * 1000 > now), [passes, now]);
  const until = next ? Math.max(0, Math.floor((Number(next.startUTC) * 1000 - now) / 1000)) : null;
  const countdown = until === null ? 'No upcoming pass' : until === 0 ? 'Pass underway' : `${Math.floor(until / 3600)}h ${Math.floor(until % 3600 / 60)}m until AOS`;
  const selected = SATELLITES.find(s => s.noradId === noradId);
  return <div className="solara-instrument">
    <div className="solara-instrument__intro"><span className="solara-instrument__eyebrow">Orbital operations</span><p>Predict radio-visible passes from your observing position. Times are shown in your browser's local timezone.</p></div>
    <label>Satellite<select value={noradId} onChange={e => setNoradId(Number(e.target.value))}>{SATELLITES.map(s => <option value={s.noradId} key={s.noradId}>{s.name}</option>)}</select></label>
    <div className="solara-instrument__switch" role="group" aria-label="Location source"><button type="button" className={manual?'active':''} onClick={() => setManual(true)}>Manual coordinates</button><button type="button" className={!manual?'active':''} onClick={() => {setManual(false);setEnabled(true);}}>Browser location</button></div>
    {manual ? <div className="solara-instrument__fields"><label>Latitude<input type="number" min="-90" max="90" step="any" placeholder="36.1699" value={lat} onChange={e => setLat(e.target.value)}/></label><label>Longitude<input type="number" min="-180" max="180" step="any" placeholder="-115.1398" value={lon} onChange={e => setLon(e.target.value)}/></label></div> : <p className="solara-instrument__hint">{geoError ? `Location: ${geoError}` : enabled && location ? `Using ${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}` : 'Waiting for browser location permission…'}</p>}
    {manual && (lat || lon) && !ready && <p className="solara-instrument__error">Enter valid latitude (−90 to 90) and longitude (−180 to 180).</p>}
    <div className="solara-instrument__toolbar"><span>{selected?.name} · NORAD {noradId}</span><button type="button" disabled={!ready || loading} onClick={() => setRefresh(v=>v+1)}>{loading ? 'Loading…' : 'Refresh ↻'}</button></div>
    {error && <p role="alert" className="solara-instrument__error">{error}</p>}
    {!ready && <div className="solara-instrument__empty">Choose a location to calculate passes.</div>}
    {ready && !loading && !error && <><div className="solara-instrument__next"><span>Next pass</span><strong>{countdown}</strong>{next && <small>{timeLabel(Number(next.startUTC))} · Max elevation {Math.round(Number(next.maxEl) || 0)}°</small>}</div>
      {passes.length ? <div className="solara-instrument__pass-list">{passes.map((p,i) => <article className="solara-instrument__pass" key={`${p.startUTC}-${i}`}><strong>{timeLabel(Number(p.startUTC))}</strong><span>Max elevation {Math.round(Number(p.maxEl) || 0)}° · {Math.round(Number(p.duration || 0)/60)} min</span><small>AOS {compass(p.startAz)} · LOS {compass(p.endAz)}</small></article>)}</div> : <p className="solara-instrument__hint">No qualifying radio passes returned for the next two days. Try another satellite.</p>}</>}
    {fetchedAt && <p className="solara-instrument__hint">Updated {fetchedAt.toLocaleTimeString()} · Source: N2YO radio-pass predictions via Solara backend. Frequencies are not supplied by this endpoint.</p>}
  </div>;
}
