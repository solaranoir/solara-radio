import { createContext, useContext, useEffect, useState } from 'react';
const GeolocationContext = createContext(null);
const KEY = 'solara-location-preferences-v1';
function loadPreference() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (raw.mode === 'manual' && Number.isFinite(raw.latitude) && Number.isFinite(raw.longitude) && Math.abs(raw.latitude) <= 90 && Math.abs(raw.longitude) <= 180) return raw;
    if (raw.mode === 'browser') return { mode: 'browser' };
  } catch (_) { /* Ignore unavailable storage. */ }
  return { mode: 'off' };
}
export function GeolocationProvider({ children }) {
  const [preference, setPreference] = useState(loadPreference);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const enabled = preference.mode !== 'off';
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(preference)); } catch (_) { /* Optional persistence. */ }
    if (preference.mode === 'off') { setLocation(null); setError(null); return undefined; }
    if (preference.mode === 'manual') { setLocation({ latitude: preference.latitude, longitude: preference.longitude }); setError(null); return undefined; }
    let active = true;
    setLocation(null);
    setError(null);
    if (!navigator.geolocation) { setError('Geolocation is not supported by this browser.'); return undefined; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { if (active) { setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }); setError(null); } },
      (err) => { if (active) { setLocation(null); setError(err.message); } },
      { timeout: 12000, maximumAge: 300000 }
    );
    return () => { active = false; };
  }, [preference]);
  const setEnabled = (value) => setPreference(value ? { mode: 'browser' } : { mode: 'off' });
  const setManualLocation = (latitude, longitude) => setPreference({ mode: 'manual', latitude, longitude });
  const clearLocation = () => setPreference({ mode: 'off' });
  return <GeolocationContext.Provider value={{ location, enabled, error, setEnabled, setManualLocation, clearLocation, locationMode: preference.mode }}>{children}</GeolocationContext.Provider>;
}
export function useGeolocation() { const context = useContext(GeolocationContext); if (!context) throw new Error('useGeolocation must be used within GeolocationProvider'); return context; }
export { GeolocationContext };
