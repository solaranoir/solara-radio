import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, LocateFixed } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const STATES = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');

export default function POTAWidget() {
  const [state, setState] = useState('');
  const [parks, setParks] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedPark, setSelectedPark] = useState(null);
  const [nearestPark, setNearestPark] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state) { setParks([]); setSelectedPark(null); return; }
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(''); setSelectedPark(null); setNearestPark(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/parks?state=${encodeURIComponent(state)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Park lookup failed (${response.status})`);
        const result = await response.json();
        if (!Array.isArray(result)) throw new Error('Unexpected park response');
        setParks(result);
      } catch (err) {
        if (err.name !== 'AbortError') { setError(err.message); setParks([]); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [state]);

  const matches = useMemo(() => parks.filter(p => `${p.name || ''} ${p.reference || ''}`.toLowerCase().includes(query.toLowerCase())).slice(0, 40), [parks, query]);

  function findNearest() {
    if (!navigator.geolocation) { setError('Your browser does not support geolocation.'); return; }
    setLocating(true); setError(''); setNearestPark(null);
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
      try {
        const params = new URLSearchParams({lat: String(coords.latitude), lon: String(coords.longitude)});
        const response = await fetch(`${API_BASE_URL}/api/nearest-park?${params}`);
        if (!response.ok) throw new Error(`Nearby park lookup failed (${response.status})`);
        const park = await response.json();
        if (!park?.reference) throw new Error('No nearby park was returned.');
        setNearestPark(park); setSelectedPark(park);
      } catch (err) { setError(err.message); }
      finally { setLocating(false); }
    }, () => { setError('Location permission was denied or location was unavailable.'); setLocating(false); }, {enableHighAccuracy: false, timeout: 12000});
  }

  const park = selectedPark || nearestPark;
  const lat = Number(park?.latitude);
  const lon = Number(park?.longitude);
  const validCoordinates = Number.isFinite(lat) && Number.isFinite(lon) && park?.latitude != null && park?.longitude != null;

  return (
    <div className="solara-widget !min-h-0 !max-h-none !overflow-visible space-y-5 border border-[#24666D]/50 bg-[#0C2F34] p-5 text-[#F2C79D] lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A3B68D]">Parks on the Air</p>
          <h3 className="mt-1 font-heading text-2xl text-[#F2C79D]">Park finder</h3>
          <p className="mt-1 max-w-2xl text-sm text-[#F2C79D]/75">Search POTA parks by state or find the nearest park. Live activator spots are available on POTA's official spotting page.</p>
        </div>
        <a href="https://pota.app/#/spots" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#EC935E]/60 px-3 py-2 text-sm font-semibold text-[#EC935E] hover:bg-[#EC935E]/10">Live spots <ExternalLink size={15}/></a>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <button type="button" onClick={findNearest} disabled={locating} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#EC935E] px-4 py-3 font-semibold text-[#0B1D29] hover:bg-[#F2C79D] disabled:opacity-60"><LocateFixed size={18}/>{locating ? 'Finding nearby parks…' : 'Find a park near me'}</button>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#A3B68D]"><span className="h-px flex-1 bg-[#24666D]"/>or search by state<span className="h-px flex-1 bg-[#24666D]"/></div>
          <label className="block text-sm font-medium" htmlFor="pota-state">State</label>
          <select id="pota-state" value={state} onChange={e => {setState(e.target.value); setQuery('');}} className="w-full rounded-lg border border-[#24666D] bg-[#0B1D29] p-3 text-[#F2C79D]"><option value="">Choose a state</option>{STATES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          <label className="block text-sm font-medium" htmlFor="pota-search">Park name or reference</label>
          <div className="relative"><Search size={17} className="absolute left-3 top-3.5 text-[#A3B68D]" aria-hidden="true"/><input id="pota-search" type="search" value={query} onChange={e => setQuery(e.target.value)} disabled={!state} placeholder="Filter parks…" className="w-full rounded-lg border border-[#24666D] bg-[#0B1D29] py-3 pl-10 pr-3 text-[#F2C79D] placeholder:text-[#A3B68D]/70 disabled:opacity-50"/></div>
          {loading && <p role="status" className="text-sm text-[#A3B68D]">Loading parks…</p>}
          {error && <p role="alert" className="rounded-lg border border-[#EC935E] p-3 text-sm text-[#F2C79D]">{error}</p>}
          {!loading && state && !error && <p className="text-xs text-[#A3B68D]">{parks.length} parks returned · showing up to 40 matches</p>}
          {state && !loading && matches.length > 0 && <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-[#24666D] p-2" aria-label="Matching POTA parks">{matches.map(p => <button type="button" key={p.reference} onClick={() => setSelectedPark(p)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#24666D]/60 ${selectedPark?.reference === p.reference ? 'bg-[#24666D]/60' : ''}`}><span className="block font-medium">{p.name}</span><span className="text-xs text-[#A3B68D]">{p.reference}</span></button>)}</div>}
        </div>
        <div className="flex min-h-[280px] flex-col justify-between rounded-xl border border-[#24666D]/60 bg-[#0B1D29] p-5">
          {park ? <div className="space-y-3"><span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A3B68D]"><MapPin size={14}/> Selected park</span><h4 className="font-heading text-xl">{park.name}</h4><p className="text-sm text-[#EC935E]">{park.reference}</p>{validCoordinates && <p className="text-sm text-[#F2C79D]/70">{lat.toFixed(4)}, {lon.toFixed(4)}</p>}{validCoordinates && <a className="inline-flex items-center gap-2 rounded-lg border border-[#24666D] px-3 py-2 text-sm hover:border-[#EC935E]" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`} target="_blank" rel="noopener noreferrer">View location on map <ExternalLink size={14}/></a>}</div> : <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-[#A3B68D]"><MapPin size={32}/><p>Choose a park to see its details and map link.</p></div>}
          <details className="mt-5 border-t border-[#24666D] pt-4 text-sm"><summary className="cursor-pointer font-semibold text-[#F2C79D]">POTA resources</summary><div className="mt-3 flex flex-wrap gap-3 text-[#EC935E]"><a href="https://pota.app/#/activator" target="_blank" rel="noopener noreferrer">Activator guide ↗</a><a href="https://pota.app/#/hunter" target="_blank" rel="noopener noreferrer">Hunter guide ↗</a><a href="https://pota.app/" target="_blank" rel="noopener noreferrer">POTA website ↗</a></div></details>
        </div>
      </div>
    </div>
  );
}
