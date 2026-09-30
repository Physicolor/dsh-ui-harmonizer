---
description: "One interface language for the Harness, plus per-plugin reconciliation and a read-only compatibility audit."
---

<p align="right"><b>English</b> · <a href="README.zh-CN.md">简体中文</a></p>

<h1 align="center">DSH UI Harmonizer</h1>

<p align="center">
  <strong>UI harmonizer for DeepSeek Harness.</strong><br>
  Normalizes the official UI · reconciles every plugin · settings auto-normalizer · UI customization (incl. rounded card)
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-ui-harmonizer?style=flat&label=latest%20release&color=4D6BFE" alt="Latest release">
  <img src="https://img.shields.io/npm/dt/dsh-ui-harmonizer?style=flat&label=total%20downloads&color=4D6BFE" alt="Total downloads">
  <a href="https://github.com/Physicolor/dsh-ui-harmonizer/stargazers"><img src="https://img.shields.io/github/stars/Physicolor/dsh-ui-harmonizer?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License">
  <img src="https://img.shields.io/badge/DSH%200.1.x-4493F8?style=flat-square" alt="Supported: DeepSeek Harness 0.1.x">
</p>

---

> **TL;DR:** You installed a bunch of DSH plugins but the UI looks inconsistent? DSH UI Harmonizer uses **CSS overrides + runtime DOM coordination** to bring them back to the official design language — **non-destructive, fully reversible, zero model cost**.

DSH UI Harmonizer is a **client-only DSH bundle plugin**. It adds no model tools and modifies no session logs — it adjusts the UI purely through official slots (`settings.section` / `settings.general.item`) and the `--dsw-*` semantic token system.

---

## Features

### 🎨 Official UI Normalization

| Capability | Detail |
| --- | --- |
| Single-line header | Moves the conversation / trajectory selector into the title row; the header collapses to one line |
| Button capsule family | Session log, widgets, and toggle buttons unified into 32px capsules |
| Right-rail flush rounded rect | better-sidebar panel overlay layout; the header stays put |
| Unified settings header | Title 18/600 + description 13px + hairline divider |
| Native-title tooltips | Raw `title` attributes render as the official dark tooltip bubble instead of the OS-native popup |

### ♻️ Plugin Visual Reconciliation

| Target | Approach |
| --- | --- |
| `dsh-better-sidebar` | Capsule-ize toggle buttons, unify panel backgrounds, coordinate layout, smooth transitions |
| `dsh-widgets` | Matching stat capsule family, header utilities alignment |
| `@omdsh-dev/dsh-genui` | `render_ui` panels & tool cards: width follows the conversation content width (`--enhancer-content-width`, e.g. 840px) instead of inflating across the whole seat; fold bar long-title shrink fix with unified 11px/16px padding; 16px side-padding standard for full-width blocks (`banner`/`steps`, no box expansion); width guardrails for svg/pre/canvas/img/mermaid |
| Third-party settings pages | Auto-fill headings, drop redundant icons, normalize spacing |

### 🧹 Settings Auto-Normalizer ⭐

When any third-party plugin adds a page to `settings.section` that doesn't follow the official spec, this plugin auto-corrects it:

| Auto-check | Fix |
| --- | --- |
| Missing page title | Injects an 18/600 title (from the nav label or a known mapping) |
| Redundant icon beside the title | Removes the title-row logo, keeps plain text |
| Title/description too tight | Unifies to 4px spacing + hairline divider |
| Inconsistent type/size | Title 18/600, description 13/20 + `border-bottom` |

### 🎛️ UI Customization

The "UI Customization" block under Settings → General: chat width, markdown font size, workspace scale, UI font stack, and rounded card all adjust live. The "rounded card" renders the conversation area as a card with a rounded top-left corner and a drop shadow, auto-resizing with the sidebar width / details column.

---

## Architecture

The plugin is organised by **target**, not by file type. It exists to harmonize two
different things at once — (a) the DSH shell itself and (b) whichever community
plugins happen to be installed next to it — so every source file belongs to exactly
one of four layers:

| Layer | Answers | Examples |
| --- | --- | --- |
| `core/` | infrastructure true regardless of DSH or any plugin | state model + persistence, the Harmony Contract, i18n, DOM/React helpers |
| `harness/` | normalizations and repairs aimed at the **DSH shell** | official control-recipe mirrors, the settings-header reconciler, the chat-width channel, the frame's column-track transition, menu width, the stylesheet keeper, native-title tooltips, the rounded center card |
| `plugins/<package>/` | adaptations written for **one** community plugin | `commandcode-provider` text normalisation, `dsh-widgets` rail squeeze + handle re-anchor, `dsh-better-sidebar` panels, `dsh-genui` width hygiene |
| `self/` | the plugin's **own** UI | Settings → General rows, the font selector, the Harmony Doctor page |

Stylesheets follow the same split: 23 `.module.css` fragments with a single entry
(`src/client/styles/index.ts`) whose **import order is the cascade order**.

The rest of the contract is unchanged:

- **Zero model cost**: the host (node) half is a no-op; all changes happen in the browser half;
- **Official design tokens**: all styles use the `--dsw-*` semantic tokens and follow light/dark themes automatically;
- **Two injection channels**: static rules (CSS Modules) + dynamic `<style data-plugin>` tags;
- **Reversible cleanup**: every `ctx.effect` returns a disposer, so stopping the plugin leaves no residue — including DOM nodes it relocated and third-party strings it rewrote;
- **Slot integration**: `settings.general.item` / `settings.section` / `shell.overlay`.

Guards live in `scripts/`: `tools/css-baseline.mjs` (byte-invariant of the compiled
stylesheet), `verify-frame-track.cjs` (column-track animation), `verify/settings-page.cjs`
(Settings → General signals), `probes/harness/*` (selector and network triage).

---

## Installation

```sh
# via npm (plugin market)
dsh plugin --profile web add dsh-ui-harmonizer

# local development (link)
dsh plugin --profile web add link:D:/dsh-home/plugins/harness-ui-enhancer
```

After installing, **hard-refresh the browser** (Ctrl+Shift+R); the "UI Customization" block appears under Settings → General.

---

## Development

```sh
pnpm install
pnpm run build      # tsdown builds lib/
pnpm run check      # typecheck + build
```

- `peerDependencies`: `@deepseek-ai/dsh-client-ui-slots`, `dsh-client-runtime` (provided by the DSH web profile);
- A pure client plugin: `cordis.patch.yml` inserts the `ui-enhancer` row; the browser half is declared by `dsh.client`;
- **Must sync after changes**: `npx tsdown` rebuild → sync into `profiles/web/node_modules/dsh-ui-harmonizer/lib/` → hard-refresh the browser.

---

## Compatibility

- DeepSeek Harness `0.1.0-rc.6` and compatible later `0.1.x`;
- Integrates via official slots, coexisting with better-sidebar, dsh-widgets, dshmarket, etc. by slot order;
- Known reconciliation targets: `dsh-better-sidebar`, `dsh-widgets`, `dsh-notification`, `dshmarket`;
- The page fully restores to defaults after uninstall/disable — no residue.

---

## Roadmap

- **Phase 1 · Official UI Normalization** (in progress): keep fixing unfinished parts of the official UI;
- **Phase 2 · Plugin compatibility coordinator** (in progress): detect and fix layout/style conflicts between plugins;
- **Phase 3 · Unified visual style** (in progress): an optional style layer — the "rounded card" is live (wrapped-header model), plus title-tooltip unification; next: spacing density, more radius/animation unification;
  - *Liquid Glass exploration*: normalization's end goal is lowering cognitive cost — unified headings and tooltips remove the micro-fatigue of switching between styles; a material layer goes further, using one consistent physical metaphor to signal elevation and interactivity so the whole page reads as a single mental model. Scope: pure CSS/token experiments on top of semantic aliases — an opt-in switch, at most a couple of large backdrop surfaces (GPU budget), honoring reduced-transparency/reduced-motion, falling back to today's solid fills where unsupported, never touching plugin sources, and only shipping if readability measurably survives it;
- **Phase 4 · Ecosystem**: crystallize into an extensible rule-registration mechanism.

---

## Changelog

### v0.9.0 — one interface language for the Harness, and a layout per target

**Refactor — every source file now belongs to exactly one layer**

- The plugin is organised by TARGET: `core/` (infrastructure true regardless of DSH or any plugin), `harness/` (normalizations aimed at the DSH shell), `plugins/<package>/` (adaptations written for one community plugin), `self/` (this plugin's own UI). `src/client/` now holds nothing but `index.ts` and `services.d.ts`.
- The 1253-line stylesheet is split into 23 `.module.css` fragments behind ONE entry (`src/client/styles/index.ts`) whose **import order is the cascade order**; the split was proven byte-identical to the original, and `scripts/tools/css-baseline.mjs` now pins the compiled result.
- `npx tsc --noEmit` went from **52 errors to 0**, and `build` runs `tsc` so `lib/types/` really exists (it was advertised in `files` but never emitted).

**Fixed — dead and wrong selectors, found by an adversarial pass over the live DOM**

- The dropdown-menu recipe had **never applied**: `[role='menu'] [class^='_list_']` is both a descendant and a prefix match, while the product puts `role` and the list class on the SAME element with the list class not first (`_surface… _list_4ub78_7 …`). Measured with a menu open — descendant 0, prefix 0, contains 1. Fixed to `[role='menu'][class*='_list_']`; list / item / icon / label rules now land (padding 4px, min-width 218px, item min-height 40px).
- Sidebar rows that carry a modifier class (`_brand _wide`) silently stopped matching `[class$='_brand']`; the anchors now read "the class list CONTAINS a `_brand` item".
- The brand wordmark is no longer resized at all — 0.2 renders it as TWO svgs (whale + HARNESS badge), so one `svg { width:182px }` stretched the whale 7.6×.
- `menu-anchor` must not treat the shell's settings button (`aria-haspopup="dialog"`, `aria-expanded` true for as long as the dialog is open) as a menu trigger — it was force-sizing the product's own popups to a sidebar row.
- The Doctor's `deadInThisView` was declared twice (a count and a row array), so its Markdown export printed `[object Object]`; a dead `market-hash` rule and a misattributed `data-dsh-*` coupling are gone.

**Fixed — the frame's column track actually animates on DSH 0.2**

- 0.2 moved the AppFrame's `transition: grid-template-columns` behind `[data-animating]`, which React sets in a layout effect on the same commit that writes the new track — the before-change style therefore carries no transition, so none ever ran and the conversation column SNAPPED. Measured: 1640px → 776px in one frame, no transition events, `data-animating` cleared by the component's own 600ms fallback timer.
- The stylesheet now keeps the transition on the frame permanently (the product's own `[data-dragging]` / `[data-rightbar-instant]` rules still win), and `frame-track.ts` owns the one exclusion the product implements in JS — a window resize.

**Fixed — lifecycle**

- The two DOM relocations (session tabs, bottom-workbench toggle) put their nodes back on dispose; the center card's unconditional 1Hz `setInterval` is gone (ResizeObserver + resize + transition events already cover it); the settings-header fingerprint hashes TEXT instead of its length (equal-length rewrites used to freeze the title).

### Unreleased (pending acceptance) — one settings-header skeleton, row popups, stylesheet keeper

**Refactor — the settings page header is ONE skeleton with ONE geometry, on every page**

- 🔍 Measured first (`scripts/probes/settings/probe-header-geometry.mjs`, all eight pages that have a header): the title's viewport position was already identical everywhere (`titleTopFromDialog = 54`), but the title→description distance was not — 4px on this plugin's own pages, 12px on the official ones, **0px** on Command Code (its container is block flow, so no gap at all and the description touched the title) and 16px on 侧边卡片. The official value, read with this plugin's stylesheets temporarily disabled: **12px on models / agent presets / bundled plugins** — the section container's own `gap`. The \"official 4px\" the older docs claimed was this plugin's own compression, and it is retracted.
- ✅ `src/client/settings-page.ts` now produces exactly the skeleton a page needs and nothing more: `h2.enhc-page-title` + `p.enhc-page-intro` as siblings. This plugin's own pages render it through `SettingsPageHeader`, foreign pages get the pair stamped on their real nodes, and the head wrapper is gone — so a DevTools inspection shows the same two-node header shape on every page, official or third-party.
- 📐 The spacing is no longer a stylesheet constant: the reconciler measures the container that actually lays the header out (walking up through `display: contents` slot outlets) and writes the correction onto the description (`margin-top = 12px − container gap`), plus a compensating negative `margin-top` on the title when a container contributes its own `padding-top`/`border-top`. After the fix every page reads **title y=134, intro y=172, gap=12px** while the containers still differ (4 / none / 12 / 16 / 2px).
- 🔒 Nothing is moved or re-parented (a foreign React tree never sees a wrapper it did not render), a page that already conforms is left exactly as authored, and the reconciler's diff releases a node — and its inline spacing — the moment a page re-renders around it.

**Fixed — the sidebar account popup was narrower than the row it hangs from**

- 🐛 The account menu (设置 / 意见反馈 / 退出登录) painted at the product Menu's content width (218–360px) under a sidebar row that is the full 256px — a visible seam between the popup and its trigger.
- ✅ `src/client/menu-anchor.ts` pins a portalled menu opened from the settings-launcher seat to its trigger row's width (`box-sizing: border-box`), scoped to that seat: the composer's model/permission pickers and every other menu keep their own recipe.

**Fixed — a third-party settings page rendered completely unstyled (loader claim-pass bug)**

- 🔍 Root cause found in the product's client-module loader, not in the plugins: `claimStyles(id)` runs after **every** module factory materializes and adopts **every untagged `<style>` in the document** for that plugin (`style:not([data-plugin])`), while `removeOwnedStyles(id)` deletes every `style[data-plugin=id]` when that adopter reloads, unloads or is pruned. A plugin that hand-injects its stylesheet once in `apply()` (dsh-notification: `#dsh-notification-style`) therefore loses it permanently for the session — measured live: the 通知 page rendered as a raw text dump (no cards, no badges, default buttons) and `#dsh-notification-style` was simply absent.
- ✅ `src/client/style-keeper.ts` snapshots hand-injected stylesheets (`data-plugin-css` is the discriminator: bundler-emitted tags are the loader's own and stay untouched) and restores one that disappears, after a grace period that lets a legitimately hot-reloaded owner re-inject first. A restored sheet keeps its authored attributes — the thief's `data-plugin` claim is dropped.
- 📊 Probe (live page, loader semantics reproduced): baseline 38 rules + card `1px/12px/flex` → after the theft no sheet and `0px/0px/block` → after the grace period 38 rules and the card styled again; 9/9 checks pass.

**Cleanup**

- 🧽 Repaired 48 mojibake characters in `enhancer.module.css` comments (an old PowerShell `Get-Content -Raw`/`Set-Content` round trip had re-encoded the file as GBK: `—` → `鈥?`, `×` → `脳`, one Chinese phrase destroyed). Comment-only damage — the build was never affected — rewritten as UTF-8 by a Node script, never through a shell.

### v0.9.0 — repositioned: from CSS patch to UI contract layer + compatibility auditor

**New — Harmony Contract (cross-plugin UI contract)**

- 🧭 Publishes negotiation variables on `<html>` that any plugin or theme can read without depending on this one: `--enhc-contract` (revision), `--enhc-surface-solid`, `--enhc-glass-aware`, `--enhc-solid-fill`, `--enhc-content-width`, `--enhc-sidebar-scale`.
- 🔌 Provides `ctx.get('uiHarmony')` using the product's own `ctx.reflect.provide` idiom (the same one behind `ctx.sidebarRight`): neighbours **declare** what they occupy with `registerSurface({ id, role, occupies, widthVariable, transition, tokens, opaque })` instead of being measured by guesswork. This plugin only arbitrates and reports; it declares its own two surfaces too (rounded card, settings rows).
- 🪟 **Material awareness** derived from the semantic tokens themselves (alpha of `--dsw-alias-bg-base` / `-layer-1` / `--dsw-specific-sidebar-fill`), never from plugin identity. Under a glass theme `--enhc-solid-fill` becomes `transparent`, so the header/panels stop painting an unblurred opaque rectangle over the glass. **Measured by simulation** (no third-party theme installed): overriding `--dsw-alias-bg-base` to `rgba(255,255,255,0.45)` flips `--enhc-glass-aware` 0 to 1, `--enhc-surface-solid` 1 to 0, `--enhc-solid-fill` to `transparent`, and the session header `background-color` from `rgb(255,255,255)` to `rgba(0, 0, 0, 0)`; removing the override restores all four.

**New — Harmony Doctor (local read-only compatibility audit)**

- 🩺 Settings → **UI Compatibility**: one click runs four checks, zero network, zero model calls, exports a Markdown report.
- 🕳️ **Dead-rule ledger**: every one of the plugin's own selectors is match-counted, and a selector counts as dead only when it matched nothing in **every view observed** — the ledger persists per view, so the verdict sharpens as the user moves around. Measured over six probe views (hero, settings, session, doctor, glass on, glass off): of 149 selectors, **64 match in at least one view and 85 match in none of the observed views**.
- 🔗 **Foreign coupling health**: selectors that still read another plugin's private hashed class or undocumented `data-*` host, with live match counts (**39 couplings reported automatically**, a batch of them now matching 0 because better-sidebar 0.19.1 removed the classes).
- ⚖️ **Conflict / redundancy verdicts**: inline self-check (what we wrote must read back) plus a redundancy test (temporarily disable all our sheets and re-read the computed value; unchanged means the rule achieves nothing).
- 🗂️ **Surface inventory**: every `data-slot`, cross-plugin `data-*`, published contract variable and declared surface, with consumers and counts.

**Fixed — the font setting never took effect**

- 🔍 **Root cause**: the 12 `--dsw-font-markdown-*` tokens were written into a `<style>` tag at head index **4**, while the official theme's `gradient-shadow-text.css` (declaring the same tokens on `body{}`) sits at index **24**. Identical selector and specificity, so the later official rule wins — **all four font presets read back byte-identical token values**, and CDP reported `Segoe UI + Microsoft YaHei` for every one of them. The picker was never broken and the fonts were never missing (HarmonyOS Sans SC, Microsoft YaHei, Noto Sans SC, Georgia, SimSun, Consolas and Courier New all resolve on this machine).
- ✅ **Fix**: the family is applied as **inline custom properties** on `<body>` / `<html>` (order-independent, removed exactly on dispose), and the token sizes now reference the product's own `--dsh-content-font-size` / `--dsh-content-font-delta` instead of hardcoded px.
- 🎯 Measured after the fix: `serif` → token `Georgia...`, CDP renders `Georgia` (10 glyphs) + `SimSun` (4); `yahei` with scope **Whole UI** → UI elements render `Microsoft YaHei`; `default` → no override left at all.
- 🧩 **Coverage closed**: the plugin now writes **all 12** `--dsw-font-markdown-*` tokens DSH 0.1.5 actually consumes, including the three the old code missed — `-table-head`, `-code-block-small`, `-code-font-family`. The other 90 declarations are never consumed; leaving them alone is free. Code blocks follow a monospace pick and stay on the product's code stack under a prose pick.
- ➕ New **font scope** (chat prose / whole UI) and a **missing-font hint** (two-baseline canvas width-diff; `document.fonts.check` returns true for unknown families and is unusable here).

**Removed / simplified (absorbed by DSH 0.1.5 or already dead)**

- 🗑️ The **`html.enhc-panel-open` seat mechanism** and the whole better-sidebar toggle-cluster seat are gone. Measured: better-sidebar 0.19.1's 192-key CSS-module map has **no** `toggleCluster` / `panelHidden` / `panelResize`, and it no longer publishes `--dsh-sidebar-width` (it publishes `--dsh-title-bar-strip` / `--dsh-sidebar-height`). Keeping the code was worse than dead: `panelOpen` was permanently `true`, so the "compact floating seat" became the default shape — the design running backwards, silently.
- 🗑️ Dropped the `[data-input-scroll]` and user-bubble font-size overrides: the product already sizes both from `--dsh-content-font-size`, and our overrides froze the official row on those two surfaces (measured line-height `21px` to `24px` after removal).
- 🗑️ The content-size row itself is retired in favour of the product's `FontSizeRow` (12-17px, `ui-theme` namespace): this plugin now consumes that channel instead of racing it for the same tokens. **Kept** because the product has nothing equivalent: the chat-width row, and the font family + scope (the product's `--dsw-font-family` is a fixed `:root` value with no user setting).
- 🧹 The rounded center-column card is now material-variable driven (`--enhc-solid-fill`) so glass themes keep their surface.

**Reproduce**

- Rendered-level probe: `node scripts/probes/plugin-eco/probe-harmony.mjs http://127.0.0.1:19387 out.json` (`scripts/lib/auth.mjs` mints a browser-session cookie from the persisted secret, so it passes the UI gate without the one-time launch token and without disturbing the running session).
- Every number, method and caveat: `docs/MEASUREMENTS.md`.

### v0.8.4 (unreleased, pending acceptance)

**Compatibility — DSH 0.1.5 client-structure alignment:**

- 🧭 Center-column lookup rewritten (the one hard break): 0.1.5 moved the conversation from the root child slot `conversation` to a keyed `main` entry declaring `main.conversation`, and both anchors render with `display:contents`, so the old `slot.parentElement` returned an unmeasurable wrapper. `findCenterColumn()` now accepts either anchor and resolves the real column with `closest('[class$="_centerCol"]')`; the parent walk stays as a fallback. The rounded-card CSS `:has()` guard accepts both spellings.
- 🔌 Types and packaging follow the official layout: `@deepseek-ai/dsh-client-runtime` was retired in 0.1.5, so the client context type comes from `@deepseek-ai/cordis` and the package was dropped from peer/dev dependencies and the tsdown platform table.
- 🔍 Audit conclusion (everything else survived, no code change): `conversation.session.header > header`, `_titleCluster` / `_headerActions` / `_tabs` / `_viewArea` / `_composerSeat`, the sidebar family, the settings quartet and the menu primitives all still exist; `_flowItem` / `_bubble` moved to the new `dsh-client-ui-chat` package with new hashes, which suffix selectors ignore.
- ✅ Measured: in a 0.1.5-rc.2 isolated instance (own DSH_HOME, own profile, port 3081) the rounded-card overlay geometry is correct under `main.conversation` (`left=56px / width=694px`), with no uncaught exception and no slot error.
- 🎛️ Top bar (2026-09-13): the conversation/trajectory tabs go back to the official underline style (the custom capsule overlay is deleted, and the `margin-top:10px` that made the tabs sit low inside the title row is zeroed); the header's right-side reserved band for a floating better-sidebar cluster is removed, because 0.19 registers its controls into the product's own header seat and no longer publishes that variable.
- 📌 Known follow-ups: `_flowItem` hash changes are cosmetic only; the `.nArs4W_*` rules (better-sidebar 0.14 class names) were already dead under 0.19.1 and have since been removed in 0.9.0.

### v0.8.3 (unreleased, pending acceptance)

**Perf — the sidebar squeeze keeps its smooth progressive glide at full frame rate (companion to dsh-widgets v1.2.3):**

- Root cause of the panel-toggle jank: the three squeezed surfaces (conversation `viewArea`, `composerSeat`, header) animate `margin-right: var(--dsh-sidebar-width)` over 0.3s — a per-frame reflow of the WHOLE conversation DOM — which on long sessions (thousands of nodes) dropped to 20–31% dropped frames and visibly desynced from the compositor-driven widget rail and panel slide.
- Fix: keep the progressive margin animation exactly as-is (left edge pinned, right edge gliding, text reflowing progressively — no "jump to final width, then slide" compromise) and make each per-frame reflow cheap instead: every conversation turn/step (`*_flowItem`) now gets `content-visibility: auto` + `contain-intrinsic-size: auto 120px`, so off-screen items skip layout entirely and each animation frame reflows only the handful of visible items. `auto` lets the browser remember each item's last rendered height, so scrollbar height stays stable; browsers without support simply ignore the rule.
- Measured (playwright + local Edge, widget rail open, heavy sessions, panel open/close window): dropped frames **20–31% → 11.5% (rail fix) → 0%**; viewArea LEFT edge drift during the animation: **0 px** (always aligned); rail↔conversation right-edge offset constant (std 0.01 px — perfect lockstep); scrollHeight after a jump-to-bottom: 0% shift (intrinsic sizes converge); once warm, the largest single-frame step is ~89 px — a mid-curve frame under headless software rendering, smaller on real GPUs. Known one-off: the FIRST panel open after a page load still has one large step (better-sidebar's first panel render long-task, unrelated to this change).
- Self-contained verification: `scripts/archive/dead-probes/verify-glide.cjs` (`npm i -D playwright-core && node scripts/archive/dead-probes/verify-glide.cjs [session]`).

### v0.8.2 — released

**Feature (i18n — Chinese/English locale adaptation):**
- All hardcoded Chinese UI strings in Settings → General now adapt to the browser locale: page header title/description, five setting row titles/descriptions, and font preset labels all render in English when the locale is not `zh-*`.
- New `src/client/i18n.ts` module centralizes every user-facing string; language detection is **responsive** — re-evaluated on every render call, so switching Settings → Language takes effect immediately without a page reload.
- Detection priority: `localStorage('dsh-language')` (written by the official Settings panel) → `<html lang="...">` attribute → `navigator.language` fallback.
- The `KNOWN_TITLES` fallback table (used by the settings-section title-inject logic for third-party pages without a heading) is now locale-aware, matching both Chinese and English intro prefixes, and re-evaluated on each call so language switches take effect for injected titles too.
- No visual or behavioral change in Chinese locales; English locales now see fully translated labels instead of a mix of Chinese and English.

### v0.8.1 — released (2026-08-27)

**Fix (cross-plugin width hygiene — @omdsh-dev/dsh-genui render_ui panels & tool cards):**
- **Root cause** — the fold bar's `.panelToggle` title span (long nowrap text such as "opencode-go Multi-key Mini Pool — Final Architecture") is a flex child missing `min-width:0`; flex default `min-width:auto` refuses to shrink, so the title's max-content width inflates the fold bar and the whole panel beyond the conversation column. Harmonizer adds a hash-agnostic `flex: 1 1 0%; min-width: 0` shrink baseline (so ellipsis engages) and caps the panel/fold bar width; the same family is covered for `.toolFallbackMeta` (tool fallback long meta) and `.tlTime` (timeline long timestamps). Pure CSS overrides, zero modification of dsh-genui source; the rules survive upstream CSS-module rebuilds (class-substring matching).
- **Final baseline (user acceptance criteria, settled)** — panel/tool width follows the **conversation content width**, i.e. the harmonizer chat column max-width slider's `--enhancer-content-width` (currently 840px), matching the official `Md3f7G_column` conversation-content column — not the input box and not the outer composer seat. Final rule: `[data-genui-panel]{ display:block; width:100% !important; max-width: var(--enhancer-content-width, 748px) !important; margin:10px auto 2px !important; contain:inline-size; box-sizing:border-box }` — adapts live to the chat-width slider and centers horizontally in the conversation column. The earlier "measured input-box width via `--enhc-message-maxw`" approach was dropped (baseline drift). Lesson: `width:auto` + `margin:auto` triggers shrink-to-fit on a flex cross axis and collapses the panel into a vertical sliver (regression); always pair an explicit `width:100%` with a max-width instead.
- **Horizontal spacing for full-width blocks** — `banner` reuses the fold bar's width format: content width with 16px side insets (text starts at the same x as the panelToggle title), never a negative-margin box expansion (which pushed padding past the card edge), in every container (panel body / inline / tool card); `steps` gets 16px side padding inside padding-less inline/tool-card containers; svg/pre/canvas/img/mermaid are all width-guarded; block components (callout/card/list) keep their own shape untouched.

### v0.8.0 — released

**Feature (native-title tooltip harmonizer):**
- Any element that only carries the raw HTML `title` attribute (the model selector trigger, assorted product controls) used to pop the OS-native tooltip and break the visual language kept by every surface routed through the official Tooltip primitive. Hover/focus is now intercepted: the title is lifted for the interaction and re-rendered as the official bubble — `--dsw-alias-tooltip-bg` chip, padding 3px 7px, radius 8px, 13px/20px type, 50vw width cap, 500ms hover delay, immediate on keyboard focus, placed 8px below the anchor (flips above when clipped), clamped to a 12px viewport margin, z-index 100 popup band.
- Rollback safety: an ancestor carrying `data-enhc-no-tooltip` opts a subtree out; the lifted attribute is restored verbatim on leave/blur/plugin stop (if the app rewrote the title mid-hover, its newer value wins); the fade-in respects reduced motion.

**Fix (toggle cluster seat):**
- The floating better-sidebar toggle cluster got an opaque seat in `bg-base`. Default (panel closed): a whole-height block spanning the session header band (top 0 → 56px), so buttons/seat/header read as one flush right edge and widgets-rail cards can no longer show through. While a better-sidebar right panel is open (`html.enhc-panel-open`, kept in sync by the client half) the seat collapses back to a compact floating chip, because the panel's top edge deliberately sits below the page top and a tall seat would jut into it.

**Fix (rounded card wraps the session header):**
- The AppFrame's shell.overlay outlet is itself a z-20 stacking context, so the card chrome painted inside it can never out-draw the z-21 session header. Zero-pixel split-paint model (no white slab anywhere): the HEADER draws the card's top edge as an INSET box-shadow hairline (a real border-top grew the header by 1px and misaligned it against out-of-flow controls) plus the 18px top-left radius, while the overlay box demotes to a pure shadow caster spanning header + content with a custom left/top-emphasized recipe — official lv3 offsets down-right and its tight contact halo painted a stray edge line along the window. Routes without a session header fall back to the classic self-drawn card. Hover/active fills ride above the seat; the seat carries a continuation of the header's top line so the edge reads unbroken across the full card width.

### v0.7.1 (folded into v0.8.0)
**Fix (better-sidebar Files tab strip):**
- 📏 Tabs now FILL the 44px tab bar: the previous fixed `height: 36px` broke better-sidebar's native `align-items: stretch` chain, leaving ~8px of dead space at the strip's bottom. Reverted to `height: auto` + explicit `align-self: stretch` — the 14px label and icons stay vertically centered inside the taller strip.
- ↔️ The open right panel's tab strip now reserves 90px on its right end (was 72px): the toggle cluster got bigger (two 32px capsules + 6px gap at `right: 12px` = 82px total), so the old seat let the rightmost tab / + button slide under the capsules. 90px = 82px cluster + 8px breathing room. The bottom panel's 40px seat is untouched.
- 🧭 The session header's shared right margin bumped 82px → 90px to match the wider cluster (covers both the collapsed corner seat and the open-panel `max()` path).

**Fix (dark-mode active-state glyphs):**
- ⚪ The active "Chat" tab now renders WHITE glyphs on the DeepSeek brand-blue fill in dark mode. It had used `--dsw-alias-label-primary-inverted`, which resolves to a near-black bluish-800 on dark themes — black text on the blue fill.
- ⚪ The activated "Components" capsule keeps its own shipped pair (`state-business-primary` + `#fff`): an earlier override in this plugin had replaced that white with the same near-black token (dark-mode only). That override is dropped, so both buttons read as blue fill + white glyphs in light AND dark themes, matching the official nav-cell pattern.

### v0.7.0
**Meta — renamed package to `dsh-ui-harmonizer`:**
- 📦 npm package renamed `harness-ui-enhancer` → `dsh-ui-harmonizer` (dsh- prefix + "harmonizer" naming matches the ecosystem norm and search; old package deprecated, redirects here).
- 🎯 Positioning: "UI harmonizer for DeepSeek Harness" — normalize/reconcile/unify the UI into the official design language (not just polish).
- 🔀 GitHub repo renamed `Physicolor/harness-ui-enhancer` → `Physicolor/dsh-ui-harmonizer` (old URL auto-redirects; stars/issues preserved).
- ♻️ Install: `dsh plugin --profile web add dsh-ui-harmonizer`. No data impact (client-only plugin, no persisted keys).

### v0.6.3
**Meta:**
- 🏷️ Added npm `keywords` (deepseek-harness / dsh / cordis / plugin / web-ui / ui-enhancement) so the package shows up in npm search; no code change.
- 🪧 GitHub repo topics expanded (deepseek-harness, cordis, cordis-plugin, browser-extension, web-ui, ui-enhancement, plugins).

### v0.6.2
**Fix:**
- 🧱 The session header now has an opaque card surface (`--dsw-alias-bg-base`) and sits one step above the shell's overlay layer (`z-index: 21`, still below better-sidebar's panels at 40 and modals): the dsh-widgets rail and its magnify overlay slide UNDER the header's white rectangle instead of visually stacking onto the header buttons. Header rules stay in the enhancer (the widgets plugin no longer touches official elements).

### v0.6.1
**Fix:**
- 🧩 The big empty gap between the chat/input and the right sidebar when it opens: fixed the double-squeeze on the conversation's `margin-right`. The `#root` neutralization previously cleared only `margin-right`, leaving better-sidebar's `width: calc(100% - var(--dsh-sidebar-width))` active — the width squeeze first narrowed the column to the panel's left edge, then the viewArea/composerSeat margin squeezed a second time, pushing the conversation one full panel-width short of the panel. Added `width: 100%` to fully neutralize `#root`, so the inner margin is now the single, correct squeeze (the chat's right edge meets the panel's left edge, minus the 8px scrollbar gutter).

### v0.6.0
**Removed:**
- 🗑️ Removed MCP server management and task automation — these weren't "UI polish" concerns, so they were removed wholesale (the host-half API routes are gone; the plugin is a pure client with zero host logic). The MCP / automation buttons no longer appear at the bottom-left.

**New:**
- 🃏 Rounded card: the conversation area renders as a card with a rounded top-left corner and a drop shadow (Settings → General → UI Customization → rounded card). No source changes: a transparent `shell.overlay` cover (top border + top-left radius + `--dsw-shadow-lv3` shadow); the shadow bleeds left into the sidebar (card thickness), the top moves down 1px for the shadow gap; right/bottom are natural window edges with no drawn border; the left edge borrows the sidebar's own `border-right`; a `ResizeObserver` tracks the center column so it follows sidebar drags / collapse / details-column changes; the content's top-left is masked round by the center column's own `border-radius`; pure CSS gating (`html.enhc-center-card-on`), togglable and residue-free.

**Fix:**
- 🎚️ Live feedback for the customization toggles: the rounded-card switch uses a local mirrored state so the thumb slides and the swatch flips instantly, without waiting for a re-render.

### v0.4.1
- 🎯 better-sidebar toggle buttons relocated into the header utilities area (CSS floating alignment);
- 📐 header shares width via `max()`: gives 80px to the toggle cluster when the sidebar is closed, follows the sidebar width when open;
- 🎬 smooth transition on the header's `margin-right`;
- 📏 better-sidebar tab bar raised to 44px with proportionally scaled internals;
- 🔧 updated better-sidebar hash prefix `W-zNGW` → `nArs4W`;
- 📐 panel top positioned at `top: 6px`.

### v0.4.0
- 🔌 MCP server management panel;
- ⏰ task automation scheduling (periodic / interval / one-shot);
- 💬 prompt input reuses the chat style;
- 🎨 dialog blur + smooth animation;
- Improved: MCP/automation dialogs drop the left nav; one-shot runs pick a future time.

### v0.3.0
- Settings auto-normalizer launched;
- better-sidebar / dsh-widgets visual coordination;
- single-line header;
- light/dark adaptivity.

### v0.2.0
- Adjustable chat width, font size, UI font;
- workspace font scaling.

### v0.1.0
- Initial release.

---

## License

[MIT](LICENSE)
