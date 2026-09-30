/**
 * Font application on the product's official channels.
 *
 * The chosen stack is written as INLINE custom properties on `<body>` / `<html>`
 * publishing `--dsw-font-*` and the `--dsh-content-font-*` references. This is
 * deliberate: the tokens are declared by the theme inside a `<style>` tag that
 * the product appends AFTER our bundle's tag (measured: ours at head order 4,
 * the theme's at 25), so an equal-specificity stylesheet rule of ours loses no
 * matter when we rewrite it. Inline properties are order-independent and the
 * disposer removes them.
 */

import { FONT_PRESETS } from '../self/font-presets.ts'
import type { EnhancerState } from '../core/state-model.ts'

/** One preset resolved to a stack, or null for the product default. */
function presetStack(id: string): { stack: string, mono: boolean } | null {
  const preset = FONT_PRESETS.find(p => p.id === id)
  if (preset === undefined || preset.stack === null) return null
  return { stack: preset.stack, mono: preset.mono }
}

/* ------------------------------------------------------------------ */
/*  Font application (inline custom properties, order-independent)      */
/* ------------------------------------------------------------------ */

/** Official size channel, referenced so the product's own row keeps working. */
const SIZE = 'var(--dsh-content-font-size, 14px)'
const LINE = 'calc(24px + var(--dsh-content-font-delta, 0px))'
const DELTA = 'var(--dsh-content-font-delta, 0px)'
const SIZE_2 = 'var(--dsh-content-font-size-secondary, 13px)'
const DELTA_2 = 'var(--dsh-content-font-delta-secondary, 0px)'

/**
 * Prose tokens, expressed on top of the product's own size variables.
 *
 * Every size here is a reference to the official channel (`--dsh-content-font-
 * size` and its delta), never a fixed px, so installing this plugin cannot
 * freeze or fight the product's own font-size row. Only the family changes.
 * @param family - the font stack to substitute.
 * @returns token name → value.
 */
function proseTokens(family: string): Record<string, string> {
  const f = family
  return {
    '--dsw-font-markdown-base': `400 ${SIZE}/${LINE} ${f}`,
    '--dsw-font-markdown-base-strong': `600 ${SIZE}/${LINE} ${f}`,
    '--dsw-font-markdown-base-italic': `italic 400 ${SIZE}/${LINE} ${f}`,
    '--dsw-font-markdown-base-strong-italic': `italic 600 ${SIZE}/${LINE} ${f}`,
    '--dsw-font-markdown-h1': `700 calc(21px + ${DELTA})/calc(30px + ${DELTA}) ${f}`,
    '--dsw-font-markdown-h2': `700 calc(19px + ${DELTA})/calc(28px + ${DELTA}) ${f}`,
    '--dsw-font-markdown-h3': `700 calc(18px + ${DELTA})/calc(26px + ${DELTA}) ${f}`,
    '--dsw-font-markdown-h4': `600 ${SIZE}/calc(24px + ${DELTA}) ${f}`,
    '--dsw-font-markdown-table': `400 ${SIZE_2}/calc(22px + ${DELTA_2}) ${f}`,
    '--dsw-font-markdown-table-head': `500 ${SIZE_2}/calc(22px + ${DELTA_2}) ${f}`,
  }
}

/**
 * Code tokens, only written for monospace presets — a prose stack must never
 * drag the code family with it (the product keeps `--ds-font-family-code`).
 * @param family - the monospace stack to substitute.
 * @returns token name → value.
 */
function codeTokens(family: string): Record<string, string> {
  return {
    '--dsw-font-markdown-code': `400 12px/19px ${family}`,
    '--dsw-font-markdown-code-block': `400 11px/19px ${family}`,
    '--dsw-font-markdown-code-block-small': `400 11px/16px ${family}`,
    '--dsw-font-markdown-code-font-family': family,
  }
}

/** Inline properties this plugin owns right now, for exact removal. */
let appliedFontProps: Array<{ el: HTMLElement, name: string }> = []

/** Remove every inline font property the plugin wrote. */
export function clearFontProps(): void {
  for (const { el, name } of appliedFontProps) el.style.removeProperty(name)
  appliedFontProps = []
}

/**
 * Apply the chosen font stack.
 * @param state - current enhancer state.
 */
export function applyFont(state: EnhancerState): void {
  clearFontProps()
  const preset = presetStack(state.fontId)
  if (preset === null) return
  const root = document.documentElement
  const body = document.body
  if (body === null) return
  // Whole-UI scope owns the product-wide family token (fixed at :root by the
  // product, with no user setting of its own).
  if (state.fontScope === 'ui') {
    root.style.setProperty('--dsw-font-family', preset.stack)
    appliedFontProps.push({ el: root, name: '--dsw-font-family' })
  }
  const tokens = { ...proseTokens(preset.stack), ...(preset.mono ? codeTokens(preset.stack) : {}) }
  for (const [name, value] of Object.entries(tokens)) {
    body.style.setProperty(name, value)
    appliedFontProps.push({ el: body, name })
  }
}
