/**
 * Harness UI Enhancer — browser half entry.
 *
 * Registers two surfaces in Settings → General:
 * - GeneralHeader (order -100), the unified page header
 * - SettingsGeneralRow (order 30), the "界面定制" sizing block
 *
 * One shared EnhancerState lives in the apply closure; both surfaces receive
 * it plus an onApply callback that mutates it and pushes CSS. The fiber's
 * effect disposer removes the dynamic markdown style tag and root properties.
 */

import * as React from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import './enhancer.module.css'
import { GeneralHeader, SettingsGeneralRow } from './components.tsx'
import { applyState, disposeDynamicStyle, FONT_PRESETS, loadState, type EnhancerState } from './state.ts'
import { AutoDialog, AutoLauncher, McpDialog } from './mcp-auto.ts'

/** Plugin id stamped on the dynamic style tag (loader unload sweep key). */
const PLUGIN_ID = 'harness-ui-enhancer'

/** Required services: the slot registry (React is a platform module). */
export const inject = ['slots']

/**
 * Client plugin body: restore persisted state, apply CSS, register surfaces.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const state: EnhancerState = loadState()
  applyState(state)

  // Fiber-scoped cleanup: the dynamic style tag and root properties disappear
  // when this plugin stops, updates, or is removed.
  ctx.effect(() => {
    applyState(state)
    return disposeDynamicStyle
  }, `${PLUGIN_ID}: css lifecycle`)

  // Keep dsh-better-sidebar's toggle buttons visually in sync with their
  // panels: mirror the widgets capsule pattern (aria-pressed=true → brand
  // fill) onto the button whose panel is open. Pure runtime attribute sync —
  // the third-party bundle's source is never touched, so a future update of
  // that plugin cannot be broken by this code (worst case the rule no longer
  // matches). Render order of the two toggles is [bottom, panel], matched by
  // index so locale-dependent aria-labels never matter.
  ctx.effect(() => {
    const syncToggleStates = (): void => {
      const panel = document.querySelector('.nArs4W_panel')
      const bottom = document.querySelector('.nArs4W_bottomPanel')
      const buttons = document.querySelectorAll('.nArs4W_toggleButton')
      if (!panel || !bottom || buttons.length < 2) return
      const panelOpen = !panel.classList.contains('nArs4W_panelHidden')
      const bottomOpen = !bottom.classList.contains('nArs4W_bottomPanelHidden')
      buttons[0].setAttribute('aria-pressed', String(bottomOpen))
      buttons[1].setAttribute('aria-pressed', String(panelOpen))
    }
    syncToggleStates()
    const observer = new MutationObserver(syncToggleStates)
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, `${PLUGIN_ID}: better-sidebar toggle state sync`)

  // Relocate the session tabs (对话/轨迹) into the title row, right after the
  // header actions, so the header is a single line and the tabs read as
  // capsule segments next to the 创作模式 badge. Pure DOM move — the product
  // still owns the tab logic (aria-selected/class updates land on the same
  // node, and if a re-render ever rebuilds it, the observer moves it back).
  // The lookup is scoped to the session header container so unrelated "_tabs"
  // elements (e.g. the plugin-market tabs in the settings panel) are never
  // mistaken for the conversation tabs.
  ctx.effect(() => {
    const relocateTabs = (): void => {
      const titleCluster = document.querySelector('[class$="_titleCluster"]')
      const actions = titleCluster?.querySelector('[class$="_headerActions"]')
      const tabs = document.querySelector('[data-slot="conversation.session.header"] [class$="_tabs"]')
      if (!titleCluster || !tabs) return
      if (tabs.parentElement === titleCluster) return
      const ref = actions !== undefined && actions !== null ? actions.nextSibling : null
      titleCluster.insertBefore(tabs, ref)
    }
    relocateTabs()
    const observer = new MutationObserver(relocateTabs)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, `${PLUGIN_ID}: session tabs relocation`)

  // Some third-party settings sections render a description (`p[class$='_intro']`)
  // but forget the page heading entirely (e.g. better-sidebar's "侧边卡片"), so
  // they open as a bare intro with no 18/600 title and look out of place next to
  // the official pages. Fill the missing heading in place: whenever the active
  // settings.section has an intro but no real heading (h1/h2/h3), inject a
  // styled page title before the intro, labelled with the active settings-nav
  // item's label. The product's settings shell marks exactly one nav cell active
  // with `aria-current="true"` (+ an `_active` class), and that cell's label is
  // the current page's title — a stable, locale-free contract. Pure additive
  // DOM: nothing of the plugin's is removed or moved, a future build that adds
  // its own heading makes this a no-op, and the observer re-scans on every DOM
  // and class/aria change so a late-arriving aria-current is still caught.
  // `enhc-settings-title` keeps the injected node out of `_title`-suffixed
  // selectors so the existing header rules cannot double-treat it. If no active
  // nav label is resolvable we skip rather than invent a wrong one.
  ctx.effect(() => {
    const FILL_CLASS = 'enhc-settings-title'
    /** Deterministic fallback: known intro → page title, so a missing heading is
     *  filled even if the active-nav label cannot be resolved in time. */
    const KNOWN_TITLES: ReadonlyArray<readonly [prefix: string, title: string]> = [
      ['管理侧边卡片', '侧边卡片'], // dsh-better-sidebar SideCardSection (no h2 in its markup)
    ]
    const fillSectionTitle = (): void => {
      const section = document.querySelector('[data-slot="settings.section"]')
      if (section === null || section === undefined) return
      const intro = section.querySelector('p[class$="_intro"]')
      if (intro === null || intro === undefined) return
      // A real page heading already exists (official pages, notification's real
      // <h2>, market, …) → nothing to fill.
      if (section.querySelector('h1, h2, h3') !== null) return
      // Already injected for this section.
      if (section.querySelector(`h2.${FILL_CLASS}`) !== null) return
      // Preferred source: the active settings-nav label (product contract:
      // aria-current="true" + an `_active` class). Fall back to KNOWN_TITLES keyed
      // by the intro's stable text so a late-rendered nav never blocks the fill.
      let text = ''
      for (const el of document.querySelectorAll('[class$="_navCell"]')) {
        if (el.getAttribute('aria-current') === 'true' || /(^|\s)\S*_active(\s|$)/.test(el.className)) {
          text = el.textContent?.trim() ?? ''
          break
        }
      }
      if (text === '') {
        const it = intro.textContent?.trim() ?? ''
        const hit = KNOWN_TITLES.find(([prefix]) => it.startsWith(prefix))
        text = hit?.[1] ?? ''
      }
      if (text === '') return
      const title = document.createElement('h2')
      title.className = FILL_CLASS
      title.textContent = text
      intro.parentElement?.insertBefore(title, intro)
      console.info(`[harness-ui-enhancer] injected settings section title: ${JSON.stringify(text)}`)
    }
    fillSectionTitle()
    const observer = new MutationObserver(fillSectionTitle)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-current', 'aria-expanded'],
    })
    // Keep trying for a short window in case the nav/section render late.
    const tick = window.setInterval(fillSectionTitle, 700)
    window.setTimeout(() => window.clearInterval(tick), 12000)
    return () => {
      observer.disconnect()
      window.clearInterval(tick)
    }
  }, `${PLUGIN_ID}: settings section title fill`)

  const patch = (next: Partial<EnhancerState>): void => {
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

  // MCP + Automation: two buttons in ONE sidebar.footer.action entry.
  // The wrapper is transparent (zero padding) so buttons match the settings
  // trigger's width exactly. Two separate Settings-style modal dialogs
  // in shell.overlay.
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register(
    { name: 'sidebar.footer.action', id: 'enhancer-triggers', order: 20 },
    () => React.createElement(AutoLauncher),
  ))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'enhancer-mcp-dlg', order: 0 },
    () => React.createElement(McpDialog),
  ))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'enhancer-auto-dlg', order: 1 },
    () => React.createElement(AutoDialog),
  ))
}
