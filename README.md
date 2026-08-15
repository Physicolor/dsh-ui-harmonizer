# Harness UI Enhancer

> DeepSeek Harness Web UI 强化层：一方面规范化官方界面中**未完善、设计语言自相矛盾**的部分；另一方面**协调所有插件在 DSH 中的兼容性与显示效果**，构建更统一的视觉风格。未来还将探索更多 Agent 工具（如 Codex）的视觉风格。

Harness UI Enhancer 是一个**纯浏览器端（client-only）**的 DSH bundle 插件。它不新增任何模型工具、不修改会话日志，只通过官方 Slot 与 CSS 变量体系调整界面，卸载后不留下任何残留。

当前版本：**v0.1.0**（持续迭代中）

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
