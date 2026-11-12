/**
 * Layer: self. The read-only Harmony Doctor audit engine.
 *
 * It belongs to `self/` because what it audits is THIS plugin's own rules and
 * couplings — our selectors, our declarations, our reach into other plugins'
 * private surfaces — so the findings are ours to fix.
 *
 * Data sources, and nothing else: `document.styleSheets` (our injected
 * CSS-module and tooltip sheets, plus `adoptedStyleSheets`) for the rule and
 * coupling inventory, and the `localStorage` ledger under `LEDGER_KEY` for the
 * cross-view "dead everywhere" verdict.
 *
 * Harmony Doctor —the audit engine.
 *
 * A coordinator whose coordination targets are invisible to it is the core
 * failure this plugin kept hitting: 107 of 134 of its own selectors matched
 * nothing on one view, and its panel-state predicate keyed on a class that
 * better-sidebar 0.24.1 no longer ships. Both failures were silent.
 *
 * The Doctor makes them loud, with measurements only:
 *
 *   1. **Dead-rule ledger.** A selector is only dead when it matches nothing
 *      in ANY view it has been observed in. The ledger persists across views
 *      (hero —session —settings —panels), so the verdict sharpens as the
 *      user moves around instead of being decided by whichever screen was open
 *      when someone pressed the button.
 *   2. **Foreign coupling health.** Selectors that name another plugin's hashed
 *      CSS-module class or undocumented `data-*` host, with a live match count — *      the difference between "still works" and "dead since their last release".
 *   3. **Conflict / redundancy checks.** Which of our declarations actually win
 *      (inline self-check) and which are no-ops (measured by disabling our own
 *      sheets and re-reading the computed value).
 *   4. **Surface inventory.** Every slot, every cross-plugin data attribute and
 *      every published contract variable, so "who owns this surface" is data
 *      rather than folklore.
 *
 * Everything is read-only apart from a synchronous disable/restore of our own
 * stylesheets, which never paints.
 */
import { type HarmonyService } from '../../core/harmony/contract.ts';
/** One dead or matched rule. */
export interface RuleRow {
    selector: string;
    media: string | null;
}
/** A foreign coupling and whether it still bites. */
export interface CouplingRow {
    plugin: string;
    kind: string;
    selector: string;
    matches: number;
    /** Matches declared occurrences of the coupling (a selector can carry several). */
    occurrences: number;
}
/** A setting row's worth of surfaces. */
export interface SurfaceRow {
    kind: 'slot' | 'data-attribute' | 'contract-variable' | 'declared-surface';
    name: string;
    count: number;
    detail: string;
}
/** Whether one of our own declarations is actually the one in effect. */
export interface ConflictRow {
    property: string;
    target: string;
    ours: string;
    winner: string;
    verdict: 'ours-wins' | 'someone-else-wins' | 'redundant';
}
/** The full report. */
export interface DoctorReport {
    contractVersion: string;
    at: string;
    url: string;
    view: string;
    material: {
        glassAware: boolean;
        solidFill: string;
        surfaceSolid: string;
    };
    rules: {
        totalSelectors: number;
        matchedInThisView: number;
        /** COUNT of selectors that matched in no observed view yet. */
        deadInThisView: number;
        viewsSeen: string[];
        /** Rows for the selectors dead in EVERY observed view. */
        deadInEveryView: RuleRow[];
        /**
         * Rows for the selectors dead in THIS view only.
         *
         * Named apart from {@link deadInThisView} on purpose: both used to be called
         * `deadInThisView` in this very interface (and twice more in the returned
         * literal), so the object literal silently kept the ARRAY while the report
         * printer read it as a number — `- dead in this view: [object Object],…`.
         */
        deadRowsInThisView: RuleRow[];
    };
    couplings: CouplingRow[];
    surfaces: SurfaceRow[];
    conflicts: ConflictRow[];
}
/** Clear the ledger (offered in the UI so a stale verdict can be discarded). */
export declare function resetLedger(): void;
/**
 * Split a selector list on its TOP-LEVEL commas only.
 *
 * `selectorText` is a serialized list, so a naive `split(',')` tears apart
 * `:has(> [data-slot='main'], > [data-slot='conversation'])` into fragments that
 * match nothing and are then reported as dead rules —a false positive the first
 * probe run produced (measured: one such fragment appeared in the "matched" list
 * while its sibling was counted as dead).
 * @param selectorText - the rule's selector list.
 * @returns the individual selectors, trimmed.
 */
export declare function splitSelectors(selectorText: string): string[];
/**
 * Run the whole audit in the current view.
 * @param options - the live contract service and the view name.
 * @returns the report, ready to render or export.
 */
export declare function runDoctor(options: {
    view: string;
    service?: HarmonyService;
}): DoctorReport;
/**
 * Render the report as Markdown for a GitHub issue or a README table.
 * @param report - the report to serialize.
 * @returns Markdown text.
 */
export declare function reportToMarkdown(report: DoctorReport): string;
