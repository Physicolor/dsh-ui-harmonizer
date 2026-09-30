/**
 * State and CSS application for dsh-ui-harmonizer.
 *
 * Three channels push values into the page:
 * - Static override rules in enhancer.module.css read CSS custom properties
 *   (--enhancer-*) which applyState() updates on <html>.
 * - Content font size is NOT owned here any more. DSH 0.1.5 ships its own
 *   content-size row (`ui-theme` namespace, field `fontSize`) and publishes it
 *   as an inline `--dsh-content-font-size` on <body>; our rules derive from
 *   that variable in CSS (`calc(...)`), so one owner, no double source.
 * - The chosen font stack is applied through INLINE custom properties on
 *   <body> / <html>. This is deliberate: the tokens are declared by the theme
 *   inside a `<style>` tag that the product appends AFTER our bundle's tag
 *   (measured: ours at head order 4, the theme's at 25), so an equal-specificity
 *   stylesheet rule of ours loses no matter when we rewrite it. Inline
 *   properties are order-independent and the disposer removes them.
 */

import type { EnhancerState } from './state-model.ts'
import { VARS } from './harmony/contract.ts'
import { saveState } from './state-store.ts'
import { clampChatWidth, writeChatWidth } from '../harness/chat-width.ts'
import { applyFont, clearFontProps } from '../harness/fonts.ts'

/* ------------------------------------------------------------------ */
/*  Root properties + apply/dispose                                    */
/* ------------------------------------------------------------------ */

/**
 * Every root custom property this plugin publishes, in ONE place so the disposer
 * cannot drift from the writers.
 *
 * `--enhc-*` is the Harmony Contract surface (see harmony/contract.ts `VARS`);
 * the `--enhancer-*` pair are the pre-0.10 internal names, kept because the
 * sidebar stylesheet still sizes itself with `--enhancer-sidebar-scale`
 * (27 consumers) and because the Doctor recognizes this plugin's own sheets by
 * it. Both generations are written with the same value.
 */
const ROOT_PROPERTIES = [
  VARS.contentWidth,
  VARS.sidebarScale,
  '--enhancer-content-width',
  '--enhancer-sidebar-scale',
] as const

/**
 * Push the current state into the page and persist it. Idempotent; safe to call
 * on every slider move.
 * @param state - current enhancer state.
 */
export function applyState(state: EnhancerState): void {
  saveState(state)
  const root = document.documentElement
  const width = clampChatWidth(state.width)
  writeChatWidth(width)
  const scale = String(state.sidebarSize / 14)
  root.style.setProperty(VARS.contentWidth, `${width}px`)
  root.style.setProperty(VARS.sidebarScale, scale)
  root.style.setProperty('--enhancer-content-width', `${width}px`)
  root.style.setProperty('--enhancer-sidebar-scale', scale)
  root.classList.toggle('enhc-center-card-on', state.card)
  applyFont(state)
}

/**
 * Dispose everything this module wrote: the inline font properties, the root
 * custom properties and the card class. Called from the plugin fiber's effect
 * disposer so stopping/updating the plugin leaves zero residue.
 */
export function disposeDynamicStyle(): void {
  clearFontProps()
  const root = document.documentElement
  for (const property of ROOT_PROPERTIES) root.style.removeProperty(property)
  root.classList.remove('enhc-center-card-on')
}
