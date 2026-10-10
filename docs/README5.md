# Solara Radio: Solar & Propagation update

Replace these three files under `src/components/` and add `src/styles/solar-dashboard.css`.
No `Home.jsx` changes are required.

## What changed
- Global NOAA propagation indices are shown without requesting location.
- Removed the broken external MUF image and the misleading per-band Good/Fair/Poor heuristic.
- Location-based VOACAP content only renders when the shared geolocation context is enabled and has coordinates.
- Solar position no longer uses a hardcoded location in Málaga, Spain.
- Added fetch HTTP/error checks, cancellation on unmount, and clear loading/empty states.
- Uses compact, responsive cards with the agreed Solara palette.

## Integration check
The uploaded `GeolocationProvider` implementation was not provided. These components support
`latitude`/`longitude`, `position.latitude`/`position.longitude`, `position.lat`/`position.lon`,
or `position.coords.latitude`/`position.coords.longitude`. If the provider exposes coordinates
under different names, update the two `lat`/`lon` assignments in the widgets.
The existing `/.netlify/functions/noaa` endpoint is assumed to return
`{ kp, ap, sfi, gScale, sScale, rScale, time }` as the original widget expected.
Verify the response in the browser Network tab. The endpoint was not available for testing here.
The NOAA solar-probabilities schema and sunrise-sunset API are also assumed as in the supplied code.

Run `npm run build`, test with location both off and on, and inspect browser Network/Console.
This package does not add a replacement MUF map. A reliable, attributed map source
should be integrated separately after its URL/terms and update behavior are verified.
