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
 * material watcher (a MutationObserver on the theme attributes — the way the
 * product actually applies a theme — plus the optional `theme/change` hook and
 * a cheap poll so nothing else can leave the published variables stale).
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

  // The theme reaches the page as ATTRIBUTES, not as a service call: the token
  // layers are `body[data-ds-dark-theme]` (the dark scope) and the shell writes
  // `data-ds-theme-source` on <html>. Watching those two elements makes the
  // flip observable in the same frame, which the poll alone is not: measured on
  // a live toggle (2026-10-02, DSH 0.2.0-rc.2), `--enhc-solid-fill` followed the
  // theme 986 ms late — i.e. the session header, the better-sidebar chrome and
  // every other surface painted with the PREVIOUS theme's fill for up to one
  // poll interval, which reads as "some elements did not enter dark mode".
  // `class` is watched too because a theme may flip by class. `style` is NOT:
  // refreshMaterial writes root style properties itself.
  const THEME_ATTRS = ['class', 'data-ds-dark-theme', 'data-ds-theme-source']
  const themeObserver = new MutationObserver(refreshMaterial)
  themeObserver.observe(root, { attributes: true, attributeFilter: THEME_ATTRS })
  if (document.body !== null) themeObserver.observe(document.body, { attributes: true, attributeFilter: THEME_ATTRS })

  const poll = window.setInterval(refreshMaterial, 2000)
  const disposeService = provide('uiHarmony', service)

  return {
    service,
    refreshMaterial,
    dispose: () => {
      disposeService()
      if (unsubscribeTheme !== undefined) unsubscribeTheme()
      themeObserver.disconnect()
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
