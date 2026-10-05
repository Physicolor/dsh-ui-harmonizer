/* @dsh-split-header-fit
 * harness/header-fit.ts — Serves: keeps the session title readable by retiring
 * header badges, in the order the user asked for, as the header narrows.
 * Why here: the header row is the one surface the frame's column track rewrites
 * on every right-panel toggle, and the badges are the only contents of it that
 * may be spent on the title.
 * Origin: new (2026-10-05). The stylesheet half is the `flex: none` on the tab
 * strip plus the `[data-enhc-header-hidden]` rule in session-header.module.css.
 */
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

/** The header row whose width decides how many badges fit. */
const ROW_SELECTOR = "[class$='_titleRow']"

/** The session title — the box the badges have to leave room for. */
const CRUMBS_SELECTOR = "[class$='_titleCluster'] > [class$='_crumbs']"

/**
 * The badges' seat.
 *
 * Matched by SLOT ATTRIBUTE, never by class: the product's own module class is
 * hashed (`Dc7zOa_…`) and a suffix match on the seat's wrapper is exactly the
 * kind of selector that dies silently on the next build. The seat is
 * `display: contents`, so its children are the row's flex items.
 */
const SEAT_SELECTOR = "[data-slot='conversation.session.header.actions']"

/** Marks a badge this module has taken out of the row. The stylesheet hides it. */
const HIDDEN_ATTR = 'data-enhc-header-hidden'

/** px the title keeps before the next badge is dropped. See the module doc. */
const TITLE_FLOOR = 160

/** px of slack required before a hidden badge is allowed back. See the module doc. */
const TITLE_SLACK = 24

/** The four rungs, in the order the user asked for them to be spent. */
type Badge = 'preset' | 'team' | 'subagent' | 'other'

/**
 * Rung order. `other` is last and catches everything this module cannot name —
 * today the background-task counter — so an unrecognized badge is only ever the
 * badge that survives longest, never one that is hidden by surprise.
 */
const RANK: Record<Badge, number> = { preset: 0, team: 1, subagent: 2, other: 3 }

/**
 * Name a badge from the attributes the product guarantees.
 *
 * Every one of these is locale-free and hash-free, which is the point: the
 * strings the user sees (标准模式, 智能体团队, 子智能体) are runtime locale
 * lookups — they do not exist anywhere in the app archive — so matching text
 * would work in exactly one language and break on the next build's class hashes
 * anyway. Sources, read out of the archive:
 *
 *   subagent  SubagentCatalogAction: the trigger is `aria-haspopup="tree"`.
 *   team      TeamAction: the root carries `data-team-action`.
 *   preset    AgentPresetLabel renders a bare `span` — the only non-`div`
 *             badge in the seat, and the only badge whose box is its own label.
 *
 * @param el - one direct child of the seat.
 * @returns the rung this badge belongs to.
 */
function classifyBadge(el: Element): Badge {
  if (el.querySelector('[aria-haspopup="tree"]') !== null) return 'subagent'
  if (el.matches('[data-team-action]') || el.querySelector('[data-team-action]') !== null) return 'team'
  if (el.tagName === 'SPAN') return 'preset'
  return 'other'
}

/**
 * The seat's children, sorted into the ladder order.
 *
 * A stable sort on the rung keeps same-rung badges (there is one `other` today)
 * in their document order, so the ladder never reorders what the user sees.
 *
 * @param seat - the badges' seat.
 * @returns the badge elements, most-spendable first.
 */
function orderBadges(seat: Element): HTMLElement[] {
  return [...seat.children]
    .map((el, index) => ({ el: el as HTMLElement, index, rank: RANK[classifyBadge(el)] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.el)
}

/**
 * Put the row into rung `hidden`: hide the first `hidden` badges, show the rest.
 *
 * Writes are guarded by a `hasAttribute` compare because `setAttribute` dirties
 * style even when the value is unchanged — re-asserting the same rung on every
 * frame of a panel animation would otherwise re-invalidate the header fifteen
 * times a second for nothing.
 *
 * @param badges - the ordered badges.
 * @param hidden - how many of them, from the front, should be gone.
 */
function applyRung(badges: HTMLElement[], hidden: number): void {
  for (let i = 0; i < badges.length; i += 1) {
    const gone = i < hidden
    if (gone === badges[i].hasAttribute(HIDDEN_ATTR)) continue
    if (gone) badges[i].setAttribute(HIDDEN_ATTR, '')
    else badges[i].removeAttribute(HIDDEN_ATTR)
  }
}

/**
 * Mount the fit. Returns the disposer `ctx.effect` wants; every observer, the
 * attribute this module wrote and the last rung all go away with it.
 */
export function mountHeaderFit(): () => void {
  let row: HTMLElement | null = null
  let seat: HTMLElement | null = null
  let crumbs: HTMLElement | null = null
  let badges: HTMLElement[] = []
  /** The rung currently applied. The search starts here, not at zero. */
  let hidden = 0

  /**
   * Apply rung `n` and read back what the title gets.
   *
   * The read is the point of the whole module: it is the product's own layout
   * answering "is the title readable now?", which is a question no arithmetic
   * over badge widths can answer while the widths themselves depend on the row.
   *
   * @param n - candidate rung.
   * @returns `_crumbs`'s content width in that rung.
   */
  const titleWidthAt = (n: number): number => {
    applyRung(badges, n)
    return crumbs === null ? TITLE_FLOOR : crumbs.clientWidth
  }

  /**
   * Re-run the ladder against the row's current width.
   *
   * Runs inside the observers' callbacks (after layout, before paint), so the
   * rung the user first sees is the rung the layout implies — the badges never
   * paint at a width they are about to be removed from.
   */
  const fit = (): void => {
    if (badges.length === 0) {
      // Nothing to spend: either no badges in this session or the header is
      // gone. Still assert rung 0 so a session switch cannot leave a stale
      // attribute behind on a recycled node.
      hidden = 0
      return
    }
    let next = Math.min(hidden, badges.length)
    // Retire badges until the title reaches the floor, or until none are left.
    while (next < badges.length && titleWidthAt(next) < TITLE_FLOOR) next += 1
    // Give them back only with real slack, so a threshold cannot flip-flop.
    while (next > 0 && titleWidthAt(next - 1) >= TITLE_FLOOR + TITLE_SLACK) next -= 1
    hidden = next
    applyRung(badges, hidden)
  }

  const seatObserver = new MutationObserver(() => {
    // The badge set changed (a job started, a subagent appeared, the session
    // switched): re-order from the DOM and re-run. Observing childList +
    // characterData but NOT attributes is deliberate — this module's own writes
    // are attributes, so a filter that included them would make the observer
    // feed itself.
    badges = seat === null ? [] : orderBadges(seat)
    fit()
  })

  /**
   * (Re)bind to the current row/seat and hand them to the observers.
   *
   * Called on mount and whenever the current nodes leave the document. The
   * ResizeObserver delivers an initial entry to a newly observed target, so a
   * rebind always ends in a `fit()` without any extra polling.
   */
  const sync = (): void => {
    const nextRow = document.querySelector<HTMLElement>(ROW_SELECTOR)
    const nextSeat = document.querySelector<HTMLElement>(SEAT_SELECTOR)
    const nextCrumbs = document.querySelector<HTMLElement>(CRUMBS_SELECTOR)
    if (nextRow === row && nextSeat === seat && nextCrumbs === crumbs) return
    row = nextRow
    seat = nextSeat
    crumbs = nextCrumbs
    rowSizeObserver.disconnect()
    if (row !== null) rowSizeObserver.observe(row)
    seatObserver.disconnect()
    if (seat !== null) seatObserver.observe(seat, { childList: true, subtree: true, characterData: true })
    badges = seat === null ? [] : orderBadges(seat)
    fit()
  }

  const rowSizeObserver = new ResizeObserver(() => {
    if (row === null || !row.isConnected) {
      sync()
      return
    }
    fit()
  })

  /**
   * Rebind when the header is rebuilt (session switch, hot reload).
   *
   * The document-level observer exists only for that: while the bound nodes are
   * connected it does one `isConnected` check and returns, because every
   * geometry and badge-set change already reaches this module through the two
   * observers above. `isConnected` is a DOM flag, so the steady-state cost of
   * this observer is the callback itself, no layout.
   */
  const documentObserver = new MutationObserver(() => {
    if (row !== null && row.isConnected && seat !== null && seat.isConnected) return
    sync()
  })

  sync()
  documentObserver.observe(document.body, { childList: true, subtree: true })

  return () => {
    documentObserver.disconnect()
    seatObserver.disconnect()
    rowSizeObserver.disconnect()
    // Sweep the document rather than the bound list: the seat may have been
    // replaced since the last `sync()`, and its predecessor's badges are the
    // nodes most likely to still be carrying the attribute.
    for (const node of document.querySelectorAll(`[${HIDDEN_ATTR}]`)) node.removeAttribute(HIDDEN_ATTR)
    badges = []
    hidden = 0
  }
}
