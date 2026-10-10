# Solara Radio solar and propagation integration update

Copy `src/components/*.jsx`, `src/context/GeolocationProvider.jsx`, `src/styles/solar-dashboard.css`, and `netlify/functions/noaa.js` into matching project paths. Keep existing `Home.jsx`.

**Verified against the two additional uploaded source files:** The geolocation context returns `{ location: {latitude, longitude}, enabled, error, setEnabled }`. Both widgets now read `location.latitude` and `location.longitude`. The provider clears coordinates when location is disabled and ignores late callbacks.

The Netlify NOAA function keeps its existing output fields. It independently requests NOAA scales, Kp, and the daily solar indices, returning partial metrics with warnings if one source fails. It uses NOAA's current scale entry `data['0']` instead of the first arbitrary object value. Daily solar indices parsing retains the original positional assumptions and needs verification against the live upstream format before treating SFI and Ap as reliable.

**Known limits:** The external broken MUF map has been removed, not replaced. NOAA network access, browser integration, and the React build have not been tested here. The provider uses one-time browser geolocation, not continuous location tracking. VOACAP predictions still depend on the existing `VOACAPPrediction` component.

**Validate before deploying:** `npm run build`; `node --check netlify/functions/noaa.js`; inspect `/.netlify/functions/noaa` response; test location disabled, enabled, and denied; verify source timestamps and values with NOAA. No `Home.jsx` changes required.
