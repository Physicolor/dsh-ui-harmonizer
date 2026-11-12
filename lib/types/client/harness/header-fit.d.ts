/**
 * PROGRESSIVE HEADER-BADGE HIDING
 *
 * The header row is a single flex line:
 *
 *   [ _titleCluster (flex: 1 1 0%, min-width: 0)
 *       [ _crumbs      (flex: 0 1 auto, min-width: 0, overflow: hidden)
 *       | _headerActions (flex: none) > seat (display: contents) > [badges]
 *       | tabs         (relocated here by index.ts) ]
 *     _headerUtilities (flex: none, margin-left: 20px)
 *     _headerCorner    (flex: none) ]
 *
 * Only `_crumbs` can shrink, so when the header narrows the product's own
 * behaviour is to squeeze the session title first and the badges not at all.
 * Measured on the three-badge reference session at 1707x1067 with the panel
 * open: the row has 611px, the title's content wants 212px, and the title is
 * allowed 0 of them while the badges keep all 312.
 *
 * The user asked for the opposite trade — hide 标准模式, then 智能体团队, then
 * 子智能体 as the space goes, and bring them back when it returns. That is what
 * this module does, and it is why the stylesheet's tab rule (`flex: none`) and
 * this one are a pair: the tab rule makes wrapping impossible, this one decides
 * how much of the row the badges are allowed to keep.
 *
 * HOW THE DECISION IS MADE
 *
 * Empirically, not arithmetically. The badges' widths are not constants a rule
 * could be written from: 标准模式's label is `span`-level and the product's own
 * `@container (width <= 540px)` (measured against `_titleRow`) hides it entirely
 * below a 540px row, `智能体团队`'s label disappears below 480px, and the
 * background-task count changes width as jobs start and finish. Reading
 * `_crumbs.clientWidth` after applying a candidate rung is the only measure
 * that stays true for all of those, and it costs one forced layout per rung
 * (the row is 5 flex items deep — measured sub-millisecond).
 *
 * The ladder is a PREFIX of the ordered badge list: rung `n` means "the first
 * `n` badges are hidden", so the whole state is one integer and re-running the
 * fit is idempotent.
 *
 * WHY THE FLOOR IS 160px
 *
 * The title is the thing the badges are spent on, so the fit keeps it above a
 * legibility floor rather than chasing its full content width — a long session
 * title would otherwise retire every badge at a window width that still has
 * plenty of room for a truncated one. 160px is ~9 glyphs of the header title's
 * 13px type plus the leading icon: measured against the reference sessions, it
 * is the point where a title is still identifying itself, and it is what
 * produces "标准模式 hidden, the rest kept" at a 611px row and "nothing hidden"
 * at a 957px one. The floor is a floor, not a target: when the row is too
 * narrow for the title to reach it even with every badge gone (measured at a
 * 400px header, the 1024-1440px window with the panel open) the fit stops at
 * the last rung and accepts the squeeze.
 *
 * `TITLE_SLACK` is the hysteresis that keeps the boundary quiet: a badge comes
 * back only with 24px MORE room than it needed to leave. Without it the rung
 * would flip every frame while a header sits exactly on a threshold, and the
 * open animation crosses several thresholds on the way in.
 */
/**
 * Mount the fit. Returns the disposer `ctx.effect` wants; every observer, the
 * attribute this module wrote and the last rung all go away with it.
 */
export declare function mountHeaderFit(): () => void;
