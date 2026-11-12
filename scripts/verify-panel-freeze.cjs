#!/usr/bin/env node
/**
 * Live guard for the 2026-10-21 right-panel FREEZE.
 *
 * The regression: with the widget rail open and the right panel's 文件 tab
 * populated, toggling the panel could feed the settle MutationObserver through
 * dsh-widgets' composer-seat writes. The renderer then stayed inside
 * `settleTransitions` (7.2 s self time measured) and the whole window stopped
 * answering clicks while a compositor animation kept running.
 *
 * What this checks, with a hard 6 s per-UI-call timeout: the same sequence —
 * widget rail open, panel opened on the files tab, closed, reopened — completes.
 * A timeout is a FAIL, not a retry: that is exactly the freeze signature.
 *
 *   node scripts/verify-panel-freeze.cjs [--url <origin>] [--session <text>]
 *
 * Requires the live GUI and dsh-widgets installed. It leaves the panel closed
 * and does not move the rail's persisted open state (it only opens the rail if
 * the profile has it closed, and does not close it again).
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
  try { ({ chromium } = require(candidate)); break } catch { /* next */ }
}
if (chromium === null) { console.error('playwright-core not found'); process.exit(1) }
const { chromePath } = (() => { try { return require('../../dsh-widgets/scripts/lib/chrome.cjs') } catch { return {} } })()
const resolveChrome = () => (typeof chromePath === 'function' ? chromePath() : (process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL || 'http://127.0.0.1:3080')
const SESSION = arg('--session', '优化 dsh-widgets')
const TIMEOUT = Number(arg('--timeout', 6000))

function authCookie() {
  const yaml = fs.readFileSync('D:/dsh-home/.credentials.yaml', 'utf8')
  const secret = Buffer.from(yaml.match(/secret:\s*([A-Za-z0-9_-]+)/)[1].replaceAll('-', '+').replaceAll('_', '/'), 'base64')
  const authority = new global.URL(URL_).host
  const b64u = (b) => Buffer.from(b).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  const name = 'dsh-auth-' + b64u(crypto.createHash('sha256').update(authority).digest())
  const now = Date.now()
  const body = b64u(Buffer.from(JSON.stringify({ version: 1, authority, issuedAt: now, expiresAt: now + 86400000 }), 'utf8'))
  return { name, value: `v1.${body}.${b64u(crypto.createHmac('sha256', secret).update(body).digest())}`, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Strict' }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let failures = 0
function check(ok, label, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail === undefined ? '' : ' — ' + detail}`)
  if (!ok) failures += 1
}

async function step(page, label, fn) {
  try {
    const value = await fn()
    console.log(`  ..  ${label}`)
    return value
  } catch (error) {
    check(false, label + ' (the renderer stopped answering)', String(error.message || error).slice(0, 120))
    throw error
  }
}

;(async () => {
  const browser = await chromium.launch({ executablePath: resolveChrome(), headless: false })
  const ctx = await browser.newContext({ viewport: { width: 1707, height: 1067 }, deviceScaleFactor: 1.5 })
  await ctx.addCookies([authCookie()])
  const page = await ctx.newPage()
  page.setDefaultTimeout(TIMEOUT)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)))
  try {
    await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 40000 })
    await sleep(5000)
    await page.waitForSelector('[class*="sessionRow"]', { timeout: 15000 })
    await step(page, 'open the target session', () => page.evaluate((want) => {
      const rs = [...document.querySelectorAll('[class*="sessionRow"]')]
      const hit = rs.find((r) => (r.innerText || '').includes(want)) || rs[1]
      hit?.click(); return !!hit
    }, SESSION))
    for (let i = 0; i < 60; i++) {
      if (await page.evaluate(() => document.querySelectorAll('[data-conversation-scroll] *').length > 500)) break
      await sleep(300)
    }
    await sleep(800)
    // Widget rail open: the panel must open OVER a populated rail, which is the
    // state the freeze was reported in.
    await step(page, 'open the widget rail', async () => {
      for (let i = 0; i < 4; i++) {
        const s = await page.evaluate(() => ({ capsule: document.querySelector('.dsx-stats-capsule')?.getAttribute('aria-pressed'), cards: document.querySelectorAll('.dsx-stats-card-slot').length }))
        if (s.cards > 0 && s.capsule === 'true') return s
        await page.evaluate(() => document.querySelector('.dsx-stats-capsule')?.click())
        await sleep(1200)
      }
      throw new Error('the widget rail did not open')
    })
    await sleep(1000)
    await step(page, 'open the right panel', () => page.evaluate(() => (document.querySelector('[data-sidebar-right-expand]') || document.querySelector('[data-sidebar-right-toggle]'))?.click()))
    await sleep(1200)
    await step(page, 'activate the files tab', () => page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => (x.innerText || '').includes('工作区文件'))
      b?.click(); return !!b
    }))
    await sleep(1500)
    const populated = await page.evaluate(() => ({ panel: Math.round(document.querySelector('[class$="_rightbarCol"]')?.getBoundingClientRect().width ?? 0), tabs: [...document.querySelectorAll('[class$="_rightbarCol"] [role="tab"]')].map((t) => (t.innerText || '').trim()), cards: document.querySelectorAll('.dsx-stats-card-slot').length }))
    check(populated.panel > 1 && populated.tabs.includes('文件') && populated.cards > 0, 'the reported state is populated (panel + files tab + rail cards)', JSON.stringify(populated))
    await step(page, 'close the panel', () => page.evaluate(() => document.querySelector('[data-sidebar-right-toggle]')?.click()))
    await sleep(1800)
    await step(page, 'reopen the panel over the populated state', () => page.evaluate(() => (document.querySelector('[data-sidebar-right-expand]') || document.querySelector('[data-sidebar-right-toggle]'))?.click()))
    await sleep(1200)
    const reopened = await page.evaluate(() => Math.round(document.querySelector('[class$="_rightbarCol"]')?.getBoundingClientRect().width ?? 0))
    check(reopened > 1, 'the reopen completed and the panel is on screen', `${reopened}px`)
    await step(page, 'close it again', () => page.evaluate(() => document.querySelector('[data-sidebar-right-toggle]')?.click()))
    check(errors.length === 0, 'no page errors', errors.length ? errors.join(' | ') : 'none')
  } catch (error) {
    check(false, 'the freeze guard aborted', String(error.message || error).slice(0, 160))
  }
  await browser.close()
  console.log(`\n${failures === 0 ? 'PASSED' : 'FAILED'} — panel freeze guard`)
  process.exit(failures === 0 ? 0 : 1)
})()
