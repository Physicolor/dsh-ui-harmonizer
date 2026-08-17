<p align="center">
  <h1 align="center">Harness UI Enhancer</h1>
  <p align="center"><strong>美化你装了一堆插件的 DeepSeek Harness。</strong></p>
  <p align="center"><em>规范化官方界面 · 协调每个插件 · 全部可逆 · 零模型开销</em></p>
</p>

<p align="center">
  <a href="#-安装"><strong>快速开始</strong></a> ·
  <a href="#-核心能力"><strong>能力</strong></a> ·
  <a href="#-原理"><strong>原理</strong></a> ·
  <a href="#-路线图"><strong>路线图</strong></a> ·
  <a href="LICENSE">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/harness-ui-enhancer" alt="npm version" />
  <img src="https://img.shields.io/badge/platform-web-success" alt="platform" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="license" />
  <img src="https://img.shields.io/badge/client--only-✓-purple" alt="client only" />
</p>

---

> **一句话：** 你装了一堆 DSH 插件，界面却风格割裂、按钮东一个西一个？Harness UI Enhancer 用「**CSS 覆盖 + 运行时 DOM 协调**」把它们拉回官方设计语言，**不破坏任何插件源码、卸载即还原、零模型开销**。

Harness UI Enhancer 是一个**纯浏览器端（client-only）** 的 DSH bundle 插件。它不新增模型工具、不改写会话日志，只通过官方 `settings.section` / `settings.general.item` 槽位与 `--dsw-*` 语义令牌体系调整界面。装上它，任何插件在你的界面里都会"更懂规矩"。

---

## ✨ 核心能力

| 能力 | 说明 |
| --- | --- |
| 🎨 **官方 UI 规范化** | 修复官方界面中未完善、自相矛盾的设计（顶部栏单行化、设置页头、对话/轨迹选择器…） |
| ♻️ **插件视觉协调器** | 让 better-sidebar、widgets、以及任何第三方设置插件**统一到官方视觉语言** |
| 🧹 **设置页自动规范器** ⭐ | 自动扫描任意插件的 `settings.section` 表头：**缺标题补标题、多余图标删除、标题/描述间距与格式统一** |
| 🔌 **MCP 服务器管理** | 在侧边栏添加 MCP 配置入口，支持添加/编辑/删除/测试连接 |
| ⏰ **自动化任务调度** | 定时任务管理，支持周期/间隔/单次三种调度模式，提示词输入框复用聊天输入框样式 |
| 🌙 **深浅主题自适应** | 全部走 `--dsw-*` 语义令牌，明暗主题自动跟随，不脱节 |
| 🧩 **可逆 / 无侵入** | 覆盖式实现，卸载后浏览器完全恢复默认，绝不破坏对方插件源码 |

### MCP 服务器管理

点击左下角 **MCP** 按钮打开配置面板：

- **添加服务器**：输入服务器名称和启动命令（stdio）或 URL（streamable-http）
- **启用/禁用**：切换服务器连接状态
- **测试连接**：一键验证服务器配置是否正确
- **删除**：移除不需要的服务器

配置保存在 `~/.dsh/mcp.json`，通过 `@deepseek-ai/dsh-mcp-client` 实现真实连接。

### 自动化任务调度

点击左下角 **自动化** 按钮打开任务管理面板：

- **周期执行**：每天/每周X/每月X日 + 指定时间
- **间隔执行**：每 N 分钟自动执行
- **单次执行**：在指定的未来时间执行一次

创建任务时，提示词输入框复用聊天输入框样式（圆角 24px），用户一眼就能理解"这就是给 Agent 发消息"。

**工作原理**：任务触发时，通过 ACP (Agent Client Protocol) 在指定工作区创建新会话并发送提示词，与人类在输入框发送消息完全相同。

### 效果预览

**整体效果：** 顶部栏单行化 + 左下角 MCP 与自动化按钮

![整体效果](docs/screenshot-overview.png)

**better-sidebar 适配：** 右侧面板样式统一、toggle 按钮胶囊化

![better-sidebar 适配](docs/screenshot-better-sidebar.png)

**harness-widgets 适配：** 右侧统计栏与对话区域协调

![harness-widgets 适配](docs/screenshot-widgets.png)

### 它具体帮你做什么

- **顶部栏单行化**：对话/轨迹选择器移入标题行、做成互斥胶囊，header 收成单行，视觉重心更稳。
- **少分隔线、多层级**：用背景层级/圆角/阴影/留白自然分区，替代生硬的 1px 分隔线。
- **按钮胶囊家族**：Session log、组件胶囊、better-sidebar toggle、对话/轨迹 tabs——统一为同一族 32px 胶囊，激活态品牌色填充。
- **右侧栏贴边圆角矩形**：better-sidebar 面板从"整页推挤"改为"覆盖式 + header 不动"，面板随 widgets rail 对齐。
- **弹窗高斯模糊**：MCP/自动化弹窗背景添加 `backdrop-filter: blur()` 效果，与官方设置弹窗一致。
- **平滑动画**：弹窗打开时有缩放 + 淡入效果，使用官方缓动函数。
- **设置页自动规范器**：见下一节。

## 🧹 设置页自动规范器

这是本插件的核心差异化卖点：**任何第三方插件往 `settings.section` 里加页面时，只要没有严格按官方规范设计，Harness UI Enhancer 会自动把它拉回规范。**

| 它自动检查并修正 | 做法 |
| --- | --- |
| **缺页面标题** | 若页面只有描述没有 `<h2>`，自动注入一个 18/600 的标题（取当前设置导航项名，取不到则由已知映射兜底） |
| **标题旁多余图标** | 移除标题行里那个 logo/图标，让标题是干净的纯文字 |
| **标题/描述贴太紧** | 统一为官方 4px 间距 + 描述下方 hairline 收尾 |
| **字号/格式不统一** | 标题统一 18/600、描述统一 13/20 + `border-bottom` hairline |

> 详情与给插件作者的规范见 **[`docs/settings-section-style.md`](docs/settings-section-style.md)**（官方设置页表头设计规范，欢迎插件作者对标）。

**不越界**：只统一"表头"这一层的视觉；不重排你的内容区、不删功能性图标（只删标题行 logo）、不伪造描述文案。

---

## 🔧 工作原理

- **零模型开销**：host（node）半是 no-op，全部改动发生在浏览器半；
- **官方设计令牌**：所有样式走 `--dsw-*` 语义令牌（背景、边框、阴影、品牌色），因此自动跟随 DSH 明暗主题，不会出现"插件样式与主题脱节"；
- **两条注入通道**：
  1. 静态规则（`enhancer.module.css`）读取 `<html>` 上的 `--enhancer-*` 自定义属性；
  2. 动态 `<style data-plugin="harness-ui-enhancer">` 标签重写 `--dsw-font-markdown-*` 字体令牌（字体简写无法用自定义属性表达）；
- **可逆清理**：插件停止/更新/卸载时，动态样式标签与根属性通过 fiber 的 effect disposer 一并移除，页面恢复原状。

---

## 🚀 安装

```sh
# 发布到 npm / 插件市场后
dsh plugin --profile web add harness-ui-enhancer

# 本地开发（link 方式，改动即时生效，client 改动无需重启）
dsh plugin --profile web add link:D:/dsh-home/plugins/harness-ui-enhancer
```

装完**硬刷新浏览器**（Ctrl+Shift+R）即可在 设置 → 通用设置 看到"界面定制"块，并让所有第三方设置页自动收敛到规范。

---

## 🗺️ 路线图

按"先官方、再插件、后风格"的顺序推进，每一阶段都保持可逆、只读协调、不破坏其它插件 DOM：

- **阶段一 · 官方 UI 规范化**（进行中）：继续修复官方界面中未完善、自相矛盾的部分——设置页头只是第一步；
- **阶段二 · 插件兼容协调器**（进行中）：检测并修复与其他插件叠加时的布局/样式冲突（右栏、侧边栏、浮层 z-index、重复页头、字体/间距令牌冲突等），以"已知冲突清单 + CSS 变量归一化 + 布局锚点协调"实现；
- **阶段三 · 统一视觉风格**：在此之上提供可选的视觉风格层（间距密度、圆角、动效、配色微调），并探索其它 Agent 工具（如 Codex）的视觉风格移植；
- **阶段四 · 生态共建**：把"官方 UI 修复 + 冲突协调"沉淀为**可扩展的规则注册机制**，让其它插件可以声明自己的 UI 兼容诉求。

---

## 🛠️ 开发

```sh
pnpm install
pnpm run build      # tsdown 构建 lib/
pnpm run check      # 类型检查 + 测试 + 构建（如有）
```

- 依赖的官方包（`@deepseek-ai/dsh-client-ui-slots`、`dsh-client-runtime`）以 `peerDependencies` 声明，由 DSH web profile 提供；
- 纯 client 插件：`cordis.patch.yml` 插入一行 `ui-enhancer` 行，浏览器半由 `dsh.client` 声明被 client-modules 扫描加载；
- **修改后需同步**：改 bundle 后 `npx tsdown` 重建 `lib/client.js` 并**同步到 profile 拷贝**（`profiles/web/node_modules/harness-ui-enhancer/lib/`）；浏览器读 profile 拷贝而非源目录，服务端 `no-cache`，**无需重启 DSH，硬刷新即可**。

---

## ✅ 兼容性

- DSH `0.1.0-rc.6` 及兼容的后续 `0.1.x`；
- 通过官方 `settings.general.item` / `settings.section` slot 接入，与 better-sidebar、harness-widgets、dshmarket 等插件按 slot 顺序共处；
- 已知协调对象：`dsh-better-sidebar`、`harness-widgets`、`dsh-notification`、`dshmarket`；
- 卸载/禁用后页面完全恢复默认，无残留。

---

## FAQ

**会破坏其它插件吗？**
不会。所有协调通过 CSS 覆盖 + 运行时 DOM 协调实现，对方插件升级时最坏情况是我们的规则静默失效，绝不破坏它。

**会不会拖慢 DSH？**
不会（零模型开销，浏览器侧纯样式/轻量 DOM 观察）。

**有些插件我不想要它协调？**
可以自行从 `enhancer.module.css` 里注释对应规则（覆盖式，逐条可选）。

---

## 📄 License

MIT

---

## 📝 更新日志

### v0.4.0 (2026-08-17)

**新功能：**
- 🔌 MCP 服务器管理面板：在侧边栏添加 MCP 配置入口，支持添加/编辑/删除/测试连接
- ⏰ 自动化任务调度：支持周期/间隔/单次三种调度模式
- 💬 提示词输入框复用聊天输入框样式（圆角 24px），让用户直观理解"给 Agent 发消息"
- 🎨 弹窗背景高斯模糊效果（`backdrop-filter: blur(4px)`）
- ✨ 弹窗打开平滑动画（缩放 + 淡入）
- 📷 README 添加三张效果截图（整体效果、better-sidebar 适配、harness-widgets 适配）

**改进：**
- MCP/自动化弹窗移除左侧导航栏（单页面无需导航）
- 取消按钮样式统一为 pillBtn
- 单次执行改为选择未来时间（而非立即执行）

**修复：**
- 修复触发按钮样式与官方设置按钮不一致的问题
- 移除 MCP/自动化按钮之间的间距
- 修复 backdrop-filter 在某些浏览器不生效的问题

### v0.3.0

- 设置页自动规范器上线
- better-sidebar、harness-widgets 视觉协调
- 顶部栏单行化
- 深浅主题自适应

### v0.2.0

- 对话宽度、字号、字体可调
- 工作区字号缩放

### v0.1.0

- 初始版本
