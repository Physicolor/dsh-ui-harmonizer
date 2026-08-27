<p align="right"><a href="README.md">English</a> · <b>简体中文</b></p>

<h1 align="center">DSH UI Harmonizer</h1>

<p align="center">
  <strong>为 DeepSeek Harness 打造的界面规范化与协调层。</strong><br>
  规范化官方界面 · 协调每个插件 · 设置页自动规范器 · 界面定制（含圆角卡片）
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-ui-harmonizer?style=flat&label=latest%20release&color=4D6BFE" alt="Latest release">
  <img src="https://img.shields.io/npm/dt/dsh-ui-harmonizer?style=flat&label=total%20downloads&color=4D6BFE" alt="Total downloads">
  <a href="https://github.com/Physicolor/dsh-ui-harmonizer/stargazers"><img src="https://img.shields.io/github/stars/Physicolor/dsh-ui-harmonizer?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License">
  <img src="https://img.shields.io/badge/DSH%200.1.x-4493F8?style=flat-square" alt="Supported: DeepSeek Harness 0.1.x">
</p>

---

> **一句话：** 你装了一堆 DSH 插件，界面却风格割裂？DSH UI Harmonizer 用「**CSS 覆盖 + 运行时 DOM 协调**」把它们拉回官方设计语言——**不破坏任何插件源码、卸载即还原、零模型开销**。

DSH UI Harmonizer 是一个**纯浏览器端（client-only）**的 DSH bundle 插件。它不新增模型工具、不改写会话日志，只通过官方 `settings.section` / `settings.general.item` 槽位与 `--dsw-*` 语义令牌体系调整界面。

---

## 当前功能

### 🎨 官方 UI 规范化

| 能力 | 说明 |
| --- | --- |
| 顶部栏单行化 | 对话/轨迹选择器移入标题行，header 收成单行 |
| 按钮胶囊家族 | Session log、组件、toggle 按钮统一为 32px 胶囊 |
| 右侧栏贴边圆角矩形 | better-sidebar 面板覆盖式布局，header 不动 |
| 设置页头统一 | 标题 18/600 + 描述 13px + hairline 收尾 |
| 原生 title 悬浮提示统一 | 裸 `title` 属性改用官方深色气泡渲染，替代系统默认提示样式 |

### ♻️ 插件视觉协调

| 协调对象 | 做法 |
| --- | --- |
| `dsh-better-sidebar` | toggle 按钮胶囊化、面板背景统一、布局协调、平滑过渡动画 |
| `dsh-widgets` | 统计胶囊同族、header utilities 对齐 |
| `@omdsh-dev/dsh-genui` | `render_ui` 面板与工具卡片：宽度跟随「对话列最大宽度」（`--enhancer-content-width`，如 840px）而非冒泡到整列；修复折叠条 flex-nowrap 长标题撑宽根因并统一 11px/16px 内边距；`banner`/`steps` 等横贯块按 16px 左右间距规范（不向外扩盒）；svg/pre/canvas/img/mermaid 全部限宽护栏 |
| 第三方设置页 | 自动补标题、删多余图标、统一间距格式 |

### 🧹 设置页自动规范器 ⭐

任何第三方插件往 `settings.section` 加页面时，若没有严格按官方规范设计，插件会自动修正：

| 自动检查项 | 修正方式 |
| --- | --- |
| 缺页面标题 | 注入 18/600 标题（取导航项名或已知映射） |
| 标题旁多余图标 | 移除标题行 logo，保留纯文字 |
| 标题/描述贴太紧 | 统一 4px 间距 + hairline 收尾 |
| 字号/格式不统一 | 标题 18/600、描述 13/20 + `border-bottom` |

### 🎛️ 界面定制

设置 → 通用设置中的"界面定制"块：对话宽度、markdown 字号、工作区字号、UI 字体、圆角卡片均可实时调节。「圆角卡片」把对话区域显示为左上圆角的卡片并附投影，高度跟随侧栏宽度/详情列自动伸缩。

---

## 工作原理

- **零模型开销**：host（node）半是 no-op，全部改动发生在浏览器半；
- **官方设计令牌**：所有样式走 `--dsw-*` 语义令牌，自动跟随明暗主题；
- **两条注入通道**：静态规则（CSS Modules）+ 动态 `<style data-plugin>` 标签；
- **可逆清理**：fiber effect disposer 管理所有副作用，卸载即恢复；
- **Slot 接入**：`settings.general.item` / `settings.section` / `shell.overlay`（圆角卡片覆盖层）。

---

## 安装

```sh
# 通过 npm（插件市场）
dsh plugin --profile web add dsh-ui-harmonizer

# 本地开发（link 方式）
dsh plugin --profile web add link:D:/dsh-home/plugins/harness-ui-enhancer
```

安装后**硬刷新浏览器**（Ctrl+Shift+R），在 设置 → 通用设置 看到"界面定制"块。

---

## 开发

```sh
pnpm install
pnpm run build      # tsdown 构建 lib/
pnpm run check      # 类型检查 + 构建
```

- `peerDependencies`：`@deepseek-ai/dsh-client-ui-slots`、`dsh-client-runtime`（由 DSH web profile 提供）；
- 纯 client 插件：`cordis.patch.yml` 插入 `ui-enhancer` 行，浏览器半由 `dsh.client` 声明；
- **修改后需同步**：`npx tsdown` 重建 → 同步到 `profiles/web/node_modules/dsh-ui-harmonizer/lib/` → 硬刷新浏览器。

---

## 兼容性

- DeepSeek Harness `0.1.0-rc.6` 及兼容的后续 `0.1.x`；
- 通过官方 slot 接入，与 better-sidebar、dsh-widgets、dshmarket 等插件按 slot 顺序共处；
- 已知协调对象：`dsh-better-sidebar`、`dsh-widgets`、`dsh-notification`、`dshmarket`；
- 卸载/禁用后页面完全恢复默认，无残留。

---

## 路线图

- **阶段一 · 官方 UI 规范化**（进行中）：继续修复官方界面中未完善的部分；
- **阶段二 · 插件兼容协调器**（进行中）：检测并修复插件间的布局/样式冲突；
- **阶段三 · 统一视觉风格**（进行中）：可选的视觉风格层——已落地「圆角卡片」（包裹 header 模型）与 title 悬浮提示统一，待续：间距密度、更多圆角/动效统一；
  - *液态玻璃（探索）*：规范化的终点是降低认知成本——统一的标题与提示消除的是「风格切换」的微疲劳；材质层统一更进一步：用一致的物理隐喻暗示层级与可交互性，让整个页面形成单一心理模型，减少视觉与认知负担。边界：只在语义 token / CSS 层实验——设置开关可选、大面积 backdrop 表面至多两处（控制 GPU 开销）、尊重减弱透明度/动效偏好、不支持时回退到现行实底样式、绝不触碰插件源码，且以可读性不降为底线；
- **阶段四 · 生态共建**：沉淀为可扩展的规则注册机制。

---

## 变更日志

### v0.8.1 — 已发布（2026-08-27）

**修复（跨插件宽度卫生 — @omdsh-dev/dsh-genui 的 render_ui 面板与工具卡片）：**
- 根因：`.panelToggle` 标题 span（长 nowrap 文本，如「opencode-go 多 Key 迷你池 — 最终架构」）是 flex 子项却缺 `min-width:0`，flex 默认 `min-width:auto` 不允许收缩 → 标题 max-content 宽度把折叠条与面板一起撑出对话列。harmonizer 以 hash 无关属性选择器补 `flex:1 1 0%; min-width:0`（ellipsis 生效）；同类（`.toolFallbackMeta`、`.tlTime`）一并覆盖。纯 CSS 覆盖、零侵入 dsh-genui 源码。
- 最终基准（定稿）：面板宽度 = **对话内容宽度**（`--enhancer-content-width`，当前 840px，与官方 `Md3f7G_column` 一致），`[data-genui-panel]{ display:block; width:100% !important; max-width: var(--enhancer-content-width, 748px) !important; margin:10px auto 2px !important; contain:inline-size }`，随「对话列最大宽度」滑杆即时自适应；此前「实测输入框宽」方案废弃（基准偏差）。教训：`width:auto + margin:auto` 会在 flex 交叉轴触发 shrink-to-fit 竖线回归，必须显式 `width:100%` 再叠加 max-width。
- 横贯块左右间距：`banner` 与折叠条复用同一宽度格式（内容宽 + 16px 左右内缩，不向外扩盒）；`steps` 在无容器 padding 的内联/工具卡内补 16px；svg/pre/canvas/img/mermaid 全部限宽护栏；块组件（callout/card/list）不动。

### v0.8.0 — 已发布

**新功能（原生 title 悬浮提示统一）：**
- 仅依赖裸 HTML `title` 属性的元素（模型选择器 trigger 及其他直接用 title 的官方控件）此前弹出的都是系统默认样式的悬浮提示，与走官方 Tooltip 组件的所有表面不在一个视觉语言里。现在悬浮/键盘聚焦时接管：title 在交互期间被暂时摘除，同文案以官方气泡重绘——`--dsw-alias-tooltip-bg` 深色底、3px 7px 内边距、8px 圆角、13/20 字号、50vw 宽度上限；悬浮延迟 500ms、键盘聚焦立即显示；锚点下方 8px 放置（下方放不下自动翻转到上方）、距视口边缘 12px 钳制、处于 z-index 100 弹层带。
- 回退安全：任意祖先携带 `data-enhc-no-tooltip` 即整棵子树退出统一；摘除的 title 在离开/失焦/插件停止时原样恢复（应用若在悬浮期间重写了 title 则保留新值）；淡入动画尊重 prefers-reduced-motion。

**修复（toggle 按钮簇座位）：**
- better-sidebar 浮动按钮簇获得 `bg-base` 不透明座位。默认（面板关闭）：整高块，覆盖会话 header 整个横带（top 0 → 56px），按钮/座位/header 读作同一条右侧边缘，widgets 组件列卡片不再透出。better-sidebar 右侧面板打开时（client 半边同步的根类 `html.enhc-panel-open`）座位收回到紧凑浮动形态——面板顶边设计上低于页顶，整高座位会探进面板预留角。

**修复（圆角卡片包裹会话 header）：**
- AppFrame 的 shell.overlay 出口自身就是 z-20 层叠上下文，画在里面的卡片装饰永远盖不过 z-21 的会话 header。零像素分工绘制模型（无任何白色卡底）：header 自己用 INSET box-shadow 画卡片上沿线（真 border-top 会让 header 长高 1px、与流外控件错位）+ 左上 18px 圆角；悬浮层盒子退化为覆盖「header+内容」的纯投影投射器，改用强调左/上方向的定制阴影配方——官方 lv3 偏移向右下且其贴边接触晕会沿窗缘拉出一条多余暗线。无会话 header 的路由回退为经典自绘卡片。hover/激活填充照旧画在座位之上；座位顶部延续 header 上沿线，整卡宽度内边线读作一条不断线。

### v0.7.1（并入 v0.8.0）
**修复（better-sidebar Files 标签栏）：**
- 📏 标签现在撑满 44px 标签栏：此前固定 `height: 36px` 破坏了 better-sidebar 原生的 `align-items: stretch` 链条，在栏底留下约 8px 空白。改回 `height: auto` + 显式 `align-self: stretch`——14px 标签文字与图标仍在更高的栏内垂直居中。
- ↔️ 右面板打开时标签栏右端让位 72px → 90px：toggle cluster 变大后（两个 32px 胶囊 + 6px 间隙、`right: 12px` 起共 82px），旧让位会让最右侧标签 / + 按钮滑到胶囊下面。90px = 82px cluster + 8px 呼吸空间。底部面板的 40px 让位不受影响。
- 🧭 会话 header 的共享右外边距由 82px → 90px，与加大后的 cluster 对齐（覆盖折叠态角部座位与打开面板的 `max()` 两种路径）。

**修复（深色模式激活态文字）：**
- ⚪ 激活的「对话」标签在深色模式下改为蓝色填充 + 白色文字。此前用的是 `--dsw-alias-label-primary-inverted`，在深色主题下解析为近黑的 bluish-800——蓝底黑字。
- ⚪ 激活的「组件」胶囊保留插件自带的正确搭配（`state-business-primary` + `#fff`）：此前本插件的一条覆盖把白色换成了同一近黑 token（仅深色下出现）。该覆盖已删除，两个按钮在明暗两种主题下均呈现「品牌蓝填充 + 白字」，与官方导航 cell 的范式一致。

### v0.7.0
**元信息 — 包名改为 `dsh-ui-harmonizer`：**
- 📦 npm 包由 `harness-ui-enhancer` 更名为 `dsh-ui-harmonizer`（dsh 前缀 + harmonizer 命名贴合生态惯例与检索；旧包已 deprecate 并指路）。
- 🎯 定位：「为 DeepSeek Harness 打造界面规范化与协调层」——把 UI 规范化/调和进官方设计语言（不只是美化）。
- 🔀 GitHub 仓库由 `Physicolor/harness-ui-enhancer` 更名为 `Physicolor/dsh-ui-harmonizer`（旧链接自动跳转，star/issue 保留）。
- ♻️ 安装命令：`dsh plugin --profile web add dsh-ui-harmonizer`。无数据影响（纯 client 插件，无持久化键）。

### v0.6.2
**修复：**
- 🧱 会话顶部栏获得不透明卡片表面（`--dsw-alias-bg-base`），并提升到 shell overlay 层之上 1 级（`z-index: 21`，仍低于 better-sidebar 面板 40 与弹窗）：dsh-widgets 组件栏及其悬浮放大层将滑入顶部栏白色矩形之下，不再与顶部按钮视觉重叠。顶部栏规则统一归 enhancer（widgets 插件不再插手官方元素）。

### v0.6.1
**修复：**
- 🧩 侧栏打开时「对话/输入框与右侧面板之间的大段空隙」：修复对话区 `margin-right` 的二次挤压。此前对 `#root` 的中和只清掉了 `margin-right`，却保留了 better-sidebar 同规则里的 `width: calc(100% - var(--dsh-sidebar-width))` —— width 挤压把整列先缩到面板左缘，viewArea/composerSeat 的 margin 挤压再叠一遍，对话比面板多让出一个整面板宽。现补 `width: 100%` 完整中和 `#root`，内部 margin 成为唯一、正确的挤压（对话右缘贴合面板左缘，仅剩 scrollbar 8px 沟槽）。

### v0.6.0
**移除：**
- 🗑️ 移除 MCP 服务器管理 与 自动化任务调度：这两项本不属于"UI 强化"范畴，从插件中整体删除（host half 相关 API 路由随之删除，插件回归纯 client、零 host 逻辑）。左下角不再有 MCP / 自动化按钮。

**新功能：**
- 🃏 圆角卡片：对话区域显示为左上圆角的卡片并附投影（设置 → 通用设置 → 界面定制 → 圆角卡片）。不改任何源码：`shell.overlay` 挂透明覆盖层（顶边框 + 左上圆角 + `--dsw-shadow-lv3` 投影）；阴影向左溢出到侧栏（形成卡片厚度），顶部下移 1px 给投影留缝；右/下为窗口自然边界、不画边框；左侧不分界线：借用侧栏自身的 `border-right` 作卡片左边界；覆盖层用 `ResizeObserver` 跟踪中间列，侧栏拖拽/折叠/详情列开合自动跟随；内容左上角由中间列自身 `border-radius` 蒙成圆角，与覆盖层同半径；纯 CSS 门控（`html.enhc-center-card-on` 类），可随时关闭、卸载零残留。

**修复：**
- 🎚️ 界面定制开关实时反馈：圆角卡片开关改为本地镜像状态，按下瞬间 thumb 滑动 + 底色翻转，无需等待重渲染。

### v0.4.1
- 🎯 better-sidebar toggle 按钮 relocate 到 header utilities 区域（CSS 悬浮对齐）
- 📐 header 用 `max()` 共享宽度：sidebar 关闭时让80px给 toggle cluster，打开时跟随 sidebar 宽度
- 🎬 header `margin-right` 添加平滑过渡动画
- 📏 better-sidebar tab bar 高度调整为44px，内部元素按比例放大
- 🔧 更新 better-sidebar hash 前缀 `W-zNGW` → `nArs4W`
- 📐 panel 顶部定位改为 `top: 6px`

### v0.4.0
- 🔌 MCP 服务器管理面板
- ⏰ 自动化任务调度（周期/间隔/单次）
- 💬 提示词输入框复用聊天样式
- 🎨 弹窗高斯模糊 + 平滑动画
- 改进：MCP/自动化弹窗移除左侧导航栏；单次执行改为选择未来时间

### v0.3.0
- 设置页自动规范器上线
- better-sidebar、dsh-widgets 视觉协调
- 顶部栏单行化
- 深浅主题自适应

### v0.2.0
- 对话宽度、字号、字体可调
- 工作区字号缩放

### v0.1.0
- 初始版本

---

## License

[MIT](LICENSE)
