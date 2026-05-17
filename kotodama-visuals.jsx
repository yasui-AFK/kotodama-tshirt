// Visual primitives shared across kotodama prototypes.
// Sumi-e brush strokes, paper textures, ripples, and the
// signature one-character-at-a-time reveal.

const { useState, useEffect, useRef, useMemo } = React;

window.WashiBg = function WashiBg({ tone = 'warm', children, style = {} }) {
  const fill = tone === 'cool' ? '#f4f3ef'
             : tone === 'dark' ? '#1c1a17'
             : tone === 'midnight' ? '#0e1118'
             : '#f6f1e7';
  return (
    <div style={{
      position: 'relative',
      background: fill,
      backgroundImage: `
        radial-gradient(1200px 800px at 20% 10%, rgba(180,150,100,0.06), transparent 60%),
        radial-gradient(900px 700px at 90% 90%, rgba(80,60,30,0.05), transparent 60%),
        url("data:image/svg+xml;utf8,${encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
            <filter id='n'>
              <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/>
              <feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.42 0 0 0 0 0.32 0 0 0 0.05 0'/>
            </filter>
            <rect width='100%' height='100%' filter='url(#n)'/>
          </svg>`)}")`,
      ...style,
    }}>
      {children}
    </div>
  );
};

window.BrushStroke = function BrushStroke({
  width = 200, height = 22, color = '#1a1814', seed = 1, opacity = 0.85, style = {},
}) {
  const path = useMemo(() => {
    const n = 24;
    let d = `M 4 ${height / 2}`;
    for (let i = 1; i <= n; i++) {
      const x = 4 + ((width - 8) * i) / n;
      const wobble = Math.sin(i * 0.7 + seed) * (height / 6) + Math.cos(i * 1.3 + seed * 2) * (height / 10);
      d += ` L ${x.toFixed(1)} ${(height / 2 + wobble).toFixed(1)}`;
    }
    return d;
  }, [width, height, seed]);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', ...style }}>
      <defs>
        <filter id={`brush-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed}/>
          <feDisplacementMap in="SourceGraphic" scale="3"/>
        </filter>
      </defs>
      <path d={path} stroke={color} strokeWidth={height * 0.55} strokeLinecap="round"
            fill="none" opacity={opacity} filter={`url(#brush-${seed})`} />
      <path d={path} stroke={color} strokeWidth={height * 0.18} strokeLinecap="round"
            fill="none" opacity={opacity * 0.4} />
    </svg>
  );
};

window.Enso = function Enso({ size = 200, color = '#1a1814', strokeWidth = 14, opacity = 1, style = {} }) {
  const r = size / 2 - strokeWidth;
  const cx = size / 2, cy = size / 2;
  const start = -Math.PI / 2 + 0.1;
  const end = start + Math.PI * 1.92;
  const segs = 60;
  let d = '';
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = start + (end - start) * t;
    const wobble = (Math.sin(t * 18) + Math.cos(t * 11)) * 1.2;
    const rr = r + wobble;
    const x = cx + Math.cos(angle) * rr;
    const y = cy + Math.sin(angle) * rr;
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', ...style }}>
      <defs>
        <filter id="enso-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3"/>
          <feDisplacementMap in="SourceGraphic" scale="2.5"/>
        </filter>
      </defs>
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            fill="none" opacity={opacity} filter="url(#enso-rough)"/>
    </svg>
  );
};

window.Ripple = function Ripple({ size = 280, color = 'rgba(30,28,22,0.5)', delay = 0, borderWidth = 1, style = {} }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `${borderWidth}px solid ${color}`,
          animation: `kt-ripple 3.6s ${delay + i * 0.6}s cubic-bezier(.2,.7,.3,1) infinite`,
          opacity: 0,
        }}/>
      ))}
    </div>
  );
};

window.NameReveal = function NameReveal({ syllables, fontSize = 72, color = '#15130f',
                                          mode = 'kana', onDone }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!syllables.length) return;
    setShown(0);
    let i = 0;
    const tick = () => {
      i++;
      setShown(i);
      if (i < syllables.length) setTimeout(tick, 450);
      else onDone && setTimeout(onDone, 600);
    };
    setTimeout(tick, 200);
  }, [syllables.map(s => s.key).join('|')]);

  return (
    <div style={{
      display: 'flex', gap: fontSize * 0.18, justifyContent: 'center', alignItems: 'baseline',
      fontFamily: '"Shippori Mincho", "Noto Serif JP", serif',
      fontSize, color, lineHeight: 1, position: 'relative',
    }}>
      {syllables.map((s, i) => (
        <span key={i} style={{
          opacity: i < shown ? 1 : 0,
          transform: i < shown ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
          filter: i < shown ? 'blur(0)' : 'blur(8px)',
          transition: 'all 0.7s cubic-bezier(.2,.7,.3,1)',
          display: 'inline-block', position: 'relative',
        }}>
          {mode === 'kana' ? s.kana : s.romaji}
        </span>
      ))}
    </div>
  );
};

window.VerticalKana = function VerticalKana({ text, fontSize = 36, color = '#15130f', style = {} }) {
  return (
    <div style={{
      writingMode: 'vertical-rl', textOrientation: 'upright',
      fontFamily: '"Shippori Mincho", "Noto Serif JP", serif',
      fontSize, color, lineHeight: 1.4, letterSpacing: '0.1em',
      ...style,
    }}>
      {text}
    </div>
  );
};

if (!document.getElementById('kt-anims')) {
  const s = document.createElement('style');
  s.id = 'kt-anims';
  s.textContent = `
    @keyframes kt-ripple {
      0% { transform: scale(0.3); opacity: 0.7; }
      80% { opacity: 0.05; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes kt-fadeup {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes kt-flyin {
      0%   { opacity: 0; transform: translateZ(800px) translateY(-30px) rotateX(-30deg); filter: blur(14px); }
      55%  { opacity: 1; filter: blur(2px); }
      100% { opacity: 1; transform: translateZ(0) translateY(0) rotateX(0); filter: blur(0); }
    }
    @keyframes kt-fly {
      0%   { opacity: 0; transform: translateZ(900px) translateY(-40px) rotateX(-25deg) rotateZ(-8deg); filter: blur(16px); }
      55%  { opacity: 1; filter: blur(2px); }
      100% { opacity: 1; transform: translateZ(0) translateY(0) rotateX(0) rotateZ(0); filter: blur(0); }
    }
    @keyframes kt-rise {
      0%   { opacity: 0; transform: translateY(80px) scale(0.9); filter: blur(8px); }
      60%  { opacity: 1; filter: blur(1px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes kt-drop {
      0%   { opacity: 0; transform: translateY(-180px) rotateZ(8deg); filter: blur(6px); }
      55%  { opacity: 1; filter: blur(0); }
      75%  { transform: translateY(8px) rotateZ(-1deg); }
      100% { opacity: 1; transform: translateY(0) rotateZ(0); filter: blur(0); }
    }
    @keyframes kt-bloom {
      0%   { opacity: 0; transform: scale(0.05); filter: blur(20px); }
      60%  { opacity: 1; transform: scale(1.08); filter: blur(2px); }
      100% { opacity: 1; transform: scale(1); filter: blur(0); }
    }
    @keyframes kt-drift {
      0%   { opacity: 0; transform: translateX(-200px) translateY(20px) rotateZ(-8deg); filter: blur(8px); }
      55%  { opacity: 1; filter: blur(1px); }
      100% { opacity: 1; transform: translateX(0) translateY(0) rotateZ(0); filter: blur(0); }
    }
    @keyframes kt-spin {
      0%   { opacity: 0; transform: rotateY(180deg) scale(0.6); filter: blur(8px); }
      60%  { opacity: 1; filter: blur(1px); }
      100% { opacity: 1; transform: rotateY(0) scale(1); filter: blur(0); }
    }
    @keyframes kt-drift-r {
      0%   { opacity: 0; transform: translateX(200px) translateY(20px) rotateZ(8deg); filter: blur(8px); }
      55%  { opacity: 1; filter: blur(1px); }
      100% { opacity: 1; transform: translateX(0) translateY(0) rotateZ(0); filter: blur(0); }
    }
    @keyframes kt-shadow {
      from { opacity: 0; transform: translateX(-50%) scaleX(0.4); }
      to   { opacity: 1; transform: translateX(-50%) scaleX(1); }
    }
    @keyframes kt-inkbleed {
      0% { opacity: 0; filter: blur(12px); transform: scale(0.85); }
      100% { opacity: 1; filter: blur(0); transform: scale(1); }
    }
    @keyframes kt-brush-draw {
      from { stroke-dashoffset: 1300; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes kt-brush-fill {
      from { fill-opacity: 0; }
      to { fill-opacity: 1; }
    }
    @keyframes kt-sweep-draw {
      from { stroke-dashoffset: 2400; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes kt-fade-up {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes kt-fade-down {
      from { opacity: 0; transform: translateY(-40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes kt-fade-left {
      from { opacity: 0; transform: translateX(-40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes kt-fade-right {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes kt-fade-up-soft {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes kt-kanji-out {
      to { opacity: 0; }
    }
    @keyframes kt-video-in {
      to { opacity: 1; }
    }
    @keyframes kt-particles-fade {
      to { opacity: 0; visibility: hidden; }
    }
    @keyframes kt-float {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes kt-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
    .kt-fadeup { animation: kt-fadeup 0.8s cubic-bezier(.2,.7,.3,1) both; }
    .kt-inkbleed { animation: kt-inkbleed 1.2s cubic-bezier(.2,.7,.3,1) both; }
  `;
  document.head.appendChild(s);
}
