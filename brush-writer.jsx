// BrushWriter — animated SVG paths that "write themselves" with stroke-dashoffset.

const { useState: useStateBW, useEffect: useEffectBW, useRef: useRefBW } = React;

const STROKES = {
  koto: [
    'M 60 30 Q 100 28 140 32',
    'M 50 60 Q 100 56 150 62',
    'M 70 92 Q 100 90 130 94',
    'M 70 120 Q 100 118 130 122',
    'M 50 150 L 50 180 Q 50 188 60 188 L 140 188 Q 150 188 150 180 L 150 150',
    'M 60 168 Q 100 165 140 170',
  ],
  rei: [
    'M 50 24 Q 100 22 150 26',
    'M 70 50 Q 100 48 130 52',
    'M 50 78 Q 100 76 150 80',
    'M 64 102 L 64 116',
    'M 88 102 L 88 116',
    'M 112 102 L 112 116',
    'M 136 102 L 136 116',
    'M 50 138 Q 100 134 150 140',
    'M 50 168 L 50 188 Q 50 196 60 196 L 140 196 Q 150 196 150 188 L 150 168',
    'M 70 178 Q 100 175 130 180',
  ],
};

window.BrushWriter = function BrushWriter({
  chars = ['koto', 'rei'],
  size = 220,
  gap = 24,
  color = '#15130f',
  accent = '#b85d6e',
  strokeWidth = 8,
  staggerMs = 320,
  perStrokeMs = 700,
  loop = true,
  loopPauseMs = 2200,
  style = {},
}) {
  const all = [];
  chars.forEach((ck, ci) => {
    (STROKES[ck] || []).forEach((d, si) => all.push({ ci, si, d }));
  });

  const [tick, setTick] = useStateBW(0);
  useEffectBW(() => {
    if (!loop) return;
    const totalMs = all.length * staggerMs + perStrokeMs + loopPauseMs;
    const t = setInterval(() => setTick(x => x + 1), totalMs);
    return () => clearInterval(t);
  }, [loop, all.length, staggerMs, perStrokeMs, loopPauseMs]);

  useEffectBW(() => {
    if (document.getElementById('bw-keyframes')) return;
    const s = document.createElement('style');
    s.id = 'bw-keyframes';
    s.textContent = `
      @keyframes bw-draw { from { stroke-dashoffset: var(--bw-len, 400); } to { stroke-dashoffset: 0; } }
      @keyframes bw-bleed { 0% { opacity: 0; filter: blur(3px); } 60% { opacity: 0.9; filter: blur(0.5px); } 100% { opacity: 1; filter: blur(0); } }
      .bw-stroke { stroke-dasharray: var(--bw-len, 400); stroke-dashoffset: var(--bw-len, 400);
                   animation: bw-draw var(--bw-dur, 700ms) cubic-bezier(.42,.0,.4,1) forwards,
                              bw-bleed calc(var(--bw-dur, 700ms) * 1.4) ease-out forwards; }
      .bw-strokebg { opacity: 0; animation: bw-bleed 1.6s ease-out forwards; animation-delay: var(--bw-delay, 0ms); }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <svg
      key={tick}
      width={chars.length * size + (chars.length - 1) * gap}
      height={size}
      viewBox={`0 0 ${chars.length * (200 + gap * 200 / size) - gap * 200 / size} 220`}
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      <defs>
        <filter id="bw-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="2"/>
          <feDisplacementMap in="SourceGraphic" scale="1.6"/>
        </filter>
      </defs>
      {all.map((s, i) => {
        const isLast = i === all.length - 1;
        const xOffset = s.ci * (200 + gap * 200 / size);
        const len = 460;
        const delay = i * staggerMs;
        return (
          <g key={i} transform={`translate(${xOffset}, 0)`}>
            <path d={s.d}
                  className="bw-strokebg"
                  style={{ '--bw-delay': `${delay}ms` }}
                  stroke={isLast ? accent : color}
                  strokeWidth={strokeWidth * 1.6}
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.18"
                  filter="url(#bw-rough)"/>
            <path d={s.d}
                  className="bw-stroke"
                  style={{ '--bw-len': len, '--bw-dur': `${perStrokeMs}ms`,
                           animationDelay: `${delay}ms, ${delay}ms` }}
                  stroke={isLast ? accent : color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#bw-rough)"/>
          </g>
        );
      })}
    </svg>
  );
};
