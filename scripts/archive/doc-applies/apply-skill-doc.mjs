/**
 * One-shot doc sync: rewrite the "自动规范器契约" and "已知第三方页对标" sections of
 * the settings-section-style skill (and the plugin's shipped copy) to describe the
 * unified header architecture shipped in 0.9.0.
 *
 * Anchored replacement, UTF-8 exact (the section carries the → arrow and full-width
 * punctuation that are easy to mangle in a shell round-trip).
 *
 * Run: node scripts/apply-skill-doc.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const TARGETS = [
  'D:/dsh-home/skills/dsh-settings-section-style/SKILL.md',
  'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/settings-section-style.md',
]

const START = '## 3. 自动规范器契约'
const END_MARK = '## 5. 给第三方插件作者的核心建议'

const SECTION = `## 3. 自动规范器契约（harness-ui-enhancer 自动帮你做的）

> 架构（0.9.0）：表头只有**一套**实现，落在插件 \`src/client/settings-page.ts\`。
> React 配方 \`SettingsPageHeader\`（本插件自己的页面用）+ DOM 规范器
> \`mountSettingsPageHeaders\`（其他插件的页面用）。规范器**不改写你的 DOM 结构**：
> 只给你页面上真实的标题/描述节点打上 \`enhc-page-title\` / \`enhc-page-intro\`；两者
> 本来就在你自己的表头容器里时，再给那个容器打 \`enhc-page-head\`（间距归官方 4px）；
> 整页只有描述没有标题时，才注入 \`<h2 class="enhc-page-title">\`。样式规则只认这三个
> 类名，所以按 §1 自研的页面不会被二次造型，只有缺件时才被补齐。

只要用户装了 harness-ui-enhancer，以下规则会对**任何** \`settings.section\`
页自动兜底，你不需要自己实现（但即便如此，仍建议你按 §1 自研，这样不依赖兜底）：

| 缺失/问题 | enhancer 自动处理 |
| --- | --- |
| 标题字体字号不对 | 标记真实标题为 \`enhc-page-title\` → 18/26 600 + label-primary |
| 描述字体不对 | 标记真实描述为 \`enhc-page-intro\` → 13/20 tertiary + \`padding-bottom:12px\` + hairline |
| 标题行混入图标 | \`[data-slot='settings.section'] [class$='_titleRow'] > svg { display:none }\`（删任何标题行的图标） |
| 标题与描述同在你自己的表头容器里 | 该容器打 \`enhc-page-head\` → \`gap:4px\`（覆盖 2px 等自定义间距） |
| 标题与描述留在 section 顶层、容器 gap 恰好 12px | 描述加 \`data-enhc-gap="tight"\` → 标题→描述压到官方 4px；gap 不是 12px 时**保持你自己的节奏** |
| 页面缺 h2 标题、但有描述 | 注入 \`<h2 class="enhc-page-title">\`（18/600），文案取自当前激活导航项（\`aria-current="true"\`），纯追加不破坏你源码 |

**注意边界**：enhancer 只做"表头"的视觉统一。它**不**重排你的内容区、**不**移动或
包裹你的节点（React 树保持原样）、**不**删你的功能图标（只删标题行旁的那个 logo）、
**不**伪造描述文案（若你缺标题且取不到导航名，宁可跳过也不写错文案）。

## 4. 已知第三方页对标（可作排查样例）

| 页面 | 曾不符合 | enhancer 修复 |
| --- | --- | --- |
| 通知（dsh-notification，\`dsh_notification_*\`）| 描述无 hairline、标题→描述贴太紧（2px gap + 负 margin 叠加约 -6px）| 它的 \`dsh_notification_heading\` 被判为表头容器 → \`gap:4px\`，subtitle 打 \`enhc-page-intro\` 补 hairline |
| 模型 / Agent 预设 / 内置插件（官方）| 官方页之间也不一致（模型 16/500 + 14/22）| 真实 h2 + p 打类名 → 统一 18/26 600 + 13/20 tertiary + hairline |
| Command Code（\`cc-*\`，连字符而非下划线）| 16/24 500 标题、无 hairline，旧的 \`_title\` 后缀规则根本命中不到 | 规范器按**结构**命中（首个 \`h2\` + 首个描述段落），与其余页面同配方 |
| 插件市场（dshmarket，\`eGUBIq_*\`）| 标题行带 22px logo 图标 | titleRow 直接 svg \`display:none\` |
| 侧边卡片（dsh-better-sidebar，\`Pz1RTq_*\`）| 完全没有 h2 标题，只有 \`p.intro\` | 注入 \`h2.enhc-page-title\`（文案=导航"侧边卡片"）|
| 组件（harness-widgets）| ——（用 inline div 自绘 18/600 标题+13/20 描述，合规）| 无需处理 |

`

for (const file of TARGETS) {
  const text = readFileSync(file, 'utf8')
  const start = text.indexOf(START)
  const end = text.indexOf(END_MARK)
  if (start < 0 || end < 0 || end <= start) {
    console.log(`skip (anchors missing): ${file}`)
    continue
  }
  writeFileSync(file, text.slice(0, start) + SECTION + text.slice(end), 'utf8')
  console.log(`updated ${file} (${end - start} → ${SECTION.length} chars)`)
}
