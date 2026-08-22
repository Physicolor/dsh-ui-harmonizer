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

### ♻️ Plugin Visual Reconciliation

| Target | Approach |
| --- | --- |
| `dsh-better-sidebar` | Capsule-ize toggle buttons, unify panel backgrounds, coordinate layout, smooth transitions |
| `dsh-widgets` | Matching stat capsule family, header utilities alignment |
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
- **Phase 3 · Unified visual style** (in progress): an optional style layer — the "rounded card" is live (rounded top-left + shadow); next: spacing density, more radius/animation unification;
- **Phase 4 · Ecosystem**: crystallize into an extensible rule-registration mechanism.

---

## Changelog

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
