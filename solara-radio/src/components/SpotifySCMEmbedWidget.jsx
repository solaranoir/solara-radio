import { useMemo, useState } from 'react';
import { giddyUpPlaylists, spotifyPlaylistId } from '../data/giddyUpPlaylists';

/** Frontend-only curated Spotify playlist gallery. No OAuth, backend, or Vercel. */
export default function SpotifySCMEmbedWidget() {
  const playlists = useMemo(
    () => giddyUpPlaylists
      .map((playlist) => ({ ...playlist, id: spotifyPlaylistId(playlist.url) }))
      .filter((playlist) => playlist.id),
    []
  );
  const [series, setSeries] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const seriesOptions = ['All', ...new Set(playlists.map((p) => p.series || 'Other'))];
  const visible = playlists.filter((p) => series === 'All' || (p.series || 'Other') === series);
  const selected = playlists.find((p) => p.id === selectedId) || visible[0];

  const chooseSeries = (value) => {
    setSeries(value);
    setSelectedId(null);
  };

  const surpriseMe = () => {
    if (!visible.length) return;
    const alternatives = visible.filter((p) => p.id !== selected?.id);
    const pool = alternatives.length ? alternatives : visible;
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  return (
    <section className="solara-widget pb-2" aria-labelledby="giddy-up-heading">
      <h2 id="giddy-up-heading" className="widget-heading">Giddy Up, It's Galactic</h2>
      <p className="text-tan mb-4">A curated constellation of public Spotify playlists.</p>

      {playlists.length === 0 ? (
        <p className="text-tan" role="status">
          The playlist catalog is waiting for public Spotify playlist links.
          Add them to src/data/giddyUpPlaylists.js.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            <label htmlFor="giddy-series" className="text-tan font-medium">Playlist series</label>
            <select
              id="giddy-series"
              className="w-full p-2 rounded-lg bg-tan text-gunmetal"
              value={series}
              onChange={(event) => chooseSeries(event.target.value)}
            >
              {seriesOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>

            <label htmlFor="giddy-playlist" className="text-tan font-medium">Choose a playlist</label>
            <select
              id="giddy-playlist"
              className="w-full p-2 rounded-lg bg-tan text-gunmetal"
              value={selected?.id || ''}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {visible.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
              ))}
            </select>

            <button
              type="button"
              className="px-4 py-2 bg-sage text-gunmetal rounded-lg hover:opacity-90"
              onClick={surpriseMe}
            >
              Surprise Me, Universe
            </button>
          </div>

          {selected && (
            <div>
              {selected.description && <p className="text-tan mb-3">{selected.description}</p>}
              <iframe
                key={selected.id}
                title={`Spotify player: ${selected.name}`}
                src={`https://open.spotify.com/embed/playlist/${selected.id}?utm_source=generator`}
                width="100%"
                height="352"
                style={{ border: 0, borderRadius: 12 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <a
                href={`https://open.spotify.com/playlist/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-tan underline underline-offset-4"
              >
                Open playlist in Spotify ↗
              </a>
            </div>
          )}
        </>
      )}
    </section>
  );
}
