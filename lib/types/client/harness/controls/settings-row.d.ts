/**
 * `SettingsRow` — the official settings-row skeleton.
 *
 * Layer: harness (copied from the product's settings pages): title and
 * description stacked on the left with a 48px right gutter, the control in a
 * `flex: none` box capped at 60% width, and the row's closing hairline. The
 * tokens are the product's own, so the row reads as native on any page it is
 * injected into.
 */
import * as React from 'react';
/**
 * One settings row: title + description on the left, control on the right.
 * @param props.title - row label.
 * @param props.desc - one-line explanation under the label.
 * @param props.control - the control element rendered on the right.
 * @returns the row element.
 */
export declare function SettingsRow({ title, desc, control }: {
    title: string;
    desc: string;
    control: React.ReactNode;
}): React.ReactElement;
