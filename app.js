// ========================================
// コトダマジェネレーター — メインロジック
// ========================================

// --- GA4 イベントトラッキング ---
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// --- 言霊データ（埋め込み） ---
const kotodamaData = {
  characters: {
    "あ": { "meaning": "生命の始まり、開放", "romaji": "a", "motif": "sunrise", "color": "#D94A38", "image": null },
    "い": { "meaning": "鋭い感性、知恵", "romaji": "i", "motif": "young_leaf", "color": "#6BAF5E", "image": null },
    "う": { "meaning": "包容力、宇宙的な広がり", "romaji": "u", "motif": "water_ripple", "color": "#3DA9C4", "image": null },
    "え": { "meaning": "調和と潤い", "romaji": "e", "motif": "ear_of_rice", "color": "#F2B134", "image": null },
    "お": { "meaning": "大地のような安定", "romaji": "o", "motif": "earth", "color": "#8C5C3B", "image": null },
    "か": { "meaning": "切り拓く力、始動", "romaji": "ka", "motif": "radiant_beam", "color": "#FFC145", "image": null },
    "き": { "meaning": "清らかな意志、直感", "romaji": "ki", "motif": "starlight", "color": "#FFD966", "image": null },
    "く": { "meaning": "創造と柔軟性", "romaji": "ku", "motif": "open_sky", "color": "#7AC5FF", "image": null },
    "け": { "meaning": "優雅さと繊細さ", "romaji": "ke", "motif": "gentle_wind", "color": "#B0E0E6", "image": null },
    "こ": { "meaning": "固い意志、守護", "romaji": "ko", "motif": "galaxy_swirl", "color": "#9155FD", "image": null },
    "さ": { "meaning": "清らかさと真心", "romaji": "sa", "motif": "fresh_breeze", "color": "#00B4CE", "image": null },
    "し": { "meaning": "深い静けさ、洞察力", "romaji": "shi", "motif": "still_water", "color": "#2F4858", "image": null },
    "す": { "meaning": "流れるような変化", "romaji": "su", "motif": "crystal", "color": "#A7E4F2", "image": null },
    "せ": { "meaning": "繋がりと支え合い", "romaji": "se", "motif": "river_current", "color": "#0E86D4", "image": null },
    "そ": { "meaning": "創造と始まり", "romaji": "so", "motif": "musical_wave", "color": "#84B1ED", "image": null },
    "た": { "meaning": "根を張る力、現実性", "romaji": "ta", "motif": "rising_path", "color": "#FF7753", "image": null },
    "ち": { "meaning": "地に足のついた成長", "romaji": "chi", "motif": "tree_root", "color": "#A37046", "image": null },
    "つ": { "meaning": "小さな積み重ねと飛躍", "romaji": "tsu", "motif": "infinite_knot", "color": "#4C9A2A", "image": null },
    "て": { "meaning": "手を伸ばす探求心", "romaji": "te", "motif": "artisan_hand", "color": "#E4A672", "image": null },
    "と": { "meaning": "門出、新しい世界", "romaji": "to", "motif": "arrow_tip", "color": "#FF914D", "image": null },
    "な": { "meaning": "内なる静けさ、芯の強さ", "romaji": "na", "motif": "lotus", "color": "#FFB7C5", "image": null },
    "に": { "meaning": "二つのものを結ぶ調和", "romaji": "ni", "motif": "peony", "color": "#D46A6A", "image": null },
    "ぬ": { "meaning": "秘めたる力、滋養", "romaji": "nu", "motif": "woven_pattern", "color": "#D0A568", "image": null },
    "ね": { "meaning": "根を張る強さと安定", "romaji": "ne", "motif": "tuning_fork", "color": "#8EC1D4", "image": null },
    "の": { "meaning": "流れに乗る柔軟性", "romaji": "no", "motif": "grassland", "color": "#A0C55F", "image": null },
    "は": { "meaning": "波のような変化と感性", "romaji": "ha", "motif": "soaring_wing", "color": "#FFA07A", "image": null },
    "ひ": { "meaning": "光を灯す希望", "romaji": "hi", "motif": "flame", "color": "#FF4500", "image": null },
    "ふ": { "meaning": "風に乗る自由な心", "romaji": "fu", "motif": "whirlwind", "color": "#B4D8E7", "image": null },
    "へ": { "meaning": "変革への橋渡し", "romaji": "he", "motif": "arrow_up", "color": "#F5C04A", "image": null },
    "ほ": { "meaning": "豊かさと実り", "romaji": "ho", "motif": "cornucopia", "color": "#E6A23C", "image": null },
    "ま": { "meaning": "誠実と調和の精神", "romaji": "ma", "motif": "enso", "color": "#1E4174", "image": null },
    "み": { "meaning": "実りと豊穣", "romaji": "mi", "motif": "ripe_fruit", "color": "#F29E4C", "image": null },
    "む": { "meaning": "無限の可能性", "romaji": "mu", "motif": "empty_circle", "color": "#444444", "image": null },
    "め": { "meaning": "芽吹きと新しい始まり", "romaji": "me", "motif": "sprouting_seed", "color": "#55A630", "image": null },
    "も": { "meaning": "萌え出づる生命力", "romaji": "mo", "motif": "forest", "color": "#228B22", "image": null },
    "や": { "meaning": "矢のような意志と到達", "romaji": "ya", "motif": "arrow_fletch", "color": "#FF6F5C", "image": null },
    "ゆ": { "meaning": "優雅さと調和", "romaji": "yu", "motif": "hot_spring", "color": "#FFB480", "image": null },
    "よ": { "meaning": "喜びと豊かな循環", "romaji": "yo", "motif": "ring_knot", "color": "#C2B280", "image": null },
    "ら": { "meaning": "羅針盤のような導き", "romaji": "ra", "motif": "silk_thread", "color": "#F2D0A4", "image": null },
    "り": { "meaning": "軽やかさと自由", "romaji": "ri", "motif": "flow_line", "color": "#8BA0B4", "image": null },
    "る": { "meaning": "流動と進化", "romaji": "ru", "motif": "cycle_arrow", "color": "#708090", "image": null },
    "れ": { "meaning": "連なりと伝承", "romaji": "re", "motif": "icy_mist", "color": "#9CD1EF", "image": null },
    "ろ": { "meaning": "道筋と照らし出す光", "romaji": "ro", "motif": "stone_path", "color": "#A4A4A4", "image": null },
    "わ": { "meaning": "和の心、包容と調和", "romaji": "wa", "motif": "circle_wave", "color": "#FFD166", "image": null },
    "を": { "meaning": "導きと完成へ向かう力", "romaji": "wo", "motif": "knot_begin", "color": "#F0A5A5", "image": null },
    "ゐ": { "meaning": "つながりと始まり", "romaji": "wi", "motif": "linked_path", "color": "#A8D8B9", "image": null },
    "ゑ": { "meaning": "調和と繁栄への願い", "romaji": "we", "motif": "harmony_seed", "color": "#F5CBA7", "image": null },
    "っ": { "meaning": "凝縮されたエネルギー", "romaji": "xtsu", "motif": "energy_spark", "color": "#FF66CC", "image": null },
    "ん": { "meaning": "完成と静けさ", "romaji": "n", "motif": "closing_knot", "color": "#7B6D8D", "image": null },
    "きゃ": { "meaning": "新たな始動の柔らかさ", "romaji": "kya", "motif": "new_beginning", "color": "#AED9E0", "image": null },
    "きゅ": { "meaning": "内に秘めた飛躍力", "romaji": "kyu", "motif": "hidden_jump", "color": "#A0D8EF", "image": null },
    "きょ": { "meaning": "未来へ向かう躍動", "romaji": "kyo", "motif": "toward_future", "color": "#7BC8F6", "image": null },
    "しゃ": { "meaning": "清らかな意志と流れ", "romaji": "sha", "motif": "pure_stream", "color": "#81C7D4", "image": null },
    "しゅ": { "meaning": "柔軟に変化する心", "romaji": "shu", "motif": "flexible_heart", "color": "#6AD1E3", "image": null },
    "しょ": { "meaning": "流麗なる飛翔", "romaji": "sho", "motif": "graceful_flight", "color": "#5FB3B3", "image": null },
    "ちゃ": { "meaning": "芽吹きのエネルギー", "romaji": "cha", "motif": "budding_energy", "color": "#8EE3A1", "image": null },
    "ちゅ": { "meaning": "中心に向かう力", "romaji": "chu", "motif": "core_focus", "color": "#82C2A0", "image": null },
    "ちょ": { "meaning": "未来を見据える目", "romaji": "cho", "motif": "future_vision", "color": "#5CBBA9", "image": null },
    "にゃ": { "meaning": "やさしく結びつく力", "romaji": "nya", "motif": "gentle_link", "color": "#9AD0AE", "image": null },
    "にゅ": { "meaning": "新たな結束", "romaji": "nyu", "motif": "new_bond", "color": "#92D7C9", "image": null },
    "にょ": { "meaning": "柔らかく進む道", "romaji": "nyo", "motif": "smooth_path", "color": "#8AC6D1", "image": null },
    "ひゃ": { "meaning": "光を放つ始まり", "romaji": "hya", "motif": "radiant_start", "color": "#D2E3C8", "image": null },
    "ひゅ": { "meaning": "軽やかな希望", "romaji": "hyu", "motif": "light_hope", "color": "#B8E2F2", "image": null },
    "ひょ": { "meaning": "跳躍する光", "romaji": "hyo", "motif": "jumping_light", "color": "#A3DCE5", "image": null },
    "みゃ": { "meaning": "豊かな調和", "romaji": "mya", "motif": "rich_harmony", "color": "#BEE7E8", "image": null },
    "みゅ": { "meaning": "広がる夢", "romaji": "myu", "motif": "spreading_dream", "color": "#A6D9E9", "image": null },
    "みょ": { "meaning": "温かい前進", "romaji": "myo", "motif": "warm_forward", "color": "#8EC1E4", "image": null },
    "りゃ": { "meaning": "揺るぎない指針", "romaji": "rya", "motif": "steady_compass", "color": "#92B7E8", "image": null },
    "りゅ": { "meaning": "流れるような成長", "romaji": "ryu", "motif": "flowing_growth", "color": "#79A8D9", "image": null },
    "りょ": { "meaning": "繋がりを育む力", "romaji": "ryo", "motif": "growing_connection", "color": "#74B3D1", "image": null },
    "が": { "meaning": "強い始動の力", "romaji": "ga", "motif": "forceful_start", "color": "#D16A6A", "image": null },
    "ぎ": { "meaning": "鋭い直感力", "romaji": "gi", "motif": "sharp_insight", "color": "#BF7171", "image": null },
    "ぐ": { "meaning": "包み込む剛健さ", "romaji": "gu", "motif": "robust_embrace", "color": "#CC7575", "image": null },
    "げ": { "meaning": "地に足のついた調和", "romaji": "ge", "motif": "grounded_harmony", "color": "#B16969", "image": null },
    "ご": { "meaning": "揺るぎない守護", "romaji": "go", "motif": "unwavering_guard", "color": "#A45C5C", "image": null },
    "ざ": { "meaning": "純粋な決意", "romaji": "za", "motif": "pure_determination", "color": "#D97777", "image": null },
    "じ": { "meaning": "深い洞察", "romaji": "ji", "motif": "deep_insight", "color": "#BB6666", "image": null },
    "ず": { "meaning": "絶え間ない流れ", "romaji": "zu", "motif": "endless_flow", "color": "#A65D5D", "image": null },
    "ぜ": { "meaning": "豊穣へのつながり", "romaji": "ze", "motif": "abundant_link", "color": "#965555", "image": null },
    "ぞ": { "meaning": "力強い創造力", "romaji": "zo", "motif": "powerful_creation", "color": "#8E4F4F", "image": null },
    "だ": { "meaning": "揺るぎない根", "romaji": "da", "motif": "unshakable_root", "color": "#C26868", "image": null },
    "ぢ": { "meaning": "秘めたる鋭さ", "romaji": "dzi", "motif": "hidden_sharpness", "color": "#AC5E5E", "image": null },
    "づ": { "meaning": "湧き上がる包容力", "romaji": "dzu", "motif": "rising_embrace", "color": "#985050", "image": null },
    "で": { "meaning": "調和の根基", "romaji": "de", "motif": "base_of_harmony", "color": "#874646", "image": null },
    "ど": { "meaning": "強固な意志", "romaji": "do", "motif": "strong_will", "color": "#7C4040", "image": null },
    "ば": { "meaning": "溢れる豊かさ", "romaji": "ba", "motif": "overflowing_abundance", "color": "#D26F6F", "image": null },
    "び": { "meaning": "きらめく希望", "romaji": "bi", "motif": "sparkling_hope", "color": "#B45959", "image": null },
    "ぶ": { "meaning": "力強い流動性", "romaji": "bu", "motif": "powerful_fluidity", "color": "#A75252", "image": null },
    "べ": { "meaning": "変革の芽生え", "romaji": "be", "motif": "sprouting_change", "color": "#8F4949", "image": null },
    "ぼ": { "meaning": "大地の豊穣", "romaji": "bo", "motif": "earth_abundance", "color": "#7B4040", "image": null },
    "ぱ": { "meaning": "新たな風を呼ぶ力", "romaji": "pa", "motif": "new_breeze", "color": "#E9A9A9", "image": null },
    "ぴ": { "meaning": "軽やかな発想", "romaji": "pi", "motif": "light_idea", "color": "#E7B8B8", "image": null },
    "ぷ": { "meaning": "自由な飛躍", "romaji": "pu", "motif": "free_jump", "color": "#DBA4A4", "image": null },
    "ぺ": { "meaning": "柔らかな革命", "romaji": "pe", "motif": "soft_revolution", "color": "#CC9191", "image": null },
    "ぽ": { "meaning": "ほがらかな豊かさ", "romaji": "po", "motif": "cheerful_abundance", "color": "#C08888" },
    "じゃ": { "meaning": "流れるような洞察", "romaji": "ja", "motif": "flowing_insight", "color": "#8094B8", "image": null },
    "じゅ": { "meaning": "柔軟な知性", "romaji": "ju", "motif": "adaptive_wisdom", "color": "#7A89B0", "image": null },
    "じょ": { "meaning": "静かなる導き", "romaji": "jo", "motif": "quiet_guidance", "color": "#6E7DA6", "image": null },
    "ぎゃ": { "meaning": "力強い直感", "romaji": "gya", "motif": "strong_intuition", "color": "#B47A7A", "image": null },
    "ぎゅ": { "meaning": "凝縮された洞察", "romaji": "gyu", "motif": "concentrated_insight", "color": "#AC7373", "image": null },
    "ぎょ": { "meaning": "揺るぎない眼差し", "romaji": "gyo", "motif": "unwavering_gaze", "color": "#A06868", "image": null },
    "びゃ": { "meaning": "輝く始まり", "romaji": "bya", "motif": "radiant_beginning", "color": "#C58E8E", "image": null },
    "びゅ": { "meaning": "軽やかな煌めき", "romaji": "byu", "motif": "lively_sparkle", "color": "#BA8484", "image": null },
    "びょ": { "meaning": "美しい飛翔", "romaji": "byo", "motif": "beautiful_flight", "color": "#AF7A7A", "image": null },
    "ぴゃ": { "meaning": "弾ける発想", "romaji": "pya", "motif": "bursting_idea", "color": "#DCA4A4", "image": null },
    "ぴゅ": { "meaning": "風のような閃き", "romaji": "pyu", "motif": "wind_spark", "color": "#D6A0A0", "image": null },
    "ぴょ": { "meaning": "跳ねる喜び", "romaji": "pyo", "motif": "leaping_joy", "color": "#CC9494", "image": null }
  }
};

// --- 初期化 ---
function init() {
  document.getElementById('nameInput').addEventListener('input', debounce(onNameInput, 300));
  document.getElementById('romajiInput').addEventListener('input', debounce(onRomajiInput, 300));
  document.getElementById('generateBtn').addEventListener('click', generate);
  document.getElementById('nameInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { document.getElementById('romajiInput').focus(); }
  });
  document.getElementById('romajiInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') generate();
  });
}

// --- ローマ字→ひらがな変換 ---
const ROMAJI_MAP = [
  // 拗音（3文字）を先にマッチ
  ['rya','りゃ'],['ryu','りゅ'],['ryo','りょ'],
  ['kya','きゃ'],['kyu','きゅ'],['kyo','きょ'],
  ['sha','しゃ'],['shu','しゅ'],['sho','しょ'],
  ['cha','ちゃ'],['chu','ちゅ'],['cho','ちょ'],
  ['nya','にゃ'],['nyu','にゅ'],['nyo','にょ'],
  ['hya','ひゃ'],['hyu','ひゅ'],['hyo','ひょ'],
  ['mya','みゃ'],['myu','みゅ'],['myo','みょ'],
  ['gya','ぎゃ'],['gyu','ぎゅ'],['gyo','ぎょ'],
  ['bya','びゃ'],['byu','びゅ'],['byo','びょ'],
  ['pya','ぴゃ'],['pyu','ぴゅ'],['pyo','ぴょ'],
  ['jya','じゃ'],['jyu','じゅ'],['jyo','じょ'],
  // 2文字の特殊音
  ['shi','し'],['chi','ち'],['tsu','つ'],['fu','ふ'],
  ['ja','じゃ'],['ju','じゅ'],['jo','じょ'],
  // 濁音・半濁音（2文字）
  ['ga','が'],['gi','ぎ'],['gu','ぐ'],['ge','げ'],['go','ご'],
  ['za','ざ'],['ji','じ'],['zu','ず'],['ze','ぜ'],['zo','ぞ'],
  ['da','だ'],['di','ぢ'],['du','づ'],['de','で'],['do','ど'],
  ['ba','ば'],['bi','び'],['bu','ぶ'],['be','べ'],['bo','ぼ'],
  ['pa','ぱ'],['pi','ぴ'],['pu','ぷ'],['pe','ぺ'],['po','ぽ'],
  // 基本音（2文字）
  ['ka','か'],['ki','き'],['ku','く'],['ke','け'],['ko','こ'],
  ['sa','さ'],['si','し'],['su','す'],['se','せ'],['so','そ'],
  ['ta','た'],['ti','ち'],['tu','つ'],['te','て'],['to','と'],
  ['na','な'],['ni','に'],['nu','ぬ'],['ne','ね'],['no','の'],
  ['ha','は'],['hi','ひ'],['hu','ふ'],['he','へ'],['ho','ほ'],
  ['ma','ま'],['mi','み'],['mu','む'],['me','め'],['mo','も'],
  ['ra','ら'],['ri','り'],['ru','る'],['re','れ'],['ro','ろ'],
  ['la','ら'],['li','り'],['lu','る'],['le','れ'],['lo','ろ'],
  ['ya','や'],['yu','ゆ'],['yo','よ'],
  ['wa','わ'],['wi','ゐ'],['we','ゑ'],['wo','を'],
  // 母音（1文字）
  ['a','あ'],['i','い'],['u','う'],['e','え'],['o','お'],
];

// 英語綴りを日本語読みに近いローマ字へ正規化する前処理
// 辞書にない名前のフォールバック精度を上げるためのルール群
function normalizeEnglishSpelling(input) {
  let s = input.toLowerCase().trim();

  // 1. 長母音
  s = s.replace(/ee/g, 'i-');
  s = s.replace(/oo/g, 'u-');
  s = s.replace(/ou/g, 'o-');

  // 2. 外来音を既存のかなに丸める（kotodama定義のある文字に落とす）
  s = s.replace(/she/g, 'shi');
  s = s.replace(/che/g, 'chi');
  s = s.replace(/je/g, 'ji');
  s = s.replace(/fa/g, 'ha');
  s = s.replace(/fi/g, 'hi');
  s = s.replace(/fe/g, 'he');
  s = s.replace(/fo/g, 'ho');
  s = s.replace(/va/g, 'ba');
  s = s.replace(/vi/g, 'bi');
  s = s.replace(/vu/g, 'bu');
  s = s.replace(/ve/g, 'be');
  s = s.replace(/vo/g, 'bo');

  // 3. 英語の 'c' を文脈で分離（ce/ci → s系、ca/co/cu → k系）
  s = s.replace(/ce/g, 'se');
  s = s.replace(/ci/g, 'shi');
  s = s.replace(/ca/g, 'ka');
  s = s.replace(/co/g, 'ko');
  s = s.replace(/cu/g, 'ku');

  // 4. ダイグラフ
  s = s.replace(/th/g, 's');
  s = s.replace(/ph/g, 'fu');
  s = s.replace(/ck/g, 'kku');
  s = s.replace(/x/g, 'kkusu');
  s = s.replace(/qu/g, 'ku');

  // 5. sh/ch が母音以外の前にある場合に u/i を補う
  //    （shr → shur、語末 sh → shu など）
  s = s.replace(/sh(?![aeiou])/g, 'shu');
  s = s.replace(/ch(?![aeiou])/g, 'chi');

  // 6. 語末 ew → yu-（Mathew/Andrew/Drew 系）
  s = s.replace(/ew$/g, 'yu-');

  // 7. 残った 'c' を 'k' に統一（cr, cl などのクラスタ用）
  s = s.replace(/c/g, 'k');

  // 8. 隣接子音の間に 'u' を挿入（汎用クラスタ分解）
  //    h は除外（sh/ch の digraph 保護）、n/y/q/w も除外（特殊役割）
  //    同一子音ペア（kk/tt/ss 等）は除外し、促音として残す
  //    複数回パスして連鎖クラスタに対応
  for (let pass = 0; pass < 3; pass++) {
    s = s.replace(/([bdfgjklmprstvz])([bdfgjklmprstvz])/g,
      (m, a, b) => a === b ? m : a + 'u' + b);
  }

  // 9. 語末の孤立子音に母音を補う
  s = s.replace(/([bcdfghjklmpstvz])$/g, (_, c) => {
    const vowel = { b: 'u', c: 'u', d: 'o', f: 'u', g: 'u', h: '', j: 'i',
                    k: 'u', l: 'ru', m: 'u', p: 'u', s: 'u', t: 'o', v: 'u', z: 'u' };
    return c + (vowel[c] !== undefined ? vowel[c] : 'u');
  });

  // 10. 語末 r → 長音
  s = s.replace(/r$/g, '-');

  // 11. w の整理（wa/wi/we/wo 以外では除去）
  s = s.replace(/w(?![aieo])/g, '');

  return s;
}

function romajiToHiragana(input) {
  let str = normalizeEnglishSpelling(input);
  let result = '';
  let i = 0;

  while (i < str.length) {
    // 長音記号（ハイフンや連続母音）
    if (str[i] === '-') {
      result += 'ー';
      i++;
      continue;
    }

    // 促音: 同じ子音が2つ続く場合（nn以外）
    if (i + 1 < str.length && str[i] === str[i + 1] && str[i] !== 'a' && str[i] !== 'i' && str[i] !== 'u' && str[i] !== 'e' && str[i] !== 'o' && str[i] !== 'n') {
      result += 'っ';
      i++;
      continue;
    }

    // 「ん」の処理: nの後に子音が来るか、語末の場合
    if (str[i] === 'n') {
      if (i + 1 >= str.length) {
        result += 'ん';
        i++;
        continue;
      }
      const next = str[i + 1];
      if (next !== 'a' && next !== 'i' && next !== 'u' && next !== 'e' && next !== 'o' && next !== 'y') {
        // n + 子音 → 「ん」+ 次の文字を処理
        // ただし na, ni, nu, ne, no, ny* は「な行」なのでスキップ
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

    // 最長一致でローマ字テーブルを検索
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
      // マッチしない文字はスキップ（スペース等）
      i++;
    }
  }

  return result;
}

// --- 言霊ルックアップ ---
function lookupKotodama(hiragana) {
  if (!kotodamaData) return [];

  const chars = kotodamaData.characters;
  const results = [];
  let i = 0;

  while (i < hiragana.length) {
    // 長音記号
    if (hiragana[i] === 'ー') {
      results.push({
        kana: 'ー',
        meaning: '伸びやかな余韻',
        romaji: '-',
        motif: 'long_echo',
        color: '#CCCCCC',
        isSpecial: true
      });
      i++;
      continue;
    }

    // 2文字の拗音を先にチェック
    if (i + 1 < hiragana.length) {
      const twoChar = hiragana.substring(i, i + 2);
      if (chars[twoChar]) {
        results.push({ kana: twoChar, ...chars[twoChar] });
        i += 2;
        continue;
      }
    }

    // 1文字
    const oneChar = hiragana[i];
    if (chars[oneChar]) {
      results.push({ kana: oneChar, ...chars[oneChar] });
    } else {
      results.push({
        kana: oneChar,
        meaning: '神秘の音',
        romaji: oneChar,
        motif: 'mystery',
        color: '#888888',
        isSpecial: true
      });
    }
    i++;
  }

  return results;
}

// --- ストーリー生成（英語） ---
function generateStory(name, kotodamaResults) {
  const filtered = kotodamaResults.filter(k => !k.isSpecial);
  if (filtered.length === 0) return '';

  const englishParts = filtered.map((k, i) => {
    const meaning = getEnglishMeaning(k.kana);
    const keyword = meaning.split('—')[0].trim().toLowerCase();
    const prefixes = ['the spirit of', 'embracing', 'guided by', 'resonating with', 'carrying', 'blessed with', 'illuminated by', 'flowing with'];
    const prefix = prefixes[i % prefixes.length];
    return `${prefix} ${keyword}`;
  });

  return `The name "${name}" carries a beautiful harmony of kotodama spirits: ${englishParts.join(', ')}. Together, these sounds weave a unique story that is yours alone.`;
}

// --- 名前変換（辞書→ローマ字の2段階） ---
function convertName(input) {
  // 1. まず辞書で英語名を検索
  const dictResult = lookupNameDictionary(input);
  if (dictResult) {
    return {
      romaji: dictResult,
      hiragana: romajiToHiragana(dictResult),
      source: 'dictionary'
    };
  }
  // 2. 辞書にない場合はローマ字としてそのまま変換
  return {
    romaji: input.toLowerCase(),
    hiragana: romajiToHiragana(input),
    source: 'romaji'
  };
}

// --- UI更新 ---
function onNameInput(e) {
  const input = e.target.value.trim();
  const romajiInput = document.getElementById('romajiInput');

  if (input.length > 0) {
    const result = convertName(input);
    romajiInput.value = result.romaji;
    updateHiraganaPreview(result.romaji);
  } else {
    romajiInput.value = '';
    document.getElementById('hiraganaPreview').textContent = '';
  }
}

function onRomajiInput(e) {
  const romaji = e.target.value.trim();
  updateHiraganaPreview(romaji);
}

function updateHiraganaPreview(romaji) {
  const preview = document.getElementById('hiraganaPreview');
  if (romaji.length > 0) {
    const hiragana = romajiToHiragana(romaji);
    preview.textContent = hiragana ? `→ ${hiragana}` : '';
  } else {
    preview.textContent = '';
  }
}

function generate() {
  const nameInput = document.getElementById('nameInput').value.trim();
  if (!nameInput) return;

  // ローマ字フィールドの値を優先（手動修正を反映）
  const romajiValue = document.getElementById('romajiInput').value.trim();
  const hiragana = romajiToHiragana(romajiValue || convertName(nameInput).romaji);
  const kotodamaResults = lookupKotodama(hiragana);
  const resultSection = document.getElementById('resultSection');
  const charCount = kotodamaResults.length;

  // 文字数チェック
  if (charCount > 12) {
    document.getElementById('charWarning').classList.remove('hidden');
    document.getElementById('charWarning').textContent = `Your name has ${charCount} characters. We recommend 12 or fewer for the best T-shirt design. Try a nickname!`;
  } else {
    document.getElementById('charWarning').classList.add('hidden');
  }

  // ひらがな表示
  document.getElementById('hiraganaDisplay').textContent = hiragana;

  // フォントサイズ自動調整
  const hiraganaEl = document.getElementById('hiraganaDisplay');
  if (charCount > 10) {
    hiraganaEl.style.fontSize = '2rem';
  } else if (charCount > 7) {
    hiraganaEl.style.fontSize = '2.5rem';
  } else {
    hiraganaEl.style.fontSize = '3.5rem';
  }

  // 意味カード生成
  const cardsContainer = document.getElementById('meaningCards');
  cardsContainer.innerHTML = '';

  kotodamaResults.forEach((k, index) => {
    if (k.isSpecial) return;
    const card = document.createElement('div');
    card.className = 'meaning-card';
    card.style.animationDelay = `${index * 0.1}s`;
    const engMeaning = getEnglishMeaning(k.kana);
    const keyword = engMeaning.split('—')[0].trim();
    const desc = engMeaning.split('—')[1] ? engMeaning.split('—')[1].trim() : '';
    card.innerHTML = `
      <div class="card-kana" style="color: ${k.color}">${k.kana}</div>
      <div class="card-color-bar" style="background: ${k.color}"></div>
      <div class="card-meaning">${keyword}</div>
      <div class="card-motif">${desc}</div>
    `;
    cardsContainer.appendChild(card);
  });

  // 英語ストーリー
  const story = generateStory(nameInput, kotodamaResults);
  document.getElementById('storyText').textContent = story;

  // 英語の意味一覧
  const meaningsList = document.getElementById('meaningsList');
  meaningsList.innerHTML = '';
  kotodamaResults.forEach(k => {
    if (k.isSpecial) return;
    const li = document.createElement('li');
    li.innerHTML = `<span class="meaning-kana" style="color: ${k.color}">${k.kana}</span> ${getEnglishMeaning(k.kana)}`;
    meaningsList.appendChild(li);
  });

  // シェアカード描画（Canvas API）
  renderShareCard(nameInput, hiragana, kotodamaResults);

  // GA4: 結果表示イベント
  trackEvent('kotodama_reveal', {
    name_input: nameInput,
    char_count: kotodamaResults.filter(k => !k.isSpecial).length,
  });

  // 結果セクション表示
  resultSection.classList.remove('hidden');
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

// --- Bold Washi シェアカード描画 (Canvas API) ---

// 英語の意味マッピング（シェアカード用）
const ENGLISH_MEANINGS = {
  "あ": "Beginning — the spark of life",
  "い": "Insight — sharp intuition and wisdom",
  "う": "Embrace — cosmic expansiveness",
  "え": "Harmony — nourishing balance",
  "お": "Stability — grounded like the earth",
  "か": "Pioneer — the force that opens paths",
  "き": "Clarity — pure will and intuition",
  "く": "Creation — flexible and inventive",
  "け": "Grace — elegant and refined",
  "こ": "Guardian — unwavering resolve",
  "さ": "Purity — sincere at heart",
  "し": "Depth — still waters run deep",
  "す": "Flow — ever-changing like a stream",
  "せ": "Bond — connection and support",
  "そ": "Genesis — the origin of creation",
  "た": "Roots — grounded in reality",
  "ち": "Growth — steady and sure",
  "つ": "Momentum — small steps, great leaps",
  "て": "Reach — the explorer's spirit",
  "と": "Gateway — to new worlds",
  "な": "Stillness — quiet inner strength",
  "に": "Unity — bridging two into one",
  "ぬ": "Hidden Power — deep nourishment",
  "ね": "Foundation — rooted and stable",
  "の": "Adaptability — riding the current",
  "は": "Sensation — riding waves of change",
  "ひ": "Hope — the flame that lights the way",
  "ふ": "Freedom — carried by the wind",
  "へ": "Transformation — bridge to the new",
  "ほ": "Abundance — harvest and plenty",
  "ま": "Integrity — sincere and harmonious",
  "み": "Fruition — ripe with possibility",
  "む": "Infinite — boundless potential",
  "め": "Awakening — a seed sprouting anew",
  "も": "Vitality — life force surging",
  "や": "Direction — arrow of intention",
  "ゆ": "Elegance — graceful and warm",
  "よ": "Joy — a rich and joyful cycle",
  "ら": "Guidance — a compass for the soul",
  "り": "Lightness — free and graceful",
  "る": "Evolution — flowing forward",
  "れ": "Legacy — a chain of wisdom",
  "ろ": "Illumination — lighting the path",
  "わ": "Peace — the heart of harmony",
  "を": "Completion — guided to fulfillment",
  "ん": "Serenity — perfect stillness",
  "っ": "Intensity — concentrated energy",
  "ー": "Echo — lingering resonance",
  "きゃ": "Soft Start — a gentle beginning",
  "きゅ": "Hidden Leap — inner potential",
  "きょ": "Momentum — surging forward",
  "しゃ": "Pure Flow — clear intention",
  "しゅ": "Flexibility — an adaptable heart",
  "しょ": "Soaring — graceful flight",
  "ちゃ": "Budding — fresh energy rising",
  "ちゅ": "Focus — drawn to the center",
  "ちょ": "Vision — eyes on the future",
  "にゃ": "Gentle Bond — soft connection",
  "にゅ": "New Unity — fresh alliance",
  "にょ": "Smooth Path — moving with ease",
  "ひゃ": "Radiance — a luminous start",
  "ひゅ": "Light Hope — buoyant optimism",
  "ひょ": "Leap of Light — bounding forward",
  "みゃ": "Rich Harmony — abundant peace",
  "みゅ": "Expanding Dream — limitless vision",
  "みょ": "Warm Advance — moving with heart",
  "りゃ": "Steady Compass — unwavering direction",
  "りゅ": "Flowing Growth — organic expansion",
  "りょ": "Nurturing Bond — cultivating connection",
  "が": "Force — powerful initiation",
  "ぎ": "Sharpness — keen perception",
  "ぐ": "Strength — robust embrace",
  "げ": "Grounding — rooted harmony",
  "ご": "Shield — steadfast protection",
  "ざ": "Resolve — pure determination",
  "じ": "Insight — deep perception",
  "ず": "Persistence — endless flow",
  "ぜ": "Abundance Link — path to plenty",
  "ぞ": "Creative Power — bold making",
  "だ": "Deep Roots — unshakable",
  "ぢ": "Hidden Edge — concealed sharpness",
  "づ": "Rising Embrace — surging warmth",
  "で": "Base Harmony — foundational balance",
  "ど": "Iron Will — solid resolve",
  "ば": "Overflow — abundant richness",
  "び": "Sparkle — glittering hope",
  "ぶ": "Dynamism — powerful motion",
  "べ": "Renewal — seeds of change",
  "ぼ": "Earth's Gift — deep fertility",
  "ぱ": "Fresh Wind — calling the new",
  "ぴ": "Lightness — nimble thought",
  "ぷ": "Leap — free and boundless",
  "ぺ": "Soft Revolution — gentle change",
  "ぽ": "Cheerful Plenty — bright abundance",
  "じゃ": "Flowing Insight — perception in motion",
  "じゅ": "Adaptive Wisdom — flexible intelligence",
  "じょ": "Quiet Guidance — gentle direction",
  "ぎゃ": "Strong Intuition — powerful perception",
  "ぎゅ": "Concentrated Insight — focused depth",
  "ぎょ": "Unwavering Gaze — steady vision",
  "びゃ": "Radiant Beginning — luminous start",
  "びゅ": "Lively Sparkle — vivid shimmer",
  "びょ": "Beautiful Flight — graceful ascent",
  "ぴゃ": "Bursting Idea — vibrant inspiration",
  "ぴゅ": "Wind Spark — swift insight",
  "ぴょ": "Leaping Joy — bounding delight",
};

function getEnglishMeaning(kana) {
  return ENGLISH_MEANINGS[kana] || 'Mystery — a spirit yet to be named';
}

// 背景画像プリロード
let bgWashiImg = null;
function loadBgImage() {
  return new Promise((resolve) => {
    if (bgWashiImg) { resolve(bgWashiImg); return; }
    const img = new Image();
    img.onload = () => { bgWashiImg = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = 'bg-washi.png';
  });
}

// フォントプリロード
async function preloadFonts() {
  const fonts = [
    '900 72px "Inter"',
    '700 48px "Noto Serif JP"',
    '600 24px "Noto Serif JP"',
    '400 20px "Inter"',
  ];
  await Promise.all(fonts.map(f => document.fonts.load(f)));
}

// Bold Washi シェアカード描画
async function renderShareCard(name, hiragana, kotodamaResults) {
  const [, bgImg] = await Promise.all([preloadFonts(), loadBgImage()]);

  const canvas = document.getElementById('shareCardCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 1080;
  const H = 1080;

  canvas.width = W;
  canvas.height = H;

  const filtered = kotodamaResults.filter(k => !k.isSpecial);
  // シェアカード用ひらがな（長音記号を除去）
  const cleanHiragana = kotodamaResults.filter(k => !k.isSpecial).map(k => k.kana).join('');

  // === 背景: 和紙画像 ===
  if (bgImg) {
    // 画像を1080x1080にカバーフィット
    const imgW = bgImg.naturalWidth;
    const imgH = bgImg.naturalHeight;
    const scale = Math.max(W / imgW, H / imgH);
    const sw = W / scale;
    const sh = H / scale;
    const sx = (imgW - sw) / 2;
    const sy = (imgH - sh) / 2;
    ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
  } else {
    // フォールバック: 単色
    ctx.fillStyle = '#f0ead6';
    ctx.fillRect(0, 0, W, H);
  }

  // === ブランド: KOTODAMA 上部 ===
  ctx.font = '600 24px "Inter"';
  ctx.fillStyle = '#c53d43';
  ctx.textAlign = 'center';
  ctx.fillText('K O T O D A M A', W / 2, 65);

  // サブタイトル
  ctx.font = '300 20px "Inter"';
  ctx.fillStyle = '#7a6e58';
  ctx.fillText('The spirit of your name', W / 2, 100);

  // 上部装飾ライン
  ctx.strokeStyle = 'rgba(197,61,67,0.15)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, 118);
  ctx.lineTo(W / 2 + 160, 118);
  ctx.stroke();

  // === 名前: 英語（太字ドーン） ===
  const nameText = name.toUpperCase();
  let nameFontSize = 140;
  if (nameText.length > 8) nameFontSize = 105;
  if (nameText.length > 12) nameFontSize = 80;

  ctx.font = `900 ${nameFontSize}px "Inter"`;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.fillText(nameText, W / 2, 280);

  // === ひらがな（明朝体・大きく） ===
  let kanaFontSize = 72;
  if (cleanHiragana.length > 6) kanaFontSize = 58;
  if (cleanHiragana.length > 10) kanaFontSize = 44;

  ctx.font = `400 ${kanaFontSize}px "Noto Serif JP"`;
  ctx.fillStyle = '#3a3024';
  ctx.fillText(cleanHiragana, W / 2, 365);

  // 区切り装飾
  ctx.strokeStyle = '#c53d43';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 40, 395);
  ctx.lineTo(W / 2 + 40, 395);
  ctx.stroke();
  // 中央ドット
  ctx.beginPath();
  ctx.arc(W / 2, 395, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#c53d43';
  ctx.fill();

  // === 意味ピルバッジ ===
  const pillStartY = 440;
  const pillHeight = 58;
  const pillGap = 12;
  const pillMaxWidth = 840;
  const maxPills = Math.min(filtered.length, 6);

  for (let i = 0; i < maxPills; i++) {
    const k = filtered[i];
    const y = pillStartY + i * (pillHeight + pillGap);
    const meaning = getEnglishMeaning(k.kana);

    const pillW = pillMaxWidth;
    const pillX = (W - pillW) / 2;
    const radius = 8;

    // ピル背景（半透明、羊皮紙風）
    ctx.fillStyle = 'rgba(225,218,195,0.5)';
    roundRect(ctx, pillX, y, pillW, pillHeight, radius);
    ctx.fill();

    // 左ボーダー（カラーアクセント）
    ctx.fillStyle = k.color;
    roundRect(ctx, pillX, y, 5, pillHeight, 2);
    ctx.fill();

    // ひらがな（明朝体）
    ctx.font = '600 30px "Noto Serif JP"';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'left';
    ctx.fillText(k.kana, pillX + 24, y + pillHeight / 2 + 10);

    // 英語の意味（大きめ）
    ctx.font = '500 22px "Inter"';
    ctx.fillStyle = '#3a3024';
    ctx.fillText(meaning, pillX + 80, y + pillHeight / 2 + 8);
  }

  // === ストーリーテキスト ===
  const storyY = pillStartY + maxPills * (pillHeight + pillGap) + 30;
  const story = generateStory(name, kotodamaResults);
  if (story) {
    ctx.font = 'italic 400 24px "Inter"';
    ctx.fillStyle = '#4a3f30';
    ctx.textAlign = 'center';
    wrapText(ctx, story, W / 2, storyY, W - 180, 34);
  }

  // === 判子 (Hanko) ===
  const hankoX = W - 90;
  const hankoY = H - 90;
  const hankoSize = 56;

  ctx.save();
  ctx.translate(hankoX, hankoY);
  ctx.rotate(-5 * Math.PI / 180);

  ctx.strokeStyle = '#c53d43';
  ctx.lineWidth = 2.5;
  roundRect(ctx, -hankoSize / 2, -hankoSize / 2, hankoSize, hankoSize, 5);
  ctx.stroke();

  ctx.font = '700 20px "Noto Serif JP"';
  ctx.fillStyle = '#c53d43';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('言霊', 0, 0);
  ctx.restore();

  // === 下部 CTA ===
  ctx.font = '300 17px "Inter"';
  ctx.fillStyle = '#7a6e58';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Discover yours at kotodama.app', W / 2, H - 40);

  ctx.textBaseline = 'alphabetic';
}

// テキスト折り返しヘルパー
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

// 角丸矩形ヘルパー
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}


// --- シェアボタン ---
function initShareButtons() {
  // ダウンロード
  document.getElementById('downloadCardBtn').addEventListener('click', () => {
    const canvas = document.getElementById('shareCardCanvas');
    const name = document.getElementById('nameInput').value.trim() || 'kotodama';
    const link = document.createElement('a');
    link.download = `kotodama-${name.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    trackEvent('card_download', { name_input: name });
  });

  // Twitter/Xシェア
  document.getElementById('shareTwitterBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    trackEvent('share_twitter', { name_input: name });
    const text = encodeURIComponent(
      `I just discovered the hidden Japanese meaning of my name "${name}" through Kotodama! Each sound carries an ancient spirit. ✨\n\nDiscover yours:`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  });

  // リンクコピー
  document.getElementById('shareCopyBtn').addEventListener('click', () => {
    trackEvent('share_copy_link');
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.getElementById('shareCopyBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
    });
  });
}

// --- CTA フォーム ---
function initCTA() {
  const form = document.getElementById('ctaForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('ctaEmail').value;
    const name = document.getElementById('nameInput').value.trim();
    trackEvent('cta_email_submit', { name_input: name });
    // Formspree が設定されるまではローカルで確認表示
    const formAction = form.getAttribute('action');
    if (formAction && formAction.length > 0) {
      // Formspree送信
      fetch(formAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      }).then(() => {
        form.innerHTML = '<p class="cta-success">You\'re on the list! We\'ll notify you when your design is ready. 🎉</p>';
      }).catch(() => {
        form.innerHTML = '<p class="cta-success">Thanks for your interest! We\'ll be in touch soon.</p>';
      });
    } else {
      form.innerHTML = '<p class="cta-success">You\'re on the list! We\'ll notify you when your design is ready. 🎉</p>';
    }
  });
}

// --- ユーティリティ ---
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// --- 起動 ---
document.addEventListener('DOMContentLoaded', () => {
  init();
  initShareButtons();
  initCTA();
});
