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
      const panel = document.querySelector('.W-zNGW_panel')
      const bottom = document.querySelector('.W-zNGW_bottomPanel')
      const buttons = document.querySelectorAll('.W-zNGW_toggleButton')
      if (!panel || !bottom || buttons.length < 2) return
      const panelOpen = !panel.classList.contains('W-zNGW_panelHidden')
      const bottomOpen = !bottom.classList.contains('W-zNGW_bottomPanelHidden')
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
  // capsule segments next to the 创造模式 badge. Pure DOM move — the product
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
}
