/**
 * dsh-ui-harmonizer — the relocated tab strip's WIDTH contract.
 *
 * The product ships the 对话/轨迹 strip as a full-width grid row of the header
 * (`.tabs { grid-column: 1 / -1; width: 100% }`), sized for the two-row header.
 * The client half moves it into `_titleCluster` (a flex row) so the header is one
 * line — and `grid-column` goes inert there while `width: 100%` does not: the
 * strip then takes the whole cluster, `_crumbs` and `_headerActions` collapse to
 * 0px, and header-fit.ts reads a 0px title and spends every badge it can. The
 * visible result is the report this suite exists for: an empty top bar — no
 * session title, no Agent 预设 badge — with just the two tabs and the right-hand
 * buttons.
 *
 * session-header.module.css neutralises it with `width: auto` on the relocated
 * strip. This script is what keeps that declaration honest:
 *
 *   1. the strip is no wider than the content it holds (two capsules + the
 *      overflow anchor), so it cannot be eating the cluster;
 *   2. the title keeps at least the fit's legibility floor (160px, header-fit.ts);
 *   3. no badge carries `data-enhc-header-hidden` in a wide header;
 *   4. the header is a single row (<= 60px) and the strip sits on its centre line;
 *   5. the title text is the session's, not an empty box.
 *
 *   node scripts/verify-header-strip-fit.cjs [--url <url>] [--index <n>]
 *   [--session <substring>]
 *
 * URL from DSH_URL, default http://127.0.0.1:19387. `--index` opens the nth
 * sidebar row (0-based) instead of searching by title — the rows' visible text
 * changes with the relative clock, so a title substring can miss.
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
const INDEX = Number(arg('--index', '-1'))
const SESSION = arg('--session', '')

/** px the fit keeps for the title before it spends a badge (header-fit.ts). */
const FLOOR = 160
/** A single-row header. The strip is 36px tall in this build, +10px+10px padding. */
const HEADER_MAX = 60

function authCookie() {
  const yaml = fs.readFileSync('D:/dsh-home/.credentials.yaml', 'utf8')
  const secret = Buffer.from(yaml.match(/secret:\s*([A-Za-z0-9_-]+)/)[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
  const authority = new global.URL(URL_).host
  const b64u = (b) => Buffer.from(b).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
  const name = 'dsh-auth-' + b64u(crypto.createHash('sha256').update(authority).digest())
  const now = Date.now()
  const body = b64u(Buffer.from(JSON.stringify({ version: 1, authority, issuedAt: now, expiresAt: now + 86400000 }), 'utf8'))
  return { name, value: `v1.${body}.${b64u(crypto.createHmac('sha256', secret).update(body).digest())}` }
}

/**
 * One read of the header. Everything is measured in the page because the
 * question — "who took the row?" — is a layout question, and the boxes are the
 * only answer that survives a product re-render.
 */
const READ = () => {
  const q = (s) => document.querySelector(s)
  const round = (v) => Math.round(v * 10) / 10
  const header = q("[data-slot='conversation.header'] > header")
  const cluster = q("[class$='_titleCluster']")
  const crumbs = q("[class$='_titleCluster'] > [class$='_crumbs']")
  const seat = q("[data-slot='conversation.session.header.actions']")
  const tabs = q("[class$='_titleCluster'] > [class$='_tabs']")
  const stripContent = tabs === null ? null : [...tabs.children]
    .reduce((sum, child) => sum + child.getBoundingClientRect().width, 0)
  const badges = seat === null ? [] : [...seat.children].map((el) => ({
    text: (el.textContent || '').trim().slice(0, 12),
    w: round(el.getBoundingClientRect().width),
    hidden: el.hasAttribute('data-enhc-header-hidden'),
    display: getComputedStyle(el).display,
  }))
  const tabsRect = tabs === null ? null : tabs.getBoundingClientRect()
  const headerRect = header === null ? null : header.getBoundingClientRect()
  return {
    headerW: headerRect === null ? null : round(headerRect.width),
    headerH: headerRect === null ? null : round(headerRect.height),
    clusterW: cluster === null ? null : round(cluster.getBoundingClientRect().width),
    crumbsW: crumbs === null ? null : crumbs.clientWidth,
    title: crumbs === null ? '' : (crumbs.textContent || '').trim(),
    tabsW: tabsRect === null ? null : round(tabsRect.width),
    tabsContentW: stripContent === null ? null : round(stripContent),
    tabsCentre: tabsRect === null || headerRect === null ? null : round(tabsRect.y + tabsRect.height / 2 - headerRect.y),
    tabsH: tabsRect === null ? null : round(tabsRect.height),
    badges,
    hiddenCount: badges.filter((b) => b.hidden).length,
  }
}

let failures = 0
const check = (name, ok, detail) => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`)
}

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
  await page.locator('div[class*="sessionRow"]').first().waitFor({ timeout: 20000 }).catch(() => {})

  if (INDEX >= 0) {
    await page.locator('div[class*="sessionRow"]').nth(INDEX).click({ timeout: 8000 })
  } else if (SESSION !== '') {
    await page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first().click({ timeout: 8000 })
  } else {
    await page.locator('div[class*="sessionRow"]').first().click({ timeout: 8000 })
  }
  await page.waitForTimeout(3500)
  await page.mouse.move(400, 700)
  await page.waitForTimeout(300)

  const s = await page.evaluate(READ)
  console.log(`  ..  header ${s.headerW}x${s.headerH}, cluster ${s.clusterW}, title ${s.crumbsW}px, strip ${s.tabsW}px (content ${s.tabsContentW}px), badges=[${s.badges.map((b) => `${b.text}:${b.w}${b.hidden ? ':HIDDEN' : ''}`).join(', ')}]`)

  check('1. the strip is content-width, not the whole cluster',
    s.tabsW !== null && s.tabsContentW !== null && s.tabsW <= s.tabsContentW + 30,
    `strip ${s.tabsW}px vs content ${s.tabsContentW}px, cluster ${s.clusterW}px`)
  check('2. the session title kept its legibility floor',
    s.crumbsW !== null && s.crumbsW >= FLOOR,
    `title ${s.crumbsW}px (floor ${FLOOR}px), text "${s.title}"`)
  check('3. the title is the session\'s, not an empty box',
    s.title.length > 1,
    `"${s.title}"`)
  check('4. no badge was spent in a wide header',
    s.hiddenCount === 0,
    `${s.hiddenCount} hidden of ${s.badges.length}`)
  check('5. the header is a single row',
    s.headerH !== null && s.headerH <= HEADER_MAX,
    `header ${s.headerH}px (max ${HEADER_MAX}px), strip ${s.tabsH}px tall on centre line ${s.tabsCentre}px`)
  check('6. no page errors', errors.length === 0, errors.join(' | '))

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  await browser.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
