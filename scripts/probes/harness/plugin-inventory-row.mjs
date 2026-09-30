/**
 * dsh-ui-harmonizer — what the Settings → plugins list actually renders per row.
 *
 * The list reads each plugin's `package.json.icon` + `locale/<lang>.json`
 * (`meta.title` / `meta.description`). This opens the list and dumps, for every
 * row, the icon it resolved (svg source or img src) plus the visible name and
 * description, so a manifest change can be confirmed without eyeballing a
 * screenshot.
 *
 *   node scripts/probes/harness/plugin-inventory-row.mjs [--match <substring>]
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authCookieFor } from '../../lib/auth.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../../dsh-widgets/scripts/lib/chrome.cjs'))

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const URL_ = arg('--url', process.env.DSH_URL ?? 'http://127.0.0.1:19387')
const MATCH = arg('--match', null)
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'

/** Every plugin row: name, description and the icon node it resolved. */
const READ_LIST = () => {
  const rows = [...document.querySelectorAll('div, li')].filter((el) => {
    const icon = el.querySelector(':scope > div svg, :scope > div img, :scope > svg, :scope > img')
    const text = (el.textContent ?? '').trim()
    return icon !== null && text.length > 12 && text.length < 400 && el.children.length >= 2
  })
  const seen = new Set()
  const out = []
  for (const el of rows) {
    const icon = el.querySelector('svg, img')
    const title = el.querySelector("div[class*='_title'], div[class*='_name'], h3, h4, strong")
    const desc = el.querySelector("div[class*='_desc'], div[class*='_description'], p")
    const name = (title?.textContent ?? '').trim().slice(0, 40)
    if (name === '' || seen.has(name)) continue
    seen.add(name)
    out.push({
      name,
      desc: (desc?.textContent ?? '').trim().slice(0, 70),
      iconTag: icon?.tagName.toLowerCase() ?? null,
      iconSrc: icon?.getAttribute?.('src') ?? null,
      iconViewBox: icon?.getAttribute?.('viewBox') ?? null,
      iconHead: icon?.outerHTML?.slice(0, 220) ?? null,
    })
  }
  return out
}

;(async () => {
  const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ })
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  await ctx.addCookies([cookie])
  const page = await ctx.newPage()
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(7000)
  const welcome = page.getByRole('button', { name: '继续' }).first()
  if (await welcome.count()) { await welcome.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500) }

  // The owner's list lives behind the SIDEBAR's 插件 entry (it groups rows into
  // 已安装 / 官方), not behind Settings → 内置插件 (that page lists the built-in
  // tool packages as cards).
  const entry = page.getByText('插件', { exact: true }).first()
  if (!(await entry.count())) { console.error('FAIL  no 插件 entry'); await browser.close(); process.exit(1) }
  await entry.click({ timeout: 8000 })
  await page.waitForTimeout(3000)
  // The list is fetched asynchronously and paints skeletons first; wait for a row
  // to actually exist before reading it.
  await page.waitForFunction(
    () => /dsh-widgets|dsh-better-sidebar|已安装/.test(document.body.innerText),
    null,
    { timeout: 45000 },
  ).catch(() => {})
  await page.waitForTimeout(3500)

  // A manifest change (icon / locale / exports) is picked up by the list's own
  // refresh button, which re-reads plugin metadata from disk.
  const refresh = page.getByRole('button', { name: /刷新|Refresh/i }).first()
  if (await refresh.count()) { await refresh.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(5000) }
  else console.log('(no refresh button found)')

  let rows = await page.evaluate(READ_LIST)
  if (MATCH !== null) rows = rows.filter((r) => (r.name + r.desc).includes(MATCH))

  // Scroll the widget row into view and dump its own subtree: that is the row the
  // owner cares about, and it also shows whether the icon/locale were resolved.
  const rowDump = await page.evaluate(() => {
    const all = [...document.querySelectorAll('*')]
    const hit = all.reverse().find((el) => (el.textContent ?? '').includes('dsh-widgets') && el.children.length <= 6)
    if (hit === undefined) return null
    hit.scrollIntoView({ block: 'center' })
    return {
      text: (hit.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 200),
      html: hit.outerHTML.slice(0, 1200),
    }
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: 'docs/verify-tmp/plugin-list-widgets.png' })
  console.log(JSON.stringify({ rows: rows.slice(0, 12), widgetRow: rowDump }, null, 1))
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
