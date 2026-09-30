/**
 * The two cordis `Context` members this plugin actually relies on.
 *
 * WHY THIS FILE EXISTS
 * `@deepseek-ai/dsh-client-ui-slots` types the slot CORE, but nothing augments
 * cordis's `Context` with the SERVICE the client runtime injects
 * (`export const inject = ['slots']`), and the `ClientContext` that used to carry
 * it lived in `@deepseek-ai/dsh-client-runtime/client` — retired in DSH 0.1.5 and
 * deliberately not imported here (see tsdown.config.ts). The runtime still
 * installs `ctx.slots`, so a plugin in that position has to say what it relies on.
 * This mirrors the declaration dsh-widgets ships for the same reason.
 *
 * `effect` is re-stated even though `@deepseek-ai/cordis` declares it in
 * `fiber.d.ts` (`interface Context extends Pick<Fiber, 'effect'>`): in this
 * repository's compilation that augmentation does not reach `Context` — every
 * `ctx.effect(...)` call site reports TS2576 ("Property 'effect' does not exist
 * on type 'Context'. Did you mean to access the static member 'Context.effect'
 * instead?"), while the identical code in the sibling plugin compiles clean. The
 * type below is spelled as `Fiber['effect']` so it merges with the package's own
 * declaration instead of fighting it; if a later cordis release makes the
 * augmentation land on its own, this member can be deleted with no other change.
 */
import type { Fiber } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** The fiber-owned effect registration the shell installs (`ctx.effect`). */
    effect: Fiber['effect']
    slots: {
      /**
       * Run `setup` once the named slot has been declared, and dispose whatever it
       * returns when this fiber ends. Returns the disposer `ctx.effect` wants.
       */
      inject(slot: string, setup: () => (() => void) | void): () => void
      /**
       * Contribute a component to a declared slot.
       * @param options - `id` is required for list slots; `order` breaks priority ties;
       *   `label` is a thunk read at render time (locale switches re-read it).
       * @param component - the slot body. Typed `unknown` on purpose: the real
       *   constraint comes from the owner packages' `SlotMap` merges, which this
       *   plugin cannot express without importing them.
       */
      register(
        options: { name: string; id?: string; order?: number; label?: () => string },
        component: unknown,
      ): () => void
    }
  }
}
