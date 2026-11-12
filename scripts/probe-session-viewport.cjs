/**
 * Open a long session in the live GUI and measure the transcript viewport.
 *
 * The reported symptom is "the conversation content sits too high". The
 * measurable forms of that are: items rendered at the 120px placeholder, the
 * newest item clipped under the composer, or scrollTop landing short of the
 * bottom after a programmatic scroll.
 */
const HARNESS = 'D:/dsh-home/plugins/dsh-widgets/scripts/lib/probe-harness.cjs'
const { liveContext, close } = require(HARNESS)
const AUTHORITY = process.env.DSH_LIVE_AUTHORITY || '127.0.0.1:56636'

async function main() {
  const ctx = await liveContext({ authority: AUTHORITY, viewport: { width: 1500, height: 1000 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror:', e.message))
  await page.goto(`http://${AUTHORITY}/`, { waitUntil: 'load' })
  await page.waitForTimeout(2500)
  const row = page.locator('text=dsh-life 通知、状态同步与任务 UI 修复').first()
  if (await row.count()) {
    await row.click()
  } else {
    console.log('session row not found')
  }
  await page.waitForTimeout(2500)

  const info = await page.evaluate(() => {
    const root = document.querySelector("[data-slot='conversation.session']")
    const scroll = document.querySelector("[class*='_scrollBody']")
    const items = [...document.querySelectorAll("[class$='_flowItem']")]
    const rects = items.map((item) => {
      const r = item.getBoundingClientRect()
      return { h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom) }
    })
    const last = rects.at(-1)
    return {
      items: items.length,
      placeholder120: rects.filter((r) => r.h === 120).length,
      scrollTop: scroll ? Math.round(scroll.scrollTop) : null,
      scrollHeight: scroll ? scroll.scrollHeight : null,
      clientHeight: scroll ? scroll.clientHeight : null,
      scrollRect: scroll ? (({ top, height }) => ({ top: Math.round(top), height: Math.round(height) }))(scroll.getBoundingClientRect()) : null,
      rootRect: root ? (({ top, height }) => ({ top: Math.round(top), height: Math.round(height) }))(root.getBoundingClientRect()) : null,
      last,
      composer: (() => {
        const c = document.querySelector("[data-slot='conversation.composer']")
        return c ? JSON.stringify(c.getBoundingClientRect()) : null
      })(),
      cv: items[0] ? getComputedStyle(items[0]).contentVisibility : null,
    }
  })
  console.log(JSON.stringify(info, null, 2))

  // The self-scroll test: does the bottom stay put after the browser settles?
  const jump = await page.evaluate(async () => {
    const scroll = document.querySelector("[class*='_scrollBody']")
    if (!scroll) return null
    scroll.scrollTop = scroll.scrollHeight
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    const a = scroll.scrollTop
    await new Promise((r) => setTimeout(r, 400))
    const b = scroll.scrollTop
    return { afterScroll: Math.round(a), settled: Math.round(b), gap: Math.round(scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight) }
  })
  console.log('jump', JSON.stringify(jump))
  await page.screenshot({ path: 'D:/dsh-home/plugins/dsh-life/.screenshots/live-session.png' })
  await close()
}
main().catch(async (e) => { console.error(e); await close(); process.exit(1) })
