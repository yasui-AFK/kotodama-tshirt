// data-bridge.js
// 既存サイトの app.js から抽出したロジックを window.* に公開し、
// プロトタイプの window.KOTODAMA / romanizeName をマージ／オーバーライドする。
//
// 読み込み順:
//   1. data/legacy-data.js       (window.kotodamaData, window.ROMAJI_MAP)
//   2. data/name-dictionary.js   (window.NAME_DICTIONARY, window.lookupNameDictionary)
//   3. data/kotodama-deep-meanings.js (window.DEEP_MEANINGS)
//   4. kotodama-data.js          (window.KOTODAMA, window.romanizeName, window.readName)
//   5. data-bridge.js            ← このファイル
//   6. kotodama-visuals.jsx ...

(function () {
  // === GA4 トラッキング ===
  window.trackEvent = function (eventName, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  };

  // === Unicode アクセント記号を ASCII に正規化 ===
  function stripAccents(s) {
    return s
      .replace(/ç/gi, 's')
      .replace(/ß/g, 'ss')
      .replace(/[æÆ]/g, 'ae')
      .replace(/[œŒ]/g, 'oe')
      .replace(/[øØ]/g, 'o')
      .replace(/[łŁ]/g, 'l')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  // === 英語綴り→日本語読みに近いローマ字へ正規化 ===
  function normalizeEnglishSpelling(input) {
    let s = stripAccents(input).toLowerCase().trim();

    s = s.replace(/que$/g, 'kku');
    s = s.replace(/eaux?$/g, 'o-');
    s = s.replace(/ault$/g, 'o-');

    s = s.replace(/ee/g, 'i-');
    s = s.replace(/oo/g, 'u-');
    s = s.replace(/ou/g, 'o-');

    s = s.replace(/va/g, 'ba');
    s = s.replace(/vi/g, 'bi');
    s = s.replace(/vu/g, 'bu');
    s = s.replace(/ve/g, 'be');
    s = s.replace(/vo/g, 'bo');

    s = s.replace(/ce/g, 'se');
    s = s.replace(/ci/g, 'shi');
    s = s.replace(/ca/g, 'ka');
    s = s.replace(/co/g, 'ko');
    s = s.replace(/cu/g, 'ku');

    s = s.replace(/th/g, 's');
    s = s.replace(/ph/g, 'fu');
    s = s.replace(/ck/g, 'kku');
    s = s.replace(/x/g, 'kkusu');
    s = s.replace(/qu/g, 'ku');

    s = s.replace(/sh(?![aeiou])/g, 'shu');
    s = s.replace(/ch(?![aeiou])/g, 'chi');

    s = s.replace(/ew$/g, 'yu-');

    s = s.replace(/c/g, 'k');

    for (let pass = 0; pass < 3; pass++) {
      s = s.replace(/([bdfgjklmprstvz])([bdfgjklmprstvz])/g,
        (m, a, b) => a === b ? m : a + 'u' + b);
    }

    s = s.replace(/([bcdfghjklmpstvz])$/g, (_, c) => {
      const vowel = { b: 'u', c: 'u', d: 'o', f: 'u', g: 'u', h: '', j: 'i',
                      k: 'u', l: 'ru', m: 'u', p: 'u', s: 'u', t: 'o', v: 'u', z: 'u' };
      return c + (vowel[c] !== undefined ? vowel[c] : 'u');
    });

    s = s.replace(/r$/g, '-');
    s = s.replace(/w(?![aieo])/g, '');

    return s;
  }

  // === ローマ字→ひらがな ===
  function romajiToHiragana(input) {
    const ROMAJI_MAP = window.ROMAJI_MAP || [];
    let str = normalizeEnglishSpelling(input);
    let result = '';
    let i = 0;

    while (i < str.length) {
      if (str[i] === '-') {
        result += 'ー';
        i++;
        continue;
      }

      if (i + 1 < str.length && str[i] === str[i + 1] &&
          str[i] !== 'a' && str[i] !== 'i' && str[i] !== 'u' &&
          str[i] !== 'e' && str[i] !== 'o' && str[i] !== 'n') {
        result += 'っ';
        i++;
        continue;
      }

      if (str[i] === 'n') {
        if (i + 1 >= str.length) {
          result += 'ん';
          i++;
          continue;
        }
        const next = str[i + 1];
        if (next !== 'a' && next !== 'i' && next !== 'u' &&
            next !== 'e' && next !== 'o' && next !== 'y') {
          if (next === 'n') {
            result += 'ん';
            i++;
            continue;
          }
          result += 'ん';
          i++;
          continue;
        }
      }

      let matched = false;
      for (const [romaji, hiragana] of ROMAJI_MAP) {
        if (str.substring(i, i + romaji.length) === romaji) {
          result += hiragana;
          i += romaji.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        i++;
      }
    }

    return result;
  }

  // === ひらがな→言霊データ列 ===
  function lookupKotodama(hiragana) {
    if (!window.kotodamaData) return [];
    const chars = window.kotodamaData.characters;
    const results = [];
    let i = 0;

    while (i < hiragana.length) {
      if (hiragana[i] === 'ー') {
        results.push({
          kana: 'ー', meaning: '伸びやかな余韻', romaji: '-',
          motif: 'long_echo', color: '#CCCCCC', isSpecial: true,
        });
        i++;
        continue;
      }

      if (i + 1 < hiragana.length) {
        const twoChar = hiragana.substring(i, i + 2);
        if (chars[twoChar]) {
          results.push({ kana: twoChar, ...chars[twoChar] });
          i += 2;
          continue;
        }
      }

      const oneChar = hiragana[i];
      if (chars[oneChar]) {
        results.push({ kana: oneChar, ...chars[oneChar] });
      } else {
        results.push({
          kana: oneChar, meaning: '神秘の音', romaji: oneChar,
          motif: 'mystery', color: '#888888', isSpecial: true,
        });
      }
      i++;
    }

    return results;
  }

  // === 名前変換（辞書 → ローマ字 → ひらがな） ===
  function convertName(input) {
    const trimmed = input.trim();
    let dictResult = (window.lookupNameDictionary || (() => null))(trimmed);

    if (!dictResult) {
      const stripped = stripAccents(trimmed);
      if (stripped.toLowerCase() !== trimmed.toLowerCase()) {
        dictResult = (window.lookupNameDictionary || (() => null))(stripped);
      }
    }

    if (dictResult) {
      return {
        romaji: dictResult,
        hiragana: romajiToHiragana(dictResult),
        source: 'dictionary',
      };
    }
    return {
      romaji: input.toLowerCase(),
      hiragana: romajiToHiragana(input),
      source: 'romaji',
    };
  }

  // === ストーリー生成（PDF でも使う） ===
  function generateStory(name, kotodamaResults) {
    const filtered = kotodamaResults.filter(k => !k.isSpecial);
    if (filtered.length === 0) return '';

    const englishParts = filtered.map((k, i) => {
      const merged = window.KOTODAMA && window.KOTODAMA[k.romaji];
      const keyword = (merged && merged.keyword) ? merged.keyword.toLowerCase() : '';
      const prefixes = ['the spirit of', 'embracing', 'guided by', 'resonating with', 'carrying', 'blessed with', 'illuminated by', 'flowing with'];
      const prefix = prefixes[i % prefixes.length];
      return `${prefix} ${keyword}`;
    });

    return `The name "${name}" carries a beautiful harmony of kotodama spirits: ${englishParts.join(', ')}. Together, these sounds weave a unique story that is yours alone.`;
  }

  // === window.* 公開 ===
  window.stripAccents = stripAccents;
  window.normalizeEnglishSpelling = normalizeEnglishSpelling;
  window.romajiToHiragana = romajiToHiragana;
  window.lookupKotodama = lookupKotodama;
  window.convertName = convertName;
  window.generateStory = generateStory;

  // === window.romanizeName をオーバーライド ===
  // プロトの kotodama-screens.jsx > NameInput / Reading は
  //   window.readName(name).syllables[i].kana / .romaji / .element ...
  // を期待するので、readName をラップして convertName 経由のひらがなで上書きする。
  const originalReadName = window.readName;
  window.readName = function (name) {
    const conv = convertName(name);
    const kotodamaResults = lookupKotodama(conv.hiragana);

    // syllables を merged window.KOTODAMA から組み立て直す
    const syllables = kotodamaResults
      .filter(k => !k.isSpecial)
      .map(k => {
        const merged = window.KOTODAMA[k.romaji];
        if (merged) return { key: k.romaji, ...merged };
        return {
          key: k.romaji,
          kana: k.kana,
          romaji: k.romaji,
          element: 'Sky',
          keyword: k.meaning,
          poem: k.meaning,
          colorPill: k.color,
        };
      });

    // archetype 算出（プロトのロジック踏襲）
    const elementCount = {};
    syllables.forEach(s => { elementCount[s.element] = (elementCount[s.element] || 0) + 1; });
    const dominant = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sky';

    const baseResult = originalReadName ? originalReadName(name) : { archetype: { name: 'The Open Sky', desc: '' } };
    const archetype = baseResult.archetype || { name: 'The Open Sky', desc: '' };

    return {
      name,
      hiragana: conv.hiragana,
      romaji: conv.romaji,
      syllables,
      dominant,
      archetype,
      raw: kotodamaResults,
    };
  };

  // 後方互換: プロトの romanizeName を高精度版に置換
  window.romanizeName = function (name) {
    const conv = convertName(name);
    const kotodamaResults = lookupKotodama(conv.hiragana);
    return kotodamaResults
      .filter(k => !k.isSpecial)
      .map(k => k.romaji);
  };

  // === window.KOTODAMA に colorPill / deepMeaning / shortJa をマージ ===
  if (window.KOTODAMA) {
    for (const key of Object.keys(window.KOTODAMA)) {
      const entry = window.KOTODAMA[key];
      const kana = entry.kana;
      if (!kana) continue;

      const legacyChar = window.kotodamaData && window.kotodamaData.characters[kana];
      if (legacyChar) {
        entry.colorPill = legacyChar.color;
        entry.shortJa = legacyChar.meaning;
        entry.motif = legacyChar.motif;
      }
      if (window.DEEP_MEANINGS && window.DEEP_MEANINGS[kana]) {
        entry.deepMeaning = window.DEEP_MEANINGS[kana];
      }
    }
  }
})();
