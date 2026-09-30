/**
 * dsh-ui-harmonizer — who answers `/api/changes.summary`?
 *
 * The owner's console shows a 404 for
 *   dsh-app://app/api/changes.summary?sessionId=…&seq=1753
 * which the app.asar identifies as a PRODUCT route (`CHANGED_FILES_PATH` in the
 * workspace-changes plugin). This asks the running server directly, with and
 * without a session id, so the 404's meaning (route missing vs. no such session)
 * is measured instead of guessed.
 *
 *   node scripts/probes/harness/changes-summary-route.mjs
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authCookieFor } from '../../lib/auth.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(HERE, 'noop.js'))
const { chromium } = require(join('C:/Users/12404/AppData/Local/npm-cache/_npx/86170c4cd1c5da32/node_modules', 'playwright-core'))
const { chromePath } = require(join(HERE, '../../../../dsh-widgets/scripts/lib/chrome.cjs'))

const URL_ = process.env.DSH_URL ?? 'http://127.0.0.1:19387'
const CREDENTIALS = process.env.DSH_PROBE_CREDENTIALS ?? 'D:/dsh-home/.credentials.yaml'
const SESSION = process.argv[2] ?? 'session-a489babc-8e69-444e-8b21-5e79094fdb9b'

;(async () => {
  const { cookie } = authCookieFor({ credentialsPath: CREDENTIALS, url: URL_ })
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  await ctx.addCookies([cookie])
  const page = await ctx.newPage()
  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForTimeout(6000)

  const paths = [
    `/api/changes.summary?sessionId=${SESSION}&seq=1753`,
    '/api/changes.summary',
    `/api/changes.summary?sessionId=${SESSION}`,
    '/api/changes.files',
    '/api/workspace-changes/summary',
  ]
  const out = []
  for (const p of paths) {
    const r = await page.evaluate(async (path) => {
      try {
        const res = await fetch(path)
        const text = await res.text()
        return { path, status: res.status, type: res.headers.get('content-type'), body: text.slice(0, 200) }
      } catch (e) { return { path, status: 'ERR', body: String(e).slice(0, 120) } }
    }, p)
    out.push(r)
  }
  console.log(JSON.stringify(out, null, 1))
  await browser.close()
})().catch((e) => { console.error('FAILED:', e.stack || e.message); process.exit(1) })
