/**
 * `EnhancerSurfaceProps` — the props both registered surfaces receive.
 *
 * Layer: self (this plugin's own settings UI). The state type is REUSED from
 * `core/state-model.ts` instead of re-declaring the five fields, so a new knob
 * cannot be added to the model and silently left out of the surface contract.
 * The patch type is derived with `Partial`, matching `index.ts`'s `patch`.
 */

import type { EnhancerState } from '../../core/state-model.ts'
import type { FONT_PRESETS } from '../font-presets.ts'

/** Props both surfaces receive: the shared state and an apply callback. */
export interface EnhancerSurfaceProps {
  state: EnhancerState
  onApply: (patch: Partial<EnhancerState>) => void
  presets: typeof FONT_PRESETS
}
