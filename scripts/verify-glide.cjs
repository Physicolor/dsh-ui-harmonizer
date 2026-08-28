// Verify the content-visibility approach: the original smooth margin squeeze
// (left edge pinned, right edge gliding, progressive reflow) must now run at
// full frame rate on heavy sessions because off-screen flowItems skip layout.
//   1. cv active: flowItems report content-visibility: auto.
//   2. perf: frame-drop ratio while toggling the panel (rail open) ~ low.
//   3. geometry: viewArea LEFT edge constant during the animation; right edge
//      glides progressively (many small steps, no jump); rail stays in
//      lockstep (rail.right - viewArea.right constant = rail width).
//   4. scroll sanity: jump to bottom renders the last item; scrollHeight
//      stabilizes after rendering (intrinsic-size estimates converge).
// Usage: node scripts/verify-glide.cjs [session-substr]
let chromium
try { ({ chromium } = require('./pw-tmp/node_modules/playwright-core')) } catch { ({ chromium } = require('playwright-core')) }
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const URL = 'http://127.0.0.1:3080'
const SESSION_TEXT = process.argv[2] || '调研两列部件放大动画方案Ⅱ'

const sampleAnim = (page, action) => page.evaluate((act) => new Promise((resolve) => {
  const frames = []
  const sample = () => {
    const va = document.querySelector("[data-slot='conversation.session'] > [class$='_viewArea']")
    const rail = document.querySelector('.dsx-stats-rail')
    const vr = va ? va.getBoundingClientRect() : null
    return {
      vaL: vr ? +vr.left.toFixed(1) : null,
      vaR: vr ? +vr.right.toFixed(1) : null,
      rail: rail ? +rail.getBoundingClientRect().right.toFixed(1) : null,
    }
  }
  let raf
  const start = performance.now()
  const loop = () => {
    frames.push({ t: +(performance.now() - start).toFixed(1), ...sample() })
    if (performance.now() - start < 750) raf = requestAnimationFrame(loop)
    else resolve(frames)
  }
  raf = requestAnimationFrame(loop)
  const btn = document.querySelector(`.nArs4W_toggleButton[aria-label="${act === 'open' ? '展开侧边栏' : '折叠侧边栏'}"]`)
  if (btn) btn.click()
}), action)

const sampleFrames = (page, ms) => page.evaluate((dur) => new Promise((resolve) => {
  const frames = []; let last = performance.now(); let raf
  const start = performance.now()
  const tick = (t) => { frames.push(t - last); last = t
    if (performance.now() - start < dur) raf = requestAnimationFrame(tick); else resolve(frames) }
  raf = requestAnimationFrame(tick)
}), ms)

async function measureToggle(page) {
  const sampler = sampleFrames(page, 700)
  await page.locator('.nArs4W_toggleButton[aria-label="展开侧边栏"]').first().click()
  await page.waitForTimeout(430)
  const closeBtn = page.locator('.nArs4W_toggleButton[aria-label="折叠侧边栏"]').first()
  if (await closeBtn.count()) await closeBtn.click()
  await page.waitForTimeout(300)
  return sampler
}

;(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true })
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(4000)
  const exp = page.locator('.qDHVXG_sessionOverflowButton').first()
  if (await exp.count()) { await exp.click(); await page.waitForTimeout(800) }
  await page.locator('.YDXeBa_sessionRow', { hasText: SESSION_TEXT }).first().click()
  await page.waitForSelector('.dsx-stats-capsule', { timeout: 20000 })
  await page.waitForTimeout(2000)
  const pressed = await page.getAttribute('.dsx-stats-capsule', 'aria-pressed')
  if (pressed !== 'true') { await page.locator('.dsx-stats-capsule').click(); await page.waitForTimeout(700) }
  const fold = page.locator('.nArs4W_toggleButton[aria-label="折叠侧边栏"]').first()
  if (await fold.count()) { await fold.click(); await page.waitForTimeout(600) }

  // 1. content-visibility active?
  const cv = await page.evaluate(() => {
    const items = [...document.querySelectorAll("[data-slot='conversation.session'] [class$='_flowItem']")]
    return { count: items.length, auto: items.filter((el) => getComputedStyle(el).contentVisibility === 'auto').length }
  })

  // 2/3. animation sampling (open + close)
  const openFrames = await sampleAnim(page, 'open')
  await page.waitForTimeout(700)
  const closeFrames = await sampleAnim(page, 'close')
  await page.waitForTimeout(600)

  const analyze = (frames) => {
    const anim = frames.filter((f) => f.vaR !== null && f.rail !== null)
    const lefts = anim.map((f) => f.vaL)
    const lMin = Math.min(...lefts); const lMax = Math.max(...lefts)
    const diffs = anim.map((f) => f.rail - f.vaR)
    const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length
    const std = Math.sqrt(diffs.reduce((a, d) => a + (d - mean) ** 2, 0) / diffs.length)
    // progressive glide: count distinct right-edge positions and the largest
    // single-frame jump inside the animation window
    const rights = anim.map((f) => f.vaR)
    let maxStep = 0
    for (let i = 1; i < rights.length; i++) maxStep = Math.max(maxStep, Math.abs(rights[i] - rights[i - 1]))
    const total = Math.max(...rights) - Math.min(...rights)
    return {
      leftEdge: { min: +lMin.toFixed(1), max: +lMax.toFixed(1), drift: +(lMax - lMin).toFixed(1) },
      railSync: { meanDiff: +mean.toFixed(1), stdPx: +std.toFixed(2) },
      glide: { distinctSteps: new Set(rights.map((r) => r.toFixed(1))).size, maxFrameJumpPx: +maxStep.toFixed(1), totalTravelPx: +total.toFixed(1) },
    }
  }

  // 4. scroll sanity: bottom renders last item; scrollHeight converges
  const scroll = await page.evaluate(async () => {
    const sc = document.querySelector('[data-conversation-scroll]') || document.scrollingElement
    const h0 = sc.scrollHeight
    sc.scrollTop = sc.scrollHeight
    await new Promise((r) => setTimeout(r, 600))
    const h1 = sc.scrollHeight
    const items = [...document.querySelectorAll("[data-slot='conversation.session'] [class$='_flowItem']")]
    const last = items[items.length - 1]
    const r = last ? last.getBoundingClientRect() : null
    const visible = r ? r.top < innerHeight && r.bottom > 0 : false
    sc.scrollTop = 0
    await new Promise((r2) => setTimeout(r2, 400))
    return { scrollHeightBefore: h0, afterJump: h1, deltaPct: +((100 * (h1 - h0)) / h0).toFixed(2), lastItemVisible: visible }
  })

  // perf rounds
  const rounds = []
  for (let i = 0; i < 3; i++) rounds.push(await measureToggle(page))
  const per = rounds.map((frames) => ({ dropGt26: frames.filter((d) => d > 26).length, n: frames.length }))
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length

  console.log(JSON.stringify({
    cv,
    open: analyze(openFrames),
    close: analyze(closeFrames),
    scroll,
    perf: { dropRatioPctAvg: +avg(per.map((t) => (100 * t.dropGt26) / t.n)).toFixed(1), rounds: per },
  }, null, 1))
  await browser.close()
})().catch((e) => { console.error('VERIFY FAILED:', e.message); process.exit(1) })