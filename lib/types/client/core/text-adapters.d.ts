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
    readonly note: string;
    readonly match: RegExp;
    /** The replacement text for a match. */
    readonly replace: (match: RegExpMatchArray) => string;
}
/** One normalized third-party surface. */
export interface TextAdapter {
    /** The package whose output this adapter normalizes. */
    readonly plugin: string;
    /** Why the normalization is needed (the observed string and the product voice). */
    readonly why: string;
    /** The region to watch, addressed through the SHELL's hooks. */
    readonly scope: string;
    /** Attribute names on the scoped trigger that carry the same strings. */
    readonly attributes?: readonly string[];
    readonly rules: readonly TextRule[];
}
/** Apply every rule to one string, or return the input unchanged. */
export declare function normalize(text: string, adapter: TextAdapter): string;
/**
 * Start normalizing the third-party surfaces listed in `adapters`.
 *
 * @param adapters - the rule lists to run; an empty list mounts a no-op watcher.
 * @returns the disposer `ctx.effect` wants: the observer, the timers, every marker
 *   attribute and every text/attribute value we overwrote.
 */
export declare function mountTextAdapters(adapters: readonly TextAdapter[]): () => void;
