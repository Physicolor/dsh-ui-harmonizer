/**
 * Harness UI Harmonizer — the ONE settings-page header reconciler.
 *
 * Every settings page in the product opens with the same two nodes: an `<h2>`
 * page title and a `<p>` page description, as siblings inside the page's own
 * container. That is the whole skeleton — the official pages ship exactly it
 * (`rtSEdW_section > h2.rtSEdW_title + p.rtSEdW_intro`, `zGbnIq_*`, `pbvGtq_*`).
 *
 * Layer: harness. This module is the single owner of that block on pages we do
 * NOT render: it marks the real heading and description with our class pair
 * (`./classes.ts`), injects the heading when a page ships a description but no
 * title, and makes the title→description distance the OFFICIAL one on every
 * page. Our own pages use the React recipe in `./recipe.tsx` and must end up
 * structurally identical.
 *
 * TWO INVARIANTS, measured on the live panel (scripts/probe-header-geometry.mjs):
 *
 * 1. **Identical coordinates.** The title's viewport position is the same on
 *    every page. The container usually starts flush (measured: title top is the
 *    same 54px below the dialog on all eight pages), and a container that adds
 *    its own `padding-top`/`border-top` is compensated with a matching negative
 *    margin on the title.
 * 2. **Official spacing.** The product's own title→description distance is the
 *    section container's `gap` — 12px on every official page (measured with this
 *    plugin's stylesheets disabled: models / agent presets / bundled plugins all
 *    read 12px). Container gaps differ per page (4 / 12 / 16 / none), and a
 *    block container has no gap at all, so the reconciler MEASURES the container
 *    and writes the difference onto the description's `margin-top`:
 *    `margin-top = 12px − containerGap`. One number, identical on every page,
 *    including third-party ones whose container has its own rhythm.
 *
 * Both are inline styles written by the reconciler and removed again on dispose,
 * so a page that is not a settings section is never touched.
 */
/**
 * Mount the settings-page header normalizer.
 *
 * Re-scans on DOM/attribute changes (the settings panel renders its section
 * lazily and swaps it on navigation) and keeps polling briefly for a late
 * nav/section, exactly like the title fill it replaces — but now through one
 * code path that also handles the pages that DO ship a header.
 * @returns disposer that removes every class, inline spacing and injected title.
 */
export declare function mountSettingsPageHeaders(): () => void;
