/**
 * dsh-ui-harmonizer — the panel toggle's reservation under load (numbers, not a
 * gate).
 *
 * Every toggle now runs the SNAP path: the frame's track is collapsed to one
 * frame, the right-side reservation is settled in the same task, and the visible
 * motion is carried by covers (a composited `transform` on the transcript, a
 * `left` on the composer, a `width` on the header). This probe measures what
 * that costs on the paths where it can go wrong: a long conversation, a
 * throttled CPU (a weak device), and headless SwiftShader (no hardware GPU).
 *
 * The previous build eased the track whenever a reservation existed; its numbers
 * (recorded 2026-10-20/21) are the comparison this probe reproduces on the same
 * session and window.
 *
 * It answers one question per arm: during one right-panel toggle, how many
 * frames did the page actually deliver, and how long was the worst one? Plus the
 * one thing the snap must never do: paint a collapsed transcript.
 *
 *   node scripts/verify-panel-squeeze-perf.cjs [--url <origin>] [--session <text>]
 *        [--clones <n>] [--cpu <rate>] [--reduced]
 *
 * Arms:
 *   1. reserve            — the real toggle (reservation present)
 *   2. no reservation     — the same path with the reservation pinned to 0
 *   3. reserve + clones   — the transcript's flow nodes duplicated N times
 *   4. reserve + CPU      — CDP CPU throttling at `--cpu`
 *   5. reserve + clones + CPU
 * `--reduced` also removes the covers' own easing cost by asking the page for
 * reduced motion, which is the product's own "no animation" switch — the floor.
 *
 * Report only: frame timing is hardware- and session-dependent, so this prints a
 * table and fails ONLY if a toggle leaves the layout in a non-final state, paints
 * a collapsed transcript, or the page throws.
 */
const path = require('node:path')
const fs = require('node:fs')
const crypto = require('node:crypto')

const PW_CANDIDATES = [
  'playwright-core',
  path.join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'),
]
let chromium = null
for (const candidate of PW_CANDIDATES) {
  try { ({ chromium } = require(candidate)); break } catch { /* try the next */ }
}
if (chromium === null) { console.error('playwright-core not found'); process.exit(1) }

const { chromePath } = (() => {
  try { return require('../../dsh-widgets/scripts/lib/chrome.cjs') } catch { return {} }
})()
const resolveChrome = () => {
  if (typeof chromePath === 'function') return chromePath()
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  return 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:19387')
const SESSION = arg('--session', 'dsh-widgets')
const CLONES = Number(arg('--clones', 2))
const CPU = Number(arg('--cpu', 4))
const REDUCED = process.argv.includes('--reduced')

function authCookie() {
  const yaml = fs.readFileSync('D:/dsh-home/.credentials.yaml', 'utf8')
  const secret = Buffer.from(yaml.match(/secret:\s*([A-Za-z0-9_-]+)/)[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
  const authority = new global.URL(URL_).host
  const b64u = (b) => Buffer.from(b).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const name = 'dsh-auth-' + b64u(crypto.createHash('sha256').update(authority).digest())
  const now = Date.now()
  const body = b64u(Buffer.from(JSON.stringify({ version: 1, authority, issuedAt: now, expiresAt: now + 86400000 }), 'utf8'))
  return { name, value: `v1.${body}.${b64u(crypto.createHmac('sha256', secret).update(body).digest())}` }
}

/** Duplicate the transcript's flow nodes in place (synthetic long conversation). */
const CLONE_FLOW = (n) => {
  const flow = document.querySelector('[data-slot="conversation.chat.flow"]')
  if (flow === null) return 0
  const originals = [...flow.children]
  for (let copy = 1; copy < n; copy += 1) {
    for (const el of originals) {
      const clone = el.cloneNode(true)
      clone.setAttribute('data-perf-clone', '1')
      flow.appendChild(clone)
    }
  }
  return document.querySelectorAll('[data-slot="conversation.chat.flow"] *').length
}

/** Drop every node `CLONE_FLOW` added. */
const UNCLONE = () => {
  for (const el of document.querySelectorAll('[data-perf-clone]')) el.remove()
  return document.querySelectorAll('[data-slot="conversation.chat.flow"] *').length
}

/**
 * One toggle, measured from inside the page.
 *
 * Frames are timed with rAF, long tasks with PerformanceObserver; both start two
 * frames before the click and stop 700ms after it, which is longer than the
 * product's 300ms slew plus the settle.
 */
const MEASURE = (windowMs) => new Promise((resolve) => {
  const q = (s) => document.querySelector(s)
  const frame = q('[class$="_frame"]')
  const col = q('[class$="_column"]')
  const scroll = q('[data-conversation-scroll]')
  const before = frame === null ? '' : frame.style.gridTemplateColumns
  const gaps = []
  const long = []
  const colW = []
  const pads = []
  const t0 = performance.now()
  let last = t0
  let clicked = false
  let clickedAt = 0
  let n = 0
  let observer = null
  try {
    observer = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) long.push(Math.round(e.duration))
    })
    observer.observe({ type: 'longtask', buffered: false })
  } catch { /* no longtask support: frames are the report */ }
  const tick = (now) => {
    gaps.push(Math.round(now - last))
    last = now
    if (!clicked && n >= 2) {
      const b = q('[data-sidebar-right-toggle]') || q('[data-sidebar-right-expand]')
      if (b) b.click()
      clicked = true
      clickedAt = now
    }
    if (col !== null) colW.push(Math.round(col.getBoundingClientRect().width))
    pads.push(scroll === null ? '' : getComputedStyle(scroll).paddingRight)
    n += 1
    if (now - t0 < windowMs) { requestAnimationFrame(tick); return }
    if (observer !== null) observer.disconnect()
    const after = frame === null ? '' : frame.style.gridTemplateColumns
    resolve({
      gaps: gaps.slice(2),
      long,
      settled: before !== after,
      col: col === null ? null : Math.round(col.getBoundingClientRect().width),
      colW,
      pads,
      nodes: q('[data-slot="conversation.chat.flow"]') === null
        ? 0
        : q('[data-slot="conversation.chat.flow"]').querySelectorAll('*').length,
    })
  }
  requestAnimationFrame(tick)
})

const pct = (arr, p) => {
  if (arr.length === 0) return 0
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.min(s.length - 1, Math.floor(s.length * p))]
}

let failures = 0
const fail = (msg) => { failures += 1; console.log(`FAIL  ${msg}`) }

;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1707, height: 1067 },
    reducedMotion: REDUCED ? 'reduce' : 'no-preference',
  })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }
  const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
  if (!(await row.count())) { console.error(`FAIL  no session row matching "${SESSION}"`); await browser.close(); process.exit(1) }
  await row.click({ timeout: 8000 })
  await page.waitForTimeout(6000)

  const cdp = await ctx.newCDPSession(page)
  const throttle = async (rate) => { await cdp.send('Emulation.setCPUThrottlingRate', { rate }) }

  const isClosed = () => page.evaluate(() => /minmax\(0px,\s*0px\)\s*$/.test(
    (document.querySelector('[class$="_frame"]') || { style: {} }).style.gridTemplateColumns || ''))
  /** Every arm starts closed and toggles OPEN. */
  const ensureClosed = async () => {
    if (!(await isClosed())) {
      await page.evaluate(() => {
        const b = document.querySelector('[data-sidebar-right-toggle]')
        if (b) b.click()
      })
      await page.waitForTimeout(900)
    }
  }
  const pin = (on) => page.evaluate((enabled) => {
    const root = document.documentElement
    const scroll = document.querySelector('[data-conversation-scroll]')
    if (enabled) {
      root.style.setProperty('--dps-right-space', '0px')
      root.style.setProperty('--dsx-rail-w', '0px')
      if (scroll !== null) scroll.style.setProperty('padding-right', '0px', 'important')
    } else {
      root.style.removeProperty('--dps-right-space')
      root.style.removeProperty('--dsx-rail-w')
      if (scroll !== null) scroll.style.removeProperty('padding-right')
    }
  }, on)
  const restore = async () => {
    await throttle(1)
    await pin(false)
    await page.evaluate(UNCLONE)
    // The option-off arm removes the root class; put it back for every other arm.
    await page.evaluate(() => document.documentElement.classList.add('enhc-panel-glide'))
    await ensureClosed()
  }

  const reservation = await page.evaluate(() => {
    const el = document.querySelector('[data-conversation-scroll]')
    return el === null ? '' : getComputedStyle(el).paddingRight
  })
  console.log(`# ${SESSION} @ ${new URL(URL_).host} — reservation ${reservation || '0px'}, ` +
    `reducedMotion=${REDUCED}, gpu=headless/SwiftShader (softGPU), cpu arm x${CPU}, clones x${CLONES}`)

  const arms = []
  await cdp.send('Performance.enable')
  /**
   * The page's own counters, used as the low-noise half of every arm.
   *
   * Frame gaps over a 1800ms window on this machine are dominated by whatever
   * else the page is doing, so a single toggle's p95 can swing by 3x between two
   * runs of the same build. `LayoutCount`/`RecalcStyleCount` are attributed to the
   * window and say directly whether the toggle re-laid out the frame once or on
   * every frame — which is the property this change is about.
   */
  const metrics = async () => {
    const { metrics: list } = await cdp.send('Performance.getMetrics')
    const out = {}
    for (const entry of list) out[entry.name] = entry.value
    return out
  }
  const median = (values) => {
    if (values.length === 0) return 0
    const s = [...values].sort((a, b) => a - b)
    return s[Math.floor(s.length / 2)]
  }
  /**
   * One arm = `options.reps` toggles (default 1), each on a closed panel.
   *
   * The comparable arms run three reps because a single toggle is not a
   * measurement on a page that is also serving a live session; the synthetic
   * (cloned / throttled) arms run one, since their cost is the transcript's size,
   * not the noise.
   */
  const run = async (label, options) => {
    const count = options.reps || 1
    const reps = []
    let nodes = 0
    for (let rep = 0; rep < count; rep += 1) {
      await restore()
      if (options.snap) await pin(true)
      // The option-off arm is the EASED-track baseline on the same page: removing
      // the root class makes the capture handler inert, so the product's own 300ms
      // `grid-template-columns` tween runs with no gate and no covers — i.e. the
      // shape this change replaced. Same session, same window, one variable.
      if (options.glideOff) {
        await page.evaluate(() => document.documentElement.classList.remove('enhc-panel-glide'))
      }
      if (options.clones) await page.evaluate(CLONE_FLOW, options.clones)
      if (options.cpu) await throttle(options.cpu)
      await ensureClosed()
      await page.waitForTimeout(250)
      const m0 = await metrics()
      const m = await page.evaluate(MEASURE, 1800)
      const m1 = await metrics()
      await page.waitForTimeout(600)
      // A starved page can spend the whole window inside the click's own commit, so
      // "the track never changed" is only a failure when frames were actually being
      // delivered (a gap under 500ms means the page had room to act on the click).
      if (!m.settled && m.gaps.every((g) => g < 500)) fail(`${label}: the toggle did not change the track`)
      // The collapse signature: any frame narrower than both ends. The reservation
      // arm must never show one — that is the defect this path replaced.
      const colW = m.colW || []
      if (colW.length > 2) {
        const first = colW[0]
        const final = colW[colW.length - 1]
        const narrowest = Math.min(...colW)
        if (narrowest < Math.min(first, final) - 8) {
          fail(`${label}: painted a collapsed transcript — ${narrowest}px against ${Math.min(first, final)}px`)
        }
      }
      const g = m.gaps
      const pads = m.pads || []
      nodes = m.nodes
      reps.push({
        frames: g.length,
        p50: pct(g, 0.5),
        p95: pct(g, 0.95),
        max: g.length ? Math.max(...g) : 0,
        janky: g.filter((v) => v > 50).length,
        long: m.long.length ? Math.max(...m.long) : 0,
        layouts: Math.round((m1.LayoutCount || 0) - (m0.LayoutCount || 0)),
        recalcs: Math.round((m1.RecalcStyleCount || 0) - (m0.RecalcStyleCount || 0)),
        layoutMs: Math.round(((m1.LayoutDuration || 0) - (m0.LayoutDuration || 0)) * 1000),
        styleMs: Math.round(((m1.RecalcStyleDuration || 0) - (m0.RecalcStyleDuration || 0)) * 1000),
        task: Math.round(((m1.TaskDuration || 0) - (m0.TaskDuration || 0)) * 1000),
        padEnd: pads.length ? pads[pads.length - 1] : '',
      })
      // Back to closed for the next rep (also un-throttled so the click is fair).
      await throttle(1)
      await page.evaluate(() => {
        const b = document.querySelector('[data-sidebar-right-toggle]')
        if (b) b.click()
      })
      await page.waitForTimeout(900)
    }
    arms.push({
      label,
      reps: count,
      frames: median(reps.map((r) => r.frames)),
      p50: median(reps.map((r) => r.p50)),
      p95: median(reps.map((r) => r.p95)),
      max: median(reps.map((r) => r.max)),
      janky: median(reps.map((r) => r.janky)),
      long: Math.max(...reps.map((r) => r.long)),
      layouts: median(reps.map((r) => r.layouts)),
      recalcs: median(reps.map((r) => r.recalcs)),
      layoutMs: median(reps.map((r) => r.layoutMs)),
      styleMs: median(reps.map((r) => r.styleMs)),
      task: median(reps.map((r) => r.task)),
      nodes,
      padEnd: reps[0].padEnd,
    })
  }

  await run('reserve (snap)', { reps: 3 })
  await run('eased track (option off)', { glideOff: true, reps: 3 })
  await run('no reservation (pinned 0)', { snap: true, reps: 3 })
  await run('reserve + cloned flow', { clones: CLONES })
  await run(`reserve + cpu x${CPU}`, { cpu: CPU })
  await run(`reserve + cloned flow + cpu x${CPU}`, { clones: CLONES, cpu: CPU })
  if (errors.length > 0) fail(`page errors: ${errors.join(' | ')}`)

  console.log('\narm                          reps frames  p50  p95  max  >50ms  worst longtask  layouts  layout ms  style ms  task ms  nodes  pad@end')
  for (const a of arms) {
    console.log(`${a.label.padEnd(29)} ${String(a.reps).padStart(4)} ${String(a.frames).padStart(6)} ${String(a.p50).padStart(4)} ${String(a.p95).padStart(4)} ${String(a.max).padStart(4)} ${String(a.janky).padStart(6)} ${String(a.long).padStart(15)} ${String(a.layouts).padStart(8)} ${String(a.layoutMs).padStart(10)} ${String(a.styleMs).padStart(9)} ${String(a.task).padStart(8)} ${String(a.nodes).padStart(6)}  ${a.padEnd}`)
  }
  console.log(`\n${failures === 0 ? 'REPORT OK' : `${failures} FAILURE(S)`} — panel toggle perf`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})()
