export default function CodingProjectsWidget() {
  const projects = [
    {
      name: 'SolaraEcho - Real-Time Propagation',
      description:
        'This project is to develop a tool that can predict radio wave propagation characteristics such as: Signal Strength (RSSI), Path Loss and Angle of Arrival (AoA) and make predictions for urban, rural, and indoor environments using real-world and simulated data.',
      // link: 'https://github.com/minedamnesia/solara-prop',
    },
    {
      name: 'SolaraSignal — Signal Detection and Classification',
      description:
        'This project is to develop a system that can: Detect radio signals from raw or processed RF data, classify signals by type (Wi-Fi, Bluetooth, cellular, etc.) and possibly classify them by modulation schemes and sub-type.',
      // link: 'https://github.com/minedamnesia/another-project',
    },
    {
      name: 'SolaraSphere - Dashboard of Ionospheric Data',
      description:
        'This is a dashboard project for hosting ionospheric data.',
      // link: 'https://github.com/minedamnesia/solara-sphere',
    },
    {
      name: 'Spotify Radio Widget',
      description:
        'This is a React widget so I can play and browse Spotify playlists via Web Playback SDK.',
      // link: 'https://github.com/minedamnesia/solara-spotify',
    },
  ];

  return <div className="solara-projects-grid">
    {projects.map((project, index) => <article key={project.name} className={`solara-project-card solara-project-card--${index + 1}`}>
      <div className="solara-project-card__art" aria-hidden="true">{['◎','〰','✧','♫'][index]}</div>
      <div className="solara-project-card__body"><h3>{project.name}</h3>
        <p>{[
          'Predicting signal strength, path loss and arrival angles.',
          'Detection and classification of RF signals and modulation.',
          'Ionospheric data and propagation research dashboard.',
          'React-powered Spotify playlist browsing and playback.'
        ][index]}</p>
        <details><summary>Project details</summary><p>{project.description}</p></details>
        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>}
      </div>
    </article>)}
  </div>;
}
