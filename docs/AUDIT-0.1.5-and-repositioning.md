# dsh-ui-harmonizer 审计与定位重估（2026-09-16）

审计基准：插件工作树 v0.8.4（未发布）· 官方运行版本 0.1.5-rc.2（npm `next`）· 已装 `dsh-better-sidebar@0.19.1` / `dsh-widgets@1.5.0`。

> 方法：对插件源码、官方 0.1.5-rc.2 客户端包、官方 0.1.1-rc.2 对比件、已装第三方包做静态读盘比对；所有版本差异都有包文件/行号证据（见文末）。对抗性审查包已生成（`RESEARCH_REGISTRY/review/20260916_003.json`），独立审查结论将并入 §8；标注为"待目视复核"的项需要浏览器实测。
>
> **后续（0.9.0 已交付）**：本文件是审计与决策记录。落地后的实测数据、修复前后对照与口径限制见 [`MEASUREMENTS.md`](./MEASUREMENTS.md)——四个定位（Harmony Contract / Harmony Doctor / 材质兼容层 / 减法）与字体修复均已实施并附渲染级证据。

---

## 0. 结论摘要

1. **插件今天仍然有效的能力只剩四格**：对话宽度设置行、UI 字体栈选择、设置页表头规范与自动执法、圆角卡片（材质）。其余大量规则是"替别人摆位"的像素搬运。
2. **官方在 0.1.1 → 0.1.5 之间补齐了两项我们曾认为"官方没有"的能力**：内容字号设置行（`FontSizeRow`）与一等右栏服务（`ctx.sidebarRight` + `sidebarRightTabs`）。前者与我们的字号行**同层叠源、互相压制**，后者让 better-sidebar 收编进官方座位，使我们的 `nArs4W_*` 硬编码规则成批失效。
3. **定位建议**：把护城河从"951 行 CSS 覆盖"搬到"跨插件 UI 契约 + 冲突/死代码审计器 + 材质兼容层"。玻璃不做渲染（已被 3 个插件占据），做"让玻璃主题和其他插件不打起来"的那一层。
4. **一个必须先修的反向 bug**：`index.ts:61` 用 0.19.1 已不存在的 `nArs4W_panelHidden` 判面板开合 → `panelOpen` 恒真 → 只要面板与 toggle 在 DOM 里，`html.enhc-panel-open` 就常驻，"紧凑浮动座位"成了默认形态。这比死代码更糟：功能不是失效，而是**反着生效**。

---

## 1. 现状盘点：这个插件今天到底做了什么

四层结构，全部 client-only，零模型开销，卸载可逆。

### 1.1 设置行（`settings.general.item`，order 30）

| 行 | 范围 | 实现要点 | 证据 |
| --- | --- | --- | --- |
| 对话列最大宽度 | 640–1000px，step 4 | 走**产品自己的通道**：写 `localStorage['dsh.conversation.contentWidth']` + `--dsh-chat-user-width`，并与拖拽手柄双向同步（改字号前先 adopt） | `src/client/state.ts:63-161` |
| 内容字号 | 12–20px，step 1 | 动态 `<style>` 标签在 `body` 上重写 **12 个** `--dsw-font-markdown-*` 令牌（官方共声明 102 个，但全树被 `var()` 真正消费的也只有 12 个） | `state.ts:227-250` |
| 侧栏字号 | 12–20px，step 1 | `--enhancer-sidebar-scale` 乘数，作用于侧栏 chrome 的 20+ 条规则 | `state.ts:270`、`enhancer.module.css:132-223` |
| 对话正文字体族 | 6 预设（含默认） | 只把字体栈写进上述 markdown 简写的 family 位置；**从不写 `--dsw-font-family`**（全树仅 `:root` 一处定义、固定值）→ 只影响对话正文，**不是 UI 字体栈** | `state.ts:19-26,229` |
| 圆角卡片 | 开/关 | 根类 `enhc-center-card-on` 门控；`shell.overlay` 组件用 ResizeObserver 跟踪中栏几何 | `components.tsx:273-322`、`card-overlay.tsx` |

### 1.2 静态规范化 CSS（`enhancer.module.css`，951 行）

- **会话顶部栏单行化**：tab 条搬进标题行（DOM 搬移）+ 取消 `margin-top:10px` + 去掉双行高度与 1px 分隔伪元素。
- **输入区随字号**：`[data-input-scroll]`、用户气泡、composer tool row、下拉菜单（`[role=menu] _list_/_item_/_label_` 用 `class^=` 前缀匹配）。
- **侧栏 chrome 缩放**：newSession / brand / logoRow iconButton / workspaces / badge / settings trigger。
- **设置页表头统一**：`h2[class$='_title']`/`_heading` → 18/600，`p[class$='_intro']` → 13/20 + hairline；第三方特例（dsh-notification 的 `dsh_notification_*`、dshmarket 的 `_head > _sub`）；`_titleRow > svg { display:none }`。
- **原生 `<select>` 胶囊化**（插件版本选择器）。
- **better-sidebar 协调**：`nArs4W_*` 面板/选项卡/toggle 胶囊化、`#root` 中和、`viewArea`/`composerSeat` 挤压、tab bar 44px、右端 90px 让位。
- **挤压动画性能**：`*_flowItem { content-visibility: auto; contain-intrinsic-size: auto 120px }`（实测掉帧 20–31% → 0%）。
- **dsh-genui 宽度卫生**：30+ 条护栏（面板宽度 = 对话内容宽、`contain: inline-size`、长标题收缩基线、横贯块 16px 内缩）。

### 1.3 运行时 DOM 协调（`src/client/index.ts`，5 个 effect）

1. better-sidebar toggle 的 `aria-pressed` 与面板开关同步 + 根类 `enhc-panel-open`（MutationObserver）。
2. 会话 tab 搬进 titleCluster。
3. 底部面板 toggle 移到 titleCluster 末尾。
4. 第三方设置页**缺 h2 时注入标题**（取 active nav 的 `aria-current` 文案，含 12s 轮询兜底）。
5. 原生 `title` 属性接管为官方气泡（`title-tooltip.ts`，292 行，含 `[data-enhc-no-tooltip]` 逃生口）。

### 1.4 规范产出（真正的无形资产）

`docs/settings-section-style.md`（74 行）：官方设置页表头锚点、完整配方、6 条自检清单、自动规范化边界、已知不合规页清单。同内容已作为 Skill `dsh-settings-section-style` 发布。

---

## 2. 对照四条初衷：今天的存活状态

| 初衷 | 今天的实际情况 | 判定 |
| --- | --- | --- |
| ①「规范化官方没规范的地方（设置页标题/子标题、顶部栏）」 | 顶部栏：官方 0.1.5 自带上/下划线 tab 样式，我们已回退胶囊覆盖（v0.8.4），只剩"tab 搬进标题行"这一个侵入式 DOM 搬移。设置页表头：官方**没有类型/组件级强制契约**（`settings.section` 的 owner props 只有 `close`，选项只有 `id/order/label`，全树无共享表头组件），但设计语言层面 18/600 + 13px 是既有基准（本仓库 `dsh-plugin-compat-guide` §2.5 有记载）——所以准确说法是"官方无强制、我们是唯一执法器" | ② 半存活（表头留、顶部栏让位） |
| ②「插件间兼容（右栏摆位、统一位置大小）」 | 官方 0.1.5 新设 `ctx.sidebarRight` + `ctx.sidebarRightTabs`（该包**首次发布于 0.1.5-alpha.1**），better-sidebar 0.19.1 已把控件注册进官方 header 座位、**不再发布** `--dsh-sidebar-width`（改为发布 `--dsh-title-bar-strip` / `--dsh-sidebar-height`）；官方 grid 列自己让位。我们仍在用别人的 CSS Module 哈希类做摆位 | ⚠️ 方向已错，须重定位 |
| ③「字体可自定义大小」 | 官方 0.1.5 自带 `FontSizeRow`（12–17px，命名空间 `ui-theme`/字段 `fontSize`），并通过 `body` 上的 `--dsh-content-font-size` / `--dsh-content-font-delta` 驱动全部 102 个 `--dsw-font-markdown-*` 令牌；0.1.1 时代该字段**不存在**（当时 theme-settings 只有 `preference`）。需要澄清：我们的"UI 字体栈"其实只改**对话正文**的字体族，从不写 `--dsw-font-family` | ⚠️ 已撞车，须改走官方通道 |
| ④「液态玻璃（探索）」 | 已被至少 3 个 DSH 插件占据（见 §5） | ⚠️ 不应重复投入 |

---

## 3. 官方在版本更新中补了什么（有版本证据）

| 能力 | 0.1.1-rc.2（2026-08-21） | 0.1.5-rc.2（2026-09-10） |
| --- | --- | --- |
| 内容字号设置行 | **无**（`lib/types/client/` 无 `FontSizeRow.d.ts`；`theme-settings.d.ts` 只有 `preference`；`client.js` 搜 `dsh-content-font-size` 命中 0） | **有**（`FontSizeRow.d.ts` + `fontSize: Schema.number().step(1).min(12).max(17).default(14)`） |
| 字号驱动通道 | 固定值 `--dsw-font-markdown-base:16px/28px` | `var(--dsh-content-font-size,14px) / calc(24px + var(--dsh-content-font-delta))`，余量、二级字号（表格/表头）全部派生 |
| 右栏服务 | 包不存在（`@deepseek-ai/dsh-client-ui-sidebar-right` 版本列表从 `0.1.5-alpha.1` 起） | `ctx.sidebarRight` + `ctx.sidebarRightTabs`，tab 类型两阶段注册（类型 + 主体座位） |
| 设置页契约 | 分散在渲染它的 shell 里 | 独立成域：`settings.section` 的 owner 只给 `close`，明确"表头/文案由注册者自持" |
| 玻璃材质令牌 | — | 仍只有 `--dsw-mask-blur: blur(2px)`（`body` 规则内）与 `--dsw-shadow-lv1-blur`；frost/acrylic/translucent/material/glass 相关 token 全树 0 命中。`backdrop-filter` 在 `index-DPX2bQLO.css` 共 3 处：`_mask_w1urq_14`（用 `--dsw-mask-blur`）、`_onboardingMask_1cfrq_10`（blur 2px）、`_dockScrim_17p4l_498`（blur 6px） |
| 发布节奏 | — | `0.1.1-rc.2`(08-21) → `0.1.5-rc.2`(09-10) → `0.1.6-alpha.1`(09-15，npm `alpha` tag)，`latest` 仍停在 `0.1.5-rc.1`。生态资讯站 `dsharness.org/changelog` 停在 0.1.2-alpha.4，**落后于实际** |

**0.1.6-alpha.1（2026-09-15，更新的一版）复查**：`dsh-client-ui-theme` / `-settings-general` / `-sidebar-right` 三个包的 `lib/types` 文件清单与 0.1.5-rc.2 **逐项相同**，字号行仍是 12–17，`--dsw-font-markdown-*` 声明数仍是 102。也就是说**这三块 UI 能力在 0.1.6-alpha.1 没有继续补齐**，我们面对的机会窗口还在，但节奏是"两周一个大版本"。

结论：官方在 UI 侧的补齐是**按"把能力收进服务与设置契约"的路线走的**——字号进了用户设置文档，右栏进了服务注册表，设置页进了槽位契约。任何"用哈希类直接改别人像素"的做法，都会随这条路线逐条失效。

---

## 4. 三个具体问题（可直接修）

### P-1 字号双击：我们的字号行让官方 `FontSizeRow` 半失效

三条独立事实合起来构成一个"看起来两边都生效、其实各管一半"的状态：

1. **官方令牌定义在 `body{}` 上**：`dsh-client-ui-theme/lib/client.js` 里全部 **102 个** `--dsw-font-markdown-*` 都在同一个 `body{…}` 规则内（其它选择器 0 个），该规则首项即 `--dsh-content-font-delta:calc(var(--dsh-content-font-size,14px) - 14px)`。
2. **官方把值写在 `body` 的行内样式上**：`dsh-client-ui-theme/lib/index.js` 的 boot 脚本 + 运行期 `dsh-client-ui-layout/lib/client.js:445,472`（`CONTENT_FONT_SIZE_VARIABLE = "--dsh-content-font-size"`，ThemePresenter 写 `body.style`）。
3. **我们在同一个选择器上重写了 12 个短令牌**（不是 13 个）：`src/client/state.ts:236-247` 的动态 `<style>` 标签里是 `body { --dsw-font-markdown-base: … }`。

层叠结果：`--dsw-font-markdown-base` 由**官方 style 标签 vs 我方 style 标签**竞争，选择器与特异性完全相同，胜负只取决于 `document.head.appendChild` 的先后。官方 theme 在 `package.json` 的 `dsh.client` 里声明 `"immediately": true`（boot 期立即加载），我方是 profile bundle 插件、在其后加载 → **我方标签在后，倾向上是我们赢**：官方的"内容字号"滑杆对正文大概率不起作用，但对未被我们覆盖的令牌仍然起作用。（这一条属运行时序推论，需在浏览器里改一次官方字号行目视确认；判定方法：把官方字号从 14 改到 17，看正文是否变化。）

**覆盖面的真实缺口（对抗性审查修正）**：官方声明 102 个，但 0.1.5 全树被 `var()` 真正**消费**的也只有 12 个——所以我们实写的 12 个几乎命中全集，真正的缺口只有 3 个：

| 漏掉的令牌 | 消费点 | 后果 |
| --- | --- | --- |
| `--dsw-font-markdown-table-head` | `index-DPX2bQLO.css` 的 markdown `th` | 调字号后表格表头不跟 |
| `--dsw-font-markdown-code-block-small` | ui-chat `turnErrorCode`、ui-cordis `output`、ui-skill `instructions`、ui-tool `ioCard` | 工具/技能/Cordis 面板里的代码块不跟 |
| `--dsw-font-markdown-code-font-family` | `_slashChip` | slash 命令 chip 的等宽字体族不跟我们的预设 |

反过来，我们多写的 `base-italic` / `base-strong-italic` / `small` 以及官方那批 `-font-size` 长令牌族、`-small-strong`、`-small-italic` 在 0.1.5 全树 **0 次** `var()` 消费——写它们或漏它们都不产生可视差异。也就是说"混排字号"的说法要收窄成**上表这三处**，而不是"表头/小字/代码块大面积不一致"。

另一个被忽略的事实：`--dsh-content-font-size` 不只是正文字号，它被 **11 个官方包**消费（chat / conversation / goal / layout / sidebar-right / sidebar-files / sidebar-documentpreview / tool / workflow-run / theme），是产品的**全局内容缩放通道**；我们那 12 个令牌只覆盖聊天散文。

**修法（推荐）**：删掉本插件的内容字号行，把 12–17px 让给官方 `FontSizeRow` 独家拥有（官方没有的侧栏字号与对话正文字体族继续留在我们这里）。若确实需要 17–20px，正确做法是向上游提 issue 放宽 `FONT_SIZE_MAX`，而不是在同一个 body 上抢同一组令牌。

### P-2 死代码，以及一个比死代码更糟的反向 bug

在已装 `dsh-better-sidebar@0.19.1` 的 `lib/client.js`（CSS Module 映射表 192 键）中：

| 选择器/变量 | 0.19.1 状态 | 我们依赖它的规则 |
| --- | --- | --- |
| `nArs4W_toggleCluster` | **不存在** | `enhancer.module.css:510`（整高座位）、`:533`（紧凑形态）、`:897`（卡片上沿线接续）——全部无匹配对象 |
| `nArs4W_panelResize` | **不存在** | `enhancer.module.css:560` 无匹配对象 |
| `nArs4W_panelHidden` | **不存在** | `enhancer.module.css:669` 的 `:not()` 守卫失效；**`index.ts:61` 用它判 `panelOpen` → 恒 true**（见下） |
| `--dsh-sidebar-width` | **无生产者**（0.19.1 只发布 `--dsh-title-bar-strip` / `--dsh-sidebar-height`） | header `margin-right`、`viewArea`/`composerSeat` 挤压恒取回退 `0px`。注意：该变量**仍被 `dsh-widgets@1.5.0` 与 `dsh-lifeline` 当共享契约读取**，所以是"没有生产者"而不是"死变量" |
| `nArs4W_toggleButton`(×10) / `panel` / `panelBody` / `bottomPanel` / `bottomPanelHidden` / `tabBar` / `tab` / `pane` / `explorer*` 等 189 键 | 仍存在 | 这些规则今天仍生效（也因此掩盖了上面的失效） |

**反向 bug（本次审查新增，严重度高于死代码）**：`src/client/index.ts:61` 用 `panel.classList.contains('nArs4W_panelHidden')` 判断面板是否打开。0.19.1 里这个类不存在，于是 `panelOpen` 恒为 `true`；只要 `.nArs4W_panel`、`.nArs4W_bottomPanel` 与 ≥2 个 toggle 同时存在于 DOM，`html.enhc-panel-open` 就会被**永久挂上**——也就是"紧凑浮动座位"形态常驻、"整高座位"永不出现，而 v0.8.0 的座位设计意图完全反了。0.19.1 自己发布的真信号是 `body[data-dsh-sidebar-collapsed]` 与 `[data-dsh-panel-host]`。

同类但被报告漏掉的耦合：`index.ts:115` 读 better-sidebar 的 `[data-dsh-bottom-toggle]`（无文档的跨插件 data 属性），同踩 compat guide §1.8。

含义：`html.enhc-panel-open` 双形态座位机制今天**不是"空转"，而是"反向常驻"**，而它是 v0.8.0 的主要工作量之一。这类失效没有任何信号——插件不会报错，只会静默变旧或静默变错。

### P-3 玻璃冲突：我们的"实体表面"是玻璃主题的天敌

`enhancer.module.css:606-616` 把会话 header 强制成 `background: var(--dsw-alias-bg-base)` + `z-index:21`，理由是"让 widgets rail 的放大卡片滑到 header 下面"。

已发布的玻璃主题正是从这一层下手的：`dsh-theme-liquid-glass`（FAVKTOXIC）README 明确写着用 `ctx.theme.overrideTokens` 把 `--dsw-alias-*` 语义 token 替换成半透明玻璃值。于是：

- header 读到的 `--dsw-alias-bg-base` 变成半透明 → 内容从底下透出且**没有 backdrop-filter**（一个没有磨砂的洞），同时 rail 的遮挡语义失效；
- 圆角卡片的深色投影落在玻璃上没有物理意义；
- 双方都用语义 token，谁都没"写错"，但两条设计假设互斥。

这不是"要不要做玻璃"的问题，而是"我们的规则能否与玻璃共存"的问题——**今天是共存不了的**。

两条来自该主题的工程约束值得记进我们自己的设计笔记：

1. 玻璃插件**不能**把 `backdrop-filter` 打在 `#root` 上：非 none 的 backdrop-filter 会让 `#root` 成为所有 `position:fixed` 后代的包含块，菜单/弹层/toast 会被重新锚定（该 README 的实现要点一节）。我们做材质层时必须遵守同一条。
2. 第三方设置命名空间**到不了客户端 settings scope**（settings 网关只暴露产品硬编码命名空间），所以第三方偏好只能落 localStorage——我们的 5 行设置本来就走 localStorage，这一点无需改。

---

## 5. 液态玻璃调研（外部情报）

已经有产品在做，且不止一个：

| 插件 | 作者 | 做法 |
| --- | --- | --- |
| [deepseek-harness-liquid-glass-theme](https://dsharness.org/plugin/Rainpomelo/deepseek-harness-liquid-glass-theme) | Rainpomelo | npm `@deepseek-ai/dsh-client-ui-liquid-glass@2.0.0`（2026-08-18 建，5 star）：**WebGL 物理透镜** + 动态壁纸 + 多层毛玻璃 |
| [dsh-theme-liquid-glass](https://dshplugin.io/plugin/dsh-theme-liquid-glass) | FAVKTOXIC | v0.4.2，要求 DSH ≥ 0.1.2-rc.1：`ctx.theme.overrideTokens` 换 `--dsw-alias-*` 令牌 + **SVG `feDisplacementMap` 边缘折射** + 动态壁纸（URL/本地 HTML/图片/视频），参数挂 `body` 上的 `--dsh-lg-*`，总开关 `body.dsh-lg-on` 关闭即零残留 |
| [DSH-Transparent-UI-Plugin](https://dsharness.org/plugin/WYH66666666/DSH-Transparent-UI-Plugin) | WYH66666666 | 顶栏/侧栏/输入框/统计行/轨迹视图磨砂玻璃，模糊度与壁纸可调，**关掉开关回原生、不改 DSH 源码**（397 star） |

技术上限（决定"值不值得自研"）：

- CSS `backdrop-filter` 有 10 个函数但**没有任何一个能位移像素**，所以做不出真折射（[theplusaddons](https://theplusaddons.com/blog/liquid-glass-ui/)、[guardrails 讨论](https://www.buildmvpfast.com/blog/liquid-glass-css-backdrop-filter-recipes-2026)）。
- 要"液态"必须 WebGL/SVG turbulence 位移，代价是 GPU 与可访问性（[LiquidGlassUI](https://hungduong-projects.github.io/LiquidGlassUI/)）。

判断：**渲染侧已无差异化空间**（三个插件、两种技术路线都占了）。真正的空白是"玻璃主题与实体层插件的互相破坏"，见 §6 P3。

---

## 6. 定位建议：从"像素补丁"转向"契约 + 审计 + 材料兼容"

### P1 · Harmony Contract（发布契约，不再读别人哈希类）

- 在 `<html>` 上发布一组协商变量（现有的 `--enhancer-content-width` 是其雏形）：
  `--enhc-surface-solid: 1|0`、`--enhc-glass-aware: 1|0`、`--enhc-rail-top` 等；
- 提供 `ctx.get('uiHarmony')` 服务：`registerSurface({ id, role, occupies, transition, tokens })`，让**别的插件向我申报**自己占了哪块表面、用哪个 token、动画多长；
- harmonizer 的职责从"搬像素"改为"仲裁 + 告警"（占用冲突、过渡不同步、z-index 抢层）。这样官方每升级一次，失效的是别人的申报，而不是我们的硬编码选择器。

### P2 · Harmony Doctor（把"失效"变成产品功能）

设置页一个按钮，本地跑（零模型、零网络）：

1. **死代码检测**：把 951 行规则逐条 `querySelectorAll` 计数，列出命中 0 的规则——今天就会打印出 `_toggleCluster`、`--dsh-sidebar-width` 那批（P-2）。
2. **覆盖冲突检测**：对同一元素的同一属性，列出"计算值 vs 各来源声明值"，指出被谁压过（例如 P-1 的字号双击）。
3. **表面清单**：右栏/底部/悬浮层当前 owner 是谁、占了多少、是否发布了共享变量。
4. 输出可导出的 Markdown 报告 → 直接回填 README 兼容性表，或给上游插件开 issue。

这个功能**官方没有、市场上也没有**，且它是唯一一种"官方越快、我们越有用"的形态。

### P3 · 材质兼容层（不做玻璃，做玻璃的地面）

- 把"实体填充"收进一个变量：`--enhc-solid-fill: var(--dsw-alias-bg-base)`，header/面板/座位全部改走它；
- 检测到透明或玻璃主题时切到 `transparent` + `backdrop-filter: var(--dsw-mask-blur)`，并发布 `--enhc-glass-aware: 1` 给玻璃插件读取；
- 圆角卡片升成三档材质：**实底 / 半透明 / 玻璃**（玻璃档只用官方 `--dsw-mask-blur`，不引 WebGL），尊重 `prefers-reduced-transparency` 与 `prefers-reduced-motion`；
- 明确不做：WebGL 折射、动态壁纸。

### P4 · 减法清单（按官方覆盖情况逐条定生死）

| 处理 | 对象 | 理由 |
| --- | --- | --- |
| **删** | tab 搬进标题行（effect 2）、bottom toggle 重排（effect 3） | 官方 tab 有自己的位置与样式演进，搬移收益低、破一次官方布局就要重写 |
| **删** | `nArs4W_*` 全部规则 + toggle `aria-pressed` 同步（effect 1）+ `enhc-panel-open` | 目标类已消失（P-2）；且违反"每表面单一 owner / 不读他人哈希类" |
| **删** | `#root` 中和 + `viewArea`/`composerSeat` 挤压 | 官方 grid 列已自己让位；保留只会与新玻璃/新右栏互相踩 |
| **改** | 字号行 | 让给官方 `FontSizeRow`（12–17），删掉我们的内容字号行（P-1）；只保留侧栏字号 |
| **留** | 对话宽度行 | 官方无设置行（只有拖拽手柄 + `dsh.conversation.contentWidth`） |
| **留（措辞更正）** | 对话正文字体族选择 | 官方 `--dsw-font-family` 是 `:root` 上的固定值、无用户设置字段；但我们的预设**只改对话正文的字体族，不改 UI 字体栈**，README 里不要写成"UI 字体" |
| **留并加码** | 设置页表头规范 + 自动执法 | 官方 `settings.section` 无类型/组件级强制契约（owner 只给 `close`），设计语言基准存在但无人执法；可考虑向上游提 PR 把 18/600 + 13px 写进官方文档 |
| **留并材料化** | 圆角卡片 | 官方无卡片表面；配合 P3 变成材质层 |

### 0.9.0 必修清单（对抗性审查给出的严重度序）

1. `index.ts:61` 的 `nArs4W_panelHidden` 判据不存在 → `enhc-panel-open` 恒真；改用 `body[data-dsh-sidebar-collapsed]` 或 better-sidebar 服务（**这是 bug，不是死代码**）。
2. 硬编码他人 CSS Module 哈希类（`enhancer.module.css:496-720`、`index.ts:52-54`）在 0.19.1 已部分失效，上游再重建即全灭；改共享变量/服务，最次降到 `data-dsh-*` 契约。
3. 字号覆盖漏 `table-head` / `code-block-small` / `code-font-family` 三处真消费点（或不修，直接按 P-1 让给官方）。
4. `body` 级令牌靠注入顺序取胜、无契约保障（`state.ts:235-248` vs 官方 `body` 规则）。
5. 无生产者的 `--dsh-sidebar-width` 规则（`enhancer.module.css:593/750/783`）应删或改注（该变量仍有第三方消费者）。
6. 死选择器清理：`[class$='_toggleCluster']`（`:510/:533/:897`）、`.nArs4W_panelResize`（`:560`）。

### 建议版本切分

- **0.9.0**：P-1 字号改道（修掉与官方的双击）+ P-2 死代码清理 + README 兼容性表回填实测结论。
- **0.10.0**：Harmony Doctor（只读检测 + 报告导出），零风险、可独立发布。
- **0.11.0**：Harmony Contract 服务 + P3 材质三档（含玻璃主题共存验证）。

---

## 8. 对抗性审查纪要

审查包：`RESEARCH_REGISTRY/review/20260916_003.json`。独立审查员只读复算了 §3/§4 的全部可证伪断言（未改动任何文件），逐条判定 A–H，其中 **5 ✅ / 3 ⚠️（部分支持）**，并额外发现一个报告漏掉的**反向 bug**。以下为并入结果。

### 逐条判定

| 断言 | 判定 | 关键证据 / 修正 |
| --- | --- | --- |
| A 官方自带字号行并经 `--dsh-content-font-size` 驱动 markdown 令牌 | ✅ 支持 | `theme-settings.d.ts:6/10/16-18`（MIN 12/MAX 17/DEFAULT 14）；写入点比报告更完整：theme 的 `lib/index.js` boot 脚本 + ui-layout 运行期 `ThemePresenter`；**102 个令牌全部在同一个 `body{}` 规则内** |
| B 我们的覆盖与官方同层竞争、且覆盖不全 | ⚠️ 部分支持 | 数量更正：官方 102、**我们写 12**（非 13）；全树被 `var()` 消费的也只有 12 个，真缺口仅 `table-head`/`code-block-small`/`code-font-family` 三个；报告点名的 `-font-size` 系列、`-small-strong` 等 **0 次消费**，"大面积混排"的说法不成立 |
| C better-sidebar 0.19.1 让一批规则失效 | ✅ 支持 + 新 bug | 192 键映射表无 `toggleCluster`/`panelHidden`/`panelResize`；`--dsh-sidebar-width` 0 生产者但**仍被 dsh-widgets/lifeline 消费**；新增：`index.ts:61` 判据类不存在 → `panelOpen` 恒 true |
| D 官方无对话宽度设置行 | ✅ 支持 | `contentWidth`/`dsh-chat-user-width` 各 1 处，均在 ui-conversation；`settings.general.item` 注册者仅 5 家，无宽度行 |
| E 官方无 UI 字体栈设置 | ✅ 支持 | 全树 2057 个文件：`--dsw-font-family` 仅 1 处定义（theme，选择器 `:root`，固定值）；`fontStack` 0 命中；ThemeSettings schema 只有 `preference`+`fontSize` |
| F 官方无设置页表头契约 | ✅ 支持（措辞收紧） | 类型层成立（`slots.d.ts:67-71`、owner 只有 `close`）；但"官方无表头规范"过头——设计语言层有 18/600 + 13px 基准（本仓库 compat guide §2.5） |
| G 官方玻璃能力仅 `--dsw-mask-blur` | ⚠️ 部分支持 | 令牌面成立（frost/acrylic/translucent/material/glass 全 0）；但 `backdrop-filter` 不止 dialog/onboarding，还有 `_dockScrim_17p4l_498` 的 `blur(6px)` |
| H 通过他人哈希类做协调，违反三条官方规范 | ✅ 支持 | 另补一处报告未列：`index.ts:115` 读 `[data-dsh-bottom-toggle]`（无文档的跨插件 data 属性） |

### 据审查更正的本报告表述

1. "13 个令牌" → **12 个**。
2. "未覆盖 `-font-size` 系列 / `-small-strong` → 部分生效、部分保持官方值" → 这些令牌**无消费者**，真正的可视缺口只有 3 个（见 P-1 表）。
3. "`--dsh-sidebar-width` 关联规则全部是死代码" → 应表述为"**0.19.1 无生产者、恒取回退 0px**"（dsh-widgets/lifeline 仍消费该变量）。
4. "backdrop-filter 仅限 dialog/onboarding 遮罩" → 还有 `_dockScrim` 的 `blur(6px)`。
5. "官方无设置页表头规范" → 收紧为"**无类型/组件级强制契约**"（设计语言基准存在）。
6. "UI 字体栈" → 我们用词有误：插件从不写 `--dsw-font-family`，字体预设**只作用于对话正文**。

### 待目视复核清单（静态读盘无法定案）

| 项 | 判定方法 |
| --- | --- |
| P-1 层叠谁赢 | 在设置里把**官方**内容字号 14 → 17，看正文是否变化；再恢复。正文不动 = 我方 style 标签在后（推论成立） |
| P-1 剩余缺口 | 同一段回复里同时出现正文、表格表头、工具/技能面板里的代码块、slash chip，看这四处字号是否同步 |
| **P-2 反向 bug 是否真的常驻** | 面板收起状态下在控制台跑 `document.documentElement.classList.contains('enhc-panel-open')` 与 `document.querySelectorAll('.nArs4W_panel,.nArs4W_bottomPanel').length`。类为 true 且节点数 ≥1 → 确认常驻 |
| P-2 死选择器实测 | `document.querySelectorAll('[class$="_toggleCluster"]').length` 应为 0；`getComputedStyle(document.documentElement).getPropertyValue('--dsh-sidebar-width')` 为空或 `0px` |
| P-2 版本前提 | 若当前实例跑的是 better-sidebar ≤0.19.0，`_toggleCluster` 规则仍有效——结论以 0.19.1 为准 |
| 宽度行即时重绘 | 拖动宽度行滑杆松手，看对话列是否立刻变宽（`state.ts:141-142` 同时写 localStorage 与内联 `--dsh-chat-user-width`） |
| P-3 玻璃共存 | 装上任一玻璃主题后看会话 header：是否出现"无磨砂的空洞"、widgets 放大卡片是否穿透 header |

---

## 附：本次审计的证据路径

- 插件源码：`D:/dsh-home/plugins/dsh-ui-harmonizer/src/client/{index.ts,state.ts,components.tsx,card-overlay.tsx,title-tooltip.ts,enhancer.module.css}`
- 官方 0.1.5-rc.2：`C:/Users/12404/AppData/Local/npm-cache/_npx/c40503fdf38a82ea/node_modules/@deepseek-ai/{dsh-client-ui-theme,dsh-client-ui-settings,dsh-client-ui-sidebar-right}`
- 官方 0.1.1-rc.2 对比件：`D:/dsh-home/probe-ui/harmonizer-audit/deepseek-ai-dsh-client-ui-theme-0.1.1-rc.2.tgz`
- 已装第三方：`D:/dsh-home/profiles/web/node_modules/{dsh-better-sidebar/lib/client.js,dsh-widgets/package.json}`
- 版本时间线：`npm view @deepseek-ai/dsh-client-ui-sidebar-right versions`、`npm view @deepseek-ai/dsh-client-ui-theme time`、`npm view @deepseek-ai/dsh dist-tags`
- 对抗性审查包：`RESEARCH_REGISTRY/review/20260916_003.json`
