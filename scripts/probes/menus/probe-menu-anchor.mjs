/**
 * Row-popup width probe.
 *
 * The report: the sidebar account popup was narrower than the row it hangs from
 * (the desktop account menu: a 218px content-driven card under a 256px row).
 * The desktop account menu itself cannot be driven from a web profile (that
 * plugin is desktop-only), so this probe drives the MECHANISM against the live
 * page with a fixture that reproduces the product Menu primitive's mark-up
 * exactly — a width:100% anchor inside the `settings.launcher` seat plus a
 * portalled `[role=menu]` card in `<body>` — and then checks the negative
 * control: a menu opened from outside the seat keeps its own width.
 *
 * Run: node scripts/probes/menus/probe-menu-anchor.mjs [url]
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
const URL_ARG = process.argv[2] ?? process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const OUT = 'D:/dsh-home/probe-ui/menu-anchor'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

const results = await page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const width = el => Math.round(el.getBoundingClientRect().width)
  const seat = document.querySelector("[data-slot='settings.launcher']")

  /** The Menu primitive's shape: a full-width anchor plus a portalled card. */
  const fixture = (host, label) => {
    const root = document.createElement('span')
    root.style.cssText = 'display:flex;width:100%'
    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.style.cssText = 'display:block;width:100%;height:34px;border:0;background:transparent;font:inherit'
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-expanded', 'true')
    trigger.setAttribute('data-fixture', label)
    trigger.textContent = label
    root.appendChild(trigger)
    host.appendChild(root)
    return { root, trigger }
  }
  const card = label => {
    const el = document.createElement('div')
    el.setAttribute('role', 'menu')
    el.setAttribute('data-fixture', label)
    el.style.cssText = 'position:fixed;left:20px;top:20px;min-width:218px;max-width:360px;padding:4px;background:#fff'
    el.innerHTML = '<button role="menuitem" class="_item_">设置</button><button role="menuitem" class="_item_">意见反馈</button>'
    document.body.appendChild(el)
    return el
  }

  const out = { seat: seat === null ? 'missing' : String(seat.className).slice(0, 40) }

  if (seat !== null) {
    const inside = fixture(seat, 'fixture-row')
    const insideCard = card('inside')
    await sleep(400)
    out.insideRow = width(inside.trigger)
    out.insideCard = width(insideCard)
    out.insideInline = insideCard.getAttribute('style')
    // Release the trigger so the next fixture is the only open one.
    inside.trigger.setAttribute('aria-expanded', 'false')
    insideCard.remove()
    inside.root.remove()
  }

  const outsideHost = document.querySelector("[data-slot='conversation.composer.bar']") ?? document.body
  const outside = fixture(outsideHost, 'fixture-outside')
  const outsideCard = card('outside')
  await sleep(400)
  out.outsideRow = width(outside.trigger)
  out.outsideCard = width(outsideCard)
  out.outsideMarker = outsideCard.getAttribute('data-enhc-anchor-width')
  out.outsideInline = outsideCard.getAttribute('style')
  outside.trigger.setAttribute('aria-expanded', 'false')
  outsideCard.remove()
  outside.root.remove()

  return out
})

const ok = (label, cond) => console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}`)
console.log('=== row popup width ===')
console.log('  ' + JSON.stringify(results, null, 2).split('\n').join('\n  '))
ok('a launcher-seat row is the sidebar width', results.insideRow >= 200)
ok('its popup matches the row exactly (border-box)', results.insideCard === results.insideRow)
ok('a popup outside the seat is untouched', results.outsideMarker === null && results.outsideCard === 226)
writeFileSync(`${OUT}/menu-anchor.json`, JSON.stringify(results, null, 2), 'utf8')
await context.close()
