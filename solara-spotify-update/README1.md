# Solara Radio: Homepage Layout Update

Replace `src/App.js`, `src/pages/Home.jsx`, `src/App.css`, `src/index.css`, and `src/index.js` with the supplied files. Copy `public/solara-hero.png` into the frontend's `public` directory.

This revision keeps the existing Header, React Router, geolocation provider, widgets, and backend calls. It reorganizes existing widgets into consistent dashboard clusters and collapsible panels, makes the resources section secondary, and introduces a hero illustration with live HTML overlay text. The companion Radio Atlas card currently links to the developer's GitHub profile as a **placeholder**: replace that URL with the deployed Radio Atlas site once available.

**Known follow-ups**
- The existing Sidebar still contains satellite and Morse widgets, so those are repeated inside the collapsed Additional Radio Utilities panel. Remove those entries from Sidebar.jsx in a subsequent component cleanup.
- Existing POTA logic is unchanged. Its live spots/map/search redesign requires updating PotaHikingPlantsTabs and its child components.
- Existing Spotify widget is unchanged. Apply ADR-001 gallery replacement separately.
- The existing Header is unchanged; it may still use its older visual treatment.
- No full build was run because this package does not include all project dependencies and components.
