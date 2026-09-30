/**
 * `SegmentedControl` — the official selector-pill recipe, replicated.
 *
 * Layer: harness (a copy of the product's own control, used wherever this
 * plugin needs a two-or-more-way exclusive choice). The class names are ours
 * (`uitw-segmented` / `uitw-segment`), but the geometry they carry in
 * `self/settings-controls.module.css` is transcribed from the official
 * selector pills — re-check it against the installed primitives when the
 * product's control language changes.
 */

import * as React from 'react'
import { useMirrored } from '../../core/react/use-mirrored.ts'

/**
 * Product-style segmented control (one row, mutually exclusive options).
 * Local mirror so the selection paints immediately on click.
 * @param props.options - the option ids and their labels.
 * @param props.value - the selected option id.
 * @param props.onChange - called with the newly selected id.
 * @returns the radiogroup element.
 */
export function SegmentedControl<T extends string>({ options, value, onChange }: {
  options: ReadonlyArray<{ id: T, label: string }>
  value: T
  onChange: (value: T) => void
}): React.ReactElement {
  const [local, setLocal] = useMirrored(value)
  return React.createElement('div', { className: 'uitw-segmented', role: 'radiogroup' },
    options.map(option => React.createElement('button', {
      key: option.id,
      type: 'button',
      role: 'radio',
      'aria-checked': local === option.id,
      className: local === option.id ? 'uitw-segment uitw-segment-on' : 'uitw-segment',
      onClick: () => { setLocal(option.id); onChange(option.id) },
    }, option.label)))
}
