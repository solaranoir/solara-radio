import { useEffect, useState } from 'react';
import { useGeolocation } from '../context/GeolocationProvider';

const radiusKm = 15;
export default function LocalPlantsWidget() {
  const { location, enabled } = useGeolocation();
  const [place, setPlace] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [plants, setPlants] = useState([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (enabled && location) {
      setLatitude(String(location.latitude));
      setLongitude(String(location.longitude));
    }
  }, [enabled, location]);

  async function searchAt(lat, lon) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error('Enter valid latitude (−90 to 90) and longitude (−180 to 180).');
    const params = new URLSearchParams({lat: String(lat), lng: String(lon), radius: String(radiusKm), taxon_id: '47126', per_page: '100', order_by: 'observed_on', quality_grade: 'research'});
    const response = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?${params}`);
    if (!response.ok) throw new Error(`iNaturalist returned ${response.status}. Please try again.`);
    const result = await response.json();
    const rows = (result.results || []).filter(r => r.taxon?.preferred_common_name || r.taxon?.name);
    setPlants(rows.map(r => ({id: r.taxon.id, name: r.taxon.preferred_common_name || r.taxon.name, scientific: r.taxon.name, photo: r.taxon.default_photo?.medium_url || r.taxon.default_photo?.url, count: r.count})));
    setPage(0); setSearched(true);
  }
  async function performSearch(event) {
    event.preventDefault(); setBusy(true); setError(''); setSearched(false); setPlants([]);
    try {
      let lat, lon;
      if (place.trim()) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place.trim())}`);
        if (!response.ok) throw new Error('Place search is unavailable. Try coordinates instead.');
        const matches = await response.json();
        if (!matches.length) throw new Error('Place not found. Try a city, park, or more specific location.');
        lat = Number(matches[0].lat); lon = Number(matches[0].lon);
        setLatitude(String(lat)); setLongitude(String(lon));
      } else { lat = Number(latitude); lon = Number(longitude); if (!latitude.trim() || !longitude.trim()) throw new Error('Enter a place name or latitude and longitude.'); }
      await searchAt(lat, lon);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <div className="solara-widget !min-h-0 !max-h-none !overflow-visible" style={{color:'#F2C79D'}}>
    <h3 className="widget-heading">Local Plants</h3>
    <p className="mb-4 text-sm" style={{color:'#A3B68D'}}>Discover plant species observed near a park, town, or trail. Powered by community observations from iNaturalist.</p>
    <form onSubmit={performSearch} className="space-y-3">
      <label htmlFor="plants-place" className="block text-sm">Place name</label>
      <input id="plants-place" value={place} onChange={e=>setPlace(e.target.value)} placeholder="e.g. Red Rock Canyon, Nevada" className="w-full rounded-lg border p-3" style={{background:'#0B1D29',borderColor:'#24666D',color:'#F2C79D'}} />
      <p className="text-xs" style={{color:'#A3B68D'}}>Or leave the place blank and use coordinates (your Location Settings can fill these).</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm">Latitude<input type="number" step="any" value={latitude} onChange={e=>setLatitude(e.target.value)} placeholder="36.135" className="mt-1 w-full rounded-lg border p-3" style={{background:'#0B1D29',borderColor:'#24666D',color:'#F2C79D'}} /></label>
        <label className="text-sm">Longitude<input type="number" step="any" value={longitude} onChange={e=>setLongitude(e.target.value)} placeholder="-115.427" className="mt-1 w-full rounded-lg border p-3" style={{background:'#0B1D29',borderColor:'#24666D',color:'#F2C79D'}} /></label>
      </div>
      <button type="submit" disabled={busy} className="rounded-lg px-5 py-3 font-semibold disabled:opacity-50" style={{background:'#EC935E',color:'#0B1D29'}}>{busy?'Finding plants…':'Find local plants'}</button>
    </form>
    {error && <p role="alert" className="mt-4 text-sm" style={{color:'#EC935E'}}>{error}</p>}
    {searched && <p className="my-4 text-sm" role="status">{plants.length ? `${plants.length} species found within ${radiusKm} km (research-grade observations).` : 'No research-grade plant observations found here. Try another place.'}</p>}
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">{plants.slice(page*9,(page+1)*9).map(plant=><a key={plant.id} href={`https://www.inaturalist.org/taxa/${plant.id}`} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border p-2" style={{borderColor:'#24666D',background:'#0C2F34'}}>{plant.photo && <img src={plant.photo} alt={plant.name} className="mb-2 h-36 w-full rounded object-cover" loading="lazy"/>}<strong className="block text-sm">{plant.name}</strong><span className="block text-xs" style={{color:'#A3B68D'}}>{plant.scientific} · {plant.count} observations</span></a>)}</div>
    {plants.length>9 && <div className="mt-4 flex items-center gap-4"><button type="button" disabled={page===0} onClick={()=>setPage(p=>p-1)}>← Previous</button><span>{page+1} / {Math.ceil(plants.length/9)}</span><button type="button" disabled={(page+1)*9>=plants.length} onClick={()=>setPage(p=>p+1)}>Next →</button></div>}
    <p className="mt-4 text-xs" style={{color:'#A3B68D'}}>Observations reflect community reporting, not a complete inventory. Please observe local access rules and avoid collecting protected plants.</p>
  </div>;
}
