/**
 * Mint a browser-session cookie for the local dsh web server.
 *
 * dsh 0.1.5 gates the UI behind a cookie signed with a secret persisted in
 * <DSH_HOME>/.credentials.yaml under `client-connection/browser-session`.
 * The launch URL's `?token=` only exchanges for that cookie; the token itself
 * lives in the server process's memory (a WeakMap), so a headless probe cannot
 * obtain it. Reproducing the documented encoding (v1.<base64url body>.<hmac>)
 * lets the probe authenticate against the user's own instance without touching
 * their session, restart, or token.
 *
 * The secret is never logged or returned to callers.
 */

import { readFileSync } from 'node:fs'
import { createHash, createHmac } from 'node:crypto'

/** base64url without padding, the encoding every value in the cookie uses. */
const b64url = (buf) => Buffer.from(buf).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')

/**
 * Read the browser-session signing secret from the credentials file.
 * @param credentialsPath - absolute path to `.credentials.yaml`.
 * @returns the base64url secret string (never logged by this module).
 */
export function readBrowserSecret(credentialsPath) {
  const lines = readFileSync(credentialsPath, 'utf8').split(/\r?\n/u)
  let inRecord = false
  for (const line of lines) {
    if (/^\s*client-connection\/browser-session:\s*$/u.test(line)) { inRecord = true; continue }
    if (!inRecord) continue
    // A new top-level record key ends this record's block.
    if (/^\s{2}\S/u.test(line) && !/^\s{4}/u.test(line)) break
    const match = /^\s+secret:\s*(\S+)\s*$/u.exec(line)
    if (match !== null) return match[1]
  }
  throw new Error(`browser-session secret not found in ${credentialsPath}`)
}

/**
 * Build the exact cookie the server will accept.
 * @param options - secret, request authority (`host:port`) and lifetime in days.
 * @returns cookie name, value and expiry (ms epoch).
 */
export function mintCookie({ secret, authority, days = 1 }) {
  const secretBytes = Buffer.from(secret, 'base64')
  if (secretBytes.byteLength !== 32) throw new Error(`unexpected secret length ${secretBytes.byteLength}`)
  const name = 'dsh-auth-' + b64url(createHash('sha256').update(authority).digest())
  const issuedAt = Date.now()
  const expiresAt = issuedAt + days * 24 * 60 * 60 * 1000
  const payload = { version: 1, authority, issuedAt, expiresAt }
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'))
  const signature = b64url(createHmac('sha256', secretBytes).update(body).digest())
  return { name, value: `v1.${body}.${signature}`, expiresAt }
}

/**
 * Playwright cookie descriptor for a minted cookie.
 * @param options - credentials path, target URL and lifetime.
 * @returns `{ cookie, authority }` ready for `context.addCookies`.
 */
export function authCookieFor({ credentialsPath, url, days = 1 }) {
  const authority = new URL(url).host
  const { name, value, expiresAt } = mintCookie({ secret: readBrowserSecret(credentialsPath), authority, days })
  return {
    authority,
    cookie: {
      name,
      value,
      domain: new URL(url).hostname,
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
      expires: Math.floor(expiresAt / 1000),
    },
  }
}
