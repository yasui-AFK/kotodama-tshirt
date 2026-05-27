// Kotodama prototype — part 2: Products, PDP, Cart, Share modal, App shell.

const { useState: useStateK2, useEffect: useEffectK2, useMemo: useMemoK2, useRef: useRefK2 } = React;
const { Logo: KLogo, NavBar: KNavBar, Placeholder: KPH, Landing: KLanding,
        NameInput: KNameInput, Reading: KReading } = window.KT_PARTS;

function Products({ theme, name, reading, onPick }) {
  const possessive = name && name !== 'your' ? `${name}'s` : 'your';
  return (
    <div style={{ padding: 'clamp(24px, 5vw, 60px) clamp(20px, 5vw, 60px) 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 56px)' }}>
        <div style={{ fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
                      textTransform: 'uppercase', color: theme.sub, marginBottom: 22 }}>
          THE COLLECTION
        </div>
        <h2 style={{ fontFamily: theme.serif, fontSize: 'clamp(32px, 7vw, 56px)', color: theme.fg,
                     fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1 }}>
          Things to keep <em style={{ fontStyle: 'italic' }}>{possessive}</em> reading.
        </h2>
        <p style={{ fontFamily: theme.serif, fontSize: 'clamp(15px, 2.2vw, 17px)', color: theme.sub,
                    maxWidth: 520, margin: '0 auto' }}>
          Each piece is made to order with your name brushed in archival ink.
          {reading && reading.archetype && <> Curated for <em>{reading.archetype.name}</em>.</>}
        </p>
      </div>

      <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                    gap: 'clamp(20px, 3vw, 36px)', maxWidth: 980, margin: '0 auto' }}>
        {window.KT_PRODUCTS.map(p => (
          <button key={p.id} onClick={() => onPick(p)} style={{
            background: theme.cardBg, border: `1px solid ${theme.line}`,
            padding: 'clamp(20px, 3vw, 28px)', textAlign: 'left',
            cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: 18,
            color: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.borderColor = theme.fg; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = theme.line; }}>
            <div style={{ position: 'relative' }}>
              <KPH label={p.placeholder} theme={theme} h={280}/>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontFamily: theme.serif, fontSize: 32, color: theme.fg, opacity: 0.5,
                writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.08em',
              }}>
                {reading && reading.syllables.slice(0, 3).map(s => s.kana).join('')}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
                            textTransform: 'uppercase', color: theme.sub, marginBottom: 10 }}>
                {p.type}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 8 }}>
                <h3 style={{ fontFamily: theme.serif, fontSize: 'clamp(22px, 4vw, 28px)', color: theme.fg,
                             fontWeight: 400, margin: 0, lineHeight: 1.15 }}>{p.name}</h3>
                <div style={{ fontFamily: theme.serif, fontSize: 'clamp(18px, 3vw, 22px)', color: theme.fg }}>${p.price}</div>
              </div>
              <div style={{ fontFamily: theme.serif, fontStyle: 'italic',
                            fontSize: 15, color: theme.sub }}>{p.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PDP({ theme, product, name, reading, onBack }) {
  const [secondName, setSecondName] = useStateK2('');
  const [senderName, setSenderName] = useStateK2('');
  const [dedication, setDedication] = useStateK2('');

  const handleBuyClick = () => {
    if (window.trackEvent) {
      const eventName = product.id === 'personal' ? 'pdf_buy_click'
                      : product.id === 'couple' ? 'couple_pdf_buy_click'
                      : 'gift_buy_click';
      window.trackEvent(eventName, { name_input: name });
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontFamily: theme.serif, fontSize: 16,
    background: theme.bg, border: `1px solid ${theme.line}`, color: theme.fg,
    outline: 'none', borderRadius: 0,
  };

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 40px) clamp(20px, 5vw, 60px) 80px' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 0, cursor: 'pointer', color: theme.sub,
        fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        padding: 0, marginBottom: 'clamp(20px, 4vw, 32px)',
      }}>← back to collection</button>

      <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                    gap: 'clamp(28px, 5vw, 56px)', maxWidth: 1080, margin: '0 auto' }}>
        <div>
          <div style={{ position: 'relative', background: theme.paper,
                        border: `1px solid ${theme.line}`, aspectRatio: '4/5', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.mono, fontSize: 10, color: theme.sub, opacity: 0.3,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>[ {product.placeholder} ]</div>

            {reading && reading.syllables && reading.syllables.length > 0 && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: theme.serif, fontSize: 18, color: theme.sub,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16,
                }}>{name.toUpperCase()}</div>
                <window.VerticalKana
                  text={reading.syllables.map(s => s.kana).join('')}
                  fontSize={56}
                  color={theme.fg}
                />
              </div>
            )}

            <div style={{
              position: 'absolute', bottom: 14, right: 14,
              fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: theme.sub,
              padding: '4px 8px', background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${theme.line}`,
            }}>PREVIEW</div>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 14 }}>
            {product.type}
          </div>
          <h1 style={{ fontFamily: theme.serif, fontSize: 'clamp(28px, 7vw, 44px)', color: theme.fg,
                       fontWeight: 400, margin: '0 0 12px', lineHeight: 1.1 }}>{product.name}</h1>
          <div style={{ fontFamily: theme.serif, fontStyle: 'italic',
                        fontSize: 'clamp(15px, 3vw, 18px)',
                        color: theme.sub, marginBottom: 20 }}>{product.sub}</div>
          <div style={{ fontFamily: theme.serif, fontSize: 'clamp(22px, 5vw, 28px)',
                        color: theme.fg, marginBottom: 28 }}>${product.price}</div>

          <p style={{ fontFamily: theme.serif, fontSize: 'clamp(15px, 2.6vw, 16px)', lineHeight: 1.6,
                      color: theme.fg, marginBottom: 36 }}>{product.desc}</p>

          {name && (
            <div style={{ marginBottom: 24, padding: '18px 22px', background: theme.cardBg,
                          border: `1px solid ${theme.line}` }}>
              <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
                            textTransform: 'uppercase', color: theme.sub, marginBottom: 8 }}>
                Reading for
              </div>
              <div style={{ fontFamily: theme.serif, fontSize: 24, color: theme.fg, fontStyle: 'italic' }}>
                {name}
                {reading && reading.syllables && (
                  <span style={{ marginLeft: 14, fontStyle: 'normal', fontSize: 22, color: theme.fg }}>
                    · {reading.syllables.map(s => s.kana).join('')}
                  </span>
                )}
              </div>
            </div>
          )}

          {product.requiresTwoNames && (
            <Section theme={theme} label="Second name">
              <input type="text" value={secondName}
                onChange={e => setSecondName(e.target.value)}
                placeholder="The other name"
                style={inputStyle}/>
              <div style={{ marginTop: 8, fontSize: 12, color: theme.sub, fontStyle: 'italic' }}>
                Used in your couple reading PDF.
              </div>
            </Section>
          )}

          {product.requiresDedication && (
            <>
              <Section theme={theme} label="From">
                <input type="text" value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="Your name (the giver)"
                  style={inputStyle}/>
              </Section>
              <Section theme={theme} label="A personal note (optional)">
                <textarea value={dedication}
                  onChange={e => setDedication(e.target.value)}
                  rows={3}
                  placeholder="A few words from the heart..."
                  style={{ ...inputStyle, fontFamily: theme.serif, lineHeight: 1.5, resize: 'vertical', minHeight: 80 }}/>
              </Section>
            </>
          )}

          <a href={product.gumroad} target="_blank" rel="noopener noreferrer"
            onClick={handleBuyClick}
            style={{
              display: 'block', marginTop: 16, width: '100%', textAlign: 'center',
              background: theme.fg, color: theme.bg, padding: '20px',
              fontFamily: theme.sans, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box',
            }}>
            Get it for ${product.price} →
          </a>

          <p style={{ marginTop: 14, fontFamily: theme.serif, fontSize: 13,
                      color: theme.sub, textAlign: 'center', fontStyle: 'italic' }}>
            Each reading is hand-prepared and delivered to your inbox within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ theme, label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: theme.sub, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function SegControl({ theme, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', border: `1px solid ${theme.line}` }}>
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          flex: 1, padding: '10px 14px', cursor: 'pointer',
          background: value === o.v ? theme.fg : 'transparent',
          color: value === o.v ? theme.bg : theme.fg,
          border: 0, fontFamily: theme.sans, fontSize: 12, letterSpacing: '0.04em',
        }}>{o.l}</button>
      ))}
    </div>
  );
}

function Cart({ theme, items, name, onRemove, onShop, onCheckout }) {
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const shipping = items.length ? 8 : 0;
  const total = subtotal + shipping;

  return (
    <div style={{ padding: '60px 60px 80px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
                    textTransform: 'uppercase', color: theme.sub, marginBottom: 22 }}>
        YOUR BASKET
      </div>
      <h1 style={{ fontFamily: theme.serif, fontSize: 56, fontWeight: 400, color: theme.fg,
                   margin: '0 0 48px' }}>
        {name ? `${name}'s reading,` : 'Your reading,'} <em style={{ fontStyle: 'italic' }}>gathered.</em>
      </h1>

      {items.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', borderTop: `1px solid ${theme.line}`,
                      borderBottom: `1px solid ${theme.line}` }}>
          <window.Enso size={90} color={theme.sub} strokeWidth={3} opacity={0.4} style={{ margin: '0 auto 24px' }}/>
          <div style={{ fontFamily: theme.serif, fontSize: 22, color: theme.sub, marginBottom: 24 }}>
            Your basket is empty.
          </div>
          <button onClick={onShop} style={{
            background: theme.fg, color: theme.bg, border: 0, padding: '14px 28px',
            fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}>Browse the collection</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56 }}>
          <div>
            {items.map((i, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 20, padding: '24px 0',
                borderBottom: `1px solid ${theme.line}`,
                borderTop: idx === 0 ? `1px solid ${theme.line}` : 'none',
              }}>
                <div style={{ width: 100, height: 120, flexShrink: 0,
                              background: i._opts && i._opts.color ? i._opts.color.hex : theme.paper,
                              border: `1px solid ${theme.line}`, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: theme.serif, fontSize: 16,
                    color: i._opts && i._opts.color && i._opts.color.hex === '#1a1814' ? '#f3ede1' : '#1a1814',
                    writingMode: 'vertical-rl', textOrientation: 'upright',
                  }}>
                    {window.readName(name).syllables.slice(0, 3).map(s => s.kana).join('')}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: theme.serif, fontSize: 22, color: theme.fg, marginBottom: 6 }}>
                    {i.name}
                  </div>
                  <div style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 14, color: theme.sub, marginBottom: 10 }}>
                    {i.sub}
                  </div>
                  <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.16em',
                                textTransform: 'uppercase', color: theme.sub }}>
                    Customized for {name}
                    {i._opts && i._opts.size && <> · Size {i._opts.size}</>}
                    {i._opts && i._opts.color && <> · {i._opts.color.label}</>}
                    {i._opts && i._opts.layout && <> · {i._opts.layout === 'vertical' ? 'Tategaki' : 'Yokogaki'}</>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <div style={{ fontFamily: theme.serif, fontSize: 22, color: theme.fg }}>${i.price}</div>
                  <button onClick={() => onRemove(idx)} style={{
                    background: 'none', border: 0, cursor: 'pointer', color: theme.sub,
                    fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: 0,
                  }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ padding: 28, background: theme.cardBg, border: `1px solid ${theme.line}` }}>
              <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
                            textTransform: 'uppercase', color: theme.sub, marginBottom: 18 }}>SUMMARY</div>
              <Row theme={theme} label="Subtotal" value={`$${subtotal}`}/>
              <Row theme={theme} label="Shipping" value={`$${shipping}`}/>
              <div style={{ height: 1, background: theme.line, margin: '14px 0' }}/>
              <Row theme={theme} label="Total" value={`$${total}`} bold/>
              <button onClick={onCheckout} style={{
                marginTop: 22, width: '100%', background: theme.fg, color: theme.bg, border: 0,
                padding: '16px', fontFamily: theme.sans, fontSize: 12, letterSpacing: '0.2em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Checkout →</button>
              <div style={{ marginTop: 14, fontFamily: theme.serif, fontStyle: 'italic',
                            fontSize: 13, color: theme.sub, textAlign: 'center' }}>
                Each piece is brushed and shipped within 7 days.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ theme, label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
      <span style={{ fontFamily: theme.serif, fontSize: bold ? 18 : 15, color: theme.fg }}>{label}</span>
      <span style={{ fontFamily: theme.serif, fontSize: bold ? 22 : 16, color: theme.fg }}>{value}</span>
    </div>
  );
}

function ShareModal({ theme, name, reading, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 40px)',
      overflowY: 'auto',
      animation: 'kt-fadeup 0.3s both',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bg, padding: 'clamp(20px, 5vw, 36px)', maxWidth: 460, width: '100%',
        maxHeight: '100%', overflowY: 'auto',
        border: `1px solid ${theme.line}`, position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 14, background: 'none', border: 0, cursor: 'pointer',
          fontSize: 20, color: theme.sub, padding: 8, lineHeight: 1,
        }}>×</button>
        <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.28em',
                      textTransform: 'uppercase', color: theme.sub, marginBottom: 20 }}>
          SHARE YOUR READING
        </div>

        <div style={{
          aspectRatio: '4/5', background: theme.paper, border: `1px solid ${theme.line}`,
          padding: '36px 28px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
          backgroundImage: `radial-gradient(800px 600px at 50% 50%, rgba(180,150,100,0.08), transparent 70%)`,
        }}>
          {/* light particles backdrop */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          }}>
            <window.LightParticles blobs={window.KT_RITUAL_BLOBS} opacity={0.80}/>
          </div>
          {/* 言霊 brushed kanji backdrop */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, zIndex: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', opacity: 0.18,
          }}>
            <svg viewBox="0 0 440 220" style={{ width: '92%', display: 'block' }}>
              <text x="110" y="180" textAnchor="middle" style={{
                fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
              }}>言</text>
              <text x="330" y="180" textAnchor="middle" style={{
                fontFamily: theme.serif, fontWeight: 700, fontSize: 210, fill: theme.fg,
              }}>霊</text>
            </svg>
          </div>
          <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.32em',
                        textTransform: 'uppercase', color: theme.sub, position: 'relative', zIndex: 1 }}>言霊 · KOTODAMA</div>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18 }}>
              {reading && reading.syllables.map((s, i) => (
                <span key={i} style={{ fontFamily: theme.serif, fontSize: 56, color: theme.fg }}>{s.kana}</span>
              ))}
            </div>
            <div style={{ fontFamily: theme.serif, fontStyle: 'italic',
                          fontSize: 22, color: theme.fg, marginBottom: 6 }}>{name}</div>
            <div style={{ fontFamily: theme.serif, fontSize: 14, color: theme.sub, fontStyle: 'italic',
                          maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
              {reading && reading.archetype && `“${reading.archetype.desc}”`}
            </div>
          </div>
          <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.28em',
                        textTransform: 'uppercase', color: theme.sub, position: 'relative', zIndex: 1 }}>kotodama.studio</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          {['Instagram', 'TikTok', 'Download'].map(b => (
            <button key={b} style={{
              padding: '14px', background: 'none', cursor: 'pointer',
              border: `1px solid ${theme.line}`, color: theme.fg,
              fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.KotodamaApp = function KotodamaApp({ theme, initialScreen = 'landing', initialName = '', frameMode = 'desktop' }) {
  const [screen, setScreen] = useStateK2(initialScreen);
  const [name, setNameRaw] = useStateK2(() => {
    try { return localStorage.getItem('kt-name') || initialName; }
    catch (e) { return initialName; }
  });
  const setName = (n) => {
    setNameRaw(n);
    try {
      if (n) localStorage.setItem('kt-name', n);
      else localStorage.removeItem('kt-name');
    } catch (e) {}
  };
  const [cart, setCart] = useStateK2([]);
  const [activeProduct, setActiveProduct] = useStateK2(null);
  const [shareOpen, setShareOpen] = useStateK2(false);

  const reading = useMemoK2(() => name ? window.readName(name) : null, [name]);
  const hasReading = !!(reading && reading.syllables.length);

  const isAdmin = useMemoK2(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === '1';
  }, []);

  const nav = (s) => { setScreen(s); window.scrollTo(0, 0); };

  if (isAdmin) {
    return (
      <window.WashiBg tone={theme.tone} style={{ minHeight: '100%', position: 'relative' }}>
        <KNavBar theme={theme} screen="admin" hasReading={false} onNav={() => {}}/>
        <window.KT_PARTS.AdminPanel theme={theme}/>
        <div style={{
          marginTop: 80, padding: '36px 60px',
          borderTop: `1px solid ${theme.line}`, display: 'flex', justifyContent: 'space-between',
          fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: theme.sub,
        }}>
          <span>言霊 · Kotodama Studio · Admin</span>
          <span>?admin=1</span>
        </div>
      </window.WashiBg>
    );
  }

  return (
    <window.WashiBg tone={theme.tone} style={{ minHeight: '100%', position: 'relative' }}>
      <KNavBar theme={theme} screen={screen} hasReading={hasReading}
        onNav={(k) => {
          if (k === 'reading') nav(hasReading ? 'reading' : 'input');
          else if (k === 'products') nav('products');
          else if (k === 'landing') nav('landing');
        }}/>

      {screen === 'landing' && (
        <KLanding theme={theme} onStart={() => nav('input')}/>
      )}

      {screen === 'input' && (
        <KNameInput theme={theme} name={name} setName={setName} onSubmit={() => nav('reading')}/>
      )}

      {screen === 'reading' && hasReading && (
        <KReading theme={theme} name={name} onShop={() => nav('products')} onShare={() => setShareOpen(true)} onBack={() => nav('input')}/>
      )}
      {screen === 'reading' && !hasReading && (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontFamily: theme.serif, fontSize: 18, color: theme.sub }}>
            Enter your name to receive a reading.
          </p>
          <button onClick={() => nav('input')} style={{
            marginTop: 20, background: theme.fg, color: theme.bg, border: 0, padding: '12px 24px',
            fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Begin</button>
        </div>
      )}

      {screen === 'products' && (
        <Products theme={theme} name={name || 'your'} reading={reading}
          onPick={p => { setActiveProduct(p); nav('pdp'); }}/>
      )}

      {screen === 'pdp' && activeProduct && (
        <PDP theme={theme} product={activeProduct} name={name || ''} reading={reading}
          onBack={() => nav('products')}/>
      )}

      <div style={{
        marginTop: 80, padding: '36px 60px',
        borderTop: `1px solid ${theme.line}`, display: 'flex', justifyContent: 'space-between',
        fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: theme.sub,
      }}>
        <span>言霊 · Kotodama Studio</span>
        <span>Made in Kyoto · Shipped worldwide</span>
      </div>

      {shareOpen && <ShareModal theme={theme} name={name} reading={reading} onClose={() => setShareOpen(false)}/>}
    </window.WashiBg>
  );
};

Object.assign(window.KT_PARTS, { Products, PDP, Cart, ShareModal });
