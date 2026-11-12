/**
 * Verify the turn navigator's reveal — the acceptance test for
 * `harness/turn-navigator-room.ts` + `.module.css`.
 *
 * The product hides 轮次导航 from a container query on the navigator's own slot
 * (`@container (width <= 900px) { .frame { display: none } }`), and that slot's
 * inline size is the conversation scroll box's content width. So a third-party
 * `padding-right` reservation on that box (dsh-widgets' rail, dsh-pinned-summary)
 * switches the navigator off while the transcript still has slack to give. The
 * harmonizer measures the free width beside the transcript and re-allows the
 * navigator when the *  real * clearance is there.
 *
 * What this asserts, per viewport arm:
 *   1. FLAG HONESTY — `data-nav-room` is exactly the module's own rule over the
 *      published `--enhc-nav-free` / `--enhc-nav-needed` (no drift between the
 *      measurement and the gate).
 *   2. REVEAL — the navigator is visible whenever the flag is set and the
 *      product's container query is satisfied; hidden whenever it is not.
 *   3. NO COLLISION — when visible, the navigator's box overlaps neither the
 *      transcript column nor the product's width handle.
 *   4. HIT-TESTABLE — the visible navigator is really on top: `elementFromPoint`
 *      inside its box resolves inside it.
 *
 * Read-only. Never writes to the app; the reveal comes from the shipped bundle.
 *
 * Run: node scripts/probes/views/verify-turn-navigator-room.mjs [url] [sessionTitle]
 */
import path from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { readBrowserSecret, mintCookie } from '../../lib/auth.mjs'

const WIDGETS_LIB = process.env.DSH_WIDGETS_LIB ?? 'D:/dsh-home/plugins/dsh-widgets/scripts/lib'
const require = createRequire(path.join(WIDGETS_LIB, 'x.cjs'))
const { chromium } = require(path.join(WIDGETS_LIB, 'playwright-core.cjs'))
const { chromePath } = require(path.join(WIDGETS_LIB, 'chrome.cjs'))

const URL_ARG = process.argv[2] ?? (process.env.DSH_LIVE_AUTHORITY ? `http://${process.env.DSH_LIVE_AUTHORITY}` : 'http://127.0.0.1:19387')
const TITLE = process.argv[3] ?? '对话区域的右侧区域'
const OUT = path.resolve(import.meta.dirname, '..', '..', '.tmp-nav-room', 'verify')
mkdirSync(OUT, { recursive: true })

/** Viewport arms: the rail is on in this profile, so these are narrow-to-wide. */
const WIDTHS = [1280, 1440, 1600, 1760, 1920, 2200, 2560]

/**
 * One evaluation per arm: the published gate, the product's own state, and every
 * geometric fact the assertions need.
 */
const MEASURE = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), right: +r.right.toFixed(1), left: +r.left.toFixed(1) } }
  const cs = el => getComputedStyle(el)
  const root = document.documentElement
  const slot = document.querySelector("[data-conversation-scroll] [class$='_slot']:has(> nav)")
  const nav = slot === null ? null : slot.querySelector(':scope > nav')
  const scroll = document.querySelector('[data-conversation-scroll]')
  const column = scroll === null ? null : scroll.querySelector("[class$='_column']")
  const handle = document.querySelector('[data-width-handle]')
  const handleVisible = handle !== null && cs(handle).display !== 'none' && handle.getBoundingClientRect().width > 0
  const scrollBox = scroll === null ? null : R(scroll)
  const columnBox = column === null ? null : R(column)
  const navBox = nav === null ? null : R(nav)
  const colBox = columnBox
  const handleBox = handleVisible ? R(handle) : null
  let hit = null
  if (navBox !== null && navBox.w > 0 && navBox.h > 0) {
    // Sample the marks themselves: they are the navigator's interactive content,
    // and the frame's own box can be shorter than the marks it positions.
    const marks = nav === null ? [] : [...nav.querySelectorAll('button')]
      .map(b => R(b))
      .filter(b => Number.isFinite(b.w) && Number.isFinite(b.h) && Number.isFinite(b.left) && Number.isFinite(b.top) && b.w > 0 && b.h > 0)
      .slice(0, 4)
    const hits = marks.map(b => {
      const x = Math.round(b.left + b.w / 2)
      const y = Math.round(b.top + b.h / 2)
      if (!Number.isFinite(x) || !Number.isFinite(y)) return false
      const el = document.elementFromPoint(x, y)
      return el !== null && nav.contains(el)
    })
    hit = { total: hits.length, inside: hits.filter(Boolean).length }
  }
  const overlaps = (a, b) => a !== null && b !== null && a.w > 0 && a.h > 0 && b.w > 0 && b.h > 0 &&
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  const scrollStyle = scroll === null ? null : cs(scroll)
  const padL = scrollStyle === null ? 0 : (Number.parseFloat(scrollStyle.paddingLeft) || 0)
  const padR = scrollStyle === null ? 0 : (Number.parseFloat(scrollStyle.paddingRight) || 0)
  const colW = colBox === null ? null : colBox.w
  const independentFree = scrollBox === null || colBox === null ? null
    : +(((scrollBox.w - padL - padR) - colW) / 2).toFixed(1)
  const fullBoxFree = scrollBox === null || colBox === null ? null
    : +((scrollBox.w - colW) / 2).toFixed(1)
  return {
    vw: innerWidth,
    flag: root.getAttribute('data-nav-room'),
    free: Number.parseFloat(cs(root).getPropertyValue('--enhc-nav-free')) || 0,
    freeLeft: Number.parseFloat(cs(root).getPropertyValue('--enhc-nav-free-left')) || 0,
    needed: Number.parseFloat(cs(root).getPropertyValue('--enhc-nav-needed')) || 0,
    independentFree,
    fullBoxFree,
    rail: cs(root).getPropertyValue('--dsx-rail-w').trim(),
    scrollPadRight: scroll === null ? null : cs(scroll).paddingRight,
    scrollPadLeft: scroll === null ? null : cs(scroll).paddingLeft,
    scrollBox: scroll === null ? null : R(scroll),
    columnBox: column === null ? null : R(column),
    columnMaxWidth: column === null ? null : cs(column).maxWidth,
    transcriptChars: scroll === null ? 0 : (scroll.textContent || '').length,
    scrollTop: scroll === null ? null : Math.round(scroll.scrollTop),
    slotFound: slot !== null,
    slotClientW: slot === null ? null : slot.clientWidth,
    containerOk: slot !== null && slot.clientWidth > 900,
    navExists: nav !== null,
    navDisplay: nav === null ? null : cs(nav).display,
    navBox, colBox, handleBox,
    marks: nav === null ? 0 : nav.querySelectorAll('button').length,
    collideColumn: overlaps(navBox, colBox),
    collideHandle: overlaps(navBox, handleBox),
    hit,
  }
})()`

/** The module's rule, re-derived here so the flag can be checked for honesty. */
const expectedGate = (m) => m.flag === '1' && m.needed > 0 && m.free >= m.needed
/** The product's own condition for showing the navigator: not `display: none`. */
const visible = (m) => m.navExists && m.navDisplay !== 'none'

/**
 * Assert one arm: the flag is the module's rule, the reveal is exactly the flag,
 * nothing collides, and the revealed navigator is hit-testable.
 * @param arm - human label for the failure messages.
 * @param m - the arm's measurement.
 */
function assertArm(arm, m) {
  const gate = expectedGate(m)
  // 1. the flag is exactly the module's rule
  check((m.flag === '1') === gate, arm, 'data-nav-room does not match free>=needed', `flag=${m.flag} free=${m.free} needed=${m.needed}`)
  // 2. the published number is reproducible from the geometry, independently
  if (m.independentFree !== null && m.free > 0) {
    check(Math.abs(m.free - m.independentFree) <= 1, arm, 'published free width disagrees with the geometry', `free=${m.free} independent=${m.independentFree}`)
  }
  // 3. the reveal follows the measurement (no container query can veto it)
  check(visible(m) === gate, arm, 'reveal does not follow the gate', `visible=${visible(m)} gate=${gate}`)
  if (!gate) {
    check(m.hit === null || m.hit.total === 0 || m.navDisplay === 'none', arm, 'hidden navigator still reports hits', JSON.stringify(m.hit))
    return
  }
  // 4. no collision while visible
  check(!m.collideColumn, arm, 'navigator overlaps the transcript column')
  check(!m.collideHandle, arm, 'navigator overlaps the width handle')
  // 5. hit-testable
  check(m.hit !== null && m.hit.total > 0 && m.hit.inside === m.hit.total, arm, 'navigator is not hit-testable', JSON.stringify(m.hit))
}

const failures = []
const rows = []
const check = (ok, arm, what, detail) => {
  if (!ok) failures.push(`${arm}: ${what}${detail === undefined ? '' : ` (${detail})`}`)
}

const context = await chromium.launchPersistentContext(path.join(OUT, 'pw-profile'), {
  executablePath: chromePath(), headless: true, viewport: { width: 1600, height: 1000 },
})
{
  const authority = new URL(URL_ARG).host
  const c = mintCookie({ secret: readBrowserSecret(process.env.DSH_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'), authority, days: 1 })
  await context.addCookies([{ name: c.name, value: c.value, domain: new URL(URL_ARG).hostname, path: '/', httpOnly: true, sameSite: 'Strict', expires: Math.floor(c.expiresAt / 1000) }])
}
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(6000)

// The plugin's own sheet must be on the page — otherwise an "all hidden" run
// would look like a pass.
const sheet = await page.evaluate(() => document.querySelector("style[data-plugin-css$='turn-navigator-room.module.css']") !== null)
if (!sheet) {
  console.log('FAIL: the harmonizer stylesheet is not loaded — rebuild/restart before verifying')
  await context.close()
  process.exit(1)
}

// Open a conversation with more than a couple of turns so the navigator exists.
const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
for (let i = 0; i < Math.min(await groups.count(), 4); i++) {
  const g = groups.nth(i)
  if ((await g.getAttribute('aria-expanded').catch(() => null)) === 'false') { await g.click().catch(() => {}); await page.waitForTimeout(250) }
}
const rowsLoc = page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")
let opened = false
for (let i = 0; i < await rowsLoc.count(); i++) {
  const text = await rowsLoc.nth(i).innerText().catch(() => '')
  if (!text.includes(TITLE)) continue
  await rowsLoc.nth(i).click().catch(() => {})
  opened = true
  break
}
console.log('session opened:', opened, '| title filter:', TITLE)

// The product mounts the navigator only once `useChatScroll` reports the view
// initialized, which depends on the session's turn data arriving — wait for it
// instead of racing it.
const mounted = await page.waitForFunction(
  () => document.querySelector("[data-conversation-scroll] [class$='_slot']:has(> nav)") !== null,
  undefined,
  { timeout: 45000 },
).then(() => true).catch(() => false)
console.log('turn navigator present:', mounted)
if (!mounted) {
  const why = await page.evaluate(() => ({
    scroll: document.querySelector('[data-conversation-scroll]') !== null,
    slots: [...document.querySelectorAll("[class$='_slot']")].map(s => String(s.className)),
    navs: [...document.querySelectorAll('nav')].map(n => String(n.className)),
  }))
  console.log('diagnosis:', JSON.stringify(why))
}

/**
 * Wait until the layout stops moving. A rail/sidebar reservation animates its
 * own padding, and the module re-measures from a ResizeObserver, so sampling
 * mid-transition would compare two different layouts.
 * @param timeoutMs - how long to wait for a stable sample before giving up.
 */
async function settle(timeoutMs = 6000) {
  const key = () => page.evaluate(() => {
    const scroll = document.querySelector('[data-conversation-scroll]')
    const column = scroll === null ? null : scroll.querySelector("[class$='_column']")
    if (scroll === null) return 'none'
    const style = getComputedStyle(scroll)
    return [Math.round(scroll.getBoundingClientRect().width), style.paddingRight, style.paddingLeft, column === null ? '-' : Math.round(column.getBoundingClientRect().width * 100)].join(':')
  })
  const deadline = Date.now() + timeoutMs
  let last = await key()
  for (;;) {
    await page.waitForTimeout(220)
    const next = await key()
    if (next === last) return next
    last = next
    if (Date.now() > deadline) return next
  }
}

/**
 * Wait until the navigator's own content is laid out. Its marks are positioned
 * by the product's virtualizer, which settles a frame or two after the host box
 * does — measuring earlier reads 0x0 boxes that exist but have no transform yet.
 * @param timeoutMs - how long to wait before measuring anyway.
 */
async function marksReady(timeoutMs = 4000) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const ok = await page.evaluate(() => {
      const nav = document.querySelector("[data-conversation-scroll] [class$='_slot']:has(> nav) > nav")
      if (nav === null) return false
      return [...nav.querySelectorAll('button')].some((b) => {
        const r = b.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      })
    }).catch(() => false)
    if (ok || Date.now() > deadline) return ok
    await page.waitForTimeout(160)
  }
}

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 1000 })
  await settle()
  await marksReady()
  const m = await page.evaluate(MEASURE)
  rows.push(m)
  assertArm(`${width}px`, m)
}

/**
 * Flip one labelled header toggle and wait for the layout to settle.
 * @param labels - candidate aria-labels / text, first match wins.
 * @returns the label actually clicked, or null when no such control exists.
 */
async function toggle(labels) {
  for (const label of labels) {
    const button = page.getByLabel(label, { exact: true }).first()
    if ((await button.count().catch(() => 0)) === 0) continue
    await button.click().catch(() => {})
    await settle()
    return label
  }
  return null
}

// The combined matrix the report is about: with the 组件 rail and with the right
// sidebar, at the widths where the navigator flips.
const MATRIX = [1600, 1760, 1920, 2200]
/** @type {{arm: string, m: Record<string, unknown>}[]} */
const matrixRows = []
for (const rail of [true, false]) {
  const railLabel = await toggle(['组件'])
  if (railLabel === null) continue
  for (const sidebar of [false, true]) {
    if (sidebar) await toggle(['打开右侧边栏', '右侧边栏'])
    for (const width of MATRIX) {
      await page.setViewportSize({ width, height: 1000 })
      await settle()
      await marksReady()
      const m = await page.evaluate(MEASURE)
      const arm = `${width}px rail=${rail ? 'on' : 'off'} sidebar=${sidebar ? 'open' : 'closed'}`
      matrixRows.push({ arm, m })
      assertArm(arm, m)
    }
    if (sidebar) await toggle(['关闭右侧边栏', '右侧边栏'])
  }
  await toggle(['组件'])
}

// The revealed navigator must still be the product's own control: clicking a
// mark has to move the transcript.
await page.setViewportSize({ width: 1920, height: 1000 })
await settle()
const beforeClick = await page.evaluate(MEASURE)
const mark = page.locator("[data-conversation-scroll] [class$='_slot']:has(> nav) > nav button").first()
let clicked = false
if (await mark.count().catch(() => 0) > 0) {
  await mark.click({ timeout: 5000 }).then(() => { clicked = true }).catch(() => {})
}
await page.waitForTimeout(1600)
const afterClick = await page.evaluate(MEASURE)
check(clicked, 'click', 'navigator mark is not clickable')
check(beforeClick.scrollTop !== afterClick.scrollTop, 'click', 'clicking a mark did not move the transcript', `${beforeClick.scrollTop} -> ${afterClick.scrollTop}`)

await page.screenshot({ path: path.join(OUT, 'last-arm.png') })
writeFileSync(path.join(OUT, 'verify.json'), JSON.stringify({ rows, matrixRows, click: { beforeClick, afterClick }, failures }, null, 2), 'utf8')

const line = (m) => [
  String(m.vw).padStart(5),
  String(m.flag).padStart(4),
  String(m.free).padStart(5),
  String(m.independentFree).padStart(5),
  String(m.fullBoxFree).padStart(5),
  String(m.freeLeft).padStart(5),
  String(m.needed).padStart(4),
  String(m.rail).padStart(7),
  String(m.scrollBox === null ? '-' : m.scrollBox.w).padStart(7),
  `${m.scrollPadLeft}/${m.scrollPadRight}`.padStart(11),
  String(m.columnBox === null ? '-' : m.columnBox.w).padStart(5),
  String(m.columnBox === null ? '-' : m.columnBox.right).padStart(8),
  String(m.navDisplay ?? '-').padStart(5),
  String(m.marks).padStart(5),
  String(m.collideColumn).padStart(7),
  m.hit === null ? '-' : `${m.hit.inside}/${m.hit.total}`,
].join(' | ')

console.log('\nsweep (rail/sidebar as found)')
console.log('width | flag | free | indep | full | left | need | rail | scrollW | padL/R | colW | colRight | nav | marks | collide | hit')
for (const m of rows) console.log(line(m))

console.log('\nmatrix (rail x sidebar)')
for (const { arm, m } of matrixRows) console.log(`${arm.padEnd(46)} | ${line(m)}`)
console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'} — ${failures.length} failure(s)`)
for (const f of failures) console.log('  ' + f)
await context.close()
process.exit(failures.length === 0 ? 0 : 1)
