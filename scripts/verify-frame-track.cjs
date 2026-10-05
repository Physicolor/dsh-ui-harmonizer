/**
 * dsh-ui-harmonizer — the AppFrame column track contract (DSH 0.2 regression).
 *
 * Two behaviours share this script, because they are two halves of one
 * decision and either can regress silently:
 *
 * A. THE TRACK MUST ANIMATE (frame-track.ts + frame-column-transition.module.css)
 *
 * DSH 0.2.0 moved the frame's `transition: grid-template-columns …` behind
 * `[data-animating]`, and the component sets that attribute in a
 * `useLayoutEffect` on the same commit that writes the new inline track. CSS
 * Transitions start from the before-change style, which therefore still carries
 * `transition-property: all; duration: 0s` — so no transition ran at all:
 *
 *   before the fix (0.2.0-rc.2, 1920x1080, one right-panel toggle)
 *     grid 280px 1640px 0px -> 280px 776px 864px in ONE frame
 *     frame events: none (data-animating cleared 600ms later by the fallback timer)
 *
 * frame-column-transition.module.css keeps the transition on the frame
 * permanently and frame-track.ts owns the single exclusion the product
 * implements in JS rather than CSS (window resize).
 *
 * B. A RIGHT-PANEL TOGGLE MUST *NOT* EASE THE TRACK (chrome/instant-track.ts)
 *
 * On a right-panel toggle the eased track is the wrong trade: the same LAYOUT
 * property travels 1427px -> 659px, so every frame of the 300ms window re-lays
 * out the whole frame (the product's own ResizeObserver wakes 27 times against
 * 10 for a left-panel toggle) while the compositor and GPU threads idle. So on
 * a right-panel click the plugin snaps the track to its final value in one
 * frame and re-adds the motion as covers that do not re-lay out:
 *
 *   - `transform` on the transcript column (the only cover host with no
 *     `position: fixed` descendants — a transform on any of the composer's
 *     ancestors rewrites the dsh-widgets rail's containing block and drags it
 *     into the viewport);
 *   - `left` on the composer capsule (a layout property, so it does NOT create
 *     a containing block and the rail stays put).
 *
 * Also asserted: the stopwatch beats survive the snap. A 1ms duration still
 * fires transitionrun/start/end for grid-template-columns, so dsh-widgets' rail
 * yield, which reads that beat on the track's first frame, keeps working.
 *
 * CHECK LIST
 *   1. opening the panel snaps the center track (<=2 distinct widths, no glide);
 *   2. opening still fires transitionrun/start/end for grid-template-columns;
 *   3. a cover runs on the transcript column during that toggle;
 *   4. the rail does not move during the toggle (cover-host safety invariant);
 *   5. the same holds on close;
 *   6. with the option off (`enhc-panel-glide` removed) the ease comes back
 *      (>=5 distinct widths) — one switch, both halves;
 *   7. a viewport change is NOT eased: the first frames after the resize already
 *      show the final track, and `<html>` carries `enhc-window-resizing`;
 *   8. that class is gone once the resize settles (the ease comes back).
 *
 *   node scripts/verify-frame-track.cjs [--session <substring>]
 *
 * URL from DSH_URL, default http://127.0.0.1:19387. Requires the built
 * `lib/client.js` to be the one the app is serving.
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

/**
 * One toggle, sampled every frame; the click happens inside the page.
 *
 * `covers` collects a label per frame for every animation running on the two
 * cover hosts, so a cover that starts and ends inside the trace is still seen.
 * `railX` tracks the dsh-widgets rail's left edge: the covers must never move
 * it (that is the whole reason the composer cover uses `left`, not `transform`).
 */
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
  const covers = []
  const rails = []
  const times = []
  const tds = []
  let clicked = false
  let frames = 0
  const tick = () => {
    if (!clicked && frames >= 3) {
      const b = document.querySelector('[data-sidebar-right-toggle]') ?? document.querySelector('[data-sidebar-right-expand]')
      if (b) b.click()
      clicked = true
    }
    const f = frame()
    if (f !== null) {
      const cs = getComputedStyle(f)
      grids.push(cs.gridTemplateColumns)
      tds.push(cs.transitionDuration)
    }
    const rail = document.querySelector('.dsx-stats-rail')
    if (rail !== null && rail.getBoundingClientRect().width > 0) rails.push(rail.getBoundingClientRect().left)
    for (const a of document.getAnimations()) {
      const el = a.effect === null || a.effect === undefined ? null : a.effect.target
      if (el === null || el === undefined || !(el instanceof Element)) continue
      const cls = typeof el.className === 'string' ? el.className : ''
      if (/(^|\s)[A-Za-z0-9_-]*_column(\s|$)/.test(cls)) covers.push('column')
      else if (el.closest('[data-slot="conversation.composer.bar"]') !== null) covers.push('composer')
    }
    times.push(performance.now() - t0)
    frames += 1
    if (performance.now() - t0 > ms) resolve({ grids, events, covers, rails, times, tds })
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

let failures = 0
const check = (name, ok, detail) => { if (!ok) failures += 1; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

/** Distinct middle tracks of the center column (>=5 means the track glided). */
const midTracks = (grids) => {
  const mids = grids.map((g) => Number(/([\d.]+)px/.exec(g.split(/\s+/)[1] ?? '')?.[1] ?? NaN))
    .filter((v) => Number.isFinite(v))
  const min = Math.min(...mids)
  const max = Math.max(...mids)
  const span = max - min
  const distinct = [...new Set(mids.map((v) => Math.round(v)))]
  return { steps: span > 40 ? distinct.length : 0, span, distinct }
}

/** Largest observed sideways travel of the rail during one trace, in px. */
const railDrift = (rails) => {
  if (rails.length === 0) return null
  return Math.max(...rails) - Math.min(...rails)
}

/** Longest gap between two sampled frames, in ms (0 when fewer than 2 frames). */
const maxGap = (times) => {
  if (times === undefined || times.length < 2) return 0
  let max = 0
  for (let i = 1; i < times.length; i += 1) max = Math.max(max, times[i] - times[i - 1])
  return max
}

/**
 * Is the frame's track transition pinned to the snap duration?
 *
 * The plugin's gate writes `transition-duration: 0.001s !important` while
 * `data-enhc-instant` is on the root; with the option off the computed value must be
 * the stylesheet's own `0.3s`. Reading the duration is immune to frame
 * starvation in a way that counting sampled widths is not.
 */
const isInstant = (tds) => (tds === undefined || tds.length === 0 ? null : /^0?\.?0*0?0?1/.test(String(tds[0])) || String(tds[0]).startsWith('0.001'))

/** True when the click starved rAF enough that the ease could not be sampled. */
const STARVED_GAP_MS = 200

;;(async () => {
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

  const optionOn = await page.evaluate(() => document.documentElement.classList.contains('enhc-panel-glide'))
  console.log(`# panel glide option: ${optionOn ? 'ON' : 'OFF (checks 1-5 will assert the eased track)'}`)

  // ---- open ---------------------------------------------------------------
  const open = await page.evaluate(IN_PAGE_TRACE, 1200)
  const openMid = midTracks(open.grids)
  const openEvents = ['transitionrun', 'transitionstart', 'transitionend'].every((t) => open.events.includes(t))
  if (optionOn) {
    check('opening SNAPS the center track (no glide)', openMid.steps <= 2, `${openMid.steps} distinct widths: ${JSON.stringify(openMid.distinct)}`)
  } else {
    check('opening eases the center track (option off -> many widths)', openMid.steps >= 5, `${openMid.steps} distinct widths over ${Math.round(openMid.span)}px`)
  }
  check('the frame fires transitionrun/start/end for grid-template-columns', openEvents, JSON.stringify(open.events))

  if (optionOn) {
    check('a cover runs on the transcript column', open.covers.includes('column'), JSON.stringify([...new Set(open.covers)]))
    const drift = railDrift(open.rails)
    check('the covers do not move the rail', drift === null || drift < 2, drift === null ? 'rail not present in this session' : `rail drift ${drift.toFixed(1)}px`)
  }

  await page.waitForTimeout(600)

  // ---- close --------------------------------------------------------------
  const close = await page.evaluate(IN_PAGE_TRACE, 1200)
  const closeMid = midTracks(close.grids)
  if (optionOn) {
    check('closing snaps the same way', closeMid.steps <= 2, `${closeMid.steps} distinct widths: ${JSON.stringify(closeMid.distinct)}`)
    check('a cover runs on the transcript column on close too', close.covers.includes('column'), JSON.stringify([...new Set(close.covers)]))
    const drift = railDrift(close.rails)
    check('the close cover does not move the rail either', drift === null || drift < 2, drift === null ? 'rail not present in this session' : `rail drift ${drift.toFixed(1)}px`)
  } else {
    check('closing eases the same way', closeMid.steps >= 5, `${closeMid.steps} distinct widths over ${Math.round(closeMid.span)}px`)
  }
  check('closing fires the track transition events too',
    close.events.includes('transitionrun') && close.events.includes('transitionend'), JSON.stringify(close.events))

  // ---- the switch must restore the ease -----------------------------------
  if (optionOn) {
    await page.evaluate(() => document.documentElement.classList.remove('enhc-panel-glide'))
    const off = await page.evaluate(IN_PAGE_TRACE, 1200)
    const offMid = midTracks(off.grids)
    // Count the sampled widths AND assert the underlying invariant. On a long,
    // heavy conversation the click itself blocks the main thread long enough
    // (measured: 6 rAF callbacks in 1200ms, one 664ms gap) that the 300ms ease is
    // over before frames can be painted, so the count collapses to 2 even though
    // the ease is intact — on an EMPTY session the same probe samples 12 widths
    // 1640..776. The duration is what the option actually controls, so it is the
    // reliable assertion; the width count stays as corroboration.
    const offEased = !isInstant(off.tds)
    const offStarved = maxGap(off.times) > STARVED_GAP_MS
    check('with the option off the track eases again (one switch, both halves)',
      offEased && (offMid.steps >= 5 || offStarved),
      `${offMid.steps} distinct widths over ${Math.round(offMid.span)}px, transition-duration ${JSON.stringify(off.tds[0])}, longest frame gap ${Math.round(maxGap(off.times))}ms${offStarved ? ' (frames starved by the click: the duration is the reliable signal)' : ''}`)
    await page.evaluate(() => document.documentElement.classList.add('enhc-panel-glide'))
    await page.waitForTimeout(600)
  }

  // ---- a viewport change must NOT ease ------------------------------------
  const before = await page.evaluate(() => ({
    grid: getComputedStyle(document.querySelector('[class$="_frame"]')).gridTemplateColumns,
    width: getComputedStyle(document.documentElement).width,
  }))
  // Poll instead of sampling a fixed frame count. `setViewportSize` resolves
  // before the page necessarily receives the `resize` event (measured: the call
  // took 216ms, the event arrived 108ms before it resolved, and the class was
  // only observable 17 rAF frames after the call started), so a two-frame
  // sample raced the event and failed on a correct build. The poll is armed
  // BEFORE the resize and records every frame's track + document width; the
  // analysis then takes the first frame whose width already changed, i.e. the
  // first frame the resize can possibly have affected.
  const resize = await (async () => {
    const poll = page.evaluate(async () => new Promise((resolve) => {
      const t0 = performance.now()
      const rows = []
      let classAt = null
      const tick = () => {
        const f = document.querySelector('[class$="_frame"]')
        rows.push({
          t: Math.round(performance.now() - t0),
          grid: f === null ? null : getComputedStyle(f).gridTemplateColumns,
          width: getComputedStyle(document.documentElement).width,
        })
        if (classAt === null && document.documentElement.className.includes('enhc-window-resizing')) classAt = Math.round(performance.now() - t0)
        if (classAt !== null || performance.now() - t0 > 900) resolve({ rows, classAt })
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }))
    await page.setViewportSize({ width: 1560, height: 1080 })
    const r = await poll
    const firstResized = r.rows.find((x) => x.width !== before.width)
    const last = r.rows[r.rows.length - 1]
    return {
      classAt: r.classAt,
      firstGrid: firstResized === undefined ? null : firstResized.grid,
      firstGridAt: firstResized === undefined ? null : firstResized.t,
      settledGrid: last === undefined ? null : last.grid,
      width: last === undefined ? null : last.width,
    }
  })()
  check('a window resize is not eased (the first resized frame is already the final track)',
    resize.firstGrid !== null && resize.firstGrid === resize.settledGrid && resize.firstGrid !== before.grid,
    `${before.grid} (${before.width}) -> ${resize.firstGrid} at ${resize.firstGridAt}ms, settled ${resize.settledGrid} (${resize.width})`)
  check('the resize window carries enhc-window-resizing', resize.classAt !== null, resize.classAt === null ? 'class never seen within 900ms of the resize call' : `class seen ${resize.classAt}ms after the resize call`)
  await page.waitForTimeout(700)
  const settled = await page.evaluate(() => document.documentElement.className)
  check('the resize class is released once the resize settles', !settled.includes('enhc-window-resizing'), `class="${settled.trim()}"`)

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
