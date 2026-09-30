/**
 * dsh-ui-harmonizer — live check of the three "this rule never matches" claims.
 *
 * The CSS audit (2026-09-30) reported that several of our selectors are silently
 * dead because the product puts MULTIPLE classes on the target element, or
 * because a relationship is not the one we assumed. Three of those claims decide
 * whether the fix is "rename the selector" or "delete the rule", so they are
 * re-measured here against the running app instead of a synthetic fixture:
 *
 *   1. sidebar rows:  `[class$='_brand']` (trailing) vs `[class*='_brand']` (any)
 *   2. menu list:     `[role='menu'] [class^='_list_']` (descendant) vs
 *                     `[role='menu'][class^='_list_']` (same element)
 *   3. session header: `[data-slot='conversation.session.header'] > header` vs
 *                     `[data-slot='conversation.header'] > header`
 *
 *   node scripts/probes/harness/dom-anchors.mjs [--session <substring>]
 *
 * URL from DSH_URL, default http://127.0.0.1:19387.
 */
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authCookieFor } from '../../lib/auth.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL ?? 'http://127.0.0.1:19387')
const SESSION = arg('--session', 'dsh-widgets')
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'

/** The three claims, measured on whatever is currently on screen. */
const MEASURE = () => {
  const count = (sel) => { try { return document.querySelectorAll(sel).length } catch { return `ERR ${sel}` } }
  const css = (sel, prop) => { try { const el = document.querySelector(sel); return el === null ? null : getComputedStyle(el).getPropertyValue(prop).trim() } catch { return `ERR ${sel}` } }
  const sample = (sel, n = 4) => [...document.querySelectorAll(sel)].slice(0, n).map((el) => ({
    tag: el.tagName.toLowerCase(),
    cls: String(el.className).replace(/\s+/g, ' ').trim().slice(0, 90),
    slot: el.getAttribute('data-slot'),
    role: el.getAttribute('role'),
    haspopup: el.getAttribute('aria-haspopup'),
    expanded: el.getAttribute('aria-expanded'),
  }))
  return {
    sidebar: {
      trailing_brand: count("[class$='_brand']"),
      any_brand: count("[class*='_brand']"),
      trailing_newSessionLabel: count("[class$='_newSessionLabel']"),
      any_newSessionLabel: count("[class*='_newSessionLabel']"),
      trailing_iconButton: count("[class$='_iconButton']"),
      any_iconButton: count("[class*='_iconButton']"),
      brandSamples: sample("[class*='_brand']"),
    },
    menu: {
      // Both forms are measured with whatever menus happen to be open, so the
      // caller opens one first (see the flow below).
      sameElement_list: count("[role='menu'][class^='_list_']"),
      descendant_list: count("[role='menu'] [class^='_list_']"),
      any_list: count("[class^='_list_']"),
      menuSamples: sample("[role='menu']", 3),
    },
    header: {
      session_header_child: count("[data-slot='conversation.session.header'] > header"),
      header_child: count("[data-slot='conversation.header'] > header"),
      any_headers: count('header'),
      sessionHeaderSamples: sample("[data-slot='conversation.session.header']", 3),
    },
    /**
     * The FIXED selectors, read as computed styles: if the rule applies at all,
     * these come back as our numbers (200px / 182px / 218px / 40px at scale 1)
     * instead of the product's defaults. This is what proves the repair, not the
     * match count above.
     */
    computed: {
      newSessionLabelMaxWidth: css("[data-slot='sidebar'] [class*='_newSessionLabel']:is([class$='_newSessionLabel'], [class*='_newSessionLabel '])", 'max-width'),
      newSessionHeight: css("[data-slot='sidebar'] [class*='_newSession']:is([class$='_newSession'], [class*='_newSession '])", 'height'),
      brandSvgWidth: css("[data-slot='sidebar'] [class*='_brand']:is([class$='_brand'], [class*='_brand ']) svg", 'width'),
      menuListMinWidth: css("[role='menu'][class*='_list_']", 'min-width'),
      menuListPadding: css("[role='menu'][class*='_list_']", 'padding'),
      menuItemMinHeight: css("[role='menu'] [class*='_item_']", 'min-height'),
    },
  }
}

;(async () => {
  const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ })
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([cookie])
  const page = await ctx.newPage()
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1200) }

  const row = page.locator('div[class*="sessionRow"]', { hasText: SESSION }).first()
  if (await row.count()) { await row.click({ timeout: 8000 }); await page.waitForTimeout(4000) }
  else console.log(`(no session row matching "${SESSION}" — measuring the shell as-is)`)

  const beforeMenu = await page.evaluate(MEASURE)

  // Open one menu so claim 2 has a subject: click the first MENU-type trigger
  // (the composer's model / permission pickers both declare aria-haspopup=menu;
  // plain `click()` in the page avoids the drawer-style pointerdown guards).
  const opened = await page.evaluate(() => {
    const trigger = [...document.querySelectorAll("[aria-haspopup='menu']")]
      .find((el) => el.getBoundingClientRect().width > 0)
    if (trigger === undefined) return false
    trigger.click()
    return true
  })
  await page.waitForTimeout(900)
  const withMenu = await page.evaluate(MEASURE)

  console.log(JSON.stringify({ beforeMenu, withMenu, menuOpened: opened }, null, 1))
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
