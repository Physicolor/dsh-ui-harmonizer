/**
 * Doc sync #3: the architecture notes still described the removed head wrapper
 * (`enhc-page-head`) and the old 4px claim. Rewrite both paragraphs.
 *
 * Run: node scripts/apply-doc-arch-fix.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const ZH_FILE = 'D:/dsh-home/skills/dsh-settings-section-style/SKILL.md'
const EN_FILE = 'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/settings-section-style.md'

const ZH_OLD = `> \`mountSettingsPageHeaders\`（其他插件的页面用）。规范器**不改写你的 DOM 结构**：
> 只给你页面上真实的标题/描述节点打上 \`enhc-page-title\` / \`enhc-page-intro\`；两者
> 本来就在你自己的表头容器里时，再给那个容器打 \`enhc-page-head\`（间距归官方 4px）；
> 整页只有描述没有标题时，才注入 \`<h2 class="enhc-page-title">\`。样式规则只认这三个
> 类名，所以按 §1 自研的页面不会被二次造型，只有缺件时才被补齐。`

const ZH_NEW = `> \`mountSettingsPageHeaders\`（其他插件的页面用）。规范器**不改写你的 DOM 结构**、
> **不加任何包裹容器**：只给你页面上真实的标题/描述节点打上 \`enhc-page-title\` /
> \`enhc-page-intro\`——和官方页一样就是两个兄弟节点；整页只有描述没有标题时，才注入
> \`<h2 class="enhc-page-title">\`。间距不属于样式表：规范器实测你容器的 gap，把
> \`margin-top = 12px − gap\` 写在描述上，所以官方 12px 在每页渲染结果一致。样式规则只认
> 那两个类名，按 §1 自研的页面不会被二次造型，只有缺件时才被补齐。`

const EN_OLD = `description with \`enhc-page-title\` / \`enhc-page-intro\`, marks your own header box
\`enhc-page-head\` when you already group both (its gap becomes the official 4px),
and injects an \`<h2 class="enhc-page-title">\` only when the page has a description
and no title at all. Every stylesheet rule keys on those three class names, so a
page that already follows the recipe is left exactly as authored.`

const EN_NEW = `description with \`enhc-page-title\` / \`enhc-page-intro\` — the same two sibling
nodes an official page ships, with no wrapper of ours anywhere — and injects an
\`<h2 class="enhc-page-title">\` only when the page has a description and no title at
all. The distance between them is not a stylesheet constant: the reconciler measures
your container's gap and writes \`margin-top = 12px − gap\` on the description, so the
official 12px renders identically on every page. Every stylesheet rule keys on those
two class names, so a page that already follows the recipe is left as authored.`

for (const [file, from, to] of [[ZH_FILE, ZH_OLD, ZH_NEW], [EN_FILE, EN_OLD, EN_NEW]]) {
  const text = readFileSync(file, 'utf8')
  if (!text.includes(from)) { console.log(`(skip, text moved) ${file}`); continue }
  writeFileSync(file, text.split(from).join(to), 'utf8')
  console.log(`updated ${file}`)
}
