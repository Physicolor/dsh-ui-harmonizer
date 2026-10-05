/**
 * `FontSelector` — this plugin's font-preset picker.
 *
 * Layer: self (the options are OUR `FONT_PRESETS`, not a product control). The
 * control itself is NOT bespoke: it is `harness/controls/SelectControl`, i.e. the
 * product's own settings Select, so this row is drawn by the same rules as
 * 权限 / 语言. The only local content is the option table and the installed-font
 * hint, which greys nothing and blocks nothing — an absent family is annotated,
 * never hidden, because the reader may be picking a family for another machine's
 * config or about to install it.
 *
 * REPLACED 2026-09-30: this file used to carry ~60 lines of inline styles for a
 * look-alike pill and menu (radius 18, a 1px `border-inverted`, the
 * `--dsw-specific-menu` fill, `--dsw-shadow-lv3`, 40px rows). Every one of those
 * numbers was a different control than the product draws; the shared
 * SelectControl now carries the measured recipe instead.
 */
import * as React from 'react';
import type { FONT_PRESETS } from '../font-presets.ts';
/**
 * Font-preset dropdown: the product's settings Select over our presets.
 * @param props.value - the persisted preset id.
 * @param props.onChange - called with the picked preset id.
 * @param props.presets - the preset table to list.
 * @returns the trigger and, while open, its menu.
 */
export declare function FontSelector({ value, onChange, presets }: {
    value: string;
    onChange: (id: string) => void;
    presets: Readonly<typeof FONT_PRESETS>;
}): React.ReactElement;
