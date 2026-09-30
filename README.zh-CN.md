---
description: "统一 Harness 界面语言，并为社区插件做针对性适配，附只读兼容性审计。"
---

<p align="right"><a href="README.md">English</a> · <b>简体中文</b></p>

<h1 align="center">DSH UI Harmonizer</h1>

<p align="center">
  <strong>DeepSeek Harness 打造的界面规范化与协调层/strong><br>
  规范化官方界· 协调每个插件 · 设置页自动规范器 · 界面定制（含圆角卡片</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-ui-harmonizer?style=flat&label=latest%20release&color=4D6BFE" alt="Latest release">
  <img src="https://img.shields.io/npm/dt/dsh-ui-harmonizer?style=flat&label=total%20downloads&color=4D6BFE" alt="Total downloads">
  <a href="https://github.com/Physicolor/dsh-ui-harmonizer/stargazers"><img src="https://img.shields.io/github/stars/Physicolor/dsh-ui-harmonizer?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License">
  <img src="https://img.shields.io/badge/DSH%200.1.x-4493F8?style=flat-square" alt="Supported: DeepSeek Harness 0.1.x">
</p>

---

> **一句话* 你装了一DSH 插件，界面却风格割裂？DSH UI Harmonizer 用*CSS 覆盖 + 运行DOM 协调**」把它们拉回官方设计语言—*不破坏任何插件源码、卸载即还原、零模型开销**
DSH UI Harmonizer 是一*纯浏览器端（client-only*DSH bundle 插件。它不新增模型工具、不改写会话日志，只通过官方 `settings.section` / `settings.general.item` 槽位`--dsw-*` 语义令牌体系调整界面
---

## 当前功能

### 🎨 官方 UI 规范
| 能力 | 说明 |
| --- | --- |
| 顶部栏单行化 | 对话/轨迹选择器移入标题行，header 收成单行 |
| 按钮胶囊家族 | Session log、组件、toggle 按钮统一32px 胶囊 |
| 右侧栏贴边圆角矩| better-sidebar 面板覆盖式布局，header 不动 |
| 设置页头统一 | 标题 18/600 + 描述 13px + hairline 收尾 |
| 原生 title 悬浮提示统一 | `title` 属性改用官方深色气泡渲染，替代系统默认提示样式 |

### ♻️ 插件视觉协调

| 协调对象 | 做法 |
| --- | --- |
| `dsh-better-sidebar` | toggle 按钮胶囊化、面板背景统一、布局协调、平滑过渡动|
| `dsh-widgets` | 统计胶囊同族、header utilities 对齐 |
| `@omdsh-dev/dsh-genui` | `render_ui` 面板与工具卡片：宽度跟随「对话列最大宽度」（`--enhancer-content-width`，如 840px）而非冒泡到整列；修复折叠flex-nowrap 长标题撑宽根因并统一 11px/16px 内边距；`banner`/`steps` 等横贯块16px 左右间距规范（不向外扩盒）；svg/pre/canvas/img/mermaid 全部限宽护栏 |
| 第三方设置页 | 自动补标题、删多余图标、统一间距格式 |

### 🧹 设置页自动规范器 
任何第三方插件往 `settings.section` 加页面时，若没有严格按官方规范设计，插件会自动修正：

| 自动检查项 | 修正方式 |
| --- | --- |
| 缺页面标| 注入 18/600 标题（取导航项名或已知映射） |
| 标题旁多余图| 移除标题logo，保留纯文字 |
| 标题/描述贴太| 统一 4px 间距 + hairline 收尾 |
| 字号/格式不统一 | 标题 18/600、描13/20 + `border-bottom` |

### 🎛界面定制

设置 通用设置中的"界面定制"块：对话宽度、markdown 字号、工作区字号、UI 字体、圆角卡片均可实时调节。「圆角卡片」把对话区域显示为左上圆角的卡片并附投影，高度跟随侧栏宽详情列自动伸缩
---

## 工作原理

插件按**作用对象**分层，而不是按文件类型堆放 —— 它同时协调两件事：(a) DSH 本体自身的界面规范，(b) 装在同一台机器上的各个社区插件。每个源文件只属于四层之一：

| 层 | 回答什么 | 例子 |
| --- | --- | --- |
| `core/` | 与 DSH、与任何插件都无关的基础设施 | 状态模型与持久化、Harmony Contract、i18n、DOM/React 小工具 |
| `harness/` | 针对 **DSH 本体**的规范化与修补 | 官方控件 recipe 复刻、设置页表头规范器、对话宽度通道、列轨道动画兜底、菜单宽度、样式表守护、原生 title 气泡、圆角卡片 |
| `plugins/<包名>/` | 只服务于**某一个**社区插件 | `commandcode-provider` 文本归一、`dsh-widgets` 组件栏让位与手柄重锚、`dsh-better-sidebar` 面板、`dsh-genui` 宽度卫生 |
| `self/` | 插件**自己**画的界面 | 设置 → 通用 的五行、字体选择器、Harmony Doctor 页 |

样式表按同一划分拆成 23 个 `.module.css` 分片，入口只有一个（`src/client/styles/index.ts`），**它的 import 顺序就是层叠顺序**。

其余约束不变：

- **零模型开销**：host（node）半是 no-op，全部改动发生在浏览器半；
- **官方设计令牌**：所有样式走 `--dsw-*` 语义令牌，自动跟随明暗主题；
- **两条注入通道**：静态规则（CSS Modules）+ 动态 `<style data-plugin>` 标签；
- **可逆清理**：每个 `ctx.effect` 都返回 disposer，卸载后不留残留 —— 包括被搬迁过的 DOM 节点和被改写的第三方文案；
- **Slot 接入**：`settings.general.item` / `settings.section` / `shell.overlay`。

护栏都在 `scripts/`：`tools/css-baseline.mjs`（编译后样式表的字节不变式）、`verify-frame-track.cjs`（列轨道动画）、`verify/settings-page.cjs`（设置页信号）、`probes/harness/*`（选择器与网络体检）。
---

## 安装

```sh
# 通过 npm（插件市场）
dsh plugin --profile web add dsh-ui-harmonizer

# 本地开发（link 方式dsh plugin --profile web add link:D:/dsh-home/plugins/dsh-ui-harmonizer
```

安装*硬刷新浏览器**（Ctrl+Shift+R），设置 通用设置 看到"界面定制"块
---

## 开
```sh
pnpm install
pnpm run build      # tsdown 构建 lib/
pnpm run check      # 类型检+ 构建
```

- `peerDependencies`：`@deepseek-ai/dsh-client-ui-slots`、`dsh-client-runtime`（由 DSH web profile 提供）；
- client 插件：`cordis.patch.yml` 插入 `ui-enhancer` 行，浏览器半`dsh.client` 声明
- **修改后需同步**：`npx tsdown` 重建 同步`profiles/web/node_modules/dsh-ui-harmonizer/lib/` 硬刷新浏览器
---

## 兼容
- DeepSeek Harness `0.1.0-rc.6` 及兼容的后续 `0.1.x`
- 通过官方 slot 接入，与 better-sidebar、dsh-widgets、dshmarket 等插件按 slot 顺序共处
- 已知协调对象：`dsh-better-sidebar`、`dsh-widgets`、`dsh-notification`、`dshmarket`
- 卸载/禁用后页面完全恢复默认，无残留
---

## 路线
- **阶段一 · 官方 UI 规范*（进行中）：继续修复官方界面中未完善的部分；
- **阶段· 插件兼容协调*（进行中）：检测并修复插件间的布局/样式冲突
- **阶段· 统一视觉风格**（进行中）：可选的视觉风格层——已落地「圆角卡片」（包裹 header 模型）与 title 悬浮提示统一，待续：间距密度、更多圆动效统一  - *液态玻璃（探索：规范化的终点是降低认知成本——统一的标题与提示消除的是「风格切的微疲劳；材质层统一更进一步：用一致的物理隐喻暗示层级与可交互性，让整个页面形成单一心理模型，减少视觉与认知负担。边界：只在语义 token / CSS 层实验——设置开关可选、大面积 backdrop 表面至多两处（控GPU 开销）、尊重减弱透明动效偏好、不支持时回退到现行实底样式、绝不触碰插件源码，且以可读性不降为底线
- **阶段· 生态共*：沉淀为可扩展的规则注册机制
---

## 变更日志

### v0.9.0 — 一套 Harness 界面语言，以及按目标分层的代码布局

**重构 —— 每个源文件只属于一层**

- 插件按**作用对象**分层：`core/`（与 DSH、与任何插件都无关的基础设施）、`harness/`（针对 DSH 本体的规范化）、`plugins/<包名>/`（只服务于某一个社区插件）、`self/`（本插件自己画的界面）。`src/client/` 顶层现在只剩 `index.ts` 与 `services.d.ts`。
- 1253 行的样式表拆成 **23 个 `.module.css` 分片**，入口只有一个（`src/client/styles/index.ts`），**它的 import 顺序就是层叠顺序**；拆分已证明与原文件逐字节相同，`scripts/tools/css-baseline.mjs` 现在守住编译后的结果。
- `npx tsc --noEmit` 从 **52 个错误降到 0**；`build` 现在会跑 `tsc`，`lib/types/` 这才真的存在（此前 `files` 里声明了它却从未生成）。

**修复 —— 对真实 DOM 做对抗性复核后找出的失效与错配选择器**

- **下拉菜单的配方从未生效**：`[role='menu'] [class^='_list_']` 既是后代又是前缀匹配，而产品把 `role` 与 list 类放在**同一个**元素上、且 list 类不在最前（`_surface… _list_4ub78_7 …`）。菜单打开时实测：后代 0、前缀 0、包含 1。改成 `[role='menu'][class*='_list_']` 后，list / item / icon / label 四条规则全部落地（padding 4px、min-width 218px、item min-height 40px）。
- 侧栏里带修饰类的行（`_brand _wide`）会静默不再匹配 `[class$='_brand']`；锚点改为「class 列表**包含**一个 `_brand` 词条」的写法。
- 品牌字标不再被改尺寸 —— 0.2 把它渲染成**两个** svg（鲸鱼 + HARNESS 徽章），一条 `svg { width:182px }` 会把鲸鱼拉伸 7.6 倍。
- `menu-anchor` 不再把官方设置按钮（`aria-haspopup="dialog"`，且设置对话框开着期间 `aria-expanded` 恒为 true）当成菜单触发器 —— 它此前把产品自己的弹层强行改成侧栏某行的宽度。
- Doctor 的 `deadInThisView` 被声明了两次（一个计数、一个行数组），导致 Markdown 导出打印 `[object Object]`；另外删掉一条死规则 `market-hash`、修正一条错归属的 `data-dsh-*` 耦合。

**修复 —— 帧的列轨道在 DSH 0.2 上真的会动了**

- 0.2 把 AppFrame 的 `transition: grid-template-columns` 挪到 `[data-animating]` 后面，而 React 在**写入新轨道的那次 commit** 的 layout effect 里设置这个属性 —— 起始样式因此没有 transition，过渡从不启动，对话列是**瞬变**的。实测：一帧从 1640px 到 776px、没有任何 transition 事件、`data-animating` 靠组件自己的 600ms 兜底定时器清除。
- 样式表现在让帧常驻这条 transition（产品自己的 `[data-dragging]` / `[data-rightbar-instant]` 规则依然优先），并由 `frame-track.ts` 承担产品用 JS 排除的那一种情况 —— 窗口缩放。

**修复 —— 生命周期**

- 两处 DOM 搬迁（会话 tabs、底部工作台开关）在 dispose 时把节点搬回原位；圆角卡片那条无条件的 1Hz `setInterval` 已删除（ResizeObserver + resize + transition 事件早已覆盖同一路径）；设置页表头的指纹改为对**文本内容**做哈希，而不是长度（等长改写会让标题冻结）。

### 未发布（待验收）：设置页表头统一骨架 · 行内弹层宽度 · 第三方样式表守卫

**重构 —— 设置页表头只剩一套骨架、一套几何，所有页面一致**

- 🔍 先量后改（`scripts/probes/settings/probe-header-geometry.mjs`，八个月有表头的页面全量测）：标题的 viewport 位置本来就一致（`titleTopFromDialog = 54`），但标题→描述的距离不一致——本插件自己的页面 4px、官方页 12px、Command Code **0px**（它的容器是 block 流、根本没有 gap，描述贴着标题）、侧边卡片 16px。把我们插件的样式表整体禁用后量到的官方值：模型 / Agent 预设 / 内置插件**都是 12px**，也就是官方 section 容器自己的 `gap`。旧文档写的「官方 4px」其实是本插件当年自己压出来的，正式作废。
- ✅ `src/client/settings-page.ts` 现在只产出页面真正需要的那套骨架：`h2.enhc-page-title` + `p.enhc-page-intro` 两个兄弟节点。本插件自己的页面用 `SettingsPageHeader` 渲染，别人的页面由规范器打在真实节点上；**head 包裹容器已删除**，所以在 DevTools 里无论官方页还是第三方页，看到的表头形状都是同样的两个节点。
- 📐 间距不再是样式表常量：规范器实测真正负责排版的那层容器（会穿过 `display: contents` 的插槽出口向上找），把差值写到描述上（`margin-top = 12px − 容器 gap`）；容器自己有 `padding-top`/`border-top` 时，再给标题等量的负 `margin-top`。修完后每页读数都是 **标题 y=134、描述 y=172、间距 12px**，而各页容器依然各不相同（4 / 无 / 12 / 16 / 2px）。
- 🔒 不移动、不包裹任何节点（别人的 React 树不会看到自己没渲染过的容器）；本来就合规的页面保持原样；页面重渲染后，规范器会把不再承担角色的节点、连同内联间距一起释放。

**修复 —— 侧边栏账号弹层比它所在的行更窄**

- 🐛 账号菜单（设置 / 意见反馈 / 退出登录）用的是产品 Menu 的内容驱动宽度（218–360px），而它挂在的侧边栏行是满宽 256px，弹层与触发行之间有明显错位。
- ✅ `src/client/menu-anchor.ts` 把从 `settings.launcher` 座位打开的门户菜单钉到触发行的宽度（`box-sizing: border-box`），且只作用于该座位：输入区的模型/权限选择器等其它菜单维持各自配方。

**修复 —— 某个第三方设置页完全没样式（产品 loader 的 claim 缺陷）**

- 🔍 根因在产品的 client-module loader，而非插件：`claimStyles(id)` 在每个模块工厂完成物化后运行，会把文档里**所有没有 `data-plugin` 的 `<style>`** 都记到当时物化的那个插件名下；而 `removeOwnedStyles(id)` 会在那个「收养者」重载/卸载/被 prune 时删掉所有 `style[data-plugin=id]`。于是在 `apply()` 里手写注入一次样式表的插件（dsh-notification 的 `#dsh-notification-style`）会整会话丢掉样式——真机实测：通知页退化成裸文本（没有卡片、没有徽标、按钮是浏览器默认样式），`#dsh-notification-style` 根本不在文档里。
- ✅ `src/client/style-keeper.ts` 对「手写注入」的样式表做快照（判别依据是 `data-plugin-css`：打包器产出的标签归 loader 所有，不动），消失后延迟一小段时间再恢复——这个延迟正好让「合法热重载后自行重注入」的属主抢先，避免重复。恢复出来的样式表保持作者写的属性，不带「小偷」留下的 `data-plugin`。
- 📊 探针（真机页面，按 loader 语义复现）：基线 38 条规则 + 卡片 `1px/12px/flex` → 偷走瞬间无样式表、卡片 `0px/0px/block` → 宽限期后 38 条规则、卡片恢复；9/9 全绿。

**清理**

- 🧽 修掉 `enhancer.module.css` 注释里 48 个乱码字符（早前 PowerShell `Get-Content -Raw`/`Set-Content` 往返把文件按 GBK 重编码：`—` → `鈥?`、`×` → `脳`，还有一处中文词组被毁）。仅注释受影响、构建从来不受影响；已用 Node 脚本按 UTF-8 重写，不经 shell。

### v0.9.0 定位升级：从「CSS 补丁」到「UI 契约+ 兼容性审计器
**新功能（Harmony Contract 跨插UI 契约*

- 🧭 `<html>` 上发布协商变量，任何插件或主题都能读，不需要互相依赖：`--enhc-contract`（契约版本）、`--enhc-surface-solid`、`--enhc-glass-aware`、`--enhc-solid-fill`、`--enhc-content-width`、`--enhc-sidebar-scale`
- 🔌 提供 `ctx.get('uiHarmony')` 服务（与官方 `ctx.sidebarRight` 同一`ctx.reflect.provide` 约定）：别的插件`registerSurface({ id, role, occupies, widthVariable, transition, tokens, opaque })` **申报**自己占了哪块表面、用哪个 token、动画多长。本插件只做仲裁与告警，不再靠猜别人DOM。本插件自身也申报了两个表面（圆角卡片、设置页行）
- 🪟 **材质感知**：从语义 token 本身判断界面是实体还是半透明（`--dsw-alias-bg-base` / `-layer-1` / `--dsw-specific-sidebar-fill` alpha），不做插件身份判断。检测到玻璃主题`--enhc-solid-fill` 变为 `transparent`，会header / 面板不再往玻璃上糊一块不透明矩形（此前是「玻璃上一个没有模糊的洞」）。尊`isTranslucent()` 的解析规则（`rgba`/8 hex/`transparent`；`var()`、`color-mix()` 视为实体，不猜）*实测（模拟玻璃，不装第三方主题）**：把 `--dsw-alias-bg-base` 就地改成 `rgba(255,255,255,0.45)` 后，`--enhc-glass-aware` 0、`--enhc-surface-solid` 1、`--enhc-solid-fill` `transparent`、会header `background-color` `rgb(255,255,255)` 变为 `rgba(0,0,0,0)`；移除该覆盖后四项全部回滚
**新功能（Harmony Doctor 本机只读兼容性审计）**

- 🩺 设置 **UI 兼容*：一次点击跑完四类检查，零网络、零模型调用，可导出 Markdown 报告
- 🕳**死规则台*：逐条 `querySelectorAll` 统计本插件自己的 CSS 规则命中数；**只有在一个视图里从没命中过才算「未观测」，在多个视图里都没命中才算「死*——台账按视图持久化，用户走到哪、结论就精确到哪。开箱即得的核心数字49 条选择器里 **53 条在任一视图命中6 条在所有已观测视图里全*（会话视图未接入6 是上界）
- 🔗 **跨插件耦合健康*：列出仍然在读别人私有类/`data-*` 的选择器与实时命中数（本机实测自动报出 **39 条耦合**，其中一批因 better-sidebar 0.19.1 已移除对应类而命0）
- ⚖️ **冲突 / 冗余判定**：行内声明自检（写进去的值必须读得回来）+ 冗余检测（把自己所有样式表临时 `disabled` 再读计算值，值没= 这条规则什么也没做）
- 🗂**表面清单**：每`data-slot`、每个跨插件 `data-*`、每个已发布契约变量、每个被申报的表面，各自的使用方与数量
**修复（字体设置此前完全不生效 已定位并修复*

- 🔍 **根因**：字号行12 `--dsw-font-markdown-*` 令牌写在一`<style>` 标签里，该标签在 `document.head` 中排**4** 位，而官theme `gradient-shadow-text.css`（同样把令牌声明`body{}` 上）排第 **24** 位。选择器与特异性完全相后写的官方赢*四个字体预设（默衬线/等宽/雅黑）读出来的令牌值逐字节相*，CDP 实测渲染字体也全`Segoe UI + Microsoft YaHei`。此前「改了没反应」不是字体没装（实测 HarmonyOS Sans SC、微软雅黑、Noto Sans SC、Georgia、SimSun、Consolas、Courier New 均在本机可用）
- **修法**：字体族改写**`<body>` / `<html>` 的行内自定义属*（行内优先，与样式表顺序无关），并在销毁时精确移除；令牌里的字号不再写px，而是引用产品自己`--dsh-content-font-size` / `--dsh-content-font-delta`
- 🎯 修复后实测：`serif` 令牌 `Georgia…`、CDP 渲染 `Georgia`(10 字形) + `SimSun`(4)；`yahei` + 作用范围「整个界→ 界面元素渲染 `Microsoft YaHei`；`default` 完全不留覆盖（纯官方）
- 🧩 **补齐覆盖缺口**：现在覆盖官0.1.5 全部 **12** 个真正被 `var()` 消费markdown 令牌，补上旧版漏掉的 `-table-head`（表格表头）、`-code-block-small`（工技Cordis 面板代码块）、`-code-font-family`（slash chip）；另外 90 个从未被消费的声明不再触碰。代码块只在选到等宽预设时跟随，选衬线不会把代码也变成衬线
- 新增**字体作用范围**（对话正/ 整个界面）与**未安装字体提*（两基线 canvas 宽度差判定，`document.fonts.check` 对未知字体恒返回 true，不可用）
**修复 / 减法（官0.1.5 已收编或已失效的部分*

- 🗑删除 **`html.enhc-panel-open` 座位机制**与整better-sidebar toggle-cluster 座位。实better-sidebar 0.19.1 192 CSS-module 表里**已无** `toggleCluster` / `panelHidden` / `panelResize`，也不再发布 `--dsh-sidebar-width`（改`--dsh-title-bar-strip` / `--dsh-sidebar-height`）。保留下来的后果是反向的：`panelOpen` 恒为 `true`，只要面板节点在 DOM 里「紧凑浮动座位」就成了默认形态——不是失效，*反着生效**
- 🗑删除 `[data-input-scroll]` 与用户气泡的字号覆盖：产品自己就`--dsh-content-font-size` 控制这两处，我们的覆盖把官方「内容字号」行在这两个表面冻住了。实测行高从我们写死`21px` 回到官方 `24px`
- 🗑内容字号行本身下线：官方 0.1.5 自带 `FontSizeRow`27px，命名空`ui-theme`），本插件改为消费它的通道而不是和它抢同一组令牌*保留**官方没有的两项：对话宽度设置行、字体族与作用范围（官方 `--dsw-font-family` `:root` 上的固定值、无用户设置）
- 🧹 中间列圆角卡片改为材质变量驱动（`--enhc-solid-fill`），为玻璃主题让出画
**可复*

- 渲染级探针：`node scripts/probes/plugin-eco/probe-harmony.mjs http://127.0.0.1:19387 out.json`（`scripts/lib/auth.mjs` 用本机持久化browser-session secret 自签 cookie 通过 UI 门禁，无需启动令牌、不打扰正在使用的会话）
- 全部量化数据、口径与反例（含「未观测会话视图6 是上界」这一限制）：`docs/MEASUREMENTS.md`
### v0.8.4（未发布，待验收
**兼容适配 DeepSeek Harness 0.1.5 的客户端结构变更*

- 🧭 **中栏定位改写（唯一硬失效项*.1.5 把会话从 root 的直接子`conversation` 改成 `main` 的键控条目，并在其下声明 `main.conversation`；两anchor 都是 `display:contents`（零盒），旧`slot.parentElement` 会拿到一个不可测量的 wrapper。`findCenterColumn()` 现在同时接受 `[data-slot="main.conversation"]` `[data-slot="conversation"]`，并`closest('[class$="_centerCol"]')` 取回真正的列容器（旧parentElement 逻辑保留为回退）。圆角卡片的 CSS `:has()` 守卫同步接受 `main` / `conversation` 两种锚点写法
- 🔌 **类型与打包来源对齐官*：`@deepseek-ai/dsh-client-runtime` 已在 0.1.5 web 组装中退役（npm 上停更于 0.1.1-rc.2），客户端上下文的类型来源改`@deepseek-ai/cordis` `Context`；`package.json` peer/devDependencies `tsdown.config.ts` 的平台模块表同步移除该包（运行时import 它，原先只有类型依赖）
- 🔍 **审计结论（其余全部存活，未改代码*：`[data-slot="conversation.session.header"] > header`、`_titleCluster` / `_headerActions` / `_tabs` / `_viewArea` / `_composerSeat`、侧栏系列、设置页四件套（`settings.section` + `_intro` + `nav button` + `_navCell`）、菜单基元、`shell.overlay` / `settings.general.item` / `settings.section` 三个 slot 0.1.5 全部原样存在；`_flowItem` / `_bubble` 随聊天渲染迁入新`dsh-client-ui-chat`（哈希变、后缀选择器不受影响）
- **实测**.1.5-rc.2 隔离实例（独DSH_HOME + 独立 profile + 3081 端口）中，圆角卡overlay `main.conversation` 结构下几何正确（`left=56px / width=694px`），插件样式63 个客户端 entry 一同加载，无未捕获异常、无 slot 错误
- 🎛**顶部栏（2026-09-13 追加，两处按官方为主*\n- **对话/轨迹回归官方 tab 样式**.1.5 自带真正tab 选择器（`_tabs` `gap:36px; margin-top:10px` + `_tab` 的文字＋2px 下划线指示条，激活态用 `state-business-primary`），此前被本插件改成了自造胶囊。现已删除该胶囊覆盖，恢复官方下划线样式；同时把 `margin-top:10px` 在标题行内归零（10px 正是「tab 比顶部栏低一截」的错位根因），标签上下改为对称 5px 内边距，由标题行`align-items:center` 完成垂直居中\n- **移除右侧预留*：header 原本`margin-right: max(var(--dsh-sidebar-width,0px), 90px)` better-sidebar 的浮动按钮簇留位.19 起该插件把控件注册进官方 header 座位（`ctx.sidebarRight` / header corner）且不再发布该变量，90px 会变成右侧死白。现改为只跟随变量（0.1.5 下解析为 0，官grid 列自己让位），旧better-sidebar 若仍设置该变量则保留其预留
- 📌 已知待目视复核：`_flowItem` 的新哈希只影响观感细节；`.nArs4W_*`（better-sidebar .14 类名）相关规则在 0.19.1 下已是死代码，可后续清理
### v0.8.3（未发布，待验收
**性能 侧栏挤压动画保留丝滑渐进观感的同时达到满帧率（配dsh-widgets v1.2.3）：**

- 面板开合掉帧的根因：三个被挤压表面（对话区 `viewArea`、输入框 `composerSeat`、会header）以 0.3s 过渡动画 `margin-right: var(--dsh-sidebar-width)`——每帧对**整个对话 DOM** reflow，长会话（数千节点）下掉201%，并与合成器驱动的组件栏/面板滑动肉眼可见地不同步
- 修复*原样保留渐进 margin 动画**（左缘恒定、右缘平滑滑动、文字渐进重排——不做「先跳到终宽再平移」的妥协），转而把每帧重排变便宜：对话每个回合/步骤（`*_flowItem`）获`content-visibility: auto` + `contain-intrinsic-size: auto 120px`，离屏条目完全跳过布局，动画每帧只重排视口附近的几条。`auto` 让浏览器记住每条最后渲染高度，滚动条高度稳定；不支持的浏览器自动忽略该规则（仅回退到较慢行为）
- **实测数*（playwright + 本机 Edge，组件栏开启，重会话，面板开合窗口）：掉帧率 **201% 11.5%（rail 修复）→ 0%**；动画期viewArea **左缘漂移 0px**（始终对齐）；rail↔对话列右缘恒距（std 0.01px，完全锁步）；跳到滚动底部后 scrollHeight 偏移 0%（intrinsic 尺寸收敛）；热状态后开合的最大单帧步进约 89px——headless 软件渲染下的中段帧，真机 GPU 上更小。已知一次性现象：页面加载*第一*开面板仍有一帧较大步进（better-sidebar 面板首次渲染的长任务，与本修复无关）
- 自包含验证：`scripts/archive/dead-probes/verify-glide.cjs`（`npm i -D playwright-core && node scripts/archive/dead-probes/verify-glide.cjs [会话名]`）
### v0.8.2 已发
**新功能（i18n 中英文语言适配）：**
- 设置 通用页面中所有硬编码的中文字符串现已根据浏览器语言自适应：页面标描述、五个设置行的标描述、以及字体预设标签，在非 `zh-*` 语言环境下会显示英文
- 新增 `src/client/i18n.ts` 模块集中管理所有面向用户的字符串；语言检测为**响应*——每次渲染调用时重新检测，切换设置语言后立即生效，无需刷新页面
- 检测优先级：`localStorage('dsh-language')`（官方设置面板写入）`<html lang="...">` 属`navigator.language` 回退
- 设置页标题填充逻辑中的 `KNOWN_TITLES` 回退表（用于为无标题的第三方页面注入标题）现在支持中英文匹配，且每次调用时重新获取，语言切换后注入的标题也会更新
- 中文环境下无任何视觉或行为变化；英文环境不再出现中英混杂的标签
### v0.8.1 已发布（2026-08-27
**修复（跨插件宽度卫生 @omdsh-dev/dsh-genui render_ui 面板与工具卡片）*
- 根因：`.panelToggle` 标题 span（长 nowrap 文本，如「opencode-go Key 迷你最终架构」）flex 子项却缺 `min-width:0`，flex 默认 `min-width:auto` 不允许收标题 max-content 宽度把折叠条与面板一起撑出对话列。harmonizer hash 无关属性选择器补 `flex:1 1 0%; min-width:0`（ellipsis 生效）；同类（`.toolFallbackMeta`、`.tlTime`）一并覆盖。纯 CSS 覆盖、零侵入 dsh-genui 源码
- 最终基准（定）：面板宽度 = **对话内容宽度**（`--enhancer-content-width`，当840px，与官方 `Md3f7G_column` 一致），`[data-genui-panel]{ display:block; width:100% !important; max-width: var(--enhancer-content-width, 748px) !important; margin:10px auto 2px !important; contain:inline-size }`，随「对话列最大宽度」滑杆即时自适应；此前「实测输入框宽」方案废弃（基准偏差）。教训：`width:auto + margin:auto` 会在 flex 交叉轴触shrink-to-fit 竖线回归，必须显`width:100%` 再叠max-width
- 横贯块左右间距：`banner` 与折叠条复用同一宽度格式（内容宽 + 16px 左右内缩，不向外扩盒）；`steps` 在无容器 padding 的内工具卡内16px；svg/pre/canvas/img/mermaid 全部限宽护栏；块组件（callout/card/list）不动
### v0.8.0 已发
**新功能（原生 title 悬浮提示统一）：**
- 仅依赖裸 HTML `title` 属性的元素（模型选择trigger 及其他直接用 title 的官方控件）此前弹出的都是系统默认样式的悬浮提示，与走官Tooltip 组件的所有表面不在一个视觉语言里。现在悬键盘聚焦时接管：title 在交互期间被暂时摘除，同文案以官方气泡重绘——`--dsw-alias-tooltip-bg` 深色底px 7px 内边距px 圆角3/20 字号0vw 宽度上限；悬浮延500ms、键盘聚焦立即显示；锚点下方 8px 放置（下方放不下自动翻转到上方）、距视口边缘 12px 钳制、处z-index 100 弹层带
- 回退安全：任意祖先携`data-enhc-no-tooltip` 即整棵子树退出统一；摘除的 title 在离开/失焦/插件停止时原样恢复（应用若在悬浮期间重写title 则保留新值）；淡入动画尊prefers-reduced-motion
**修复（toggle 按钮簇座位）*
- better-sidebar 浮动按钮簇获`bg-base` 不透明座位。默认（面板关闭）：整高块，覆盖会话 header 整个横带（top 0 56px），按钮/座位/header 读作同一条右侧边缘，widgets 组件列卡片不再透出。better-sidebar 右侧面板打开时（client 半边同步的根`html.enhc-panel-open`）座位收回到紧凑浮动形态——面板顶边设计上低于页顶，整高座位会探进面板预留角
**修复（圆角卡片包裹会header）：**
- AppFrame shell.overlay 出口自身就是 z-20 层叠上下文，画在里面的卡片装饰永远盖不过 z-21 的会header。零像素分工绘制模型（无任何白色卡底）：header 自己INSET box-shadow 画卡片上沿线（真 border-top 会让 header 长高 1px、与流外控件错位 左上 18px 圆角；悬浮层盒子退化为覆盖「header+内容」的纯投影投射器，改用强调左/上方向的定制阴影配方——官lv3 偏移向右下且其贴边接触晕会沿窗缘拉出一条多余暗线。无会话 header 的路由回退为经典自绘卡片。hover/激活填充照旧画在座位之上；座位顶部延续 header 上沿线，整卡宽度内边线读作一条不断线
### v0.7.1（并v0.8.0**修复（better-sidebar Files 标签栏）*
- 📏 标签现在撑满 44px 标签栏：此前固定 `height: 36px` 破坏better-sidebar 原生`align-items: stretch` 链条，在栏底留下8px 空白。改`height: auto` + 显式 `align-self: stretch`—4px 标签文字与图标仍在更高的栏内垂直居中
- ↔️ 右面板打开时标签栏右端让位 72px 90px：toggle cluster 变大后（两个 32px 胶囊 + 6px 间隙、`right: 12px` 起共 82px），旧让位会让最右侧标签 / + 按钮滑到胶囊下面0px = 82px cluster + 8px 呼吸空间。底部面板的 40px 让位不受影响
- 🧭 会话 header 的共享右外边距由 82px 90px，与加大后的 cluster 对齐（覆盖折叠态角部座位与打开面板`max()` 两种路径）
**修复（深色模式激活态文字）*
- 激活的「对话」标签在深色模式下改为蓝色填+ 白色文字。此前用的是 `--dsw-alias-label-primary-inverted`，在深色主题下解析为近黑bluish-800——蓝底黑字
- 激活的「组件」胶囊保留插件自带的正确搭配（`state-business-primary` + `#fff`）：此前本插件的一条覆盖把白色换成了同一近黑 token（仅深色下出现）。该覆盖已删除，两个按钮在明暗两种主题下均呈现「品牌蓝填充 + 白字」，与官方导cell 的范式一致
### v0.7.0
**元信包名改为 `dsh-ui-harmonizer`*
- 📦 npm 包由 `harness-ui-enhancer` 更名`dsh-ui-harmonizer`（dsh 前缀 + harmonizer 命名贴合生态惯例与检索；旧包deprecate 并指路）
- 🎯 定位：「为 DeepSeek Harness 打造界面规范化与协调层」——把 UI 规范调和进官方设计语言（不只是美化）
- 🔀 GitHub 仓库`Physicolor/harness-ui-enhancer` 更名`Physicolor/dsh-ui-harmonizer`（旧链接自动跳转，star/issue 保留）
- ♻️ 安装命令：`dsh plugin --profile web add dsh-ui-harmonizer`。无数据影响（纯 client 插件，无持久化键）
### v0.6.2
**修复*
- 🧱 会话顶部栏获得不透明卡片表面（`--dsw-alias-bg-base`），并提升到 shell overlay 层之1 级（`z-index: 21`，仍低于 better-sidebar 面板 40 与弹窗）：dsh-widgets 组件栏及其悬浮放大层将滑入顶部栏白色矩形之下，不再与顶部按钮视觉重叠。顶部栏规则统一enhancer（widgets 插件不再插手官方元素）
### v0.6.1
**修复*
- 🧩 侧栏打开时「对输入框与右侧面板之间的大段空隙」：修复对话`margin-right` 的二次挤压。此前对 `#root` 的中和只清掉`margin-right`，却保留better-sidebar 同规则里`width: calc(100% - var(--dsh-sidebar-width))` —width 挤压把整列先缩到面板左缘，viewArea/composerSeat margin 挤压再叠一遍，对话比面板多让出一个整面板宽。现`width: 100%` 完整中和 `#root`，内margin 成为唯一、正确的挤压（对话右缘贴合面板左缘，仅剩 scrollbar 8px 沟槽）
### v0.6.0
**移除*
- 🗑移除 MCP 服务器管自动化任务调度：这两项本不属UI 强化"范畴，从插件中整体删除（host half 相关 API 路由随之删除，插件回归纯 client、零 host 逻辑）。左下角不再MCP / 自动化按钮
**新功能：**
- 🃏 圆角卡片：对话区域显示为左上圆角的卡片并附投影（设置 通用设置 界面定制 圆角卡片）。不改任何源码：`shell.overlay` 挂透明覆盖层（顶边+ 左上圆角 + `--dsw-shadow-lv3` 投影）；阴影向左溢出到侧栏（形成卡片厚度），顶部下移 1px 给投影留缝；下为窗口自然边界、不画边框；左侧不分界线：借用侧栏自身`border-right` 作卡片左边界；覆盖层`ResizeObserver` 跟踪中间列，侧栏拖拽/折叠/详情列开合自动跟随；内容左上角由中间列自`border-radius` 蒙成圆角，与覆盖层同半径；纯 CSS 门控（`html.enhc-center-card-on` 类），可随时关闭、卸载零残留
**修复*
- 🎚界面定制开关实时反馈：圆角卡片开关改为本地镜像状态，按下瞬间 thumb 滑动 + 底色翻转，无需等待重渲染
### v0.4.1
- 🎯 better-sidebar toggle 按钮 relocate header utilities 区域（CSS 悬浮对齐
- 📐 header `max()` 共享宽度：sidebar 关闭时让80pxtoggle cluster，打开时跟sidebar 宽度
- 🎬 header `margin-right` 添加平滑过渡动画
- 📏 better-sidebar tab bar 高度调整4px，内部元素按比例放大
- 🔧 更新 better-sidebar hash 前缀 `W-zNGW` `nArs4W`
- 📐 panel 顶部定位改为 `top: 6px`

### v0.4.0
- 🔌 MCP 服务器管理面
- 自动化任务调度（周期/间隔/单次
- 💬 提示词输入框复用聊天样式
- 🎨 弹窗高斯模糊 + 平滑动画
- 改进：MCP/自动化弹窗移除左侧导航栏；单次执行改为选择未来时间

### v0.3.0
- 设置页自动规范器上线
- better-sidebar、dsh-widgets 视觉协调
- 顶部栏单行化
- 深浅主题自适应

### v0.2.0
- 对话宽度、字号、字体可
- 工作区字号缩
### v0.1.0
- 初始版本

---

## License

[MIT](LICENSE)
