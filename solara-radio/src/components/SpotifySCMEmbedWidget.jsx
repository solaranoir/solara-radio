import { useMemo, useState } from 'react';
import { giddyUpPlaylists } from '../data/giddyUpPlaylists';
import './SpotifySCMEmbedWidget.css';

const allPlaylists = giddyUpPlaylists.flatMap(group => group.playlists.map(playlist => ({ ...playlist, category: group.category })));

export default function SpotifySCMEmbedWidget() {
  const [category, setCategory] = useState(giddyUpPlaylists[0].category);
  const [playlistId, setPlaylistId] = useState(giddyUpPlaylists[0].playlists[0].id);
  const group = useMemo(() => giddyUpPlaylists.find(item => item.category === category), [category]);
  const selected = group?.playlists.find(item => item.id === playlistId) ?? group?.playlists[0];

  function changeCategory(nextCategory) {
    const nextGroup = giddyUpPlaylists.find(item => item.category === nextCategory);
    if (!nextGroup) return;
    setCategory(nextCategory);
    setPlaylistId(nextGroup.playlists[0].id);
  }

  function surprise() {
    if (allPlaylists.length < 2) return;
    const choices = allPlaylists.filter(item => item.id !== selected?.id);
    const next = choices[Math.floor(Math.random() * choices.length)];
    setCategory(next.category);
    setPlaylistId(next.id);
  }

  if (!selected) return <p>No playlists available.</p>;
  return (
    <section className="giddy-player" aria-label="Giddy Up Galaxy playlist player">
      <header className="giddy-player__header">
        <div>
          <h3>Giddy Up, It's Galactic</h3>
          <p>A curated constellation of public Spotify playlists.</p>
        </div>
        <span className="giddy-player__count">{allPlaylists.length} playlists · {giddyUpPlaylists.length} series</span>
      </header>
      <div className="giddy-player__controls">
        <label htmlFor="giddy-series">Playlist series</label>
        <select id="giddy-series" value={category} onChange={event => changeCategory(event.target.value)}>
          {giddyUpPlaylists.map(group => <option key={group.category} value={group.category}>{group.category} ({group.playlists.length})</option>)}
        </select>
        <label htmlFor="giddy-playlist">Choose a playlist</label>
        <select id="giddy-playlist" value={selected.id} onChange={event => setPlaylistId(event.target.value)}>
          {group.playlists.map(playlist => <option key={playlist.id} value={playlist.id}>{playlist.title}</option>)}
        </select>
        <button type="button" onClick={surprise}>Surprise Me, Universe ✦</button>
      </div>
      <div className="giddy-player__selection" aria-live="polite"><span>{category}</span><strong>{selected.title}</strong></div>
      <iframe
        key={selected.id}
        title={`Spotify playlist: ${selected.title}`}
        src={`https://open.spotify.com/embed/playlist/${selected.id}?utm_source=generator`}
        width="100%"
        height="380"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ border: 0, borderRadius: 12 }}
      />
      <a className="giddy-player__spotify-link" href={selected.url} target="_blank" rel="noopener noreferrer">Open playlist in Spotify ↗</a>
      <p className="giddy-player__fineprint">Playback options and track availability depend on Spotify and the listener's account.</p>
    </section>
  );
}
