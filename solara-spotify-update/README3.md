# Solara Radio: Header + Field Tools iteration

## Installation
Copy `components/*.jsx` into `src/components/` and `config/api.js` into `src/config/api.js`.
Set `REACT_APP_API_BASE_URL=https://solara-station.onrender.com` in the frontend environment and redeploy (CRA embeds variables at build time).

## Changes
- Header: compact brand/navigation, social links secondary, no pinched hero. In-page anchors expect sections with IDs `conditions`, `field-tools`, `about`, and `projects`; ensure the homepage defines them.
- POTA: search by state, filter by name/reference, geolocate nearest park, selected-park map link, and compact resources. Live spots link to POTA's official page, not a fabricated backend endpoint.
- Field tabs: consistent styling and accessible Radix tabs, without resetting all state on tab changes.
- Hiking: old Render API URLs replaced with centralized configuration; legacy hiking behavior retained.
- Plants: preserves iNaturalist behavior, removes forced tall widget layout.
- TrailMap: shared copper accent.
- PotaTrailLookup: removes display of undefined trail length/difficulty values. This component is not used by the tabs and remains legacy.

## Known follow-up work
- Integrate POTA map directly in the finder (currently a map link); implement live activator spots only after confirming a supported endpoint/data contract.
- Replace legacy hiking and plants color utilities (`tan`, `coffee`, `persian-orange`) with design tokens throughout; this patch prioritizes functional preservation.
- Add tests for API errors, geolocation permission denial, filtering, and tab keyboard navigation.
- Verify Header anchor IDs against the revised homepage.
- Run `npm run build` and browser regression tests in the complete repo; these files were not compiled in isolation.
