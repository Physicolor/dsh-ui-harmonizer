# 交接：右侧栏开合「动画不同步」+ 掉帧（第二期）

> 本文件是**新会话启动提示词**。上一段对话已把「右侧栏开合平顺」（`enhc-panel-glide`）落地并验收，
> 车主实测后给出新反馈：**效果是「先闪烁后平移」**。下一期只做两件事，且它们**是两个独立方向**。
>
> 车主要求：本文件写好后在新对话里继续，不要在旧对话里继续（旧对话压缩次数已多）。

---

## 0. 复制的启动提示词（新会话第一句直接用这段）

```
继续修复 DeepSeek Harness 右侧边栏开合的动画问题。上一期我实现了 dsh-ui-harmonizer 的
「侧栏开合平顺」（enhc-panel-glide，默认开），掉帧改善了，但实测出现新问题：
「展开右侧边栏时效果类似于先闪烁后平移」。

车主（车仔面大王）已把问题拆成两个独立方向：
  1. 让展开/收起右侧边栏 与 中栏的压缩/展开动画 完全同步
  2. 继续解决掉帧

请先读 D:\dsh-home\plugins\dsh-ui-harmonizer\docs\handoff\RIGHT-PANEL-SYNC.md，
里面是上一期已确证的全部证据、文件清单、护栏命令与环境约束。然后按其中
「下一期要做的实验」一节逐条推进。

硬约束：
- 绝不修改官方桌面端（AppFrame / Electron）一个字节，所有修复只能活在插件里。
- dsh-ui-harmonizer 工作树里有车主自己的未提交改动，一律不得提交、不得回滚。
- 中文回复，称呼「车仔面大王」，不要 emoji。
```

---

## 1. 车主原始反馈（逐字，必须按这两个方向做）

> 「展开右侧边栏时效果类似于先闪烁后平移，首要的原因是：**侧边栏本身的动画时机和中栏的动画时机并不相同**，
> 其次才是掉帧问题。你在测试的时候会发现，在点击展开右侧边栏后，**右侧边栏先出现，然后过了若干毫秒的
> 时间，整个中栏区域才开始进行收缩和平移**。而在关闭这个侧栏开合平顺后的效果，虽然整个中栏稳定掉帧，
> 但是**动画时机上的延迟稍微小一些**。」
>
> 「也就是说，我们的修复方向要分为两点：
> 1. 让展开和收起右侧边栏与中栏的压缩和展开动画完全同步进行
> 2. 解决掉帧问题」

注意车主括号里的两个观察都必须能解释：
(a) **OPEN** 方向：右栏先出现，中栏后动；
(b) **把「侧栏开合平顺」关掉后，时机延迟反而更小** —— 即我的实现让不同步变差了。

---

## 2. 两层归属（已定论，不要再重开调查）

| 层 | 归属 | 说明 |
|---|---|---|
| 中栏列宽（`grid-template-columns`）的**逐帧重排** | **dsh-ui-harmonizer 的责任** | 是本插件在 `harness/frame-column-transition.module.css` 里给官方 `_frame` **永久挂上了** `transition: grid-template-columns var(--ds-transition-duration-slow)`；官方 DSH 0.2.0 把它藏在 `[data-animating]` 后面且同一次 commit 里写属性 ⇒ 官方原版是**瞬跳**，缓动是插件加的。 |
| 残留的**首帧同步布局卡顿**（约 200–250ms 阻塞） | **DSH Desktop 官方自己的** | 把两条 tween 全杀掉仍然存在 238–254ms 的 LoAF block；官方 shell 每帧强制同步布局。 |

不要在报告里混为一谈；**必须分层表述**。

---

## 3. 上一期的实现（现状：已落地、门禁全绿、车主已实测）

### 3.1 文件

| 文件 | 作用 |
|---|---|
| `plugins/dsh-ui-harmonizer/src/client/harness/chrome/instant-track.ts`（439 行，新建） | 核心。capture 阶段 click 监听 → 加 `enhc-instant` → rAF/RO 跟踪布局 → 为两个宿主各起一条 cover 动画 |
| `plugins/dsh-ui-harmonizer/src/client/harness/frame-column-transition.module.css`（69 行） | L37-39 永久 tween；L40-42 `enhc-window-resizing` 例外；**L66-68 新的 gate**：`html.enhc-panel-glide.enhc-instant [class$='_frame'], … [class$='_scrollBody'] { transition-duration: 0.001s !important }` |
| `plugins/dsh-ui-harmonizer/src/client/core/state-model.ts` | `EnhancerState.panelGlide: boolean`，`DEFAULT_STATE.panelGlide = true` |
| `plugins/dsh-ui-harmonizer/src/client/core/state-store.ts` | `if (typeof state.panelGlide !== 'boolean') state.panelGlide = DEFAULT_STATE.panelGlide` |
| `plugins/dsh-ui-harmonizer/src/client/core/apply.ts` | `root.classList.toggle(PANEL_GLIDE_CLASS, state.panelGlide)`；`disposeDynamicStyle` 清 `enhc-panel-glide`+`enhc-instant` |
| `plugins/dsh-ui-harmonizer/src/client/core/i18n.ts` | `getRowPanelGlideTitle()` → zh「侧栏开合平顺」/ en "Smooth Panel Toggle"；`getRowPanelGlideDesc()` |
| `plugins/dsh-ui-harmonizer/src/client/self/settings/general-rows.tsx` | `key: 'panel-glide'` 的 `SettingsRow` + `SwitchControl` |
| `plugins/dsh-ui-harmonizer/src/client/index.ts` | `mountInstantTrack()`，`ELEVEN effects` → `TWELVE effects`（新第 10 项） |
| `plugins/dsh-ui-harmonizer/scripts/verify-frame-track.cjs` | 12 项护栏 |
| `plugins/dsh-ui-harmonizer/scripts/verify-rapid-toggle.cjs` | 25 项联按护栏（新建） |
| `plugins/dsh-ui-harmonizer/scripts/verify/settings-page.cjs` | 设置页含「侧栏开合平顺」 |
| `plugins/dsh-ui-harmonizer/README.md` / `README.zh-CN.md` | 说明 + 护栏清单 + changelog（**LF-only**） |
| `plugins/dsh-ui-harmonizer/docs/architecture/baseline/{css,general-page}.json(.png)` | 基线 |

### 3.2 instant-track.ts 关键接缝与常量

```ts
export const PANEL_GLIDE_CLASS = 'enhc-panel-glide'   // 由 apply.ts 按设置开关
const INSTANT_CLASS  = 'enhc-instant'                  // 只在一次开合期间存在
const HOLD_MS        = 420
const COVER_MS       = 300
const MIN_COVER_MS   = 120
const HOLD_CAP_MS    = 400
const DEADLINE_MS    = 600
const MAX_TRIES      = 60
const COVER_EASING   = 'cubic-bezier(0.4, 0, 0.2, 1)'
const TOGGLE_SELECTOR  = '[data-sidebar-right-toggle],[data-sidebar-right-expand]'
const PROSE_SELECTOR   = '[class$="_column"]'
const COMPOSER_SELECTOR = '[data-slot="conversation.composer.bar"] [class*="_card"]'
```

内部结构：`interface Glide { animation; element; position }`；`leftOf(el)`；`startCover(element, property: 'left'|'transform', before: number, startedAt: number): Glide | null`
（**先测 `after` 再建任何 cover**；`from = before - after`；`duration = max(COVER_MS - elapsed, MIN_COVER_MS)`；
结尾 `animation.finished.then(() => void animation.cancel(), () => {})` 防 `fill:'both'` 残留）；
`mountInstantTrack()` 内有 `let generation = 0`，`onClick` 里 `releaseCovers(); generation += 1; const mine = generation`，
`step()` 开头 `if (mine !== generation || !root.classList.contains(PANEL_GLIDE_CLASS)) return`（**联按防泄漏，25 项护栏**）。

### 3.3 两个宿主为什么一个用 transform、一个用 left（**绝不能改**）

- 正文列 `[class$='_column']`：`overflow: visible`、`position: static`、10878 个后代里 **0 个 `position: fixed`** ⇒ 唯一能安全吃 `transform` 的宿主。
- 输入框胶囊 `[data-slot="conversation.composer.bar"] [class*="_card"]`：子树含 `[data-slot="conversation.input.overlay"] → .dsx-stats-drawer → .dsx-stats-drawer-zoom → .dsx-stats-rail`，**3 个 `position: fixed` 节点** ⇒ 加 `transform` 会改写它们的包含块，**实测导轨 1247 → 553**（对导轨做反向补偿也修不好，1247 → 412）。改用 `left`（布局属性，不建立包含块）⇒ **每一档导轨漂移 0.0px**。
- 二者的**共同祖先全部**含那 3 个 fixed 节点，所以也绝不能 transform 祖先。

### 3.4 代价 / 收益（已实测，绝对值口径）

`.tmp-realcost.cjs`（现存 `plugins/dsh-widgets/scripts/.tmp-realcost.cjs`；两臂跑同一份构建、唯一差别是 `<html>` 上的 `enhc-panel-glide`）：

- LoAF 阻塞：**259ms → 153ms（−41%）**，条数 29 → 16
- 代价：约 +8ms layout / +23 次 `LayoutCount`

> **口径警告**：只准引用绝对值 ms。此前废弃的 `forced/block` 比值口径不得再用。

---

## 4. **本期新证据（决定性）** —— 不同步的机制

新探针：`D:\dsh-home\plugins\dsh-widgets\scripts\probe-sync-anchor.cjs`（已从 `.tmp-*` 提升为长期探针）
（用法 `node scripts/probe-sync-anchor.cjs <open|close> <label>`，`DSH_SESSION=<会话名子串>`，
`DSH_PANEL_GLIDE=off` 可剥掉根类测 OFF 臂；产物 `.probe-sync-anchor/<label>.json`。
⚠ **该探针已退役、不要再用**：`:106` 的 `tab: g('[class$="_tabCell"]')` 是**永久不匹配**的选择器
（真实类名是 `_tabCell_6nhg2_142`，必须写 `[class*="_tabCell"]`），所以它的面板一侧恒为 `null`。
证据已全部转移，需要重测请用 `probe-panel-onset.cjs`。）
它同时记录 `transitionrun/start/end`（capture）、`<html>`/`_frame`/`_scrollBody`/`_widthHandle` 的
MutationObserver 属性写入、`getAnimations()` 快照、逐帧几何。）

### 4.1 官方把「轨道写入」和 `data-animating` 放在**同一次 commit**

实测（会话 `Laya与RRSI必要性1天`，headless 1707×1067 dsf=1）：

```
1880.0ms  _frame  style:  grid-template-columns: …minmax(0px,0px) -> …minmax(0px,768px)   ← 开
1880.2ms  _frame  data-animating:  null -> true
1891.6ms  transitionrun  grid-template-columns  @div.BynINW_frame
2186.2ms  transitionend  grid-template-columns  elapsed 0.001s
```

⇒ 印证插件注释里的判断：**官方原版永远是瞬跳**，缓动是插件给的。

### 4.2 **`enhc-instant` 加得足够早**（不是它太晚）

```
1768.1ms  html.enhc-panel-glide  class: … -> … enhc-instant     ← 比轨道写入早 112ms
1880.0ms  _frame 轨道写入
```

⇒ capture 阶段生效，**gate 时机没问题**。不要再往「gate 太晚」方向查。

### 4.3 **真正的不同步：cover 起跑太晚**

`getAnimations()` 快照（ON open）：

```
2164.5ms  grid-template-columns dur=1   @div.BynINW_frame
2470.3ms  anim dur=120  @div.xz4KEq_column      ← 正文列 cover
2470.3ms  anim dur=120  @div.RlGAzG_card        ← 胶囊 cover
```

`dur=120` 就是 `MIN_COVER_MS` ⇒ 说明 cover 被创建时 `elapsed` 已经 ≈180ms，
**即中栏的可见平移比轨道写入晚了约 300–590ms**，而官方的右栏自身滑动（`transform` on `_tabCell`，300ms）
在这之前就已经开始。这正是车主说的「右栏先出现，若干毫秒后中栏才开始动」。

原因：`startCover` 必须**先等到能读到新布局**（rAF 轮询 + ResizeObserver 等待 `stable >= 2`），
而这个会话主线程饥饿（1200ms 内只画出 4 帧），第一次可读帧就晚了 100–180ms。
**cover 只能跟踪布局、不能预测布局** —— 上一期已确证：固定关键帧只要 `from` 取自任何瞬态就必然过冲
（实测 `matrix(1,0,0,1,-128,0)` 而非真实 `-74`，关栏方向过冲 +261px，扩了 `_scrollBody` gate 后降到 +54px）。

### 4.4 OPEN / CLOSE 的**不对称**（这是「闪烁」的来源）

| 臂 | 轨道写入 | 轨道 `transitionrun` | 轨道时长 | `_tabCell` transform | 正文列轨迹 |
|---|---|---|---|---|---|
| ON open | 1880.0ms | 1891.6ms (**+11.6ms**) | **0.001s** | **没有**（open 方向官方不给 transform） | 616 → 588 → 312 |
| ON close | 292.3ms | 443.9ms (**+151.6ms**) | **0.001s** | 有，300ms，起跑比轨道早 | 312 → 258 → 616 |
| OFF open | 296.9ms | 428.5ms (**+131.6ms**) | **0.3s** | 没有 | 616 → 318.2 → 312（单调） |
| OFF close | — | — | 0.3s | 有，300ms | 312 → 336 → 364 → 383 → 386（单调） |

> 更早一次探针（`.tmp-onset2.cjs`，同一会话）额外测到：
> ON close `transform@tabCell` 146.9ms → `grid@frame` 263.4ms（**晚 116ms**）；
> **OFF close** `transform@tabCell` 111.2ms → `grid@frame` 116.8ms（**只晚 5.6ms**，两次运行一致）。
>
> ⇒ **车主的第二个观察被精确复现**：关掉选项后 close 方向几乎同刻起跑（5.6ms），
> 打开选项后反而拉到 116ms。**即上一期的实现让 close 方向的不同步变差了。**

并且注意 **open 方向官方不给 `_tabCell` transform**，close 方向给 —— 官方自己的两个方向就不对称。

### 4.5 上一期已确证、本期必须继续遵守的结论

- **正文列自己的 `max-width` 会在轨道 snap 之后慢几帧**（640→748px），居中后布局边瞬态飞到 440px；
  旧固定关键帧 cover 正是从这个瞬态取值 → 过冲。**cover 必须跟踪布局。**
- `_scrollBody` 缓 `padding-right` 300ms，正文列按 `scrollBody width − padding-right` 居中 ⇒
  **只 snap 轨道会让两半不一致**，所以 gate 必须同时覆盖 `_frame` 和 `_scrollBody`（已做，close 过冲 +261 → +54）。
- 官方还有第三条布局过渡：`CSSTransition:right:300:/left:300:Dc7zOa_widthHandle`（与我无关，但会污染瞬态读数）。
- **`transition-duration: none` 是错的**：不发过渡事件。dsh-widgets 的导轨让步（`rail/measure.ts:120-246`
  的 `onTrackTransitionRun`，判 `propertyName === 'grid-template-columns'` + `isFrameElement` +
  8px 量化门，监听注册在 `measure.ts:618`）**读这个节拍**。必须用显式 **`0.001s`**。
  实测三个事件（run/start/end）在每个时长下都完整保留，propertyName 都是 `grid-template-columns`。
- **不能把导轨的 `transition: right` 改成合成层 transform**（v1.2.3 试过，导轨滑了而列卡住，
  回滚记录在 `rail.module.css:56` 的注释里）。
- **绝不给输入框或其任何祖先加 transform**（理由见 §3.3）。
- `prefers-reduced-motion` 假设已排除：`reduce:false`、`nopref:true`、`frameHasAnimating:false`。

### 4.6 参考几何（真实会话，导轨可见）

- idle：`prose {l 386, w 748}` / `composer {l 370, w 780}` / `rail {l 1247, w 460}`
- settled OPEN：prose 312 / composer 296，**恒定 16px 斜率差**
- `dx(open) = 74.3`、`dx(close) = −74.3`
- 合法轨宽（headless 1707×1067）：`280px 659px 768px`（开）/ `280px 1427px 0px`（关）
- 四臂 `rail.l` 必须**每帧恒 1247**（这是「不许漂移」的判据）
- 口径警告：`304px` 是 composer/centerCol 口径，**不是** prose 的 74.3px 口径，不要混用。

---

## 5. 下一期要做的实验（按顺序）

### 实验 A —— 名字先对上：到底该和谁同步？
`_tabCell` 的 `transform` 是官方右栏自己的滑动。**open 方向官方不给它**，
所以「完全同步」的正确参照可能不是 `_tabCell`，而是**用户感知的右栏出现时刻**。
- 用 `probe-panel-onset.cjs open/close` + `DSH_PANEL_GLIDE=off` 跑满四臂（实验 A 已完成，此条只作历史记录；
  `probe-sync-anchor.cjs` 已退役，见 §4 的选择器说明），
  记录 `_tabCell` 的**首帧可见变化**（`visibility`/`transform` 的 transitionrun + 逐帧 `tab.l`）。
- 判据：ON 与 OFF 两种情况下，右栏「看起来开始动」的时刻相对轨道写入的差值。

### 实验 B —— 让 cover **在点击当帧就起跑**
当前 cover 必须等布局可读（§4.3）。可试的方向（按优先级）：
1. **在 gate 里把正文列的布局也在同一次 recalc 定稿**，使第一次可读帧即终态，从而 `startCover` 能在
   点击后的第 1–2 帧就拿到精确 `from`（现在的瓶颈是「第一次可读帧」来得晚，不是「读得不准」）。
   检查：`_column` 的 `max-width` 现在 `tp: all / td: 0s`（无过渡）；真正慢的是父级宽度。
2. **乐观起跑 + 收敛**：点击当帧就用已知目标位移起一条关键帧 cover，同时保留 RO 跟踪；
   一旦读到真实布局就**用 `animation.currentTime` 对齐到真实轨迹**（而不是取消重建）。
   ⚠ 上一期明确否掉了「固定关键帧」的朴素版本（必然过冲），所以这一步必须带收敛机制，
   并且必须用「关栏方向绘制后廊道外 0 帧」这个判据验证（OFF 臂对照是 4 帧冲到 616px）。
3. **对齐时长**：`_tabCell` 是 300ms，cover 是 `max(300 - elapsed, 120)`。
   若 `elapsed` 已 ≈180ms，cover 只剩 120ms ⇒ 中栏明显「后发且更快」。
   考虑把 `MIN_COVER_MS` 提高，或在 cover 起跑前先**冻结**正文列的布局边（`position: relative` + 内联 `left`
   钉住 `before` 值），消除「等到能读」这段空窗的视觉位移。

### 实验 C —— 为什么 ON 让 close 方向的不同步从 5.6ms 恶化到 116ms
先判定这是**真实机制**还是**饥饿噪声**：
- 用**不饥饿**的会话（如 `修复侧边栏动画卡顿与覆盖效果1天`、`DeepSeek Design Resourses2天`）重复四臂；
- 同时记录每帧 `performance.now()` 间隔，给出 `maxGap`（上一期已把 `STARVED_GAP_MS = 200` 写进护栏）——
  若 `maxGap > 200ms`，`transitionrun` 的时间差不可作为判据，只能看 `transitionend.elapsedTime`。
- 若确认是真实机制，怀疑点在：**加 `enhc-instant` 会失效整个文档的样式**（`<html>` 上的类），
  可能与官方 React 的写入抢同一次 recalc。可试把 gate 放到**更窄的选择器**上
  （例如只作用于 `_frame` 自己的一个类，而不是整个 `<html>`），或改用
  `document.startViewTransition` 之外的等价物。

### 实验 D —— 掉帧（方向 2）继续压
上一期已确认瓶颈在**主线程 style/layout，不在合成层**：
- 独占 ms：主线程 busy R- 487.6 / R+ 431.5 / **B 987.0**；`UpdateLayoutTree` R- 201.9 / R+ 110.3 / **B 506.8**；
  `Layerize` 94.5/128.0/210.3；`FunctionCall` 106.7/88.9/98.5；`Paint` 33.4/41.7/71.3；`Layout` 26.1/30.1/67.9。
- 合成线程 B **0.6ms**、GPU 线程 B **0ms** ⇒ 不是合成/上传的问题。
- 每次回调归属（6 次开合，剔 fetch）：**官方 310ms · harmonizer 164ms · widgets 56ms · other 55ms · ambiguous 0**；
  ResizeObserver 321ms/96 次 → 官方 310ms。
- 剩余插件侧热点：`?@plugcombo:24520 ← shellRead@24520 ← measuredRightbarWidth@24311`（6 次强制布局）；
  以及 S 组 LoAF 热点 `VoidFunction:92ms | #document.ontransitionrun:65ms`（**这个 `ontransitionrun` 是我们自己的监听器被调的**）。

---

## 6. 护栏与门禁（每轮改动后必须全绿）

```powershell
cd D:\dsh-home\plugins\dsh-ui-harmonizer
npx tsc --noEmit                                     # exit 0
npm run build                                        # tsdown && tsc，会重建 lib/types/
node scripts/tools/css-baseline.mjs                  # 改了 CSS 就先加 --write 重录基线
node scripts/verify-frame-track.cjs    --session '<会话行>'
node scripts/verify-rapid-toggle.cjs   --session '<会话行>'
node scripts/verify/settings-page.cjs  --session '<会话行>'
```

- 上一期最终状态：`lib/client.js` **193988 B**、`.map` 257115 B、`lib/index.js` 533 B、`lib/types/**/*.d.ts` 41 个；
  `css.json` 的 `__combined = b5c223a8716ec174bca28e8e3a94579570663bb085582269ad8903ea3160fc2a`；两套护栏 12/12 与 25/25 PASS。
- `verify-frame-track.cjs` 的 12 项断言里有两项**因为饥饿而假失败**，已加 `STARVED_GAP_MS = 200` 与
  「先武装每帧轮询再改视口」的修正；看到 `longest frame gap …` 的提示是**预期**的，不是失败。
- 运行护栏需要**真实的会话行**（`新会话` 下 `_column`/`viewArea`/`rail` 全是 null）。
  当前可用会话行（会话列表会变，用前先跑一次
  `D:\dsh-home\plugins\dsh-widgets\scripts\.tmp-rows.cjs` 或直接在页面上看）：
  `新会话 / DeepSeek Design Resourses2天 / 进行中修复侧边栏动画卡顿与覆盖效果2分钟 / 修复侧边栏动画卡顿与覆盖效果1天 / Laya与RRSI必要性1天 / 修复侧边栏触发悬浮显示bug1天 / 请对DeepSeek Harness与DeepSeek V4.1 F1天`
  ⚠ 旧文档里的 `修复侧边栏动画卡顿` 这个子串**已经不存在了**。
- ⚠ **本文引用的 `.tmp-*.cjs` 分析脚本绝大多数已被清理**（一次性脚本按纪律删掉，只留数字）。
  它们是**历史证据的出处**，不是可再跑的工具：看到 `.tmp-xxx.cjs` 的结论请当作已记录的事实，
  不要再去找那个文件。仍存活的可执行工具只有：`scripts/verify-*.cjs`、`scripts/verify/*.cjs`、
  `scripts/tools/css-baseline.mjs`、`scripts/.tmp-rows.cjs`（查会话行），以及
  `D:\dsh-home\plugins\dsh-widgets\scripts\probe-*.cjs`。
- 已知的非回归（改动前后字节一致，**不是**我的回归）：
  `verify-rail-interaction.cjs` PASS=10 FAIL=4、`verify-rail-scroll.cjs` PASS=5 FAIL=4、
  `verify-deck-cascade-live.cjs` PASS=78 FAIL=3 —— 它们盲取第一行会话，FAIL 的含义是「不可测」。

### 6.1 rail drift 的责任方判定（长期探针，rail drift 复发时先跑它）

```powershell
cd D:\dsh-home\plugins\dsh-widgets
node scripts/probe-rail-drift.cjs both 25 130 9 3200   # ON/OFF 各 25 次 9@130ms storm
```

判据：`verify-rapid-toggle.cjs` 报 `the rail did not move` 时，看失败那一轮 rail 的
`getComputedStyle(rail).right`——仍是 anchor 表达式 ⇒ **上游 dsh-widgets 的 swallowed-rail race**
（本插件 inert 时 2/30、live 时 1/60，已定论；套件据此放行并在 detail 里注明）；已经 `0px` 却仍漂移
⇒ **我们的残留**，套件判定失败。该探针**不装任何钩子/采样器**，否则复现不出来。

---

## 7. 环境与硬约束

### 7.1 加载路径（构建后**不需要拷贝**）
`D:\dsh-home\profiles\{desktop,web,deskprobe,web2}\node_modules\dsh-ui-harmonizer`
全部是 **Junction → `D:\dsh-home\plugins\dsh-ui-harmonizer`**（profile `package.json` 里是
`"dsh-ui-harmonizer": "link:D:/dsh-home/plugins/dsh-ui-harmonizer"`，同目录还有
`"dsh-widgets": "link:D:/dsh-home/plugins/dsh-widgets"`）。⇒ **桌面端重新加载窗口即拿到新产物**。

### 7.2 环境事实
- 活 GUI：`http://127.0.0.1:19387`（无 cookie 探测返回 **401 未经授权** = 服务在跑）
- `DSH_HOME=D:\dsh-home`
- 桌面端 Electron 44.0.0 / Node 24.18.1；探针浏览器 Playwright Chromium 154.0.8037.0
- 性能舞台：headful 1707×1067 @ `deviceScaleFactor` 1.5（或 1），rows 7
- 探针可用库：`D:\dsh-home\plugins\dsh-widgets\scripts\diag-auth-lib.cjs`（`mintCookie(authority)`）、
  `scripts\lib\chrome.cjs`（`chromePath()`）、`scripts\lib\playwright-core.cjs`（`chromium`）
- 车主 prefs：`D:\dsh-home\profiles\web\dsh-widgets-state.json` 是 **`{savedAt, state:{...}}` 嵌套结构**
  （顶层不是 state，读法 `$j.state.railOpen`）；当前 `railOpen=True`、`panelPadding=10`、`panelWidth=601`、
  `installed=13`、`order=60`
- 探针若 PUT `/api/widgets-state`，**必须先读后写、跑完恢复车主 prefs**；PUT 要在 `browser.close()` 之后；
  点 `button.dsx-stats-capsule` 会把 `railOpen` 设成 false，这类探针**必须恢复 `railOpen: true`**；
  探针必须点一个会话行离开空态（`body.dsx-stats-no-session` 会让 `_column`/`viewArea`/`rail` 全 null）

### 7.3 文件与仓库硬约束
- **绝不修改官方 shell 一个字节**：所有修复只能活在插件里。官方 shell 路径
  `D:\Users\12404\AppData\Local\Programs\DeepSeek Harness\resources\app.asar\dsh\`
- **不得提交、不得回滚车主的未提交改动**：`D:\dsh-home\plugins\dsh-ui-harmonizer` 工作树共 55 项，
  其中车主自己的面含 3 个源码删除（`src/client/core/react/use-popover-position.ts`、
  `src/client/harness/controls/{icon-paths.ts,segmented-control.tsx}`）、42 个 `lib/types/**` 删除、
  20 个 `M`（`package.json` v0.9.0、`src/client/core/harmony/runtime.ts`、
  `src/client/harness/composer-and-menu.module.css`、`src/client/self/settings-controls.module.css`、
  `src/client/self/settings/font-selector.tsx`、`src/client/styles/index.ts`、`tsdown.config.ts` …）
  以及未跟踪的 `docs/dialog-window-style.md`、`docs/icon/`、`icon.svg`、
  `src/client/harness/controls/select-control.tsx`。
  **我可提交的面只有 §3.1 表里列出的那些。** HEAD `0a5dc12`，版本 v0.9.0。
- `dsh-widgets` 侧的 v1.8.4 工作**尚未提交**（HEAD 仍是 v1.8.3 `dbebb21`），等车主确认后再提交。
- 含非 ASCII 字面量的文件**只能用 edit/write 工具改**（每次 edit 会把文件重写成 CRLF；
  比对用 `git diff --ignore-cr-at-eol --stat`）。`README*` 必须是 **LF-only**。
- `ConvertFrom-Json` 读含中文的 `package.json` 会报「传入的对象无效」，用 `-Encoding UTF8` 或 `Select-String`。

### 7.4 探针写法教训（省时间）
- 注入的模板字符串里**绝不能含反引号**；`.tmp-cover3.cjs:95` 曾因此 `SyntaxError: Unexpected identifier 'left'`。
- `Performance.getMetrics` 需要先 `Performance.enable`。
- CSSOM 遍历必须判 `typeof r.selectorText === 'string'`。
- `node x.cjs 2>&1 | Select-String …` 因 Node 的 `[UNDICI-EHPA] Warning` 报 `[exit code: 1]` **不是失败**。
- `D:\dsh-home` 下 `Get-ChildItem -Recurse -Filter *.json | Select-String` 会命中几千个
  `storages\session_projcache\sessions\*.json`，**必须先排除这些目录**。
- `glob` 工具在 `D:\dsh-home` 下不可靠，用 `pwsh Get-ChildItem -Recurse -File`。
- **`[data-sidebar-right-expand]` 在「收起」状态是存在的**，用它的存在与否判开合状态会**方向反掉**
  （本期就踩了：首跑把 close 当成 open）。要用 `_frame` 的内联轨道第三列（`0px` = 收起）或
  `data-rightbar-collapsed` 属性判。
- 逐帧绘制采样在饥饿会话里会只剩 2–4 帧，**测 onset 请用 `transitionrun` 事件而不是绘制帧**
  （CSS transition 的 `transitionrun` 与是否画出帧无关）。

### 7.5 调查纪律（AGENTS.md）
- 复用既有探针脚本；同一 build 内一次浏览器回答同源问题；确证事实写进 ledger；
  一次性脚本用 `.tmp-*` 命名并清理，长期护栏放 `scripts/verify-*.cjs`。
- 阶段性结论、异常结果、切换方向之前走 `research_adversarial_review`，用独立 subagent 做对抗审查。
- 文件策略 danger-full-access，**不要设 `sandbox_permissions`**。

---

## 7.6 本会话实验记录（2026-10-05，OpenCode + 脚本实测）

四臂探针 = `probe-panel-onset.cjs`，会话 `Laya与RRSI必要性1天`，全部 `errors: []`、`parkedOK=true`。
证据 JSON 在 `D:\dsh-home\plugins\dsh-widgets\.probe-panel-onset\<label>.json`，外形是
`{url,session,direction,label,glideOff,errors,sessionRowIndex,noSession,park0,parked,parkedOK,result:{…}}`
—— **必须解 `.result`**；`result.iv.frames` 是唯一的「上一帧画了什么」口径（`setInterval(16)`），
`result.frames`（rAF）读的是 **layout**，插件后注册的回调排在探针之后。

### 实验 A/C 结论（已定论，不得重开）
- **open 方向官方右栏完全没有 `transform`**：4 个 open 臂 `tabTransform` 恒 `[]`，`_tabCell` 由 React
  在设置 `data-sidebar-right-open` 的**同一个 commit** 里一次性挂到终位矩形（`l=939 w=768`）；
  「面板 onset − 轨道写入」= **−0.2…−0.4 ms**。**close 方向相反**：`_tabCell` 的 300ms `translateX`
  比轨道写入**早 17–28ms** 启动。
- 实验 C 的「ON 让 close 恶化到 116ms」是**饥饿噪声**：免疫口径 `gridRun(event.timeStamp) − trackWrite`
  在全部 8 臂都是 **−2.7…−5.9ms**，ON/OFF 无系统性差异；OFF-close 臂里
  `grid-template-columns@frame` 与 `transform@tabCell` 的 `startTime` **完全相同**。
  饥饿判据：`maxGap > 200ms` ⇒ 时间差不可作判据，只能看 `transitionend.elapsedTime`。
- ⇒ 两条免疫量必须优先：`event.timeStamp`（`et`）与 `getAnimations().startTime`；
  MutationObserver 的 `t` 只是上界（实测派发延迟 25ms 空闲 → 173.1ms 饥饿）。

### 本轮根因 1：「先闪烁后平移」= 已删除的 `pin`/`hold`
旧实现的 `hold()`/`pin()` 在轨道 snap 后把视觉边**钉回** `before`（616px，偏移 +304px），
再跑 `duration = max(300 − elapsed, MIN_COVER_MS=120)`。`pin`/`hold`/`MIN_COVER_MS`/`HOLD_CAP_MS`
**已全部删除**；现在始终从**同一帧的 seed** 起跑完整 `COVER_MS=300`。

### 本轮根因 2（决定性）：`0.001s` transition 让布局延后一帧
隔离实验 `.tmp-td.cjs` / `.tmp-td2.cjs` / `.tmp-settle.cjs`（700px→200px 宽度）：

| transition | 写值那一 task 内 `getComputedStyle`/GBCR | 下一帧 | 事件 |
|---|---|---|---|
| `width 0.001s` | **700px（旧值）** | 200px | run/start/end(0.001) |
| `width 0s` | **200px（新值）** | 200px | **无** |
| `0.001s` + 负 delay / `0s` + 正 delay / `0.016s` | 均延后一帧 | | |

⇒ 面板的滑动（`transform`/keyframe）不需要 layout，在写轨道那个 rendering step 就启动；
而 frame 轨道被 0.001s transition 推到**下一个** rendering step，
所以 cover 的 `startTime` 晚一帧（该线程一帧实测 ≈100ms）。
⇒ 修复前 `tabCell` startTime = clickAt+94.6ms，`column`/`card` = +219.8ms（差 125ms）。

### 落地改动 1：`settleTransitions`（保留 transition，但在写入的微任务里 finish）
不能改 `0s`（会失去 transition 本身 → dsh-widgets 的 rail yield 退化为 240/520ms 轮询，
`measure.ts:161-167` 读的正是 frame 的 `transitionrun`）。
- `instant-track.ts` 新增 `SCROLL_SELECTOR`、`SETTLE_SELECTOR = \`${FRAME_SELECTOR},${SCROLL_SELECTOR}\``、`SETTLE_MAX_MS = 2`。
- `settleTransitions(hosts): number`：`host.getAnimations()` 里 `instanceof CSSTransition` &&
  `playState === 'running'` && `effect.getTiming().duration` 是 number 且 `<= SETTLE_MAX_MS` 才 `finish()`。
  `.tmp-settle3.cjs` 证明 `finish()` 后**同一 task 内** `getComputedStyle` 即新值；
  `.tmp-settle4.cjs` 证明 `transitionrun@et`/`transitionstart`/`transitionend(el=0.001)` **全部照发**，
  且 `et` 与不 finish 时一致。整帧 300ms 的产品 transition 不会被误伤（`SETTLE_MAX_MS=2`）。
- `mountInstantTrack()` 新增 `settleMo`，观察 `frame` + `scrollBody` 的 `attributeFilter:['style']`；
  `settled > 0` 才 `armAll()`（无 gate 命中的投递不得抢跑；`armAll` 幂等）。
- **实测（fix8 build）**：`fix8-open` 三个动画（`tabCell` keyframe / `column` / `card`）
  `startTime` **完全一致 = clickAt+155.1ms**；`fix8-close` 四个（tabCell transform、tabCell visibility、
  column、card）**完全一致 = clickAt+183.1ms**。

### 落地改动 2（方向② 掉帧）：gate 由 `<html>` 的 class 改成属性
`core/harmony/runtime.ts:87-89` 的 themeObserver 观察 `<html>` 的
`['class','data-ds-dark-theme','data-ds-theme-source']`，回调是 `refreshMaterial()`
（`getComputedStyle(document.body)` + 若干读写）。**实测 `.tmp-h4cost.cjs`**（同页面，
20 次 class add/remove vs 20 次 `setAttribute`，背靠背同一 task）：
**class 6.74ms 均值 / 9.6ms 最大，属性 0.02ms 均值**（40 次 269.4ms vs 20 次 0.4ms）。
两次调用都在**捕获阶段点击处理器**里、产品写轨道之前 ⇒ 每次开合白付 ~13ms 在提交前关键路径上。
- `INSTANT_CLASS='enhc-instant'` → **`INSTANT_ATTR='data-enhc-instant'`**
- `OPENING_CLASS='enhc-opening'` → **`OPENING_ATTR='data-enhc-opening'`**
- `frame-column-transition.module.css:104-105/145` 选择器改为
  `html.enhc-panel-glide[data-enhc-instant]` / `html.enhc-panel-glide[data-enhc-opening]`（`[data-enhc-instant]` 属性存在选择器）。
- `core/apply.ts:81` 的 dispose 改为 `removeAttribute` 两个属性。
- `enhc-panel-glide` **保持 class**（每次设置变更才写一次，不是每次开合两次）。
- 同步更新：`scripts/verify-rapid-toggle.cjs`（新增 `opening` 残留学断言，25→26 项）、
  `scripts/verify-frame-track.cjs` 注释。
- **实测（h4 build）**：`h4-open` 三个动画 `startTime` 相同 = clickAt+140.2ms；
  `h4-close` 四个相同 = clickAt+259.7ms；漆面轨迹单调无越界
  （open 616 → 312，close 312 → 616，`pTr` 起手 ±304 后收敛）。
- **代价口径（`.probe-realcost.cjs`，headful 1707×1067）**，**必须按「同 build 内 ON/OFF 对照」读**，
  **不得**拿跨 build 的 ON 绝对值做因果：

| 样本 | TaskDuration ON | RecalcStyleDuration ON | RecalcStyleCount ON | ScriptDuration ON |
|---|---|---|---|---|
| 改动前 5 次 | 0.28178 | 0.07292 | 222.6 | 0.00918 |
| 改动后 5 次 | 0.27052 | 0.06718 | 216.8 | 0.00892 |
| 改动后 15 次 | 0.32749 | 0.07727 | 220.4 | 0.02366 |

  同 15 次样本的 OFF 对照：`0.34151 / 0.11072 / 246.47 / 0.02948`。
  ⚠ **跨 build 的 ON 绝对值差（0.2818 → 0.2705）落在噪声内**（同 build 内 5 次 vs 15 次自己就差 0.057s），
  **本轮第 3 条结论只能由那条隔离机制测量（6.74ms vs 0.02ms）支撑**，
  端到端数字只作「同一轮内 ON 不比 OFF 差」的方向性参考。
- **h4 build 护栏实测**：`verify-frame-track.cjs` 12/12 ALL CHECKS PASSED；
  `verify-rapid-toggle.cjs` **26/26** ALL CHECKS PASSED（新增第 6 项「the opening gate released」，
  另 3 个 storm 各多一项）；`css-baseline --write` 后复跑 PASS，
  `css.json` sha256 = `35d45cc9b4b87a98e2a0f5d835e0f4cbc244c950f0bd9f7b9c449de0ff89fc07`。

### 本轮发现的**新口径缺口（未修，需下一期决策）**
cover 只托住 `left`，**宽度**在同一帧瞬跳：open 方向 `_column[l=616 r=1364 w=748] →
[l=616 r=1204 w=588]`，**右边缘瞬移 −160px**。
同一会话 OFF 臂**同样存在**（产品自身行为，非 gate 引入）。`transform` 改不了宽度；
若要覆盖需换 `max-width`/`width` 的 WAAPI，或接受该跳变。
⚠ **该缺口「引起文本重排」的说法已被证伪，不要沿用**（2026-10-05 复测，`.tmp-reflow.cjs`）：
逐 16ms 采 `_column` **及其最高后代**（遍历全部后代取 GBCR 高度最大者，实测
`xz4KEq_flowItem`，高 9424.5px）＋ `col.parentElement.scrollHeight` ＋
`documentElement.scrollHeight`，一次 open 全量：

| 采样 | `_column` | 最高后代 | scrollH | docH |
|---|---|---|---|---|
| `t=511` | `[l=616 w=588]` | `[l=616 w=588 h=9424.5]` | 24374 | 1067 |
| `t=621.4` | `[l=312 w=588]` | `[l=312 w=588 h=9424.5]` | 24374 | 1067 |

⇒ **宽度瞬跳不改变任何块的高度、不改 `scrollHeight`、不改文档高**，即
**不触发文本重排**：`748 → 588` 是右侧空白留白的增减（这块会话的正文受
`--dsh-chat-user-width` 约束、宽度本来就 ≤588），视觉上只有列的**左边缘**在动，
而左边缘正是 cover 托住的。这条修正把该缺口从「可见缺陷」降级为「无可见后果」，
`transform`/`left` 覆盖方案**仍然正确且够用**，不需要换 `width`/`max-width` 的 WAAPI。

### Guardrail（h4 build，全绿）
- `npx tsc --noEmit` exit 0
- `npm run build` exit 0 —— `lib/client.js` **207448 B**（fix8 205790 / 上上轮 200594）、gzip 59.99 kB、`lib/index.js` 0.53 kB
- `node scripts/tools/css-baseline.mjs --write` 重录后复跑 → `PASS — the concatenated stylesheet is byte-identical`；
  `css.json` sha256 = `35d45cc9b4b87a98e2a0f5d835e0f4cbc244c950f0bd9f7b9c449de0ff89fc07`
  （上一轮 `6e4a172221d646749845d243db662302e1ad79ac795cd41d41a873681a20c401` / 再上轮 `b5c223a8…`）
- `node scripts/verify-frame-track.cjs --session 'Laya与RRSI必要性1天'` → 12/12 `ALL CHECKS PASSED`
- `node scripts/verify-rapid-toggle.cjs --session 'Laya与RRSI必要性1天'` → 26/26 `ALL CHECKS PASSED`
- `node scripts/verify/settings-page.cjs --session 'Laya与RRSI必要性1天'` → 重写 `general-page.json`/`.png`

### 环境修正（本轮新增，重要）
- dsh-widgets 的 `verify-rail-interaction.cjs` / `verify-rail-scroll.cjs` / `verify-deck-cascade-live.cjs`
  **默认打 `http://127.0.0.1:3080`**（`PORT = process.env.DSH_PORT || '3080'`），**该端口当前 DOWN**。
  必须 `$env:DSH_PORT='19387'`。即使用 19387，前两个仍报适配性 FAIL
  （`detents=0` / `no session row matching`），**是探针自身在 19387 上的适配问题，不是动画回归**。
- 改用 live-GUI 的两个套件时**必须显式给 `--session`**：`verify-rail-stacking-20.cjs` 默认
  `dsh-widgets 组件生态调研`、`verify-swallow-20.cjs` 默认 `dsh-widgets`，两者都不在会话列表里
  ⇒ 报 `FAIL no session row matching`。加 `--session 'Laya与RRSI必要性1天'` 后 `verify-swallow-20.cjs`
  `ALL CHECKS PASSED`。
- `verify-rail-stacking-20.cjs` 的 3 条 `[counter-proof]` 需要**非零 `--dsx-rail-scroll`**；
  本会话导轨可滚范围仅 16px（`clientHeight 1036 / scrollHeight 1052`）、滚轮推 340px 后 `scrollTop` 仍 0，
  legacy 规则 `top: calc(var(--dsx-rail-top) - var(--dsx-rail-scroll))` 因此塌缩、与修复版等价。
  **换有长历史的会话才有意义，调参数无效。**
- `probe-panel-onset.cjs` 新增 `DSH_HEADFUL=1` 开关（默认 headless）。
- 分析脚本 `.tmp-arms.cjs`（已清理；当时用法 `node .tmp-arms.cjs <label>...`，打印 anims/events/writes/iv16 轨迹）。

### 同步的**定量判据**（本轮新增，比 startTime 更强）
`startTime` 相同只证明「同时起跑」；要证明「同一条曲线」，必须比**归一化进度**。
用 `iv.frames`（唯一 paint 口径）算：
- 中栏进度 = `(304 − pTr.tx) / 304`（open；close 用 `(pTr.tx + 304) / 304`）
- 右栏进度 = `(768 − dockTr.tx) / 768`（open；close 用 `dockTr.tx / 768`）

**h4-open / h4-close / fix8-open / fix8-close 四臂，每一个绘制帧上两个进度都相同到小数点后 3 位**
（例：h4-open `t=208.8` 两者 0.151、`t=237.5` 两者 0.371、`t=327.3` 两者 0.877；h4-close `t=382.1` 两者 0.547）。
⇒ 两段运动的**距离不同（304px vs 768px）但归一化进度完全一致**，即同曲线、同时长、同起点。
分析脚本 `.tmp-corridor.cjs`（临时）。

### 本轮（对抗审查后）修复项落地 —— 六条全部完成

对抗审查（独立 subagent，审查包 `D:\Users\12404\Documents\DeepSeek-Harness\RESEARCH_REGISTRY\review\20261005_005.json`）
判定：根因 1（pin/hold）✅ 支持、`settleTransitions` ✅ 支持（附 2 条必修）、
gate class→属性 ⚠️ 机制对但归因不精确（真正成本是「根元素 class 变更 ⇒ 子树样式失效」，
被 gate 命中的属性写入同样要付 ~7ms，只是顺延到下次 recalc）、
`SETTLE_MAX_MS=2` 无误伤 ✅、`startTime` 口径 ⚠️ 强度过高（不覆盖宽度）、旧类名错配 ✅ 干净。

审查员的六条必修项与落地：

1. **`release()` 会在 glide 结束前摘 gate ⇒ open 可见跳变**。证据 `.tmp-rev-glide2.cjs`：
   `animationstart` 在 click+265ms、gate 在 click+438ms 被摘，glide 只到 `currentTime 254.7/300`（84.9%）
   就被 `animationcancel`（全程无 `animationend`），dock 从 `translateX(10.35px)` 直跳 `none`；
   `.tmp-rev-truncate.cjs` 独立复现（FORCED 臂 `80.5 → none`）。
   **修法**：`release()` 不再按 `HOLD_MS` 摘 gate，改为「仍在动就继续等」——
   `const moving = covers.some((cover) => cover.busy()) || slideRunning()`，配合
   `releaseDeadline = performance.now() + HOLD_MS + RELEASE_MAX_WAIT_MS(400)` 硬上限。
2. **`release()` 未调用 `releaseCovers()`** ⇒ 已在落定分支先 `releaseCovers()`（顺带 disconnect
   `motionRo` 与 `settleMo`）再摘 `OPENING_ATTR`。
3. **删死常量 `SETTLE_SELECTOR`**（只保留 `SCROLL_SELECTOR`）。
4. **`settleTransitions` 空 catch 不可观测** ⇒ 改为一次性
   `console.info('[dsh-ui-harmonizer] the panel-glide gate could not be settled:', error)`（模块级
   `settleFailureReported` 去重）。
5. **`SCROLL_SELECTOR` 注释与实测不符** ⇒ 注释改为「该规则在实测会话里是**惰性的安全网**，
   不是抓到过缓动」：22 臂里 `scrollBody` 的 `padding-right` 恒 `0px`、从未记录到
   `padding-right@scrollBody` 事件、settle 微任务里 `scrollBody.getAnimations()` 为空。
   纳入 gate 是为「产品将来真的开始缓动这一段 padding」的保险——那种情况下轨已 snap、
   padding 未到，列心会瞬态越界到 x=647。同时标明：**早前那条 +261px 过冲无法由当前证据解释**
   （padding 恒定时不可能是它造成的），原因仍未定论，首要嫌疑是那个 build 还带着的
   `pin`/`hold` cover（它把绘制边重钉到陈旧的 `before`）。
6. **宽度瞬跳的归因** ⇒ 见上一节（证伪「文本重排」）。

新增的机制部件（`instant-track.ts`）：`DOCK_SELECTOR`、`OPENING_ANIMATION='enhc-panel-glide-in'`、
`RELEASE_MAX_WAIT_MS=400`、`RELEASE_POLL_MS=16`（原 60）、`Glide.busy()`、
`slideRunning()`（读 dock 的 `getAnimations()` 里 `CSSAnimation.animationName === OPENING_ANIMATION`
的 `playState`——`fill:'both'` 会让已完成的动画仍在列表里，必须读状态；dock 为 `null` 视为
「commit 还没跑，继续等」）。

**`RELEASE_POLL_MS` 60→16 的量化效果**（`.tmp-reldiag.cjs` / `.tmp-animend.cjs`）：
60ms 时 gate 摘除比 `animationend` 晚 calm 72.6ms / starved 237ms；改 16（一帧）后
`rel2-open` 的 `animationend t=517.2` vs `data-enhc-opening` 摘除 `t=527.1` ⇒ **tail ≈10ms**。

### 审查最后一条收尾（本轮 build）：`getAnimations()` 的空 catch 也要可观测

`settleTransitions` 里读 `host.getAnimations()` 的 `catch` 原本是空的 `continue`。与 `settleFailureReported`
同理：读失败会让 1ms transition 自行 settle，症状只是动画又晚一帧且无任何解释。已改为模块级
`settleReadFailureReported` 去重 + 一次性
`console.info('[dsh-ui-harmonizer] the panel-glide gate could not be read:', error)`。
至此**六条必修项 + 这条只读路径的观测缺口全部关闭**。`release()` 调 `releaseCovers()`、`SETTLE_SELECTOR`
删除均已复核在盘（`grep` 无命中）。

### Guardrail（h4 build —— 六条修复项落地时）

- `npx tsc --noEmit` exit 0
- `npm run build` exit 0 —— `lib/client.js` **214.70 kB**（h4 207448 B / fix8 205790 B / 上上轮 200594 B）、
  gzip 62.45 kB、`lib/client.js.map` 282.52 kB、`lib/index.js` 0.53 kB
- `node scripts/tools/css-baseline.mjs` → `PASS — the concatenated stylesheet is byte-identical`
  （29 sheets，combined 18693 B `f876a98ebbced4d9`，本轮 CSS 未改）
- `node scripts/verify-frame-track.cjs --session 'Laya与RRSI必要性1天'` → **12/12** `ALL CHECKS PASSED`
- `node scripts/verify-rapid-toggle.cjs --session 'Laya与RRSI必要性1天'` → **26/26** `ALL CHECKS PASSED`
  （三个 storm：9@130ms / 15@60ms / 5@400ms，各含 `the instant gate released` 与 `the opening gate released`；
  `the transcript edge is consistent — prose 312 composer 296`；`the page logged no errors`）
- `node scripts/verify/settings-page.cjs --session 'Laya与RRSI必要性1天'` → 重写 `general-page.json`/`.png`
- 本 build 探针：`rel2-open` `clickAt=6399.2` rAF=299 maxGap=187.3 `iv.maxGap=225`、`parkedOK=true`、`errors: []`；
  漆面 `t=224.0 pL=616 pW=588 pTr=+304 dockTr=768` → … → `t=526.2 pL=312 pTr=none`，**单调无越界**。
  `rel2-close` maxGap=269.5（>200ms，该臂时序判定降级）。

### Guardrail（当前 build，全绿）

- `npx tsc --noEmit` → `TSC_EXIT=0`
- `npm run build` → exit 0 —— `lib/client.js` **215.33 kB** │ gzip **62.61 kB**、
  `lib/client.js.map` 283.41 kB │ gzip 86.57 kB、`lib/index.js` 0.53 kB
  （h4 214.70 kB ⇒ 本轮 +0.63 kB，即上面两处一次性 `console.info` + 注释）
- `node scripts/tools/css-baseline.mjs` → `PASS — the concatenated stylesheet is byte-identical`，`CSS_EXIT=0`
  （CSS 未改，符合预期）
- `node scripts/verify-frame-track.cjs --session 'Laya与RRSI必要性1天'` → **12/12** `ALL CHECKS PASSED`，`FT_EXIT=0`
  （`opening SNAPS the center track — 2 distinct widths: [1640,776]`；两次
  `the covers do not move the rail — rail drift 0.0px`；`with the option off the track eases again —
  7 distinct widths over 864px, transition-duration "0.3s", longest frame gap 95ms`）
- `node scripts/verify-rapid-toggle.cjs --session 'Laya与RRSI必要性1天'` → **28/28** `ALL CHECKS PASSED`，`RT_EXIT=0`
  （项数 = 3 storms × 9 + 1；此前记录里的 26 项是当时脚本的打印，本轮套件在每 storm 里同时断言
  `the instant gate released` 与 `the opening gate released`。三个 storm 全 `the rail did not move — 0px`、
  两个 gate 均 `released`、`no cover still running — []`、
  `the track settled on a legal edge — 280px 659px 768px`、`prose 312 composer 296`、`the page logged no errors`）
- `node scripts/verify/settings-page.cjs --session 'Laya与RRSI必要性1天'` → `SP_EXIT=0`，重写
  `docs/architecture/baseline/general-page.json` + `.png`
- dsh-widgets 侧非回归：`node scripts/verify-swallow-20.cjs --session 'Laya与RRSI必要性1天'` → `ALL CHECKS PASSED`；
  `node scripts/verify-rail-stacking-20.cjs --session 'Laya与RRSI必要性1天'` → 7 条 fixed 全 PASS，
  3 条 `[counter-proof]` FAIL（脚本前置条件，见下节）；`verify-rail-interaction.cjs` 硬编 `127.0.0.1:3080`
  ⇒ `ERR_CONNECTION_REFUSED`（环境，非代码；live GUI 是 19387）

### rail drift（**定论：dsh-widgets 自身的既有 race，不是本插件的账**）

`verify-rapid-toggle.cjs` 曾偶发 `9 clicks @130ms: the rail did not move — 768px`。失败签名：rail 跑到 `l=479`、
`getComputedStyle(rail).right === "768px"`（它按面板宽让开，站到了面板左侧）；正常应为 `l=1247`、`right:"0px"`。
失效时我们的残留全为 0：`residue = {proseInline:null, composerInline:null, instant:false, opening:false, htmlClass:"enhc-panel-glide", covers:[]}`。

**责任方判定**（无侵入计数器，已长期化：`D:\dsh-home\plugins\dsh-widgets\scripts\probe-rail-drift.cjs`，
用法 `node scripts/probe-rail-drift.cjs <on|off|both> [storms] [gap] [clicks] [settle]`，默认 `both 25 130 9 3200`）。
它**故意不钩 `setProperty`、不装采样器**（两者都会在判定帧里强制 layout/抓栈，钩子版 0/8 复现不出），
只在 storm 结束后读一次状态：

| 臂 | storms | drift | 说明 |
| --- | --- | --- | --- |
| `on` | 30 | 0/30 | 插件 live |
| `off` | 30 | **2/30** | 摘掉 `enhc-panel-glide` ⇒ capture handler 早退，无 gate、无 cover |
| `on` | 60 | 1/60 | 加测 |

⇒ OFF 臂反而更易复现。逐帧追踪（一次性脚本，已删）显示失败轮里 `--dsx-rail-right` **整轮停在 anchor 表达式**
（`applyRailRight` 从未被以 `swallowed=true` 调用），而成功轮写 `0px`；同一 arm 同一 build 内交替。

机制在 dsh-widgets 侧，未改其代码（其 worktree 有未提交改动，非本轮授权）：可疑早退点是
`src/client/rail/measure.ts:213-214` 的 8px 量化早退（`current >= 0 && |next-current| < 8 ⇒ return`），
或 `geometry.ts:524` `panelW = Math.max(readTargetRightbarWidth(), measuredRightbarWidth())` 在那一次读到 0
（`readTargetRightbarWidth` 的 `metricCache` 陈旧，或该刻第三轨仍是 `minmax(0px, 0px)`）。

**判据已加固**（`scripts/verify-rapid-toggle.cjs`）：`geo()` 增记 `railRight`，新增
`railClaimStuck = after.geo.railRight !== '0px'`、`upstreamRailRace = railMoved && railClaimStuck`；
检查行改为 `!railMoved || upstreamRailRace`，命中时 detail 注明「upstream swallowed-rail race…」。
**只有 rail 已 claim `0px` 却仍漂移才是我们的账。**

### `verify-rail-stacking-20.cjs` 的 3 条 counter-proof 失败（判为脚本前置条件，非回归）

7 条 fixed-build 断言全 PASS；3 条失败全在 `[counter-proof]`，且共同前置是 **rail 必须可滚动**
（legacy 规则 `.dsx-magnify-layer { top: calc(var(--dsx-rail-top,0px) - var(--dsx-rail-scroll,0px)) }`
靠非零 `--dsx-rail-scroll` 才会把 overlay 抬到 rail top 之上）。实测（一次性脚本，已删）：
`clientHeight 1036 / scrollHeight 1052` ⇒ **可滚范围仅 16px**，`scrollTop` 峰值 2，`--dsx-rail-scroll` 峰值 `2px`，
滚轮推 340px 后 `scrollTop` 仍是 0。该会话里 calc 塌缩成 `--dsx-rail-top`，与修复版规则等价 ⇒ counter-proof 必然失败。
本插件在该通道零写入（无 `--dsx-rail-scroll`、无 `.dsx-magnify-layer` 规则、无 nav z-index）。**改参数无效，需换有长历史的会话。**

### 残留的可见缺口（未修，下一期决策）
1. **宽度瞬跳（已降级为无可见后果）**：cover 只托住 `left`，`_column` 宽度在 cover **起跑那一帧**
   就瞬跳 `748 → 588`（open）/ `588 → 748`（close），右边缘瞬移 −160px；composer 胶囊同理 `780 → 620`。
   **同一会话 OFF 臂同样存在**（产品自身行为，非 gate 引入）。
   `.tmp-reflow.cjs` 复测证伪了「文本随之重排」：最高文本块高度恒 9424.5、`scrollHeight` 恒 24374、
   文档高恒 1067（明细见上一节），该瞬跳只是右侧空白留白的增减，视觉上只有左边缘在动而左边缘已被托住。
   `transform` 改不了宽度，但也**不需要**改；换 `width`/`max-width` 的 WAAPI 属可选优化，不是缺口。
2. 四臂 `iv.frames` 里**没有任何一帧落在走廊 `[312, 616]` 之外**（`.tmp-corridor.cjs` 全臂验证），
   且两端点后无回退 —— 「先闪烁后平移」的判据已经满足。

---

## 8. 遗留的其它目标（不要丢）

- ① 对话区平移延迟/卡顿（m00001）—— **本期主战场**
- ② 组件区悬浮动画不流畅（m00001）—— 疑似指针采样/帧率上限（H3 3 laps/s：p50 20.9、p95 62.5、over26 26）
- ③ 侧栏开合时组件区异常缩放（m00001）—— **已修并验证**
- ④ `dsh-widgets: import failed` / `Uncaught SyntaxError` 复现（m00001）—— 一次性，无新日志
- ⑤ 「组件区域在未激活状态下切换工作区对话后会自动显示在页面顶部」（m01465）—— **已修并验证**
- ⑥ 右栏开合诊断（m02886）—— 证据链已闭环，两份 7 段 DIAG 报告在
  `D:\dsh-home\plugins\dsh-widgets\docs\verify-report3\`；执行项 = 本文件。

---

## 9. 顶栏收尾（2026-10-05，本轮落地）—— 顶部栏平滑 + 空间不足渐进隐藏

### 9.1 车主指令（m02122）
①顶部栏的菜单内容与右侧按钮要**像中栏一样平滑移动**（现在是直接变化）；②空间不足时**不得挤压文字换行**；
③按「标准模式 → 智能体团队 → 子智能体」**渐进隐藏**，空间足够再恢复；④改完归档本次对话。
本轮把①②③全部落地并新增门禁；④由本文件承接。

### 9.2 平滑：根因 = header 不在 cover 宿主里，且它的几何是「宽度」不是「位移」
- 父链：`div[slot=conversation.header]`(contents) → `div.Dc7zOa_root`(flex, **overflow:hidden**)
  → `div[slot=main.conversation]`(contents) → `div[slot=main]`(contents)
  → `div.BynINW_centerCol`(**overflow:hidden**) → `div.BynINW_frame`(grid, overflow:hidden)。
  上一期唯一的 cover 宿主帅 `[class$='_column']`（正文列）**不含** header ⇒ header 没有 cover。
- 逐帧实测（1707×1067，三徽标会话开栏）：+268ms 一次性到位，其后 400ms 里 `_headerUtilities` 与 tabs 的
  `left` **一次都没变**，而正文列在 +483..684ms 缓动 `509.1 → 312`。这正是「顶栏直接变化」。
- header 的 **left 恒为 280**（钉在左列），右边缘 `1707 → 939`：变化量是**宽度**。位移托不住宽度。
  决定性实测：开栏状态下把 `header.style.width` 写回关闭值（1427px），关闭态被**逐项复现** ——
  header `280,1427,50`、标题列 212px、tabs `867.5,139,26`；对照开态 `280,659,78` / 41.5px / `697,87,58`。
- 落地：`src/client/harness/chrome/instant-track.ts` 新增第三种 cover 属性 `'width'`，与 `left`/`transform`
  共用同一条 driver / reseat / release 路径；capture 阶段读 header 宽度，`armAll()` 里
  `arm(header, 'width', headerBefore)`，并把 header 也交给 `motionRo` 与 rAF 轮的 `moved` 判据。
- `width` 模式**刻意不建 reseat RO**（已写进代码注释）：`width` 的远端点就是布局宽度本身，没有 identity
  端点可供反解（`painted - (1-progress)*keyFrom` 那套算法只会解出自己写进去的值）。安全性来自
  `settleTransitions` 已在点击同一任务里把轨道落定；万一真取到旧值，`from < 0.5px` 直接不建 cover ——
  失败模式是「这一次不平滑」，不会画错。
- 实测：开栏 **12 个不同绘制宽度**（另一次 18）`1427 → 659`，关栏 22（另一次 27），首帧即关闭宽度。

### 9.3 换行：不是徽标挤的，是 tabs 被压到换行
- 产品给 tabs 的是独立一行布局（`gap:36px; margin-top:10px; padding-left:8px`），client 半边把它搬进
  30px 的 titleRow；搬进去时它带的是 `flex: 0 1 auto` + `min-width: auto`，而 `_titleCluster` 是
  `flex:1 1 0% / min-width:0` ⇒ 窄顶栏先压 tabs，tabs 内部再压胶囊标签，标签换行 ⇒
  strip `26 → 58`、header `50 → 78`。**这就是车主说的「挤压文字换行」。**
- 修复只有一条：`session-header.module.css` 的 `[class$='_titleCluster'] > [class$='_tabs']` 加 `flex: none;`。
  亏空全部落到 `_crumbs`（产品本来就给了 `min-width:0; overflow:hidden`）。
- 实测：1707/1440/1280/1152/1024 × open/closed **十臂** strip 恒 `139×26`、header 恒 50px；
  两次真实开合的**每一帧**（57 / 69 帧）strip ≤26、header ≤50。
- **单靠隐藏徽标解决不了换行**：徽标与 tabs 是同一行的独立 flex item，藏一个只是把宽度让给 crumbs ——
  实测只隐「标准模式」strip 仍 58px（收益 0）。两条规则是一对，缺一不可。

### 9.4 渐进隐藏：顺序、判据、识别
- 新文件 `src/client/harness/header-fit.ts`。阶梯是**有序前缀**：rung n = 前 n 个徽标隐藏，
  整个状态就是一个整数，重算幂等。
- 顺序 `RANK = {preset:0, team:1, subagent:2, other:3}`（`other` 兜底、最后才花，今天就是
  「N 个后台任务运行中」）。
- 判据**实测而非算术**：先应用候选 rung，再读 `_crumbs.clientWidth`，直到 `≥ TITLE_FLOOR = 160px`。
  理由是徽标宽度不是常量：产品自己的 `@container` 会在 row ≤540px 时把「标准模式」标签清零、
  ≤480px 清零「智能体团队」标签，后台任务计数还随任务数变宽。`TITLE_SLACK = 24px` 迟滞防边界抖动。
- 识别**只按属性**：可见文案是运行时 locale 查表（整个 asar 里中文字面量 0 处，原文与 `\uXXXX` 都没有），
  类名带构建哈希 ⇒ 子智能体用 `[aria-haspopup="tree"]`、智能体团队用 `[data-team-action]`、
  标准模式是 seat（`[data-slot='conversation.session.header.actions']`，`display:contents`）里唯一的 `span`。
- 实测（参考会话开栏）：标题 **0px → 165px**，3 个徽标隐 2 个（标准模式 + 子智能体）；
  开栏过程中 rung 单调不减（56 帧无回退）；关栏恢复全部 3 个与标题满宽 212px。
- 触发器：titleRow 的 `ResizeObserver`（宽度）+ seat 的 `MutationObserver`
  （childList/subtree/characterData，**不含 attributes** ⇒ 不会自己喂自己）+ 一个 document 级 MO，
  只在被绑定节点 `isConnected` 变假时重新解析（稳态成本 = 一次布尔读）。

### 9.5 约束与风险（必须记住）
- `Dc7zOa_root` 与 `BynINW_centerCol` 都是 `overflow:hidden`，裁剪边就是面板的静止左边缘（开栏时 939px）。
  因此**开栏方向**：凡是被 cover 托在旧位置、且旧位置 >939px 的内容都会被裁掉，观感是「从右边缘滑入」，
  不是从旧位置平移过来；**关栏方向无此裁剪**（裁剪边已回到 1707），是完整平移。
  这与正文列 cover 的既有行为一致（它同样被裁），不是本轮引入的缺陷。
- 本轮**没有**给 header 或任何 header 宿主加 `transform`：`@deepseek-ai/dsh-experimental-client-ui-agent-team`
  的 `.EBLgjq_panel` 是 `position:fixed`（只在团队弹层打开时挂载），祖先一旦有 `transform` 就会改写其
  包含块。`width` 不建立包含块，这条风险不存在。
- `TITLE_FLOOR = 160` 是**地板不是目标**：窗口极窄时（面板开、header 仅 400px）把徽标全花完也只换来
  58px 标题，此时停在最后一档、接受挤压。

### 9.6 门禁
- 新增 `scripts/verify-header-fit.cjs`（**14 项全绿**）：关闭基线 / 阶梯顺序与徽标集合 / 开栏 ≥5 个不同
  宽度且首帧≈关闭宽度 / **整段开合无换行帧** / rung 单调 / 落定态前缀 + 地板 / 关栏全恢复 /
  四个宽度两种面板态尺寸 / 无残留属性 / 无 page error。
- `node scripts/tools/css-baseline.mjs --write` 已更新 `docs/architecture/baseline/css.json`
  （`session-header.module.css` 828 → 906 B），复检 byte-identical。
