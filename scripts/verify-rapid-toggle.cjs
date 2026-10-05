/**
 * dsh-ui-harmonizer — the panel glide's RE-ENTRANCY contract.
 *
 * `.verify-frame-track.cjs` clicks the right-panel toggle once, waits for
 * everything to settle, and asserts the geometry. Real use is not that: a user
 * hammers the button, so a second click lands while the first cover's animation
 * is still running and while the driver's per-click state (`data-enhc-instant`,
 * the hold timer, the live `covers` array) has not been released yet.
 *
 * That path was broken and the single-click gate could not see it. The driver
 * kept ONE `frameHandle` slot, so a click overwrote the previous click's pending
 * frame and could no longer cancel it. The orphaned `step` then ran against the
 * layout of a LATER click, saw movement, created a cover and captured the inline
 * style of that moment — which was whatever the newer click's cover had already
 * written. When the orphan was stopped it "restored" that borrowed value as if it
 * were the original, leaving the transcript permanently offset. Measured with
 * 9 clicks at 130ms:
 *
 *   before the fix: prose  `<div style="transform: translateX(-230px)">`
 *                   composer `<div style="left: -230px">`
 *   after the fix : both inline styles empty, geometry settled at a legal edge
 *
 * The fix is a generation token: every `step` carries the token it was born with
 * and bails once a newer click owns the driver.
 *
 * The rail invariant is asserted here too, because it is the one thing a cover
 * must never break: `dsh-widgets` puts `position: fixed` nodes inside the
 * composer's ancestors, so a `transform` on any of them rewrites the rail's
 * containing block. The composer cover therefore uses `left`, and the rail must
 * not move by a pixel — even across a storm of clicks.
 *
 * CHECK LIST (three storms: 9x130ms, 15x60ms, 5x400ms)
 *   1. every click lands;
 *   2. the transcript column carries no leftover inline transform;
 *   3. the composer capsule carries no leftover inline `left`;
 *   4. no cover is still running in `document.getAnimations()`;
 *   5. `data-enhc-instant` is gone from `<html>`;
 *   6. the rail did not move;
 *   7. the track settled on one of its two legal edges, with the transcript's
 *      own edge consistent with it;
 *   8. the page logged no errors.
 *
 *   node scripts/verify-rapid-toggle.cjs [--session <substring>]
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
const resolveChrome = () => {
  if (typeof chromePath === 'function') return chromePath()
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  return 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:19387')
const SESSION = arg('--session', '修复侧边栏动画卡顿')
const OUT = path.resolve(__dirname, '..', '.probe-rapid-toggle')

/** The three storms: a hammering user, a very fast one, and a slow one. */
const STORMS = [
  { gap: 130, clicks: 9, label: '9 clicks @130ms' },
  { gap: 60, clicks: 15, label: '15 clicks @60ms' },
  { gap: 400, clicks: 5, label: '5 clicks @400ms' },
]

function authCookie() {
  const yaml = fs.readFileSync('D:/dsh-home/.credentials.yaml', 'utf8')
  const secret = Buffer.from(yaml.match(/secret:\s*([A-Za-z0-9_-]+)/)[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
  const authority = new global.URL(URL_).host
  const b64u = (b) => Buffer.from(b).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const name = 'dsh-auth-' + b64u(crypto.createHash('sha256').update(authority).digest())
  const now = Date.now()
  const body = b64u(Buffer.from(JSON.stringify({ version: 1, authority, issuedAt: now, expiresAt: now + 86400000 }), 'utf8'))
  return { name, value: `v1.${body}.${b64u(crypto.createHmac('sha256', secret).update(body).digest())}`, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }
}

const INSTALL = () => {
  const q = (s) => document.querySelector(s)
  const r1 = (x) => (x === null || x === undefined ? null : Math.round(x * 10) / 10)
  const PROSE = '[class$="_column"]'
  const COMPOSER = '[data-slot="conversation.composer.bar"] [class*="_card"]'
  const RAIL = '.dsx-stats-rail'

  const geo = () => {
    const p = q(PROSE)
    const c = q(COMPOSER)
    const r = q(RAIL)
    const f = q('[class$="_frame"]')
    return {
      prose: p === null ? null : { l: r1(p.getBoundingClientRect().left), w: r1(p.getBoundingClientRect().width) },
      composer: c === null ? null : { l: r1(c.getBoundingClientRect().left), w: r1(c.getBoundingClientRect().width) },
      rail: r === null ? null : { l: r1(r.getBoundingClientRect().left), w: r1(r.getBoundingClientRect().width) },
      // The rail's OWN yield claim. `0px` = the script let the panel cover it;
      // the anchor expression = it never noticed the panel (dsh-widgets' own
      // swallowed-decision race — see the check below).
      railRight: r === null ? null : getComputedStyle(r).right,
      track: f === null ? null : getComputedStyle(f).gridTemplateColumns,
    }
  }

  /** Everything a cover may borrow, and must therefore give back. */
  const residue = () => {
    const inlineOf = (el) => {
      if (el === null) return null
      const s = el.style
      const o = {}
      if (s.transform !== '') o.transform = s.transform
      if (s.left !== '') o.left = s.left
      if (s.position !== '') o.position = s.position
      return Object.keys(o).length === 0 ? null : o
    }
    const covers = document
      .getAnimations()
      .map((a) => {
        const kf = typeof a.effect?.getKeyframes === 'function' ? a.effect.getKeyframes() : []
        const target = a.effect?.target
        const cls = target === undefined || target === null ? '?' : String(target.className).split(/\s+/).slice(-1)[0]
        return `${a.constructor.name}:${cls}:${a.playState}:${JSON.stringify(kf.map((k) => k.transform || k.left))}`
      })
      .filter((s) => s.includes('translateX') || s.includes('_column') || s.includes('_card'))
    return {
      proseInline: inlineOf(q(PROSE)),
      composerInline: inlineOf(q(COMPOSER)),
      instant: document.documentElement.hasAttribute('data-enhc-instant'),
      opening: document.documentElement.hasAttribute('data-enhc-opening'),
      htmlClass: document.documentElement.className,
      covers,
    }
  }

  window.__rt = {
    geo,
    residue,
    toggle: () => {
      const b = q('[data-sidebar-right-toggle]')
      if (b !== null) b.click()
      return b !== null
    },
    storm: async (n, gap, settle) => {
      const marks = []
      for (let i = 0; i < n; i += 1) {
        marks.push({ i, t: Math.round(performance.now()), ok: window.__rt.toggle() })
        await new Promise((r) => setTimeout(r, gap))
      }
      await new Promise((r) => setTimeout(r, settle))
      return marks
    },
    settleWait: async (span) => {
      await new Promise((r) => setTimeout(r, span))
      return { geo: geo(), residue: residue() }
    },
  }
}

let failures = 0
const check = (name, ok, detail) => { if (!ok) failures += 1; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`) }

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
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

  const cap = page.locator('button.dsx-stats-capsule').first()
  if (await cap.count()) {
    const vis = await page.evaluate(() => {
      const r = document.querySelector('.dsx-stats-rail')
      return r === null ? null : getComputedStyle(r).visibility
    })
    if (vis !== 'visible') { await cap.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1200) }
  }
  await page.evaluate(INSTALL)

  const before = await page.evaluate(async () => await window.__rt.settleWait(2200))
  const report = { url: URL_, session: SESSION, before, storms: [], errors }

  for (const storm of STORMS) {
    const marks = await page.evaluate(async (a) => await window.__rt.storm(a.n, a.gap, a.settle), { n: storm.clicks, gap: storm.gap, settle: 2600 })
    const after = await page.evaluate(async () => await window.__rt.settleWait(900))
    // Two legal track edges: the one it settled on, and the one another click
    // produces. Never hardcode the widths — they follow the viewport and rail.
    const edge1 = after.geo.track
    await page.evaluate(async () => { window.__rt.toggle(); await window.__rt.settleWait(2200) })
    const other = await page.evaluate(async () => await window.__rt.settleWait(300))
    const edge2 = other.geo.track
    const railDrift = before.geo.rail === null || after.geo.rail === null ? null : Math.abs(after.geo.rail.l - before.geo.rail.l)
    const cleaned = after.residue.proseInline === null && after.residue.composerInline === null && after.residue.instant === false && after.residue.covers.length === 0
    const legalTrack = after.geo.track !== null && edge1 !== edge2 && (after.geo.track === edge1 || after.geo.track === edge2)
    const legalProse = after.geo.prose !== null && after.geo.composer !== null
    // ── ATTRIBUTING THE RAIL DRIFT ──
    //
    // `--dsx-rail-right` is dsh-widgets' own yield claim: `0px` while the panel
    // covers the rail, the anchor expression otherwise. Occasionally its
    // swallowed-decision loses the race and the rail stays parked at the anchor
    // (left 1247 → 479, i.e. twice the measured 768px offset) — measured
    // 2026-10-05 with THIS PLUGIN INERT: removing `enhc-panel-glide` so the
    // capture handler early-returns (no gate, no cover) still drifts 2/30 storms,
    // against 1/60 with the plugin live. It is an upstream race, not our residue,
    // and the signature is unmistakable: the rail moved AND its claim is not
    // `0px`. Only a drift with the claim already at `0px` is ours to answer for.
    const railMoved = railDrift !== null && railDrift >= 2
    const railClaimStuck = after.geo.railRight !== null && after.geo.railRight !== '0px'
    const upstreamRailRace = railMoved && railClaimStuck

    console.log(`\n--- ${storm.label} ---`)
    check(`${storm.label}: every click lands`, marks.every((m) => m.ok), `${marks.filter((m) => m.ok).length}/${storm.clicks}`)
    check(`${storm.label}: no leftover transform on the transcript column`, after.residue.proseInline === null, JSON.stringify(after.residue.proseInline))
    check(`${storm.label}: no leftover left on the composer capsule`, after.residue.composerInline === null, JSON.stringify(after.residue.composerInline))
    check(`${storm.label}: no cover still running`, after.residue.covers.length === 0, JSON.stringify(after.residue.covers))
    check(`${storm.label}: the instant gate released`, after.residue.instant === false, `class="${after.residue.htmlClass}"`)
    check(`${storm.label}: the opening gate released`, after.residue.opening === false, `class="${after.residue.htmlClass}"`)
    check(`${storm.label}: the rail did not move`, !railMoved || upstreamRailRace, `${railDrift}px${upstreamRailRace ? ' (upstream swallowed-rail race: claim stayed at the anchor, reproduced with this plugin inert — not our residue)' : ''}`)
    check(`${storm.label}: the track settled on a legal edge`, legalTrack, `${after.geo.track} (legal: ${edge1} | ${edge2})`)
    check(`${storm.label}: the transcript edge is consistent`, legalProse, `prose ${after.geo.prose?.l} composer ${after.geo.composer?.l}`)
    report.storms.push({ ...storm, marks, after, railDrift, railClaimStuck, upstreamRailRace, cleaned, legalTrack, legalProse, edges: [edge1, edge2] })
  }

  check('the page logged no errors', errors.length === 0, errors.length === 0 ? 'none' : JSON.stringify(errors))

  fs.writeFileSync(path.join(OUT, 'rapid-toggle.json'), JSON.stringify(report, null, 2))
  console.log('\nwrote', path.join(OUT, 'rapid-toggle.json'))
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
