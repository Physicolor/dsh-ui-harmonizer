/**
 * The contract runtime: service registration, published variables and the
 * material watcher.
 */

import { CONTRACT_VERSION, VARS, type HarmonyService, type HarmonySurface } from './contract.ts'
import { detectGlass } from './material.ts'

/** Live contract instance; one per plugin fiber. */
export interface HarmonyRuntime {
  service: HarmonyService
  /** Push the material state into the published variables. */
  refreshMaterial: () => void
  dispose: () => void
}

/**
 * Create the contract runtime: the service, the published variables and the
 * material watcher (theme events when the theme service is present, plus a
 * cheap poll so a theme applied by plain CSS is still noticed).
 * @param provide - `ctx.reflect.provide`, injected so this module stays inert.
 * @param onThemeChange - optional subscription hook (`ctx.on('theme/change', …)`).
 * @returns the runtime plus a disposer.
 */
export function createHarmonyRuntime(
  provide: (name: string, value: unknown) => () => void,
  onThemeChange?: (listener: () => void) => (() => void),
): HarmonyRuntime {
  const surfaces = new Map<string, HarmonySurface>()
  const listeners = new Set<() => void>()
  let glass = detectGlass()

  const notify = (): void => { for (const listener of listeners) listener() }

  const service: HarmonyService = {
    version: CONTRACT_VERSION,
    registerSurface: (surface) => {
      surfaces.set(surface.id, surface)
      notify()
      return () => { surfaces.delete(surface.id); notify() }
    },
    surfaces: () => [...surfaces.values()],
    glassAware: () => glass,
    onChange: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }

  const root = document.documentElement
  root.style.setProperty(VARS.contract, CONTRACT_VERSION)

  const refreshMaterial = (): void => {
    const next = detectGlass()
    root.style.setProperty(VARS.glassAware, next ? '1' : '0')
    // The fill every opaque surface in enhancer.module.css reads. When the
    // material is translucent the plugin must NOT paint a solid rectangle over
    // it (that is the "hole in the glass" failure); it yields instead.
    //
    // The value is resolved to a LITERAL color here rather than published as
    // `var(--dsw-alias-bg-base)`: the theme declares that alias on `body`, so a
    // var() stored on <html> is invalid at computed-value time and reads back as
    // empty (measured). refreshMaterial re-resolves on the theme event and on
    // the poll, so a literal stays current.
    const base = next ? 'transparent' : (getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim() || 'var(--dsw-alias-bg-base)')
    root.style.setProperty('--enhc-solid-fill', base)
    const wasSolid = root.style.getPropertyValue(VARS.surfaceSolid) !== '0'
    root.style.setProperty(VARS.surfaceSolid, next ? '0' : '1')
    if (next !== glass) { glass = next; notify() }
    else if (!wasSolid && !next) notify()
  }
  refreshMaterial()

  const unsubscribeTheme = onThemeChange?.(refreshMaterial)
  const poll = window.setInterval(refreshMaterial, 2000)
  const disposeService = provide('uiHarmony', service)

  return {
    service,
    refreshMaterial,
    dispose: () => {
      disposeService()
      if (unsubscribeTheme !== undefined) unsubscribeTheme()
      window.clearInterval(poll)
      surfaces.clear()
      listeners.clear()
      root.style.removeProperty(VARS.contract)
      root.style.removeProperty(VARS.glassAware)
      root.style.removeProperty(VARS.surfaceSolid)
      root.style.removeProperty('--enhc-solid-fill')
    },
  }
}
