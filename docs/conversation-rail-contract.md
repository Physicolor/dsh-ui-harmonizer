# Conversation Rail Design Spec

The contract for the strip inside the center column, to the right (or left) of the transcript —
the band freed by the transcript's own centering. Defined and arbitrated by
**dsh-ui-harmonizer**; version `1.0` (draft).

Sibling doc: [settings-section-style.md](settings-section-style.md) defined the settings-page
header the same way — a spec plus the normalization this plugin performs automatically.

## Why this spec exists

**The product has no hole for this region, and a plugin cannot mint one.**

`packages/client/ui-conversation/src/client/contract/slots.ts` declares every conversation
hole there is:

| hole | kind | what it is |
| --- | --- | --- |
| `conversation.session` | single | the conversation column |
| `conversation.session.header` | single | the column's own header |
| `conversation.session.header.actions` | list | header action buttons |
| `conversation.session.header.utilities` | list | header utility buttons (export, open-in-app) |
| `conversation.view` | list | view tabs (Chat / Trajectory / …) |
| `conversation.chat.node` | keyed | chat node renderers |
| `conversation.composer` | chain | composer takeover |
| `conversation.composer.bar` | single | composer control bar |
| `conversation.input.overlay` | list | **input popups** |
| `conversation.input.dock` / `conversation.composer.dock` | list | input / composer dock rows |
| `conversation.input.left` / `conversation.input.right` | list | input control seats |
| `conversation.hero.workspace` | single | empty-state workspace picker |

Nothing here is a rail. And per `packages/client/AGENTS.md`, *"Rendering a slot you didn't
declare, or declaring one someone else declared, fails at load"* — a third-party plugin
cannot add `conversation.rail` to that map. So the region has to be a **service + geometry
contract**, not a slot. That is what this document defines.

**What fills the vacuum today** (measured against installed plugins, 2026-10-06):

- `dsh-widgets` hosts its rail in `conversation.input.overlay` at `order: 1000`
  (`src/client/index.ts:266-280`) — an *input popup* seat, shared with `ui-commands`'
  `command-popup` and `ui-input-trigger`'s popup list.
- Horizontal space is taken by a CSS side effect on someone else's element:
  `body.dsx-stats-active [data-conversation-scroll] { padding-right: var(--dsx-rail-w, 0px) }`
  (`dsh-widgets/src/client/styles/rail.module.css:102-109`). N plugins doing this produce N
  overlapping reservations, and the transcript loses the difference.
- Vertical order is claimed with literal `z-index`. `MeteorNOX/DeepSeek-Balance-Whale-Widget`
  already shipped `tools/z-layer-audit.mjs` after two silent failures: a candidate list that
  referenced a non-existent `usageMask` (the whole order chain threw and was swallowed), and a
  third-party body-level overlay that was never registered, so two windows covered each other
  with no error from either. Its interop answer is a private global, `window.dshwRegisterMask`.

**Precedent for the fix.** `dsh-better-sidebar` squatted the page's right column first; the
product later shipped `sidebar-right` with `ctx.sidebarRightTabs.register`, a keyed pane slot,
and `guide`/`menu` extension seats. The conversation rail has not had its turn yet. This spec
is that turn, in advance, as a contract.

## The region

```
┌─ center column ────────────────────────────────────────────┐
│  header (conversation.session.header)                      │
├────────────────────────────────────────────────────────────┤
│      ┌── transcript ──┐  ← slack →  ┌── rail ──┐           │
│      │                │  gutter     │  band    │  inset    │
│      │  [data-conversation-scroll]  │          │           │
│      └────────────────┘             └──────────┘           │
├────────────────────────────────────────────────────────────┤
│  composer seat                                             │
└────────────────────────────────────────────────────────────┘
```

- **Extent**: inside the center column, between the transcript's right edge and the column's
  right edge. Not a page column — `sidebar-right` is the page column; this one lives *inside*
  the center column and is lost first when the center narrows.
- **Height**: the visible height of `[data-conversation-scroll]`.
- **Side**: `right` (default) or `left`. The left edge already carries several rails
  (`dsh-chat-rail`, `wx-yss/dsh-message-rail`, `dsh-tick-rail`, `Yujm888/dsh-turn-rail`) and
  they need the same arbitration; both sides use this contract.
- **Scope**: session. The band exists only while a conversation is mounted.
- **Default state**: collapsed. Opening it is a user gesture, and the toggle belongs in
  `conversation.session.header.utilities` — the hole the product already uses for the
  open-right-sidebar control.

## The two declaration axes

Space and stacking are declared **separately**, because they fail separately.

| axis | who needs it | failure mode if unarbitrated |
| --- | --- | --- |
| **`block`** — occupies width | `dsh-widgets` rail, `MorGogh/widget-dock` | reservations sum, transcript drops below its floor |
| **`float`** — occupies no width, only a layer | `MeteorNOX/DeepSeek-Balance-Whale-Widget`, `GooodWei/context-vista`, `a903067276-rgb/dsh-hud` | mutual occlusion, nothing reports it |

A surface may declare one or both. `block` without `float` stacks in the rail's own flow;
`float` without `block` is anchored to the region's corner and never moves the transcript.

## The budget: exactly one reserver

The transcript centers itself: `--dsh-chat-content-width` is declared on the conversation root
(`ConversationRoot.module.css:22`, default `748px`) and the message column pads with
`max(0px, calc((100% - var(--dsh-chat-content-width)) / 2))` (`ChatView.module.css:161`).
So the product already reserves **equal** slack on both sides, and the rail's honest share is
the right half of it:

```
columnW  = center column offsetWidth
contentW = resolved --dsh-chat-content-width
slack    = max(0, columnW - contentW)
budget   = max(0, floor(slack / 2) - GUTTER - INSET)
```

`GUTTER = 16` (transcript → rail minimum gap), `INSET = 16` (rail → column edge safe zone).

Only the harmonizer computes and publishes this. It publishes:

| variable | meaning |
| --- | --- |
| `--enhc-rail-budget` | px available to all `block` surfaces on this side; `0` means none |
| `--enhc-rail-reserved` | px actually handed out (`≤ budget`) |
| `--enhc-rail-state` | `none` \| `tight` \| `normal` \| `roomy` |

**Consumers must not write `[data-conversation-scroll]`'s `padding-right`.** That element has
one owner. Harmonizer sums the reservations and writes the transcript's clearance once, so
three plugins produce one gap rather than three.

`--enhc-rail-state: none` is a first-class answer, not an error: at that width the region does
not exist, and every registrant's toggle must render disabled rather than pressed-but-empty.
`dsh-widgets` already derives this privately (`resolveRailLayout(...).constrained`); the
contract exists so nobody has to re-derive it.

## The registry

Extends the existing `uiHarmony` service (`src/client/core/harmony/contract.ts`), which already
declares `HarmonySurfaceRole: 'right-rail'` and is already published with
`ctx.reflect.provide('uiHarmony', …)` (`src/client/core/harmony/runtime.ts:93`).

Declared fields added to `HarmonySurface`:

| field | type | default | meaning |
| --- | --- | --- | --- |
| `occupancy` | `'block' \| 'float'` | `'block'` | which axis this surface claims |
| `side` | `'right' \| 'left'` | `'right'` | which rail |
| `minWidth` | `number` | — | `block` only; below this the surface must defer |
| `preferredWidth` | `number \| 'auto'` | `'auto'` | wanted width when room allows |
| `layer` | `'rail' \| 'popover' \| 'modal' \| 'toast'` | `'rail'` | `float` only |
| `available` | `() => boolean` | `() => true` | false when the surface has nothing to show |
| `order` | `number` | `0` | tie-break, low first |

Methods added to `HarmonyService`:

```ts
railBudget(side?: 'right' | 'left'): { total: number; reserved: number; free: number; state: RailState }
railSlots(side?: 'right' | 'left'): readonly HarmonySurface[]   // effective order
effectiveWidth(id: string): number                              // width after arbitration
registerOverlay(o: { id: string; el?: Element; layer: RailLayer; order?: number }): () => void
overlayOrder(): readonly string[]                               // bottom → top
```

Ordering reuses the product's own list-slot semantics — sort by `priority` desc, then `order`
asc, then registration sequence. `dsh-widgets` lost a day to a shared `order: 10` against
`dsh-better-sidebar`'s toggle, so the tie-break is part of the contract, not an implementation
detail.

## Arbitration

1. Bucket by `side`.
2. Drop surfaces whose `available()` is false.
3. Sort by (priority desc, order asc, registration sequence).
4. Walk the sorted list, allocating `min(preferred, free)` while `free >= minWidth`; otherwise
   mark `deferred` and keep walking (a later, smaller surface may still fit).
5. `deferred` surfaces are folded by the rail host into **one** collapsible stack per side —
   the single-card layout of Codex's pinned-summary panel, not N squeezed cards.
6. If no surface fits at all: `--enhc-rail-state: none`, and the toggle is disabled.

## The layer registry

| token | layer |
| --- | --- |
| `--enhc-z-rail` | `rail` |
| `--enhc-z-popover` | `popover` |
| `--enhc-z-modal` | `modal` |
| `--enhc-z-toast` | `toast` |

Consumers read the tokens, they do not invent literals. Two ways to join, both without a
dependency on this package:

- **Declarative**: put `data-enhc-overlay="popover"` (plus `data-enhc-overlay-id`) on the
  element; the harmonizer's observer adopts it.
- **Event**: dispatch `enhc:overlay` with `{ id, el, layer }`.

`window.dshwRegisterMask` keeps working; the contract's job is to keep harmonizer's own layers
below whatever it registers, so the whale widget does not have to know about us.

## Compliance checklist

A surface is compliant when all of these hold:

- [ ] It declares through `ctx.get('uiHarmony').registerSurface(...)` or carries the `data-enhc-overlay` marker.
- [ ] It never writes `padding-right`/`margin-right` on `[data-conversation-scroll]`.
- [ ] It reads `--enhc-rail-budget` / `--enhc-rail-state` instead of recomputing width.
- [ ] Below `minWidth` it defers and its toggle reads disabled.
- [ ] It uses the `--enhc-z-*` tokens, never a literal `z-index`.
- [ ] Its toggle lives in `conversation.session.header.utilities` and declares a stable `order`.
- [ ] Its disposer runs from `ctx.effect()` so an unloaded plugin leaves no reservation.

## What harmonizer normalizes automatically

So that an unmodified plugin still behaves:

- **`dsh-widgets`** — reads `body.dsx-stats-active` and `--dsx-rail-w` as a `block`
  declaration on the right rail. No change to that plugin.
- **`dsh-context`** — already patched: its dashboard view hides the composer seat
  (`display: none`), which `position: fixed` does not escape, so every rail box collapsed to
  0×0. `plugins/dsh-widgets/rail-vs-context-view.module.css` restores the seat with zero
  layout footprint. Under this contract that case is an `available()` interaction, but the
  CSS path stays for plugins that never adopt the API.
- **`MeteorNOX/DeepSeek-Balance-Whale-Widget`** — a `float` surface in the corner. It needs no
  change: harmonizer aligns its own layers to the widget's registered masks, and the widget's
  occupancy is not counted against `block` budget.
- **`MorGogh/widget-dock`**, **`GooodWei/context-vista`**, **`a903067276-rgb/dsh-hud`**,
  **`940842546/dsh-usage-billing`**, **`SoDaZilla-zzz/dsh-liquid-glass-balance-card`** —
  detected by their own body classes/`position: fixed` hosts and counted, so their share is
  subtracted instead of double-reserved.
- **`dsh-better-sidebar`** — lives in the product's `sidebar-right` track, not this region.
  It only appears in the declaration set (for layer alignment); it never draws rail budget.

## Known occupants (2026-10-06)

| plugin | how it occupies today | under this contract | code change |
| --- | --- | --- | --- |
| `dsh-widgets` | `block`, `conversation.input.overlay` host, `--dsx-rail-w` | read as a block declaration | none |
| `MeteorNOX/DeepSeek-Balance-Whale-Widget` | `float`, fixed corner, private mask registry | layers aligned | none (optional upgrade) |
| `MorGogh/widget-dock` | `block`, both conversation margins | register as `block`, per side | recommended |
| `GooodWei/context-vista` | `float` right-side panel | `data-enhc-overlay` | recommended |
| `a903067276-rgb/dsh-hud` | `float` side panel | `data-enhc-overlay` | recommended |
| `dsh-chat-rail`, `wx-yss/dsh-message-rail`, `dsh-tick-rail`, `Yujm888/dsh-turn-rail` | left-edge rails | register `side: 'left'` | recommended |
| `dsh-context` | hides the composer seat | existing compat module | none |
| `dsh-better-sidebar` | product `sidebar-right` track | not this region | none |

## Recommendation for plugin authors

If you need this band:

1. Declare, do not measure. One `registerSurface` call beats a selector on someone's hashed
   class name — the audit of this plugin found 107 of its own 134 selectors dead after a
   rebuild.
2. Reserve with `block`, decorate with `float`. If your surface does not move the transcript,
   do not claim width for it.
3. Put your toggle in `conversation.session.header.utilities` with a distinct `order`.
4. Treat `--enhc-rail-state: none` as a supported state and disable, never squeeze.
5. If you must ship before adopting the API, add `data-enhc-overlay` and stay off
   `[data-conversation-scroll]`'s padding — those two rules are what the normalizer keys on.

## Upstream proposal

Per the `sidebar-right` precedent, the durable fix is an official hole. To `ui-conversation`'s
`SlotMap` and `apply.ts`:

```ts
'conversation.rail': { kind: 'list'; scope: 'session'; owner: RailOwnerProps }
// registered by ui-conversation itself; children:
//   'conversation.rail.item'      — keyed by surface id
//   'conversation.rail.item.menu' — per-item overflow menu
```

with the trade-off order written next to the columns contract: the rail yields before the
transcript, and the transcript yields before `CENTER_MIN`. Until that exists, this spec is the
de-facto standard and `--enhc-contract` carries the version.

## Verification

Acceptance is observable on a live `dsh web` session:

1. Three `block` registrants on one side → `--enhc-rail-reserved == Σ effectiveWidth`, and
   `reserved <= budget`.
2. Transcript width ≥ the product floor at every viewport where `--enhc-rail-state != 'none'`.
3. With `state == 'none'`, every registrant's toggle renders disabled (`aria-disabled`), none
   `aria-pressed=true`.
4. With the whale widget installed and its `window.dshwRegisterMask` populated, `topOverlay()`
   equals the widget's answer and `elementFromPoint` samples inside the rail hit rail
   descendants, not widget descendants.
5. Unloading a registrant's fiber returns `reserved` to its prior value in the same frame.
