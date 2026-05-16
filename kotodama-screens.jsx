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
    name: 'Sumi Noir',
    bg: '#000000',
    fg: '#f0e0c8',
    sub: 'rgba(240,224,200,0.6)',
    line: 'rgba(240,224,200,0.15)',
    paper: '#0a0806',
    accent: '#b7282e',
    accent2: '#d8a8b0',
    cardBg: 'rgba(240,224,200,0.04)',
    serif: '"Shippori Mincho", "Noto Serif JP", serif',
    sans: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    tone: 'midnight',
  },
};

window.KT_PRODUCTS = [
  {
    id: 'personal',
    name: 'Personal Reading',
    sub: 'Your name, fully unfolded',
    type: 'Digital · PDF · $19',
    price: 19,
    gumroad: 'https://cyberyush.gumroad.com/l/djzsxi',
    badge: 'Most Popular',
    desc: 'Your full kotodama reading — every sound of your name unfolded into its hidden meaning, with a print-ready poster. Hand-prepared and delivered to your inbox within 24 hours.',
    placeholder: 'Personal Reading PDF',
  },
  {
    id: 'couple',
    name: 'Reading for Two',
    sub: 'Two souls, one resonance',
    type: 'Digital · PDF · $35',
    price: 35,
    gumroad: 'https://cyberyush.gumroad.com/l/kkevz',
    requiresTwoNames: true,
    desc: 'Both names, both kotodama, and the resonance hidden between them. A keepsake for couples, family, or two who share a path.',
    placeholder: 'Couple Reading PDF',
  },
  {
    id: 'gift',
    name: 'Gift Edition',
    sub: 'An heirloom for someone you love',
    type: 'Digital · PDF · $49',
    price: 49,
    gumroad: 'https://cyberyush.gumroad.com/l/uhqny',
    requiresDedication: true,
    badge: 'Gift Favorite',
    desc: 'Everything in the Personal Reading, plus a dedication page (For [name], with love from [name]) and a hand-prepared message. Delivered to your inbox within 24 hours.',
    placeholder: 'Gift Edition PDF',
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

function NavBar({ theme, screen, onNav, hasReading }) {
  const items = [
    { k: 'about', label: 'About' },
    { k: 'products', label: 'Shop', enabled: true },
    { k: 'reading', label: 'Your Reading', enabled: hasReading },
  ];
  const [isMobile, setIsMobile] = useStateK(false);
  const [menuOpen, setMenuOpen] = useStateK(false);

  useEffectK(() => {
    const check = () => setIsMobile(window.innerWidth < 720);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px',
      borderBottom: `1px solid ${theme.line}`,
      background: theme.bg, position: 'relative', zIndex: 50,
    }}>
      <button onClick={() => onNav('landing')} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, flexShrink: 0 }}>
        <Logo theme={theme} />
      </button>

      {isMobile ? (
        <>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{
            background: 'none', border: 0, cursor: 'pointer', padding: 8,
            color: theme.fg, display: 'flex', flexDirection: 'column', gap: 5,
          }}>
            <span style={{ width: 22, height: 1.5, background: theme.fg, transition: 'transform 0.3s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transformOrigin: 'center' }}/>
            <span style={{ width: 22, height: 1.5, background: theme.fg, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }}/>
            <span style={{ width: 22, height: 1.5, background: theme.fg, transition: 'transform 0.3s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transformOrigin: 'center' }}/>
          </button>
          {menuOpen && (
            <div style={{
              position: 'fixed', inset: 0, background: theme.bg,
              zIndex: 40,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 40,
            }}>
              {items.map(i => (
                <button key={i.k} onClick={() => { setMenuOpen(false); i.enabled !== false && onNav(i.k); }}
                  style={{
                    background: 'none', border: 0, cursor: i.enabled === false ? 'not-allowed' : 'pointer',
                    color: screen === i.k ? theme.accent : theme.fg,
                    opacity: i.enabled === false ? 0.4 : 1,
                    fontFamily: theme.serif, fontSize: 32, letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: 0,
                  }}>{i.label}</button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{
          display: 'flex', gap: 28,
          fontFamily: theme.sans, fontSize: 13,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {items.map(i => (
            <button key={i.k} onClick={() => i.enabled !== false && onNav(i.k)}
              style={{
                background: 'none', border: 0, cursor: i.enabled === false ? 'not-allowed' : 'pointer',
                color: screen === i.k ? theme.fg : theme.sub,
                opacity: i.enabled === false ? 0.4 : 1,
                fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit',
                padding: 0, whiteSpace: 'nowrap',
              }}>{i.label}</button>
          ))}
        </div>
      )}
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

function HeroVideo() {
  const videoRef = useRefK(null);
  useEffectK(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    // retry on user interaction (iOS low-power mode workaround)
    const onTouch = () => { tryPlay(); document.removeEventListener('touchstart', onTouch); };
    document.addEventListener('touchstart', onTouch, { once: true });
    return () => document.removeEventListener('touchstart', onTouch);
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0, opacity: 0,
      animation: 'kt-video-in 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 6s forwards',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      <video
        ref={videoRef}
        src="assets/hero.mp4"
        autoPlay muted loop playsInline preload="auto"
        poster="assets/photos/birth.jpg"
        controls={false}
        disablePictureInPicture
        style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(10,8,6,0.45) 0%, rgba(10,8,6,0.25) 50%, rgba(10,8,6,0.7) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

function HeroParticleCanvas() {
  const canvasRef = useRefK(null);
  useEffectK(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, animId;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', resize);
    resize();
    const blobs = [
      { c: [255, 175, 110], cx: 0.15, cy: 0.18, r: 0.22, px: 0.0, py: 1.5, sx: 0.00028, sy: 0.00038 },
      { c: [255, 210, 130], cx: 0.78, cy: 0.16, r: 0.20, px: 1.2, py: 0.5, sx: 0.00040, sy: 0.00029 },
      { c: [255, 195, 165], cx: 0.48, cy: 0.28, r: 0.18, px: 2.1, py: 2.4, sx: 0.00033, sy: 0.00045 },
      { c: [255, 235, 215], cx: 0.30, cy: 0.42, r: 0.16, px: 3.0, py: 1.0, sx: 0.00048, sy: 0.00034 },
      { c: [255, 180,  95], cx: 0.62, cy: 0.40, r: 0.20, px: 0.8, py: 2.8, sx: 0.00037, sy: 0.00042 },
      { c: [255, 215, 140], cx: 0.85, cy: 0.50, r: 0.18, px: 1.7, py: 0.2, sx: 0.00031, sy: 0.00036 },
      { c: [255, 200, 170], cx: 0.10, cy: 0.55, r: 0.20, px: 2.4, py: 1.8, sx: 0.00042, sy: 0.00031 },
      { c: [255, 175, 100], cx: 0.45, cy: 0.65, r: 0.22, px: 0.5, py: 2.1, sx: 0.00029, sy: 0.00044 },
      { c: [255, 240, 220], cx: 0.72, cy: 0.72, r: 0.16, px: 1.9, py: 0.8, sx: 0.00046, sy: 0.00027 },
      { c: [255, 195, 130], cx: 0.20, cy: 0.85, r: 0.18, px: 2.7, py: 2.3, sx: 0.00035, sy: 0.00040 },
      { c: [255, 220, 150], cx: 0.55, cy: 0.90, r: 0.20, px: 0.3, py: 1.2, sx: 0.00038, sy: 0.00033 },
      { c: [255, 185, 110], cx: 0.90, cy: 0.85, r: 0.18, px: 1.4, py: 2.6, sx: 0.00041, sy: 0.00037 },
    ];
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const minDim = Math.min(w, h);
      blobs.forEach(b => {
        const xOff = Math.sin(b.px + t * b.sx) * w * 0.18;
        const yOff = Math.cos(b.py + t * b.sy) * h * 0.15;
        const x = b.cx * w + xOff;
        const y = b.cy * h + yOff;
        const r = b.r * minDim * (1 + 0.1 * Math.sin(t * 0.0004 + b.px));
        const [R, G, B] = b.c;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0,   `rgba(${R},${G},${B},0.85)`);
        grad.addColorStop(0.3, `rgba(${R},${G},${B},0.35)`);
        grad.addColorStop(0.6, `rgba(${R},${G},${B},0.10)`);
        grad.addColorStop(1,   `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden style={{
    position: 'absolute', inset: 0, zIndex: 2,
    width: '100%', height: '100%',
    pointerEvents: 'none', filter: 'blur(40px)',
    mixBlendMode: 'screen',
    animation: 'kt-particles-fade 1.8s cubic-bezier(0.4, 0, 0.6, 1) 6s forwards',
  }}/>;
}

function Landing({ theme, onStart }) {
  const SECTIONS = [
    { num: '— 01 —', kanji: '誕生', sub: 'For a new life',      desc: 'Brush a name for the soul just arriving. A whisper of welcome — printed and kept.', cta: 'Begin a reading', img: 'assets/photos/birth.jpg' },
    { num: '— 02 —', kanji: '育つ', sub: 'As a name grows',      desc: 'A name carries a child like a small lantern. Hear its sounds again, with new ears.', cta: 'Begin a reading', img: 'assets/photos/growth.jpg' },
    { num: '— 03 —', kanji: '結ぶ', sub: 'Two names, one path',  desc: 'When two names meet, a third spirit is born. A scroll for the day you tied.',         cta: 'Begin a reading', img: 'assets/photos/union.jpg' },
    { num: '— 04 —', kanji: '贈る', sub: 'For a friend',         desc: 'A name says "I see you." Brush a name for the friend who carries you.',              cta: 'Begin a reading', img: 'assets/photos/friend.jpg' },
    { num: '— 05 —', kanji: '想う', sub: 'Behind kotodama',      desc: 'Why does a name carry a life? A story by the founder, in his own words.',           cta: 'Read the story',  img: 'assets/photos/memory.jpg' },
  ];

  return (
    <div style={{ position: 'relative', background: theme.bg }}>
      {/* ============ HERO ============ */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: theme.bg }}>
        {/* video background */}
        <HeroVideo />


        {/* 言霊 brushed kanji backdrop (writes 0-8.3s, fades 10-12s) */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', opacity: 0.65,
          animation: 'kt-kanji-out 2s cubic-bezier(0.25, 0.1, 0.25, 1) 10s forwards',
        }}>
          <svg viewBox="0 0 440 220" style={{ width: 'min(720px, 80vw)', display: 'block', overflow: 'visible' }}>
            <text x="110" y="180" textAnchor="middle" style={{
              fontFamily: theme.serif, fontWeight: 700, fontSize: 210,
              fill: theme.fg, fillOpacity: 0, stroke: theme.fg, strokeWidth: 1.4,
              strokeDasharray: 1300, strokeDashoffset: 1300,
              animation: 'kt-brush-draw 4.5s ease-out 0.5s forwards, kt-brush-fill 1.5s ease-out 7s forwards',
            }}>言</text>
            <text x="330" y="180" textAnchor="middle" style={{
              fontFamily: theme.serif, fontWeight: 700, fontSize: 210,
              fill: theme.fg, fillOpacity: 0, stroke: theme.fg, strokeWidth: 1.4,
              strokeDasharray: 1600, strokeDashoffset: 1600,
              animation: 'kt-brush-draw 5.5s ease-out 2.8s forwards, kt-brush-fill 1.5s ease-out 7s forwards',
            }}>霊</text>
          </svg>
        </div>

        {/* canvas bokeh blobs (CRAZY-style) */}
        <HeroParticleCanvas />

        {/* hero text */}
        <div style={{
          position: 'relative', zIndex: 10,
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          maxWidth: 900, margin: '0 auto',
        }}>
          <h1 style={{
            fontFamily: theme.serif,
            fontSize: 'clamp(48px, 12vw, 140px)',
            fontWeight: 600, letterSpacing: '0',
            margin: '0 0 56px', color: theme.fg,
            display: 'flex', justifyContent: 'center', gap: '0',
            lineHeight: 1, textShadow: '0 0 32px rgba(0,0,0,0.5)',
          }}>
            {[
              { ch: 'K', anim: 'kt-fade-up',    delay: 1.0 },
              { ch: 'O', anim: 'kt-fade-up',    delay: 1.2 },
              { ch: 'T', anim: 'kt-fade-down',  delay: 1.4 },
              { ch: 'O', anim: 'kt-fade-down',  delay: 1.6, accent: true },
              { ch: 'D', anim: 'kt-fade-left',  delay: 1.8, accent: true },
              { ch: 'A', anim: 'kt-fade-left',  delay: 2.0 },
              { ch: 'M', anim: 'kt-fade-right', delay: 2.2 },
              { ch: 'A', anim: 'kt-fade-right', delay: 2.4 },
            ].map((l, i) => (
              <span key={i} style={{
                display: 'inline-block', opacity: 0,
                animation: `${l.anim} 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${l.delay}s forwards`,
                color: l.accent ? theme.accent : theme.fg,
              }}>{l.ch}</span>
            ))}
          </h1>
          <div style={{
            fontFamily: theme.serif,
            fontSize: 'clamp(17px, 4vw, 26px)',
            lineHeight: 1.55, color: theme.fg,
            fontStyle: 'italic', maxWidth: 620,
            textShadow: '0 0 24px rgba(0,0,0,0.5)', opacity: 0.92,
          }}>
            <p style={{ margin: 0, opacity: 0, animation: 'kt-fade-up-soft 1.6s cubic-bezier(0.25,0.1,0.25,1) 11.5s forwards' }}>
              In the beginning, the <span style={{ color: theme.accent }}>Word</span>.
            </p>
            <p style={{ margin: 0, marginBottom: '1.6em', opacity: 0, animation: 'kt-fade-up-soft 1.6s cubic-bezier(0.25,0.1,0.25,1) 11.9s forwards' }}>
              Through the Word, the <span style={{ color: theme.accent }}>world</span>.
            </p>
            <p style={{ margin: 0, opacity: 0, animation: 'kt-fade-up-soft 1.6s cubic-bezier(0.25,0.1,0.25,1) 12.5s forwards' }}>
              You were given a <span style={{ color: theme.accent }}>name</span>.
            </p>
            <p style={{ margin: 0, opacity: 0, animation: 'kt-fade-up-soft 1.6s cubic-bezier(0.25,0.1,0.25,1) 12.9s forwards' }}>
              Through your name, your <span style={{ color: theme.accent }}>life</span>.
            </p>
          </div>

          {/* Hero CTA — always visible, floats gently */}
          <button onClick={onStart} style={{
            marginTop: 'clamp(32px, 6vw, 56px)',
            padding: 'clamp(14px, 2.5vw, 22px) clamp(28px, 6vw, 56px)',
            background: 'transparent', color: theme.fg,
            border: `1px solid ${theme.fg}`,
            fontFamily: theme.mono, fontSize: 'clamp(12px, 1.5vw, 15px)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            cursor: 'pointer',
            textShadow: '0 0 16px rgba(0,0,0,0.6)',
            animation: 'kt-float 3.5s ease-in-out infinite',
          }}>Begin a reading →</button>
        </div>
      </section>

      {/* ============ INTRO: THE SPIRIT OF THE WORD ============ */}
      <section style={{
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 5vw, 60px)',
        background: theme.bg, textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          <h2 style={{
            fontFamily: theme.serif,
            fontSize: 'clamp(56px, 12vw, 120px)',
            fontWeight: 300, lineHeight: 1,
            letterSpacing: '0.32em', color: theme.fg,
            margin: '0 0 clamp(48px, 8vw, 80px)',
            paddingLeft: '0.32em',
          }}>
            言霊
          </h2>

          <div style={{
            position: 'relative',
            width: '100%', maxWidth: 480,
            margin: '0 auto clamp(48px, 8vw, 80px)',
            aspectRatio: '3/4', overflow: 'hidden',
          }}>
            <img src="assets/photos/intro.jpg"
              alt="言霊 — the spirit of the word"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                filter: 'sepia(0.7) brightness(0.85) contrast(0.95)',
              }}/>
          </div>

          <div style={{
            fontFamily: theme.serif,
            fontSize: 'clamp(17px, 3.5vw, 22px)',
            lineHeight: 1.7, fontStyle: 'italic',
            color: theme.fg, opacity: 0.92,
            display: 'flex', flexDirection: 'column',
            gap: 'clamp(28px, 5vw, 44px)',
          }}>
            <p style={{ margin: 0 }}>
              In the old Japanese tradition,<br/>
              every sound carries a meaning.
            </p>
            <p style={{ margin: 0 }}>
              A small spirit, called <span style={{ color: theme.accent, fontStyle: 'normal' }}>kotodama</span>.
            </p>
            <p style={{ margin: 0 }}>
              Brush a name<br/>
              for any chapter of a life.
            </p>
          </div>

        </div>
      </section>

      {/* ============ 5 SECTIONS ============ */}
      {SECTIONS.map((s, i) => (
        <section key={i} style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: `url('${s.img}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(10,8,6,0.4) 0%, rgba(10,8,6,0.25) 40%, rgba(10,8,6,0.75) 100%)',
          }}/>
          <div style={{
            position: 'relative', zIndex: 2,
            textAlign: 'center', padding: '40px 24px', maxWidth: 720,
          }}>
            <div style={{
              fontFamily: theme.mono, fontSize: 14,
              letterSpacing: '0.4em', color: theme.fg,
              textTransform: 'uppercase', opacity: 0.85,
              marginBottom: 24,
            }}>{s.num}</div>
            <h2 style={{
              fontFamily: theme.serif,
              fontSize: 'clamp(80px, 14vw, 180px)',
              fontWeight: 300, letterSpacing: '0.12em',
              lineHeight: 1, margin: '0 0 16px',
              color: theme.fg,
              textShadow: '0 0 32px rgba(0,0,0,0.6)',
            }}>{s.kanji}</h2>
            <div style={{
              fontFamily: theme.serif, fontStyle: 'italic',
              fontSize: 'clamp(24px, 4vw, 28px)',
              color: theme.fg, opacity: 0.92,
              marginBottom: 48, letterSpacing: '0.04em',
            }}>{s.sub}</div>
            <p style={{
              fontFamily: theme.serif,
              fontSize: 'clamp(22px, 4.5vw, 24px)',
              lineHeight: 1.7, color: theme.fg, opacity: 0.92,
              margin: '0 auto 56px', maxWidth: 560,
              fontStyle: 'italic',
              textShadow: '0 0 24px rgba(0,0,0,0.6)',
            }}>{s.desc}</p>
            <button onClick={onStart} style={{
              padding: 'clamp(14px, 2.5vw, 22px) clamp(28px, 6vw, 56px)',
              background: 'transparent', color: theme.fg,
              border: `1px solid ${theme.fg}`,
              fontFamily: theme.mono, fontSize: 'clamp(12px, 1.5vw, 15px)',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
            }}>{s.cta} →</button>
          </div>
        </section>
      ))}
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
    if (window.trackEvent) {
      window.trackEvent('kotodama_reveal', { name_input: name });
    }
    setStage('animating');
    setTimeout(() => onSubmit(), Math.max(2400, reading.syllables.length * 480 + 1200));
  };

  return (
    <div style={{ padding: '80px 60px', textAlign: 'center', minHeight: 600, background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      {/* 言霊 brushed kanji backdrop */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', opacity: 0.06,
      }}>
        <svg viewBox="0 0 440 220" style={{ width: 'min(900px, 75vw)', display: 'block' }}>
          <text x="110" y="180" textAnchor="middle" style={{
            fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
          }}>言</text>
          <text x="330" y="180" textAnchor="middle" style={{
            fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
          }}>霊</text>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase',
        color: theme.sub, marginBottom: 28,
      }}>STEP 01 · YOUR NAME</div>

      {stage === 'input' && (
        <>
          <h2 style={{
            fontFamily: theme.serif, fontSize: 'clamp(28px, 7vw, 48px)', lineHeight: 1.2, color: theme.fg, fontWeight: 400, margin: '0 0 16px',
          }}>Speak your name softly.</h2>
          <p style={{ fontFamily: theme.serif, fontSize: 'clamp(15px, 4vw, 17px)', color: theme.sub, maxWidth: 460, margin: '0 auto 56px' }}>
            We'll listen for the sounds inside it, and brush each one in ink.
          </p>

          <div style={{ maxWidth: 'min(480px, 90vw)', margin: '0 auto', position: 'relative' }}>
            <input ref={inputRef} value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && begin()}
              placeholder="Your given name"
              style={{
                width: '100%', padding: '20px 4px', background: 'transparent',
                border: 0, borderBottom: `1px solid ${theme.fg}`,
                fontFamily: theme.serif, fontSize: 'clamp(20px, 5vw, 32px)', color: theme.fg, textAlign: 'center',
                outline: 'none', letterSpacing: '0.04em', boxSizing: 'border-box',
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
    </div>
  );
}

function Reading({ theme, name, onShop, onShare, onBack }) {
  const reading = useMemoK(() => window.readName(name), [name]);
  const [activeIdx, setActiveIdx] = useStateK(0);

  if (!reading.syllables.length) return null;
  const active = reading.syllables[activeIdx];

  return (
    <div style={{ padding: 'clamp(40px, 6vw, 60px) clamp(20px, 5vw, 60px) 80px', position: 'relative', overflow: 'hidden', background: theme.bg }}>
      {/* 言霊 brushed kanji backdrop — visible behind reading */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', opacity: 0.15,
      }}>
        <svg viewBox="0 0 440 220" style={{ width: 'min(900px, 75vw)', display: 'block' }}>
          <text x="110" y="180" textAnchor="middle" style={{
            fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
          }}>言</text>
          <text x="330" y="180" textAnchor="middle" style={{
            fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
          }}>霊</text>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 0, cursor: 'pointer',
          color: theme.sub, fontFamily: theme.mono, fontSize: 11,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: 0, marginBottom: 32, display: 'inline-block',
        }}>← Try a different name</button>
      )}
      <div style={{
        textAlign: 'center', fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: theme.sub, marginBottom: 24,
      }}>言霊 · A reading for</div>

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: theme.serif, fontSize: 64, color: theme.fg, fontStyle: 'italic',
          letterSpacing: '-0.01em',
        }}>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44, gap: 8 }}>
        <window.BrushStroke width={90} height={12} color={theme.fg} seed={3} opacity={0.7}/>
        <window.BrushStroke width={50} height={12} color={theme.accent} seed={7} opacity={0.7}/>
      </div>

      <div style={{
        textAlign: 'center', maxWidth: 640, margin: '0 auto 64px', padding: '36px 32px',
        background: 'rgba(0,0,0,0.45)',
        borderTop: `1px solid ${theme.line}`,
        borderBottom: `1px solid ${theme.line}`,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.28em',
                      textTransform: 'uppercase', color: theme.sub, marginBottom: 14 }}>
          Archetype
        </div>
        <div style={{ fontFamily: theme.serif, fontSize: 36, color: theme.fg, marginBottom: 14,
                      fontStyle: 'italic' }}>
          <span style={{ color: theme.accent }}>—</span> {reading.archetype.name} <span style={{ color: theme.accent }}>—</span>
        </div>
        <div style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
                      color: theme.sub, maxWidth: 480, margin: '0 auto' }}>
          “{reading.archetype.desc}”
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 'clamp(24px, 6vw, 56px)', maxWidth: 980, margin: '0 auto',
        alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {/* Syllable tabs: vertical on desktop, horizontal scroll on mobile */}
        <div style={{
          flex: '0 0 auto', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12, width: '100%', maxWidth: 280,
        }}>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub }}>
            The sounds
          </div>
          <div style={{
            display: 'flex',
            flexDirection: typeof window !== 'undefined' && window.innerWidth < 720 ? 'row' : 'column',
            flexWrap: 'wrap', justifyContent: 'center',
            gap: typeof window !== 'undefined' && window.innerWidth < 720 ? 16 : 10,
            padding: '20px 0',
            borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}`,
            width: '100%',
          }}>
            {reading.syllables.map((s, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                background: 'none', border: 0, cursor: 'pointer',
                fontFamily: theme.serif,
                fontSize: i === activeIdx ? 56 : 36,
                color: i === activeIdx ? theme.fg : theme.sub,
                opacity: i === activeIdx ? 1 : 0.45,
                lineHeight: 1, padding: 0, transition: 'all 0.4s cubic-bezier(.2,.7,.3,1)',
                textAlign: 'center',
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

        <div style={{ flex: '1 1 320px', paddingTop: 30, minWidth: 0 }} key={activeIdx} className="kt-fadeup">
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.28em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 14, textAlign: 'center' }}>
            Syllable {String(activeIdx + 1).padStart(2, '0')} of {String(reading.syllables.length).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 18, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: theme.serif, fontSize: 'clamp(72px, 18vw, 120px)', color: theme.fg, lineHeight: 1 }}>{active.kana}</span>
            <span style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 'clamp(22px, 5vw, 28px)', color: theme.sub }}>— {active.romaji}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {active.colorPill && (
              <span aria-hidden="true" style={{
                width: 22, height: 22, borderRadius: '50%',
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
            <span style={{ fontFamily: theme.serif, fontSize: 'clamp(20px, 5vw, 24px)', color: theme.fg, fontStyle: 'italic' }}>
              {active.keyword}
            </span>
          </div>
          <p style={{ fontFamily: theme.serif, fontSize: 'clamp(20px, 5vw, 22px)', lineHeight: 1.55, color: theme.fg,
                      fontStyle: 'italic', maxWidth: 540, margin: '0 auto 24px', textAlign: 'center' }}>
            “{active.poem}”
          </p>
          {active.deepMeaning && (
            <p style={{
              fontFamily: theme.serif, fontSize: 'clamp(16px, 4vw, 18px)', lineHeight: 1.75,
              color: theme.fg, fontWeight: 300,
              maxWidth: 580, margin: '0 auto 36px',
              opacity: 0.85, textAlign: 'left',
            }}>
              {active.deepMeaning}
            </p>
          )}

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
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
        marginTop: 80, padding: 'clamp(28px, 5vw, 40px) clamp(20px, 5vw, 36px)',
        background: 'rgba(0,0,0,0.45)',
        borderTop: `1px solid ${theme.line}`,
        borderBottom: `1px solid ${theme.line}`,
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 10 }}>
            Keep this spirit close
          </div>
          <div style={{ fontFamily: theme.serif, fontSize: 24, color: theme.fg }}>
            Make {name}'s reading yours — a scroll, a tee, or a quiet keepsake.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => window.KT_PDF && window.KT_PDF.generateFreeSamplePdf(name)} style={{
            background: 'none', color: theme.fg, border: `1px solid ${theme.fg}`,
            padding: '14px 22px', fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Free Sample · 3 sounds</button>
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
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// AdminPanel — URL ?admin=1 で表示される運用ツール
// 各 SKU の PDF を入力フォーム → window.KT_PDF.* で生成
// ──────────────────────────────────────────────────────────────────────────
function AdminPanel({ theme }) {
  const [customerName, setCustomerName] = useStateK('');
  const [secondName, setSecondName] = useStateK('');
  const [senderName, setSenderName] = useStateK('');
  const [giftNote, setGiftNote] = useStateK('');

  const inputStyle = {
    width: '100%', padding: '10px 12px', fontFamily: theme.serif, fontSize: 15,
    background: theme.bg, border: `1px solid ${theme.line}`, color: theme.fg,
    outline: 'none', borderRadius: 0, marginBottom: 12, boxSizing: 'border-box',
  };
  const labelStyle = {
    fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: theme.sub, display: 'block',
    marginBottom: 8, marginTop: 12,
  };
  const btnStyle = {
    background: 'none', border: `1px solid ${theme.fg}`, color: theme.fg,
    padding: '12px 18px', fontFamily: theme.sans, fontSize: 11,
    letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
  };

  return (
    <div style={{ padding: '60px 60px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{
        fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: theme.sub, marginBottom: 20,
      }}>ADMIN · PDF FULFILLMENT</div>
      <h2 style={{
        fontFamily: theme.serif, fontSize: 36, color: theme.fg,
        fontWeight: 400, margin: '0 0 12px',
      }}>Generate Reading PDFs</h2>
      <p style={{ fontFamily: theme.serif, fontSize: 14, color: theme.sub, marginBottom: 32 }}>
        Gumroad 注文ごとに、購入者の名前を入力 → 該当 SKU の PDF を生成 → メールで配信。
        URL に <code style={{ background: theme.cardBg, padding: '2px 6px' }}>?admin=1</code> を付けた時のみ表示。
      </p>

      <div style={{ padding: 24, background: theme.cardBg, border: `1px solid ${theme.line}`, marginBottom: 28 }}>
        <label style={{ ...labelStyle, marginTop: 0 }}>Customer Name (required for all)</label>
        <input value={customerName} onChange={e => setCustomerName(e.target.value)}
          placeholder="e.g. Sophia" style={inputStyle}/>

        <label style={labelStyle}>Second Name (Couple $35 only)</label>
        <input value={secondName} onChange={e => setSecondName(e.target.value)}
          placeholder="e.g. Michael" style={inputStyle}/>

        <label style={labelStyle}>Sender Name (Gift $49 only)</label>
        <input value={senderName} onChange={e => setSenderName(e.target.value)}
          placeholder="e.g. James" style={inputStyle}/>

        <label style={labelStyle}>Personal Note (Gift $49, optional)</label>
        <textarea value={giftNote} onChange={e => setGiftNote(e.target.value)}
          rows={2}
          placeholder="A few words from the giver..."
          style={{ ...inputStyle, fontFamily: theme.serif, lineHeight: 1.5, resize: 'vertical', minHeight: 60 }}/>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={btnStyle} onClick={() => {
          if (!customerName.trim()) return alert('Customer name is required.');
          window.KT_PDF.generateFreeSamplePdf(customerName);
        }}>Free Sample</button>

        <button style={btnStyle} onClick={() => {
          if (!customerName.trim()) return alert('Customer name is required.');
          window.KT_PDF.generateFullPersonalPdf(customerName);
        }}>Personal Reading ($19)</button>

        <button style={btnStyle} onClick={() => {
          if (!customerName.trim() || !secondName.trim()) return alert('Both names are required for couple reading.');
          window.KT_PDF.generateCoupleReadingPdf(customerName, secondName);
        }}>Couple Reading ($35)</button>

        <button style={btnStyle} onClick={() => {
          if (!customerName.trim() || !senderName.trim()) return alert('Recipient and sender names are required.');
          window.KT_PDF.generateGiftEditionPdf(customerName, senderName, giftNote);
        }}>Gift Edition ($49)</button>
      </div>
    </div>
  );
}

window.KT_PARTS = window.KT_PARTS || {};
Object.assign(window.KT_PARTS, { Logo, NavBar, Placeholder, Landing, NameInput, Reading, AdminPanel });
