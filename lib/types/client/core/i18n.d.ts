/**
 * Minimal i18n for dsh-ui-harmonizer — every user-facing string, both languages.
 *
 * Layer: core (infrastructure; it is imported by self/ UI, harness/ reconcilers
 * and core/state-model alike, and depends on nothing but the DOM).
 * Seams: the official language switch as the product publishes it — localStorage
 * key `dsh-language` and `<html lang="…">` — with `navigator.language` as the
 * last-resort fallback. No private plugin classes, no product internals.
 *
 * Every getter re-evaluates on each call so switching Settings → Language
 * takes effect without a page reload. Detection priority:
 *   1. localStorage key 'dsh-language' (written by the official Settings panel)
 *   2. <html lang="…"> attribute (synced by the product when the setting changes)
 *   3. navigator.language (fallback for SSR / private mode)
 */
export declare function getGeneralTitle(): string;
export declare function getGeneralDesc(): string;
export declare function getRowWidthTitle(): string;
export declare function getRowWidthDesc(): string;
export declare function getRowSidebarSizeTitle(): string;
export declare function getRowSidebarSizeDesc(): string;
export declare function getRowFontTitle(): string;
export declare function getRowFontDesc(): string;
/** Second half of the font row: which surfaces the stack applies to. */
export declare function getScopeTitle(): string;
export declare function getScopeDesc(): string;
export declare function getScopeContentLabel(): string;
export declare function getScopeUiLabel(): string;
/** Suffix on a preset the machine does not have installed. */
export declare function getFontMissingLabel(): string;
export declare function getRowCardTitle(): string;
export declare function getRowCardDesc(): string;
export declare function getFontLabel(id: string): string;
export declare function getDoctorSectionLabel(): string;
export declare function getDoctorTitle(): string;
export declare function getDoctorDesc(): string;
export declare function getDoctorRunLabel(): string;
export declare function getDoctorExportLabel(): string;
export declare function getDoctorResetLabel(): string;
export declare function getDoctorRulesLabel(): string;
export declare function getDoctorCouplingsLabel(): string;
export declare function getDoctorConflictsLabel(): string;
export declare function getDoctorSurfacesLabel(): string;
export declare function getDoctorMaterialLabel(): string;
/** Stat label: selectors that matched in no observed view yet. */
export declare function getDoctorDeadEveryViewLabel(): string;
/** Rules-block subtitle: dead in every view the ledger has seen. */
export declare function getDoctorDeadInEveryObservedView(): string;
export declare function getDoctorViewsObservedLabel(): string;
/** Right-hand column of a row in the dead-in-every-view list. */
export declare function getDoctorZeroMatchesEveryView(): string;
/** Right-hand column of a coupling row; `count` is its live match count. */
export declare function getDoctorMatchCount(count: number): string;
export declare function getDoctorGlassLabel(): string;
export declare function getDoctorSolidLabel(): string;
/** Note under a list whose rows were capped; `shown` of `total` are rendered. */
export declare function getDoctorTruncatedNote(shown: number, total: number): string;
/**
 * Note under a list that clipped cell TEXT (not rows) at `limit` characters.
 *
 * Separate from {@link getDoctorTruncatedNote} on purpose: the two cuts used to
 * be silent and inconsistent (cells were sliced in the view layer with no
 * marker at all), so the reader could not tell a short selector from a clipped
 * one. Each cut now names itself.
 */
export declare function getDoctorTruncatedCellsNote(limit: number): string;
/** Returns the [introPrefix, title] pairs for the title-fill logic,
 *  keyed by current locale. */
export declare function getKnownTitles(): ReadonlyArray<readonly [prefix: string, title: string]>;
