/**
 * `StepperControl` — the official stepper recipe, replicated.
 *
 * Layer: harness (copied from the product's theme font-size row): a pill
 * carrying the centred value, an up/down arrow column revealed on hover and
 * anchored to the pill's right edge, and the unit label after the pill. The
 * geometry lives in `self/settings-controls.module.css` (`uitw-stepper*`);
 * re-check it against the installed primitives when the product changes.
 *
 * Values follow the persisted setting; the arrows step by `step` and clamp to
 * [min, max].
 */

import * as React from 'react'
import { useMirrored } from '../../core/react/use-mirrored.ts'

/**
 * Numeric stepper with a local mirror so the value updates immediately on
 * click; an external change to the same knob is adopted on the next render.
 * @param props.min - smallest allowed value (also disables the down arrow).
 * @param props.max - largest allowed value (also disables the up arrow).
 * @param props.step - increment per arrow press.
 * @param props.value - the persisted value.
 * @param props.onChange - called with the clamped next value.
 * @param props.unit - unit suffix printed after the pill and in arrow labels.
 * @returns the stepper element.
 */
export function StepperControl({ min, max, step, value, onChange, unit }: {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit: string
}): React.ReactElement {
  const [local, setLocal] = useMirrored(value)
  const bump = (delta: number): void => {
    const next = Math.min(max, Math.max(min, local + delta))
    if (next === local) return
    setLocal(next)
    onChange(next)
  }
  const arrow = (key: string, dir: 'up' | 'down', disabled: boolean, delta: number): React.ReactElement =>
    React.createElement('button', {
      key, type: 'button', className: 'uitw-stepper-arrow', disabled,
      'aria-label': `${delta > 0 ? '+' : ''}${delta} ${unit}`,
      onClick: () => bump(delta),
    }, React.createElement('svg', { width: 9, height: 9, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
      React.createElement('path', {
        d: dir === 'up' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4',
        stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
      })))
  return React.createElement('div', { className: 'uitw-stepper-control' }, [
    React.createElement('div', { key: 'pill', className: 'uitw-stepper' }, [
      React.createElement('span', { key: 'v', className: 'uitw-stepper-value' }, String(local)),
      React.createElement('span', { key: 'a', className: 'uitw-stepper-arrows' }, [
        arrow('up', 'up', local >= max, step),
        arrow('down', 'down', local <= min, -step),
      ]),
    ]),
    React.createElement('span', { key: 'u', className: 'uitw-stepper-unit' }, unit),
  ])
}
