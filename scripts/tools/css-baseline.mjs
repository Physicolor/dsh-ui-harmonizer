#!/usr/bin/env node
/**
 * CSS-layering invariant for dsh-ui-harmonizer.
 *
 * The plugin's browser bundle inlines every `.module.css` as one
 * `<style data-plugin-css="dsh-ui-harmonizer/<basename>">` tag, in the order the
 * modules are imported (the bundler's execution order = the cascade order). The
 * architectural refactor splits the single 1200-line `enhancer.module.css` into
 * per-target stylesheets (`harness/…`, `plugins/<name>/…`, `core/…`); the ONE
 * thing that must not change is the concatenated stylesheet, because every rule
 * in it was written against the rules around it (later wins at equal
 * specificity).
 *
 * So: this records the compiled CSS of every tag plus their concatenation, and
 * fails when either moves. Pure moves between files keep the concatenation
 * byte-identical as long as the import order is preserved.
 *
 *   node scripts/tools/css-baseline.mjs --write   # record the baseline
 *   node scripts/tools/css-baseline.mjs           # default: fail on any drift
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const BUNDLE = join(ROOT, 'lib', 'client.js')
const BASELINE = join(ROOT, 'docs', 'architecture', 'baseline', 'css.json')
const WRITE = process.argv.includes('--write')

function die(msg) { console.error(`[css-baseline] ${msg}`); process.exit(1) }
if (!existsSync(BUNDLE)) die(`no ${BUNDLE} — build first`)

const js = readFileSync(BUNDLE, 'utf8')

/** Walk the JSON string literal that starts at `pos` (which must be a quote). */
function readJsonString(src, pos) {
  if (src[pos] !== '"') return null
  let i = pos + 1
  while (i < src.length) {
    const ch = src[i]
    if (ch === '\\') { i += 2; continue }
    if (ch === '"') return { raw: src.slice(pos, i + 1), end: i + 1 }
    i += 1
  }
  return null
}

const found = {}
let combined = ''
let at = 0
for (;;) {
  const cssAt = js.indexOf('const css', at)
  if (cssAt < 0) break
  const eq = js.indexOf(' = ', cssAt)
  if (eq < 0) break
  const lit = readJsonString(js, eq + 3)
  if (lit === null) { at = cssAt + 10; continue }
  at = lit.end
  let css
  try { css = JSON.parse(lit.raw) } catch { continue }
  const tagAt = js.indexOf('const tagId', lit.end)
  if (tagAt < 0) die('found a CSS block with no tagId — the bundler plugin changed shape')
  const tagLit = readJsonString(js, js.indexOf(' = ', tagAt) + 3)
  if (tagLit === null) die('could not read the tagId literal')
  const tag = JSON.parse(tagLit.raw)
  found[tag] = { sha256: createHash('sha256').update(css).digest('hex'), bytes: Buffer.byteLength(css) }
  combined += css
}

const tags = Object.keys(found)
if (tags.length === 0) die('no compiled CSS found in the bundle')
const combinedHash = createHash('sha256').update(combined).digest('hex')
console.log(`[css-baseline] ${tags.length} sheet(s), combined ${Buffer.byteLength(combined)} B  ${combinedHash.slice(0, 16)}`)
for (const t of tags) console.log(`  ${t}  ${found[t].bytes} B  ${String(found[t].sha256).slice(0, 16)}`)

if (WRITE || !existsSync(BASELINE)) {
  mkdirSync(dirname(BASELINE), { recursive: true })
  writeFileSync(BASELINE, `${JSON.stringify({ __combined: combinedHash, sheets: found }, null, 1)}\n`, 'utf8')
  console.log(`[css-baseline] wrote baseline -> ${BASELINE}`)
  process.exit(0)
}

const raw = JSON.parse(readFileSync(BASELINE, 'utf8'))
const baseCombined = raw.__combined
const baseSheets = raw.sheets ?? raw

if (baseCombined === combinedHash) {
  console.log('[css-baseline] PASS — the concatenated stylesheet is byte-identical')
  process.exit(0)
}
console.error('[css-baseline] the concatenated CSS differs from the baseline:')
console.error(`  baseline ${baseCombined}`)
console.error(`  current  ${combinedHash}`)
for (const t of tags) {
  const b = baseSheets[t]
  if (b === undefined) console.error(`  NEW     ${t}  ${found[t].bytes} B`)
  else if (b.sha256 !== found[t].sha256) console.error(`  CHANGED ${t}  (${b.bytes} B -> ${found[t].bytes} B)`)
}
for (const t of Object.keys(baseSheets)) if (!tags.includes(t)) console.error(`  REMOVED ${t}`)
process.exit(1)
