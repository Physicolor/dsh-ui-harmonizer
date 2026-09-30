/**
 * Replace the changelog block inserted earlier today with the FINAL design:
 * one skeleton (h2 + p, no wrapper), identical coordinates and the official
 * 12px spacing on every page, measured per container by the reconciler.
 *
 * Run: node scripts/apply-readme-changelog2.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const EN = `### Unreleased (pending acceptance) — one settings-header skeleton, row popups, stylesheet keeper

**Refactor — the settings page header is ONE skeleton with ONE geometry, on every page**

- 🔍 Measured first (\\\`scripts/probe-header-geometry.mjs\\\`, all eight pages that have a header): the title's viewport position was already identical everywhere (\\\`titleTopFromDialog = 54\\\`), but the title→description distance was not — 4px on this plugin's own pages, 12px on the official ones, **0px** on Command Code (its container is block flow, so no gap at all and the description touched the title) and 16px on 侧边卡片. The official value, read with this plugin's stylesheets temporarily disabled: **12px on models / agent presets / bundled plugins** — the section container's own \\\`gap\\\`. The \\"official 4px\\" the older docs claimed was this plugin's own compression, and it is retracted.
- ✅ \\\`src/client/settings-page.ts\\\` now produces exactly the skeleton a page needs and nothing more: \\\`h2.enhc-page-title\\\` + \\\`p.enhc-page-intro\\\` as siblings. This plugin's own pages render it through \\\`SettingsPageHeader\\\`, foreign pages get the pair stamped on their real nodes, and the head wrapper is gone — so a DevTools inspection shows the same two-node header shape on every page, official or third-party.
- 📐 The spacing is no longer a stylesheet constant: the reconciler measures the container that actually lays the header out (walking up through \\\`display: contents\\\` slot outlets) and writes the correction onto the description (\\\`margin-top = 12px − container gap\\\`), plus a compensating negative \\\`margin-top\\\` on the title when a container contributes its own \\\`padding-top\\\`/\\\`border-top\\\`. After the fix every page reads **title y=134, intro y=172, gap=12px** while the containers still differ (4 / none / 12 / 16 / 2px).
- 🔒 Nothing is moved or re-parented (a foreign React tree never sees a wrapper it did not render), a page that already conforms is left exactly as authored, and the reconciler's diff releases a node — and its inline spacing — the moment a page re-renders around it.

**Fixed — the sidebar account popup was narrower than the row it hangs from**

- 🐛 The account menu (设置 / 意见反馈 / 退出登录) painted at the product Menu's content width (218–360px) under a sidebar row that is the full 256px — a visible seam between the popup and its trigger.
- ✅ \\\`src/client/menu-anchor.ts\\\` pins a portalled menu opened from the settings-launcher seat to its trigger row's width (\\\`box-sizing: border-box\\\`), scoped to that seat: the composer's model/permission pickers and every other menu keep their own recipe.

**Fixed — a third-party settings page rendered completely unstyled (loader claim-pass bug)**

- 🔍 Root cause found in the product's client-module loader, not in the plugins: \\\`claimStyles(id)\\\` runs after **every** module factory materializes and adopts **every untagged \\\`<style>\\\` in the document** for that plugin (\\\`style:not([data-plugin])\\\`), while \\\`removeOwnedStyles(id)\\\` deletes every \\\`style[data-plugin=id]\\\` when that adopter reloads, unloads or is pruned. A plugin that hand-injects its stylesheet once in \\\`apply()\\\` (dsh-notification: \\\`#dsh-notification-style\\\`) therefore loses it permanently for the session — measured live: the 通知 page rendered as a raw text dump (no cards, no badges, default buttons) and \\\`#dsh-notification-style\\\` was simply absent.
- ✅ \\\`src/client/style-keeper.ts\\\` snapshots hand-injected stylesheets (\\\`data-plugin-css\\\` is the discriminator: bundler-emitted tags are the loader's own and stay untouched) and restores one that disappears, after a grace period that lets a legitimately hot-reloaded owner re-inject first. A restored sheet keeps its authored attributes — the thief's \\\`data-plugin\\\` claim is dropped.
- 📊 Probe (live page, loader semantics reproduced): baseline 38 rules + card \\\`1px/12px/flex\\\` → after the theft no sheet and \\\`0px/0px/block\\\` → after the grace period 38 rules and the card styled again; 9/9 checks pass.

**Cleanup**

- 🧽 Repaired 48 mojibake characters in \\\`enhancer.module.css\\\` comments (an old PowerShell \\\`Get-Content -Raw\\\`/\\\`Set-Content\\\` round trip had re-encoded the file as GBK: \\\`—\\\` → \\\`鈥?\\\`, \\\`×\\\` → \\\`脳\\\`, one Chinese phrase destroyed). Comment-only damage — the build was never affected — rewritten as UTF-8 by a Node script, never through a shell.

`

const ZH = `### 未发布（待验收）：设置页表头统一骨架 · 行内弹层宽度 · 第三方样式表守卫

**重构 —— 设置页表头只剩一套骨架、一套几何，所有页面一致**

- 🔍 先量后改（\\\`scripts/probe-header-geometry.mjs\\\`，八个月有表头的页面全量测）：标题的 viewport 位置本来就一致（\\\`titleTopFromDialog = 54\\\`），但标题→描述的距离不一致——本插件自己的页面 4px、官方页 12px、Command Code **0px**（它的容器是 block 流、根本没有 gap，描述贴着标题）、侧边卡片 16px。把我们插件的样式表整体禁用后量到的官方值：模型 / Agent 预设 / 内置插件**都是 12px**，也就是官方 section 容器自己的 \\\`gap\\\`。旧文档写的「官方 4px」其实是本插件当年自己压出来的，正式作废。
- ✅ \\\`src/client/settings-page.ts\\\` 现在只产出页面真正需要的那套骨架：\\\`h2.enhc-page-title\\\` + \\\`p.enhc-page-intro\\\` 两个兄弟节点。本插件自己的页面用 \\\`SettingsPageHeader\\\` 渲染，别人的页面由规范器打在真实节点上；**head 包裹容器已删除**，所以在 DevTools 里无论官方页还是第三方页，看到的表头形状都是同样的两个节点。
- 📐 间距不再是样式表常量：规范器实测真正负责排版的那层容器（会穿过 \\\`display: contents\\\` 的插槽出口向上找），把差值写到描述上（\\\`margin-top = 12px − 容器 gap\\\`）；容器自己有 \\\`padding-top\\\`/\\\`border-top\\\` 时，再给标题等量的负 \\\`margin-top\\\`。修完后每页读数都是 **标题 y=134、描述 y=172、间距 12px**，而各页容器依然各不相同（4 / 无 / 12 / 16 / 2px）。
- 🔒 不移动、不包裹任何节点（别人的 React 树不会看到自己没渲染过的容器）；本来就合规的页面保持原样；页面重渲染后，规范器会把不再承担角色的节点、连同内联间距一起释放。

**修复 —— 侧边栏账号弹层比它所在的行更窄**

- 🐛 账号菜单（设置 / 意见反馈 / 退出登录）用的是产品 Menu 的内容驱动宽度（218–360px），而它挂在的侧边栏行是满宽 256px，弹层与触发行之间有明显错位。
- ✅ \\\`src/client/menu-anchor.ts\\\` 把从 \\\`settings.launcher\\\` 座位打开的门户菜单钉到触发行的宽度（\\\`box-sizing: border-box\\\`），且只作用于该座位：输入区的模型/权限选择器等其它菜单维持各自配方。

**修复 —— 某个第三方设置页完全没样式（产品 loader 的 claim 缺陷）**

- 🔍 根因在产品的 client-module loader，而非插件：\\\`claimStyles(id)\\\` 在每个模块工厂完成物化后运行，会把文档里**所有没有 \\\`data-plugin\\\` 的 \\\`<style>\\\`** 都记到当时物化的那个插件名下；而 \\\`removeOwnedStyles(id)\\\` 会在那个「收养者」重载/卸载/被 prune 时删掉所有 \\\`style[data-plugin=id]\\\`。于是在 \\\`apply()\\\` 里手写注入一次样式表的插件（dsh-notification 的 \\\`#dsh-notification-style\\\`）会整会话丢掉样式——真机实测：通知页退化成裸文本（没有卡片、没有徽标、按钮是浏览器默认样式），\\\`#dsh-notification-style\\\` 根本不在文档里。
- ✅ \\\`src/client/style-keeper.ts\\\` 对「手写注入」的样式表做快照（判别依据是 \\\`data-plugin-css\\\`：打包器产出的标签归 loader 所有，不动），消失后延迟一小段时间再恢复——这个延迟正好让「合法热重载后自行重注入」的属主抢先，避免重复。恢复出来的样式表保持作者写的属性，不带「小偷」留下的 \\\`data-plugin\\\`。
- 📊 探针（真机页面，按 loader 语义复现）：基线 38 条规则 + 卡片 \\\`1px/12px/flex\\\` → 偷走瞬间无样式表、卡片 \\\`0px/0px/block\\\` → 宽限期后 38 条规则、卡片恢复；9/9 全绿。

**清理**

- 🧽 修掉 \\\`enhancer.module.css\\\` 注释里 48 个乱码字符（早前 PowerShell \\\`Get-Content -Raw\\\`/\\\`Set-Content\\\` 往返把文件按 GBK 重编码：\\\`—\\\` → \\\`鈥?\\\`、\\\`×\\\` → \\\`脳\\\`，还有一处中文词组被毁）。仅注释受影响、构建从来不受影响；已用 Node 脚本按 UTF-8 重写，不经 shell。

`

const TARGETS = [
  { file: 'D:/dsh-home/plugins/dsh-ui-harmonizer/README.md', start: '### Unreleased (pending acceptance) — one settings-header architecture', end: '### v0.9.0 ', section: EN },
  { file: 'D:/dsh-home/plugins/dsh-ui-harmonizer/README.zh-CN.md', start: '### 未发布（待验收）：设置页表头统一架构', end: '### v0.9.0 ', section: ZH },
]

for (const { file, start, end, section } of TARGETS) {
  const text = readFileSync(file, 'utf8')
  const at = text.indexOf(start)
  const to = text.indexOf(end, at + 1)
  if (at < 0 || to < 0) { console.error(`anchors missing in ${file} (${at}, ${to})`); continue }
  writeFileSync(file, text.slice(0, at) + section + text.slice(to), 'utf8')
  console.log(`updated ${file}: ${to - at} → ${section.length} chars`)
}
