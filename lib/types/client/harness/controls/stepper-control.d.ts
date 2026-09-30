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
import * as React from 'react';
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
export declare function StepperControl({ min, max, step, value, onChange, unit }: {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    unit: string;
}): React.ReactElement;
