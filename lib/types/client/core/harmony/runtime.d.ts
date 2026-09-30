/**
 * The contract runtime: service registration, published variables and the
 * material watcher.
 */
import { type HarmonyService } from './contract.ts';
/** Live contract instance; one per plugin fiber. */
export interface HarmonyRuntime {
    service: HarmonyService;
    /** Push the material state into the published variables. */
    refreshMaterial: () => void;
    dispose: () => void;
}
/**
 * Create the contract runtime: the service, the published variables and the
 * material watcher (theme events when the theme service is present, plus a
 * cheap poll so a theme applied by plain CSS is still noticed).
 * @param provide - `ctx.reflect.provide`, injected so this module stays inert.
 * @param onThemeChange - optional subscription hook (`ctx.on('theme/change', …)`).
 * @returns the runtime plus a disposer.
 */
export declare function createHarmonyRuntime(provide: (name: string, value: unknown) => () => void, onThemeChange?: (listener: () => void) => (() => void)): HarmonyRuntime;
