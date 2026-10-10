import { useGeolocation } from '../context/GeolocationProvider';
import '../styles/solar-dashboard.css';

export function GeolocationToggle() {
  const { enabled, setEnabled, error } = useGeolocation();
  return (
    <section className="solara-location-settings" aria-labelledby="location-settings-heading">
      <h3 id="location-settings-heading">Location settings</h3>
      <label className="solara-location-label">
        <input type="checkbox" checked={Boolean(enabled)} onChange={event => setEnabled(event.target.checked)} />
        <span>Enable location-based tools</span>
      </label>
      <p className="solara-solar-note">Optional. Global solar and propagation information does not require your location.</p>
      {error && <p role="alert" className="solara-solar-note">{String(error)}</p>}
    </section>
  );
}
