/**
 * The settings-page header class pair — the plugin's ONLY header hook.
 *
 * Layer: harness (these classes are stamped onto the DSH body's own settings
 * pages, so they belong with the normalization code, not with our own UI).
 *
 * PRIVATE HASH CLASSES ARE NOT USED HERE; the opposite is true: these are OUR
 * class names, and `self/settings-section-headers.module.css` is the only
 * stylesheet that may key on them. The Doctor reads them to count stamped
 * pages — see `self/doctor/`.
 */
/** Page-title class. Kept on the page's REAL heading node — nothing is wrapped. */
export declare const TITLE_CLASS = "enhc-page-title";
/** Page-description class, carrying the closing hairline. */
export declare const INTRO_CLASS = "enhc-page-intro";
