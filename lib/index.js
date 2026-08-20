//#region src/index.ts
/**
* Harness UI Enhancer — host half.
*
* No-op: this is a pure client (browser) bundle. All UI-enhancement work
* (chat width, markdown fonts, sidebar scale, settings normalization,
* cross-plugin coordination, the rounded center-column card) lives in the
* browser half at src/client. The node half exists only so the loader has a
* row to mount; it registers nothing and owns no services.
*/
/** Plugin entry — no-op apply for the loader to mount. */
function apply() {}
//#endregion
export { apply };
