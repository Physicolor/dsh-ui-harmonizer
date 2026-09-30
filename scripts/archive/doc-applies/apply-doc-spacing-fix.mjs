/**
 * Doc sync #2: the header spacing is the OFFICIAL 12px (the section's own gap),
 * measured per page by the reconciler and written as `margin-top`; there is no
 * head wrapper and no `data-enhc-gap` flag any more. Corrects the earlier "4px
 * official" claim, which was this plugin's own compression.
 *
 * Run: node scripts/apply-doc-spacing-fix.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const edits = []

/* ---------------------------------------------------------------- zh skill */
{
  const file = 'D:/dsh-home/skills/dsh-settings-section-style/SKILL.md'
  edits.push([file, [
    [
      '| 页面标题（h2） | font `18px/26px`、`font-weight:600`、`color: var(--dsw-alias-label-primary)`、`margin: 0 0 -8px` |',
      '| 页面标题（h2） | font `18px/26px`、`font-weight:600`、`color: var(--dsw-alias-label-primary)`、`margin: 0` |',
    ],
    [
      '| 标题→描述间距 | **4px**（官方实测） |',
      '| 标题→描述间距 | **12px**——就是官方 section 自己的 `gap`。实测口径：把本插件的样式表整体禁用后，模型 / Agent 预设 / 内置插件三页标题底到描述顶都是 **12px**（此前文档写的「官方 4px」其实是本插件当年自己压出来的，已作废）。第三方容器各有各的 gap（4 / 16 / 完全没有，block 流没有 gap），所以**这个数字由规范器逐页实测后写进描述的 `margin-top`**（`margin-top = 12px − 容器 gap`），保证每页渲染结果一致 |',
    ],
    [
      '<h2 className={css.title} >页面标题</h2>  {/* 18px/26px/600, label-primary, margin:0 0 -8px */}',
      '<h2 className={css.title} >页面标题</h2>  {/* 18px/26px/600, label-primary, margin:0 */}',
    ],
    [
      '| 标题与描述同在你自己的表头容器里 | 该容器打 `enhc-page-head` → `gap:4px`（覆盖 2px 等自定义间距） |\n| 标题与描述留在 section 顶层、容器 gap 恰好 12px | 描述加 `data-enhc-gap="tight"` → 标题→描述压到官方 4px；gap 不是 12px 时**保持你自己的节奏** |',
      '| 标题与描述之间的距离与官方不一致 | 规范器实测你容器的 gap（`display:contents` 会向上找真正排版的那层），把差值写成描述的 `margin-top`：官方 12px 恒定。你容器的 gap 是 4/16/没有都不会影响最终渲染 |\n| 你容器的 `padding-top`/`border-top` 把标题顶下去了 | 给标题加等量负 `margin-top`，让标题在每页都落在同一条线上（实测八页标题 viewport y 完全一致） |',
    ],
    [
      '| 通知（dsh-notification，`dsh_notification_*`）| 描述无 hairline、标题→描述贴太紧（2px gap + 负 margin 叠加约 -6px）| 它的 `dsh_notification_heading` 被判为表头容器 → `gap:4px`，subtitle 打 `enhc-page-intro` 补 hairline |',
      '| 通知（dsh-notification，`dsh_notification_*`）| 描述无 hairline、标题→描述只有 2px | subtitle 打 `enhc-page-intro` 补 hairline；容器 gap 2px → 写 `margin-top:10px`，最终仍是官方 12px |',
    ],
  ]])
}

/* ------------------------------------------------------------- en package */
{
  const file = 'D:/dsh-home/plugins/dsh-ui-harmonizer/docs/settings-section-style.md'
  edits.push([file, [
    [
      '| Title + description in your own header box | that box gets `enhc-page-head` → `gap:4px` (overrides a custom 2px gap) |\n| Title + description as siblings of the section, container gap exactly 12px | the description gets `data-enhc-gap="tight"` → title→description compressed to the official 4px; any other container gap keeps your own rhythm |',
      '| Title→description distance differs from the official one | the reconciler measures your container\'s gap (`display: contents` is walked up to the box that really lays it out) and writes the difference onto the description\'s `margin-top`, so the rendered distance is the official **12px** on every page whatever your container uses (4 / 16 / none) |\n| Your container\'s `padding-top`/`border-top` pushes the title down | the title gets a matching negative `margin-top`, so the title lands on the same line on every page (measured: identical viewport y across all eight pages) |',
    ],
    [
      '│   page title (`enhc-page-title`)',
      '│   page title (`enhc-page-title`)',
    ],
  ]])
}

for (const [file, pairs] of edits) {
  let text = readFileSync(file, 'utf8')
  for (const [from, to] of pairs) {
    if (!text.includes(from)) { console.log(`  (skip, not found) ${file}: ${from.slice(0, 46)}…`); continue }
    text = text.split(from).join(to)
  }
  writeFileSync(file, text, 'utf8')
  console.log(`updated ${file}`)
}
