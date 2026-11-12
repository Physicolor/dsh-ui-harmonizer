/**
 * Harmony Contract — the coordination half of dsh-ui-harmonizer.
 *
 * The problem this solves (measured, 2026-09-16): every "polish" plugin ends up
 * reaching into another plugin's private DOM — hashed CSS-module class names,
 * undocumented `data-*` hosts — and every upstream rebuild silently breaks it.
 * The audit of this plugin itself found 107 of 134 of its own selectors dead on
 * a hero-screen view and a panel-state predicate keyed on a class
 * (`nArs4W_panelHidden`) that better-sidebar 0.24.1 no longer ships.
 *
 * The contract inverts that: a surface is *declared* by whoever owns it, and
 * neighbours only read declarations. Three pieces:
 *
 *   1. `<html>` custom properties any plugin or theme may read without a
 *      dependency: `--enhc-contract`, `--enhc-surface-solid`,
 *      `--enhc-glass-aware`, `--enhc-content-width`, `--enhc-sidebar-scale`.
 *   2. `ctx.reflect.provide('uiHarmony', …)` — the same service idiom the
 *      product uses for `ctx.sidebarRight` / `ctx.sidebarRightTabs` — so a
 *      plugin can declare what it occupies instead of being measured by guess.
 *   3. Material detection: whether the interface currently reads as an opaque
 *      or a translucent (glass) surface, derived from the semantic tokens
 *      rather than from a plugin's identity.
 *
 * Nothing here paints. Painting stays in enhancer.module.css keyed off the
 * published variables.
 */
/** Contract revision; bumped whenever a variable changes meaning. */
export declare const CONTRACT_VERSION = "1.0";
/** Which physical surface a declaration is about. */
export type HarmonySurfaceRole = 'right-rail' | 'bottom-dock' | 'frame-overlay' | 'composer-dock' | 'header-utilities' | 'settings-page' | 'other';
/** One surface a plugin owns, as declared by that plugin. */
export interface HarmonySurface {
    /** Stable id, unique per plugin (e.g. `dsh-better-sidebar:right-panel`). */
    id: string;
    /** Which surface this is. */
    role: HarmonySurfaceRole;
    /** Occupied space as a CSS length (`220px`), or omitted when floating. */
    occupies?: string;
    /** `<html>` custom property carrying that length, when the plugin publishes one. */
    widthVariable?: string;
    /** Transition the surface tracks, so a neighbour can match it verbatim. */
    transition?: string;
    /** Semantic tokens this surface paints with. */
    tokens?: readonly string[];
    /** True when the surface paints an opaque fill (the glass-hostile case). */
    opaque?: boolean;
    /** Free-form note surfaced in the Doctor report. */
    note?: string;
}
/** The service other plugins resolve with `ctx.get('uiHarmony')`. */
export interface HarmonyService {
    /** Contract revision. */
    readonly version: string;
    /**
     * Declare a surface this plugin occupies.
     * @param surface - the declaration.
     * @returns disposer removing the declaration (call it from the owning fiber).
     */
    registerSurface: (surface: HarmonySurface) => () => void;
    /** Every currently declared surface. */
    surfaces: () => readonly HarmonySurface[];
    /** Whether the interface currently reads as translucent/glass. */
    glassAware: () => boolean;
    /**
     * Subscribe to surface-set or material changes.
     * @param listener - called after any change.
     * @returns disposer unsubscribing the listener.
     */
    onChange: (listener: () => void) => () => void;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** UI harmony contract: surface declarations + material state. */
        uiHarmony: HarmonyService;
    }
}
/** Custom property names published on `<html>`. */
export declare const VARS: {
    readonly contract: "--enhc-contract";
    readonly surfaceSolid: "--enhc-surface-solid";
    readonly glassAware: "--enhc-glass-aware";
    readonly contentWidth: "--enhc-content-width";
    readonly sidebarScale: "--enhc-sidebar-scale";
};
