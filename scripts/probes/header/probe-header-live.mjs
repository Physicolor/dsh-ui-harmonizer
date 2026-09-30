/**
 * Live session-header measurement against a REAL session (the one in the user's
 * screenshot), not the blank/hero state.
 *
 * Prints: the header box + its computed metrics, the `::after` divider, the
 * title row, the tabs strip (if the product renders one), and the vertical
 * whitespace above/below the actual control row.
 *
 * Run: node scripts/probes/header/probe-header-live.mjs [url] [titleSubstring]
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
const TITLE = process.argv[3] ?? '这个弹出的宽度'
const OUT = 'D:/dsh-home/probe-ui/session-header'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)

const opened = await page.evaluate(t => {
  const rows = [...document.querySelectorAll("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")]
  const row = rows.find(r => (r.textContent ?? '').includes(t))
  if (row === undefined) return null
  row.click()
  return (row.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 40)
}, TITLE)
console.log('opened session:', opened)
await page.waitForTimeout(4000)

const REPORT = () => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
  const header = document.querySelector('header')
  const cs = getComputedStyle(header)
  const pa = getComputedStyle(header, '::after')
  const pb = getComputedStyle(header, '::before')
  const kids = [...header.children].map(el => ({ cls: String(el.className).slice(0, 50), rect: R(el) }))
  /* Every visible box inside the header, so we can see the real band. */
  const inner = []
  for (const el of header.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    inner.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 46), slot: el.getAttribute('data-slot'), rect: R(el), text: (el.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 22) })
  }
  const tabs = document.querySelector("[class*='_tabs']")
  const tabsInfo = tabs === null ? null : {
    cls: String(tabs.className), rect: R(tabs), parentCls: String(tabs.parentElement.className),
    cs: (() => { const s = getComputedStyle(tabs); return { margin: s.margin, padding: s.padding, gap: s.gap, alignSelf: s.alignSelf } })(),
    tabCls: [...tabs.children].map(c => String(c.className)),
  }
  /* Is the whole header class chain the same prefix on every node? */
  const roots = [...document.querySelectorAll("[class*='_header']")].map(el => `${el.tagName.toLowerCase()}.${String(el.className)} ${JSON.stringify(R(el))} pad=${getComputedStyle(el).padding} minH=${getComputedStyle(el).minHeight} display=${getComputedStyle(el).display}`)
  const card = document.querySelector('.enhc-center-card')
  const rail = document.querySelector('[class*="dsx-stats-rail"], [class*="dsx-rail"]')
  const railInfo = {
    var: getComputedStyle(document.documentElement).getPropertyValue('--dsx-rail-top').trim(),
    box: rail === null ? null : { cls: String(rail.className).slice(0, 40), rect: R(rail) },
  }
  const htmlRules = []
  for (const sheet of document.styleSheets) {
    let rules = null
    try { rules = sheet.cssRules } catch { continue }
    for (const rule of rules) {
      if (rule.selectorText !== undefined && rule.selectorText.includes('conversation.header')) htmlRules.push(`${rule.selectorText} { ${rule.style.cssText.slice(0, 150)} }`)
    }
  }
  return {
    htmlClass: document.documentElement.className,
    headerRect: R(header), headerCls: String(header.className),
    padding: cs.padding, minHeight: cs.minHeight, height: cs.height, alignItems: cs.alignItems, flexWrap: cs.flexWrap,
    rowGap: cs.rowGap, borderBottom: `${cs.borderBottomWidth}/${cs.borderBottomStyle}/${cs.borderBottomColor}`,
    after: { content: pa.content, height: pa.height, bottom: pa.bottom, bg: pa.backgroundColor, width: pa.width, left: pa.left, right: pa.right, display: pa.display, position: pa.position },
    before: { content: pb.content, height: pb.height, bg: pb.backgroundColor },
    card: card === null ? null : { cls: String(card.className), rect: R(card), display: getComputedStyle(card).display, borderTop: getComputedStyle(card).borderTop, boxShadow: getComputedStyle(card).boxShadow.slice(0, 90) },
    rail: railInfo,
    matchedHeaderRules: htmlRules,
    kids, inner, tabsInfo, roots,
    titleRowHtml: header.querySelector("[class*='_titleRow']")?.outerHTML.slice(0, 1800) ?? null,
  }
}
const report = await page.evaluate(REPORT)
writeFileSync(`${OUT}/live.json`, JSON.stringify(report, null, 2), 'utf8')
await page.screenshot({ path: `${OUT}/live-top.png`, clip: { x: 270, y: 0, width: 1290, height: 170 } })
const { inner, ...head } = report
console.log(JSON.stringify(head, null, 2))
console.log('--- visible boxes inside the header ---')
for (const i of inner) console.log(`${i.rect.x},${i.rect.y} ${i.rect.w}x${i.rect.h} | ${i.tag}.${i.cls} | slot=${i.slot ?? ''} | ${i.text}`)
await context.close()
