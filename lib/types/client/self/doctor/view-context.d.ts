/**
 * `currentView` — the ledger's view key.
 *
 * Layer: self (the Doctor is this plugin's own page). The returned strings are
 * PERSISTED as the cross-view ledger key in `doctor.ts`, so they must not be
 * renamed or re-cased: `settings` / `session` / `hero` are the vocabulary the
 * stored ledger is keyed on, and changing one silently resets its history.
 */
/**
 * Name the view the audit is running in, from the DOM rather than from state:
 * the ledger only becomes meaningful when the names are stable and distinct.
 * @returns a view key such as `settings`, `session` or `hero`.
 */
export declare function currentView(): string;
