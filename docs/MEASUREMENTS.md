# Harmony Measurements — 0.9.0 baseline vs after

Every number here came from a script in this repo running against the live
DeepSeek Harness UI on this machine (DSH `0.1.5-rc.2`, better-sidebar `0.19.1`,
dsh-widgets `1.5.0`). Nothing is estimated.

- Probe: `scripts/probes/plugin-eco/probe-harmony.mjs` (+ `scripts/lib/auth.mjs`)
- Raw JSON: `D:/dsh-home/probe-ui/harmony-probe.json` (before),
  `harmony-views.json` (before, multi-view), `harmony-v090c.json` (after)
- Re-run: `node scripts/probes/plugin-eco/probe-harmony.mjs http://127.0.0.1:19387 out.json`

## How the probe gets in

The web UI is gated by a cookie signed with a secret persisted in
`<DSH_HOME>/.credentials.yaml` (`client-connection/browser-session`). The launch
`?token=` lives only in the server process's memory, so a headless browser cannot
obtain it — a plain `goto` returns the 401 text page
`dsh web authentication required`. `scripts/lib/auth.mjs` reproduces the cookie
(`v1.<base64url payload>.<hmac-sha256>`, name `dsh-auth-<sha256(authority)>`),
which authenticates the probe without touching the user's session, restarting
anything, or reading the token. Measurements then come from `page.evaluate`
(DOM/CSSOM), CDP `CSS.getPlatformFontsForNode` (the font that actually rendered)
and canvas width-diff (whether a family is installed).

## 1. Why the font setting never worked (root cause)

| # | Measurement | Before (0.8.4) |
| --- | --- | --- |
| 1 | `<style>` tags in `document.head` | 129 total. **Ours (dynamic) at index 4**; the theme's `gradient-shadow-text.css`, which declares all `--dsw-font-markdown-*`, at **index 24** |
| 2 | Where the tokens are declared | Both on `body{}` → identical specificity, so the **later tag wins**: the theme's |
| 3 | 4 font passes (`default`/`serif`/`mono`/`yahei`) → computed `--dsw-font-markdown-base` | **byte-identical** in all four: `14px / calc(24px + calc(14px - 14px)) -apple-system, …` |
| 4 | CDP platform fonts for an element using `font: var(--dsw-font-markdown-base)` | `Segoe UI` (10 glyphs) + `Microsoft YaHei` (4) in all four passes |
| 5 | Composer `[data-input-scroll]` computed font | `14px / 21px …` — our `--enhancer-font-line`, i.e. our rule **did** win there and froze the composer |
| 6 | Font availability (canvas, two baselines) | installed: HarmonyOS Sans SC, Microsoft YaHei, Noto Sans SC, Georgia, Times New Roman, SimSun, Consolas, Courier New. Missing: HarmonyOS Sans, PingFang SC, Songti SC, JetBrains Mono, SF Mono |

Conclusion: the picker wrote the right state (`fontId` persisted correctly) and
the family was available for the presets the user tried — the **cascade** ate it,
because a later equal-specificity `body{}` rule from the theme re-declared the
same 12 tokens. `document.fonts.check` was a red herring: it reports `true` for
unknown families, which is why the first probe attempt (mono baseline only) also
mis-reported Consolas as missing.

### After (0.9.0)

| Pass | stored state | computed token | CDP rendered font |
| --- | --- | --- | --- |
| stored (`yahei`/content) | `{fontId:'yahei', fontScope:'content'}` | `400 var(--dsh-content-font-size,14px)/calc(24px + …) 'Microsoft YaHei', …` | `Microsoft YaHei` (14) |
| `serif`/content | `{fontId:'serif'}` | `… Georgia, 'Times New Roman', …` | `Georgia` (10) + `SimSun` (4) |
| `yahei`/ui | `{fontId:'yahei', fontScope:'ui'}` | prose as above **and** `--dsw-font-family` overridden | prose `Microsoft YaHei` (14); UI element `Microsoft YaHei` (14) |
| `mono`/content | `{fontId:'mono'}` | `'JetBrains Mono','SF Mono',Consolas,'Courier New',monospace` | prose **and** code both `Consolas` (10) — the code family follows a mono pick, and stays on the product's code stack for prose picks |
| `default` | `{fontId:'default'}` | no override at all; inline body style is only the product's `--dsh-content-font-size` | `Segoe UI` + `Microsoft YaHei` (pure product) |

Mechanism change: the family is written as **inline custom properties** on
`<body>` / `<html>`, which are order-independent, and every size in the tokens
now references the product's own `--dsh-content-font-size` /
`--dsh-content-font-delta` instead of a hardcoded px, so the product's content-size
row keeps working. Composer line-height moved `21px → 24px` (product value),
i.e. the plugin stopped overriding a surface the product owns.

Completeness: the tokens we now write cover **all 12** `--dsw-font-markdown-*`
tokens the 0.1.5 bundles actually consume with `var()`, including the three the
old code missed — `-table-head` (markdown `th`), `-code-block-small`
(ui-chat/ui-cordis/ui-skill/ui-tool panels), `-code-font-family` (`_slashChat`).
The other 90 declarations in the theme are never consumed, so leaving them alone
costs nothing visible.

## 2. The panel-state bug, measured

| Probe | Value |
| --- | --- |
| `.nArs4W_panel` nodes (right panel closed) | 0 — the panel **unmounts** when hidden |
| `.nArs4W_bottomPanel` nodes | 1, class `nArs4W_bottomPanel nArs4W_bottomPanelHidden`, computed `display: flex` (hidden is class-only, node stays mounted) |
| `.nArs4W_toggleButton` nodes | 0 on the hero view (the cluster only exists with a session header) |
| `[class$='_toggleCluster']`, `.nArs4W_panelResize`, `.nArs4W_panelHidden` | 0 matches each — and 0 keys in better-sidebar 0.19.1's 192-entry CSS-module map |
| `--dsh-sidebar-width` | unset (better-sidebar 0.19.1 publishes `--dsh-title-bar-strip` / `--dsh-sidebar-height`) |

So the predicate `classList.contains('nArs4W_panelHidden')` is permanently
`true`, and only the guard `if (!panel || !bottom || buttons.length < 2)` kept
`html.enhc-panel-open` off in the state probed. Removed in 0.9.0 along with the
seat CSS it drove (5 rules) — the surface it styled does not exist.

## 3. Dead-rule inventory (the Doctor's first check)

A selector is counted only when it matches nothing in **every view observed**;
per-view counts are meaningless (the hero screen has no settings section).

| | Before (0.8.4) | After (0.9.0) |
| --- | --- | --- |
| Selectors evaluated | 136 | 149 |
| Views observed | hero, settings-general (2) | hero, settings-general, doctor, **session**, glass-simulated, glass-restored (6) |
| Matched in ≥1 view | 37 (27.2%) | **64 (43.0%)** |
| Dead in every view | 99 (72.8%) | **85 (57.0%)** |

The session view was the hardest and the most informative: in 0.1.5 the workspace
tree renders projects as `*_projectRow` and sessions as `*_sessionRow`, and the
currently selected one is the "new session" placeholder — so a naive click
(which is what the first attempt did) just reselects the placeholder four times
and also collapses the sidebar, destroying the measurement for every view that
runs afterwards. The working sequence is: expand a `*_projectRow`, then click a
`*_sessionRow` whose label is not the placeholder. The session view matches 57/149
selectors on its own — 11 more than any other view — and is the only view where
`tabsInTitleCluster` and `tabsAnywhere` are both `true`, which independently
confirms the plugin's tab-relocation effect actually runs in a live session.

`85` is now a measurement over six views rather than an upper bound, but it is
still bounded by what a headless probe can open (hovers, open menus, dialogs and
dragged sidebars are not exercised), so the Doctor's cross-view ledger remains the
mechanism that keeps the verdict honest — verified working in the real UI (§4c).

The audit also caught its own first-run false positive: splitting `selectorText`
on every comma tore `:has(> [data-slot='main'], > [data-slot='conversation'])`
into a fragment that matched nothing. `splitSelectors()` now splits on top-level
commas only.

## 4. Contract variables published (after)

Read from `<html>` in every view (7 view passes: hero, settings-general, doctor,
glass-simulated, glass-restored, session):

```
--enhc-contract: 1.0
--enhc-glass-aware: 0
--enhc-surface-solid: 1
--enhc-solid-fill: #fff          (literal, see below)
--enhc-content-width: 748px
```

First implementation published `--enhc-solid-fill: var(--dsw-alias-bg-base)` and
it read back **empty**: the theme declares that alias on `body`, so a `var()`
stored on `<html>` is invalid at computed-value time. The runtime now resolves
the literal colour (on the theme event and on a 2 s poll).

## 4b. Glass coexistence — measured by simulation, not by installing a theme

The probe overrides the same semantic tokens a glass theme replaces
(`ctx.theme.overrideTokens` in `dsh-theme-liquid-glass` swaps `--dsw-alias-*` for
translucent values), waits one material-poll cycle, and then removes the tag:

| View | `--dsw-alias-bg-base` | `--enhc-glass-aware` | `--enhc-surface-solid` | `--enhc-solid-fill` | session header `background-color` |
| --- | --- | --- | --- | --- | --- |
| hero / settings / session / doctor | `#fff` | `0` | `1` | `#fff` | `rgb(255, 255, 255)` |
| **glass-simulated** | `rgba(255,255,255,0.45)` | **`1`** | **`0`** | **`transparent`** | **`rgba(0, 0, 0, 0)`** |
| **glass-restored** | `#fff` | **`0`** | `1` | `#fff` | `rgb(255, 255, 255)` |

Before 0.9.0 the header rule painted `--dsw-alias-bg-base` unconditionally, so
under a glass theme it produced a see-through rectangle with no backdrop-filter
("a hole in the glass"). It now yields the fill entirely and restores it when the
material goes back to opaque — verified reversible in the same run.

## 4c. Doctor page, end-to-end in the real UI

The probe opens Settings, clicks the plugin's own nav cell, presses **Run check**
and reads the rendered page:

```
navClicked: true   ran: true   opened: true
stats: 33/148 规则命中 · 0 dead in every view · 1 views observed · 39 跨插件耦合 · solid 材质状态
blocks: 规则命中 — dead in every observed view / 跨插件耦合 / 冲突与冗余 / 表面占用
rows: 90
```

"0 dead in every view" is correct on a fresh ledger: the verdict requires **two**
observed views by construction, which is why the button reports "1 views observed"
in the same row. "39 foreign couplings" is the plugin's own coupling debt,
enumerated automatically.


## 5. Unrelated finding

The page issues `GET /api/chat-timeline-index?sessionId=…&sinceSeq=-1` five times
per load and always gets **404**. No shipped harmonizer half serves it (this
plugin has no host half), so one installed plugin is calling an endpoint that no
longer exists. Worth reporting to whichever plugin owns it.

## 2026-09-30 settings headers, row popup width, stylesheet keeper

Environment: live DSH web profile (web2, DSH 0.2.0-rc.2) on this machine,
1560x960 viewport, plugins: dsh-widgets, dsh-usage-center, dsh-ui-harmonizer,
dsh-genui, dsh-notification, research-cordis, dshmarket, dsh-better-sidebar.
Raw JSON in `D:/dsh-home/probe-ui/settings-headers/`, `.../menu-anchor/`,
`.../style-keeper/`.

### Settings page headers — one recipe on every page

Probe: `node scripts/probes/settings/probe-settings-headers.mjs http://127.0.0.1:19387` (opens the
panel, walks all 11 nav items, records the section root, every title/description
candidate with computed typography, and a screenshot per page).

| Page | Title node after the reconciler | Intro node | Computed |
| --- | --- | --- | --- |
| 通用设置 | `h2.enhc-page-title` (React recipe) | `p.enhc-page-intro` | 18/26 600 · 13/20 + hairline |
| 模型 | `h2.zGbnIq_title.enhc-page-title` | `p.zGbnIq_intro.enhc-page-intro` | idem |
| Command Code | `h2.cc-title.enhc-page-title` | `p.cc-intro.enhc-page-intro` | idem (was 16/24 500, no hairline, never matched by the old `_title` suffix rules) |
| 内置插件 | `h2.pbvGtq_heading.enhc-page-title` | `p.pbvGtq_intro.enhc-page-intro` | idem |
| Agent 预设 | `h2.rtSEdW_title.enhc-page-title` | `p.rtSEdW_intro.enhc-page-intro` | idem |
| UI 兼容性 | `h2.enhc-page-title` (React recipe) | `p.enhc-page-intro` | idem |
| 插件市场 | `h2.nUhMVa_title.enhc-page-title` | `p...` (the market's own sub node) | idem |
| 通知 | `h2.dsh_notification_title.enhc-page-title` | `p.dsh_notification_subtitle.enhc-page-intro` | idem, head box adopted: parent `dsh_notification_heading.enhc-page-head`, weight reads back 400 (a first version stamped the small wrapper as the title and the description inherited 600 — caught by this probe) |
| 侧边卡片 | injected `h2.enhc-page-title` (label from the active nav item) | `p._2vuxea_intro.enhc-page-intro` | idem |

Structural facts the probe pins down:

- The official pages disagree with each other (models 16/500 + 14/22, agent
  presets 18/600 + 13/20) — the "official recipe" only exists after
  normalization, which is why one owner matters.
- A head box is adopted only when its children really are just the title and the
  description: the Agent-presets `rtSEdW_section` root (title + intro + two group
  blocks) must NOT be stamped, or the whole page's rhythm collapses to a 4px gap.
  Measured after the fix: `section.rtSEdW_section` carries no `enhc-page-head`.
- The `-8px` compression is conditional on the container gap: the reconciler
  flags `data-enhc-gap="tight"` only when `rowGap` is the official 12px.

### Row popup width

Probe: `node scripts/probes/menus/probe-menu-anchor.mjs http://127.0.0.1:19387`. The desktop
account menu itself is desktop-only (the account plugin registers into
`settings.launcher` and only runs with the preload bridge), so the mechanism is
driven with a fixture that reproduces the Menu primitive's mark-up — a
`width:100%` anchor inside the launcher seat plus a portalled `[role=menu]` card
in `<body>` — and checked against a negative control.

| Case | Row | Card | Inline style written |
| --- | --- | --- | --- |
| Fixture inside `settings.launcher` | 234px | 234px | `width/min-width/max-width: 234px; box-sizing: border-box` |
| Fixture outside the seat (composer) | 812px | 226px (own recipe) | none — no marker attribute |

`border-box` matters: without it the product's own 4px list padding made the card
8px wider than the row (measured 242px against a 234px row).

### Third-party stylesheet keeper

Probe: `node scripts/probes/plugin-eco/probe-style-keeper.mjs http://127.0.0.1:19387` — opens
Settings → 通知 and reproduces the loader's theft with its own semantics
(`setAttribute('data-plugin', thief)` + `remove()`).

| Step | `#dsh-notification-style` | `.dsh_notification_card` |
| --- | --- | --- |
| baseline | present, 38 rules | `1px` border, `12px` radius, `flex` |
| after the theft | absent | `0px`, `0px`, `block` (the reported "page not drawn") |
| after the grace period | restored, 38 rules | `1px`, `12px`, `flex` |

9/9 checks: baseline styled; the theft really removes the styles; the keeper
restores them; the card is styled again; no duplicate when the owner re-injects
first; bundler-emitted sheets (`data-plugin-css`) are left alone; an
already-claimed hand-written sheet (the state a long-running session is in) is kept
too; and its stolen `data-plugin` claim is not restored.

Root cause (product loader, verifiable in the shipped bundle): `claimStyles(id)`
adopts **every** `style:not([data-plugin])` in the document for the plugin
materializing at that moment, and `removeOwnedStyles(id)` deletes every
`style[data-plugin=id]` when that adopter reloads, unloads or is pruned
(`entries.js replace/reconcile/prune`).

### CSS hygiene

`src/client/enhancer.module.css` carried 48 mojibake characters in comments from
an old PowerShell `Get-Content -Raw` / `Set-Content` round trip (file re-encoded
as GBK: `—` → `鈥?`, `×` → `脳`, one Chinese phrase destroyed, and the byte after
each em dash — a space — replaced by the lossy placeholder). Repaired by
`scripts/archive/one-off-fixes/fix-css-mojibake.mjs` + `scripts/archive/one-off-fixes/fix-css-emdash-space.mjs` (Node, UTF-8
in/out). Comment-only damage; the build was never affected.

## 2026-09-30 (round 2) settings-header geometry: identical coordinates, official spacing

Probe: `node scripts/probes/settings/probe-header-geometry.mjs http://127.0.0.1:19387` — walks every
nav item and reports, per page, the title/description viewport boxes, the measured
distance between them, the container's own `gap` and `padding-top`, and the shape
of the header. It then repeats the measurement for the official pages with this
plugin's stylesheets disabled (`media="not all"`), which is the only way to read
the product's own numbers rather than our override of them.

**The product's own spacing (sheets disabled): 12px, on all three official pages**

| Page | title font | title→description | container gap |
| --- | --- | --- | --- |
| 模型 | 16/24 (500) | 12px | 12px |
| Agent 预设 | 18/26 (600, no line-height) | 12px | 12px |
| 内置插件 | 18/26 (600) | 12px | 12px |

This retracts the "official 4px title→description" claim of the older docs: 4px was
this plugin's own compression (a `-8px` bottom margin on the title against the
official 12px container gap).

**Before the fix (our CSS on): the distance was whatever the page's container did**

| Page | title y | title→description | container gap | header shape |
| --- | --- | --- | --- | --- |
| 通用设置 | 134 | 4px | 4px (our own wrapper) | `div.enhc-page-head` |
| 模型 | 134 | 12px | 12px | direct child |
| Command Code | 134 | **0px** | none (block flow) | direct child |
| 内置插件 | 134 | 12px | 12px | direct child |
| Agent 预设 | 134 | 12px | 12px | direct child |
| UI 兼容性 | 134 | 4px | 4px (our own wrapper) | `div.enhc-page-head` |
| 通知 | 134 | 4px | 2px (adopted head box) | `div.dsh_notification_heading` |
| 侧边卡片 | 134 | 16px | 16px | direct child |

**After the fix: one skeleton, one geometry**

`h2.enhc-page-title` + `p.enhc-page-intro` as siblings, no wrapper anywhere; the
reconciler measures the container (walking up through `display: contents` slot
outlets) and writes `margin-top = 12px − container gap` on the description, plus a
compensating negative `margin-top` on the title when the container contributes its
own `padding-top`/`border-top`.

| Page | title y | title→description | container gap (unchanged) |
| --- | --- | --- | --- |
| 通用设置 | 134 | 12px | none |
| 模型 | 134 | 12px | 12px |
| Command Code | 134 | 12px | none |
| 内置插件 | 134 | 12px | 12px |
| Agent 预设 | 134 | 12px | 12px |
| UI 兼容性 | 134 | 12px | 12px |
| 通知 | 134 | 12px | 2px |
| 侧边卡片 | 134 | 12px | 16px |

Every page reads `titleTopFromDialog = 54`, `title y = 134`, `intro y = 172`.
The containers still differ — the header no longer does.

Two defects the measurements caught while doing this, both now fixed and pinned by
the probe:

1. **A wrapper was mistaken for a title.** `[class$='_heading']` matches
   dsh-notification's `div.dsh_notification_heading`, the box AROUND the `<h2>`.
   Stamping it with 18/600 made the description inherit `font-weight: 600`
   (measured `13px/20px 400` → `13px/20px 600`). The title finder now only accepts
   a `_title`/`_heading` node that does not itself wrap a heading.
2. **The injected title was released in the same pass that created it.** The
   侧边卡片 page (whose title this plugin injects) lost its title entirely; a probe
   run showed the description with no heading above it. The release step now keeps a
   title created in the current pass.

## 2026-09-30 (round 3) session header: the slot moved and every header rule died

Probes: `node scripts/probes/header/probe-header-live.mjs http://127.0.0.1:19387` (header box,
computed metrics, divider on both channels, relocated tab strip), and
`node scripts/probes/plugin-eco/probe-dead-selectors.mjs` (every rule of our own stylesheet tested
against the live DOM — the sweep that found this).

**What the product changed.** `[data-slot='conversation.session.header']` is now
`display: contents` and hosts only the title row; the header is its **parent**,
inside `[data-slot='conversation.header']`. The product's own header recipe
(`ConversationRoot.module.css`):

```css
.header { min-height: 76px; padding: 10px 28px 0 20px; border-bottom: .5px solid var(--dsw-alias-border-l3) }
.header:where(:not(:has(.tabs))) { min-height: 0; padding-bottom: 10px }
```

i.e. 76px is the **two-row** shape (title row + tab strip). Because the client
half relocates the strip into the title row, `:has(.tabs)` stays true and the
single 28px row floated in a 76px band — the "too much space above and below",
with the product's own `border-bottom` left behind as the extra divider. Every
`…session.header] > header` rule (geometry, surface/z-index, `::after` kill, the
wrapped-card top edge, and the card-overlay's `wrapped` probe) matched nothing
from that moment on; a dead selector is not an error, so nothing reported it.

| | before | after |
| --- | --- | --- |
| header box (1280 wide) | 1280x**76** | 1280x**50** |
| computed padding | `10px 28px 0 20px` | `10px 28px 10px 20px` |
| computed min-height | `76px` | `0px` |
| border-bottom | `1px solid rgba(0,0,0,.12)` (0.5px l3) | `0px none` |
| title row | 65px → 28px row with 18.5px dead above/below | 30px → 11px |
| scroll body top | 76 | 50 |

**Why 50 and not a taste number.** The compact shape re-applies the product's
own single-row case — 10 (padding) + 30 (title-row min-height) + 10 = 50px — and
that happens to be the reference bar's measured height. Both user reference
crops carry the same 20-device-px glyph band as the DSH crop, so they share its
device scale (~1.48): in the Codex crop the text centre sits 37.5 device px above
the bar's bottom edge, i.e. a 75-device-px bar ≈ **50 CSS px** with the title
centred at 25px. Before: 33.5 CSS px below the text centre (76px band, title at
42.5px). The rule is guarded by `:has([class$='_titleCluster'] > [class$='_tabs'])`
so it only applies once the strip has actually been relocated; if that move ever
stops happening the product's native two-row geometry returns instead of being
squashed, and the blank/sessionless header (`min-height: 0; padding-bottom: 0`,
no tabs) is untouched.

**Verified afterwards:** header 50px with `border-bottom: 0px none`; tab strip
`76x26` at `y=12` inside the title cluster; the center-card toggle re-enters
`enhc-center-card-wrapped` (overlay `display: block`, 1280x959, shadow-only) —
that probe had been reading `false` forever, because it tested the same dead
selector.

**Still dead after this round** (same product release, different surfaces;
found by the sweep, not fixed here): `button[class$='_crumb']` /
`button[class$='_crumbCurrent']` (the crumb is a `span`, and the current one
carries two classes so `$=` cannot match it), `[class$='_newSessionLabel']` and
`[data-slot='sidebar'] [class$='_brand'] svg` (both nodes now carry a trailing
`_wide` modifier, so every `$=` suffix selector misses), and
`[data-slot='sidebar.workspaces'] [class$='_meta']` (the row markup changed
entirely — `[class*='_meta']` matches nothing anywhere). Substring (`*=`)
selectors match all of them except the last.

## 2026-10-20 the right-panel squeeze: the reservation's clock

Live GUI, desktop window 1721×1033 (CSS viewport 1707×1067), the report's session
(`插件代码排查与重构`), pinned summary open so the conversation carries a 300px
`padding-right` (`--dps-right-space`). Every sample below is one `requestAnimationFrame`
of a real toggle, taken from inside the page.

### Before — two reservations, two clocks

| t | track (middle) | `padding-right` | content box | transcript | composer |
| --- | --- | --- | --- | --- | --- |
| click | 1427 | 300 | 1120 | 466 / 748 | 450 / 780 |
| +159ms (track snapped) | 659 | 300 | **352** | 466 / **288** | 450 / **320** |
| +294ms (reservation landed) | 659 | 0 | 652 | 385 / 588 | 369 / 620 |
| settled | 659 | 0 | 652 | 312 / 588 | 296 / 620 |

The middle row is the report: the transcript collapses to 288px and hugs the
middle area's left edge (layout left 312 = sidebar 280 + the product's 16px
inset), then expands back. The covers hold only the left edge, so the width
collapse is painted.

Close is the mirror: the content box overshoots to 1420 before the reservation
returns, and the transcript goes `312 → 584 → 466`.

A/B attribution: pinning `--dps-right-space` (and the rail claim) to 0 before the
toggle removes the 288px frame entirely. Ordering attribution: the instant gate's
`transition-duration: 0.001s` on `_scrollBody` turns the late write into a step
(measured padding 300 → 0 between two adjacent frames).

### After — one clock (`verify-panel-squeeze.cjs`)

| direction | scroll box | transcript (left / width) |
| --- | --- | --- |
| open | 1425 → 1345 → 864 → 667 → 657 | 466/748 → 442/748 → 312/714 → 312/594 → 312/588 |
| close | 657 → 682 → 737 → 1070 → 1372 → 1425 | 312/588 → 312/603 → 312/637 → 412/640 → 466/748 |

Both monotone: the spare space is consumed first, then the width shrinks. The
reservation's first changed frame is the track's ±1 (measured track frame 4,
padding frame 5). The snap+cover path is untouched when nothing reserves
(`verify-frame-track.cjs`: 2 distinct track widths, covers on both directions,
rail drift 0.0px).

### Cost under load (`verify-panel-squeeze-perf.cjs`)

Headless Chromium on SwiftShader (software GPU), same session, one open per arm,
1800ms window, `longtask` observer:

| arm | frames | p50 gap | p95 gap | worst gap | worst long task | transcript nodes |
| --- | --- | --- | --- | --- | --- | --- |
| squeeze | 263 | 6ms | 6ms | 122ms | 122ms | 11,539 |
| snap (reservation pinned 0) | 248 | 6ms | 6ms | 84ms | 85ms | 11,539 |
| squeeze + flow cloned ×2 | 250 | 6ms | 6ms | 126ms | 126ms | 23,078 |
| squeeze + flow cloned ×4 | 178 | 6ms | 23ms | 228ms | 227ms | 46,156 |
| squeeze, CPU ×4 | 3 | 647ms | 1115ms | 1115ms | 1093ms | 11,539 |

Reading: up to ~23k transcript nodes the squeeze holds the snap path's profile
(p95 6ms); the price shows up at ~46k nodes as `p95 6 → 23ms` and a ~100ms
longer worst frame. At 4× CPU throttling the entire page (not the animation)
collapses to ~1.5 fps — that is the device floor.

Caveat: the headless page was also serving the author's streaming session, and
headless rAF is not vsync-capped, so `frames` is a relative indicator; the gaps
and long tasks are the meaningful columns.

## 2026-10-21 the reservation joins the snap (the eased-track squeeze is gone)

Live GUI (`http://127.0.0.1:49326`, the desktop app's own page), window
1707×1067, the report's session (`修复侧边栏动画卡顿问题`), pinned summary open
so the conversation carries a 300px `padding-right` (`--dps-right-space`). Every
row below is one `requestAnimationFrame` of a real toggle, sampled inside the
page; `t` is milliseconds from the click.

### The report

"Opening/closing the right sidebar, the middle column — transcript, composer, the
header's right-hand buttons — stutters, and starts later than the sidebar
itself." The 2026-10-20 build answered the *collapse* by easing the frame's track
whenever a reservation existed ("one clock"). That ease is `grid-template-columns`
on the AppFrame, i.e. a LAYOUT property: every frame of the 300ms re-lays out the
whole frame. The panel slides on its own compositor transform, so it keeps its
frame rate while the conversation does not.

### Before — the track eased (`squeezeOnOneClock`, removed)

One trace, six sampled frames (the probe samples per rAF; on that page a frame
was 40–170ms apart, which is why the `t` column has no more rows). It is a shape,
not a distribution.

| t (ms) | track | `padding-right` | transcript (left / width) | frames |
| --- | --- | --- | --- | --- |
| click | 1427 | 300px | 466 / 748 | 1 |
| +108 | 659 (commit landed) | 300px | 466 / 748 | 2 |
| +144 | easing | 287.4px | 456 / 748 | 3 |
| +178 | easing | 231.5px | 413 / 748 | 4 |
| +249 | easing | 73.4px | 312 / 703 | 5 |
| +418 | 659 | 0px | 312 / 588 | 6 |

Five frames in a 400ms window, every one of them a full-frame relayout, and the
width only starts moving after the reservation has been eaten (`+249ms`).

### After — the track snaps, the reservation settles in the same task

| t (ms) | track | `padding-right` | transcript (left / width) | composer (left / width) |
| --- | --- | --- | --- | --- |
| click | 1427 | 300px | 466 / 748 | 450 / 780 |
| commit frame | 659 (snapped) | **0px** | **466 / 588** | 450 / 620 |
| +1 frame | 659 | 0px | 427 / 588 | 411 / 620 |
| +2 frames | 659 | 0px | 400 / 588 | 384 / 620 |
| … | 659 | 0px | 341 → 334 → 323 → 318 → 315 → 313 → 312 | … → 296 |
| settled | 659 | 0px | 312 / 588 | 296 / 620 |

`verify-panel-squeeze.cjs` (rewritten, 21 checks): the reservation reaches 0 on
the track's own frame (frame 4 == frame 4) and the fallback hold reports *not
needed* — the owners published in the toggle's task; the transcript's width lands
in two values (`[748, 588]`); the panel's slide and the transcript, composer AND
header covers share one `startTime` (spread **0ms**; the number of samples
depends on how many frames the page delivers — 3 to 56 in the runs recorded);
every cover runs 300ms on `cubic-bezier(0.4, 0, 0.2, 1)`; close is the mirror
(`[588, 748]`, no overshoot, and the reservation comes back on the track's own
frame at 300px); a 9-click storm leaves no root attribute, no inline padding and
no page error.

Run-to-run here (same build, same session): open `p50 8–9ms / p95 50–96ms /
max 194–319ms`, close `p50 4–8ms / p95 40–82ms / max 188–298ms`. The old path on
the same page measured `p95 71ms / max 643ms` (open) and `p95 87ms / max 136ms`
(close). The max is the product's commit block, which both paths pay.

### Cost under load (`verify-panel-squeeze-perf.cjs`)

Headless Chromium on SwiftShader (software GPU), same session, 1800ms window per
toggle, `longtask` observer. The comparable arms run **3 reps** and the table
shows medians; `eased track (option off)` is the same page with the root class
removed, i.e. the previous shape, one variable.

| arm | reps | frames | p50 | p95 | max | >50ms | worst long task | layouts | layout ms | style ms | task ms | nodes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| reserve (snap) | 3 | 217 | 4ms | **13ms** | 295ms | 4 | 309ms | 237 | 98ms | 448ms | 1363ms | 5,985 |
| eased track (option off) | 3 | 188 | 4ms | 21ms | 210ms | 5 | 210ms | 206 | 90ms | 547ms | 1376ms | 6,039 |
| no reservation (pinned 0) | 3 | 232 | 4ms | 16ms | 210ms | 4 | 220ms | 252 | 103ms | 388ms | 1349ms | 6,039 |
| reserve + cloned flow ×2 | 1 | 192 | 4ms | 16ms | 393ms | 3 | 390ms | 215 | 135ms | 491ms | 1526ms | 12,078 |
| reserve + CPU ×4 | 1 | 2 | 1805ms | 1805ms | 1805ms | 2 | 1801ms | 17 | 242ms | 1751ms | 2385ms | 6,039 |
| reserve + cloned flow ×2 + CPU ×4 | 1 | 2 | 2634ms | 2634ms | 2634ms | 2 | 721ms | 22 | 541ms | 2493ms | 4222ms | 12,078 |

Reading: the *stable* result across runs is the shape, not the timing columns.
In every run of both builds the reservation lands on the track's own frame, no
frame paints a collapsed transcript, and the covers start with the panel. What the
change removes is structural and visible in the code path, not in a p95: the
300ms `grid-template-columns` ease is gone, so the 11k-node transcript is no longer
re-laid out per frame — its cover is a composited `transform`, and the only
per-frame layout left is inside the composer capsule and the header (a few dozen
nodes each).

The frame-gap columns of this table are noise-dominated on this machine, and a
later same-day rerun of the same script shows why they must not be read as a
delta: `reserve p95 17 / max 290 / layout 115ms / style 560ms` against
`eased p95 13 / max 176 / layout 102ms / style 531ms` — the opposite sign to the
`p95` and `style ms` rows above. The only column that moved the same way in all
recorded runs is the number of frames over 50ms (reserve 2–4, eased 5–6). Treat
each row as one run of that arm.

What is left of the cost is ONE commit block (`max ~295ms` here, the product's own
relayout of the frame), which the eased arm spreads over the animation instead of
paying up front. At 4× CPU throttling the whole page — not the animation — is
frame-starved, which is the device floor. `LayoutCount` is not comparable between
arms: the snap path spends many *small* layouts (header width + composer `left`
covers), the eased path a few *huge* ones.

Caveat: the headless page is also serving the live session (the node count grew
between runs), so a single toggle's p95 can swing by 3× — that is why the
comparable arms are 3-rep medians, and why even those are quoted with the reverse
run rather than as a delta.

## 2026-10-21 (later) the two visual reports

### Close: glides right, then jumps back

Mechanism, reproduced by construction rather than by luck: on close the track
snaps wide while the reservation is still `0`, so the content box is the full
track and the centred transcript's layout sits at the **no-reservation centre**
(measured on this page: `616px` instead of `466px`). The cover seeds from that
layout and glides there; when the owner finally publishes its value the layout
moves again, but the cover has already ended — so the painted box jumps back.
The fix is the mirror of the open-direction hold: the close now holds the last
non-zero reservation it saw (0 for a reservation-less close), written inline
`!important` and probed per frame (`remove -> read -> restore`, all inside one
rAF, so no frame can paint the stale value). `verify-panel-squeeze.cjs` prints
whether it fired: on this page it is **"not needed"** in both directions — the
owners publish inside the toggle's own task — which is also why the jump was not
reproducible here without an owner that goes silent.

### Open: a grey strip appears before the panel does

The open animation is a compositor `transform` on the dock, and the column is
allocated at its final width in the first frame. Measured at 150ms (animations
paused): the column starts at `939px`, the dock's left edge is at `1111px`, and
the 172px between them paints the frame's background — on a theme where that is
not the panel's surface, that strip is the reported grey block. The column is now
painted with the panel's own surface for the duration of the open (`read from the
dock's first painted descendant`, removed with the toggle), so the strip reads as
part of the panel instead of a hole.




