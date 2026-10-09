# Solara Radio: Giddy Up, It's Galactic player

## Install

1. Copy `src/components/SpotifySCMEmbedWidget.jsx` into the existing frontend at the same path, replacing the old backend-fetching component.
2. Copy `src/data/giddyUpPlaylists.js` into the frontend (create `src/data` if needed).
3. In Spotify desktop, open the **Giddy Up, It's Galactic** folder and, for each playlist you want on the site, make sure the playlist is public, then use **Share → Copy link to playlist**.
4. Add one object per playlist to `giddyUpPlaylists` (name, series, url, optional description). Spotify folders themselves cannot be listed via public embeds. Do not add the folder URL.
5. `Home.jsx` already imports `SpotifySCMEmbedWidget`; no Home or App changes are necessary.
6. Remove any references to `SpotifyEmbedWidget` elsewhere if present. The replacement doesn't use it. Once unused, delete that Vercel-auth widget.
7. Run `npm start` in the frontend, check that playlist switching and series filtering work, then deploy to Netlify.

## Example catalog entry

```js
{
  name: 'My Playlist',
  series: 'Cosmic Curiosities',
  url: 'https://open.spotify.com/playlist/REPLACE_WITH_REAL_22_CHARACTER_ID',
  description: 'A short introduction to the theme',
}
```

Only actual public playlist links will work. The code deliberately ships without invented IDs.

## Playback caveats

Spotify's official embedded player runs inside Solara's page, but Spotify controls playback capabilities and may require login or open Spotify for full playback in some contexts. No Spotify audio is streamed or proxied by Solara. This approach avoids Spotify Web API playlist discovery, custom OAuth, the Render playlist endpoint, and the old Vercel service.

## Validation

- Catalog has valid public playlist URLs (22-character playlist IDs).
- Series dropdown filters playlists.
- Changing selection changes the iframe URL.
- Random button picks a playlist from the selected series.
- External link opens the selected playlist.
- Empty catalog shows setup guidance.
- No network calls to Vercel or `/api/spotify-playlists` from this widget.
