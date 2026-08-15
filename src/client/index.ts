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
