/**
 * Persistence on this plugin's OWN storage key (`STORAGE_KEY`).
 *
 * The width bounds are imported from the product channel in
 * `../harness/chat-width.ts` so this file never keeps a second copy of them.
 */
import { type EnhancerState } from './state-model.ts';
/**
 * Read the persisted state, falling back to defaults on any parse or shape
 * error (the key may be absent, corrupted, or from an older schema that also
 * carried a now-removed `fontSize` field).
 * @returns the merged persisted state.
 */
export declare function loadState(): EnhancerState;
/** Persist the current state to localStorage. */
export declare function saveState(state: EnhancerState): void;
