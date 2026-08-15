# Harness UI Enhancer

> DeepSeek Harness Web UI 强化层：一方面规范化官方界面中**未完善、设计语言自相矛盾**的部分；另一方面**协调所有插件在 DSH 中的兼容性与显示效果**，构建更统一的视觉风格。未来还将探索更多 Agent 工具（如 Codex）的视觉风格。

Harness UI Enhancer 是一个**纯浏览器端（client-only）**的 DSH bundle 插件。它不新增任何模型工具、不修改会话日志，只通过官方 Slot 与 CSS 变量体系调整界面，卸载后不留下任何残留。

当前版本：**v0.2.0**（持续迭代中）

---

## 🎨 v0.2.0 · 顶部栏 / 右侧栏深度视觉统一

**设计理念**：这一版对顶部栏、右侧栏做了深度视觉优化，核心目标是让 DeepSeek Harness 给你更好的观感——**尽量避免用分隔线隔开元素**，靠「背景层级、圆角、阴影、间距」自然分区，避免界面显得杂乱。未来会持续沿这条线改进：把更多功能按钮放进右上角区域、统一按钮样式、优化对话/轨迹等选择器排版，让视觉重心更稳定。

**贯穿原则**：不破坏任何第三方插件源码。所有改动通过 **CSS 覆盖 + 运行时 DOM 协调（MutationObserver）** 实现——对方插件升级时，最坏情况是我们的规则静默失效，绝不破坏它。

### 设计哲学

- **少分隔线，多层级**：分隔线是最"重"的分割手段；改用在同一底色上靠圆角卡片 / 阴影 / 留白制造自然边界，画面更轻盈；
- **按钮胶囊家族**：Session log、组件胶囊、better-sidebar 的两个 toggle、对话/轨迹 tabs——全部统一为同一族胶囊按钮（32px、1px 边框、圆角、激活品牌色填充），右上角操作区像一个整体；
- **顶部栏单行化**：原来"对话/轨迹"选择器独占一整行、视觉重心下沉；重定位进标题行、做成互斥胶囊后，header 收成单行，重心稳定、信息密度更合理；
- **正确的深浅色适配**：激活态文字用 `label-primary-inverted`（浅色白字 / 深色深灰字），品牌填充按钮深浅主题都清晰；
- **视觉可逆**：一切还是覆盖式，卸载即还原。

### 具体改动

#### 官方 DSH UI
- **header 单行化**：`padding: 12px 90px 12px 20px`，底部留 12px 呼吸间距；
- **彻底去掉 header 下方分隔线**：同时清除产品的透明 border-bottom **和** 用 `:after` 伪元素画的那条 1px 横线；
- **对话/轨迹 tabs**：运行时移入标题行（右侧操作区），做成**互斥胶囊**，激活态用 **DeepSeek 品牌蓝**（`state-business-primary`，light 深蓝 / dark 亮蓝自动适配），移除原底部下划线；
- **下拉菜单缩放**：模型/权限选择器的弹出菜单（`role=menu`）尺寸跟随工具栏缩放；- **既有 v0.1.0**：对话宽度、字号、工作区字号、UI 字体、设置页头、面包屑加宽、版本 select 产品化、滑动条外观。

#### 对 dsh-better-sidebar 的协调
- **toggle 按钮**：28px 圆形 → **32px 胶囊**（同 Session log 族），hover 淡色底，**激活态**（对应面板打开）品牌填充 + 对比文字——由运行时 MutationObserver 把 `aria-pressed` 同步到按钮驱动；
- **右侧栏 → 贴边圆角矩形**：替代左边和上方的分隔线；`radius 14px` 左上圆角 + `lv3` 阴影 + 背景 `bg-layer-1`；`overflow:hidden` 让外部圆角统一裁剪内部所有直角内容（圆角单一来源）；去掉顶部横线；
- **布局协调**：中和 better-sidebar 打开时的 `#root` 整页推挤，让 **header 永不动**；对话内容区 + 输入框改为让出 `--dsh-sidebar-width` 空间由面板覆盖（覆盖式，与 widgets rail 同级）；
- **面板内部**：tab 之间去掉分隔线、pane 背景与面板同色；**面板内永不横向滚动**（`min-width:0` 断撑宽链 + `overflow-x:hidden` + 超长名省略号）；
- **面板标签页**：左边不再留 padding，靠外部裁剪保证圆角自然。

#### 对 harness-widgets 的协调
- **组件胶囊激活态**深色修复：文字色 `#fff` → `label-primary-inverted`（深色主题不再白底白字）；
- **面板与 rail 同级**：better-sidebar 面板 top 复用 widgets 动态测量的 `--dsx-rail-top`（= 对话滚动区顶部 / header 底部），两侧栏自动对齐。

### 修复记录
- **v0.2.1（本次）**：修 tabs 重定位误把插件市场（dshmarket）的 tabs 搬进标题行——查找限定在 `[data-slot="conversation.session.header"]` 作用域内。

---

## ✨ 当前功能（Settings → 通用设置）

插件在 **设置 → 通用设置** 中注册了两个界面块：

### 1. 统一的"通用设置"页头

官方设置页缺少页面标题与说明文字，插件补齐了 `GeneralHeader`（标题 + 描述），让设置页顶部与其他页面观感一致。

### 2. "界面定制"块（4 个实时调节项）

| 调节项 | 范围 | 说明 |
| --- | --- | --- |
| 对话内容宽度 | 748–1000px | 对话列的最大宽度，滑动即时预览 |
| 对话字号 | 12–20px | markdown 正文与输入框文字大小（标题/代码/表格按比例联动） |
| 工作区字号 | 12–20px | 左侧工作区列表、按钮与图标的整体缩放 |
| UI 字体 | 6 套预设 | 系统默认 / HarmonyOS Sans SC / 微软雅黑优先 / Noto Sans SC / 衬线（宋体风）/ 等宽 |

所有调节**即时生效**（滑动即预览），无需刷新；状态持久化在浏览器 localStorage，刷新后保留。

## 🔧 工作原理

- **零模型开销**：host 半为空实现（no-op），全部改动发生在浏览器半；
- **官方设计令牌**：所有样式走 `--dsw-*` 语义令牌（背景、边框、阴影、品牌色），因此**自动跟随 DSH 明暗主题**，不会出现"插件样式与主题脱节"；
- **两条注入通道**：
  1. 静态规则（`enhancer.module.css`）读取 `<html>` 上的 `--enhancer-*` 自定义属性；
  2. 动态 `<style data-plugin="harness-ui-enhancer">` 标签重写 `--dsw-font-markdown-*` 字体令牌（字体简写无法用自定义属性表达）；
- **可逆清理**：插件停止/更新/卸载时，动态样式标签与根属性通过 fiber 的 effect disposer 一并移除，页面恢复原状。

## 🚀 安装

```sh
# 发布到 npm / 插件市场后
dsh plugin --profile web add harness-ui-enhancer

# 本地开发（link 方式，改动即时生效，client 改动无需重启）
dsh plugin --profile web add link:D:/dsh-home/plugins/harness-ui-enhancer
```

装完**硬刷新浏览器**（Ctrl+Shift+R）即可在 设置 → 通用设置 看到"界面定制"块。

## 🗺️ 路线图

按"先官方、再插件、后风格"的顺序推进，每一阶段都保持可逆、只读协调、不破坏其它插件 DOM 的原则：

- **阶段一 · 官方 UI 规范化**（进行中）：继续修复官方界面中未完善、设计语言自相矛盾的部分——设置页头只是第一步，后续覆盖设置页其他区块、会话页细节、空态/加载态等；
- **阶段二 · 插件兼容协调器**（核心方向）：检测并修复与其他插件叠加时的布局/样式冲突（右栏、侧边栏、浮层 z-index、重复页头、字体/间距令牌冲突等），以"已知冲突清单 + CSS 变量归一化 + 布局锚点协调"的方式，让装了一堆插件的界面依然协调统一；
- **阶段三 · 统一视觉风格**：在兼容协调之上提供可选的视觉风格层（间距密度、圆角、动效、配色微调），并探索其它 Agent 工具（如 Codex）的视觉风格移植；
- **阶段四 · 生态共建**：把"官方 UI 修复 + 冲突协调"沉淀为可扩展的规则注册机制，让其它插件可以声明自己的 UI 兼容诉求。

## 🛠️ 开发

```sh
pnpm install
pnpm run build      # tsdown 构建 lib/
pnpm run check      # 类型检查 + 测试 + 构建
```

- 依赖的官方包（`@deepseek-ai/dsh-client-ui-slots`、`dsh-client-runtime`）以 `peerDependencies` 声明，由 DSH web profile 提供；
- 纯 client 插件：`cordis.patch.yml` 插入一行 `ui-enhancer` 行，浏览器半由 `dsh.client` 声明被 client-modules 扫描加载。

## ✅ 兼容性

- DSH `0.1.0-rc.6` 及兼容的后续 `0.1.x`；
- 通过官方 `settings.general.item` slot 接入，与 better-sidebar、widgets 等插件按 slot 顺序共处；
- 卸载/禁用后页面完全恢复默认，无残留。

## 📄 License

MIT
