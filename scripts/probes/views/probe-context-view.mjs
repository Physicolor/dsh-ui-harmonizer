/**
 * Reproduce the reported dsh-context view-ring defect against the LIVE desktop
 * instance: clicking the 上下文 (Context) view tab empties the whole view area,
 * while 对话 / 轨迹 render normally.
 *
 * Read-only on the session: it opens the page, opens a session, and CLICKS the
 * view tabs (a view switch writes no message and no session content). Nothing
 * is typed into the composer.
 *
 * Run: node scripts/probes/views/probe-context-view.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')
const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const URL_ARG = process.argv[2] ?? 'http://127.0.0.1:19387'
const TITLE = process.argv[3] ?? '帮我检查我下载了一个上下文'
const OUT = 'D:/dsh-home/probe-ui/context-view'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(
  process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-ctxview',
  { executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 } },
)
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()

const consoleLines = []
page.on('console', m => consoleLines.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', e => consoleLines.push(`[pageerror] ${e && e.message ? e.message : String(e)}`))

await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

/** Snapshot of the view ring + the active view's rendered box. */
const SNAP = String.raw`(() => {
  const R = el => { const r = el.getBoundingClientRect(); return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)] }
  const tabs = document.querySelector("[class*='_tabs']")
  const ring = tabs === null ? null : {
    cls: String(tabs.className),
    parent: String(tabs.parentElement.className),
    rect: R(tabs),
    items: [...tabs.children].map(c => ({ tag: c.tagName.toLowerCase(), text: (c.textContent ?? '').trim(), cls: String(c.className), selected: c.getAttribute('aria-selected'), rect: R(c) })),
  }
  const viewArea = document.querySelector("[class*='_viewArea']")
  const kids = viewArea === null ? null : [...viewArea.children].map(c => ({
    tag: c.tagName.toLowerCase(), cls: String(c.className).slice(0, 90), rect: R(c),
    display: getComputedStyle(c).display, html: c.outerHTML.slice(0, 240),
  }))
  const lc = document.querySelector('.lc-root')
  return {
    href: location.href,
    htmlClass: document.documentElement.className,
    ring,
    viewArea: viewArea === null ? null : {
      cls: String(viewArea.className), rect: R(viewArea),
      display: getComputedStyle(viewArea).display, flex: getComputedStyle(viewArea).flex, overflow: getComputedStyle(viewArea).overflow,
      childCount: viewArea.children.length,
    },
    kids,
    lcRoot: lc === null ? null : { rect: R(lc), display: getComputedStyle(lc).display, height: getComputedStyle(lc).height, overflowY: getComputedStyle(lc).overflowY, textLen: (lc.textContent ?? '').length },
    phaseOwner: (() => { const el = document.querySelector('[data-phase]'); return el === null ? null : { cls: String(el.className), phase: el.getAttribute('data-phase') } })(),
  }
})()`

console.log('=== initial (hero) ===')
const initial = await page.evaluate(SNAP)
console.log(JSON.stringify({ href: initial.href, ring: initial.ring, phaseOwner: initial.phaseOwner }, null, 1))

if (initial.ring === null) {
  // Real pointer clicks: the tree rows act on a real pointer sequence, and a
  // synthetic el.click() from evaluate() does not open a session.
  const groups = page.locator("[data-slot='sidebar.workspaces'] [class*='_projectRow']")
  const groupCount = await groups.count()
  for (let i = 0; i < groupCount; i++) {
    const g = groups.nth(i)
    if ((await g.getAttribute('aria-expanded')) === 'false') { await g.click(); await page.waitForTimeout(400) }
  }
  await page.waitForTimeout(2000)
  const row = TITLE === ''
    ? page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").first()
    : page.locator("[data-slot='sidebar.workspaces'] [class*='_sessionRow']").filter({ hasText: TITLE }).first()
  const openedTitle = (await row.textContent().catch(() => null)) ?? null
  if (openedTitle !== null) await row.click()
  console.log('opened session:', openedTitle === null ? null : openedTitle.trim().replace(/\s+/gu, ' ').slice(0, 60))
  await page.waitForTimeout(6000)
}

const opened = await page.evaluate(SNAP)
console.log('=== after opening a session ===')
console.log(JSON.stringify({ ring: opened.ring, viewArea: opened.viewArea, kids: opened.kids, lcRoot: opened.lcRoot, phaseOwner: opened.phaseOwner }, null, 1))
if (opened.ring === null) {
  console.log('!! no view ring — the session never opened or the ring has one entry')
  await page.screenshot({ path: `${OUT}/00-no-ring.png` })
  await context.close()
  process.exit(0)
}

const viewLabels = opened.ring.items.map(i => i.text)
for (const label of viewLabels) {
  const tab = page.locator("[class*='_tabs']").getByText(label, { exact: true }).first()
  const clicked = await tab.click({ timeout: 10000 }).then(() => true).catch(() => false)
  if (!clicked) { console.log(`!! could not click "${label}"`); continue }
  await page.waitForTimeout(2500)
  const snap = await page.evaluate(SNAP)
  console.log(`=== after clicking "${label}" ===`)
  console.log(JSON.stringify({ ring: snap.ring.items.map(i => [i.text, i.selected]), viewArea: snap.viewArea, kids: snap.kids, lcRoot: snap.lcRoot, phaseOwner: snap.phaseOwner }, null, 1))
  await page.screenshot({ path: `${OUT}/view-${label.replace(/[\\/:*?"<>|]/gu, '_')}.png` })
}

writeFileSync(`${OUT}/console.txt`, consoleLines.join('\n'), 'utf8')
console.log('=== console (tail) ===')
console.log(consoleLines.slice(-40).join('\n'))
await context.close()
