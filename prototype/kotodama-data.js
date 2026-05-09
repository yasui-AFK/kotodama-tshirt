// Kotodama sound-meaning system
// Each Japanese kana sound carries a poetic meaning. This is a simplified,
// curated set inspired by traditional kotodama interpretations — the meanings
// here are original poetic distillations, not lifted from any one source.

window.KOTODAMA = {
  // vowels — primal sounds
  'a': { kana: 'あ', romaji: 'a', element: 'Sky',   keyword: 'Origin',     poem: 'the first breath, where all things begin' },
  'i': { kana: 'い', romaji: 'i', element: 'Wind',  keyword: 'Will',       poem: 'a quiet flame that points forward' },
  'u': { kana: 'う', romaji: 'u', element: 'Earth', keyword: 'Becoming',   poem: 'the seed turning toward the light' },
  'e': { kana: 'え', romaji: 'e', element: 'Light', keyword: 'Wisdom',     poem: 'the soft glow that sees clearly' },
  'o': { kana: 'お', romaji: 'o', element: 'Ocean', keyword: 'Depth',      poem: 'still water holding ancient memory' },

  // k-row — strength
  'ka': { kana: 'か', romaji: 'ka', element: 'Fire',  keyword: 'Spark',     poem: 'a small flame with great courage' },
  'ki': { kana: 'き', romaji: 'ki', element: 'Tree',  keyword: 'Vitality',  poem: 'the upright pulse of living wood' },
  'ku': { kana: 'く', romaji: 'ku', element: 'Sky',   keyword: 'Stillness', poem: 'the empty space where everything fits' },
  'ke': { kana: 'け', romaji: 'ke', element: 'Mist',  keyword: 'Subtlety',  poem: 'what is felt before it is seen' },
  'ko': { kana: 'こ', romaji: 'ko', element: 'Child', keyword: 'Innocence', poem: 'a heart that has not forgotten wonder' },

  // s-row — softness
  'sa': { kana: 'さ', romaji: 'sa', element: 'Bloom', keyword: 'Grace',     poem: 'petals opening in their own time' },
  'shi':{ kana: 'し', romaji: 'shi',element: 'River', keyword: 'Flow',      poem: 'water that knows where it is going' },
  'su': { kana: 'す', romaji: 'su', element: 'Air',   keyword: 'Clarity',   poem: 'a clear tone that cuts through noise' },
  'se': { kana: 'せ', romaji: 'se', element: 'Path',  keyword: 'Direction', poem: 'the road revealing itself underfoot' },
  'so': { kana: 'そ', romaji: 'so', element: 'Sky',   keyword: 'Vastness',  poem: 'a horizon wide enough for any dream' },

  // t-row — truth
  'ta': { kana: 'た', romaji: 'ta', element: 'Field', keyword: 'Abundance', poem: 'a harvest gathered with patient hands' },
  'chi':{ kana: 'ち', romaji: 'chi',element: 'Earth', keyword: 'Roots',     poem: 'the deep ground that holds you steady' },
  'tsu':{ kana: 'つ', romaji: 'tsu',element: 'Moon',  keyword: 'Continuity',poem: 'each phase becoming the next' },
  'te': { kana: 'て', romaji: 'te', element: 'Hand',  keyword: 'Offering',  poem: 'what is given is what is kept' },
  'to': { kana: 'と', romaji: 'to', element: 'Door',  keyword: 'Threshold', poem: 'the moment before everything changes' },

  // n-row — gentleness
  'na': { kana: 'な', romaji: 'na', element: 'Name',  keyword: 'Identity',  poem: 'the song you were given to sing' },
  'ni': { kana: 'に', romaji: 'ni', element: 'Sun',   keyword: 'Warmth',    poem: 'kindness that thaws the hardest frost' },
  'nu': { kana: 'ぬ', romaji: 'nu', element: 'Cloth', keyword: 'Weaving',   poem: 'threads of past into present form' },
  'ne': { kana: 'ね', romaji: 'ne', element: 'Root',  keyword: 'Foundation',poem: 'what holds you when storms arrive' },
  'no': { kana: 'の', romaji: 'no', element: 'Field', keyword: 'Belonging', poem: 'the meadow that remembers your steps' },

  // h-row — breath
  'ha': { kana: 'は', romaji: 'ha', element: 'Leaf',  keyword: 'Renewal',   poem: 'each season teaches the next how to begin' },
  'hi': { kana: 'ひ', romaji: 'hi', element: 'Sun',   keyword: 'Radiance',  poem: 'a light that does not ask permission' },
  'fu': { kana: 'ふ', romaji: 'fu', element: 'Wind',  keyword: 'Freedom',   poem: 'breath moving where it pleases' },
  'he': { kana: 'へ', romaji: 'he', element: 'Mountain',keyword:'Ascent',   poem: 'the slow rise toward your true height' },
  'ho': { kana: 'ほ', romaji: 'ho', element: 'Ember', keyword: 'Devotion',  poem: 'a flame kept alive through long nights' },

  // m-row — heart
  'ma': { kana: 'ま', romaji: 'ma', element: 'Truth', keyword: 'Sincerity', poem: 'what you say when no one is listening' },
  'mi': { kana: 'み', romaji: 'mi', element: 'Water', keyword: 'Beauty',    poem: 'a reflection that knows its source' },
  'mu': { kana: 'む', romaji: 'mu', element: 'Void',  keyword: 'Possibility',poem:'the silence before a single perfect note' },
  'me': { kana: 'め', romaji: 'me', element: 'Eye',   keyword: 'Vision',    poem: 'seeing the unseen with a soft gaze' },
  'mo': { kana: 'も', romaji: 'mo', element: 'Mist',  keyword: 'Mystery',   poem: 'what reveals itself only to the patient' },

  // y-row — softening
  'ya': { kana: 'や', romaji: 'ya', element: 'Arrow', keyword: 'Intention', poem: 'a will released and trusted to fly' },
  'yu': { kana: 'ゆ', romaji: 'yu', element: 'Steam', keyword: 'Gentleness',poem: 'softness that shapes the hardest stone' },
  'yo': { kana: 'よ', romaji: 'yo', element: 'World', keyword: 'Resonance', poem: 'a voice the world quietly answers' },

  // r-row — rhythm
  'ra': { kana: 'ら', romaji: 'ra', element: 'Bell',  keyword: 'Resonance', poem: 'a clear note that lingers in the chest' },
  'ri': { kana: 'り', romaji: 'ri', element: 'Reason',keyword: 'Wisdom',    poem: 'truth arranged into a quiet pattern' },
  'ru': { kana: 'る', romaji: 'ru', element: 'River', keyword: 'Movement',  poem: 'always going, never lost' },
  're': { kana: 'れ', romaji: 're', element: 'Grace', keyword: 'Refinement',poem: 'beauty that does not announce itself' },
  'ro': { kana: 'ろ', romaji: 'ro', element: 'Hearth',keyword: 'Warmth',    poem: 'a circle of light shared with others' },

  // w-row — softness
  'wa': { kana: 'わ', romaji: 'wa', element: 'Circle',keyword: 'Harmony',   poem: 'the shape that has no broken place' },
  'wo': { kana: 'を', romaji: 'wo', element: 'Bridge',keyword: 'Connection',poem: 'what carries you to the other shore' },
  'n':  { kana: 'ん', romaji: 'n',  element: 'Echo',  keyword: 'Completion',poem: 'the quiet that makes the song whole' },
};

// Romanize a latin name into approximate kana sounds.
window.romanizeName = function(name) {
  const n = (name || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!n) return [];

  const out = [];
  let i = 0;
  while (i < n.length) {
    const c2 = n.slice(i, i+2);
    const c1 = n[i];

    if (c2 === 'sh') { out.push('shi'); i += 2; continue; }
    if (c2 === 'ch') { out.push('chi'); i += 2; continue; }
    if (c2 === 'ts') { out.push('tsu'); i += 2; continue; }
    if (c2 === 'th') { out.push('su');  i += 2; continue; }
    if (c2 === 'ph') { out.push('fu');  i += 2; continue; }
    if (c2 === 'ck') { out.push('ku');  i += 2; continue; }

    if (c1 === n[i+1] && /[bcdfghjklmnpqrstvwxz]/.test(c1)) { i += 1; continue; }

    const vowels = 'aiueo';
    const conMap = { b:'b', c:'k', d:'d', f:'f', g:'g', h:'h', j:'j', k:'k', l:'r', m:'m', n:'n', p:'p', q:'k', r:'r', s:'s', t:'t', v:'b', w:'w', x:'k', y:'y', z:'s' };
    if (conMap[c1] && vowels.includes(n[i+1])) {
      const con = conMap[c1];
      const vow = n[i+1];
      const candidates = [con + vow, vow];
      let key = candidates[0];
      if (key === 'si') key = 'shi';
      if (key === 'ti') key = 'chi';
      if (key === 'tu') key = 'tsu';
      if (key === 'hu') key = 'fu';
      if (key === 'di') key = 'ji' in window.KOTODAMA ? 'ji' : 'chi';
      if (window.KOTODAMA[key]) { out.push(key); i += 2; continue; }
      out.push(vow); i += 2; continue;
    }

    if (vowels.includes(c1)) { out.push(c1); i += 1; continue; }

    if (conMap[c1]) {
      const con = conMap[c1];
      let key = con + 'u';
      if (con === 's') key = 'su';
      if (con === 't') key = 'tsu';
      if (con === 'h') key = 'fu';
      if (con === 'n') { out.push('n'); i += 1; continue; }
      if (window.KOTODAMA[key]) { out.push(key); i += 1; continue; }
    }
    i += 1;
  }
  return out;
};

window.readName = function(name) {
  const sounds = window.romanizeName(name);
  const syllables = sounds.map(s => ({ key: s, ...window.KOTODAMA[s] })).filter(x => x.kana);
  const elementCount = {};
  syllables.forEach(s => { elementCount[s.element] = (elementCount[s.element] || 0) + 1; });
  const dominant = Object.entries(elementCount).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Sky';
  const archetypes = {
    Sky: { name: 'The Open Sky',  desc: 'You carry the gift of vastness — a clear mind, room for all things.' },
    Wind: { name: 'The Quiet Wind', desc: 'You move through the world unseen but deeply felt.' },
    Earth: { name: 'The Patient Earth', desc: 'Steady, generous, holding what needs to grow.' },
    Light: { name: 'The Soft Light', desc: 'Wisdom that warms instead of dazzling.' },
    Ocean: { name: 'The Deep Ocean', desc: 'You carry old memory and a heart that holds much.' },
    Fire: { name: 'The Quiet Flame', desc: 'A courage that does not need to shout.' },
    Tree: { name: 'The Standing Tree', desc: 'Rooted, reaching, generous with shade.' },
    Mist: { name: 'The Morning Mist', desc: 'You reveal yourself to those who wait.' },
    Child: { name: 'The Open Heart', desc: 'You have not forgotten how to wonder.' },
    Bloom: { name: 'The Slow Bloom', desc: 'You unfold in your own season, with grace.' },
    River: { name: 'The Flowing River', desc: 'You know your direction even when others do not.' },
    Air: { name: 'The Clear Air', desc: 'You see things as they are, and speak them simply.' },
    Path: { name: 'The Quiet Path', desc: 'A traveler whose road becomes clear with each step.' },
    Field: { name: 'The Open Field', desc: 'You make space for others to grow into themselves.' },
    Moon: { name: 'The Patient Moon', desc: 'You honor every phase, knowing none are final.' },
    Hand: { name: 'The Open Hand', desc: 'A giver whose gifts return as light.' },
    Door: { name: 'The Threshold', desc: 'You stand at the edge where one world becomes another.' },
    Name: { name: 'The True Name', desc: 'You carry your identity like a quiet song.' },
    Sun: { name: 'The Gentle Sun', desc: 'A warmth that asks nothing in return.' },
    Cloth: { name: 'The Weaver', desc: 'You braid past and present into something new.' },
    Root: { name: 'The Deep Root', desc: 'You hold steady when the wind comes hard.' },
    Leaf: { name: 'The Turning Leaf', desc: 'You honor renewal; you do not fear endings.' },
    Mountain: { name: 'The Slow Mountain', desc: 'You rise without hurry, and reach great heights.' },
    Ember: { name: 'The Kept Ember', desc: 'You guard small flames through long nights.' },
    Truth: { name: 'The Quiet Truth', desc: 'You speak what is real, even when softly.' },
    Water: { name: 'The Still Water', desc: 'You reflect what is offered, and remember its source.' },
    Void: { name: 'The Open Void', desc: 'You are full of possibility, like a held breath.' },
    Eye: { name: 'The Soft Gaze', desc: 'You see the unseen and trust what you find.' },
    Arrow: { name: 'The True Arrow', desc: 'When you choose, you commit fully.' },
    Steam: { name: 'The Rising Steam', desc: 'You shape hard things with patient softness.' },
    World: { name: 'The Resonant Voice', desc: 'The world quietly answers what you say.' },
    Bell: { name: 'The Single Bell', desc: 'You speak once, clearly, and it lingers.' },
    Reason: { name: 'The Quiet Reason', desc: 'You arrange truth into patterns others can follow.' },
    Grace: { name: 'The Hidden Grace', desc: 'Beauty that does not announce itself.' },
    Hearth: { name: 'The Shared Hearth', desc: 'You are home for those who need one.' },
    Circle: { name: 'The Whole Circle', desc: 'You make peace where there were broken places.' },
    Bridge: { name: 'The Gentle Bridge', desc: 'You carry others to where they need to go.' },
    Echo: { name: 'The Quiet Echo', desc: 'You complete the songs of those around you.' },
  };
  const archetype = archetypes[dominant] || archetypes.Sky;
  return { name, syllables, dominant, archetype };
};
