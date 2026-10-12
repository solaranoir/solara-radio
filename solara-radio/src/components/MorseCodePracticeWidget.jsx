import { useEffect, useRef, useState } from 'react';

const MORSE = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.' };
const GROUPS = { letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numbers:'0123456789', mixed:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', callsigns:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' };
const normalize = s => s.toUpperCase().replace(/[^A-Z0-9 ]/g,'').replace(/\s+/g,' ').trim();
const encode = s => normalize(s).split(' ').map(word => [...word].map(c=>MORSE[c]).join(' ')).join(' / ');
const randomFrom = pool => pool[Math.floor(Math.random()*pool.length)];
function makePrompt(group, length) {
  if (group === 'callsigns') return `${randomFrom('AKNW')}${randomFrom('0123456789')}${Array.from({length: Math.max(2,Math.min(4,length))},()=>randomFrom('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).join('')}`;
  return Array.from({length},()=>randomFrom(GROUPS[group])).join('');
}

export default function MorseCodePracticeWidget() {
  const [text,setText] = useState('CQ CQ DE KK7QEA');
  const [wpm,setWpm] = useState(20);
  const [effective,setEffective] = useState(15);
  const [tone,setTone] = useState(600);
  const [group,setGroup] = useState('mixed');
  const [length,setLength] = useState(5);
  const [prompt,setPrompt] = useState('');
  const [answer,setAnswer] = useState('');
  const [revealed,setRevealed] = useState(false);
  const [score,setScore] = useState({correct:0,total:0});
  const [playing,setPlaying] = useState(false);
  const [error,setError] = useState('');
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const generationRef = useRef(0);
  const stop = () => { generationRef.current += 1; if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = null; if (audioRef.current) { try { audioRef.current.close(); } catch(e) {} audioRef.current = null; } setPlaying(false); };
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); if (audioRef.current) audioRef.current.close().catch(()=>{}); }, []);
  async function play(message) {
    if (!normalize(message)) { setError('Enter text or generate a practice group first.'); return; }
    stop(); setError('');
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) { setError('Audio playback is unavailable in this browser.'); return; }
    try {
      const context = new Audio(); audioRef.current = context; await context.resume();
      const unit = 1.2 / wpm;
      // Farnsworth: keep character elements at character WPM, stretch inter-character/word gaps.
      const slow = 1.2 / Math.min(effective,wpm);
      const gap = Math.max(3*unit, (50*slow - 31*unit)/19*3);
      const wordGap = gap * 7/3;
      let cursor = context.currentTime + .05;
      const words = normalize(message).split(' ');
      words.forEach((word,wi) => {
        [...word].forEach((char,ci) => {
          [...MORSE[char]].forEach((symbol,si) => {
            const duration = symbol === '.' ? unit : 3*unit;
            const osc = context.createOscillator(); const gain = context.createGain();
            osc.type = 'sine'; osc.frequency.value = tone;
            gain.gain.setValueAtTime(0,cursor); gain.gain.linearRampToValueAtTime(.18,cursor+.005);
            gain.gain.setValueAtTime(.18,Math.max(cursor+.005,cursor+duration-.005)); gain.gain.linearRampToValueAtTime(0,cursor+duration);
            osc.connect(gain); gain.connect(context.destination); osc.start(cursor); osc.stop(cursor+duration+.01);
            cursor += duration + (si < MORSE[char].length-1 ? unit : 0);
          });
          if (ci < word.length-1) cursor += gap;
        });
        if (wi < words.length-1) cursor += wordGap;
      });
      setPlaying(true);
      const generation = generationRef.current;
      timerRef.current = setTimeout(() => { if (generation === generationRef.current) stop(); }, Math.max(0,(cursor-context.currentTime+.15)*1000));
    } catch (err) { stop(); setError('Audio playback failed. Check your browser audio settings.'); }
  }
  function newPrompt() { stop(); setPrompt(makePrompt(group,length)); setAnswer(''); setRevealed(false); setError(''); }
  function check() { if (!prompt) return; setRevealed(true); setScore(s=>({correct:s.correct+(normalize(answer)===prompt?1:0),total:s.total+1})); }
  return <div className="solara-instrument">
    <div className="solara-instrument__intro"><span className="solara-instrument__eyebrow">CW training desk</span><p>Practice copying by ear or convert your own message. Audio is generated locally in your browser.</p></div>
    <div className="solara-instrument__fields"><label>Character speed <strong>{wpm} WPM</strong><input type="range" min="5" max="40" value={wpm} onChange={e=>{const n=Number(e.target.value);setWpm(n);setEffective(v=>Math.min(v,n));}} /></label><label>Effective speed <strong>{effective} WPM</strong><input type="range" min="5" max={wpm} value={effective} onChange={e=>setEffective(Number(e.target.value))}/></label></div>
    <label>Tone <strong>{tone} Hz</strong><input type="range" min="400" max="900" step="25" value={tone} onChange={e=>setTone(Number(e.target.value))}/></label>
    <div className="solara-instrument__divider" />
    <h3>Text to Morse</h3><label>Message<input value={text} maxLength={140} onChange={e=>setText(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g,''))} placeholder="CQ CQ DE KK7QEA"/></label>
    <div className="solara-instrument__code" aria-label="Morse encoding">{encode(text) || 'Enter a message above'}</div>
    <div className="solara-instrument__actions"><button type="button" onClick={()=>play(text)}>▶ Play message</button><button type="button" onClick={stop} disabled={!playing}>■ Stop</button></div>
    <div className="solara-instrument__divider" />
    <h3>Copy practice</h3><div className="solara-instrument__fields"><label>Character set<select value={group} onChange={e=>setGroup(e.target.value)}><option value="letters">Letters</option><option value="numbers">Numbers</option><option value="mixed">Letters + numbers</option><option value="callsigns">Callsign-style groups</option></select></label><label>Group length<input type="number" min="1" max="12" value={length} onChange={e=>setLength(Math.max(1,Math.min(12,Number(e.target.value)||1)))}/></label></div>
    <div className="solara-instrument__actions"><button type="button" onClick={newPrompt}>New group</button><button type="button" disabled={!prompt} onClick={()=>play(prompt)}>▶ Listen</button><button type="button" disabled={!playing} onClick={stop}>■ Stop</button></div>
    {prompt && <><label>What did you copy?<input value={answer} onChange={e=>setAnswer(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} placeholder="Type what you heard" autoComplete="off" /></label><div className="solara-instrument__actions"><button type="button" disabled={revealed || !answer} onClick={check}>Check answer</button><button type="button" onClick={()=>setRevealed(true)}>Reveal</button></div>{revealed && <p role="status" className="solara-instrument__feedback">Answer: <strong>{prompt}</strong>{answer && <span> · {normalize(answer)===prompt?'Correct ✓':'Try another group'}</span>}</p>}</>}
    <p className="solara-instrument__hint">Score: {score.correct}/{score.total} checked · Callsign groups are synthetic training examples, not live callsigns.</p>
    {error && <p className="solara-instrument__error" role="alert">{error}</p>}
  </div>;
}
