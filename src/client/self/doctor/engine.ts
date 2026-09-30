/**
 * Layer: self. The read-only Harmony Doctor audit engine.
 *
 * It belongs to `self/` because what it audits is THIS plugin's own rules and
 * couplings — our selectors, our declarations, our reach into other plugins'
 * private surfaces — so the findings are ours to fix.
 *
 * Data sources, and nothing else: `document.styleSheets` (our injected
 * CSS-module and tooltip sheets, plus `adoptedStyleSheets`) for the rule and
 * coupling inventory, and the `localStorage` ledger under `LEDGER_KEY` for the
 * cross-view "dead everywhere" verdict.
 *
 * Harmony Doctor —the audit engine.
 *
 * A coordinator whose coordination targets are invisible to it is the core
 * failure this plugin kept hitting: 107 of 134 of its own selectors matched
 * nothing on one view, and its panel-state predicate keyed on a class that
 * better-sidebar 0.24.1 no longer ships. Both failures were silent.
 *
 * The Doctor makes them loud, with measurements only:
 *
 *   1. **Dead-rule ledger.** A selector is only dead when it matches nothing
 *      in ANY view it has been observed in. The ledger persists across views
 *      (hero —session —settings —panels), so the verdict sharpens as the
 *      user moves around instead of being decided by whichever screen was open
 *      when someone pressed the button.
 *   2. **Foreign coupling health.** Selectors that name another plugin's hashed
 *      CSS-module class or undocumented `data-*` host, with a live match count — *      the difference between "still works" and "dead since their last release".
 *   3. **Conflict / redundancy checks.** Which of our declarations actually win
 *      (inline self-check) and which are no-ops (measured by disabling our own
 *      sheets and re-reading the computed value).
 *   4. **Surface inventory.** Every slot, every cross-plugin data attribute and
 *      every published contract variable, so "who owns this surface" is data
 *      rather than folklore.
 *
 * Everything is read-only apart from a synchronous disable/restore of our own
 * stylesheets, which never paints.
 */

import { CONTRACT_VERSION, VARS, type HarmonyService, type HarmonySurface } from '../../core/harmony/contract.ts'

/** Path/storage key for the cross-view ledger. */
const LEDGER_KEY = 'harness-ui-harmonizer.audit-ledger'

/**
 * Foreign-plugin markers we know we (or a sibling) reach into.
 *
 * Two corrections measured 2026-09-30:
 *   - `data-dsh-*` is NOT a better-sidebar private hook: the PRODUCT uses that
 *     namespace itself (`data-dsh-automatic-focus` is written by the shell and
 *     read by its theme CSS), so it is registered as a harness hook. Reporting it
 *     as a third-party coupling pointed the blame at the wrong owner and inflated
 *     that owner's match count.
 *   - the old `market-hash` entry (`.eGUBIq_` / `.Pz1RTq_`) matched NOTHING in the
 *     installed `dshmarket` — a dead registration that three documents then
 *     repeated as current fact. Removed rather than kept "for history": the
 *     Doctor's job is to report what actually bites.
 */
const FOREIGN_PATTERNS: ReadonlyArray<{ id: string, owner: string, test: RegExp }> = [
  { id: 'better-sidebar-hash', owner: 'dsh-better-sidebar', test: /\.nArs4W_[A-Za-z0-9_]+/gu },
  { id: 'harness-data-hooks', owner: 'harness (product)', test: /\[data-dsh-[a-z-]+\]/gu },
  { id: 'widgets-hash', owner: 'dsh-widgets', test: /(?:\.dsx-[a-z-]+|--dsx-[a-z-]+)/gu },
  { id: 'widgets-data', owner: 'dsh-widgets', test: /\[data-dsx-[a-z-]+\]/gu },
  { id: 'notification-hash', owner: 'dsh-notification', test: /\.dsh_notification_[a-z_]+/gu },
  { id: 'genui-data', owner: '@omdsh-dev/dsh-genui', test: /\[data-genui[a-z-]*\]/gu },
]

/** One dead or matched rule. */
export interface RuleRow {
  selector: string
  media: string | null
}

/** A foreign coupling and whether it still bites. */
export interface CouplingRow {
  plugin: string
  kind: string
  selector: string
  matches: number
  /** Matches declared occurrences of the coupling (a selector can carry several). */
  occurrences: number
}

/** A setting row's worth of surfaces. */
export interface SurfaceRow {
  kind: 'slot' | 'data-attribute' | 'contract-variable' | 'declared-surface'
  name: string
  count: number
  detail: string
}

/** Whether one of our own declarations is actually the one in effect. */
export interface ConflictRow {
  property: string
  target: string
  ours: string
  winner: string
  verdict: 'ours-wins' | 'someone-else-wins' | 'redundant'
}

/** The full report. */
export interface DoctorReport {
  contractVersion: string
  at: string
  url: string
  view: string
  material: { glassAware: boolean, solidFill: string, surfaceSolid: string }
  rules: {
    totalSelectors: number
    matchedInThisView: number
    /** COUNT of selectors that matched in no observed view yet. */
    deadInThisView: number
    viewsSeen: string[]
    /** Rows for the selectors dead in EVERY observed view. */
    deadInEveryView: RuleRow[]
    /**
     * Rows for the selectors dead in THIS view only.
     *
     * Named apart from {@link deadInThisView} on purpose: both used to be called
     * `deadInThisView` in this very interface (and twice more in the returned
     * literal), so the object literal silently kept the ARRAY while the report
     * printer read it as a number — `- dead in this view: [object Object],…`.
     */
    deadRowsInThisView: RuleRow[]
  }
  couplings: CouplingRow[]
  surfaces: SurfaceRow[]
  conflicts: ConflictRow[]
}

/** Shape of the persisted cross-view ledger. */
interface Ledger {
  views: Record<string, { matched: string[], total: number }>
}

/**
 * Read the cross-view ledger.
 * @returns the ledger (empty on any storage failure).
 */
function readLedger(): Ledger {
  try {
    const raw = localStorage.getItem(LEDGER_KEY)
    if (raw === null) return { views: {} }
    const parsed = JSON.parse(raw) as Ledger
    return typeof parsed.views === 'object' && parsed.views !== null ? parsed : { views: {} }
  } catch {
    return { views: {} }
  }
}

/**
 * Record this view's matched selectors into the ledger.
 * @param view - view name (e.g. `hero`, `settings-general`).
 * @param matched - selectors that matched at least one element.
 * @param total - selectors evaluated in this view.
 */
function writeLedger(view: string, matched: readonly string[], total: number): void {
  try {
    const ledger = readLedger()
    ledger.views[view] = { matched: [...matched], total }
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger))
  } catch {
    // Storage unavailable: the in-memory report still stands for this view.
  }
}

/** Clear the ledger (offered in the UI so a stale verdict can be discarded). */
export function resetLedger(): void {
  try { localStorage.removeItem(LEDGER_KEY) } catch { /* ignore */ }
}

/** Our own injected stylesheets (CSS-module tags and the tooltip tag). */
function ourSheets(): Array<{ owner: string, sheet: CSSStyleSheet }> {
  const out: Array<{ owner: string, sheet: CSSStyleSheet }> = []
  const isOurs = (node: Node | null): boolean => {
    if (node === null || node.nodeType !== 1) return false
    const attrs = [...(node as Element).attributes].map(a => `${a.name}=${a.value}`).join(' ')
    return /harmonizer|harness-ui-enhancer/iu.test(attrs)
  }
  for (const sheet of document.styleSheets) {
    try { if (isOurs(sheet.ownerNode)) out.push({ owner: (sheet.ownerNode as HTMLElement).dataset.pluginCss ?? 'inline', sheet }) } catch { /* ignore */ }
  }
  for (const sheet of document.adoptedStyleSheets ?? []) {
    try {
      const ours = [...sheet.cssRules].some(r => (r.cssText ?? '').includes('--enhancer-content-width') || (r.cssText ?? '').includes('.enhc-'))
      if (ours) out.push({ owner: 'adoptedStyleSheet', sheet })
    } catch { /* ignore */ }
  }
  return out
}

/**
 * Walk every rule of our sheets.
 * @param visit - called with each style rule's selector list, text and media.
 */
function eachRule(visit: (selectorText: string, cssText: string, media: string | null) => void): void {
  const walk = (rules: CSSRuleList, media: string | null): void => {
    for (const rule of rules) {
      const anyRule = rule as CSSRule & { selectorText?: string, cssRules?: CSSRuleList, conditionText?: string }
      if (anyRule.selectorText !== undefined) visit(anyRule.selectorText, anyRule.cssText, media)
      if (anyRule.cssRules !== undefined && anyRule.cssRules.length > 0) {
        walk(anyRule.cssRules, anyRule.conditionText !== undefined && anyRule.selectorText === undefined ? (media === null ? anyRule.conditionText : `${media} && ${anyRule.conditionText}`) : media)
      }
    }
  }
  for (const { sheet } of ourSheets()) {
    try { walk(sheet.cssRules, null) } catch { /* cross-origin or detached */ }
  }
}

/**
 * Split a selector list on its TOP-LEVEL commas only.
 *
 * `selectorText` is a serialized list, so a naive `split(',')` tears apart
 * `:has(> [data-slot='main'], > [data-slot='conversation'])` into fragments that
 * match nothing and are then reported as dead rules —a false positive the first
 * probe run produced (measured: one such fragment appeared in the "matched" list
 * while its sibling was counted as dead).
 * @param selectorText - the rule's selector list.
 * @returns the individual selectors, trimmed.
 */
export function splitSelectors(selectorText: string): string[] {
  const out: string[] = []
  let depth = 0
  let quote: string | null = null
  let start = 0
  for (let i = 0; i < selectorText.length; i++) {
    const ch = selectorText[i]
    if (quote !== null) {
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") { quote = ch; continue }
    if (ch === '(' || ch === '[') depth++
    else if (ch === ')' || ch === ']') depth--
    else if (ch === ',' && depth === 0) { out.push(selectorText.slice(start, i).trim()); start = i + 1 }
  }
  out.push(selectorText.slice(start).trim())
  return out.filter(s => s !== '')
}

/**
 * Count matches for one selector without throwing on un-queryable syntax.
 * @param selector - a single selector (no comma).
 * @returns element count, or -1 when the selector cannot be evaluated.
 */
function countMatches(selector: string): number {
  try { return document.querySelectorAll(selector).length } catch { return -1 }
}

/**
 * Audit our own rules in the current view and merge the result into the ledger.
 * @param view - view name.
 * @returns the per-view verdict plus the cross-view verdict.
 */
function auditRules(view: string): DoctorReport['rules'] {
  const seen = new Set<string>()
  const matched = new Set<string>()
  const dead: RuleRow[] = []
  let total = 0
  eachRule((selectorText, _cssText, media) => {
    for (const selector of splitSelectors(selectorText)) {
      total++
      seen.add(selector)
      if (countMatches(selector) === 0) dead.push({ selector, media })
      else matched.add(selector)
    }
  })
  writeLedger(view, [...matched], total)

  const ledger = readLedger()
  const viewsSeen = Object.keys(ledger.views)
  const matchedEver = new Set<string>()
  for (const entry of Object.values(ledger.views)) for (const s of entry.matched) matchedEver.add(s)
  const deadEverywhere: RuleRow[] = []
  // Only meaningful once more than one view has been observed: a selector that
  // has not matched in a single view is "unobserved", not "dead".
  if (viewsSeen.length > 1) {
    for (const selector of seen) if (!matchedEver.has(selector)) deadEverywhere.push({ selector, media: null })
  }
  return {
    totalSelectors: total,
    matchedInThisView: matched.size,
    deadInThisView: dead.length,
    viewsSeen,
    deadInEveryView: deadEverywhere.slice(0, 200),
    deadRowsInThisView: dead.slice(0, 200),
  }
}

/**
 * Inventory selectors that couple us to another plugin's private surface.
 * @returns one row per (plugin, selector) with a live match count.
 */
function auditCouplings(): CouplingRow[] {
  const rows = new Map<string, CouplingRow>()
  eachRule((selectorText) => {
    for (const pattern of FOREIGN_PATTERNS) {
      const regex = new RegExp(pattern.test.source, 'gu')
      if (!regex.test(selectorText)) continue
      for (const selector of splitSelectors(selectorText)) {
        const occurrences = (selector.match(new RegExp(pattern.test.source, 'gu')) ?? []).length
        if (occurrences === 0) continue
        const key = `${pattern.id}|${selector}`
        const existing = rows.get(key)
        if (existing !== undefined) { existing.occurrences += occurrences; continue }
        rows.set(key, {
          plugin: pattern.owner,
          kind: pattern.id,
          selector,
          matches: countMatches(selector),
          occurrences,
        })
      }
    }
  })
  return [...rows.values()].sort((a, b) => a.matches - b.matches)
}

/**
 * Inventory every surface on the page: slots, cross-plugin data attributes,
 * published contract variables and surfaces other plugins declared to us.
 * @param service - the live contract service, when available.
 * @returns sorted surface rows.
 */
function auditSurfaces(service: HarmonyService | undefined): SurfaceRow[] {
  const rows: SurfaceRow[] = []
  const slots = new Map<string, number>()
  for (const el of document.querySelectorAll('[data-slot]')) {
    const name = el.getAttribute('data-slot') ?? ''
    slots.set(name, (slots.get(name) ?? 0) + 1)
  }
  for (const [name, count] of slots) rows.push({ kind: 'slot', name, count, detail: '' })

  const attrs = new Map<string, number>()
  for (const el of document.querySelectorAll('*')) {
    for (const attr of el.attributes) {
      if (!/^data-(dsh|dsx|genui|duc|enhc)/u.test(attr.name)) continue
      attrs.set(attr.name, (attrs.get(attr.name) ?? 0) + 1)
    }
  }
  for (const [name, count] of attrs) rows.push({ kind: 'data-attribute', name, count, detail: '' })

  const root = getComputedStyle(document.documentElement)
  for (const [key, name] of Object.entries(VARS)) {
    rows.push({ kind: 'contract-variable', name, count: 1, detail: root.getPropertyValue(name).trim() || '(unset)', ...(key === '' ? {} : {}) })
  }

  const declared: readonly HarmonySurface[] = service?.surfaces() ?? []
  for (const surface of declared) {
    rows.push({ kind: 'declared-surface', name: surface.id, count: 1, detail: `${surface.role}${surface.occupies === undefined ? '' : ` · ${surface.occupies}`}` })
  }
  return rows
}

/**
 * Check whether our declarations are the ones in effect.
 *
 * Two honest tests, no CSSOM guessing:
 * - **inline self-check**: a property we set inline must read back as we set it;
 * - **redundancy test**: disabling our own sheets must CHANGE the computed value
 *   of a contested property, otherwise our rule achieves nothing the product
 *   (or another plugin) already achieves.
 * @param probes - selector/property pairs worth contesting.
 * @returns findings.
 */
function auditConflicts(probes: ReadonlyArray<{ target: string, property: string }>): ConflictRow[] {
  const rows: ConflictRow[] = []

  // 1. inline self-check on the elements we write to.
  const inlineTargets: Array<[HTMLElement, string]> = []
  for (const el of [document.documentElement, document.body]) {
    for (const name of Object.keys(el.style)) {
      if (name.startsWith('--')) inlineTargets.push([el, name])
    }
  }
  for (const [el, name] of inlineTargets) {
    const ours = el.style.getPropertyValue(name).trim()
    const winner = getComputedStyle(el).getPropertyValue(name).trim()
    if (winner === '' && ours !== '') rows.push({ property: name, target: el === document.body ? 'body (inline)' : 'html (inline)', ours, winner, verdict: 'someone-else-wins' })
  }

  // 2. redundancy test for stylesheet declarations.
  const sheets = ourSheets()
  for (const probe of probes) {
    const el = document.querySelector(probe.target)
    if (el === null) continue
    const before = getComputedStyle(el).getPropertyValue(probe.property)
    const disabled: boolean[] = []
    for (const { sheet } of sheets) { disabled.push(sheet.disabled); sheet.disabled = true }
    const without = getComputedStyle(el).getPropertyValue(probe.property)
    for (const [i, { sheet }] of sheets.entries()) sheet.disabled = disabled[i]
    const after = getComputedStyle(el).getPropertyValue(probe.property)
    if (before === after && before === without) {
      rows.push({ property: probe.property, target: probe.target, ours: before || '(none)', winner: without || '(none)', verdict: 'redundant' })
    } else if (before !== after) {
      rows.push({ property: probe.property, target: probe.target, ours: before, winner: after, verdict: 'someone-else-wins' })
    }
  }
  return rows
}

/** Properties worth contesting, derived from the measured 0.1.5 conflicts. */
const CONFLICT_PROBES: ReadonlyArray<{ target: string, property: string }> = [
  { target: '[data-input-scroll]', property: 'font-size' },
  // The header is the PARENT slot's child in the installed build; the old
  // `conversation.session.header > header` spelling matched nothing here, so
  // these two probes silently found no element and never reported a conflict.
  { target: "[data-slot='conversation.header'] > header", property: 'background-color' },
  { target: "[data-slot='conversation.header'] > header", property: 'min-height' },
  { target: "[data-slot='conversation.session']", property: 'margin-right' },
  { target: "[class$='_flowItem']", property: 'content-visibility' },
  { target: 'body', property: '--dsw-font-markdown-base' },
  { target: 'html', property: '--dsw-font-family' },
]

/**
 * Run the whole audit in the current view.
 * @param options - the live contract service and the view name.
 * @returns the report, ready to render or export.
 */
export function runDoctor(options: { view: string, service?: HarmonyService }): DoctorReport {
  const root = getComputedStyle(document.documentElement)
  const body = getComputedStyle(document.body)
  return {
    contractVersion: CONTRACT_VERSION,
    at: new Date().toISOString(),
    url: location.href,
    view: options.view,
    material: {
      glassAware: (options.service?.glassAware() ?? false),
      solidFill: root.getPropertyValue('--enhc-solid-fill').trim(),
      surfaceSolid: root.getPropertyValue(VARS.surfaceSolid).trim(),
    },
    rules: auditRules(options.view),
    couplings: auditCouplings(),
    surfaces: auditSurfaces(options.service),
    conflicts: auditConflicts(CONFLICT_PROBES),
  }
}

/**
 * Render the report as Markdown for a GitHub issue or a README table.
 * @param report - the report to serialize.
 * @returns Markdown text.
 */
export function reportToMarkdown(report: DoctorReport): string {
  const lines: string[] = []
  lines.push(`# Harmony Doctor report`, '', `- generated: ${report.at}`, `- url: ${report.url}`, `- view: ${report.view}`, `- contract: ${report.contractVersion}`, `- material: ${report.material.glassAware ? 'translucent (glass)' : 'opaque'} (solid-fill: ${report.material.solidFill || 'unset'})`, '')
  lines.push(`## Rules`)
  lines.push(`- total selectors: ${report.rules.totalSelectors}`)
  lines.push(`- matched in this view: ${report.rules.matchedInThisView}`)
  lines.push(`- dead in this view: ${report.rules.deadInThisView}`)
  lines.push(`- views observed: ${report.rules.viewsSeen.join(', ')}`)
  lines.push(`- dead in EVERY observed view: ${report.rules.deadInEveryView.length}`)
  if (report.rules.deadInEveryView.length > 0) {
    lines.push('', '| selector | media |', '| --- | --- |')
    for (const row of report.rules.deadInEveryView) lines.push(`| \`${row.selector}\` | ${row.media ?? '-'} |`)
  }
  lines.push('', '## Foreign couplings')
  lines.push('', '| plugin | kind | matches | selector |', '| --- | --- | --- | --- |')
  for (const row of report.couplings) lines.push(`| ${row.plugin} | ${row.kind} | ${row.matches} | \`${row.selector.slice(0, 90)}\` |`)
  lines.push('', '## Conflicts / redundancy')
  lines.push('', '| verdict | property | target | ours | winner |', '| --- | --- | --- | --- | --- |')
  for (const row of report.conflicts) lines.push(`| ${row.verdict} | ${row.property} | \`${row.target}\` | ${row.ours} | ${row.winner} |`)
  lines.push('', '## Surfaces')
  lines.push('', '| kind | name | count | detail |', '| --- | --- | --- | --- |')
  for (const row of report.surfaces) lines.push(`| ${row.kind} | \`${row.name}\` | ${row.count} | ${row.detail} |`)
  return lines.join('\n')
}
