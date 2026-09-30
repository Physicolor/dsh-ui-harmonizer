/**
 * Stylesheet-keeper probe.
 *
 * Reproduces the product loader's theft against the LIVE page and checks that
 * the harmonizer puts the stylesheet back:
 *
 *  1. Settings → 通知 renders styled (baseline: `#dsh-notification-style` present,
 *     `.dsh_notification_card` has its border/radius).
 *  2. Simulate the loader: claim the tag for another plugin
 *     (`setAttribute('data-plugin', thief)`) and remove it, which is exactly what
 *     `claimStyles` + `removeOwnedStyles` do when the adopter reloads/unloads.
 *  3. After the grace period the stylesheet is back and the card is styled again.
 *  4. Owner-wins path: remove the tag and let its owner re-inject immediately
 *     (a hot reload) → the keeper must NOT add a second copy.
 *  5. Scope: a stylesheet that already carries `data-plugin` is the loader's own
 *     business and is never resurrected by us.
 *
 * Run: node scripts/probes/plugin-eco/probe-style-keeper.mjs [url]
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
const OUT = 'D:/dsh-home/probe-ui/style-keeper'
mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext(process.env.DSH_PROBE_PROFILE ?? 'D:/dsh-home/probe-ui/pw-profile-harmony', {
  executablePath: CHROME_CANDIDATES.find(p => existsSync(p)), headless: true, viewport: { width: 1560, height: 960 },
})
await context.addCookies([authCookieFor({ credentialsPath: 'D:/dsh-home/.credentials.yaml', url: URL_ARG, days: 1 }).cookie])
const page = await context.newPage()
await page.goto(URL_ARG, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector("[data-slot='main.conversation'], [data-slot='conversation']", { timeout: 45000 }).catch(() => null)
await page.waitForTimeout(3500)

await page.locator("[data-slot='settings.launcher'] button").first().click().catch(() => null)
await page.waitForTimeout(1200)
await page.locator("[role='dialog'] nav button", { hasText: '通知' }).first().click().catch(() => null)
await page.waitForTimeout(900)

const results = await page.evaluate(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const cardState = () => {
    const card = document.querySelector('.dsh_notification_card')
    if (card === null) return null
    const cs = getComputedStyle(card)
    return { border: cs.borderTopWidth, radius: cs.borderTopLeftRadius, background: cs.backgroundColor, display: cs.display }
  }
  const sheet = () => {
    const tag = document.getElementById('dsh-notification-style')
    return tag === null ? null : { rules: tag.sheet === null ? -1 : tag.sheet.cssRules.length, dataPlugin: tag.getAttribute('data-plugin') }
  }
  const out = { baseline: { sheet: sheet(), card: cardState() } }

  // 2. the theft: claim for another plugin, then remove (loader semantics).
  const tag = document.getElementById('dsh-notification-style')
  if (tag !== null) {
    tag.setAttribute('data-plugin', 'some-other-plugin')
    tag.remove()
  }
  out.afterTheft = { sheet: sheet(), card: cardState() }
  await sleep(1200)
  out.afterGrace = { sheet: sheet(), card: cardState() }

  // 4. owner-wins: remove, then let the owner re-inject at once (hot reload).
  const tag2 = document.getElementById('dsh-notification-style')
  if (tag2 !== null) {
    const clone = tag2.cloneNode(true)
    tag2.remove()
    document.head.appendChild(clone)
  }
  await sleep(1200)
  out.afterOwnerReinject = { count: document.querySelectorAll('#dsh-notification-style').length, card: cardState() }

  // 5. a bundler-emitted stylesheet (`data-plugin-css` present) belongs to the
  // loader's own hot-reload bookkeeping and must be left alone.
  const tagged = document.querySelector('style[data-plugin-css]')
  const taggedKey = tagged === null ? null : tagged.getAttribute('data-plugin-css')
  out.taggedProbe = { key: taggedKey, started: tagged !== null }
  if (tagged !== null) {
    tagged.remove()
    await sleep(1200)
    out.taggedProbe.restored = taggedKey === null ? null : document.querySelector(`style[data-plugin-css="${taggedKey}"]`) !== null
  }

  // 6. a sheet that is ALREADY mis-adopted when we first see it (data-plugin, no
  // data-plugin-css) is the state a long-running session is in; it must be kept
  // too, and restored WITHOUT the thief's claim attribute.
  const fake = document.createElement('style')
  fake.id = 'enhc-probe-stylesheet'
  fake.setAttribute('data-plugin', 'claiming-plugin')
  fake.textContent = '.enhc-probe-marker { color: rgb(1, 2, 3); }'
  document.head.appendChild(fake)
  await sleep(200)
  fake.remove()
  await sleep(1200)
  const restored = document.getElementById('enhc-probe-stylesheet')
  out.claimedProbe = {
    restored: restored !== null,
    dataPlugin: restored === null ? null : restored.getAttribute('data-plugin'),
    rules: restored === null ? -1 : (restored.sheet === null ? -1 : restored.sheet.cssRules.length),
  }
  restored?.remove()
  return out
})

const ok = (label, cond) => console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}`)
console.log('=== stylesheet keeper ===')
console.log('  baseline: ' + JSON.stringify(results.baseline))
console.log('  after theft: ' + JSON.stringify(results.afterTheft))
console.log('  after grace: ' + JSON.stringify(results.afterGrace))
console.log('  owner re-inject: ' + JSON.stringify(results.afterOwnerReinject))
console.log('  tagged sheet: ' + JSON.stringify(results.taggedProbe))
ok('notification stylesheet is present at baseline', results.baseline.sheet !== null && results.baseline.sheet.rules > 20)
ok('card is styled at baseline', results.baseline.card !== null && results.baseline.card.border !== '0px')
ok('the theft really removed the styles', results.afterTheft.sheet === null && results.afterTheft.card.border === '0px')
ok('the keeper restored the stylesheet', results.afterGrace.sheet !== null && results.afterGrace.sheet.rules > 20)
ok('the card is styled again', results.afterGrace.card !== null && results.afterGrace.card.border !== '0px')
ok('no duplicate when the owner re-injected', results.afterOwnerReinject.count === 1)
ok('bundler-emitted stylesheets are left alone', results.taggedProbe.restored === false)
ok('an already-claimed hand-written stylesheet is kept', results.claimedProbe.restored === true && results.claimedProbe.rules === 1)
ok('its stolen claim attribute is not restored', results.claimedProbe.dataPlugin === null)
writeFileSync(`${OUT}/style-keeper.json`, JSON.stringify(results, null, 2), 'utf8')
await context.close()
