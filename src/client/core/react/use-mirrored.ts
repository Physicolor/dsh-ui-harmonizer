/**
 * `useMirrored` — the props → local state mirror every control in this plugin uses.
 *
 * Layer: core (infrastructure). Extracted from the five controls that each
 * carried the same two lines (`components.tsx`), so the reason for the mirror
 * lives in exactly one place:
 *
 * The parent mutates the SHARED state object in place (`Object.assign(state, …)`
 * in index.ts) and never re-renders this component, so a purely controlled
 * control would give no visual feedback on click. The local copy paints the
 * click immediately, and the effect adopts an EXTERNAL change (another surface
 * editing the same knob, or a state reload) on the next render.
 *
 * @param value - the controlled value coming from shared state.
 * @returns the local mirror and its setter.
 */

import * as React from 'react'

export function useMirrored<T>(value: T): [T, (next: T) => void] {
  const [local, setLocal] = React.useState(value)
  // External changes are adopted here; a click writes `local` directly so the
  // control repaints without waiting for the parent.
  React.useEffect(() => { setLocal(value) }, [value])
  return [local, setLocal]
}
