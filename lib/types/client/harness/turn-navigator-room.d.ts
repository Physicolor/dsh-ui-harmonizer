/**
 * Turn navigator: show it whenever it genuinely fits, not when a third party
 * happens to leave the product's container above 900px.
 *
 * Layer: harness (the product's own conversation chrome). Seam: the product's
 * `[data-conversation-scroll]` host and its `_column` class SUFFIX. No private
 * module class name is read, no element is moved, and no CSS variable is
 * consumed — the two boxes are measured directly.
 *
 * WHY
 *
 * The product hides the navigator with a single container query
 * (`@container (width <= 900px) { .frame { display: none } }`) whose container is
 * the navigator's own slot — and that slot's inline size is the conversation
 * scroll box's content width minus its own 32px-per-side padding. So every
 * `padding-right` any plugin writes on `[data-conversation-scroll]` shrinks the
 * navigator's container 1:1 and switches the navigator off long before the
 * transcript runs out of room. Measured 2026-10-10 on 0.2.0-rc.2: the rail's
 * 460px reservation put the container at 789px on a 1600px viewport while the
 * transcript (748px) still had 260px of centering slack, 130px of it on the
 * right — room the navigator could have used and was not allowed to.
 *
 * WHAT THIS MEASURES
 *
 * The navigator occupies the right edge of the strip between the transcript and
 * the column edge: 28px wide, 12px in from the slot's padding box. The column is
 * laid out with `margin: 0 auto` inside the scroll host's content box, so the
 * strip is half of `content box width - column width`, and the navigator fits
 * whenever that half is at least `28 + 12 + 16 = 56px`. A right-side rail's
 * reservation is already part of the host's padding and therefore already out of
 * its content box, so no third-party variable has to be trusted for it — which
 * matters, because a plugin animating its own reservation leaves its published
 * variable and its padding disagreeing in the middle of the transition.
 *
 * This module publishes the result so the stylesheet can gate on it:
 *
 *   <html data-nav-room='1'>                  the navigator may be shown
 *   --enhc-nav-free / --enhc-nav-free-left    the measured widths (px, for probes)
 *   --enhc-nav-needed                          the width the navigator requires
 *
 * Nothing else is written and the product keeps ownership of the navigator's own
 * behaviour — this only removes a `display: none` that the container query
 * applied for a reason that does not hold. The default (no attribute) is the
 * product's behaviour, so an unmeasured or unmounted page is unchanged.
 */
/** The navigator's own width (`TurnNavigator.module.css`, `.frame`). */
export declare const NAV_FRAME_WIDTH = 28;
/** The navigator's inset from the slot's padding box (`right: 12px`). */
export declare const NAV_FRAME_OFFSET = 12;
/** Clearance kept between the navigator and the nearest content edge. */
export declare const NAV_FRAME_GAP = 16;
/** Free width the navigator needs on one side: 28 + 12 + 16. */
export declare const NAV_MIN_FREE: number;
/**
 * The two free widths beside the transcript, in px.
 *
 * The scroll host is the product's harness box: its content box holds the
 * centered column, so half of `content box width - column width` is the slack on
 * each side, and the navigator's `right: 12px` inset and its own width both fit
 * inside that half. A right-side rail's reservation is part of the host's
 * padding, so it is already out of the content box — this does not have to
 * subtract it, which also keeps the answer right while a plugin animates its own
 * reservation (dsh-widgets' padding and its published `--dsx-rail-w` disagree
 * mid-transition).
 *
 * The column's own resolved width is read back rather than recomputed from
 * `--dsh-chat-content-width`, so an explicit `--dsh-chat-user-width` (the width
 * row or either drag handle) and the product's adaptive clamp are honored
 * without duplicating its resolution.
 * @returns `{ right, left }` free widths; `0` for both when there is no session.
 */
export declare function freeBesidesTranscript(): {
    right: number;
    left: number;
};
/**
 * Measure and publish. Safe to call at any time; publishes "no room" when the
 * conversation is not mounted.
 * @returns true when this call changed what is published.
 */
export declare function publishTurnNavigatorRoom(): boolean;
/**
 * Install the room probe.
 *
 * Re-measures on a viewport resize, on a size change of the conversation host or
 * of the transcript column (a rail, a panel, the product's own track, a mounted
 * session), and on the conversation host appearing or being replaced. Work is
 * coalesced into one animation frame, and a measurement that changes nothing
 * writes nothing.
 * @returns the disposer, which also clears every published value.
 */
export declare function mountTurnNavigatorRoom(): () => void;
