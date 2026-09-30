/**
 * One-shot repair of the mojibake comment bytes in enhancer.module.css.
 *
 * The file went through a PowerShell `Get-Content -Raw` / `Set-Content` round trip
 * at some point, which re-encoded this file's UTF-8 as GBK: every em dash became
 * `鈥?`, every `×` became `脳`, and one Chinese phrase was destroyed outright.
 * Comment-only damage (the build is unaffected) but it makes the stylesheet
 * unreadable, so it is repaired here with an exact sequence map and rewritten as
 * UTF-8 by Node — never through a shell.
 *
 * Run: node scripts/fix-css-mojibake.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/src/client/enhancer.module.css'

/** Corrupted sequence → intended character(s). */
const MAP = [
  ['鈥?', '—'],
  ['脳', '×'],
  ['瀵硅瘽/杞ㄨ抗', '对话/轨迹'],
]

/** Lines whose lossy placeholder needs a human call (context decides the char). */
const LINES = new Map([
  // "(ui-primitives Menu: model picker, permission picker, 鈥? 鈥?" — the "…" and the
  // closing paren of the parenthetical were both lost.
  [125, '/* Dropdown menus (ui-primitives Menu: model picker, permission picker, …).'],
  // `ends-with "鈥?tab" fails` — the placeholder was a leading underscore.
  [632, ' * the active one adds a second "_tabActive" class, so ends-with "_tab" fails'],
])

const text = readFileSync(FILE, 'utf8')
let next = text
for (const [from, to] of MAP) next = next.split(from).join(to)

const lines = next.split('\n')
for (const [lineNumber, replacement] of LINES) {
  const index = lineNumber - 1
  if (lines[index] === undefined) { console.error(`no line ${lineNumber}`); process.exit(1) }
  console.log(`line ${lineNumber}\n  - ${lines[index].trim()}\n  + ${replacement.trim()}`)
  lines[index] = replacement
}

const out = lines.join('\n')
const left = (out.match(/[\u9225\u8133\u922B\u951B\u938C\u93A4\u9286\u93AC\u9227\u9229]/gu) ?? []).length
writeFileSync(FILE, out, 'utf8')
console.log(`rewritten; corrupted characters left: ${left}`)
