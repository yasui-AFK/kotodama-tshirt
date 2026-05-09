# Handoff: Kotodama EC Site (言霊)

## Overview

Kotodama is an English-language e-commerce site for an international, spiritually-curious female audience. The user enters their name and receives a poetic "kotodama reading" — a meaning derived from the Japanese sound-syllables their name maps to. The reading is the entry point to a small, considered product line: a digital reading PDF, a name-calligraphy tee, a rolled scroll print, and a tote bag.

The hero metaphor is **brushed ink on warm paper**. The product is the experience first, the merchandise second.

Sample flow with the name **Emma**:
1. Enter "Emma"
2. App romanizes → kana → `[え, ま]`
3. Each kana resolves to an element + keyword + one-line poem (`え` = *Light · Wisdom*, `ま` = *Truth · Sincerity*)
4. The combination produces an **archetype** ("The Open Sky")
5. User can buy products customized with their name brushed in kana

---

## About the Design Files

The files in `/design-references/` are **design references created in HTML** — interactive prototypes that show intended look-and-feel and interaction behavior. They are **not production code to copy directly**.

The task is to **recreate these designs in the target codebase's existing environment** (Next.js + Shopify Hydrogen, a custom React+Stripe stack, a headless WooCommerce front-end, etc.) using the codebase's established patterns and component library. If no environment exists yet, recommend a stack appropriate for an EC site (Next.js + Shopify Storefront API or Medusa.js are both reasonable starting points) and implement there.

Treat the HTML as the visual + behavioral spec. Treat the JSX inside it as a sketch — useful for understanding structure, but rewrite it idiomatically in the target framework.

---

## Fidelity

**High-fidelity (hifi).** The mockups define final colors, typography, spacing, and the brush-reveal interaction. The developer should recreate the UI **pixel-perfectly** using the codebase's own libraries and patterns.

The one explicit caveat: the brushed kana glyphs in the prototype are rendered procedurally by `brush-writer.jsx` using SVG strokes synthesized from Noto Serif JP path data. **In production, replace these with hand-brushed calligraphy assets** (see *Calligraphy Asset Plan* below). The procedural brush is a placeholder.

---

## Direction

The chosen visual direction is **C · Sakura Soft**:

- Background: warm cream `#f5ecdf`
- Foreground (ink): deep plum `#3a2230`
- Primary accent: dusty rose `#b85d6e`
- Secondary accent: soft pink-clay `#d4a59b`
- Paper surface (cards): `#faf2e6`

The site reads as warm, romantic, and feminine without being saccharine. It should feel closer to a small editorial gift brand than to a generic spiritual-lifestyle site.

(Two earlier explored directions — A · Sumi-e Calm and B · Moonlit Indigo — have been removed from the canvas. The theme objects for them still exist in `kotodama-screens.jsx > KT_THEMES` and can be ignored or deleted in production.)

---

## Files

- `index.html` — design canvas, all 6 main screens + mobile + calligraphy plan
- `prototype.html` — interactive prototype (Landing → Cart, fully clickable)
- `kotodama-app.jsx` — main `KotodamaApp` component, screen routing, products, PDP, cart
- `kotodama-screens.jsx` — Landing, NameInput, Reading screens; `KotodamaBrushBackdrop`
- `kotodama-data.js` — kana → meaning map, `romanizeName()`, archetype derivation
- `kotodama-visuals.jsx` — keyframes, `Enso`, `KPH` placeholder, ripple/bleed effects
- `brush-writer.jsx` — procedural brush-stroke rendering for kana
- `design-canvas.jsx` — the canvas component used to lay artboards out

詳細は元のハンドオフドキュメント参照（前セッションのアタッチメント原本に screens / interactions / design tokens / calligraphy asset plan / open product questions まで網羅されている）。
