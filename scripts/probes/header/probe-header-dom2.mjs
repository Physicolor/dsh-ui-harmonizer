/**
 * Stage-2 header probe: open an existing session (not the hero/blank state),
 * then dump the real header subtree and the band around it.
 *
 * Run: node scripts/probes/header/probe-header-dom2.mjs [url]
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
await page.waitForTimeout(4000)

/* Where are we? Print the sidebar's clickable rows so we can open a session. */
const before = await page.evaluate(() => {
  const rows = [...document.querySelectorAll("button, a, [role='button']")]
    .map(el => { const r = el.getBoundingClientRect(); return { text: (el.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 40), cls: String(el.className).slice(0, 50), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } })
    .filter(r => r.w > 40 && r.h > 16 && r.y > 100)
  return rows.slice(0, 60)
})
console.log('--- clickable rows before ---')
for (const r of before) console.log(`${r.x},${r.y} ${r.w}x${r.h} | ${r.cls} | ${r.text}`)

const clicked = await page.evaluate(() => {
  const cand = [...document.querySelectorAll("button, a, [role='button']")]
    .filter(el => { const r = el.getBoundingClientRect(); return r.x < 300 && r.y > 140 && r.width > 100 && r.height > 20 })
  if (cand.length === 0) return null
  const el = cand[0]
  const t = (el.textContent ?? '').trim().slice(0, 30)
  el.click()
  return t
})
console.log('clicked:', clicked)
await page.waitForTimeout(3500)

const dump = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  const band = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.height === 0 || r.width === 0) continue
    if (r.bottom <= 0 || r.top >= 160) continue
    if (r.left > 1520 || r.right < 260) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'contents') continue
    band.push(`${R(el)} | ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} | slot=${el.getAttribute('data-slot') ?? ''} | pad=${cs.padding} minH=${cs.minHeight} mar=${cs.margin} z=${cs.zIndex} bg=${cs.backgroundColor}`)
  }
  const textDump = [...document.querySelectorAll('*')]
    .filter(el => /对话|轨迹/.test(el.textContent ?? '') && el.children.length === 0)
    .map(el => `${R(el)} ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} "${(el.textContent ?? '').trim()}"`)
  const header = document.querySelector('header')
  const chain = []
  for (let el = header; el !== null && el !== document.body; el = el.parentElement) {
    const cs = getComputedStyle(el)
    chain.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} slot=${el.getAttribute('data-slot') ?? ''} ${R(el)} pad=${cs.padding} minH=${cs.minHeight}`)
    if (chain.length > 6) break
  }
  return { band: band.slice(0, 80), textDump, headerHtml: header === null ? null : header.outerHTML.slice(0, 4000), chain }
})
writeFileSync(`${OUT}/dom2.json`, JSON.stringify(dump, null, 2), 'utf8')
console.log('--- 对话/轨迹 text nodes ---')
for (const t of dump.textDump) console.log(t)
console.log('--- header chain ---')
for (const c of dump.chain) console.log(c)
console.log('--- header outerHTML ---')
console.log(dump.headerHtml)
console.log('--- top band ---')
for (const b of dump.band) console.log(b)
await page.screenshot({ path: `${OUT}/session-top.png`, clip: { x: 260, y: 0, width: 1300, height: 160 } })
await context.close()
