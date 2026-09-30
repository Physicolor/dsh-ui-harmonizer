/**
 * Popup width follows its row — a portalled menu is pinned to the row that opened it.
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH shell's own chrome).
 * Seams: the official slot seats `[data-slot='settings.launcher']` /
 * `[data-slot='settings.trigger']` plus the trigger's `aria-haspopup` /
 * `aria-expanded` state. No private (hashed) class names are read.
 *
 * The product's `Menu` primitive renders a portalled dropdown card whose width is
 * content-driven: the shipped `_list_` recipe is `min-width:218px;
 * max-width:360px`, so a menu opened from a full-width sidebar row lands NARROWER
 * than the row it hangs from. Measured on the desktop account menu (settings
 * launcher seat, `settings.launcher`): the row is the sidebar's full 256px while
 * the 设置 / 意见反馈 / 退出登录 card painted 218px — an obvious "the popup does
 * not belong to this row" seam.
 *
 * This adapter closes that seam for the sidebar's own rows: when a portalled menu
 * opens from a trigger registered in the settings-launcher seat, the card is
 * pinned to the trigger row's width (and therefore shares its left AND right
 * edge). Everything is scoped to that seat — the composer's model/permission
 * pickers and every other menu keep their own recipe untouched.
 *
 * Why JS and not CSS: the portal destroys the DOM relationship (the card is a
 * child of `<body>`, the row lives in the sidebar), and the card carries no
 * owner class when the account plugin leaves `listClassName` unset. The one
 * stable contract at popup time is the OPEN TRIGGER — `aria-haspopup` +
 * `aria-expanded="true"` — plus the slot its row was registered into.
 */

/** Seats whose rows own a full-width popup. */
const LAUNCHER_SEATS = [
  "[data-slot='settings.launcher']",
  "[data-slot='settings.trigger']",
] as const

/** Our marker on a card we sized (removed again on dispose). */
const MARKER = 'data-enhc-anchor-width'

/** Inline properties this adapter writes, for exact removal. */
const OWNED_PROPERTIES = ['width', 'min-width', 'max-width', 'box-sizing'] as const

/**
 * The row a just-opened portalled menu belongs to.
 *
 * The primitive does not link the two nodes (no `aria-controls`, the card is
 * portalled to `<body>`), so the open trigger is the link. Triggers outside the
 * launcher seats are ignored — those menus are not row-shaped.
 *
 * DIALOG TRIGGERS ARE EXCLUDED (fixed 2026-09-30). The seat check alone was not
 * enough: `[data-slot='settings.trigger']` holds the shell's own settings button,
 * whose `aria-haspopup` is `dialog` and whose `aria-expanded` is `true` for as
 * long as the settings dialog is open. The old selector `[aria-haspopup]
 * [aria-expanded='true']` therefore matched it while that dialog was up, and any
 * menu opened on a settings page was force-pinned to the sidebar button's width
 * (and marked `data-enhc-anchor-width`) — a third-party plugin resizing the
 * product's own popups. Accept only MENU triggers: the modern spelling `menu`,
 * plus the legacy boolean `true` that older primitives used.
 * @returns the trigger element, or null when the open menu is not a row menu.
 */
function openRowTrigger(): HTMLElement | null {
  const selector = "[aria-haspopup='menu'][aria-expanded='true'], [aria-haspopup='true'][aria-expanded='true']"
  for (const seat of LAUNCHER_SEATS) {
    const seatEl = document.querySelector(seat)
    if (seatEl === null) continue
    const trigger = seatEl.querySelector(selector)
    if (trigger instanceof HTMLElement) return trigger
  }
  return null
}

/**
 * Pin one portalled menu card to the width of the row that opened it.
 * @param card - the `[role='menu']` element the primitive just mounted.
 */
function alignCard(card: HTMLElement): void {
  const trigger = openRowTrigger()
  if (trigger === null) return
  const width = Math.round(trigger.getBoundingClientRect().width)
  if (!(width > 0)) return
  // border-box: the width has to mean the visible card, whatever box model the
  // page's own menu recipe established (the product list carries 4px padding).
  card.style.boxSizing = 'border-box'
  card.style.width = `${width}px`
  card.style.minWidth = `${width}px`
  card.style.maxWidth = `${width}px`
  card.setAttribute(MARKER, String(width))
}

/**
 * Mount the row-width adapter.
 *
 * A MutationObserver on `document.body` sees the portal mount; the card is
 * already positioned by the primitive's layout effect at that point, so
 * re-measuring the row is free of layout thrash (one rect read per open).
 *
 * State is per mount: the set of cards we wrote to lives in this closure, so a
 * second mount cannot release the first instance's cards (and vice versa) —
 * only this instance's disposer clears exactly its own inline widths.
 * @returns disposer that clears the inline width from any card still mounted.
 */
export function mountMenuAnchorWidth(): () => void {
  /** Menus this instance wrote to. Closed menus leave the document, so it is pruned. */
  const touched = new Set<HTMLElement>()

  const inspect = (node: Node): void => {
    if (!(node instanceof HTMLElement)) return
    if (node.matches("[role='menu']")) {
      touched.add(node)
      alignCard(node)
      return
    }
    for (const card of node.querySelectorAll<HTMLElement>("[role='menu']")) {
      touched.add(card)
      alignCard(card)
    }
  }
  const observer = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) inspect(node)
    // A closed menu is unmounted by the primitive; drop it so the set cannot
    // grow for the life of the session.
    for (const card of touched) if (!card.isConnected) touched.delete(card)
  })
  observer.observe(document.body, { childList: true })
  return () => {
    observer.disconnect()
    for (const card of touched) {
      for (const property of OWNED_PROPERTIES) card.style.removeProperty(property)
      card.removeAttribute(MARKER)
    }
    touched.clear()
  }
}
