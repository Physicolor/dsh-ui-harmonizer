/**
 * Structure probe: the product rebuilt its session header (the slot host is now
 * `display: contents` and holds only the corner seat), so dump the real tree —
 * slot host vs `header`, the sidebar's session rows, and the class names that
 * survive a rebuild (`_header`, `_titleRow`, `_tabs`).
 *
 * Run: node scripts/probes/header/probe-header-tree.mjs [url]
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
await page.waitForTimeout(4500)

/* Sidebar session rows: click the newest one so the header is a real session. */
const sidebar = await page.evaluate(() => {
  const box = document.querySelector("[data-slot='sidebar.workspaces']")
  if (box === null) return { found: false }
  const rows = [...box.querySelectorAll('button, a, [role="button"], [role="treeitem"]')].map((el, i) => {
    const r = el.getBoundingClientRect()
    return { i, text: (el.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 46), cls: String(el.className).slice(0, 46), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  })
  return { found: true, html: box.outerHTML.slice(0, 1200), rows }
})
console.log('--- sidebar.workspaces ---')
console.log(sidebar.html ?? '(none)')
for (const r of (sidebar.rows ?? [])) console.log(`${r.i} ${r.x},${r.y} ${r.w}x${r.h} | ${r.cls} | ${r.text}`)

/* Click the first workspace row (the app's own click target). */
const clicked = await page.evaluate(() => {
  const box = document.querySelector("[data-slot='sidebar.workspaces']")
  const el = box === null ? null : box.querySelector('button, [role="treeitem"], [role="button"]')
  if (el === null) return null
  el.click()
  return (el.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 40)
})
console.log('clicked row:', clicked)
await page.waitForTimeout(3500)

const tree = await page.evaluate(() => {
  const R = el => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  const outline = (el, depth) => {
    if (depth > 4) return []
    const cs = getComputedStyle(el)
    if (cs.display === 'none') return []
    const line = `${'  '.repeat(depth)}${el.tagName.toLowerCase()}.${String(el.className).slice(0, 46)} slot=${el.getAttribute('data-slot') ?? ''} ${R(el)} pad=${cs.padding} minH=${cs.minHeight} pos=${cs.position} z=${cs.zIndex}`
    const kids = []
    for (const child of el.children) kids.push(...outline(child, depth + 1))
    return [line, ...kids]
  }
  const root = document.querySelector("[data-slot='root']") ?? document.body
  const lines = outline(root, 0)
  const slotHost = document.querySelector("[data-slot='conversation.session.header']")
  const slotParents = []
  for (let el = slotHost; el !== null && el !== document.body; el = el.parentElement) {
    slotParents.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} slot=${el.getAttribute('data-slot') ?? ''} ${R(el)}`)
    if (slotParents.length > 5) break
  }
  const header = document.querySelector('header')
  return { lines, slotParents, headerHtml: header === null ? null : header.outerHTML.slice(0, 5000) }
})
writeFileSync(`${OUT}/tree.json`, JSON.stringify(tree, null, 2), 'utf8')
console.log('--- slot host parent chain ---')
for (const l of tree.slotParents) console.log(l)
console.log('--- header outerHTML ---')
console.log(tree.headerHtml ?? '(no header)')
console.log('--- outline (top of tree) ---')
console.log(tree.lines.slice(0, 90).join('\n'))
await page.screenshot({ path: `${OUT}/session-top.png`, clip: { x: 260, y: 0, width: 1300, height: 160 } })
await context.close()
