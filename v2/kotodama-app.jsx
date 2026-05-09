// Kotodama prototype — part 2: Products, PDP, Cart, Share modal, App shell.

const { useState: useStateK2, useEffect: useEffectK2, useMemo: useMemoK2, useRef: useRefK2 } = React;
const { Logo: KLogo, NavBar: KNavBar, Placeholder: KPH, Landing: KLanding,
        NameInput: KNameInput, Reading: KReading } = window.KT_PARTS;

function Products({ theme, name, reading, onPick }) {
  return (
    <div style={{ padding: '60px 60px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontFamily: theme.mono, fontSize: 11, letterSpacing: '0.32em',
                      textTransform: 'uppercase', color: theme.sub, marginBottom: 22 }}>
          THE COLLECTION
        </div>
        <h2 style={{ fontFamily: theme.serif, fontSize: 56, color: theme.fg,
                     fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1 }}>
          Things to keep <em style={{ fontStyle: 'italic' }}>{name}'s</em> reading.
        </h2>
        <p style={{ fontFamily: theme.serif, fontSize: 17, color: theme.sub,
                    maxWidth: 520, margin: '0 auto' }}>
          Each piece is made to order with your name brushed in archival ink.
          {reading && reading.archetype && <> Curated for <em>{reading.archetype.name}</em>.</>}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 36, maxWidth: 980, margin: '0 auto' }}>
        {window.KT_PRODUCTS.map(p => (
          <button key={p.id} onClick={() => onPick(p)} style={{
            background: theme.cardBg, border: `1px solid ${theme.line}`, padding: 28, textAlign: 'left',
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
                <h3 style={{ fontFamily: theme.serif, fontSize: 28, color: theme.fg,
                             fontWeight: 400, margin: 0, lineHeight: 1.15 }}>{p.name}</h3>
                <div style={{ fontFamily: theme.serif, fontSize: 22, color: theme.fg }}>${p.price}</div>
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

function PDP({ theme, product, name, reading, onAdd, onBack }) {
  const [size, setSize] = useStateK2(product.sizes ? product.sizes[Math.floor(product.sizes.length / 2)] : null);
  const [color, setColor] = useStateK2(product.colors ? product.colors[0] : null);
  const [position, setPosition] = useStateK2('chest');
  const [layout, setLayout] = useStateK2('vertical');
  const [added, setAdded] = useStateK2(false);

  const handleAdd = () => {
    onAdd({ ...product, _opts: { size, color, position, layout } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{ padding: '40px 60px 80px' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 0, cursor: 'pointer', color: theme.sub,
        fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        padding: 0, marginBottom: 32,
      }}>← back to collection</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, maxWidth: 1080, margin: '0 auto' }}>
        <div>
          <div style={{ position: 'relative', background: color ? color.hex : theme.paper,
                        border: `1px solid ${theme.line}`, aspectRatio: '4/5', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.mono, fontSize: 10, color: theme.sub, opacity: 0.4,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>[ {product.placeholder} ]</div>

            {reading && (
              <div style={{
                position: 'absolute',
                top: position === 'chest' ? '32%' : '50%',
                left: '50%', transform: 'translate(-50%, -50%)',
              }}>
                {layout === 'vertical' ? (
                  <window.VerticalKana
                    text={reading.syllables.map(s => s.kana).join('')}
                    fontSize={48}
                    color={color && color.hex === '#1a1814' ? '#f3ede1' : '#1a1814'}
                  />
                ) : (
                  <div style={{
                    fontFamily: theme.serif, fontSize: 56, letterSpacing: '0.08em',
                    color: color && color.hex === '#1a1814' ? '#f3ede1' : '#1a1814',
                  }}>
                    {reading.syllables.map(s => s.kana).join('')}
                  </div>
                )}
              </div>
            )}

            <div style={{
              position: 'absolute', bottom: 14, right: 14,
              fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: theme.sub,
              padding: '4px 8px', background: 'rgba(255,255,255,0.7)',
            }}>PREVIEW</div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                width: 80, height: 80, border: `1px solid ${theme.line}`, opacity: i === 1 ? 1 : 0.5,
                background: `repeating-linear-gradient(45deg, ${theme.line} 0 1px, transparent 1px 8px)`,
              }}/>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.24em',
                        textTransform: 'uppercase', color: theme.sub, marginBottom: 14 }}>
            {product.type}
          </div>
          <h1 style={{ fontFamily: theme.serif, fontSize: 44, color: theme.fg,
                       fontWeight: 400, margin: '0 0 12px', lineHeight: 1.1 }}>{product.name}</h1>
          <div style={{ fontFamily: theme.serif, fontStyle: 'italic', fontSize: 18,
                        color: theme.sub, marginBottom: 20 }}>{product.sub}</div>
          <div style={{ fontFamily: theme.serif, fontSize: 28, color: theme.fg, marginBottom: 28 }}>${product.price}</div>

          <p style={{ fontFamily: theme.serif, fontSize: 16, lineHeight: 1.6,
                      color: theme.fg, marginBottom: 36 }}>{product.desc}</p>

          <div style={{ marginBottom: 28, padding: '18px 22px', background: theme.cardBg,
                        border: `1px solid ${theme.line}` }}>
            <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.22em',
                          textTransform: 'uppercase', color: theme.sub, marginBottom: 8 }}>
              Customized for
            </div>
            <div style={{ fontFamily: theme.serif, fontSize: 24, color: theme.fg, fontStyle: 'italic' }}>
              {name}
              {reading && (
                <span style={{ marginLeft: 14, fontStyle: 'normal', fontSize: 22, color: theme.fg }}>
                  · {reading.syllables.map(s => s.kana).join('')}
                </span>
              )}
            </div>
          </div>

          {product.colors && (
            <Section theme={theme} label="Color">
              <div style={{ display: 'flex', gap: 10 }}>
                {product.colors.map(c => (
                  <button key={c.id} onClick={() => setColor(c)} title={c.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
                      border: color && color.id === c.id ? `2px solid ${theme.fg}` : `1px solid ${theme.line}`,
                      background: c.hex, padding: 0, outline: 'none',
                      boxShadow: color && color.id === c.id ? `0 0 0 2px ${theme.bg}, 0 0 0 3px ${theme.fg}` : 'none',
                    }}/>
                ))}
              </div>
              {color && <div style={{ fontFamily: theme.serif, fontSize: 14, color: theme.sub, marginTop: 8 }}>
                {color.label}
              </div>}
            </Section>
          )}

          {product.sizes && product.sizes.length > 1 && (
            <Section theme={theme} label="Size">
              <div style={{ display: 'flex', gap: 8 }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{
                    minWidth: 44, padding: '10px 14px', cursor: 'pointer',
                    background: size === s ? theme.fg : 'transparent',
                    color: size === s ? theme.bg : theme.fg,
                    border: `1px solid ${size === s ? theme.fg : theme.line}`,
                    fontFamily: theme.sans, fontSize: 13, letterSpacing: '0.06em',
                  }}>{s}</button>
                ))}
              </div>
            </Section>
          )}

          {product.id !== 'pdf' && product.id !== 'scroll' && (
            <>
              <Section theme={theme} label="Placement">
                <SegControl theme={theme} value={position} onChange={setPosition}
                            options={[{ v: 'chest', l: 'Chest' }, { v: 'back', l: 'Back' }]}/>
              </Section>
              <Section theme={theme} label="Layout">
                <SegControl theme={theme} value={layout} onChange={setLayout}
                            options={[{ v: 'vertical', l: 'Vertical (tategaki)' }, { v: 'horizontal', l: 'Horizontal' }]}/>
              </Section>
            </>
          )}

          <button onClick={handleAdd} style={{
            marginTop: 16, width: '100%', background: added ? theme.accent : theme.fg,
            color: theme.bg, border: 0, padding: '20px',
            fontFamily: theme.sans, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>
            {added ? '✓ Added to your reading' : 'Add to cart · $' + product.price}
          </button>
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
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
      animation: 'kt-fadeup 0.3s both',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bg, padding: 36, maxWidth: 460, width: '100%',
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
          backgroundImage: `radial-gradient(800px 600px at 50% 50%, rgba(180,150,100,0.08), transparent 70%)`,
        }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.32em',
                        textTransform: 'uppercase', color: theme.sub }}>言霊 · KOTODAMA</div>
          <div style={{ textAlign: 'center' }}>
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
                        textTransform: 'uppercase', color: theme.sub }}>kotodama.studio</div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          {['Instagram', 'TikTok', 'Download'].map(b => (
            <button key={b} style={{
              flex: 1, padding: '12px', background: 'none', cursor: 'pointer',
              border: `1px solid ${theme.line}`, color: theme.fg,
              fontFamily: theme.sans, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.KotodamaApp = function KotodamaApp({ theme, initialScreen = 'landing', initialName = '', frameMode = 'desktop' }) {
  const [screen, setScreen] = useStateK2(initialScreen);
  const [name, setName] = useStateK2(initialName);
  const [cart, setCart] = useStateK2([]);
  const [activeProduct, setActiveProduct] = useStateK2(null);
  const [shareOpen, setShareOpen] = useStateK2(false);

  const reading = useMemoK2(() => name ? window.readName(name) : null, [name]);
  const hasReading = !!(reading && reading.syllables.length);

  const nav = (s) => { setScreen(s); window.scrollTo(0, 0); };

  return (
    <window.WashiBg tone={theme.tone} style={{ minHeight: '100%', position: 'relative' }}>
      <KNavBar theme={theme} screen={screen} hasReading={hasReading} cartCount={cart.length}
        onNav={(k) => {
          if (k === 'reading') nav('reading');
          else if (k === 'products') nav('products');
          else if (k === 'cart') nav('cart');
          else if (k === 'about') nav('landing');
          else if (k === 'landing') nav('landing');
        }}/>

      {screen === 'landing' && (
        <KLanding theme={theme} onStart={() => nav('input')}/>
      )}

      {screen === 'input' && (
        <KNameInput theme={theme} name={name} setName={setName} onSubmit={() => nav('reading')}/>
      )}

      {screen === 'reading' && hasReading && (
        <KReading theme={theme} name={name} onShop={() => nav('products')} onShare={() => setShareOpen(true)}/>
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
        <PDP theme={theme} product={activeProduct} name={name || 'You'} reading={reading}
          onAdd={(item) => { setCart([...cart, item]); }}
          onBack={() => nav('products')}/>
      )}

      {screen === 'cart' && (
        <Cart theme={theme} items={cart} name={name}
          onRemove={(idx) => setCart(cart.filter((_, i) => i !== idx))}
          onShop={() => nav('products')}
          onCheckout={() => alert('Checkout flow — not implemented in this prototype')}/>
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
