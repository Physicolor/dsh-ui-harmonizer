/**
 * dsh-ui-harmonizer — quick triage: what the sidebar brand area renders as, and
 * every console error + failed request the shell produces on load.
 *
 *   node scripts/probes/harness/brand-and-console.mjs [--out docs/verify-tmp]
 */
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authCookieFor } from '../../lib/auth.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL ?? 'http://127.0.0.1:19387')
const OUT = arg('--out', 'docs/verify-tmp')
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'

const BRAND = () => {
  const box = (el) => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
  const svgs = [...document.querySelectorAll("[data-slot='sidebar'] svg")].map((el) => ({
    cls: String(el.parentElement?.className ?? '').slice(0, 60),
    box: box(el),
    viewBox: el.getAttribute('viewBox'),
    width: getComputedStyle(el).width,
    height: getComputedStyle(el).height,
    natural: (() => { try { return [el.width.baseVal.value, el.height.baseVal.value] } catch { return null } })(),
  }))
  const brandHit = [...document.querySelectorAll("[data-slot='sidebar'] [class*='_brand']:is([class$='_brand'], [class*='_brand '])")]
  return {
    brandHitCount: brandHit.length,
    brandHitBoxes: brandHit.map(box),
    svgCount: svgs.length,
    svgs: svgs.slice(0, 10),
    hasRule: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => (r.cssText ?? '').includes("_brand")) } catch { return false } }),
  }
}

;(async () => {
  mkdirSync(OUT, { recursive: true })
  const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ })
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([cookie])
  const page = await ctx.newPage()

  const consoleErrors = []
  const failed = []
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(`${m.type()}: ${m.text().slice(0, 200)}`) })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 200)}`))
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 160)}`) })

  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(9000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(2000) }

  // A long session is where the product streams events (`…&seq=NNN` URLs), so the
  // 503/404 the owner sees there need a session open, not just the shell.
  const SESSION = arg('--session', null)
  if (SESSION !== null) {
    const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
    if (await row.count()) {
      await row.click({ timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(12000)
      // Nudge the stream: scroll the transcript to the bottom.
      await page.mouse.wheel(0, 4000).catch(() => {})
      await page.waitForTimeout(6000)
    } else {
      console.log(`(no session row matching "${SESSION}")`)
    }
  }

  const brand = await page.evaluate(BRAND)
  await page.screenshot({ path: join(OUT, 'brand-area.png'), clip: { x: 0, y: 0, width: 340, height: 110 } })
  await page.waitForTimeout(4000)

  console.log(JSON.stringify({ brand, consoleErrors, failed }, null, 1))
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
