/**
 * The changelog writer escaped code spans as \` in a template literal; markdown
 * wants a bare backtick. Strip the backslash before every backtick.
 *
 * Run: node scripts/fix-readme-backticks.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

for (const file of ['D:/dsh-home/plugins/dsh-ui-harmonizer/README.md', 'D:/dsh-home/plugins/dsh-ui-harmonizer/README.zh-CN.md']) {
  const text = readFileSync(file, 'utf8')
  const count = (text.match(/\\`/gu) ?? []).length
  if (count === 0) { console.log(`clean: ${file}`); continue }
  writeFileSync(file, text.split('\\`').join('`'), 'utf8')
  console.log(`stripped ${count} escaped backticks in ${file}`)
}
