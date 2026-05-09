// Kotodama prototype — main app component.
// 6 screens: Landing → NameInput → Reading → Products → PDP → Cart.

const { useState: useStateK, useEffect: useEffectK, useMemo: useMemoK, useRef: useRefK } = React;

window.KT_THEMES = {
  sumie: {
    name: 'Sumi-e Calm',
    bg: '#f6f1e7',
    fg: '#15130f',
    sub: 'rgba(21,19,15,0.6)',
    line: 'rgba(21,19,15,0.18)',
    paper: '#fbf7ee',
    accent: '#a8362a',
    accent2: '#b85d6e',
    cardBg: 'rgba(255,253,247,0.7)',
    serif: '"Shippori Mincho", "Noto Serif JP", "EB Garamond", serif',
    sans: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    tone: 'warm',
  },
  moonlit: {
    name: 'Moonlit Indigo',
    bg: '#0e1118',
    fg: '#f1ebd9',
    sub: 'rgba(241,235,217,0.55)',
    line: 'rgba(241,235,217,0.15)',
    paper: '#161a23',
    accent: '#c8a657',
    accent2: '#7a8db5',
    cardBg: 'rgba(255,253,247,0.04)',
    serif: '"Shippori Mincho", "Noto Serif JP", serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    tone: 'midnight',
  },
  sakura: {
    name: 'Sakura Soft',
    bg: '#f5ecdf',
    fg: '#3a2230',
    sub: 'rgba(58,34,48,0.6)',
    line: 'rgba(58,34,48,0.15)',
    paper: '#faf2e6',
    accent: '#b85d6e',
    accent2: '#d4a59b',
    cardBg: 'rgba(255,250,242,0.7)',
    serif: '"Shippori Mincho", "Noto Serif JP", serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    tone: 'warm',
  },
};

window.KT_PRODUCTS = [
  {
    id: 'pdf',
    name: 'Kotodama Reading',
    sub: 'A printable scroll of your name',
    type: 'Digital · PDF',
    price: 18,
    formats: ['12-page PDF', 'Print at home'],
    desc: 'A long-form, hand-typeset PDF — your full reading, the syllables of your name, the elemental archetype, and a meditation written for you.',
    placeholder: 'PDF scroll',
  },
];

function Logo({ theme, size = 18 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: theme.serif, fontSize: size, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: theme.fg,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke={theme.fg} strokeWidth="1.5"
                strokeDasharray="0 5 50" strokeLinecap="round" transform="rotate(-90 12 12)"/>
      </svg>
      <span>Kotodama</span>
    </div>
  );
}

function NavBar({ theme, screen, onNav, hasReading, cartCount }) {
  const items = [
    { k: 'about', label: 'About' },
    { k: 'products', label: 'Shop', enabled: true },
    { k: 'reading', label: 'Your Reading', enabled: hasReading },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 36px', borderBottom: `1px solid ${theme.line}`,
      background: theme.bg, position: 'relative', zIndex: 5,
    }}>
      <button onClick={() => onNav('landing')} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
        <Logo theme={theme} />
      </button>
      <div style={{ display: 'flex', gap: 28, fontFamily: theme.sans, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {items.map(i => (
          <button key={i.k} onClick={() => i.enabled !== false && onNav(i.k)}
            style={{
              background: 'none', border: 0, cursor: i.enabled === false ? 'not-allowed' : 'pointer',
              color: screen === i.k ? theme.fg : theme.sub,
              opacity: i.enabled === false ? 0.4 : 1,
              fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit',
              padding: 0,
            }}>{i.label}</button>
        ))}
      </div>
      <button onClick={() => onNav('cart')} style={{
        background: 'none', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: theme.sans, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.fg,
      }}>
        <span>Cart</span>
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: theme.accent,
          color: theme.tone === 'midnight' ? '#0e1118' : '#fff', fontSize: 11,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.sans, letterSpacing: 0,
        }}>{cartCount}</span>
      </button>
    </div>
  );
}

function Placeholder({ label, theme, w = '100%', h = 280, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${theme.line} 0 1px, transparent 1px 12px)`,
      border: `1px solid ${theme.line}`, ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: theme.mono, fontSize: 11, color: theme.sub, letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>[ {label} ]</div>
    </div>
  );
}

function KotodamaBrushBackdrop({ theme }) {
  const inkColor = theme.fg;
  return (
    <div aria-hidden style={{
      position: 'absolute', top: '6%', left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      width: 'min(720px, 70vw)',
      zIndex: 0,
      opacity: 0.07,
    }}>
      <svg viewBox="0 0 440 220" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="brushTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
        </defs>
        <g filter="url(#brushTexture)">
          <text x="110" y="180" textAnchor="middle"
            style={{
              fontFamily: theme.serif, fontWeight: 700, fontSize: 210,
              fill: inkColor, fillOpacity: 0,
              stroke: inkColor, strokeWidth: 1.4,
              strokeDasharray: 1300, strokeDashoffset: 1300,
              animation: 'kt-brush-draw 2.8s ease-out 0.3s forwards, kt-brush-fill 1.2s ease-out 2.8s forwards',
            }}>言</text>
        </g>
        <g filter="url(#brushTexture)">
          <text x="330" y="180" textAnchor="middle"
            style={{
              fontFamily: theme.serif, fontWeight: 700, fontSize: 210,
              fill: inkColor, fillOpacity: 0,
              stroke: inkColor, strokeWidth: 1.4,
              strokeDasharray: 1600, strokeDashoffset: 1600,
              animation: 'kt-brush-draw 3.6s ease-out 1.8s forwards, kt-brush-fill 1.2s ease-out 5.0s forwards',
            }}>霊</text>
        </g>
      </svg>
    </div>
  );
}

function Landing({ theme, onStart }) {
  return (
    <div style={{ padding: '80px 60px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <KotodamaBrushBackdrop theme={theme} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', zIndex: 1 }}>
        <div style={{
          fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase',
          color: theme.sub, marginBottom: 56,
        }}>言霊 · KO · TO · DA · MA</div>

        <div style={{
          position: 'relative', perspective: '1400px',
          marginBottom: 36, minHeight: 220,
        }}>
          <h1 style={{
            position: 'relative', zIndex: 1,
            fontFamily: theme.serif, fontWeight: 500,
            fontSize: 'clamp(72px, 11vw, 156px)',
            lineHeight: 1, letterSpacing: '0.04em', margin: 0,
            color: theme.fg, display: 'flex', justifyContent: 'center', gap: '0.04em',
            transformStyle: 'preserve-3d',
          }}>
            {[
              { ch: 'K', anim: 'kt-fly',   delay: 0.2 },
              { ch: 'O', anim: 'kt-rise',  delay: 0.9 },
              { ch: 'T', anim: 'kt-drop',  delay: 1.6 },
              { ch: 'O', anim: 'kt-bloom', delay: 2.3 },
              { ch: 'D', anim: 'kt-drift', delay: 3.0 },
              { ch: 'A', anim: 'kt-spin',  delay: 3.7 },
              { ch: 'M', anim: 'kt-drift-r', delay: 4.4 },
              { ch: 'A', anim: 'kt-rise',  delay: 5.1 },
            ].map((l, i) => (
              <span key={i} style={{
                display: 'inline-block',
                animation: `${l.anim} 1.6s cubic-bezier(.16,.84,.3,1.02) ${l.delay}s both`,
                color: i === 3 ? theme.accent2 : theme.fg,
                transformStyle: 'preserve-3d',
              }}>{l.ch}</span>
            ))}
          </h1>
          <div aria-hidden style={{
            position: 'absolute', left: '50%', bottom: -10, transform: 'translateX(-50%)',
            width: '70%', height: 16,
            background: `radial-gradient(ellipse at center, ${theme.fg}22, transparent 70%)`,
            animation: 'kt-shadow 1.6s ease-out 6.4s both',
          }}/>
        </div>

        <h2 style={{
          fontFamily: theme.serif, fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.005em',
          color: theme.fg, fontWeight: 400, margin: '0 0 24px',
          animation: 'kt-fadeup 1.2s ease-out 7.0s both',
        }}>
          Discover the <em style={{ fontStyle: 'italic', color: theme.accent2 }}>whisper</em> of your name.
        </h2>

        <p style={{
          fontFamily: theme.serif, fontSize: 18, lineHeight: 1.6, color: theme.sub,
          maxWidth: 520, margin: '0 auto 48px',
          animation: 'kt-fadeup 1.2s ease-out 7.3s both',
        }}>
          In the old Japanese tradition, every sound carries a meaning — a small spirit called <em>kotodama</em>.
          Enter your name and we will brush its hidden song.
        </p>

        <button onClick={onStart} style={{
          animation: 'kt-fadeup 1.2s ease-out 7.6s both',
          background: theme.fg, color: theme.bg, border: 0, padding: '18px 44px',
          fontFamily: theme.sans, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
          cursor: 'pointer', borderRadius: 0,
        }}>Begin your reading</button>

        <div style={{
          marginTop: 16, fontFamily: theme.sans, fontSize: 12, color: theme.sub,
          animation: 'kt-fadeup 1.2s ease-out 7.8s both',
        }}>Free · takes about a minute</div>

        <div style={{
          marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48,
          textAlign: 'left', borderTop: `1px solid ${theme.line}`, paddingTop: 48,
        }}>
          {[
            { kana: '一', en: 'one', t: 'A reading for you', d: 'Each name is brushed by hand into kana, then read sound by sound.' },
            { kana: '二', en: 'two', t: 'A scroll to keep',   d: 'Take your reading home as a printable PDF or hand-painted scroll.' },
            { kana: '三', en: 'three', t: 'A name to wear',   d: 'Tees, totes and small things — your name in archival ink.' },
          ].map((p, i) => (
            <div key={i}>
              <div style={{ fontFamily: theme.serif, fontSize: 38, color: theme.fg, marginBottom: 10 }}>{p.kana}</div>
              <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: theme.sub, marginBottom: 8 }}>— {p.en}</div>
              <div style={{ fontFamily: theme.serif, fontSize: 18, color: theme.fg, marginBottom: 8 }}>{p.t}</div>
              <div style={{ fontFamily: theme.serif, fontSize: 14, lineHeight: 1.55, color: theme.sub }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NameInput({ theme, name, setName, onSubmit }) {
  const [stage, setStage] = useStateK('input');
  const reading = useMemoK(() => window.readName(name), [name]);
  const inputRef = useRefK(null);
  useEffectK(() => { setTimeout(() => inputRef.current && inputRef.current.focus(), 100); }, []);

  const begin = () => {
    if (!name.trim() || reading.syllables.length === 0) return;
    setStage('animating');
    setTimeout(() => onSubmit(), Math.max(2400, reading.syllables.length * 480 + 1200));
  };

  return (
    <div style={{ padding: '80px 60px', textAlign: 'center', minHeight: 600 }}>
      <div style={{
        fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase',
        color: theme.sub, marginBottom: 28,
      }}>STEP 01 · YOUR NAME</div>

      {stage === 'input' && (
        <>
          <h2 style={{
            fontFamily: theme.serif, fontSize: 48, lineHeight: 1.15, color: theme.fg, fontWeight: 400, margin: '0 0 16px',
          }}>Speak your name softly.</h2>
          <p style={{ fontFamily: theme.serif, fontSize: 17, color: theme.sub, maxWidth: 460, margin: '0 auto 56px' }}>
            We'll listen for the sounds inside it, and brush each one in ink.
          </p>

          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <input ref={inputRef} value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && begin()}
              placeholder="Your given name"
              style={{
                width: '100%', padding: '20px 4px', background: 'transparent',
                border: 0, borderBottom: `1px solid ${theme.fg}`,
                fontFamily: theme.serif, fontSize: 32, color: theme.fg, textAlign: 'center',
                outline: 'none', letterSpacing: '0.04em',
              }}/>
            {reading.syllables.length > 0 && (
              <div style={{
                marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12,
                fontFamily: theme.serif, fontSize: 28, color: theme.sub, opacity: 0.7,
              }}>
                {reading.syllables.map((s, i) => (
                  <span key={i} style={{ animation: `kt-fadeup 0.4s ${i * 0.05}s both` }}>{s.kana}</span>
                ))}
              </div>
            )}
          </div>

          <button onClick={begin} disabled={!name.trim() || reading.syllables.length === 0}
            style={{
              marginTop: 56, background: theme.fg, color: theme.bg, border: 0, padding: '16px 40px',
              fontFamily: theme.sans, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : 0.4,
            }}>Brush my name →</button>

          <div style={{ marginTop: 20, fontFamily: theme.sans, fontSize: 11, color: theme.sub }}>
            We don't store your name unless you ask us to.
          </div>
        </>
      )}

      {stage === 'animating' && (
        <div style={{ paddingTop: 40 }}>
          <div style={{
            fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em', color: theme.sub, marginBottom: 80,
          }}>LISTENING…</div>

          <div style={{ position: 'relative', width: 0, height: 0, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: -200, top: -100 }}>
              <window.Ripple size={400} color={theme.line.replace(/[0-9.]+\)/, '0.4)')}/>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <window.NameReveal syllables={reading.syllables} fontSize={80} color={theme.fg}/>
          </div>
          <div style={{ marginTop: 40, fontFamily: theme.serif, fontStyle: 'italic',
                        fontSize: 18, color: theme.sub, opacity: 0.7,
                        animation: 'kt-pulse 2s ease-in-out infinite' }}>
            reading the spirits of your sounds…
          </div>
        </div>
      )}
    </div>
  );
}

function Reading({ theme, name, onShop, onShare }) {
  const reading = useMemoK(() => window.readName(name), [name]);
  const [activeIdx, setActiveIdx] = useStateK(0);

  if (!reading.syllables.length) return null;
  const active = reading.syllables[activeIdx];

  return (
    <div style={{ padding: '60px 60px 80px' }}>
      <div style={{
        textAlign: 'center', fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: theme.sub, marginBottom: 24,
      }}>A KOTODAMA READING FOR</div>

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: theme.serif, fontSize: 64, color: theme.fg, fontStyle: 'italic',
          letterSpacing: '-0.01em',
        }}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44, gap: 8 }}>
        <window.BrushStroke width={90} height={12} color={theme.fg} seed={3} opacity={0.7}/>
        <window.BrushStroke width={50} height={12} color={theme.accent2} seed={7} opacity={0.65}/>
      </div>

      <div style={{
        textAlign: 'center', maxWidth: 640, margin: '0 auto 64px', padding: '36px 32px',
        borderTop: `1px solid ${theme.accent2}`, borderBottom: `1px solid ${theme.line}`,
        background: theme.cardBg, border: `1px solid ${theme.line}`,
      }}>
        <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.28em',
                      textTransform: 'uppercase', color: theme.sub, marginBottom: 14 }}>
          YOUR ARCHETYPE
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 36, color: theme.fg, marginBottom: 14,
                      fontStyle: 'italic' }}>
          <span style={{ color: theme.accent2 }}>—</span> {reading.archetype.name} <span style={{ color: theme.accent2 }}>—</span>
        </div>
        <div style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
                      color: theme.sub, maxWidth: 480, margin: '0 auto' }}>
          “{reading.archetype.desc}”
        </div>
      </div>

      <div style={{ display: 'flex', gap: 56, maxWidth: 980, margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub }}>
            THE SOUNDS
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 0',
            borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}`,
          }}>
            {reading.syllables.map((s, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                background: 'none', border: 0, cursor: 'pointer',
                fontFamily: theme.serif,
                fontSize: i === activeIdx ? 64 : 44,
                color: i === activeIdx ? theme.fg : theme.sub,
                opacity: i === activeIdx ? 1 : 0.45,
                lineHeight: 1, padding: 0, transition: 'all 0.4s cubic-bezier(.2,.7,.3,1)',
              }}>
                {s.kana}
                <div style={{
                  fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.18em', marginTop: 4,
                  textTransform: 'uppercase',
                }}>{s.romaji}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, paddingTop: 30 }} key={activeIdx} className="kt-fadeup">
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.28em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 14 }}>
            SYLLABLE {String(activeIdx + 1).padStart(2, '0')} OF {String(reading.syllables.length).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 8 }}>
            <span style={{ fontFamily: theme.serif, fontSize: 96, color: theme.fg, lineHeight: 1 }}>{active.kana}</span>
            <span style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 28, color: theme.sub }}>— {active.romaji}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'center' }}>
            {active.colorPill && (
              <span aria-hidden="true" style={{
                width: 24, height: 24, borderRadius: '50%',
                background: active.colorPill,
                boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                flexShrink: 0,
              }}/>
            )}
            <span style={{
              fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: theme.accent,
              padding: '4px 10px', border: `1px solid ${theme.accent}`,
            }}>{active.element}</span>
            <span style={{ fontFamily: theme.serif, fontSize: 24, color: theme.fg, fontStyle: 'italic' }}>
              {active.keyword}
            </span>
          </div>
          <p style={{ fontFamily: theme.serif, fontSize: 22, lineHeight: 1.55, color: theme.fg,
                      fontStyle: 'italic', maxWidth: 460, margin: '0 0 24px' }}>
            “{active.poem}”
          </p>
          {active.deepMeaning && (
            <p style={{
              fontFamily: theme.serif, fontSize: 16, lineHeight: 1.75,
              color: theme.fg, fontWeight: 300,
              maxWidth: 540, margin: '0 0 36px',
              opacity: 0.85,
            }}>
              {active.deepMeaning}
            </p>
          )}

          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={() => setActiveIdx((activeIdx - 1 + reading.syllables.length) % reading.syllables.length)}
              style={{ background: 'none', border: `1px solid ${theme.line}`, color: theme.fg, padding: '10px 16px',
                       fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em',
                       textTransform: 'uppercase', cursor: 'pointer' }}>← Previous sound</button>
            <button onClick={() => setActiveIdx((activeIdx + 1) % reading.syllables.length)}
              style={{ background: 'none', border: `1px solid ${theme.line}`, color: theme.fg, padding: '10px 16px',
                       fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em',
                       textTransform: 'uppercase', cursor: 'pointer' }}>Next sound →</button>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 80, padding: '40px 36px', background: theme.cardBg, border: `1px solid ${theme.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32,
      }}>
        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 10 }}>
            CARRY YOUR READING WITH YOU
          </div>
          <div style={{ fontFamily: theme.serif, fontSize: 24, color: theme.fg }}>
            Take {name}'s reading home — as a scroll, a tee, or a keepsake.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button onClick={onShare} style={{
            background: 'none', color: theme.fg, border: `1px solid ${theme.fg}`,
            padding: '14px 22px', fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Share my reading</button>
          <button onClick={onShop} style={{
            background: theme.fg, color: theme.bg, border: 0,
            padding: '14px 26px', fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Shop the collection →</button>
        </div>
      </div>
    </div>
  );
}

window.KT_PARTS = window.KT_PARTS || {};
Object.assign(window.KT_PARTS, { Logo, NavBar, Placeholder, Landing, NameInput, Reading });
