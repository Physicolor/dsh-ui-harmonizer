/**
 * `FontSelector` — this plugin's own font-preset picker.
 *
 * Layer: self (the options are OUR `FONT_PRESETS`, not a product control) and
 * the only reason it is not in `harness/`: nothing here is transcribed from the
 * product except the selector-pill look, which the class-free inline styles
 * below reproduce. The pill's geometry is a deliberate copy of the official
 * selector pill; re-check it when the product's control language changes.
 *
 * Two behaviours that must not be "simplified" without re-measuring:
 * - the local mirror (via `useMirrored`) so the pill label updates immediately
 *   on pick, with external changes adopted by the effect;
 * - the installed-font probe, which greys a preset whose family is absent.
 */
import * as React from 'react';
import type { FONT_PRESETS } from '../font-presets.ts';
/**
 * Custom font selector: product selector-pill button + fixed menu.
 * Holds a local mirror of the selected id so the pill label updates
 * immediately on pick; external changes are adopted via the effect.
 * @param props.value - the persisted preset id.
 * @param props.onChange - called with the picked preset id.
 * @param props.presets - the preset table to list.
 * @returns the trigger pill and, while open, its menu.
 */
export declare function FontSelector({ value, onChange, presets }: {
    value: string;
    onChange: (id: string) => void;
    presets: Readonly<typeof FONT_PRESETS>;
}): React.ReactElement;
