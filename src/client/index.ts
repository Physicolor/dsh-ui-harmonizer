/**
 * Harness UI Harmonizer — browser half entry (assembly root).
 *
 * Four slots are registered (all through `ctx.slots.inject`, so each one is
 * unregistered with the fiber):
 *
 *   1. `settings.general.item` id `ui-enhancer-header`, order -100 — GeneralHeader
 *   2. `settings.general.item` id `ui-enhancer`,        order  30 — SettingsGeneralRow
 *   3. `shell.overlay`         id `enhancer-center-card`, order 30 — CenterColCard
 *   4. `settings.section`      id `ui-harmony`,         order  40 — DoctorView
 *
 * One shared EnhancerState lives in the apply closure; the two settings rows
 * receive it plus an onApply callback that mutates it and pushes CSS.
 *
 * ELEVEN effects are installed, in this order — the order is a LAYOUT CONTRACT,
 * not a detail: the mounters below assume the earlier ones already published
 * their CSS variables and declared their surfaces, and the two DOM moves run
 * before the header reconciler so it sees the final header row.
 *
 *   1. harmony contract      — create the runtime, publish the negotiation variables
 *   2. surface declarations  — declare our own surfaces to that runtime
 *   3. css lifecycle         — applyState + disposeDynamicStyle (the state push)
 *   4. session tabs          — move the 对话/轨迹 tabs into the title cluster
 *   5. bottom toggle         — move the workbench toggle to the cluster's end
 *   6. settings page headers — mark/inject the page heading + description
 *   7. row popup width       — pin a portalled menu to its launcher row
 *   8. stylesheet keeper     — restore a hand-injected sheet the loader stole
 *   9. frame track animation — keep the column-track transition, minus resize
 *  10. native-title tooltips — replace the OS tooltip with the product's bubble
 *  11. third-party text      — normalize foreign provider strings (text only)
 *
 * The four slots are registered AFTER those effects, so the surfaces they render
 * always find the styles and root classes already in place. The fiber's effect
 * disposers remove every dynamic style tag, root property, class, listener and
 * DOM move this plugin made.
 */

import * as React from 'react'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Stylesheets: ONE entry, imported in the order the layers must cascade in.
// The former single `enhancer.module.css` is split by target (harness /
// plugins/<package> / self) — see styles/index.ts for the order contract.
import './styles/index.ts'
import { GeneralHeader } from './self/settings/general-header.tsx'
import { SettingsGeneralRow } from './self/settings/general-rows.tsx'
import { adoptSharedWidth } from './harness/chat-width.ts'
import { applyState, disposeDynamicStyle } from './core/apply.ts'
import { loadState } from './core/state-store.ts'
import type { EnhancerState } from './core/state-model.ts'
import { FONT_PRESETS } from './self/font-presets.ts'
import { CenterColCard } from './harness/center-card.tsx'
import { mountTitleTooltips } from './harness/chrome/title-tooltip.ts'
import { mountTextAdapters } from './core/text-adapters.ts'
import { COMMANDCODE_TEXT_ADAPTERS } from './plugins/commandcode-provider/adapters.ts'
import { getDoctorSectionLabel } from './core/i18n.ts'
import { createHarmonyRuntime } from './core/harmony/runtime.ts'
import { DoctorView } from './self/doctor/view.tsx'
import { mountSettingsPageHeaders } from './harness/settings-header/reconciler.ts'
import { mountMenuAnchorWidth } from './harness/chrome/menu-anchor.ts'
import { mountStyleKeeper } from './harness/chrome/style-keeper.ts'
import { mountFrameTrackTransition } from './harness/chrome/frame-track.ts'

/**
 * Plugin id stamped on every style tag we own, and the label on every
 * `ctx.effect` (fiber diagnostics). ONE spelling: the historical
 * `harness-ui-enhancer` survived in three places (here, tsdown.config.ts's
 * bundle id, title-tooltip's tag id) and the loader could only sweep the tags
 * that matched its own id — the tooltip bubble's stylesheet leaked on unload
 * because of it. `dsh-ui-harmonizer` is the package name and the loader's id.
 */
const PLUGIN_ID = 'dsh-ui-harmonizer'

/** Required services: the slot registry (React is a platform module). */
export const inject = ['slots']

/**
 * Client plugin body: restore persisted state, apply CSS, register surfaces.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const state: EnhancerState = loadState()
  applyState(state)

  // Harmony Contract runtime: publishes the negotiation variables on <html> and
  // exposes `ctx.get('uiHarmony')` so other plugins DECLARE what they occupy
  // instead of being measured by guesswork. The disposer removes the service,
  // the variables and the material watcher together with the fiber.
  const harmony = createHarmonyRuntime(
    (name, value) => ctx.reflect.provide(name, value),
  )
  ctx.effect(() => () => harmony.dispose(), `${PLUGIN_ID}: harmony contract`)

  // Declare our own surfaces so the Doctor's inventory is not empty and any
  // co-tenant can avoid them by reading the contract rather than our CSS.
  ctx.effect(() => {
    const disposers = [
      harmony.service.registerSurface({
        id: 'dsh-ui-harmonizer:center-card',
        role: 'frame-overlay',
        tokens: ['--dsw-alias-border-l2', '--dsw-shadow-lv3', '--enhc-solid-fill'],
        opaque: false,
        note: 'transparent shadow/border caster over the center column; paints no fill of its own',
      }),
      harmony.service.registerSurface({
        id: 'dsh-ui-harmonizer:settings-rows',
        role: 'settings-page',
        tokens: ['--dsw-alias-border-l2', '--dsw-alias-state-business-primary'],
        opaque: false,
        note: 'five rows in Settings → General, plus the UI Compatibility page',
      }),
    ]
    return () => { for (const dispose of disposers) dispose() }
  }, `${PLUGIN_ID}: surface declarations`)

  // Fiber-scoped cleanup: the dynamic style tag and root properties disappear
  // when this plugin stops, updates, or is removed.
  ctx.effect(() => {
    applyState(state)
    return disposeDynamicStyle
  }, `${PLUGIN_ID}: css lifecycle`)

  // REMOVED (0.9.0): the better-sidebar toggle-state sync.
  //
  // It keyed on `.nArs4W_panelHidden` / `.nArs4W_bottomPanelHidden`, two hashed
  // CSS-module classes, and the whole-height toggle-cluster seat it drove
  // targeted `nArs4W_toggleCluster`. Measured against the installed
  // dsh-better-sidebar 0.24.1 (CSS-module map: 192 keys): `panelHidden`,
  // `toggleCluster` and `panelResize` are all absent, and the plugin has not
  // published `--dsh-sidebar-width` since 0.19.0 — it registers its controls
  // into the product's own header seats and publishes `--dsh-title-bar-strip` /
  // `--dsh-sidebar-height` instead.
  //
  // Consequence of keeping it: `panelOpen` was permanently `true` whenever the
  // panel node existed, so `html.enhc-panel-open` latched on and the "compact
  // floating seat" became the default shape — the seat design running backwards,
  // silently. The mechanism is deleted rather than repaired: reading another
  // plugin's private classes is the thing the Harmony Contract exists to stop,
  // and the surface it styled no longer exists.

  // Relocate the session tabs (对话/轨迹) into the title row, right after the
  // header actions, so the header is a single line and the tabs read as
  // capsule segments next to the 创作模式 badge. Pure DOM move — the product
  // still owns the tab logic (aria-selected/class updates land on the same
  // node, and if a re-render ever rebuilds it, the observer moves it back).
  // The lookup is scoped to the session header container so unrelated "_tabs"
  // elements (e.g. the plugin-market tabs in the settings panel) are never
  // mistaken for the conversation tabs.
  //
  // REVERSIBLE (fixed 2026-09-30): the move used to be one-way. The disposer
  // only called `observer.disconnect()`, so the tabs stayed inside the title
  // cluster after the plugin stopped or hot-reloaded — and because the product
  // renders them back where ITS tree says they belong on the next commit, the
  // residue showed up as the tabs flickering between two seats on every load.
  // The first move therefore records (parent, nextSibling) of the ORIGINAL seat
  // and the disposer puts the node back exactly there. Per the lifecycle
  // contract: skip the restore when the original parent has left the document
  // (its whole subtree is React's to discard), and stay idempotent — the guard
  // below means a node already back home is never moved a second time.
  ctx.effect(() => {
    let origin: { parent: Node, nextSibling: Node | null } | null = null
    const relocateTabs = (): void => {
      const titleCluster = document.querySelector('[class$="_titleCluster"]')
      const actions = titleCluster?.querySelector('[class$="_headerActions"]')
      const tabs = document.querySelector('[data-slot="conversation.session.header"] [class$="_tabs"]')
      if (!titleCluster || !tabs) return
      if (tabs.parentElement === titleCluster) return
      if (origin === null) origin = { parent: tabs.parentNode as Node, nextSibling: tabs.nextSibling }
      const ref = actions !== undefined && actions !== null ? actions.nextSibling : null
      titleCluster.insertBefore(tabs, ref)
    }
    relocateTabs()
    const observer = new MutationObserver(relocateTabs)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      const tabs = document.querySelector('[data-slot="conversation.session.header"] [class$="_tabs"]')
      // `isConnected` on the recorded parent is the "the original seat still
      // exists" test; a detached parent would make the restore a move into a
      // garbage subtree. `tabs.parentElement === titleCluster` keeps this
      // idempotent: already home ⇒ nothing to do.
      if (tabs === null || origin === null) return
      if (!(origin.parent as Element).isConnected) return
      const cluster = document.querySelector('[class$="_titleCluster"]')
      if (tabs.parentElement !== cluster) return
      const ref = origin.nextSibling !== null && origin.parent.contains(origin.nextSibling) ? origin.nextSibling : null
      origin.parent.insertBefore(tabs, ref)
    }
  }, `${PLUGIN_ID}: session tabs relocation`)

  // The bottom-workbench toggle (dsh-better-sidebar's BottomDockToggle, marked
  // with `data-dsh-bottom-toggle`) registers into the session header's utilities
  // seat, which sits BETWEEN the header actions and the product's own right-bar
  // button — so it lands mid-row instead of at the row's right edge. Move its
  // wrapper to the end of the title cluster so it becomes the last control of the
  // header row, which is where a panel toggle is expected. Pure DOM move: the
  // plugin keeps ownership of the button, its aria state and its click handler,
  // and a re-render that rebuilds the cluster is re-placed by the observer.
  //
  // REVERSIBLE (fixed 2026-09-30): same one-way defect as the tabs above — the
  // disposer left the wrapper parked at the end of the cluster, so a disabled or
  // hot-reloaded plugin kept a foreign node in the header row. The first move
  // records the wrapper's original (parent, nextSibling) and the disposer puts
  // it back; a detached original parent makes the restore a no-op, and the
  // "already the last child" guard keeps a repeated move / dispose idempotent.
  ctx.effect(() => {
    let origin: { parent: Node, nextSibling: Node | null } | null = null
    const placeBottomToggle = (): void => {
      const button = document.querySelector('[data-dsh-bottom-toggle]')
      const holder = button === null ? null : button.parentElement
      const cluster = holder === null ? null : holder.parentElement
      if (holder === null || cluster === null) return
      if (!cluster.className.includes('_titleCluster')) return
      if (cluster.lastElementChild === holder) return
      if (origin === null) origin = { parent: holder.parentNode as Node, nextSibling: holder.nextSibling }
      cluster.appendChild(holder)
    }
    placeBottomToggle()
    const observer = new MutationObserver(placeBottomToggle)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      const button = document.querySelector('[data-dsh-bottom-toggle]')
      const holder = button === null ? null : button.parentElement
      if (holder === null || origin === null) return
      if (!(origin.parent as Element).isConnected) return
      // Only a wrapper this instance actually parked (i.e. still inside the
      // title cluster) is ours to return; one the product re-seated itself is
      // left alone.
      if (!holder.parentElement?.className.includes('_titleCluster')) return
      const ref = origin.nextSibling !== null && origin.parent.contains(origin.nextSibling) ? origin.nextSibling : null
      origin.parent.insertBefore(holder, ref)
    }
  }, `${PLUGIN_ID}: bottom-panel toggle placement`)

  // Settings page headers — ONE architecture for every page (settings-page.ts).
  //
  // The product renders each settings page inside its own container and only the
  // official pages happen to open with `h2._title + p._intro`; third-party pages
  // ship their own markup and some pages ship no title at all. Historically this
  // plugin patched each case separately (an inline-styled React block, a bare
  // injected `<h2>`, and per-plugin CSS rules keyed on foreign class names). The
  // reconciler now marks the page's real heading/description with our class pair
  // — or injects the heading when the page has none, labelled from the active
  // settings-nav item — so one stylesheet rule set places every header. Pure
  // additive DOM: nothing is moved or re-parented, and a page that already
  // conforms is left untouched.
  ctx.effect(() => mountSettingsPageHeaders(), `${PLUGIN_ID}: settings page headers`)

  // Row popups match their row's width (menu-anchor.ts). The product's portalled
  // Menu is content-driven (218–360px) while the sidebar rows it hangs from are
  // full-width, so the account menu painted narrower than the row that opened it.
  ctx.effect(() => mountMenuAnchorWidth(), `${PLUGIN_ID}: row popup width`)

  // Third-party stylesheet keeper (style-keeper.ts). The client-module loader's
  // `claimStyles` pass adopts every UNTAGGED `<style>` in the document for the
  // plugin materializing at that moment, and `removeOwnedStyles` deletes it when
  // that adopter later reloads or is pruned — so a plugin that hand-injects its
  // stylesheet once (dsh-notification's `#dsh-notification-style`) loses it for
  // the rest of the session. Restore vanished stylesheets after a grace period;
  // an owner that legitimately hot-reloaded re-injects first and we stand down.
  ctx.effect(() => mountStyleKeeper(), `${PLUGIN_ID}: third-party stylesheet keeper`)

  // The AppFrame column-track animation gate (frame-track.ts). DSH 0.2.0 gates
  // the frame's `grid-template-columns` transition behind `[data-animating]`,
  // which React sets in a layout effect on the SAME commit that writes the new
  // track, so the before-change style carries no transition and none ever runs:
  // the conversation column snaps to its new width instead of gliding, and
  // every consumer of that clock (this plugin's center-card overlay, the
  // viewArea/composerSeat squeeze above, dsh-widgets' rail yield) loses its
  // animation with it. The stylesheet keeps the transition on the frame
  // permanently; this module owns the one exclusion the product implements in
  // JS rather than CSS — a window resize.
  ctx.effect(() => mountFrameTrackTransition(), `${PLUGIN_ID}: frame track animation`)

  // Tooltip harmonizer: elements that only carry the raw HTML `title`
  // attribute (model selector trigger, various product controls) pop the
  // OS-native tooltip and break the visual language kept by every surface
  // that routes through the official Tooltip primitive. The mount lifts the
  // title during hover/focus, suppresses the native popup, and re-renders the
  // same text in a bubble replicating the primitive's geometry + tokens.
  // One effect owns listeners/timers/bubble/style; the disposer restores any
  // lifted title so stopping the plugin leaves zero residue.
  ctx.effect(() => mountTitleTooltips(), `${PLUGIN_ID}: unified native-title tooltips`)

  // Third-party text adapters: the shell prints a provider's own strings verbatim, so
  // a plugin that brands its models (`… (CC)`) or lower-cases an option level (`high`)
  // changes the interface's voice from outside the product. The adapter list names the
  // package it normalizes and touches TEXT ONLY — see src/client/adapters.ts for the
  // rules of the road (shell hooks, not hashed classes; reversible on dispose).
  ctx.effect(() => mountTextAdapters(COMMANDCODE_TEXT_ADAPTERS), `${PLUGIN_ID}: third-party text adapters`)

  const patch = (next: Partial<EnhancerState>): void => {
    // The chat width is shared with the product's own drag handles. When this
    // patch is NOT the width row, adopt whatever the handles last persisted
    // first — otherwise changing the font would re-publish the stale width the
    // plugin still holds and silently undo the user's drag.
    if (next.width === undefined) adoptSharedWidth(state)
    Object.assign(state, next)
    applyState(state)
  }
  const surfaceProps = {
    state,
    onApply: patch,
    presets: FONT_PRESETS,
  }

  ctx.slots.inject('settings.general.item', () => ctx.slots.register(
    { name: 'settings.general.item', id: 'ui-enhancer-header', order: -100 },
    GeneralHeader,
  ))
  ctx.slots.inject('settings.general.item', () => ctx.slots.register(
    { name: 'settings.general.item', id: 'ui-enhancer', order: 30 },
    () => React.createElement(SettingsGeneralRow, surfaceProps),
  ))

  // Passive rounded-card chrome over the center column. Always mounted (cheap
  // geometry tracking); its paint is toggled by the enhc-center-card-on root
  // class, which applyState flips from the Settings switch — no re-render.
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'enhancer-center-card', order: 30 },
    () => React.createElement(CenterColCard),
  ))

  // Harmony Doctor page: a local, read-only compatibility audit. It renders in
  // the settings content column like any other page and exports Markdown.
  // `label` is a THUNK (the slot contract reads it at render time), so switching
  // Settings → Language re-reads the nav entry; passing the string froze it at
  // the language that happened to be active when the plugin loaded.
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    { name: 'settings.section', id: 'ui-harmony', order: 40, label: () => getDoctorSectionLabel() },
    () => React.createElement(DoctorView, { service: harmony.service }),
  ))
}
