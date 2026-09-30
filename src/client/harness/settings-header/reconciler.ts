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

import { getKnownTitles } from '../../core/i18n.ts'
import { layoutContainer } from '../../core/dom/layout-container.ts'
import { TITLE_CLASS, INTRO_CLASS } from './classes.ts'

/** The official title→description distance: the official section's own `gap`. */
const OFFICIAL_HEAD_GAP = 12

/** Description candidate: `<p>` plus the vocabulary third-party pages use. */
const INTRO_SELECTOR = "p, [class$='_intro'], [class$='_subtitle'], [class$='_sub']"

/** Anything inside these is a row/card-level label, never the page header. */
const NESTED_SCOPE = "[class$='_row'], [class$='_rowCard'], [class$='_card'], [class$='_field']"

/**
 * A cheap content digest for the header fingerprint.
 *
 * The signature used `title.textContent?.length` and therefore treated a
 * re-worded title of the SAME length as "unchanged": switching Settings →
 * Language left the page showing the previous locale's heading until the user
 * navigated away and back (measured symptom: `Settings` → `设置`, both 8 chars
 * in the nav, page title frozen in the first language). A hash of the TEXT is
 * the smallest fix — same cost class as building the signature string, exact
 * for any content change, and it keeps the fingerprint free of per-mutation
 * `getComputedStyle` work by short-circuiting on the O(1) identity checks
 * first (see the call site).
 * @param text - the title's text content (empty string for a null text node).
 * @returns a 32-bit unsigned digest of the text.
 */
function hashText(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * Everything the reconciler did to one page, so dispose can undo exactly that.
 */
interface Applied {
  /** Nodes that received one of our classes (class removed on dispose). */
  stamped: Element[]
  /** The `<h2>` this plugin injected for a page that had no title. */
  injected: HTMLElement | null
  /** Nodes whose (inline) spacing we set, and which properties. */
  spaced: Array<{ el: HTMLElement, property: string }>
  /** Last resolved pair, so an unchanged page skips the layout read. */
  title: Element | null
  intro: Element | null
  /** Last applied spacing numbers, so a settled page can be skipped. */
  signature: string
}

/**
 * Applied work per section element. A plain Map (not a WeakMap) because the
 * disposer has to walk it; it stays tiny — one live settings page at a time —
 * and {@link prune} drops the nodes the panel already unmounted.
 */
const applied = new Map<Element, Applied>()

/**
 * Undo everything one page's record holds.
 * @param record - the record to unwind.
 * @param keepInjected - an injected `<h2>` that must survive this pass (it was
 *   just created for the page being normalized, so removing it would undo the
 *   very work being done).
 */
function release(record: Applied, keepInjected: HTMLElement | null = null): void {
  for (const node of record.stamped) node.classList.remove(TITLE_CLASS, INTRO_CLASS)
  for (const { el, property } of record.spaced) el.style.removeProperty(property)
  if (record.injected !== null && record.injected !== keepInjected) record.injected.remove()
  record.injected = keepInjected
  record.stamped = []
  record.spaced = []
}

/** Drop records for sections the settings panel has unmounted. */
function prune(): void {
  for (const [section, record] of applied) {
    if (section.isConnected) continue
    release(record)
    applied.delete(section)
  }
}

/**
 * The page's title node.
 *
 * A real heading wins. The class-name vocabulary (`_title` / `_heading`) is only
 * a fallback, and a match there must not be a WRAPPER: `dsh_notification_heading`
 * is a head box that CONTAINS the `<h2>`, and treating it as the title put our
 * 18/600 rule on the box — the description inherits the weight and the box's own
 * gap is replaced. Nodes that already wrap a heading are therefore rejected, as
 * are row/card-level labels.
 * @param section - the `settings.section` root.
 * @returns the title node, or null when the page has none.
 */
function findTitle(section: Element): HTMLElement | null {
  const usable = (node: Element): boolean => node.closest(NESTED_SCOPE) === null
  for (const node of section.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
    if (usable(node) && node instanceof HTMLElement) return node
  }
  for (const node of section.querySelectorAll("[class$='_title'], [class$='_heading']")) {
    if (!usable(node)) continue
    if (node.querySelector('h1, h2, h3, h4, h5, h6') !== null) continue
    if (node instanceof HTMLElement) return node
  }
  return null
}

/**
 * The page's description node: the first description-like node with real text
 * that is not a field/row/card caption. First in document order is deliberate —
 * when a page styles a wrapper (`div.nUhMVa_sub` around its own `<p>`), the
 * wrapper is the node the page itself presents as the intro, and stamping the
 * inner paragraph instead would leave the page's own box unstyled.
 * @param section - the `settings.section` root.
 * @returns the description node, or null when the page has none.
 */
function findIntro(section: Element): HTMLElement | null {
  for (const node of section.querySelectorAll(INTRO_SELECTOR)) {
    if (node.closest(NESTED_SCOPE) !== null) continue
    if ((node.textContent ?? '').trim().length <= 6) continue
    if (node instanceof HTMLElement) return node
  }
  return null
}

/**
 * Whether the two header nodes share their parent, i.e. the page laid them out
 * as the official skeleton does. Only then can the gap between them be measured
 * and corrected; a page that puts its description somewhere else is left with
 * its own layout.
 * @param title - the title node.
 * @param intro - the description node.
 * @returns true when both are siblings.
 */
function areSiblings(title: Element, intro: Element): boolean {
  return title.parentElement !== null && title.parentElement === intro.parentElement
}

/**
 * The label for a page whose own mark-up has no title: the active settings-nav
 * item (product contract: `aria-current="true"` on exactly one cell), then the
 * known intro-prefix table. Never invents prose — an unresolvable page is left
 * alone.
 * @param intro - the page's description node.
 * @returns the title text, or '' when it cannot be resolved.
 */
function resolveInjectedTitle(intro: Element): string {
  for (const el of document.querySelectorAll('[role="dialog"] nav button')) {
    if (el.getAttribute('aria-current') === 'true' || el.classList.toString().includes('_active')) {
      const text = el.textContent?.trim() ?? ''
      if (text !== '') return text
    }
  }
  for (const el of document.querySelectorAll("[class$='_navCell']")) {
    if (el.getAttribute('aria-current') === 'true' || /(^|\s)\S*_active(\s|$)/u.test(el.className)) {
      const text = el.textContent?.trim() ?? ''
      if (text !== '') return text
    }
  }
  const text = (intro.textContent ?? '').trim()
  const hit = getKnownTitles().find(([prefix]) => text.startsWith(prefix))
  return hit?.[1] ?? ''
}

/**
 * Mark one page's header and give it the official geometry.
 *
 * Idempotent, additive and reversible by construction: existing nodes only lose
 * the classes and inline spacing we added, the injected `<h2>` is ours to remove,
 * and nothing is moved or re-parented (a foreign React tree must never see a
 * wrapper it did not render).
 * @param section - the `settings.section` root.
 */
function normalizeSection(section: Element): void {
  const intro = findIntro(section)
  if (intro === null) return

  const record = applied.get(section) ?? { stamped: [], injected: null, spaced: [], title: null, intro: null, signature: '' }
  let title = findTitle(section)
  if (title === null) {
    const text = resolveInjectedTitle(intro)
    if (text === '') return
    if (record.injected === null || !record.injected.isConnected) {
      const injected = document.createElement('h2')
      injected.className = TITLE_CLASS
      injected.textContent = text
      intro.parentElement?.insertBefore(injected, intro)
      record.injected = injected
      console.info(`[harness-ui-harmonizer] injected settings page title: ${JSON.stringify(text)}`)
    } else if (record.injected.textContent !== text) {
      record.injected.textContent = text
    }
    title = record.injected
  }

  const siblings = areSiblings(title, intro)
  const container = siblings ? layoutContainer(title.parentElement) : null
  // The official distance is the official section's own gap, so the correction
  // is (official − whatever this container contributes). A container that is not
  // a flex/grid box contributes nothing (rowGap reads "normal").
  const containerGap = container === null ? 0 : Number.parseFloat(getComputedStyle(container).rowGap)
  const gapCorrection = Number.isFinite(containerGap) ? OFFICIAL_HEAD_GAP - containerGap : OFFICIAL_HEAD_GAP
  // A container with its own top padding would push the title off the line every
  // other page uses; cancel exactly that much.
  const containerInset = container === null
    ? 0
    : (Number.parseFloat(getComputedStyle(container).paddingTop) || 0)
      + (Number.parseFloat(getComputedStyle(container).borderTopWidth) || 0)
  const signature = `${siblings}|${containerGap}|${containerInset}|${hashText(title.textContent ?? '')}`

  // Nothing about this page moved since the last pass: our classes are already
  // on the same two nodes with the same spacing. The observer fires on every
  // mutation of the app and `getComputedStyle` forces a style recalc — doing it
  // per mutation would tax a streaming conversation for a fact that only changes
  // when the page does.
  if (record.title === title && record.intro === intro && record.signature === signature) return

  // Diff against the previous pass: a node that no longer holds a role (the page
  // re-rendered around it, or an earlier pass guessed wrong) is released — but a
  // title injected in THIS pass is the work itself and has to survive.
  release(record, title === record.injected ? title : null)
  title.classList.add(TITLE_CLASS)
  intro.classList.add(INTRO_CLASS)
  record.stamped = [title, intro]
  record.title = title
  record.intro = intro
  record.signature = signature

  if (siblings) {
    // Written inline: the number depends on the page's own layout, and it has to
    // beat whatever margin the page's stylesheet sets on its description.
    if (Math.abs(gapCorrection) > 0.01) {
      intro.style.marginTop = `${gapCorrection}px`
      record.spaced.push({ el: intro, property: 'margin-top' })
    }
    if (containerInset > 0.01) {
      title.style.marginTop = `${-containerInset}px`
      record.spaced.push({ el: title, property: 'margin-top' })
    }
  }

  applied.set(section, record)
}

/**
 * Mount the settings-page header normalizer.
 *
 * Re-scans on DOM/attribute changes (the settings panel renders its section
 * lazily and swaps it on navigation) and keeps polling briefly for a late
 * nav/section, exactly like the title fill it replaces — but now through one
 * code path that also handles the pages that DO ship a header.
 * @returns disposer that removes every class, inline spacing and injected title.
 */
export function mountSettingsPageHeaders(): () => void {
  const scan = (): void => {
    const section = document.querySelector("[data-slot='settings.section']")
    if (section !== null) normalizeSection(section)
    prune()
  }
  scan()
  // Coalesce: the app mutates constantly (streaming turns, workspace ticks), and
  // one scan per frame is enough for a page header that only changes when the
  // settings page itself does.
  let frame = 0
  const schedule = (): void => {
    if (frame !== 0) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      scan()
    })
  }
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'aria-current', 'aria-expanded'],
  })
  const tick = window.setInterval(scan, 700)
  const stopTick = window.setTimeout(() => window.clearInterval(tick), 12000)
  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame)
    observer.disconnect()
    window.clearInterval(tick)
    window.clearTimeout(stopTick)
    for (const [section, record] of applied) {
      release(record)
      applied.delete(section)
    }
  }
}
