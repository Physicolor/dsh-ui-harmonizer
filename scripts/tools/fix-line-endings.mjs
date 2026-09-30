/**
 * Restore the per-file line ending convention after an editor wrote CRLF into
 * files whose committed form is LF.
 *
 * Each file below is checked against its own HEAD blob: if HEAD is LF-only and the
 * working copy is CRLF, the working copy is rewritten with LF (content otherwise
 * byte-identical), so the diff shows the actual change instead of the whole file.
 *
 * Run: node scripts/tools/fix-line-endings.mjs <repoRoot> <file...>
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [root, ...files] = process.argv.slice(2)
if (root === undefined || files.length === 0) {
  console.error('usage: fix-line-endings.mjs <repoRoot> <file...>')
  process.exit(2)
}

const count = s => ({ crlf: (s.match(/\r\n/gu) ?? []).length, lf: (s.match(/(?<!\r)\n/gu) ?? []).length })

for (const file of files) {
  const abs = resolve(root, file)
  const head = execSync(`git show HEAD:${file}`, { cwd: root, maxBuffer: 64 * 1024 * 1024 }).toString('utf8')
  const disk = readFileSync(abs, 'utf8')
  const h = count(head)
  const d = count(disk)
  if (h.crlf === 0 && h.lf > 0 && d.crlf > 0) {
    writeFileSync(abs, disk.split('\r\n').join('\n'), 'utf8')
    console.log(`LF restored: ${file} (${d.crlf} CRLF → ${count(readFileSync(abs, 'utf8')).crlf})`)
  } else {
    console.log(`left as is: ${file} (HEAD crlf=${h.crlf} lf=${h.lf}, disk crlf=${d.crlf} lf=${d.lf})`)
  }
}
