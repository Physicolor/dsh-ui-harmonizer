/**
 * `layoutContainer` — the ancestor that actually lays a node out.
 *
 * Layer: core (pure DOM, no React, no tokens). Shared by the settings-header
 * reconciler and anything else that has to reason about the product's slot
 * outlets, which are `display: contents` wrappers contributing no box of their
 * own. Moved verbatim out of `settings-page.ts`.
 */
/**
 * Walk up while a node is `display: contents`, which contributes no box of its
 * own (the product's slot outlets use it, so the flex container above is the
 * one owning the gap).
 * @param node - the element to start from (usually a header's parent).
 * @returns the first ancestor that creates a box.
 */
export declare function layoutContainer(node: HTMLElement | null): HTMLElement | null;
