/**
 * A/B the content-visibility rule in the live page: measure placeholder count
 * and whether the newest item sits where the scroll claims before/after.
 */
const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveContext, close } = require(HARNESS)
const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function measure(page, label) {
  const data = await page.evaluate(() => {
    const scroll = document.querySelector("[class*='_scrollBody']")
    const items = [...document.querySelectorAll("[class$='_flowItem']")]
    const hs = items.map((i) => Math.round(i.getBoundingClientRect().height))
    const last = items.at(-1)?.getBoundingClientRect()
    const sr = scroll?.getBoundingClientRect()
    return {
      items: items.length,
      placeholders: hs.filter((h) => h === 120).length,
      scrollHeight: scroll?.scrollHeight,
      scrollTop: Math.round(scroll?.scrollTop ?? 0),
      lastBottom: last ? Math.round(last.bottom) : null,
      scrollBottom: sr ? Math.round(sr.bottom) : null,
      hiddenBelowViewport: last && sr ? Math.round(last.bottom - sr.bottom) : null,
    }
  })
  console.log(label, JSON.stringify(data))
  return data
}

async function main() {
  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width: 1500, height: 1000 } })
  const page = await ctx.newPage()
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(2000)
  const row = page.locator('text=dsh-life 通知、状态同步与任务 UI 修复').first()
  await row.click()
  await page.waitForTimeout(2000)
  await page.evaluate(() => { const s = document.querySelector("[class*='_scrollBody']"); if (s) s.scrollTop = s.scrollHeight })
  await page.waitForTimeout(500)
  await measure(page, 'with-cv   ')

  await page.addStyleTag({ content: "[class$='_flowItem']{content-visibility: visible !important; contain-intrinsic-size: none !important}" })
  await page.waitForTimeout(800)
  await page.evaluate(() => { const s = document.querySelector("[class*='_scrollBody']"); if (s) s.scrollTop = s.scrollHeight })
  await page.waitForTimeout(500)
  await measure(page, 'without-cv')
  await page.screenshot({ path: 'D:/dsh-home/plugins/dsh-life/.screenshots/live-no-cv.png' })
  await close()
}
main().catch(async (e) => { console.error(e); await close(); process.exit(1) })
