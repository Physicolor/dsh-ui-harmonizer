/** Read a few alias tokens in BOTH themes (light / data-ds-dark-theme). */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { authCookieFor } from '../../lib/auth.mjs'

const require = createRequire('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/noop.js')
const { chromium } = require('playwright-core')
const EXE = ['C:/Users/12404/AppData/Local/ms-playwright/chromium-1246/chrome-win64/chrome.exe',
  'C:/Users/12404/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'].find(p => existsSync(p))
const URL_ARG = 'http://127.0.0.1:19387'
const context = await chromium.launchPersistentContext('D:/dsh-home/probe-ui/pw-profile-header', { executablePath: EXE, headless: true, viewport: { width: 1400, height: 900 } })
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4500)

const read = () => page.evaluate(() => {
  const body = getComputedStyle(document.body), html = getComputedStyle(document.documentElement)
  const get = (n) => body.getPropertyValue(n).trim() || html.getPropertyValue(n).trim()
  const names = ['--dsw-alias-label-primary', '--dsw-alias-label-tertiary', '--dsw-alias-bg-module-platform',
    '--dsw-alias-interactive-bg-hover', '--dsw-alias-bg-layer-1', '--dsw-menu-surface-fill',
    '--dsw-menu-backdrop-filter', '--dsw-elevation-prominent', '--dsw-radius-sm', '--dsw-radius-md', '--dsw-radius-lg']
  return { dark: document.body.hasAttribute('data-ds-dark-theme'), tokens: Object.fromEntries(names.map(n => [n, get(n)])) }
})
console.log('light:', JSON.stringify(await read(), null, 1))
await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', '') })
await page.waitForTimeout(600)
console.log('dark:', JSON.stringify(await read(), null, 1))
await context.close()
