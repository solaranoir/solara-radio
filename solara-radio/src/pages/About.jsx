import './About.css';
export default function About() {
  return <main className="solara-about-page">
    <p className="solara-eyebrow">KK7QEA · Amateur radio · Engineering · The outdoors</p>
    <h1>Chasing Signals, Finding Trails</h1>
    <p className="solara-about-page__lede">A little radio, a little code, and a healthy curiosity about what is happening just beyond the horizon.</p>
    <div className="solara-about-page__layout">
      <article className="solara-surface solara-about-page__story">
        <p>Hey there! I found my way into amateur radio in December 2023, when I earned my Technician license, and I’ve been chasing signals ever since. I upgraded to General in 2024, around the time I built my first antenna, a homebrew 10-meter dipole that pulled me further into the hobby. On July 5, 2025, I earned my Extra class license. There’s always another band, mode, or bit of physics to explore.</p>
        <p>These days, I’m usually on the air with my Xiegu G90 and an end-fed half-wave or random wire antenna, strung up wherever I can find a decent spot and a decent match. FT8 is a favorite. There’s something wonderful about seeing a faint signal make its way across the waterfall and realizing someone on the other side of the world is listening.</p>
        <p>I’m a member of the Henderson Amateur Radio Club, and portable operating is my happy place. I love activating parks for POTA, often alongside my friend and fellow adventurer <a href="https://www.qrz.com/db/KK7NYE" target="_blank" rel="noopener noreferrer">KK7NYE ↗</a>. We’ve made a lot of good memories hauling gear into the outdoors and coaxing contacts out of a few watts. I’ve tried SOTA, too. The hike was a success; the RF had other plans.</p>
        <p>Off the air, I’m a software engineer who works primarily in Python and JavaScript, with a background in software reliability, testing, and legal operations. I like building things that make complex systems easier to understand. My <a href="https://radio-atlas-frontend.onrender.com/" target="_blank" rel="noopener noreferrer">Radio Atlas ↗</a> project brings that instinct back to radio, combining real-world reception reports, ionospheric conditions, and space-weather data to explore why signals travel the way they do.</p>
        <p>When I’m not debugging code or chasing a contact, you’ll find me hiking, gardening, making art, discovering music, looking up at the stars, or attempting to negotiate with a very opinionated dog.</p>
        <p>Always tuning, always learning. Hope to catch you on the waterfall soon!</p>
        <div className="solara-about-page__links"><a href="https://www.qrz.com/db/KK7QEA" target="_blank" rel="noopener noreferrer">My QRZ profile ↗</a><a href="https://github.com/solaranoir" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="/resume">Resume ↗</a></div>
      </article>
      <aside className="solara-surface solara-about-page__qsl"><h2>On the air · KK7QEA</h2><img src="/qsl.png" alt="KK7QEA amateur radio QSL card"/><p>Part postcard, part calling card, and a little piece of the story behind each contact.</p></aside>
    </div>
  </main>;
}
