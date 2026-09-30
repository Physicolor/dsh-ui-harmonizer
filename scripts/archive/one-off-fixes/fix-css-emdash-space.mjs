/**
 * Follow-up to fix-css-mojibake.mjs.
 *
 * The GBK round trip replaced the byte AFTER each corrupted em dash with the
 * placeholder `?` — which was the space. The repair restored `—`, so sentences
 * now read `—static` instead of `— static`. Put the space back where an em dash
 * runs straight into a word or an opening quote.
 *
 * Run: node scripts/fix-css-emdash-space.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/src/client/enhancer.module.css'
const text = readFileSync(FILE, 'utf8')
const before = [...text.matchAll(/—(?![ \n])/gu)].length
const fixed = text.replace(/—(?=[A-Za-z\u4e00-\u9fff('"[`])/gu, '— ')
writeFileSync(FILE, fixed, 'utf8')
const after = [...fixed.matchAll(/—(?![ \n])/gu)].length
console.log(`em dashes without a following space: ${before} → ${after}`)
for (const [i, line] of fixed.split('\n').entries()) {
  if (line.includes('—') && (line.includes('— ') === false)) console.log(`  no-space left on line ${i + 1}: ${line.trim().slice(0, 90)}`)
}
