<h1 align="center">Harness UI Enhancer</h1>

<p align="center">
  <strong>为 DeepSeek Harness 打造的界面美化与插件协调层。</strong><br>
  规范化官方界面 · 协调每个插件 · 设置页自动规范器 · 界面定制（含圆角卡片）<br>
  A polish layer for DeepSeek Harness — normalizes official UI, reconciles plugin styles, and auto-fixes settings pages.
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/harness-ui-enhancer?style=flat&label=latest%20release&color=4D6BFE" alt="Latest release">
  <img src="https://img.shields.io/npm/dt/harness-ui-enhancer?style=flat&label=total%20downloads&color=4D6BFE" alt="Total downloads">
  <a href="https://github.com/Physicolor/harness-ui-enhancer/stargazers"><img src="https://img.shields.io/github/stars/Physicolor/harness-ui-enhancer?style=flat&label=%E2%98%85&color=08C" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License">
  <img src="https://img.shields.io/badge/DSH%200.1.x-4493F8?style=flat-square" alt="Supported: DeepSeek Harness 0.1.x">
</p>

---

> **一句话：** 你装了一堆 DSH 插件，界面却风格割裂？Harness UI Enhancer 用「**CSS 覆盖 + 运行时 DOM 协调**」把它们拉回官方设计语言——**不破坏任何插件源码、卸载即还原、零模型开销**。
>
> **TL;DR:** You installed a bunch of DSH plugins but the UI looks inconsistent? Harness UI Enhancer uses **CSS overrides + runtime DOM coordination** to bring them back to the official design language — **non-destructive, fully reversible, zero model cost**.

Harness UI Enhancer 是一个**纯浏览器端（client-only）** 的 DSH bundle 插件。它不新增模型工具、不改写会话日志，只通过官方 `settings.section` / `settings.general.item` 槽位与 `--dsw-*` 语义令牌体系调整界面。

Harness UI Enhancer is a **client-only DSH bundle plugin**. It adds no model tools and modifies no session logs — it adjusts the UI purely through official slots (`settings.section` / `settings.general.item`) and the `--dsw-*` semantic token system.

---

## 当前功能 · Features

### 🎨 官方 UI 规范化 · Official UI Normalization

| 能力 | 说明 |
| --- | --- |
| 顶部栏单行化 | 对话/轨迹选择器移入标题行，header 收成单行 |
| 按钮胶囊家族 | Session log、组件、toggle 按钮统一为 32px 胶囊 |
| 右侧栏贴边圆角矩形 | better-sidebar 面板覆盖式布局，header 不动 |
| 设置页头统一 | 标题 18/600 + 描述 13px + hairline 收尾 |

### ♻️ 插件视觉协调 · Plugin Visual Reconciliation

| 协调对象 | 做法 |
| --- | --- |
| `dsh-better-sidebar` | toggle 按钮胶囊化、面板背景统一、布局协调、平滑过渡动画 |
| `harness-widgets` | 统计胶囊同族、header utilities 对齐 |
| 第三方设置页 | 自动补标题、删多余图标、统一间距格式 |

### 🧹 设置页自动规范器 · Settings Auto-Normalizer ⭐

任何第三方插件往 `settings.section` 加页面时，若没有严格按官方规范设计，插件会自动修正：

| 自动检查项 | 修正方式 |
| --- | --- |
| 缺页面标题 | 注入 18/600 标题（取导航项名或已知映射） |
| 标题旁多余图标 | 移除标题行 logo，保留纯文字 |
| 标题/描述贴太紧 | 统一 4px 间距 + hairline 收尾 |
| 字号/格式不统一 | 标题 18/600、描述 13/20 + `border-bottom` |

### 🎛️ 界面定制 · UI Customization

设置 → 通用设置中的"界面定制"块：对话宽度、markdown 字号、工作区字号、UI 字体、圆角卡片均可实时调节。「圆角卡片」把对话区域显示为左上圆角的卡片并附投影，高度跟随侧栏宽度/详情列自动伸缩。

---

## 工作原理 · Architecture

- **零模型开销**：host（node）半是 no-op，全部改动发生在浏览器半；
- **官方设计令牌**：所有样式走 `--dsw-*` 语义令牌，自动跟随明暗主题；
- **两条注入通道**：静态规则（CSS Modules）+ 动态 `<style data-plugin>` 标签；
- **可逆清理**：fiber effect disposer 管理所有副作用，卸载即恢复；
- **Slot 接入**：`settings.general.item` / `settings.section` / `shell.overlay`（圆角卡片覆盖层）。

---

## 安装 · Installation

```sh
# 通过 npm（插件市场）
dsh plugin --profile web add harness-ui-enhancer

# 本地开发（link 方式）
dsh plugin --profile web add link:D:/dsh-home/plugins/harness-ui-enhancer
```

安装后**硬刷新浏览器**（Ctrl+Shift+R），在 设置 → 通用设置 看到"界面定制"块。

---

## 开发 · Development

```sh
pnpm install
pnpm run build      # tsdown 构建 lib/
pnpm run check      # 类型检查 + 构建
```

- `peerDependencies`：`@deepseek-ai/dsh-client-ui-slots`、`dsh-client-runtime`（由 DSH web profile 提供）；
- 纯 client 插件：`cordis.patch.yml` 插入 `ui-enhancer` 行，浏览器半由 `dsh.client` 声明；
- **修改后需同步**：`npx tsdown` 重建 → 同步到 `profiles/web/node_modules/harness-ui-enhancer/lib/` → 硬刷新浏览器。

---

## 兼容性 · Compatibility

- DeepSeek Harness `0.1.0-rc.6` 及兼容的后续 `0.1.x`；
- 通过官方 slot 接入，与 better-sidebar、harness-widgets、dshmarket 等插件按 slot 顺序共处；
- 已知协调对象：`dsh-better-sidebar`、`harness-widgets`、`dsh-notification`、`dshmarket`；
- 卸载/禁用后页面完全恢复默认，无残留。

---

## 路线图 · Roadmap

- **阶段一 · 官方 UI 规范化**（进行中）：继续修复官方界面中未完善的部分；
- **阶段二 · 插件兼容协调器**（进行中）：检测并修复插件间的布局/样式冲突；
- **阶段三 · 统一视觉风格**（进行中）：可选的视觉风格层——已落地「圆角卡片」（对话区左上圆角 + 投影），待续：间距密度、更多圆角/动效统一；
- **阶段四 · 生态共建**：沉淀为可扩展的规则注册机制。

---

## 变更日志 · Changelog

<details>
<summary>v0.6.1（当前）</summary>

**修复：**
- 🧩 侧栏打开时「对话/输入框与右侧面板之间的大段空隙」：修复打开 better-sidebar 右侧面板时对话区的 `margin-right` 二次挤压。此前对 `#root` 的中和只清掉了 `margin-right`，却保留了 better-sidebar 同规则里的 `width: calc(100% - var(--dsh-sidebar-width))` —— width 挤压把整列先缩到面板左缘，viewArea/composerSeat 的 margin 挤压再叠一遍，对话比面板多让出一个整面板宽。现补 `width: 100%` 完整中和 `#root`，内部 margin 成为唯一、正确的挤压（对话右缘贴合面板左缘，仅剩 scrollbar 8px 沟槽）。

</details>

<details>
<summary>v0.6.0</summary>

**移除：**
- 🗑️ 移除 MCP 服务器管理 与 自动化任务调度：这两项本不属于"UI 强化"范畴，从插件中整体删除（host half 相关 API 路由随之删除，插件回归纯 client、零 host 逻辑）。左下角不再有 MCP / 自动化按钮。

**新功能：**
- 🃏 圆角卡片：对话区域显示为左上圆角的卡片并附投影（设置 → 通用设置 → 界面定制 → 圆角卡片）
  - 不改任何源码：`shell.overlay` 挂透明覆盖层（顶边框 + 左上圆角 + `--dsw-shadow-lv3` 投影）
  - 阴影向左溢出到侧栏（形成卡片厚度），顶部下移 1px 给投影留缝；右/下为窗口自然边界、不画边框
  - 左侧不分界线：借用侧栏自身的 `border-right` 作卡片左边界
  - 覆盖层用 `ResizeObserver` 跟踪中间列，侧栏拖拽/折叠/详情列开合自动跟随
  - 内容左上角由中间列自身 `border-radius`（+ 既有 overflow:hidden）蒙成圆角，与覆盖层同半径
  - 纯 CSS 门控（`html.enhc-center-card-on` 类），可随时关闭、卸载零残留

**修复：**
- 🎚️ 界面定制开关实时反馈：圆角卡片开关改为本地镜像状态，按下瞬间 thumb 滑动 + 底色翻转，无需等待重渲染（原先父级原地改 state 不触发重渲染，开关无视觉反馈）

</details>

<details>
<summary>v0.4.1</summary>

**改进：**
- 🎯 better-sidebar toggle 按钮 relocate 到 header utilities 区域（CSS 悬浮对齐）
- 📐 header 用 `max()` 共享宽度：sidebar 关闭时让80px给 toggle cluster，打开时跟随 sidebar 宽度
- 🎬 header `margin-right` 添加平滑过渡动画（`transition: 0.3s ease-in-out`）
- 📏 better-sidebar tab bar 高度调整为44px，内部元素按比例放大
- 🔧 更新 better-sidebar hash 前缀 `W-zNGW` → `nArs4W`
- 📐 panel 顶部定位改为 `top: 6px`（距网页窗口顶部）

</details>

<details>
<summary>v0.4.0</summary>

**新功能：**
- 🔌 MCP 服务器管理面板
- ⏰ 自动化任务调度（周期/间隔/单次）
- 💬 提示词输入框复用聊天样式
- 🎨 弹窗高斯模糊 + 平滑动画

**改进：**
- MCP/自动化弹窗移除左侧导航栏
- 单次执行改为选择未来时间

</details>

<details>
<summary>v0.3.0</summary>

- 设置页自动规范器上线
- better-sidebar、harness-widgets 视觉协调
- 顶部栏单行化
- 深浅主题自适应

</details>

<details>
<summary>v0.2.0</summary>

- 对话宽度、字号、字体可调
- 工作区字号缩放

</details>

<details>
<summary>v0.1.0</summary>

- 初始版本

</details>

---

## License

[MIT](LICENSE)
