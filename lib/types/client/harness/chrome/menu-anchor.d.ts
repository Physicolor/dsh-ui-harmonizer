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
export declare function mountMenuAnchorWidth(): () => void;
