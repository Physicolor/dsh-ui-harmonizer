/**
 * Harness DOM anchors — the stable seams this plugin aligns its overlay to.
 *
 * Layer: harness (every selector here names a DSH-owned structure, so it is
 * re-checked against each product release). Kept apart from the component that
 * uses them so the Doctor and any future overlay can reason about the same
 * anchors instead of re-deriving them.
 */

/** The overlay's top edge sits 1px below the column top so the drop shadow has
 * room to render inside the viewport (a flush top would clip it). */
export const TOP_SHIM = 1

/**
 * Find the center column element. The AppFrame wraps the conversation slot in
 * `div.centerCol`, and the slot outlet (whose wrapper is display:contents) is
 * its direct DOM child — a stable, hash-independent seam.
 *
 * DSH 0.1.5 moved the conversation from a root child slot (`conversation`) to a
 * keyed entry of the new `main` slot, which declares `main.conversation`. Both
 * anchors are display:contents wrappers, so `parentElement` can no longer be
 * trusted on the newer tree; resolve the column by its stable class suffix and
 * keep the old parent lookup as the fallback for 0.1.0/0.1.1 builds.
 * @returns the center column element, or null if not yet mounted.
 */
export function findCenterColumn(): HTMLElement | null {
  const slot = document.querySelector('[data-slot="main.conversation"], [data-slot="conversation"]')
  if (slot === null || slot === undefined) return null
  const col = slot.closest('[class$="_centerCol"]')
  if (col instanceof HTMLElement) return col
  const parent = slot.parentElement
  if (parent === null || parent === undefined) return null
  return parent
}
