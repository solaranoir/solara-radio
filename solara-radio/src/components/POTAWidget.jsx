import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, LocateFixed, RefreshCw, Search } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import POTAMap from './POTAMap';

const STATES = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
const SPOTS_URL = `${API_BASE_URL}/api/pota/spots`;
const getRef = item => item?.reference || item?.parkReference || item?.park || '';
const getCall = item => item?.callsign || item?.activator || item?.activatorCallsign || '';
const timeLabel = item => {
  const raw = item?.spotTime || item?.time || item?.timestamp || item?.createdAt;
  if (!raw) return 'Time unavailable';
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? 'Time unavailable' : d.toLocaleString();
};

export default function POTAWidget() {
  const [view, setView] = useState('spots');
  const [state, setState] = useState('');
  const [parks, setParks] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loadingParks, setLoadingParks] = useState(false);
  const [locating, setLocating] = useState(false);
  const [parkError, setParkError] = useState('');
  const [spots, setSpots] = useState([]);
  const [spotError, setSpotError] = useState('');
  const [loadingSpots, setLoadingSpots] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [spotFilter, setSpotFilter] = useState('');

  useEffect(() => {
    if (!state) { setParks([]); return; }
    const controller = new AbortController();
    setLoadingParks(true); setParkError('');
    fetch(`${API_BASE_URL}/api/parks?state=${encodeURIComponent(state)}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`Park service returned ${r.status}`); return r.json(); })
      .then(data => { if (!Array.isArray(data)) throw new Error('Unexpected park response'); setParks(data); })
      .catch(e => { if (e.name !== 'AbortError') { setParkError(e.message); setParks([]); } })
      .finally(() => { if (!controller.signal.aborted) setLoadingParks(false); });
    return () => controller.abort();
  }, [state]);

  const loadSpots = useCallback(async () => {
    setLoadingSpots(true); setSpotError('');
    try {
      const response = await fetch(SPOTS_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Spot service returned ${response.status}`);
      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : payload.spots;
      if (!Array.isArray(list)) throw new Error('Unexpected spots response');
      setSpots(list); setUpdatedAt(new Date());
    } catch (error) {
      setSpots([]); setUpdatedAt(null);
      setSpotError(`${error.message}. Live spots require a backend /api/pota/spots endpoint.`);
    } finally { setLoadingSpots(false); }
  }, []);
  useEffect(() => { loadSpots(); }, [loadSpots]);

  const matches = useMemo(() => parks.filter(p => `${p.name || ''} ${getRef(p)}`.toLowerCase().includes(query.toLowerCase())).slice(0, 60), [parks, query]);
  const filteredSpots = useMemo(() => spots.filter(s => `${getCall(s)} ${getRef(s)} ${s.parkName || ''} ${s.mode || ''} ${s.frequency || ''}`.toLowerCase().includes(spotFilter.toLowerCase())).slice(0, 80), [spots, spotFilter]);
  const mapParks = view === 'spots' ? [] : matches;
  const mapSpots = view === 'spots' ? filteredSpots : [];

  function findNearest() {
    if (!navigator.geolocation) { setParkError('Geolocation is not supported.'); return; }
    setLocating(true); setParkError('');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const params = new URLSearchParams({ lat: String(coords.latitude), lon: String(coords.longitude) });
        const response = await fetch(`${API_BASE_URL}/api/nearest-park?${params}`);
        if (!response.ok) throw new Error(`Nearby park lookup returned ${response.status}`);
        const park = await response.json();
        if (!getRef(park)) throw new Error('No nearby park returned');
        setSelected(park);
      } catch (error) { setParkError(error.message); }
      finally { setLocating(false); }
    }, () => { setParkError('Location permission denied or unavailable. Use state search instead.'); setLocating(false); }, { timeout: 12000, enableHighAccuracy: false });
  }

  return (
    <div className="pota-console">
      <div className="pota-console-header"><div><p className="pota-kicker">Parks on the Air · Field operations</p><h3>POTA Spot Finder</h3><p>Discover live activations, explore parks, and prepare for the next field day.</p></div><a href="https://pota.app/#/spots" target="_blank" rel="noopener noreferrer" className="pota-link">Official POTA spots <ExternalLink size={14}/></a></div>
      <div className="pota-view-tabs" role="tablist" aria-label="POTA tools">
        {[['spots','Live Spots'], ['parks','Find a Park'], ['trip','Plan a Trip']].map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={view === key} className={view === key ? 'active' : ''} onClick={() => setView(key)}>{label}</button>)}
      </div>
      <div className="pota-console-grid">
        <div className="pota-console-controls">
          {view === 'spots' ? <>
            <div className="pota-row"><label htmlFor="pota-spots-filter">Activation search</label><button type="button" onClick={loadSpots} disabled={loadingSpots} className="pota-link"><RefreshCw size={14}/> Refresh</button></div>
            <div className="pota-search"><Search size={17}/><input id="pota-spots-filter" value={spotFilter} onChange={e => setSpotFilter(e.target.value)} placeholder="Callsign, park, frequency, mode" /></div>
            <p className="pota-status" role="status">{loadingSpots ? 'Loading live spots…' : updatedAt ? `Retrieved ${updatedAt.toLocaleTimeString()} · ${spots.length} spots` : 'Live feed not connected'}</p>
            {spotError && <p role="alert" className="pota-alert">{spotError} <a href="https://pota.app/#/spots" target="_blank" rel="noopener noreferrer">View live spots on POTA ↗</a></p>}
            <div className="pota-result-list">{filteredSpots.map((s, i) => <button key={`${getCall(s)}-${getRef(s)}-${i}`} type="button" onClick={() => setSelected(s)} className="pota-result"><strong>{getCall(s) || 'Unknown callsign'}</strong><span>{getRef(s) || s.parkName || 'Unknown park'}</span><small>{s.frequency || 'Freq n/a'} · {s.mode || 'Mode n/a'}</small><small>{timeLabel(s)}</small></button>)}{!loadingSpots && !spotError && filteredSpots.length === 0 && <p className="pota-status">No matching live activations.</p>}</div>
          </> : <>
            <button type="button" className="pota-primary" onClick={findNearest} disabled={locating}><LocateFixed size={17}/>{locating ? 'Finding nearest park…' : 'Find a park near me'}</button>
            <label htmlFor="pota-state">Search by state</label><select id="pota-state" value={state} onChange={e => { setState(e.target.value); setQuery(''); setSelected(null); }}><option value="">Choose a state</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>
            <label htmlFor="pota-park-search">Park name or reference</label><div className="pota-search"><Search size={17}/><input id="pota-park-search" value={query} disabled={!state} onChange={e => setQuery(e.target.value)} placeholder="Filter parks…"/></div>
            {loadingParks && <p role="status" className="pota-status">Loading parks…</p>}{parkError && <p role="alert" className="pota-alert">{parkError}</p>}
            {state && !loadingParks && <p className="pota-status">{parks.length} parks returned · first 60 matches shown</p>}
            <div className="pota-result-list">{matches.map(p => <button type="button" key={getRef(p)} onClick={() => setSelected(p)} className="pota-result"><strong>{p.name}</strong><span>{getRef(p)}</span></button>)}</div>
            {view === 'trip' && <p className="pota-status">Select a park, then use Nearby trails and Local plants in the field tools above for further exploration.</p>}
          </>}
        </div>
        <div className="pota-map-column"><POTAMap parks={mapParks} spots={mapSpots} selected={selected} onSelect={setSelected}/>
          <div className="pota-selected">{selected ? <><strong>{selected.name || selected.parkName || getCall(selected) || 'Selected location'}</strong><span>{getRef(selected)} {getCall(selected) ? `· ${getCall(selected)}` : ''}</span>{selected.latitude != null && selected.longitude != null && <a target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${Number(selected.latitude)}&mlon=${Number(selected.longitude)}#map=12/${Number(selected.latitude)}/${Number(selected.longitude)}`}>View on OpenStreetMap ↗</a>}</> : <span>Choose a park or spot to inspect it. Map pins appear only when coordinates are available.</span>}</div>
        </div>
      </div>
    </div>
  );
}
