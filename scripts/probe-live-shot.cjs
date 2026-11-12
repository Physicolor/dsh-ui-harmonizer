/**
 * Open the live GUI, print what the page shows, and screenshot it.
 * Run: DSH_HOME=D:/dsh-home DSH_LIVE_AUTHORITY=127.0.0.1:56636 node scripts/probe-live-shot.cjs
 */
const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveContext, close } = require(HARNESS)
const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function main() {
  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width: 1500, height: 1000 } })
  const page = await ctx.newPage()
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  const info = await page.evaluate(() => ({
    title: document.title,
    slots: [...document.querySelectorAll('[data-slot]')].map((n) => n.getAttribute('data-slot')).slice(0, 30),
    buttons: [...document.querySelectorAll('button')].map((b) => (b.textContent || '').trim()).filter(Boolean).slice(0, 30),
    body: document.body.innerText.slice(0, 600),
  }))
  console.log(JSON.stringify(info, null, 2))
  await page.screenshot({ path: 'D:/dsh-home/plugins/dsh-life/.screenshots/live.png' })
  await close()
}
main().catch(async (e) => { console.error(e); await close(); process.exit(1) })
