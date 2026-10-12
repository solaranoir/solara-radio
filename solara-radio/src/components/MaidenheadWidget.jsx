import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '../context/GeolocationProvider';

export default function MaidenheadWidget() {
  const { location, enabled, error: geoError } = useGeolocation();
  const [grid, setGrid] = useState('');
  const [latlon, setLatlon] = useState({ lat: '', lon: '' });
  const [manualMode, setManualMode] = useState(false);
  const [manualError, setManualError] = useState('');

  useEffect(() => {
    if (enabled && location) {
      const lat = location.latitude;
      const lon = location.longitude;
      setLatlon({ lat: lat.toFixed(5), lon: lon.toFixed(5) });
      setGrid(latLonToMaiden(lat, lon));
      setManualMode(false);
    } else if (!enabled) {
      setManualMode(true);
    }
  }, [enabled, location]);

  function latLonToMaiden(lat, lon) {
    lat += 90;
    lon += 180;

    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const a = 'abcdefghijklmnopqrstuvwxyz';

    const field = A[Math.floor(lon / 20)] + A[Math.floor(lat / 10)];
    const square = `${Math.floor((lon % 20) / 2)}${Math.floor(lat % 10)}`;
    const subsquare =
      a[Math.floor(((lon % 2) / 2) * 24)] + a[Math.floor(((lat % 1) / 1) * 24)];

    return field + square + subsquare;
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    const lat = parseFloat(latlon.lat);
    const lon = parseFloat(latlon.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180 || !latlon.lat.trim() || !latlon.lon.trim()) {
      setManualError('Enter latitude from -90 to 90 and longitude from -180 to 180.');
      return;
    }
    setManualError('');
    setGrid(latLonToMaiden(lat, lon));
  }

  return (
    <div className="sidebar-widget text-center">
      <h3 className="sidebar-heading flex justify-center items-center gap-2">
        <MapPin size={20} />
        Grid Locator
      </h3>

      {grid ? (
        <>
          <p className="font-sans text-gunmetal text-sm mb-2">Your grid square is:</p>
          <div className="text-3xl font-bold text-gunmetal bg-tan py-2 px-4 rounded-lg inline-block border border-persian-orange">
            {grid}
          </div>
          {latlon.lat && latlon.lon && (
            <p className="mt-2 text-xs text-gunmetal">
              ({latlon.lat}, {latlon.lon})
            </p>
          )}
        </>
      ) : manualMode ? (
        <>
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Latitude (e.g., 36.123)"
                className="rounded p-2 bg-tan text-gunmetal placeholder-gunmetal"
                value={latlon.lat}
                onChange={(e) => setLatlon((prev) => ({ ...prev, lat: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Longitude (e.g., -115.456)"
                className="rounded p-2 bg-tan text-gunmetal placeholder-gunmetal"
                value={latlon.lon}
                onChange={(e) => setLatlon((prev) => ({ ...prev, lon: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="sidebar-button"
            >
              Calculate Grid Square
            </button>
            {manualError && <p className="text-red-400 text-sm mt-1">{manualError}</p>}
          </form>
        </>
      ) : geoError ? (
        <p className="text-red-400 text-sm mt-1">{geoError}</p>
      ) : (
        <p className="text-tan font-sans text-sm">Detecting location…</p>
      )}
    </div>
  );
}

