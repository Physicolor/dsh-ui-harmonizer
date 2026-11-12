# 右栏开合：对话区与输入框的 FLIP 动画（2026-10-30，第三版）

车主的判定（对的）：这就是个 FLIP —— 量出开合前后两个盒子的 **x 与宽度**，直接插值即可，
唯一的工程问题是帧率。前两版绕开宽度插值，结果分别变成「贴边被切」和「瞬间跳动」。

## 机制（现行，`startFlip`）

1. 点击时（产品写轨道之前）记下：裁切盒 `_scrollBody` 的宽度、正文列与输入框胶囊的绘制矩形
   （`left` + `width`）、顶栏宽度。
2. 在同一个 commit 内（settle 微任务，paint 之前）：
   - 把裁切盒宽度钉成 `max(开合前, 开合后)` —— 否则盒子被裁在侧栏边缘（实测展开时正文被切 117px、
     输入框 131px，这是第一版的问题）；
   - 两个载荷盒做 FLIP：`width` 从开合前插值到落点宽度，`x` 用 `transform`/`left` 从开合前插到落点左缘，
     曲线与产品一致（300ms / `cubic-bezier(.4,0,.2,1)`）；
   - 盒子在裁切盒里是居中的，所以落点的偏移用 `centre − width/2` 一次读数推出来，不额外触发重排。
3. 动画结束那一帧一起撤掉全部内联样式：此时动画最后一帧就是静止盒，落地不跳。

为什么钉裁切盒、只动两个盒子：直接对裁切盒自己的 `width` 做动画也能得到同样的挤压，但实测贵 5 倍
（`.tmp-widthease.cjs`，3.3k 节点会话：裁切盒宽度动画 p50 **53.2ms**/帧，本方案 **10.8ms**）——
因为裁切盒每帧改变尺寸会唤醒产品自己的 `ResizeObserver` 并触发重渲染。钉住它、只动载荷，观察者不会醒。

`max-width: none` 是必需的：正文列有响应式上限（关 748 / 开 640），只写内联 `width` 会被它夹住。

落点几何按「轨道 + 预留值」缓存（`restingByState`）：收起方向产品的 `max-width` 比轨道晚一帧生效，
commit 帧读到的是展开态宽度，照着瞄会「先多移 54px 再退回来」。

## 实测（1707×1067，`enhc-panel-glide` ON）

`scripts/verify-panel-motion.cjs` 逐帧断言：

| 判据 | 展开 | 收起 |
| --- | --- | --- |
| 左缘单调（无回弹） | 466→375→342→321→312 | 312→419→441→464→466 |
| 首帧从自身左缘出发 | 466 = 开合前 | 312 = 开合前 |
| 任何采样帧画到裁切盒外 | 0px（正文 / 输入框） | 0px |
| 落点与静止盒一致 | 312/588 | 466/748 |
| 收尾无残留内联样式 | 无 | 无 |

**帧率（诚实的代价）**：一次 300ms 的宽度插值要逐帧重排正文（3.3k 节点会话实测 5 个绘制位置，
约 10–15fps）。这是「按你描述做正确动画」的固有成本；想要更顺只能减少重排（例如动画期间给正文块加
`content-visibility`，实测能把 p50 从 48.7ms 压到 8.5ms，但 p90 仍 ~60ms）。

## 本轮另两条报告

- **位置漂移**：两轮探针（不同窗口尺寸、连续开合 4 次、开关后各状态）都没能复现，静止几何与产品自身
  完全一致、没有任何内联残留。结构上也只可能在「残留内联样式」时漂移，而现在的动画只有一条、
  `stop()` 同步且必回滚，verifier 每次切换都断言无残留。若仍出现，需要具体的操作序列。
- **切换工作区会话时先平移再回位**：已复现并定位。主因不在本模块——
  右侧预留（`padding-right`，由 dsh-pinned-summary / dsh-widgets 发布）在新视图挂载后**晚一帧**才回来，
  于是正文先被画在「无预留」的中心（616px）再跳回 466px（实测 `col [312,616,469,467,466]`）。
  另外，`_frame` 上那条常驻的 `grid-template-columns` 缓动（为左侧栏加的）会让这次换会话的轨道写入
  也走 300ms，实测多出一帧被压到 287px 宽的正文（`col [312,462,517,466] colw [587,287,640,748]`）。
  本轮加了「会话行点击后 400ms 内的轨道过渡直接 finish」与「切换时顶住上一次预留值」，
  实测 287px 那一帧仍在（说明这次缓动不是本模块规则触发的，或 observer 时机晚于首帧），
  因此这条**尚未修好**，下一步应当改预留值的发布时机（owner 侧），而不是继续在动画层打补丁。

## 代码位置

| 关注点 | 文件 |
| --- | --- |
| 右栏开合全部行为（FLIP、裁切盒钉子、预留 hold、切换抑制） | `src/client/harness/chrome/instant-track.ts` |
| 轨道 snap 闸门、dock 开方向滑入、常驻轨道缓动 | `src/client/harness/frame-column-transition.module.css` |
| 平移本身对不对（新） | `scripts/verify-panel-motion.cjs` |
| 轨道一帧落地 / 挤压预留 / 连点 | `scripts/verify-frame-track.cjs`、`verify-panel-squeeze.cjs`、`verify-rapid-toggle.cjs` |

## 第四轮追加：帧率的真正瓶颈与「padding 挤压」配方（已量，未落）

车主的判断（动画期间冻结/不要每帧重排）指向正确的方向，实测定位到瓶颈是**动的是「尺寸」而不是「内容盒」**：

| 做法（3.3k 节点会话，一次 300ms） | 帧间隔 |
| --- | --- |
| 空转 | p50 4.3ms / p90 5.9ms |
| 裁切盒 `width` 动画（改尺寸） | p50 53.2ms / p90 65.1ms（≈13fps） |
| 正文列 `width`+`transform` FLIP（现行，改尺寸） | p50 10.8ms / p90 60.1ms（一次开合只画出 6–8 个位置） |
| 视口钉成 `border-box` + `padding-right` 走 CSS `transition` | **一个 300ms 内 39 个中间值**（padding 300→767），正文列随之平移+收窄 |

关键细节（都是实测出来的，不是推断）：

1. **WAAPI 动画压不过 owner 的 `!important`**：`dsh-pinned-summary` 用 `padding-right: … !important`
   写预留值，实测动画在跑、计算值仍是 300px。**CSS transition 的级联位置高于 important 声明**，
   同一条命令换成 transition 就能跑满 39 步。
2. **产品的 `_scrollBody` 是 `content-box`**：在这种盒子加 padding 只会把元素撑宽、不会收窄内容。
   必须先把视口钉成 `border-box` 并把 border 钉在较宽的那个值，`border − gutter − padding` 才是内容宽度。
3. **transition 必须出现在「变更前样式」里**：所以内联声明 transition（带 importance，压过 snap 闸门的
   1ms duration）与改值是两帧，不能同一 task。

落地方式（下一处改动）：`startPinch` 替代 `startFlip` —— 钉 border-box + 宽度、内联 transition、
一帧后改 padding 到 `pinned − gutter − contentRest`、`transitionend`/超时后一次性回滚（宽度、box-sizing、
padding、transition 全部还原）。本轮尝试落地时改坏过一次构建，为不留半成品已回退到 FLIP。

另外验证过但**不可用**的「冻结」写法：给正文列的子块加 `content-visibility: auto` ——
它引入 containment，会把 `dsh-widgets` 的导轨（`position: fixed`）拖走（实测导轨漂移 789.8px），
且并没有提高绘制帧数。要冻结只能选不含 fixed 后代的子树。
