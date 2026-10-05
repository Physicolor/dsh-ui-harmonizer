# Dialog & Window Shell Design Spec

Consume this when you ship a **modal window** in the client UI (a frame-wide overlay panel, a settings-like window, a confirmation dialog), so its shell reads as the same object as the official Settings window and its dialogs, and composes cleanly with everything behind the mask.

Authoritative anchors (read off the shipped CSS and measured live in the running app, DSH 0.2.0-rc.2, 1560×960):

- Settings window — `@deepseek-ai/dsh-client-ui-settings-general`, `.VOzbGW_overlay` / `.VOzbGW_mask` / `.VOzbGW_panel` (live rect `800×800` at `x380 y80`)
- Shortcuts dialog — `@deepseek-ai/dsh-client-ui-shortcuts`, `.nhfO0a_dialog` / `.nhfO0a_header` / `.nhfO0a_title` / `.nhfO0a_close`
- Account confirmation panel — `@deepseek-ai/dsh-client-ui-settings-account`, `.ywGceq_confirmation`

## The recipe

| Element | Value |
| --- | --- |
| Overlay | `position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 1000` |
| Mask | `background: var(--dsw-alias-bg-mask-1)` (24% black in light, 50% in dark) + `backdrop-filter: var(--dsw-mask-blur)` (`none` today, so free to include) |
| Window | `border-radius: var(--dsw-radius-panel)` → **28px**; `background: var(--dsw-alias-bg-layer-2)`; `box-shadow: var(--dsw-elevation-prominent)`; **no CSS border** — the 0.5px stroke is the elevation's first layer; `overflow: hidden` |
| Window size | fixed per surface, not one global size: Settings `800px × min(800px, calc(100vh - 2 * max(24px, …)))` with `max-width: calc(100vw - 48px)`; a small dialog `min(480px,100%) × 600px` |
| Title row | `flex: 0 0 46px; padding: 22px 54px 0 24px` (the `54px` right inset is the close seat's room) |
| Title | `16px/24px`, `font-weight: 500`, `color: var(--dsw-alias-label-primary)` — plain text, **no icon** |
| Close | `28px × 28px`, `border-radius: 28px`, glyph centered, `top: 20px; right: 14px`, hover `var(--dsw-alias-interactive-bg-hover)` |
| Content column | starts **54px** below the window's top edge; `padding: 0 24px 24px`; `overflow-y: auto` |
| Two-pane nav (Settings) | nav column `188px` wide, `padding: 22px 12px 0`, column `gap: 18px`, nav title `16px/24px 500` with `padding: 0 12px`, nav list `gap: 4px`; content `flex: 1` |
| Cards inside | `border-radius: 20px`; `border: 1px solid var(--dsw-alias-border-l2)`; `padding: 12px 14px`; card list `gap: 10px` (a themed-choice cube widens to `padding: 20px 32px`, `gap: 4px`) |
| Controls inside | `36px` tall, `border-radius: 12px`, `padding: 0 14px`, `gap: 12px`, input fill (light `#f5f6f7`); a tab strip runs `13px/20px` with `padding: 7px 1px 9px`, `gap: 22px` and a 2px active underline |
| Page title *inside* the window | `18px/26px 600` + `13px/20px` tertiary intro + hairline, container `gap: 12px` — that is a separate spec: see `docs/settings-section-style.md` |

Body copy inside a dialog is `14px/22px`; a confirmation's actions row is `gap: 8px`, `margin-top: 20px`.

## Compliance checklist

1. **Is the corner the window radius?** `var(--dsw-radius-panel)` (28px), not a card radius (12/16/20px) — the single most visible giveaway.
2. **Is the surface `bg-layer-2` with the elevation as its only edge?** No `1px solid` border on the window itself; the stroke belongs to `--dsw-elevation-prominent`.
3. **Does the content start 54px down, inset 24px, with the title row at 22px/24px?** The title is the window's own name, not a page title.
4. **Is the title `16px/24px 500` plain text** with a 28px round close seat, instead of a 15px/600 title with a glyph-sized close box?
5. **Are the inner cards on the card recipe** (20px radius, `12px 14px`, list gap 10px) rather than the plugin's own card numbers?
6. **Is the mask the product token** (`--dsw-alias-bg-mask-1`), and does the window out-paint the shell chrome (header, sidebars) rather than sit under it?

## What this plugin normalizes automatically

Only what a stylesheet can do without rewriting the plugin's markup — the shell and the rhythm, never the plugin's own content:

| Problem | Auto-handling |
| --- | --- |
| Window radius/shadow/background are the plugin's own card numbers | `plugins/dsh-context/overview-window-shell.module.css` re-points the window at `--dsw-radius-panel`, `--dsw-alias-bg-layer-2` and `--dsw-elevation-prominent`, and drops its border |
| Title row inside a card-shaped padding | the row takes the dialog inset (`22px` top, `24px` sides), a `16px/24px 500` title and a 28px round close seat; the content column lands on the official 54px |
| Inner tiles on plugin-specific card metrics | `plugins/dsh-context/overview-content-rhythm.module.css` moves them onto the official 20px radius / `12px 14px` padding / 10px card-list gap |
| A modal trapped below the shell chrome | `plugins/dsh-context/overview-modal-layer.module.css` raises the overlay outlet above the header while the backdrop is up (the mask must out-paint the z-21 header, and a body-portaled hover layer from another plugin must not paint over the window) |

Boundaries: a window's **size** is the plugin's call (the product itself ships 800×800 and 480×600), the spec governs shell and rhythm; nothing here re-orders content or touches the plugin's sources.

## Known third-party windows

| Window | Previously non-conforming | Normalized |
| --- | --- | --- |
| `dsh-context` · 上下文洞察 (`shell.overlay`) | 12px radius + `1px solid` border + `--dsw-shadow-lv3`, `padding: 16px 18px 18px`, 15px/600 title, 14px/16px inner card padding, 10px radius tiles; the mask sat in the outlet's z-20 context, so the z-21 header and a body-portaled widget magnifier painted over the window | shell → 28px radius, `bg-layer-2`, `--dsw-elevation-prominent`, no border; title row → dialog inset + 16/24 500 + 28px round close; content → 54px down, `0 24px 24px` inset; tiles → 20px radius / `12px 14px` / 10px gap; overlay raised to z-300 while the backdrop is up (verified: 15/15 checks in `scripts/probes/views/verify-context-overview-window.mjs`, including 390×844) |

## Recommendation for plugin authors

- Build the shell from the four tokens above (`--dsw-radius-panel`, `--dsw-alias-bg-layer-2`, `--dsw-elevation-prominent`, `--dsw-alias-bg-mask-1`) instead of hand-picked radii and shadows — then both themes follow for free.
- Keep the title row's own padding (`22px 24px 0`) rather than giving the window one big `padding`; the close seat then also has its 28px hit area.
- Semantic `currentColor` 16px glyphs only; official window titles carry no icon at all.
- Register a frame-wide window through `shell.overlay` (or `conversation.input.overlay` for a composer-anchored dialog) — and remember a slot can create its own stacking context, so a `z-index` inside it never competes with the shell's chrome.
- **Cascade warning:** the product and the plugins inject their stylesheets into `document.head` *after* this plugin's, so an equal-specificity override loses. Prefix the selector (`body …`) or raise specificity to `(0,2,0)` instead of assuming import order.
