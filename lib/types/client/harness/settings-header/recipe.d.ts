/**
 * `SettingsPageHeader` — the React half of the one settings-header architecture.
 *
 * Layer: harness. It renders the same two nodes the official pages ship (an
 * `<h2>` page title and a `<p>` page description, as siblings, with NO wrapper
 * of our own), so this plugin's own pages are structurally identical to a
 * foreign page's. Any change here must be mirrored by the reconciler in
 * `./reconciler.ts`, which stamps the same class pair onto other people's pages.
 */
import * as React from 'react';
/**
 * The page header as a React element: exactly the two nodes a foreign page
 * ships, with no wrapper of our own — one skeleton for every page.
 * @param props.title - page title text.
 * @param props.intro - page description text.
 * @returns the title and description as siblings.
 */
export declare function SettingsPageHeader({ title, intro }: {
    title: string;
    intro: string;
}): React.ReactElement;
