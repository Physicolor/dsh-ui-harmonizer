/**
 * Font application on the product's official channels.
 *
 * The chosen stack is written as INLINE custom properties on `<body>`
 * publishing `--dsw-font-*` and the `--dsh-content-font-*` references. This is
 * deliberate: the tokens are declared by the theme inside a `<style>` tag that
 * the product appends AFTER our bundle's tag (measured: ours at head order 4,
 * the theme's at 25), so an equal-specificity stylesheet rule of ours loses no
 * matter when we rewrite it. Inline properties are order-independent and the
 * disposer removes them.
 *
 * WHERE the whole-UI family is written is load-bearing, and the target element
 * moved in DSH 0.2.1: the theme used to fix `--dsw-font-family` at `:root`, so
 * an inline property on `<html>` won. 0.2.1 declares it in a `body{…}` rule
 * instead —
 *
 *   :root { --dsw-font-family: var(--dsh-font-family-text-default); … }
 *   body  { --dsw-font-family: var(--dsh-font-family-text, var(--dsh-font-family-text-default)), … }
 *
 * — and a declaration on `body` beats anything inherited from `<html>`, whatever
 * the inline origin. Measured on 0.2.1-rc.2 (live GUI, 2026-10-17): writing
 * `--dsw-font-family` inline on `<html>` left `getComputedStyle(body).fontFamily`
 * at the product default, while the same write on `<body>` — or the official
 * `--dsh-font-family-text` on either element — took effect. The whole-UI scope
 * therefore writes `<body>`, and also publishes the product's own role channel
 * so every rule that reads it directly agrees with the resolved token.
 *
 * A mono preset owns the product's code role the same way (`--dsh-font-family-code`
 * plus the `--ds-font-family-code` token the theme resolves from it).
 *
 * The resolved token is the load-bearing write: the product's own settings
 * applier CLEARS the role variable when its font field is empty (measured on
 * 0.2.1-rc.2 — our inline `--dsh-font-family-text` read back empty after a
 * reload that applied the stack correctly, while `--dsw-font-family` survived).
 * Publishing the role variable too keeps the two channels agreeing wherever the
 * product does not clear it.
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

/**
 * Family channels the whole-UI scope owns, in write order.
 *
 * Both names are written: the product's role variable is what the theme's own
 * `--dsw-font-family` declaration resolves, and the resolved token is what every
 * component actually consumes. Publishing only the role variable would leave the
 * outcome dependent on which of the two bodies held the winning declaration;
 * publishing only the token would leave `var(--dsh-font-family-text)` readers on
 * the product's stack.
 * @param mono - whether the preset is a monospace stack.
 * @returns the custom property names.
 */
function uiFamilyTokens(mono: boolean): string[] {
  const text = ['--dsh-font-family-text', '--dsw-font-family']
  return mono ? [...text, '--dsh-font-family-code', '--ds-font-family-code'] : text
}

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
  const body = document.body
  if (body === null) return
  // Whole-UI scope: `<body>`, not `<html>` — see the module header for the
  // measurement that forced this.
  if (state.fontScope === 'ui') {
    for (const name of uiFamilyTokens(preset.mono)) {
      body.style.setProperty(name, preset.stack)
      appliedFontProps.push({ el: body, name })
    }
  }
  const tokens = { ...proseTokens(preset.stack), ...(preset.mono ? codeTokens(preset.stack) : {}) }
  for (const [name, value] of Object.entries(tokens)) {
    body.style.setProperty(name, value)
    appliedFontProps.push({ el: body, name })
  }
}
