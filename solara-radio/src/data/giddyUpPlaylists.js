/**
 * Curated public Spotify playlists from the folder "Giddy Up, It's Galactic".
 * Spotify folders are not publicly enumerable through the embed API.
 * Add each public playlist URL manually from Spotify's Share > Copy link.
 */
export const giddyUpPlaylists = [
    {
        name: 'Cosmic Vol. 1: Tant étrange',
        series: 'Cosmic Curiousities',
        url: 'https://open.spotify.com/playlist/07c2R5qpVNezJHqdnFqNIK?si=794a2bd5f9184d41',
        description: '',
    },
];

export function spotifyPlaylistId(url) {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'open.spotify.com') return null;
    const match = parsed.pathname.match(/^\/playlist\/([A-Za-z0-9]{22})\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
