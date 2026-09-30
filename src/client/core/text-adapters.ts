/**
 * Generic third-party text adapters — the FRAMEWORK, with no plugin data in it.
 *
 * Layer: core (infrastructure; the per-package rule lists live in
 * `plugins/<package>/adapters.ts` and are passed in). Seams: the SHELL's own hooks
 * (`data-slot`, `aria-*`, `role`) plus the visible text — never another plugin's
 * hashed class names, which is what the Harmony Contract exists to stop (see the
 * removed better-sidebar sync in index.ts).
 *
 * WHY THIS EXISTS
 * The shell renders a provider's or a plugin's own strings verbatim: a model row
 * that registers itself as `${name} (CC)` puts that suffix in the composer, and an
 * option map that names its levels `low` / `high` puts lower-case words next to a
 * product whose own labels are `Low` / `High`. Neither the user nor the product can
 * say anything about it, and the harmonizer is the last layer before paint, so the
 * fix belongs here.
 *
 * RULES OF THE ROAD
 *  - Every adapter NAMES the plugin it normalizes (package name) and says WHY, so
 *    the plugin lists stay the single, auditable record of what we touch.
 *  - TEXT ONLY: no node is moved, removed or re-created, so React stays
 *    authoritative and a re-render simply means the adapter runs again. Every
 *    rewritten element carries a marker attribute, which is also what keeps the
 *    observer from looping.
 *  - Reversible: dispose puts back the exact text / attribute value we overwrote.
 *    Removing the marker alone is NOT enough — React considers the string it
 *    rendered unchanged after our write and would never repaint it.
 */

/** One visible-string rule: a pattern and the text it becomes. */
export interface TextRule {
  /** What the rule does, in one line (quoted by the README's adapter list). */
  readonly note: string
  readonly match: RegExp
  /** The replacement text for a match. */
  readonly replace: (match: RegExpMatchArray) => string
}

/** One normalized third-party surface. */
export interface TextAdapter {
  /** The package whose output this adapter normalizes. */
  readonly plugin: string
  /** Why the normalization is needed (the observed string and the product voice). */
  readonly why: string
  /** The region to watch, addressed through the SHELL's hooks. */
  readonly scope: string
  /** Attribute names on the scoped trigger that carry the same strings. */
  readonly attributes?: readonly string[]
  readonly rules: readonly TextRule[]
}

/** Marker attribute written on an element once its text is normalized. */
const MARK = 'data-enhc-normalized'

/** Apply every rule to one string, or return the input unchanged. */
export function normalize(text: string, adapter: TextAdapter): string {
  let next = text
  for (const rule of adapter.rules) {
    if (!rule.match.test(next)) continue
    next = next.replace(rule.match, (...args: unknown[]) => rule.replace(args as unknown as RegExpMatchArray))
  }
  return next
}

/** What we overwrote on one element, so dispose can put the original back. */
interface Rewritten {
  /** The element's `textContent` before our LAST text rewrite (null: never). */
  text: string | null
  /** Attribute value before our last rewrite of it, per attribute name. */
  attributes: Map<string, string>
}

/**
 * Start normalizing the third-party surfaces listed in `adapters`.
 *
 * @param adapters - the rule lists to run; an empty list mounts a no-op watcher.
 * @returns the disposer `ctx.effect` wants: the observer, the timers, every marker
 *   attribute and every text/attribute value we overwrote.
 */
export function mountTextAdapters(adapters: readonly TextAdapter[]): () => void {
  /**
   * Elements we wrote to, with the value each rewrite replaced. Keyed by element
   * (so re-writes update one record instead of appending) and pruned of detached
   * nodes, so a long session cannot grow it without bound.
   */
  const written = new Map<Element, Rewritten>()

  /** The record for `el`, created on first write. */
  const record = (el: Element): Rewritten => {
    const existing = written.get(el)
    if (existing !== undefined) return existing
    const fresh: Rewritten = { text: null, attributes: new Map() }
    written.set(el, fresh)
    return fresh
  }

  const rewriteText = (el: Element, adapter: TextAdapter): void => {
    // LEAF elements only: rewriting a parent's textContent would delete the React-owned
    // children it renders (the model chip is a button whose two spans are the shell's).
    if (el.children.length > 0) return
    const text = el.textContent ?? ''
    // A chip label is short by construction; the cap keeps a mutating leaf from
    // being scanned on every keystroke of an unrelated field.
    if (text === '' || text.length > 80) return
    const next = normalize(text, adapter)
    if (next === text) return
    // The value we are about to overwrite is the last one React painted, so it is
    // the one to restore (a later re-write refreshes it).
    record(el).text = text
    el.textContent = next
    el.setAttribute(MARK, adapter.plugin)
  }

  const rewriteAttribute = (el: Element, name: string, adapter: TextAdapter): void => {
    const raw = el.getAttribute(name)
    if (raw === null || raw === '' || raw.length > 240) return
    const next = normalize(raw, adapter)
    if (next === raw) return
    record(el).attributes.set(name, raw)
    el.setAttribute(name, next)
    el.setAttribute(MARK, adapter.plugin)
  }

  const apply = (): void => {
    // A node React unmounted is gone for good; drop its record so the map tracks
    // the live document rather than the whole session's history.
    for (const el of written.keys()) if (!el.isConnected) written.delete(el)
    for (const adapter of adapters) {
      for (const root of document.querySelectorAll(adapter.scope)) {
        for (const el of root.querySelectorAll('span, button')) rewriteText(el, adapter)
        for (const name of adapter.attributes ?? []) {
          for (const el of root.querySelectorAll(`[${name}]`)) rewriteAttribute(el, name, adapter)
        }
      }
    }
  }

  apply()
  const observer = new MutationObserver(apply)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'aria-label'] })
  // The model chip arrives with the session and re-renders on every model change, so
  // one short retry window covers the first paint without a permanent timer.
  const tick = window.setInterval(apply, 800)
  // Handle kept: disposing inside the window must not leave this timer armed.
  const stopTick = window.setTimeout(() => window.clearInterval(tick), 15_000)

  return () => {
    observer.disconnect()
    window.clearInterval(tick)
    window.clearTimeout(stopTick)
    for (const [el, was] of written) {
      // Guard: if React has since rendered children into the leaf we rewrote,
      // writing textContent would delete them — the marker comes off either way.
      if (was.text !== null && el.children.length === 0) el.textContent = was.text
      for (const [name, value] of was.attributes) el.setAttribute(name, value)
      el.removeAttribute(MARK)
    }
    written.clear()
  }
}
