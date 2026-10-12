import { useEffect, useState } from 'react';
import { useGeolocation } from '../context/GeolocationProvider';

export default function LocationSettings({ open, onClose }) {
  const { enabled, setEnabled, location, error, setManualLocation, clearLocation } = useGeolocation();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [validation, setValidation] = useState('');
  useEffect(() => {
    if (!open) return undefined;
    const handleEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);
  if (!open) return null;
  const saveManual = (event) => {
    event.preventDefault();
    const lat = Number(latitude), lon = Number(longitude);
    if (!latitude.trim() || !longitude.trim() || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setValidation('Enter a latitude from -90 to 90 and longitude from -180 to 180.');
      return;
    }
    setValidation('');
    setManualLocation(lat, lon);
  };
  return <div className="solara-location-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="solara-location-dialog" role="dialog" aria-modal="true" aria-labelledby="solara-location-title">
      <div className="solara-location-dialog__head"><div><p className="solara-eyebrow">Field station · Preferences</p><h2 id="solara-location-title">Location Settings</h2></div><button type="button" onClick={onClose} aria-label="Close location settings">✕</button></div>
      <p>Use your location for sunrise, sunset, solar noon, and satellite predictions. Location is optional.</p>
      <label className="solara-location-check"><input type="checkbox" checked={Boolean(enabled)} onChange={(e) => setEnabled(e.target.checked)} /> Use my browser location</label>
      {location && <p className="solara-location-status" role="status">Active coordinates: {Number(location.latitude).toFixed(4)}°, {Number(location.longitude).toFixed(4)}°</p>}
      {error && <p role="alert" className="solara-location-error">{String(error)}</p>}
      <form onSubmit={saveManual} className="solara-location-form"><h3>Or enter coordinates manually</h3><div className="solara-location-coordinates"><label>Latitude<input type="number" step="any" min="-90" max="90" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="-90 to 90" /></label><label>Longitude<input type="number" step="any" min="-180" max="180" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-180 to 180" /></label></div>{validation && <p role="alert" className="solara-location-error">{validation}</p>}<div className="solara-location-actions"><button type="submit">Use coordinates</button><button type="button" onClick={clearLocation}>Disable location</button></div></form>
      <p className="solara-location-note">Your preference and manually entered coordinates are saved in this browser only. Browser coordinates are not stored between visits. The browser will ask permission before sharing precise location.</p>
    </section>
  </div>;
}
