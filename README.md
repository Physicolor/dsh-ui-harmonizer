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

- **Zero model cost**: the host (node) half is a no-op; all changes happen in the browser half;
- **Official design tokens**: all styles use the `--dsw-*` semantic tokens and follow light/dark themes automatically;
- **Two injection channels**: static rules (CSS Modules) + dynamic `<style data-plugin>` tags;
- **Reversible cleanup**: fiber-effect disposers manage every side effect — uninstalling restores everything;
- **Slot integration**: `settings.general.item` / `settings.section` / `shell.overlay` (rounded-card overlay).

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

### v0.8.1 — released (2026-08-27)

**Fix (cross-plugin width hygiene — @omdsh-dev/dsh-genui render_ui panels & tool cards):**
- **Root cause** — the fold bar's `.panelToggle` title span (long nowrap text such as "opencode-go 多 Key 迷你池 — 最终架构") is a flex child missing `min-width:0`; flex default `min-width:auto` refuses to shrink, so the title's max-content width inflates the fold bar and the whole panel beyond the conversation column. Harmonizer adds a hash-agnostic `flex: 1 1 0%; min-width: 0` shrink baseline (so ellipsis engages) and caps the panel/fold bar width; the same family is covered for `.toolFallbackMeta` (tool fallback long meta) and `.tlTime` (timeline long timestamps). Pure CSS overrides, zero modification of dsh-genui source; the rules survive upstream CSS-module rebuilds (class-substring matching).
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
- ⚪ The active "对话" tab now renders WHITE glyphs on the DeepSeek brand-blue fill in dark mode. It had used `--dsw-alias-label-primary-inverted`, which resolves to a near-black bluish-800 on dark themes — black text on the blue fill.
- ⚪ The activated "组件" capsule keeps its own shipped pair (`state-business-primary` + `#fff`): an earlier override in this plugin had replaced that white with the same near-black token (dark-mode only). That override is dropped, so both buttons read as blue fill + white glyphs in light AND dark themes, matching the official nav-cell pattern.

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
