/**
 * `SwitchControl` — the product's OWN Switch, one class pair instead of a look-alike.
 *
 * Layer: harness. The geometry lives in
 * `self/settings-controls.module.css` (`.uitw-switch` / `.uitw-switch-thumb`)
 * rather than in inline styles, for the same reason every other control in this
 * plugin is class-driven: only a stylesheet can express `corner-shape: round`,
 * `:focus-visible` and `:disabled`. The declarations there are copied from
 * `@deepseek-ai/dsh-client-ui-primitives`' `Switch.module.css` (read out of the
 * live CSSOM; the product's core CSS carries no data-plugin tag) — 36×20,
 * `padding: 2px`, radius 999px, track `--dsw-alias-border-l3` → on
 * `--dsw-alias-brand-primary`, 16px thumb sliding `translate(16px)` on a .12s
 * transform with no thumb shadow.
 *
 * REPLACED 2026-09-30: the previous inline recipe was 36×22 / radius 11, filled
 * `--dsw-alias-state-business-primary` (DeepSeek BLUE) when on, and carried a
 * 16px thumb with a `0 1px 2px` drop shadow sliding on `left` — a different
 * control from the one the product's own settings rows draw.
 */

import * as React from 'react'
import { useMirrored } from '../../core/react/use-mirrored.ts'

/**
 * A controlled button that flips on click. It holds a local mirror of the value
 * so the thumb slides and the fill changes immediately on click; external value
 * changes (another surface editing the same switch) are adopted via the effect.
 * Without the mirror the parent's in-place state mutation never re-renders this
 * component and the click gives no visual feedback.
 * @param props.checked - the persisted on/off value.
 * @param props.onChange - called with the flipped value.
 * @returns the switch element.
 */
export function SwitchControl({ checked, onChange }: {
  checked: boolean
  onChange: (value: boolean) => void
}): React.ReactElement {
  const [local, setLocal] = useMirrored(checked)
  return React.createElement('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': local,
    className: 'uitw-switch',
    onClick: () => { const next = !local; setLocal(next); onChange(next) },
  }, React.createElement('span', { className: 'uitw-switch-thumb' }))
}
