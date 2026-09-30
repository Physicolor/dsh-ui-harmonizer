/**
 * Diagnostic: why does a fresh headless browser fail to boot the DSH web UI?
 * Captures every failed HTTP response, the boot globals, and the rendered text.
 * Run: node scripts/probe-diag.mjs [url]
 */
import { createRequire } from 'node:module'
const require = createRequire('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/noop.js')
const { chromium } = require('playwright-core')
const EXE = 'C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe'
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const USER_DATA = process.argv[3] ?? null

const launchOpts = { executablePath: EXE, headless: true }
if (USER_DATA !== null) launchOpts.args = [`--user-data-dir=${USER_DATA}`]
const browser = await chromium.launchPersistentContext(USER_DATA ?? '', {
  ...(USER_DATA === null ? { executablePath: EXE, headless: true } : { headless: true, args: [`--user-data-dir=${USER_DATA}`] }),
  viewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
const bad = []
page.on('response', async r => {
  if (r.status() >= 400) bad.push({ status: r.status(), url: r.url().slice(0, 200), type: r.request().resourceType() })
})
page.on('requestfailed', r => bad.push({ status: 'FAILED', url: r.url().slice(0, 200), err: r.failure()?.errorText }))

await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(10000)
const info = await page.evaluate(() => ({
  title: document.title,
  href: location.href,
  boot: typeof window.__DSH_BOOT__ === 'undefined' ? 'undefined' : JSON.stringify(window.__DSH_BOOT__).slice(0, 300),
  bodyText: (document.body.innerText || '').slice(0, 300),
  bodyHtmlLen: document.body.innerHTML.length,
  rootChildren: document.getElementById('root')?.children.length ?? -1,
  styleCount: document.head.querySelectorAll('style').length,
  linkCount: document.head.querySelectorAll('link').length,
  cookies: document.cookie.slice(0, 200),
  ls: Object.keys(localStorage).slice(0, 20),
}))
console.log(JSON.stringify(info, null, 2))
console.log('=== failed responses ===')
for (const b of bad.slice(0, 25)) console.log(' ', JSON.stringify(b))
await browser.close()
