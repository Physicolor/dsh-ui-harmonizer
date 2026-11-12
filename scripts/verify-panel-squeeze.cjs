/**
 * dsh-ui-harmonizer — the right-panel toggle's RESERVATION contract.
 *
 * A right-side occupant reserves space inside the conversation
 * (`[data-conversation-scroll]`'s `padding-right`: dsh-widgets' rail claim,
 * dsh-pinned-summary's `--dps-right-space`). That reservation is published by
 * its owner, and it used to land a whole frame after the frame's track —
 * so the content box was squeezed twice and the transcript collapsed
 * (measured 2026-10-20: `748 -> 288 -> 588`).
 *
 * The 2026-10-20 answer was to EASE the track whenever a reservation existed
 * ("one-clock squeeze"). That fixed the collapse and broke the frame budget:
 * measured 2026-10-21 on the report's session, the reservation still lagged the
 * commit (`300 -> 287 at +144ms ... 0 at +418ms`), the transcript's width held
 * at 748 until +249ms and then stepped, and only 5 frames were painted in the
 * 400ms window — all of them re-laying out the whole AppFrame. The panel slides
 * on its own compositor transform, so it looked smooth while the conversation
 * stuttered and arrived late.
 *
 * The current answer is the SNAP path for every toggle: the track is collapsed
 * to one frame, the reservation is settled in the same task (the gate flattens
 * its transition and `settleTransitions` finishes it), and the visible motion is
 * carried by covers — a compositor `transform` on the transcript, a `left` cover
 * on the composer, a `width` cover on the header.
 *
 * CHECK LIST
 *   A1. opening with a reservation never paints a transcript narrower than its
 *       resting width (the collapse signature);
 *   A2. the transcript's left edge and width are monotone in the expected
 *       direction, and the width lands in at most two values (the snap frame);
 *   A3. the reservation reaches its post-toggle value on the TRACK's own frame,
 *       not one frame later;
 *   A4. closing is the mirror of A1/A2/A3;
 *   A5. the panel's own animation and every cover start on one frame;
 *   B1. with the reservation pinned to 0 the same snap path runs (<=2 distinct
 *       tracks) and still arms a cover;
 *   B2. the rail does not move (cover-host safety invariant).
 *   C1. no leftover root attributes, no leftover inline padding, no page errors.
 *
 *   node scripts/verify-panel-squeeze.cjs [--url <origin>] [--session <text>]
 *
 * Requires the built `lib/client.js` to be the one the app is serving, and a
 * page with a conversation (the reservation arm needs the pinned summary or the
 * widgets rail open; when neither reserves, that arm reports SKIP).
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
/** Chromium for the probe: the shared resolver, else the bundled Edge. */
const resolveChrome = () => {
  if (typeof chromePath === 'function') return chromePath()
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  return 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:19387')
const SESSION = arg('--session', 'dsh-widgets')
const DUMP = process.argv.includes('--dump')

/** Print one arm's per-frame geometry (debugging, not a check). */
const dump = (label, s) => {
  if (!DUMP) return
  console.log(`# ${label}`)
  for (const f of s) {
    console.log(`  +${String(Math.round(f.t - s[0].t)).padStart(4)} gap=${String(f.gap).padStart(3)} col=${f.col ? f.col.join('/') : '-'} card=${f.card ? f.card.join('/') : '-'} pad=${f.pad} track=${f.track} anims=${f.anims.length}`)
  }
}

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
 * One toggle, sampled every frame from inside the page.
 *
 * Returns raw per-frame geometry plus the two facts the analysis needs: which
 * frame the TRACK first changed in, and which frame the RESERVATION first
 * changed in. Comparing those is the one-clock assertion.
 */
const IN_PAGE_TRACE = (opt) => new Promise((resolve) => {
  const q = (s) => document.querySelector(s)
  const frame = q('[class$="_frame"]')
  const col = q('[class$="_column"]')
  const card = q('[data-slot="conversation.composer.bar"] [class*="_card"]')
  const scroll = q('[data-conversation-scroll]')
  const samples = []
  let clicked = false
  let n = 0
  let last = performance.now()
  const box = (el) => {
    if (el === null) return null
    const r = el.getBoundingClientRect()
    return [Math.round(r.left * 10) / 10, Math.round(r.width * 10) / 10]
  }
  const push = (now) => {
    samples.push({
      t: now,
      gap: Math.round(now - last),
      track: frame === null ? '' : frame.style.gridTemplateColumns,
      col: box(col),
      card: box(card),
      scroll: box(scroll),
      pad: scroll === null ? '' : getComputedStyle(scroll).paddingRight,
      // Inline (not computed): this module's fallback hold is the only writer,
      // so a non-empty value here is the hold having fired for this toggle.
      hold: scroll === null ? '' : scroll.style.getPropertyValue('padding-right'),
      anims: document.getAnimations().filter((a) => {
        const el = a.effect && a.effect.target
        const cls = el && typeof el.className === 'string' ? el.className : ''
        // The header's width cover targets `…_header`, the composer's `left`
        // cover `…_card`, the transcript's `transform` cover `…_column`, and the
        // dock `…_tabCell`. All four are sampled: "every cover" has to mean all
        // of them, not the three that happen to share a suffix.
        return a.playState === 'running' && /_column|_card|_tabCell|_header$|_header /.test(cls)
      }).map((a) => {
        const el = a.effect && a.effect.target
        const cls = el && typeof el.className === 'string' ? el.className : ''
        const timing = a.effect === null ? null : a.effect.getTiming()
        return {
          n: /_tabCell/.test(cls) ? 'dock' : /_column/.test(cls) ? 'col' : (/_header/.test(cls) ? 'header' : 'card'),
          // `null` startTime = still pending (it starts on the next frame), which
          // is exactly the frame-late case this check exists to catch — keep it
          // as -1 instead of folding it into 0 with a truthiness test.
          at: a.startTime === null ? -1 : Math.round(a.startTime),
          dur: timing === null ? -1 : Math.round(Number(timing.duration)),
          ease: timing === null ? '' : String(timing.easing),
        }
      }),
    })
    last = now
  }
  const tick = (now) => {
    if (!clicked && n >= 3) {
      const b = q('[data-sidebar-right-toggle]') || q('[data-sidebar-right-expand]')
      if (b) b.click()
      clicked = true
      push(now)
      n += 1
      if (n < opt.frames) requestAnimationFrame(tick)
      else resolve(samples)
      return
    }
    push(now)
    n += 1
    if (n >= opt.frames) resolve(samples)
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

/** Rapid clicks: 9 at 130ms, then settle. */
const IN_PAGE_STORM = () => new Promise((resolve) => {
  const b = document.querySelector('[data-sidebar-right-toggle]')
    || document.querySelector('[data-sidebar-right-expand]')
  let left = 9
  const fire = () => {
    const btn = document.querySelector('[data-sidebar-right-toggle]')
      || document.querySelector('[data-sidebar-right-expand]')
    if (btn) btn.click()
    left -= 1
    if (left > 0) setTimeout(fire, 130)
    else setTimeout(() => resolve(true), 1200)
  }
  if (b) fire()
  else resolve(false)
})

const RESERVATION_PROBE = () => {
  const el = document.querySelector('[data-conversation-scroll]')
  return el === null ? '' : getComputedStyle(el).paddingRight
}

/**
 * The transcript column's resting width, read after the trace has settled.
 *
 * A trace window can end mid-glide on a starved page, so the last sampled frame
 * is not a resting value — the collapse check would then compare against a
 * moving target and pass trivially.
 */
const COL_WIDTH = () => {
  const el = document.querySelector('[class$="_column"]')
  if (el === null) return null
  return Math.round(el.getBoundingClientRect().width * 10) / 10
}

const STATE = () => {
  const root = document.documentElement
  const frame = document.querySelector('[class$="_frame"]')
  const scroll = document.querySelector('[data-conversation-scroll]')
  return {
    track: frame === null ? '' : frame.style.gridTemplateColumns,
    padding: scroll === null ? '' : getComputedStyle(scroll).paddingRight,
    instant: root.hasAttribute('data-enhc-instant'),
    opening: root.hasAttribute('data-enhc-opening'),
    glide: root.classList.contains('enhc-panel-glide'),
    inlinePad: scroll === null ? '' : scroll.style.getPropertyValue('padding-right'),
  }
}

/** Is the panel closed (third track 0)? */
const closed = (track) => /minmax\(0px,\s*0px\)\s*$/.test(track || '')

let failures = 0
const check = (name, ok, detail) => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`)
}
const skip = (name, why) => console.log(`SKIP  ${name}  — ${why}`)

/** Frames whose track differs from the first sample's. */
const trackMovedAt = (s) => s.findIndex((f) => f.track !== s[0].track)
/** First frame whose padding differs from the first sample's. */
const padMovedAt = (s) => s.findIndex((f) => f.pad !== s[0].pad)

const gaps = (s) => s.map((f) => f.gap).filter((v) => v > 0)
const pct = (arr, p) => {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))]
}

/** Monotone in one direction, within a 1px tolerance. */
const monotone = (values, dir) => {
  for (let i = 1; i < values.length; i += 1) {
    const step = values[i] - values[i - 1]
    if (dir === 'down' && step > 1) return false
    if (dir === 'up' && step < -1) return false
  }
  return true
}

;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1707, height: 1067 } })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }
  const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
  if (!(await row.count())) { console.error(`FAIL  no session row matching "${SESSION}"`); await browser.close(); process.exit(1) }
  await row.click({ timeout: 8000 })
  await page.waitForTimeout(4500)

  const optionOn = await page.evaluate(() => document.documentElement.classList.contains('enhc-panel-glide'))
  check('the panel-glide option is ON', optionOn)
  if (!optionOn) { await browser.close(); process.exit(1) }

  // Start from the closed state so every arm is a deliberate open.
  let state = await page.evaluate(STATE)
  if (!closed(state.track)) {
    await page.locator('[data-sidebar-right-toggle]').first().click({ timeout: 5000 })
    await page.waitForTimeout(900)
    state = await page.evaluate(STATE)
  }
  check('the right panel starts closed', closed(state.track), state.track)

  // ---- arm A: with a reservation -----------------------------------------
  const reservation = await page.evaluate(RESERVATION_PROBE)
  const hasReservation = Number.parseFloat(reservation) > 0.5
  if (!hasReservation) {
    skip('A. the snap path with a reservation', `nothing reserves the conversation (padding-right ${reservation || '0px'}) — open the pinned summary or the widgets rail`)
  } else {
    console.log(`# reservation before the toggle: ${reservation}`)
    const open = await page.evaluate(IN_PAGE_TRACE, { frames: 46 })
    dump('arm A open', open)
    // The resting width is read AFTER the trace settles, not from the last
    // sample: on a starved page the 46-frame window can end mid-glide, and then
    // the "resting" baseline would be a moving target that makes A1/A4 trivially
    // pass.
    await page.waitForTimeout(250)
    const openRest = await page.evaluate(COL_WIDTH)
    const openCol = open.filter((f) => f.col !== null)
    const finalCol = openCol[openCol.length - 1].col
    const restWidth = openRest === null ? finalCol[1] : openRest
    const narrowest = Math.min(...openCol.map((f) => f.col[1]))
    check('A1. no frame collapses the transcript below its resting width', narrowest >= restWidth - 8,
      `narrowest ${narrowest}px vs resting ${restWidth}px`)
    const openCard = open.filter((f) => f.card !== null)
    const finalCard = openCard[openCard.length - 1].card
    const narrowestCard = Math.min(...openCard.map((f) => f.card[1]))
    check('A1b. the composer does not collapse either', narrowestCard >= finalCard[1] - 8,
      `narrowest ${narrowestCard}px vs resting ${finalCard[1]}px`)
    check('A2. the transcript left edge moves one way (open: leftwards)',
      monotone(openCol.map((f) => f.col[0]), 'down'),
      `left ${openCol[0].col[0]} -> ${finalCol[0]}`)
    const openWidths = [...new Set(openCol.map((f) => f.col[1]))]
    check('A2b. the transcript width lands on the snap frame (<=2 values, shrinking)',
      openWidths.length <= 2 && monotone(openCol.map((f) => f.col[1]), 'down'),
      `${openWidths.length} values: ${JSON.stringify(openWidths)}`)
    const snapAt = trackMovedAt(open)
    const padAt = padMovedAt(open)
    const padThen = padAt >= 0 ? open[padAt].pad : ''
    const held = open.filter((f) => f.hold !== '').length
    check('A3. the reservation is 0 on the TRACK\'s own frame (not one later)',
      snapAt >= 0 && padAt === snapAt && Number.parseFloat(padThen) < 0.5,
      `track frame ${snapAt}, padding frame ${padAt} at ${padThen || '-'}`)
    console.log(`# reservation fallback hold: ${held === 0 ? 'not needed (the owners published in the toggle\'s task)' : `present in ${held} sampled frames`}`)
    // Every carry and the panel's own slide are created in the commit's task, so
    // their start times must agree to within one frame. A later start is exactly
    // the report ("the sidebar arrives first, the middle follows"). A PENDING
    // animation (`startTime === null`, mapped to -1) is not a failure by itself:
    // it means the sample ran in the task the animation was created in, before
    // the timeline resolved — it appears with its real start time on the next
    // sampled frame, and the spread below then sees it.
    const seen = open.flatMap((f) => f.anims)
    const names = new Set(seen.map((a) => a.n))
    const starts = seen.map((a) => a.at).filter((v) => v >= 0)
    const pending = seen.filter((a) => a.at < 0).length
    const spread = starts.length > 1 ? Math.max(...starts) - Math.min(...starts) : 0
    check('A5. the panel and its carries start on one frame',
      names.has('dock') && names.has('col') && spread <= 17,
      `${[...names].join('+') || 'none'} — start spread ${spread}ms over ${starts.length} samples, ${pending} pending`)
    const carryDurations = [...new Set(seen.filter((a) => a.n !== 'dock').map((a) => a.dur))]
    check('A5b. every carry runs the product\'s 300ms window',
      carryDurations.length > 0 && carryDurations.every((d) => Math.abs(d - 300) <= 20),
      `${JSON.stringify(carryDurations)} (dock ${JSON.stringify([...new Set(seen.filter((a) => a.n === 'dock').map((a) => a.dur))])})`)
    console.log(`# carry easings: ${JSON.stringify([...new Set(seen.filter((a) => a.n !== 'dock').map((a) => a.ease))])}`)
    const g = gaps(open)
    console.log(`# open frame gaps: p50 ${pct(g, 0.5)}ms, p95 ${pct(g, 0.95)}ms, max ${pct(g, 1)}ms (${g.length} frames)`)

    await page.waitForTimeout(900)
    const close = await page.evaluate(IN_PAGE_TRACE, { frames: 46 })
    dump('arm A close', close)
    await page.waitForTimeout(250)
    const closeRest = await page.evaluate(COL_WIDTH)
    const closeCol = close.filter((f) => f.col !== null)
    const closeFinal = closeCol[closeCol.length - 1].col
    const closeRestWidth = closeRest === null ? closeFinal[1] : closeRest
    const widest = Math.max(...closeCol.map((f) => f.col[1]))
    const narrowestClose = Math.min(...closeCol.map((f) => f.col[1]))
    check('A4. closing is the mirror: no width overshoot', widest <= closeRestWidth + 8,
      `widest ${widest}px vs resting ${closeRestWidth}px`)
    check('A4a. closing never narrows the transcript either', narrowestClose >= Math.min(...openCol.map((f) => f.col[1])) - 8,
      `narrowest ${narrowestClose}px`)
    check('A4b. the transcript left edge moves one way (close: rightwards)',
      monotone(closeCol.map((f) => f.col[0]), 'up'))
    check('A4c. the close width lands on the snap frame too (<=2 values)',
      new Set(closeCol.map((f) => f.col[1])).size <= 2,
      JSON.stringify([...new Set(closeCol.map((f) => f.col[1]))]))
    const closeTrackAt = trackMovedAt(close)
    const closePadAt = padMovedAt(close)
    const closePadThen = closePadAt >= 0 ? close[closePadAt].pad : ''
    check('A4d. closing restores the reservation on the track\'s own frame',
      closeTrackAt >= 0 && closePadAt === closeTrackAt && Number.parseFloat(closePadThen) > 0.5,
      `track frame ${closeTrackAt}, padding frame ${closePadAt} at ${closePadThen || '-'}`)
    const closeHeld = close.filter((f) => f.hold !== '').length
    console.log(`# close fallback hold: ${closeHeld === 0 ? 'not needed (the owners restored it in the toggle\'s task)' : `present in ${closeHeld} sampled frames`}`)
    const cg = gaps(close)
    console.log(`# close frame gaps: p50 ${pct(cg, 0.5)}ms, p95 ${pct(cg, 0.95)}ms, max ${pct(cg, 1)}ms (${cg.length} frames)`)

    // ---- arm C: rapid clicks ---------------------------------------------
    await page.evaluate(IN_PAGE_STORM)
    await page.waitForTimeout(700)
    const after = await page.evaluate(STATE)
    check('C1. the storm leaves no root attributes', !after.instant && !after.opening,
      JSON.stringify({ instant: after.instant, opening: after.opening }))
    check('C2. the storm leaves no inline padding', after.inlinePad === '', `inline "${after.inlinePad}"`)
    check('C3. the page logged no errors', errors.length === 0, errors.join(' | '))

    // Back to closed for arm B.
    state = await page.evaluate(STATE)
    if (!closed(state.track)) { await page.locator('[data-sidebar-right-toggle]').first().click(); await page.waitForTimeout(900) }
  }

  // ---- arm B: without a reservation --------------------------------------
  await page.evaluate(() => {
    const root = document.documentElement
    root.style.setProperty('--dps-right-space', '0px')
    root.style.setProperty('--dsx-rail-w', '0px')
    const scroll = document.querySelector('[data-conversation-scroll]')
    if (scroll !== null) scroll.style.setProperty('padding-right', '0px', 'important')
  })
  await page.waitForTimeout(400)
  const noRes = await page.evaluate(RESERVATION_PROBE)
  check('B0. the reservation is pinned to 0', Number.parseFloat(noRes) < 0.5, noRes)
  const snap = await page.evaluate(IN_PAGE_TRACE, { frames: 40 })
  const tracks = new Set(snap.map((f) => f.track))
  check('B1. the track still snaps (one edge pair, no glide)', tracks.size <= 2, `${tracks.size} distinct tracks`)
  check('B2. a carry still runs on the transcript column', snap.some((f) => f.anims.some((a) => a.n === 'col')),
    JSON.stringify([...new Set(snap.flatMap((f) => f.anims.map((a) => a.n)))]))
  // The gate is released at `HOLD_MS` and deferred while a cover is still moving,
  // so on a starved page it can outlive the 40-frame trace. Assert the RELEASE
  // rather than a timing, with a hard timeout (the deadline is HOLD_MS + 400ms).
  let gateReleased = false
  for (let wait = 0; wait < 12 && !gateReleased; wait += 1) {
    gateReleased = (await page.evaluate(STATE)).instant === false
    if (!gateReleased) await page.waitForTimeout(100)
  }
  check('B3. the snap releases the gate', gateReleased)

  console.log(`\n${failures === 0 ? 'PASSED' : 'FAILED'} — panel squeeze paths`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})()
