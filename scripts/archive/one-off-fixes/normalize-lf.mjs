/**
 * Normalize the two files whose working copies had drifted to CRLF (mixed with
 * the LF blocks written by the doc/CSS scripts) back to the LF convention their
 * committed form uses — and that the rest of this repo follows. Content is
 * otherwise byte-identical; the diff stops reporting the whole file.
 *
 * Run: node scripts/normalize-lf.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILES = [
  'D:/dsh-home/plugins/dsh-ui-harmonizer/src/client/enhancer.module.css',
  'D:/dsh-home/plugins/dsh-ui-harmonizer/README.md',
]

for (const file of FILES) {
  const text = readFileSync(file, 'utf8')
  const crlf = (text.match(/\r\n/gu) ?? []).length
  if (crlf === 0) { console.log(`already LF: ${file}`); continue }
  writeFileSync(file, text.split('\r\n').join('\n'), 'utf8')
  console.log(`CRLF → LF (${crlf} lines): ${file}`)
}
