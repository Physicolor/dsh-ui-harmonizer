/**
 * Changelog insert for the 2026-09-30 round:
 *   1. one settings-header architecture (settings-page.ts),
 *   2. row popups match their row (menu-anchor.ts),
 *   3. third-party stylesheet keeper (style-keeper.ts, loader claim-pass bug),
 * plus the CSS mojibake repair.
 *
 * Anchored insertion right after `## Changelog` / `## 变更日志`, UTF-8 exact.
 *
 * Run: node scripts/apply-readme-changelog.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const EN = `
### Unreleased (pending acceptance) — one settings-header architecture, row popups, stylesheet keeper

**Refactor — settings page headers have exactly ONE implementation again**

- 🧹 Before: the same "page title + description" block was produced by four unrelated paths — an inline-styled React column for Settings → General, a bare DOM-injected \`<h2>\` for pages missing a title, per-plugin CSS rules keyed on foreign class names (\`.dsh_notification_*\`, \`_head > _sub\`, \`_titleRow > svg\`), and hardcoded overrides. Measured on the live panel, that is why the pages disagreed: the official models page is 16/500 + 14/22 while Agent presets is 18/600 + 13/20, and third-party pages such as Command Code (\`cc-title\`) were never reached by the \`_title\` suffix rules at all.
- ✅ After: \`src/client/settings-page.ts\` is the single owner. A React recipe (\`SettingsPageHeader\`) is used by this plugin's own pages and a DOM reconciler (\`mountSettingsPageHeaders\`) normalizes everyone else's: it stamps the page's **real** heading/description with \`enhc-page-title\` / \`enhc-page-intro\`, adopts the page's own header box as \`enhc-page-head\` when it groups the two, and injects an \`<h2 class="enhc-page-title">\` only for a page that has a description and no title. The stylesheet has one block keyed on those three names; the deleted rules are gone.
- 🔒 Nothing is moved or re-parented (a foreign React tree never sees a wrapper it did not render), a page that already conforms is left exactly as authored, and the reconciler's diff releases a node the moment a page re-renders around it.
- 📐 The 4px title→description compression is now conditional: it applies only when the container's own gap really is the official 12px (flagged \`data-enhc-gap="tight"\`), so a third-party container with its own rhythm keeps it. Verified per page: 通用设置 / 模型 / 内置插件 / Agent 预设 / UI 兼容性 / 插件市场 / 通知 / 侧边卡片 all render 18/26 600 + 13/20 tertiary + hairline, the notification page through an adopted head box (\`gap:4px\`) and the official sections through the tight flag.

**Fixed — the sidebar account popup was narrower than the row it hangs from**

- 🐛 The account menu (设置 / 意见反馈 / 退出登录) painted at the product Menu's content width (218–360px) under a sidebar row that is the full 256px — a visible seam between the popup and its trigger.
- ✅ \`src/client/menu-anchor.ts\` pins a portalled menu opened from the settings-launcher seat to its trigger row's width (\`box-sizing: border-box\`), scoped to that seat: the composer's model/permission pickers and every other menu keep their own recipe.

**Fixed — a third-party settings page rendered completely unstyled (loader claim-pass bug)**

- 🔍 Root cause found in the product's client-module loader, not in the plugins: \`claimStyles(id)\` runs after **every** module factory materializes and adopts **every untagged \`<style>\` in the document** for that plugin (\`style:not([data-plugin])\`), while \`removeOwnedStyles(id)\` deletes every \`style[data-plugin=id]\` when that adopter reloads, unloads or is pruned. A plugin that hand-injects its stylesheet once in \`apply()\` (dsh-notification: \`#dsh-notification-style\`) therefore loses it permanently for the session — measured live: the 通知 page rendered as a raw text dump (no cards, no badges, default buttons) and \`#dsh-notification-style\` was simply absent.
- ✅ \`src/client/style-keeper.ts\` snapshots hand-injected stylesheets (\`data-plugin-css\` is the discriminator: bundler-emitted tags are the loader's own and stay untouched) and restores one that disappears, after a grace period that lets a legitimately hot-reloaded owner re-inject first. A restored sheet keeps its authored attributes — the thief's \`data-plugin\` claim is dropped.
- 📊 Probe (live page, loader semantics reproduced): baseline 38 rules + card \`1px/12px/flex\` → after the theft no sheet and \`0px/0px/block\` → after the grace period 38 rules and the card styled again; 9/9 checks pass.

**Cleanup**

- 🧽 Repaired 48 mojibake characters in \`enhancer.module.css\` comments (an old PowerShell \`Get-Content -Raw\`/\`Set-Content\` round trip had re-encoded the file as GBK: \`—\` → \`鈥?\`, \`×\` → \`脳\`, one Chinese phrase destroyed). Comment-only damage — the build was never affected — rewritten as UTF-8 by a Node script, never through a shell.

`

const ZH = `
### 未发布（待验收）：设置页表头统一架构 · 行内弹层宽度 · 第三方样式表守卫

**重构 —— 设置页表头重新只剩一套实现**

- 🧹 之前：同一个「页面标题 + 页描述」由四条互不相关的路径产生——通用设置页是内联样式的 React 列，缺标题的页面是裸 DOM 注入的 \`<h2>\`，另有按别人私有类名硬编码的 CSS（\`.dsh_notification_*\`、\`_head > _sub\`、\`_titleRow > svg\`）和别的覆写。真机实测这就是各页不一致的原因：官方模型页是 16/500 + 14/22，Agent 预设页是 18/600 + 13/20，而连字符类名的 Command Code（\`cc-title\`）从来就没被 \`_title\` 后缀规则命中过。
- ✅ 现在：\`src/client/settings-page.ts\` 是唯一所有者。React 配方 \`SettingsPageHeader\` 供本插件自己的页面使用，DOM 规范器 \`mountSettingsPageHeaders\` 规范其他插件的页面：给页面**真实的**标题/描述节点打上 \`enhc-page-title\` / \`enhc-page-intro\`；若两者本来就在页面自己的表头容器里，则把该容器认定为 \`enhc-page-head\`；只有当页面有描述却完全没有标题时，才注入 \`<h2 class="enhc-page-title">\`。样式表只剩一段规则、只认这三个类名，旧规则全部删除。
- 🔒 不移动、不包裹任何节点（别人的 React 树不会看到自己没渲染过的容器）；本来就合规的页面保持原样；页面重渲染后，规范器会在下一轮把不再承担角色的节点释放掉。
- 📐 标题→描述的 4px 压缩改为有条件：只有当容器自身 gap 确实是官方 12px 时才加 \`data-enhc-gap="tight"\`，容器有自己节奏的第三方页面维持原样。逐页实测：通用设置 / 模型 / 内置插件 / Agent 预设 / UI 兼容性 / 插件市场 / 通知 / 侧边卡片 全部渲染为 18/26 600 + 13/20 tertiary + hairline；通知页走「表头容器被认定」这条（\`gap:4px\`），官方 section 走 tight 标记。

**修复 —— 侧边栏账号弹层比它所在的行更窄**

- 🐛 账号菜单（设置 / 意见反馈 / 退出登录）用的是产品 Menu 的内容驱动宽度（218–360px），而它挂在的侧边栏行是满宽 256px，弹层与触发行之间有明显错位。
- ✅ \`src/client/menu-anchor.ts\` 把从 \`settings.launcher\` 座位打开的门户菜单钉到触发行的宽度（\`box-sizing: border-box\`），且只作用于该座位：输入区的模型/权限选择器等其它菜单维持各自配方。

**修复 —— 某个第三方设置页完全没样式（产品 loader 的 claim 缺陷）**

- 🔍 根因在产品的 client-module loader，而非插件：\`claimStyles(id)\` 在每个模块工厂完成物化后运行，会把文档里**所有没有 \`data-plugin\` 的 \`<style>\`** 都记到当时物化的那个插件名下；而 \`removeOwnedStyles(id)\` 会在那个「收养者」重载/卸载/被 prune 时删掉所有 \`style[data-plugin=id]\`。于是在 \`apply()\` 里手写注入一次样式表的插件（dsh-notification 的 \`#dsh-notification-style\`）会整会话丢掉样式——真机实测：通知页退化成裸文本（没有卡片、没有徽标、按钮是浏览器默认样式），\`#dsh-notification-style\` 根本不在文档里。
- ✅ \`src/client/style-keeper.ts\` 对「手写注入」的样式表做快照（判别依据是 \`data-plugin-css\`：打包器产出的标签归 loader 所有，不动），消失后延迟一小段时间再恢复——这个延迟正好让「合法热重载后自行重注入」的属主抢先，避免重复。恢复出来的样式表保持作者写的属性，不带「小偷」留下的 \`data-plugin\`。
- 📊 探针（真机页面，按 loader 语义复现）：基线 38 条规则 + 卡片 \`1px/12px/flex\` → 偷走瞬间无样式表、卡片 \`0px/0px/block\` → 宽限期后 38 条规则、卡片恢复；9/9 全绿。

**清理**

- 🧽 修掉 \`enhancer.module.css\` 注释里 48 个乱码字符（早前 PowerShell \`Get-Content -Raw\`/\`Set-Content\` 往返把文件按 GBK 重编码：\`—\` → \`鈥?\`、\`×\` → \`脳\`，还有一处中文词组被毁）。仅注释受影响、构建从来不受影响；已用 Node 脚本按 UTF-8 重写，不经 shell。

`

const TARGETS = [
  { file: 'D:/dsh-home/plugins/dsh-ui-harmonizer/README.md', heading: '## Changelog', section: EN },
  { file: 'D:/dsh-home/plugins/dsh-ui-harmonizer/README.zh-CN.md', heading: '## 变更日志', section: ZH },
]

for (const { file, heading, section } of TARGETS) {
  const text = readFileSync(file, 'utf8')
  // Line endings differ per file (CRLF in README.md, LF in the Chinese copy).
  const match = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}\\r?\\n`, 'mu').exec(text)
  if (match === null) { console.error(`anchor missing: ${file}`); process.exit(1) }
  if (text.includes('one settings-header architecture') || text.includes('设置页表头统一架构')) {
    console.log(`already present: ${file}`)
    continue
  }
  const cut = match.index + match[0].length
  writeFileSync(file, text.slice(0, cut) + section + text.slice(cut), 'utf8')
  console.log(`updated ${file}`)
}
