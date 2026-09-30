/**
 * Doc sync #4: the 组件 page is no longer an inline-styled div header — the
 * dsh-widgets source itself now ships the official h2 + p skeleton, so the
 * "already conformant / untouched" row is stale.
 *
 * Run: node scripts/apply-doc-widgets-row.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const pairs = [
  [
    'D:/dsh-home/skills/dsh-settings-section-style/SKILL.md',
    '| 组件（harness-widgets）| ——（用 inline div 自绘 18/600 标题+13/20 描述，合规）| 无需处理 |',
    '| 组件（dsh-widgets）| 曾用内联样式的 `div` 自绘表头：没有语义 `h2`/`p`，也没有任何能被命中的类名，所以规范器既找不到标题也找不到描述 | 2026-09-30 直接改 dsh-widgets 本体：`h2.dsx-page-title` + `p.dsx-page-intro`（官方 18/26 600 + 13/20 tertiary + hairline），规范器照常接管 → 与其他页同样的 12px 间距、同样的坐标 |',
  ],
  [
    'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/settings-section-style.md',
    '| Widgets (`dsh-widgets`) | — (self-drawn inline div header, already conformant) | untouched |',
    '| Widgets (`dsh-widgets`) | used an inline-styled `div` pair for its header: no semantic `h2`/`p` and no class name a rule or normalizer could match | fixed in the dsh-widgets source itself (2026-09-30): `h2.dsx-page-title` + `p.dsx-page-intro` carrying the official 18/26 600 + 13/20 tertiary + hairline, so the normalizer takes over and the page gets the same 12px / same coordinates as every other page |',
  ],
]

for (const [file, from, to] of pairs) {
  const text = readFileSync(file, 'utf8')
  if (!text.includes(from)) { console.log(`(skip, not found) ${file}`); continue }
  writeFileSync(file, text.split(from).join(to), 'utf8')
  console.log(`updated ${file}`)
}
