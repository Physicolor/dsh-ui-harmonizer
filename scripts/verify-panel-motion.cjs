/**
 * Verify the right-panel toggle's MOTION contract, frame by frame.
 *
 * The toggle has to satisfy four things at once, and each of them was a real
 * defect on this page at some point:
 *
 *   1. the conversation GLIDES — the painted box takes more than two positions
 *      across the trace, so it is not the hard cut a "just land it" build ships;
 *   2. it starts at its OWN position — the first sampled frame after the commit
 *      has the same left edge it had before the click;
 *   3. it is never CUT — the painted right edge stays inside the clip it is drawn
 *      in at every sampled frame (the clip is the conversation scroll body's
 *      padding box, which the panel takes 768px out of in the same commit);
 *   4. it LANDS EXACTLY — once the ease is over the painted box equals the
 *      resting box, and no inline width/offset survives on any host or on the
 *      clip.
 *
 * Sampled inside the page's own rAF callback, i.e. against the geometry of the
 * frame that is about to be painted. The click happens at frame 3 so the pre
 * toggle values are sampled too.
 *
 *   node scripts/verify-panel-motion.cjs [--url http://127.0.0.1:62624] [--session <substr>]
 *
 * Exit code 0 when every check passes.
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
  try { ({ chromium } = require(candidate)); break } catch { /* next */ }
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
const SESSION = arg('--session', '')

/** Session cookie, signed with the local install's own secret. */
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
 * One toggle, one sample per frame.
 *
 * `clip` is the scroll body's padding box: `clientWidth` excludes the scrollbar
 * and `padding-right` is inside it, so the content's clip is
 * `[rect.left, rect.right - scrollbar]`. Both the painted boxes and that edge are
 * sampled from the same frame, which is what makes "cut" a measurable predicate
 * rather than a screenshot judgement.
 */
const TRACE = (ms) => new Promise((resolve) => {
  const q = (s) => document.querySelector(s)
  const frameEl = () => q('[class$="_frame"]')
  const rows = []
  const t0 = performance.now()
  let clicked = false
  let frames = 0
  const box = (el) => {
    if (el === null || !el.isConnected) return null
    const r = el.getBoundingClientRect()
    return r.width > 0 ? { l: Math.round(r.left * 10) / 10, w: Math.round(r.width * 10) / 10 } : null
  }
  const tick = () => {
    if (!clicked && frames >= 3) {
      const b = q('[data-sidebar-right-toggle]') ?? q('[data-sidebar-right-expand]')
      if (b) b.click()
      clicked = true
    }
    const clip = q('[class$="_scrollBody"]')
    let clipRight = null
    if (clip !== null) {
      const r = clip.getBoundingClientRect()
      clipRight = Math.round((r.right - (clip.offsetWidth - clip.clientWidth)) * 10) / 10
    }
    const prose = q('[class$="_column"]')
    const capsule = q('[data-slot="conversation.composer.bar"] [class*="_card"]')
    const rail = q('.dsx-stats-rail')
    rows.push({
      t: Math.round(performance.now() - t0),
      clicked,
      prose: box(prose),
      capsule: box(capsule),
      clipRight,
      proseInline: prose === null ? null : `${prose.style.width}|${prose.style.transform}`,
      clipInline: clip === null ? null : clip.style.width,
      rail: rail === null ? null : Math.round(rail.getBoundingClientRect().left * 10) / 10,
      open: frameEl() === null ? null : !/minmax\([^,]+,\s*0px\s*\)\s*$/.test(frameEl().style.gridTemplateColumns),
    })
    frames += 1
    if (performance.now() - t0 > ms) resolve(rows)
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

/** Distinct painted left edges of one host across the post-click frames. */
const distinctLefts = (rows, key) => {
  const seen = rows.filter((r) => r.clicked && r[key] !== null).map((r) => Math.round(r[key].l))
  return [...new Set(seen)]
}

/** Largest amount by which a host was painted past the clip, in px. */
const worstCut = (rows, key) => {
  let worst = 0
  for (const row of rows) {
    if (row[key] === null || row.clipRight === null) continue
    worst = Math.max(worst, row[key].l + row[key].w - row.clipRight)
  }
  return Math.round(worst * 10) / 10
}

let failures = 0
const check = (name, ok, detail) => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`)
}

/** The pre-click resting box of one host, and the resting box after the trace. */
const restBox = (rows, key, clicked) => {
  const pick = rows.filter((r) => r[key] !== null && r.clicked === clicked)
  if (pick.length === 0) return null
  const row = clicked ? pick[pick.length - 1] : pick[pick.length - 1]
  return { l: Math.round(row[key].l * 10) / 10, w: Math.round(row[key].w * 10) / 10 }
}

;;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1707, height: 1067 } })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message ?? e)))
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }
  const rows = page.locator('div[class*="sessionRow"]')
  // Row 0 is the empty "new session" placeholder, which has no transcript column
  // at all; a named session that is not in the list falls back to the newest real
  // one, so the suite still runs on a page whose recency list moved.
  const named = SESSION === '' ? rows.first() : rows.filter({ hasText: SESSION }).first()
  const target = (await named.count()) ? named : rows.nth(1)
  if (!(await target.count())) { console.error('FAIL  no session row to open'); await browser.close(); process.exit(1) }
  await target.click({ timeout: 15000 })
  await page.waitForTimeout(5000)

  console.log(`# panel glide option: ${await page.evaluate(() => document.documentElement.classList.contains('enhc-panel-glide')) ? 'ON' : 'OFF'}`)

  for (const direction of ['open', 'close']) {
    const isOpen = () => page.evaluate(() => {
      const f = document.querySelector('[class$="_frame"]')
      return f === null ? null : !/minmax\([^,]+,\s*0px\s*\)\s*$/.test(f.style.gridTemplateColumns)
    })
    const wantOpen = direction === 'open'
    if ((await isOpen()) === wantOpen) {
      await page.evaluate(() => (document.querySelector('[data-sidebar-right-toggle]') ?? document.querySelector('[data-sidebar-right-expand]')).click())
      await page.waitForTimeout(1600)
    }
    const trace = await page.evaluate(TRACE, 1200)
    const before = trace.filter((r) => !r.clicked && r.prose !== null)
    const startBox = before.length === 0 ? null : before[before.length - 1].prose
    const after = trace.filter((r) => r.clicked && r.prose !== null)
    const endBox = after.length === 0 ? null : after[after.length - 1].prose
    const lefts = distinctLefts(trace, 'prose')
    console.log(`\n=== ${direction.toUpperCase()} — ${trace.length} frames, ${lefts.length} distinct column lefts ===`)
    check(`${direction}: the conversation glides (more than two painted lefts)`,
      lefts.length > 2 && Math.max(...lefts) - Math.min(...lefts) > 20,
      `lefts ${JSON.stringify(lefts.slice(0, 10))}${lefts.length > 10 ? '…' : ''} spread ${lefts.length > 1 ? Math.max(...lefts) - Math.min(...lefts) : 0}px`)
    check(`${direction}: the first carried frame starts at its own left edge`,
      startBox !== null && after.length > 0 && Math.abs(after[0].prose.l - startBox.l) <= 2,
      `pre ${startBox === null ? '-' : startBox.l}, first carried ${after.length === 0 ? '-' : after[0].prose.l}`)
    check(`${direction}: the conversation is never painted outside its clip`,
      worstCut(trace, 'prose') <= 2 && worstCut(trace, 'capsule') <= 2,
      `prose ${worstCut(trace, 'prose')}px, capsule ${worstCut(trace, 'capsule')}px`)
    check(`${direction}: it lands exactly on the resting box`,
      endBox !== null && after.length > 1 && Math.abs(after[after.length - 1].prose.l - endBox.l) <= 1 && Math.abs(after[after.length - 1].prose.w - endBox.w) <= 1,
      `end ${endBox === null ? '-' : `${endBox.l}/${endBox.w}`}`)
    const leftovers = await page.evaluate(() => {
      const q = (s) => document.querySelector(s)
      const clip = q('[class$="_scrollBody"]')
      const prose = q('[class$="_column"]')
      const capsule = q('[data-slot="conversation.composer.bar"] [class*="_card"]')
      return {
        clip: clip === null ? '' : clip.style.width,
        prose: prose === null ? '' : `${prose.style.width}|${prose.style.transform}`,
        capsule: capsule === null ? '' : `${capsule.style.width}|${capsule.style.left}`,
      }
    })
    check(`${direction}: no carry style survives the toggle`,
      leftovers.clip === '' && !leftovers.prose.includes('translateX') && !leftovers.prose.includes('px|') && leftovers.capsule === '|',
      JSON.stringify(leftovers))
    const railDrift = (() => {
      const xs = trace.map((r) => r.rail).filter((v) => v !== null)
      return xs.length < 2 ? 0 : Math.max(...xs) - Math.min(...xs)
    })()
    check(`${direction}: the drag rail does not move`, railDrift < 2, `${railDrift.toFixed(1)}px`)
  }
  check('the page logged no errors', errors.length === 0, errors.join(' | '))

  console.log(`\n${failures === 0 ? 'PASSED' : `FAILED — ${failures} check(s)`} — panel motion`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})()
