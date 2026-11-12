/**
 * `GeneralHeader` — the header block registered first on Settings → General.
 *
 * Layer: self (our own page copy), rendered through the harness header recipe
 * so it is structurally identical to every other page's header.
 */
import * as React from 'react';
/**
 * The General settings page header block (title + description), registered
 * first in General.
 *
 * Rendered by {@link SettingsPageHeader}, the plugin's single header recipe: the
 * same two sibling nodes (`h2.enhc-page-title` + `p.enhc-page-intro`) that the
 * reconciler puts on every other settings page, and the same skeleton the
 * official pages ship. It used to be an inline-styled div column of its own — a
 * second implementation of the official header numbers that no stylesheet rule
 * could reach.
 * @returns the official two-node header.
 */
export declare function GeneralHeader(): React.ReactElement;
