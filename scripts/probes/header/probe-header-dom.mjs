/**
 * Header DOM dump (live, read-only): what does the session header look like in
 * this product build? Prints the slot subtree, the element occupying the top
 * band, and the classes of every node in the first 140px of the viewport.
 *
 * Run: node scripts/probes/header/probe-header-dom.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/session-header'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='conversation.session.header']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)

const dump = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  const host = document.querySelector("[data-slot='conversation.session.header']")
  const hostHtml = host === null ? null : host.outerHTML.slice(0, 2600)
  /* Every element whose box intersects the top 140px band, in DOM order. */
  const band = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.height === 0 || r.width === 0) continue
    if (r.bottom <= 0 || r.top >= 140) continue
    if (r.left > 1520) continue
    const cs = getComputedStyle(el)
    band.push({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).slice(0, 70),
      slot: el.getAttribute('data-slot'),
      rect: R(el),
      pad: cs.padding,
      minH: cs.minHeight,
      pos: cs.position,
      z: cs.zIndex,
    })
  }
  /* Anything that looks like a tab strip, by text. */
  const tabish = [...document.querySelectorAll('button, [role=tab]')]
    .filter(b => /对话|轨迹/.test(b.textContent ?? ''))
    .map(b => ({ tag: b.tagName.toLowerCase(), cls: String(b.className).slice(0, 70), rect: R(b), parentCls: String(b.parentElement.className).slice(0, 70), parentSlot: b.parentElement.getAttribute('data-slot'), gpCls: String(b.parentElement.parentElement.className).slice(0, 70) }))
  return { hostHtml, bandCount: band.length, band: band.slice(0, 60), tabish }
})
writeFileSync(`${OUT}/dom.json`, JSON.stringify(dump, null, 2), 'utf8')
console.log('--- host outerHTML ---')
console.log(dump.hostHtml)
console.log('--- tab-ish buttons ---')
console.log(JSON.stringify(dump.tabish, null, 2))
console.log(`--- band (${dump.bandCount} nodes, first 60) ---`)
for (const b of dump.band) console.log(`${b.rect} | ${b.tag}.${b.cls} | slot=${b.slot ?? ''} | pad=${b.pad} minH=${b.minH} pos=${b.pos} z=${b.z}`)
await context.close()
