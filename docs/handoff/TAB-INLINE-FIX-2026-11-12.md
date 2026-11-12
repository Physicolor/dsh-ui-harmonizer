# FIX-2026-11-12 — 迁进标题行的会话页签：蓝条只剩 6px、文字比模式徽章高 6px

车主截图（2026-11-12，DSH 0.2.2 之后）：「对话」下面那条蓝条比文字短一截，且页签文字整行偏高。

## 根因（实测，1707x1067 @2x/4x 特写）

蓝条是**产品自己**画的：`.tab::after { left: 10px; right: 10px; bottom: -1px; height: 2px }`。
`left/right: 10px` 不是"离边 10px"，而是"按钮比标签宽 20px"——它靠**按钮两侧各 10px 的内边距**
量出与文字等宽的条子。而 `session-header.module.css` 里给页签写的

```css
:global([class$='_titleCluster'] > [class$='_tabs'] [class*='_tab']) { padding: 5px 0; }
```

一次踩了两处：

1. 把两侧 20px 内边距削掉 → 按钮 26px 宽（= 标签宽），蓝条 `26 − 20 = 6px`；
2. `_tabLabel` 也含 `_tab`，同一条规则又给标签加了 5px 纵向内边距 → 标签在按钮的 5px 之上再加
   5px，字形框实测 **11–28**，而模式徽章是 **17–33**：整行文字高 6px。

## 修法（两条规则分工）

```css
/* 标签不再自己带内边距 */
:global([class$='_titleCluster'] > [class$='_tabs'] [class$='_tabLabel']) { padding: 0; }

/* 按钮拿回产品那 10px 水平内边距（蓝条量的就是它），
   掉掉产品为"页签独立一行"准备的 -10px 上边距（strip 的 margin-top: 10px 本插件已删除），
   并按内容收高（产品会把页签 stretch 到 strip 的 35px，蓝条就会离文字 8px） */
:global([class$='_titleCluster'] > [class$='_tabs'] [class$='_viewTabs'] > button[class*='_tab']) {
  padding: 0 10px 3px;
  margin: 0 -10px;
  height: auto;
  min-height: 0;
  align-self: center;
  position: relative;
  top: 2px;          /* 页签 13px 行盒比徽章 pill 高 2px，实测补正 */
}
```

## 验证（live，1707x1067）

```
蓝条        6px → 26px（= 标签宽 26）
文字字形框  11–28（徽章 17–33）→ 16.5–33.5（徽章 17–33；中心 25 对 25）
会话头      50px → 50px（未变，仍是单行）
页签按钮盒  36px 高 → 19px 高（= 16 行盒 + 3px 给蓝条）
```

`npm run build`（tsdown + tsc）干净。

## 限制

- 仍在打包发布前：本地 `link:` 生效，npm 上的 `dsh-ui-harmonizer@0.9.2` 还是旧样式（见
  `dsh-widgets/docs/FIX-2026-11-12-rail-containing-block.md` 的索引延迟一节）。
- 只在"单页签（对话）"状态下量过；两页签（对话 + 轨迹）时条宽同样应等于各自标签宽，但未实测。
