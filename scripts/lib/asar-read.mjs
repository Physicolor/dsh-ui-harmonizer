/**
 * Read a byte range out of an .asar archive (the desktop app ships its client
 * bundles inside one) and print it as UTF-8, or search it for a UTF-8 needle
 * and print the surrounding context.
 *
 * The desktop app's product bundles differ from the npx-installed ones the web
 * profile loads (only by CSS-module hash prefix, but that is exactly what a
 * selector must match), so both copies have to be readable.
 *
 * Usage:
 *   node scripts/lib/asar-read.mjs <asar> --find "<utf8 needle>" [--before N] [--after N] [--max K]
 *   node scripts/lib/asar-read.mjs <asar> --at <offset> --len N
 */
import { readFileSync } from 'node:fs'

const [file, ...rest] = process.argv.slice(2)
if (file === undefined) { console.error('usage: asar-read.mjs <asar> --find <needle> | --at <off> --len <n>'); process.exit(2) }
const arg = (name, fallback) => {
  const i = rest.indexOf(name)
  return i === -1 ? fallback : rest[i + 1]
}
const buf = readFileSync(file)

if (rest.includes('--find')) {
  const needle = Buffer.from(arg('--find', ''), 'utf8')
  const before = Number(arg('--before', 600))
  const after = Number(arg('--after', 1800))
  const max = Number(arg('--max', 3))
  let found = 0
  let from = 0
  while (found < max) {
    const at = buf.indexOf(needle, from)
    if (at === -1) break
    found += 1
    from = at + needle.length
    const start = Math.max(0, at - before)
    const end = Math.min(buf.length, at + after)
    console.log(`--- hit #${found} @ ${at} ---`)
    console.log(buf.subarray(start, end).toString('utf8'))
    console.log('')
  }
  if (found === 0) console.log('(no hit)')
} else {
  const at = Number(arg('--at', 0))
  const len = Number(arg('--len', 2000))
  process.stdout.write(buf.subarray(at, at + len).toString('utf8'))
}
