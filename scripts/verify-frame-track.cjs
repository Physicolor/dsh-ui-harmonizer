/**
 * dsh-ui-harmonizer — the AppFrame column track must ANIMATE (DSH 0.2 regression).
 *
 * DSH 0.2.0 moved the frame's `transition: grid-template-columns …` behind
 * `[data-animating]`, and the component sets that attribute in a
 * `useLayoutEffect` on the same commit that writes the new inline track. CSS
 * Transitions start from the before-change style, which therefore still carries
 * `transition-property: all; duration: 0s` — so no transition ever runs:
 *
 *   before the fix (0.2.0-rc.2, 1920x1080, one right-panel toggle)
 *     grid 280px 1640px 0px -> 280px 776px 864px in ONE frame
 *     frame events: none (data-animating cleared 600ms later by the fallback timer)
 *
 * enhancer.module.css keeps the transition on the frame permanently and
 * frame-track.ts owns the single exclusion the product implements in JS
 * (window resize). This asserts both halves on the live app:
 *
 *   1. opening the panel eases the center column through many intermediate
 *      track widths (no single-frame jump);
 *   2. the frame fires transitionrun/start/end for grid-template-columns;
 *   3. the same holds on close;
 *   4. a viewport change is NOT eased: the first frames after the resize already
 *      show the final track, and `<html>` carries `enhc-window-resizing`;
 *   5. that class is gone once the resize settles (the ease comes back).
 *
 *   node scripts/verify-frame-track.cjs [--session <substring>]
 *
 * URL from DSH_URL, default http://127.0.0.1:19387.
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
  // The widgets plugin ships the shared Chromium resolver (newest Playwright
  // build, CHROME_PATH override); fall back to the bundled Edge otherwise.
  try { return require('../../dsh-widgets/scripts/lib/chrome.cjs') } catch { return {} }
})()
/** Chromium for the probe: the shared resolver, else the bundled Edge. */
const resolveChrome = () => {
  if (typeof chromePath === 'function') return chromePath()
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  return 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:19387')
const SESSION = arg('--session', 'dsh-widgets')

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

/** One toggle, sampled every frame; the click happens inside the page. */
const IN_PAGE_TRACE = (ms) => new Promise((resolve) => {
  const frame = () => document.querySelector('[class$="_frame"]')
  const events = []
  const t0 = performance.now()
  const f0 = frame()
  if (f0 !== null) {
    for (const type of ['transitionrun', 'transitionstart', 'transitionend']) {
      f0.addEventListener(type, (e) => { if (e.propertyName === 'grid-template-columns') events.push(type) })
    }
  }
  const grids = []
  let clicked = false
  let frames = 0
  const tick = () => {
    if (!clicked && frames >= 3) {
      const b = document.querySelector('[data-sidebar-right-toggle]') ?? document.querySelector('[data-sidebar-right-expand]')
      if (b) b.click()
      clicked = true
    }
    const f = frame()
    if (f !== null) grids.push(getComputedStyle(f).gridTemplateColumns)
    frames += 1
    if (performance.now() - t0 > ms) resolve({ grids, events })
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

let failures = 0
const check = (name, ok, detail) => { if (!ok) failures += 1; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

/** Distinct middle tracks of the center column (the number that eases past 1 on a glide). */
const midTracks = (grids) => {
  const mids = grids.map((g) => Number(/([\d.]+)px/.exec(g.split(/\s+/)[1] ?? '')?.[1] ?? NaN))
    .filter((v) => Number.isFinite(v))
  const min = Math.min(...mids)
  const max = Math.max(...mids)
  const span = max - min
  if (!(span > 40)) return { steps: 0, span }
  const distinct = new Set(mids.map((v) => Math.round(v))).size
  return { steps: distinct, span }
}

;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }
  const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
  if (!(await row.count())) { console.error(`FAIL  no session row matching "${SESSION}"`); await browser.close(); process.exit(1) }
  await row.click({ timeout: 8000 })
  await page.waitForTimeout(4500)

  const open = await page.evaluate(IN_PAGE_TRACE, 1200)
  const openMid = midTracks(open.grids)
  check('opening the panel eases the center track (many intermediate widths)', openMid.steps >= 5, `${openMid.steps} distinct widths over ${Math.round(openMid.span)}px`)
  check('the frame fires transitionrun/start/end for grid-template-columns',
    open.events.includes('transitionrun') && open.events.includes('transitionstart') && open.events.includes('transitionend'),
    JSON.stringify(open.events))

  await page.waitForTimeout(600)
  const close = await page.evaluate(IN_PAGE_TRACE, 1200)
  const closeMid = midTracks(close.grids)
  check('closing eases the same way', closeMid.steps >= 5, `${closeMid.steps} distinct widths over ${Math.round(closeMid.span)}px`)
  check('closing fires the track transition events too',
    close.events.includes('transitionrun') && close.events.includes('transitionend'), JSON.stringify(close.events))

  // A viewport change must NOT ease: the first frames already show the final track.
  const before = await page.evaluate(() => getComputedStyle(document.querySelector('[class$="_frame"]')).gridTemplateColumns)
  await page.setViewportSize({ width: 1560, height: 1080 })
  const first = await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r({
    grid: getComputedStyle(document.querySelector('[class$="_frame"]')).gridTemplateColumns,
    cls: document.documentElement.className,
  })))))
  check('a window resize is not eased (first frames already at the final track)', first.grid !== before, `${before} -> ${first.grid}`)
  check('the resize window carries enhc-window-resizing', first.cls.includes('enhc-window-resizing'), `class="${first.cls.trim()}"`)
  await page.waitForTimeout(500)
  const settled = await page.evaluate(() => document.documentElement.className)
  check('the resize class is released once the resize settles', !settled.includes('enhc-window-resizing'), `class="${settled.trim()}"`)

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
