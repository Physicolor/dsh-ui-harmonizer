/**
 * HISTORICAL (archived 2026-09-30) — the pure-move invariant of the one-time
 * sheet split: it proved that the 24 fragments, concatenated in
 * styles/index.ts order, were byte-identical to the single 1253-line
 * enhancer.module.css they came from. That proof was made and recorded; the
 * fragments have since been EDITED on purpose (dead rules removed, selectors
 * repaired), so this checker now fails by design. The live invariant is
 * scripts/tools/css-baseline.mjs, which pins the COMPILED stylesheet the
 * bundle actually inlines.
 */
#!/usr/bin/env node
/**
 * Split-sheet verifier for dsh-ui-harmonizer.
 *
 * Rebuilds the stylesheet from the fragments listed in src/client/styles/index.ts
 * (in import order) and compares it with src/client/enhancer.module.css. The only
 * permitted difference is the `/* @dsh-split-header ... *\/` block on top of each
 * fragment. Every other byte - selector, declaration, comment, blank line - must
 * be identical, so the cascade order and the compiled CSS are both preserved.
 *
 *   node scripts/tools/css-split-check.mjs
 *
 * Secondary (informational) check: compiles the original and the fragments with
 * the exact options tsdown.config.ts uses (`lightningcss`, cssModules pattern
 * `[hash]_[local]`, minify) and reports the compiled-level delta. A CSS-Modules
 * hash is derived from the FILE PATH, so a moved LOCAL class necessarily gets a
 * new hash; the check normalises hash prefixes to tell that case apart from a
 * real rule change.
 */
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const CLIENT = join(ROOT, 'src', 'client')
const STYLES_DIR = join(CLIENT, 'styles')
const INDEX = join(STYLES_DIR, 'index.ts')
const ORIGINAL = join(CLIENT, 'enhancer.module.css')
const HEADER = /^\/\* @dsh-split-header[\s\S]*?\*\/\n/

const sha = (s) => createHash('sha256').update(s).digest('hex')
const show = (s) => JSON.stringify(s.length > 80 ? `${s.slice(0, 40)}...${s.slice(-40)}` : s)

let failed = false
const fail = (msg) => { failed = true; console.error(`  FAIL  ${msg}`) }
const ok = (msg) => console.log(`  ok    ${msg}`)

/* ---- 1. the declared order ------------------------------------------------ */
if (!existsSync(INDEX)) { console.error(`[css-split-check] no ${INDEX}`); process.exit(1) }
const indexSrc = readFileSync(INDEX, 'utf8')
const importRe = /^import\s+'([^']+\.module\.css)'$/gm
const specs = [...indexSrc.matchAll(importRe)].map((m) => m[1])
if (specs.length === 0) { console.error('[css-split-check] index.ts imports no .module.css'); process.exit(1) }

const leftovers = indexSrc
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l !== '' && !l.startsWith('/*') && !l.startsWith('*') && !l.endsWith('*/'))
  .filter((l) => !/^import\s+'[^']+\.module\.css'$/.test(l))
if (leftovers.length > 0) fail(`styles/index.ts holds non-import code: ${leftovers.join(' | ')}`)
else ok(`styles/index.ts = ${specs.length} css imports, nothing else`)

const files = specs.map((s) => resolve(STYLES_DIR, s))
const bases = files.map((f) => basename(f))
if (new Set(bases).size !== bases.length) {
  const dupes = bases.filter((b, i) => bases.indexOf(b) !== i)
  fail(`duplicate basename(s) - tagId collision in tsdown.config.ts: ${[...new Set(dupes)].join(', ')}`)
} else {
  ok(`${files.length} fragments, basenames globally unique`)
}

/* ---- 2. rebuild and compare ---------------------------------------------- */
const original = readFileSync(ORIGINAL, 'utf8')
if (original.charCodeAt(0) === 0xfeff) fail('enhancer.module.css starts with a BOM')
if (original.includes('\r')) fail('enhancer.module.css contains CR')

let rebuilt = ''
for (const f of files) {
  const rel = f.slice(ROOT.length + 1).replace(/\\/g, '/')
  if (!existsSync(f)) { fail(`${rel} is missing`); continue }
  const raw = readFileSync(f, 'utf8')
  if (raw.charCodeAt(0) === 0xfeff) fail(`${rel} starts with a BOM`)
  if (raw.includes('\r')) fail(`${rel} contains CR (LF required)`)
  const m = HEADER.exec(raw)
  if (m === null) { fail(`${rel} has no leading @dsh-split-header block`); continue }
  if (!raw.startsWith('/* @dsh-split-header')) fail(`${rel} does not start with the header block`)
  if (raw.split('@dsh-split-header').length !== 2) fail(`${rel} carries more than one @dsh-split-header marker`)
  rebuilt += raw.slice(m[0].length)
}

const expected = `${original}\n` // fragment files end with LF; the original has no final newline
console.log(`\n  original   ${sha(original)}  ${Buffer.byteLength(original)} B`)
console.log(`  rebuilt    ${sha(rebuilt)}  ${Buffer.byteLength(rebuilt)} B`)
console.log(`  expected   ${sha(expected)}  ${Buffer.byteLength(expected)} B (original + final LF)`)

if (rebuilt === expected) {
  ok('rebuilt sheet is byte-identical to enhancer.module.css + one final LF')
} else {
  fail('rebuilt sheet differs from the original')
  let i = 0
  while (i < Math.min(rebuilt.length, expected.length) && rebuilt[i] === expected[i]) i += 1
  console.error(`  first difference at char ${i} (line ${expected.slice(0, i).split('\n').length})`)
  console.error(`    original: ${show(expected.slice(i, i + 60))}`)
  console.error(`    rebuilt : ${show(rebuilt.slice(i, i + 60))}`)
}

/* ---- 3. compiled-level delta (what docs/architecture/baseline css.json sees) */
let transform = null
try { transform = createRequire(import.meta.url)('lightningcss').transform } catch { /* not installed */ }
if (transform === null) {
  console.log('\n  (lightningcss not installed - skipped the compiled-level check)')
} else {
  const compile = (file) =>
    transform({
      filename: file,
      code: readFileSync(file),
      cssModules: { pattern: '[hash]_[local]' },
      minify: true,
    })
  const locals = new Set()
  const collect = (r) => { for (const k of Object.keys(r.exports ?? {})) locals.add(k) }
  const a = compile(ORIGINAL)
  collect(a)
  const parts = files.map((f) => { const r = compile(f); collect(r); return r })
  const compiledOriginal = a.code.toString()
  const compiledSplit = parts.map((r) => r.code.toString()).join('')
  const stripHashes = (css) => {
    let out = css
    for (const local of locals) {
      const re = new RegExp(`[A-Za-z0-9_]+_${local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'g')
      out = out.replace(re, `HASH_${local}`)
    }
    return out
  }
  console.log(`\n  compiled original ${sha(compiledOriginal)}  ${Buffer.byteLength(compiledOriginal)} B`)
  console.log(`  compiled split    ${sha(compiledSplit)}  ${Buffer.byteLength(compiledSplit)} B`)
  if (compiledOriginal === compiledSplit) {
    ok('compiled CSS is byte-identical too')
  } else if (stripHashes(compiledOriginal) === stripHashes(compiledSplit)) {
    ok(`compiled delta is CSS-Modules hashes only (path-derived), locals: ${[...locals].join(', ') || 'none'}`)
    console.log('        expected here: .uitw-slider lives in a new file, so its hash changes.')
    console.log('        components.tsx uses the literal class name, so nothing matches that hash either way.')
    console.log('        docs/architecture/baseline/css.json must be re-recorded (tag list changed 1 -> 24).')
  } else {
    fail('compiled CSS differs beyond CSS-Modules hashes - a rule changed')
    const x = stripHashes(compiledOriginal)
    const y = stripHashes(compiledSplit)
    let i = 0
    while (i < Math.min(x.length, y.length) && x[i] === y[i]) i += 1
    console.error(`  first rule-level difference at char ${i}`)
    console.error(`    original: ${show(x.slice(i, i + 60))}`)
    console.error(`    split   : ${show(y.slice(i, i + 60))}`)
  }
}

console.log(`\n[css-split-check] ${failed ? 'FAIL' : 'PASS'}`)
process.exit(failed ? 1 : 0)
