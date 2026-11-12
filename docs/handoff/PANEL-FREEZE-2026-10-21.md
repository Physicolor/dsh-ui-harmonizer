# 2026-10-21 右侧边栏开合「整页卡死」— 根因与修复

## 症状

车主的桌面端：点击右上角「打开右侧边栏」后，整个页面立刻无法交互；画面停在一帧，
鼠标指针仍显示为可点击（手形），只有合成器驱动的「深度求索中」动画继续动。
强制重启后再次点击仍稳定复现。

## 复现（可重复）

状态：真实会话 + dsh-widgets 组件栏打开（28 张卡）+ 官方右栏的「文件」标签已加载。
动作：关闭右栏，再重新展开。

旧构建在 **close** 这一步稳定卡死（3/3）；独立 Chromium 的渲染进程被占满一个核、
内存涨到约 1.5 GB。CDP 的 `Debugger.pause` 能暂停，栈固定为：

```
settleTransitions   @ client.js:46978
settleAll           @ client.js:47442
(MutationObserver)  @ client.js:47451
```

`Profiler` 在卡死窗口里给 `settleTransitions` 记到 **7.2 s self time**（两次独立运行分别为
7206 ms / 7236 ms）。

## 根因

`instant-track.ts` 的 settle 路径被 2026-10-21 的「单时钟」改动扩大了：

1. `settleHosts` 和 `settleMo.observe()` 都新增了 **`[data-composer-seat]`**。
   dsh-widgets 的 `applyRailRight()` 会在自己的过渡回调里**再次写这个元素的内联 `right`**；
   `finish()` 它的 1 ms gate 又把 dsh-widgets 唤醒，下一次写入被 MutationObserver 当成一次新
   delivery —— 无限 settle 脉冲。
2. `settleAll()` 每次 delivery 最多跑 4 轮 `getAnimations()` + `finish()`，`queueMicrotask`
   里还会再跑一次。每轮都强制样式/布局，长会话下每轮数十毫秒，主线程因此被锁住。
3. `[data-conversation-scroll]` 仍被观察，`holdReservation()` 的临时 `padding-right`
   也会参与同一条回路。

这不是「动画慢」，是主线程的 **settle 自激循环**。

## 修复

`src/client/harness/chrome/instant-track.ts`：

- `settleHosts` 去掉 composer seat，`settleMo` 不再观察 seat。seat 的 1 ms gate 仍在样式表里，
  由浏览器在下一个渲染步自行落定 —— 与本次改动之前的已验证构建一致。
- `settleAll()` 增加重入保护（`settling`），`finish()` 期间不会嵌套 settle。
- 每次点击给 settle 一个上限 `SETTLE_ROUNDS_MAX = 6`；超过就断开 observer，剩下的 1 ms
  过渡自行结束。这是安全网：任何「你 settle 一次、我再起一条 gate」的第三方都不会再锁死页面。
- 源码注释记录实测栈与 A/B 证据，避免以后再把 seat 加回观察列表。

## 验证

- 修复前（旧 `lib/client.js`，60246）：同样布局下 close 步骤 **3/3 卡死**。
- 修复后（新构建，54886）：**6/6** 完整跑完 close + reopen，页面无错误；
  `populated` 为 `panel 768 / tabs ["文件"] / cards 28`，与卡死时的状态一致。
- `scripts/verify-panel-squeeze.cjs`：全 PASS（轨道与预留同帧、cover 同 startTime、无塌缩帧、无残留）。
- `scripts/verify-rapid-toggle.cjs`：除**既有**的 16×60ms 导轨漂移 40px（改动前后相同）外全 PASS。
- 新增 `scripts/verify-panel-freeze.cjs`：按上面的状态与动作做硬超时护栏，当前 PASS。
  它用 6 s 的 UI 调用超时判定卡死，而不是重试。

## 使用注意

插件是 `link:` 安装，`lib/client.js` 已重建；运行中的桌面端必须**重启**才会丢掉旧渲染进程里的
旧 bundle。重启后右栏开合即走修复后的路径。
