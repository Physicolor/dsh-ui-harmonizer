/**
 * dsh-ui-harmonizer — pull the harness' own 36x36 tile icons out of app.asar.
 *
 * `scripts/tools/icon-preview.mjs` asserts our icon's clearance against the
 * officials it embeds (agent-team / auto-review / schedule / voice-input). Those
 * four SVGs were produced by this probe, so a harness update can be re-checked
 * in one command instead of trusting a stale copy:
 *
 *   node scripts/tools/asar-icon-svgs.mjs [--out <dir>]     # default: <tmp>/dsh-official-icons
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i === -1 ? dflt : process.argv[i + 1] }
const OUT = arg('--out', join(tmpdir(), 'dsh-official-icons'))

/** A machine can keep LocalAppData on another drive (this one does), so probe candidates. */
const user = process.env.USERNAME || process.env.USER
const CANDIDATES = [
  process.env.DSH_APP_ASAR,
  process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Programs/DeepSeek Harness/resources/app.asar'),
  user && `D:/Users/${user}/AppData/Local/Programs/DeepSeek Harness/resources/app.asar`,
  user && `C:/Users/${user}/AppData/Local/Programs/DeepSeek Harness/resources/app.asar`,
].filter(Boolean)
const ASAR = arg('--asar', CANDIDATES.find((p) => existsSync(p)))
if (!ASAR) throw new Error(`no app.asar found; pass --asar (tried: ${CANDIDATES.join(', ')})`)

const buf = readFileSync(ASAR)
const header = JSON.parse(buf.subarray(16, 16 + buf.readUInt32LE(12)).toString('utf8'))
const dataStart = 16 + buf.readUInt32LE(12)

const entries = []
const walk = (node, path) => {
  for (const [name, child] of Object.entries(node.files || {})) {
    const p = path ? `${path}/${name}` : name
    if (child.files) walk(child, p)
    else entries.push({ path: p, ...child })
  }
}
walk(header, '')

const icons = entries.filter((e) => /(^|\/)icon\.svg$/.test(e.path))
mkdirSync(OUT, { recursive: true })
for (const [i, icon] of icons.entries()) {
  const start = dataStart + Number(icon.offset || 0)
  const file = join(OUT, `${String(i).padStart(2, '0')}-${icon.path.split('/').slice(-2)[0]}.svg`)
  writeFileSync(file, buf.subarray(start, start + Number(icon.size)))
  console.log(`${file}   <- ${icon.path}`)
}
console.log(`${icons.length} icon.svg of ${entries.length} asar entries`)
