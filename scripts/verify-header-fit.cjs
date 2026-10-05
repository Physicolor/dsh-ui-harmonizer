/**
 * dsh-ui-harmonizer — the header's fit contract (session-header.module.css +
 * header-fit.ts + the `width` cover in chrome/instant-track.ts).
 *
 * Three behaviours, one surface. The right-panel toggle rewrites the frame's
 * centre track, and the header sits in that track, so the header widen/shrink is
 * the moment all three can go wrong at once:
 *
 * A. THE TAB STRIP MUST NOT WRAP (session-header.module.css)
 *
 * The strip is relocated into the 30px title row and arrives with the product's
 * `flex: 0 1 auto` + `min-width: auto`. A narrow header therefore squeezes it
 * until its capsule labels wrap, which doubles the strip's height (26 -> 58) and
 * the header's with it (50 -> 78) — the reported "空间不足会导致挤压文字换行".
 * The fix is one declaration (`flex: none`); this script is what proves it holds
 * on every frame of the animation, not just in the settled state.
 *
 * B. THE HEADER MUST GLIDE (chrome/instant-track.ts, the `width` cover)
 *
 * The header's left edge is pinned and its right edge is the panel's, so the
 * track change is a WIDTH change. Without a cover the header snaps in the
 * click's own commit (measured: painted width 1427 -> 659 in one frame while
 * the transcript glides), which is the "顶部栏直接变化而非平滑移动" report.
 * The cover animates the header's width from the pre-click value to the settled
 * one, which moves everything inside it for free — title, badges, tabs and the
 * right-hand buttons.
 *
 * C. THE BADGES MUST BE SPENT IN ORDER (header-fit.ts)
 *
 * With the strip unshrinkable the only flexible item left is the title, so
 * without a policy the title collapses to 0px while the badges keep all 312px
 * of the row. The fit hides 标准模式, then 智能体团队, then 子智能体 (then any
 * badge it cannot name) until the title clears its legibility floor, and gives
 * them back when the row grows.
 *
 * CHECK LIST
 *   1. closed baseline: strip 26px tall, header 50px, nothing hidden, and the
 *      reference session still carries the badges this suite names, in ladder
 *      order;
 *   2. opening glides the header (>=5 distinct painted widths, starting near
 *      the closed one);
 *   3. no sampled frame of that glide wraps the strip (<=27px) or grows the
 *      header (<=52px);
 *   4. the hidden set only ever grows during an open (progressive, not flappy);
 *   5. settled open: the hidden set is a PREFIX of the ladder, and the title
 *      either clears its floor or every badge is gone;
 *   6. closing restores every badge and the closed geometry;
 *   7. the strip and the header hold their size at 1440/1280/1152/1024 in BOTH
 *      panel states — the wrap is a function of the row width, not of the panel;
 *   8. no `data-enhc-header-hidden` survives in a wide, closed header.
 *
 *   node scripts/verify-header-fit.cjs [--session <substring>] [--url <url>]
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
const SESSION = arg('--session', '修复右侧边栏开合动画')

/**
 * The rung order the fit must walk (header-fit.ts's RANK), and the order this
 * reference session's badges fall into under it: the preset label, then the
 * subagent catalog, then the background-task counter, which the module cannot
 * name and therefore spends last.
 */
const RANK = { preset: 0, team: 1, subagent: 2, other: 3 }
const LADDER = ['preset', 'subagent', 'other']
/** px the title keeps before the fit spends another badge (header-fit.ts). */
const FLOOR = 160
/** The strip's one-line height and the header's single-row height. */
const TABS_H = 26
const HEADER_H = 50

/* Badge identity is re-derived HERE, in Node, from the kinds the page reported —
 * deliberately not imported from header-fit.ts. A check that re-used the
 * module's own classifier could not catch a classifier that had started naming
 * the wrong badge, which is the failure this suite most needs to see. The page
 * side of it is the `kindOf` inlined in `READ`. */

/** The reference session's badges, sorted into ladder order, with their rung. */
const orderedBadges = (badges) => badges
  .map((b, index) => ({ ...b, index, rank: RANK[b.kind] }))
  .sort((a, b) => a.rank - b.rank || a.index - b.index)
/**
 * Does the hidden set form a prefix of the ladder?
 * @returns the rung it corresponds to, or -1 when the set is not a prefix.
 */
const hiddenIsPrefix = (state) => {
  const ordered = orderedBadges(state.badges)
  const cut = ordered.filter((b) => b.hidden).length
  return ordered.every((b, i) => b.hidden === (i < cut)) ? cut : -1
}
/** The kinds of every hidden badge, in ladder order — for check details. */
const gone = (state) => orderedBadges(state.badges).filter((b) => b.hidden).map((b) => b.kind).join(', ')

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
 * One header geometry read.
 *
 * `hidden` is read from the DOM attribute the fit writes, in DOCUMENT order, so
 * the ladder's prefix property is checkable without trusting the module's own
 * bookkeeping.
 */
const READ = () => {
  const CL = "[class$='_titleCluster']"
  const q = (s) => document.querySelector(s)
  const round = (v) => Math.round(v * 10) / 10
  const kindOf = (el) => {
    if (el.querySelector('[aria-haspopup="tree"]') !== null) return 'subagent'
    if (el.matches('[data-team-action]') || el.querySelector('[data-team-action]') !== null) return 'team'
    if (el.tagName === 'SPAN') return 'preset'
    return 'other'
  }
  const header = q("[data-slot='conversation.header'] > header:has([class$='_tabs']), [data-slot='conversation.session.header'] > header")
  const tabs = q(`${CL} > [class$='_tabs']`)
  const crumbs = q(`${CL} > [class$='_crumbs']`)
  const seat = q("[data-slot='conversation.session.header.actions']")
  const badges = seat === null ? [] : [...seat.children].map((el) => ({
    kind: kindOf(el),
    text: (el.textContent || '').trim().slice(0, 8),
    hidden: el.hasAttribute('data-enhc-header-hidden'),
  }))
  return {
    headerW: header === null ? null : round(header.getBoundingClientRect().width),
    headerH: header === null ? null : round(header.getBoundingClientRect().height),
    tabsW: tabs === null ? null : round(tabs.getBoundingClientRect().width),
    tabsH: tabs === null ? null : round(tabs.getBoundingClientRect().height),
    crumbsW: crumbs === null ? null : crumbs.clientWidth,
    badges,
    hiddenCount: badges.filter((b) => b.hidden).length,
  }
}

/** The same read, every frame, for `ms` — the click happens from Node. */
const TRACE = (ms) => new Promise((resolve) => {
  const CL = "[class$='_titleCluster']"
  const q = (s) => document.querySelector(s)
  const round = (v) => Math.round(v * 10) / 10
  const rows = []
  const t0 = performance.now()
  const tick = () => {
    const header = q("[data-slot='conversation.header'] > header:has([class$='_tabs']), [data-slot='conversation.session.header'] > header")
    const tabs = q(`${CL} > [class$='_tabs']`)
    rows.push({
      t: Math.round(performance.now() - t0),
      headerW: header === null ? null : round(header.getBoundingClientRect().width),
      headerH: header === null ? null : round(header.getBoundingClientRect().height),
      tabsH: tabs === null ? null : round(tabs.getBoundingClientRect().height),
      hiddenCount: document.querySelectorAll('[data-enhc-header-hidden]').length,
    })
    if (performance.now() - t0 > ms) resolve(rows)
    else requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

let failures = 0
const check = (name, ok, detail) => { if (!ok) failures += 1; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

/** Distinct values of one key in a trace, to the half-pixel. */
const distinct = (rows, key) => [...new Set(rows.map((r) => r[key]).filter((v) => v !== null))].length

;(async () => {
  const c = authCookie()
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1707, height: 1067 } })
  await ctx.addCookies([{ name: c.name, value: c.value, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }])
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL_, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(5000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1200) }
  await page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first().click({ timeout: 8000 })
  await page.waitForTimeout(4000)

  const toggle = page.locator('[data-sidebar-right-toggle],[data-sidebar-right-expand]').first()
  const closed = await page.evaluate(READ)

  check('1. closed baseline: strip on one line, header one row, nothing hidden',
    closed.tabsH === TABS_H && closed.headerH === HEADER_H && closed.hiddenCount === 0,
    `strip ${closed.tabsW}x${closed.tabsH}, header w=${closed.headerW} h=${closed.headerH}, hidden=[${gone(closed)}]`)
  check('1b. the reference session still carries the badges this suite names, in ladder order',
    JSON.stringify(orderedBadges(closed.badges).map((b) => b.kind)) === JSON.stringify(LADDER),
    `badges=[${orderedBadges(closed.badges).map((b) => `${b.kind}:${b.text}`).join(', ')}]`)

  // --- B: the open glide, sampled every frame --------------------------------
  const openTrace = page.evaluate(TRACE, 1000)
  await toggle.click()
  const openRows = await openTrace
  await page.waitForTimeout(500)
  const open = await page.evaluate(READ)

  const openWidths = distinct(openRows, 'headerW')
  const firstWidth = openRows.find((r) => r.headerW !== null)
  const settledWidth = openRows[openRows.length - 1]
  check('2. opening glides the header (>=5 distinct painted widths)',
    openWidths >= 5,
    `${openWidths} distinct widths, first ${firstWidth === undefined ? '?' : firstWidth.headerW}px (closed ${closed.headerW}px) -> settled ${settledWidth.headerW}px, ${openRows.length} frames`)
  check('2b. the glide starts at the closed width, not the open one',
    firstWidth !== undefined && firstWidth.headerW !== null && Math.abs(firstWidth.headerW - closed.headerW) <= 24,
    `first sampled ${firstWidth === undefined ? '?' : firstWidth.headerW}px vs closed ${closed.headerW}px`)
  const worstTabs = openRows.reduce((m, r) => (r.tabsH !== null && r.tabsH > m ? r.tabsH : m), 0)
  const worstHeader = openRows.reduce((m, r) => (r.headerH !== null && r.headerH > m ? r.headerH : m), 0)
  check('3. no frame of the glide wraps the strip or grows the header',
    worstTabs <= TABS_H + 1 && worstHeader <= HEADER_H + 2,
    `worst strip ${worstTabs}px, worst header ${worstHeader}px over ${openRows.length} frames`)
  let rungDrops = 0
  for (let i = 1; i < openRows.length; i += 1) {
    if (openRows[i].hiddenCount < openRows[i - 1].hiddenCount) rungDrops += 1
  }
  check('4. the hidden set only grows while the header narrows',
    rungDrops === 0,
    `rung went backwards on ${rungDrops} of ${openRows.length - 1} frame pairs`)

  // --- C: the settled open state --------------------------------------------
  check('5. settled open: the hidden set is a prefix of the ladder',
    hiddenIsPrefix(open) >= 0,
    `ladder=[${LADDER.join(', ')}] hidden=[${gone(open)}] (document order: [${open.badges.map((b) => b.kind).join(', ')}])`)
  check('5b. settled open: the title clears its floor, or every badge was spent',
    open.crumbsW >= FLOOR || open.hiddenCount === open.badges.length,
    `title ${open.crumbsW}px (floor ${FLOOR}px), ${open.hiddenCount}/${open.badges.length} badges hidden`)
  check('5c. settled open: still one line',
    open.tabsH === TABS_H && open.headerH === HEADER_H,
    `strip ${open.tabsW}x${open.tabsH}, header h=${open.headerH}`)

  // --- the close glide ------------------------------------------------------
  const closeTrace = page.evaluate(TRACE, 1000)
  await toggle.click()
  const closeRows = await closeTrace
  await page.waitForTimeout(500)
  const back = await page.evaluate(READ)
  check('6. closing glides back (>=5 distinct painted widths)',
    distinct(closeRows, 'headerW') >= 5,
    `${distinct(closeRows, 'headerW')} distinct widths, settled ${closeRows[closeRows.length - 1].headerW}px`)
  check('6b. closing restores every badge and the closed geometry',
    back.hiddenCount === 0 && back.tabsH === TABS_H && back.headerH === HEADER_H &&
      Math.abs(back.headerW - closed.headerW) <= 1 && back.crumbsW === closed.crumbsW,
    `hidden=[${gone(back)}], strip ${back.tabsW}x${back.tabsH}, header w=${back.headerW} h=${back.headerH}, title ${back.crumbsW}px`)

  // --- 7: the wrap is a function of the row width, not of the panel ---------
  const sweep = []
  for (const w of [1440, 1280, 1152, 1024]) {
    await page.setViewportSize({ width: w, height: 1067 })
    await page.waitForTimeout(420)
    await page.mouse.move(400, 700)
    await page.waitForTimeout(220)
    const closedAt = await page.evaluate(READ)
    await toggle.click()
    await page.waitForTimeout(1000)
    await page.mouse.move(400, 700)
    await page.waitForTimeout(260)
    const openAt = await page.evaluate(READ)
    sweep.push({ w, closedAt, openAt })
    await toggle.click()
    await page.waitForTimeout(900)
  }
  const bad = sweep.filter((s) =>
    s.closedAt.tabsH !== TABS_H || s.closedAt.headerH !== HEADER_H ||
    s.openAt.tabsH !== TABS_H || s.openAt.headerH !== HEADER_H)
  check('7. strip and header hold their size at every width, both panel states',
    bad.length === 0,
    sweep.map((s) => `${s.w}: closed ${s.closedAt.tabsH}/${s.closedAt.headerH}, open ${s.openAt.tabsH}/${s.openAt.headerH}`).join(' | '))

  // --- 8: no residue --------------------------------------------------------
  await page.setViewportSize({ width: 1707, height: 1067 })
  await page.waitForTimeout(420)
  await page.mouse.move(400, 700)
  await page.waitForTimeout(300)
  const residue = await page.evaluate((sel) => document.querySelectorAll(sel).length, '[data-enhc-header-hidden]')
  check('8. no hidden-badge attribute survives in a wide, closed header',
    residue === 0,
    `${residue} node(s) still carrying data-enhc-header-hidden`)

  check('9. no page errors', errors.length === 0, errors.join(' | '))

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
