/**
 * `usePopoverPosition` — fixed-coordinate placement for a menu opened from a trigger.
 *
 * Layer: core (infrastructure, React). Extracted verbatim from the inline
 * geometry `FontSelector` computed in its click handler; the numbers are the
 * product's own menu behaviour (218px min width, 12px viewport margin, 40px
 * rows plus 2px of padding), so this is a recipe, not a knob.
 *
 * It only COMPUTES: the caller hands the returned object to the menu's style.
 */
/** A resolved fixed placement for the popover. */
export interface PopoverPosition {
    left: number;
    top: number;
    maxHeight: number;
}
/**
 * Place a `position: fixed` menu under (or above) the clicked trigger.
 *
 * Always returns a fresh object, so the caller can call it on every open and
 * store the result in state; `null` is never returned (the caller only asks
 * while opening).
 * @param trigger - the element that was clicked (its rect anchors the menu).
 * @param rowCount - number of rows the menu will carry, for the height estimate.
 * @returns the fixed left/top and the available max height.
 */
export declare function computePopoverPosition(trigger: HTMLElement, rowCount: number): PopoverPosition;
/**
 * State holder for the placement above: `null` until the menu is opened, and
 * the last resolved placement thereafter (it is intentionally NOT recomputed on
 * scroll or resize — the menu closes on pointerdown elsewhere).
 * @returns the current position and its setter.
 */
export declare function usePopoverPosition(): [PopoverPosition | null, (next: PopoverPosition | null) => void];
