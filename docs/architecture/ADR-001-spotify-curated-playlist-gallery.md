# ADR-001: Replace Spotify API Playlist Discovery with a Curated Gallery

- **Status:** Accepted
- **Date:** 2026-10-07
- **Project:** Solara Radio v2.0
- **Decision owners:** Solara Radio project
- **Related roadmap:** Phase 0 (architecture decisions); Phase 2 (SR-2.1, SR-2.2, SR-2.3)

## Context

Solara Radio's existing Spotify experience relies on a backend endpoint (`/api/spotify-playlists`) and a separate authenticated Spotify integration. The newly deployed Render endpoint is reachable but returns an empty playlist list, as observed during Phase 0. The existing backend also reportedly limits retrieval to the first 50 playlists and filters names using the legacy `SCM:` prefix, while the desired collection is now **Giddy Up Galaxy**. Spotify's 2026 API and Development Mode changes add further compatibility and maintenance concerns. The precise cause of the empty response has **not** been conclusively established.

Solara's primary use case is sharing a curated set of themed playlists with website visitors, not managing visitors' Spotify libraries or controlling their Spotify accounts.

## Decision

Replace API-based playlist discovery and visitor authentication for the public music feature with a **curated Giddy Up Galaxy playlist gallery** backed by a version-controlled local catalog (JSON or typed data). Render playlist selections using Spotify's official embed player, with a direct **Open in Spotify** link for each playlist.

The gallery will be a frontend feature and will not require Solara's Render API or a separate Vercel authentication application. Spotify may still impose playback restrictions or require a Spotify session for certain playback behavior; the site will not promise unrestricted playback.

Keep the existing implementation in place until the replacement passes acceptance checks, then remove unused endpoints, credentials, and hosting dependencies only after verifying they have no other consumers.

## Alternatives considered

| Alternative | Assessment |
| --- | --- |
| Repair the existing API-driven discovery and OAuth flow | More moving parts and policy exposure than the curated-gallery use case requires. |
| Build a hybrid public gallery with optional visitor authentication | Possible future enhancement, but unnecessary for v2's stated goals. |
| **Local curated catalog plus official embeds** | **Chosen:** simple, predictable, version-controlled, and independent of playlist-discovery API calls. |

## Proposed catalog contract

Each record should include a stable local `id`, `title`, `series`, `spotifyPlaylistId`, `description`, and optional `artwork` and `order`. Use a validated playlist ID, not an arbitrary iframe URL. Example (illustrative placeholders only):

```json
{
  "id": "example-playlist",
  "title": "Example Giddy Up Galaxy Playlist",
  "series": "Cosmic Curiosities",
  "spotifyPlaylistId": "REPLACE_WITH_REAL_SPOTIFY_PLAYLIST_ID",
  "description": "Short editorial description",
  "order": 10
}
```

Use the playlist ID to construct Spotify's documented embed URL and direct playlist URL. Do not store OAuth tokens in this catalog.

## Consequences and trade-offs

**Benefits:** No visitor OAuth; no dependency on Spotify playlist-discovery API for the public gallery; predictable editorial grouping; easier tests; fewer deployed components.

**Costs:** Playlist entries and metadata require manual maintenance; embed appearance and playback behavior are controlled by Spotify; deleted/private playlists may stop working; metadata will not automatically reflect Spotify changes.

**Security and privacy:** No Spotify access tokens should be sent through cross-window messages. Use appropriate iframe attributes, restrictive embedding practices where feasible, and a documented external-service/privacy notice if needed.

## Implementation stories

### SR-2.1: Curated playlist catalog
- Inventory Giddy Up Galaxy playlist URLs/IDs and series.
- Define and validate a typed catalog schema.
- Add real entries without inventing playlist identifiers.
- Document the process for adding or retiring playlists.

### SR-2.2: Gallery and embed player
- Build browsable series and playlist cards.
- Select a playlist and load its official Spotify embed.
- Include an accessible direct Spotify link.
- Align components with the shared Solara/Radio Atlas design system.

### SR-2.3: Resilience and regression coverage
- Test empty, invalid, and unavailable playlists.
- Verify keyboard navigation, mobile layouts, and iframe titles.
- Confirm the gallery works without Spotify OAuth or the Render playlist endpoint.
- Verify existing functionality before retiring legacy integration code.

## Acceptance criteria

- [ ] Visitors can browse curated Giddy Up Galaxy playlists by series.
- [ ] Selecting a playlist displays its Spotify embed.
- [ ] Each playlist has a working **Open in Spotify** link.
- [ ] Gallery loads without visitor authentication or Spotify Web API discovery.
- [ ] Missing or invalid playlist data produces a useful fallback.
- [ ] Responsive, keyboard-accessible behavior is tested.
- [ ] Legacy dependencies are removed only after checking for other consumers.
- [ ] Documentation describes catalog maintenance and known Spotify embed limitations.

## Verification and follow-up

The empty Render response is an observed symptom, not a proven consequence of Spotify's March 2026 changes. Before deleting legacy code, record the original route's filtering and error handling, confirm what the new gallery replaces, and check whether other components consume that endpoint.

**Revisit this decision if:** Solara needs user-specific playlists, advanced playback control, automated catalog synchronization, or official embeds cease meeting the visitor experience requirements.
