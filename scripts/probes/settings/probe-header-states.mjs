/**
 * Header states probe: the same header in its three shapes after the 0.9.x
 * anchor fix — a real session, the blank/new session, and the opt-in rounded
 * center card (wrapped mode).
 *
 * Run: node scripts/probes/settings/probe-header-states.mjs [url] [sessionTitleSubstring]
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
const OUT = 'D:/dsh-home/probe-ui/header-states'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-header', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)

const SNAP = label => `(() => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
  const header = document.querySelector("[data-slot='conversation.header'] > header")
  const scr = document.querySelector('[data-conversation-scroll]')
  const tabs = document.querySelector("[class*='_tabs']")
  return {
    label: ${JSON.stringify(label)},
    htmlClass: document.documentElement.className,
    header: header === null ? null : { cls: String(header.className), rect: R(header), pad: getComputedStyle(header).padding, minH: getComputedStyle(header).minHeight, border: getComputedStyle(header).borderBottom },
    scroll: scr === null ? null : { cls: String(scr.className).slice(0, 40), rect: R(scr), padTop: getComputedStyle(scr).paddingTop },
    tabs: tabs === null ? null : { rect: R(tabs), parent: String(tabs.parentElement.className).slice(0, 40) },
    titleCluster: (() => { const el = document.querySelector("[class*='_titleCluster']"); return el === null ? null : { rect: R(el) } })(),
  }
})()`

const shots = []
const snap = async label => {
  const data = await page.evaluate(SNAP(label))
  shots.push(data)
  await page.screenshot({ path: `${OUT}/${label}-top.png`, clip: { x: 270, y: 0, width: 1290, height: 240 } })
  console.log(JSON.stringify(data, null, 2))
  return data
}

/* 1) a real session */
const opened = await page.evaluate(t => {
  const rows = [...document.querySelectorAll("[data-slot='sidebar.workspaces'] [class*='_sessionRow']")]
  const row = rows.find(r => (r.textContent ?? '').includes(t))
  if (row === undefined) return null
  row.click()
  return (row.textContent ?? '').trim().replace(/\s+/gu, ' ').slice(0, 30)
}, TITLE)
console.log('session opened:', opened)
await page.waitForTimeout(3500)
await snap('session')

/* 2) the blank / new-session header (hero) */
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(b => (b.textContent ?? '').trim() === '新会话')
  if (btn !== undefined) btn.click()
})
await page.waitForTimeout(3000)
await snap('blank')
writeFileSync(`${OUT}/states.json`, JSON.stringify(shots, null, 2), 'utf8')
await context.close()
