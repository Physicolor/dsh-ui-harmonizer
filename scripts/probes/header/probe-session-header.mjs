/**
 * Session-header geometry probe (live, read-only).
 *
 * Answers, against the running instance: how tall is the session header, what
 * are its computed paddings/min-height, is the product's `::after` divider
 * still painting, and where do the relocated session tabs sit.
 *
 * Run: node scripts/probes/header/probe-session-header.mjs [url]
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
await page.waitForSelector("[data-slot='conversation.session.header'], [data-slot='main.conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(4000)

const REPORT = () => {
  const R = el => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }
  const out = { url: location.href, slots: [], header: null, after: null, tabs: null, sheets: [] }
  out.slots = [...document.querySelectorAll('[data-slot]')].map(el => el.getAttribute('data-slot')).filter((v, i, a) => a.indexOf(v) === i).sort()

  const host = document.querySelector("[data-slot='conversation.session.header']")
  const header = host === null ? null : host.querySelector(':scope > header')
  if (header !== null) {
    const cs = getComputedStyle(header)
    out.header = {
      rect: R(header),
      cls: String(header.className),
      hostRect: R(host),
      hostCls: String(host.className),
      padding: cs.padding, minHeight: cs.minHeight, height: cs.height,
      borderBottom: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`,
      marginRight: cs.marginRight, zIndex: cs.zIndex, background: cs.backgroundColor,
      alignItems: cs.alignItems, display: cs.display, gap: cs.gap,
      inline: header.getAttribute('style'),
    }
    const pa = getComputedStyle(header, '::after')
    out.after = { content: pa.content, height: pa.height, bottom: pa.bottom, background: pa.backgroundColor, width: pa.width, display: pa.display }
    const pb = getComputedStyle(header, '::before')
    out.before = { content: pb.content, height: pb.height, background: pb.backgroundColor }
    /* Direct children boxes — tells us the real visual band of the row. */
    out.children = [...header.children].map(el => ({
      cls: String(el.className).slice(0, 60), rect: R(el),
      text: (el.textContent ?? '').trim().slice(0, 24),
    }))
    /* The parent chain: where does the extra vertical space come from? */
    out.chain = []
    for (let el = header.parentElement; el !== null && el !== document.body; el = el.parentElement) {
      const s = getComputedStyle(el)
      out.chain.push({
        tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40),
        rect: R(el), padTop: s.paddingTop, padBottom: s.paddingBottom, rowGap: s.rowGap,
        slot: el.getAttribute('data-slot'),
      })
      if (out.chain.length > 5) break
    }
  }
  const tabs = document.querySelector("[class*='_tabs']")
  if (tabs !== null) {
    const cs = getComputedStyle(tabs)
    out.tabs = { rect: R(tabs), cls: String(tabs.className).slice(0, 60), margin: cs.margin, padding: cs.padding, gap: cs.gap, parentCls: String(tabs.parentElement.className).slice(0, 60) }
  }
  out.sheets = [...document.querySelectorAll('style')]
    .map(el => ({ owner: el.dataset.plugin ?? el.dataset.pluginCss ?? '', n: (el.textContent ?? '').length }))
    .filter(s => s.owner !== '')
  out.media = matchMedia('(min-width: 900px)').matches
  return out
}

const result = await page.evaluate(REPORT)
await page.screenshot({ path: `${OUT}/full.png` })
await page.screenshot({ path: `${OUT}/top.png`, clip: { x: 0, y: 0, width: 1560, height: 140 } })
writeFileSync(`${OUT}/report.json`, JSON.stringify(result, null, 2), 'utf8')
console.log(JSON.stringify(result, null, 2))
await context.close()
