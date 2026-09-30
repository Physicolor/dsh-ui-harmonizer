/**
 * Exploratory DOM dump: how to open Settings, and what the sidebar footer looks
 * like (the account row + its popup). Diagnostic only.
 *
 * Run: node scripts/probes/plugin-eco/probe-explore.mjs [url]
 */
import { createRequire } from 'node:module'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const PW_ROOT = 'C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32'
const require = createRequire(PW_ROOT + '/noop.js')
const { chromium } = require('playwright-core')
const CHROME_CANDIDATES = [
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
]
const CREDENTIALS = 'D:/dsh-home/.credentials.yaml'
const PROFILE_DIR = process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony'
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = 'D:/dsh-home/probe-ui/explore'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)
await page.screenshot({ path: `${OUT}/01-loaded.png` })

const dump = await page.evaluate(() => {
  const describe = el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
    return { tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 70), slot: el.getAttribute('data-slot'),
      text: (el.textContent ?? '').trim().slice(0, 26), box: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }
  }
  const sidebar = document.querySelector("[data-slot='sidebar']")
  const foot = sidebar === null ? null : sidebar.lastElementChild
  return {
    slots: [...document.querySelectorAll('[data-slot]')].map(s => s.getAttribute('data-slot')).filter((v, i, a) => a.indexOf(v) === i),
    sidebarTail: foot === null ? [] : [...foot.querySelectorAll('*')].slice(0, 40).map(describe),
    sidebarLastChildren: sidebar === null ? [] : [...sidebar.children].map(describe),
    buttonsWithSettings: [...document.querySelectorAll('button, a, [role="button"]')]
      .filter(b => /设置|Settings/.test(b.textContent ?? '') || /设置|Settings/.test(b.getAttribute('aria-label') ?? ''))
      .slice(0, 12).map(describe),
  }
})
console.log(JSON.stringify(dump, null, 2))

// Try Control+Comma and a click on the settings trigger.
await page.keyboard.press('Control+Comma')
await page.waitForTimeout(1500)
let after = await page.evaluate(() => ({
  dialogs: [...document.querySelectorAll("[role='dialog']")].map(d => ({ cls: String(d.className).slice(0, 60), text: (d.textContent ?? '').slice(0, 60) })),
}))
console.log('after Ctrl+,:', JSON.stringify(after))
await page.screenshot({ path: `${OUT}/02-ctrl-comma.png` })

if (after.dialogs.length === 0) {
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button, [role="button"]')].find(x => /设置/.test(x.textContent ?? '') && x.getBoundingClientRect().width > 0)
    if (b === undefined) return false
    b.click(); return true
  })
  await page.waitForTimeout(1800)
  after = await page.evaluate(() => ({ dialogs: [...document.querySelectorAll("[role='dialog']")].map(d => ({ cls: String(d.className).slice(0, 60), text: (d.textContent ?? '').slice(0, 80) })) }))
  console.log('after click settings button (' + clicked + '):', JSON.stringify(after))
  await page.screenshot({ path: `${OUT}/03-settings-click.png` })
}

writeFileSync(`${OUT}/explore.json`, JSON.stringify({ dump, after }, null, 2), 'utf8')
await context.close()
