/**
 * Types for the product's own UI kit, `@deepseek-ai/dsh-client-ui-primitives`.
 *
 * WHY THIS FILE EXISTS: plugins may (and should) import the shipped primitives at
 * runtime — the loader's frozen platform table already resolves the package, and
 * `@omdsh-dev/dsh-genui` has required it from its bundle since v0.1 — but the
 * published package ships no `.d.ts`, so TypeScript needs this shim to accept the
 * import. Only what this plugin actually uses is declared; the real component
 * signatures are in the shipped `lib/index.js` (Menu is destructured there as
 * `{ open, anchor, items, children, selectedId, selectedIds, onSelect, onClose,
 * align, side, portal, closeOnPointerLeave, dense, compact, autoFocus, selection,
 * getAnchorRect, footer, className, listClassName }`).
 *
 * Keep this the ONLY place control markup is invented from scratch: the rule for
 * every surface of this plugin is to RENDER THE PRODUCT'S OWN COMPONENT, not to
 * re-implement it against its tokens.
 */
declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type * as React from 'react'

  /** One row of `Menu`. Separators and headings are separate entry kinds (not declared here). */
  export interface MenuItem {
    id: string
    label?: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    danger?: boolean
    shortcut?: { aria?: string; keys: readonly string[] }
    submenu?: readonly MenuItem[]
  }

  /** The product's dropdown: trigger (`anchor`) + the portalled, translucent surface. */
  export function Menu(props: {
    /** Whether the surface is showing. */
    open: boolean
    /** The trigger element the surface is anchored to. */
    anchor: React.ReactNode
    items?: readonly MenuItem[]
    /** Id of the selected row; with the default `selection="check"` it draws the product's check. */
    selectedId?: string
    onSelect?: (id: string) => void
    onClose?: () => void
    /** `"end"` flushes the surface's right edge with the anchor's, as the settings rows do. */
    align?: 'start' | 'end'
    side?: 'top' | 'bottom'
    /** Render the surface into `document.body` (the settings rows use this). */
    portal?: boolean
    dense?: boolean
    compact?: boolean
    autoFocus?: boolean
    selection?: 'check' | 'fill'
    className?: string
    listClassName?: string
    footer?: readonly MenuItem[]
  }): React.ReactElement

  /** The product's chevron, as the settings Select's trigger draws it. */
  export function IconChevronDownOutlineRegular(props: { className?: string }): React.ReactElement
  /** The product's check, as a chosen Menu row draws it. */
  export function IconCheckOutlineRegular(props: { className?: string }): React.ReactElement
}
