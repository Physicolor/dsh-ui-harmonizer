/**
 * Harness UI Enhancer — host half.
 *
 * Two feature areas with NO official visual seat yet:
 *
 *  1. MCP server management — dsh-mcp-client rows in the profile's
 *     `cordis.patch.yml`; DSH hot-applies that file, so writes take effect
 *     without a restart.
 *  2. Scheduled automation (WorkBuddy-style recurring prompts) — a persistent
 *     task list (name / workspace / time / prompt / frequency) plus a run
 *     history. A fiber timer checks due tasks and executes each one as a
 *     fresh one-shot subagent (`spawn` provider) whose initial user message
 *     IS the task prompt — exactly "auto-add a session in a workspace and
 *     output a preset prompt". Runs are recorded in history regardless of
 *     outcome.
 *
 * Everything is exposed to the browser half through ONE same-origin route:
 *
 *   POST /enhancer/enhancer-api   body: { kind, ... }
 *
 * All side effects are Fiber-scoped via ctx.effect; the route and the due
 * timer disappear on stop/update/removal.
 */

import { createRequire } from 'node:module'
import { join } from 'node:path'

const require = createRequire(import.meta.url)

/** Services this host half hard-depends on. */
export const inject = ['webServer', 'jobs', 'fs', 'subagents', 'agents']

const ROUTE = '/enhancer/enhancer-api'

/* ------------------------------------------------------------------ */
/* small helpers                                                       */
/* ------------------------------------------------------------------ */

/** Accumulate a Node IncomingMessage body into a small JSON object. */
async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  const text = Buffer.concat(chunks).toString('utf-8')
  if (text.length === 0) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

function ok(value) {
  return { ok: true, ...value }
}

function fail(message) {
  return { ok: false, error: String(message) }
}

function patchFilePath() {
  const home = process.env.DSH_HOME
  if (home !== undefined && home.length > 0) return join(home, 'profiles', 'web', 'cordis.patch.yml')
  return join(require('node:os').homedir(), '.dsh', 'profiles', 'web', 'cordis.patch.yml')
}

function tasksFilePath() {
  const home = process.env.DSH_HOME
  if (home !== undefined && home.length > 0) return join(home, 'profiles', 'web', 'enhancer-tasks.json')
  return join(require('node:os').homedir(), '.dsh', 'profiles', 'web', 'enhancer-tasks.json')
}

/* ------------------------------------------------------------------ */
/* MCP patch-file serialization                                        */
/* ------------------------------------------------------------------ */

/** Serialize one dsh-mcp-client row into the profile patch's YAML shape. */
function serializeMcpRow(s) {
  const lines = ['  - id: mcp-' + s.serverName, "    name: '@deepseek-ai/dsh-mcp-client'", '    config:']
  lines.push('      serverName: ' + JSON.stringify(s.serverName))
  const transport = s.transport === 'http' ? 'http' : 'stdio'
  lines.push('      transport: ' + JSON.stringify(transport))
  if (transport === 'http') {
    lines.push('      url: ' + JSON.stringify(s.url || ''))
    if (s.headers) lines.push('      headers: ' + JSON.stringify(s.headers))
  } else {
    lines.push('      command: ' + JSON.stringify(s.command || ''))
    if (Array.isArray(s.args)) lines.push('      args: ' + JSON.stringify(s.args))
  }
  return lines
}

/** Serialize the full patch file — a single `- insert:` block of our rows. */
function splicePatch(rows) {
  return [
    '# Harness UI Enhancer — MCP servers.',
    '# Managed by the enhancer MCP drawer; append `dsh-mcp-client` rows here.',
    '- insert:',
    ...rows.flatMap((s) => serializeMcpRow(s)),
  ].join('\n') + '\n'
}

/** Read back only the rows this route serializes (same shape ceiling). */
function parseMcpRows(text) {
  const rows = []
  const blocks = text.split(/\n\s*- insert:/)
  for (const block of blocks) {
    const id = /id:\s*mcp-([A-Za-z0-9_-]+)/.exec(block)
    if (!id) continue
    const serverName = id[1]
    const transport = /transport:\s*['"]?http/.test(block) ? 'http' : 'stdio'
    const row = { serverName, transport }
    const cmd = /command:\s*['"]([^'"]+)['"]/.exec(block)
    if (cmd) row.command = cmd[1]
    const url = /url:\s*['"]([^'"]+)['"]/.exec(block)
    if (url) row.url = url[1]
    rows.push(row)
  }
  return rows
}

async function readFileIfExists(ctx, path) {
  const target = await ctx.fs.resolve(path)
  const info = await ctx.fs.stat(target)
  if (info === undefined) return null
  return await ctx.fs.readText(target)
}

async function writeFile(ctx, path, content) {
  const target = await ctx.fs.resolve(path)
  await ctx.fs.writeText(target, content)
}

/* ------------------------------------------------------------------ */
/* scheduled tasks store                                               */
/* ------------------------------------------------------------------ */

/**
 * Task record:
 * { id, name, workspace, prompt, frequencyMinutes, firstAt, enabled,
 *   lastRunAt?, nextAt, createdAt, history: [{ at, ok, note, sessionId? }] }
 */
function emptyTasks() {
  return { tasks: [], nextId: 1 }
}

async function loadTasks(ctx) {
  const text = await readFileIfExists(ctx, tasksFilePath())
  if (text === null) return emptyTasks()
  try {
    const parsed = JSON.parse(text)
    if (parsed && Array.isArray(parsed.tasks)) return parsed
    return emptyTasks()
  } catch {
    return emptyTasks()
  }
}

async function saveTasks(ctx, store) {
  await writeFile(ctx, tasksFilePath(), JSON.stringify(store, null, 2))
}

/** Recompute nextAt for a periodic task after a run. */
function advanceTask(task, now) {
  // Periodic: next run is frequencyMinutes after the scheduled slot we just
  // fired (anchor to firstAt to keep a stable cadence).
  const freqMs = Math.max(1, Number(task.frequencyMinutes) || 60) * 60 * 1000
  let next = task.firstAt === undefined ? now : task.firstAt
  while (next <= now) next += freqMs
  task.nextAt = next
  return task
}

/** Check every enabled task and run those that are due. */
async function runDueTasks(ctx) {
  const store = await loadTasks(ctx)
  const now = Date.now()
  let changed = false
  for (const task of store.tasks) {
    if (!task.enabled) continue
    if (task.nextAt === undefined || task.nextAt > now) continue
    changed = true
    task.lastRunAt = now
    const entry = await executeTask(ctx, task, now)
    task.history = Array.isArray(task.history) ? task.history : []
    task.history.push(entry)
    // Keep the last 50 history entries per task.
    if (task.history.length > 50) task.history = task.history.slice(-50)
    advanceTask(task, now)
  }
  if (changed) await saveTasks(ctx, store)
  return store
}

/**
 * Execute one task: start a fresh one-shot subagent whose initial user
 * message is the task prompt. The child derives its workspace from the
 * parent agent's durable session (`meta.cwd`), mirroring WorkBuddy's
 * "new session in workspace + preset prompt". If no live root agent exists
 * (e.g. browser-only process), the run is recorded as failed.
 */
async function executeTask(ctx, task, now) {
  const base = { at: now, ok: false }
  try {
    const roots = ctx.agents.roots()
    const parent = roots[0]
    if (parent === undefined) {
      return { ...base, note: 'no live root agent to parent the run' }
    }
    const signal = new AbortController().signal
    const run = await ctx.subagents.start('spawn', {
      label: `[automation] ${task.name}`,
      prompt: [{ type: 'text', text: task.prompt }],
      parent,
      signal,
    })
    const sessionId = String(run.id)
    // Wait for the child to settle, then record its outcome.
    try {
      const result = await run.result
      const okRun = result.stopReason === 'completed'
      const text = result.output
        .filter((b) => b.type === 'text')
        .map((b) => String(b.text ?? ''))
        .join('')
        .trim()
      return {
        at: now,
        ok: okRun,
        sessionId,
        note: okRun
          ? (text.length > 200 ? text.slice(0, 200) + '…' : text || 'completed')
          : `stop: ${String(result.stopReason)}`,
      }
    } finally {
      await run.dispose()
    }
  } catch (e) {
    return { ...base, note: String(e instanceof Error ? e.message : e) }
  }
}

/* ------------------------------------------------------------------ */
/* request handling                                                    */
/* ------------------------------------------------------------------ */

async function handle(ctx, body) {
  switch (body.kind) {
    /* ---- MCP ---- */
    case 'mcp/list': {
      const text = await readFileIfExists(ctx, patchFilePath())
      return ok({ servers: text === null ? [] : parseMcpRows(text) })
    }
    case 'mcp/apply': {
      const op = body.op
      const name = body.serverName
      if (op === 'add' && name && body.server) {
        const text = (await readFileIfExists(ctx, patchFilePath())) ?? '[]'
        const rows = parseMcpRows(text).filter((r) => r.serverName !== name)
        rows.push(body.server)
        await writeFile(ctx, patchFilePath(), splicePatch(rows))
        return ok({ servers: rows })
      }
      if (op === 'remove' && name) {
        const text = (await readFileIfExists(ctx, patchFilePath())) ?? '[]'
        const rows = parseMcpRows(text).filter((r) => r.serverName !== name)
        await writeFile(ctx, patchFilePath(), splicePatch(rows))
        return ok({ servers: rows })
      }
      return fail('mcp/apply needs op=add|remove plus a serverName')
    }
    /* ---- background jobs ---- */
    case 'jobs/list': {
      return ok({ jobs: ctx.jobs.list() })
    }
    case 'jobs/kill': {
      if (body.id === undefined) return fail('jobs/kill needs an id')
      const outcome = ctx.jobs.kill(body.id, undefined, body.reason)
      return ok({ outcome })
    }
    /* ---- scheduled automation ---- */
    case 'tasks/list': {
      const store = await loadTasks(ctx)
      return ok({ tasks: store.tasks })
    }
    case 'tasks/create': {
      const b = body.task ?? {}
      if (!b.name || !b.prompt) return fail('tasks/create needs name + prompt')
      const store = await loadTasks(ctx)
      const id = String(store.nextId++)
      const now = Date.now()
      const frequencyMinutes = Math.max(1, Number(b.frequencyMinutes) || 60)
      const task = {
        id,
        name: String(b.name),
        workspace: String(b.workspace ?? ''),
        prompt: String(b.prompt),
        frequencyMinutes,
        enabled: b.enabled !== false,
        createdAt: now,
        nextAt: now + frequencyMinutes * 60 * 1000,
        history: [],
      }
      store.tasks.push(task)
      await saveTasks(ctx, store)
      return ok({ task })
    }
    case 'tasks/update': {
      const store = await loadTasks(ctx)
      const task = store.tasks.find((t) => t.id === String(body.id))
      if (!task) return fail('tasks/update: unknown id')
      if (body.patch !== undefined && typeof body.patch === 'object') {
        const p = body.patch
        if (p.name !== undefined) task.name = String(p.name)
        if (p.workspace !== undefined) task.workspace = String(p.workspace)
        if (p.prompt !== undefined) task.prompt = String(p.prompt)
        if (p.frequencyMinutes !== undefined) {
          task.frequencyMinutes = Math.max(1, Number(p.frequencyMinutes) || 60)
          task.nextAt = Date.now() + task.frequencyMinutes * 60 * 1000
        }
        if (p.enabled !== undefined) task.enabled = !!p.enabled
      }
      await saveTasks(ctx, store)
      return ok({ task })
    }
    case 'tasks/delete': {
      const store = await loadTasks(ctx)
      store.tasks = store.tasks.filter((t) => t.id !== String(body.id))
      await saveTasks(ctx, store)
      return ok({ ok: true })
    }
    case 'tasks/toggle': {
      const store = await loadTasks(ctx)
      const task = store.tasks.find((t) => t.id === String(body.id))
      if (!task) return fail('tasks/toggle: unknown id')
      task.enabled = body.enabled === undefined ? !task.enabled : !!body.enabled
      await saveTasks(ctx, store)
      return ok({ task })
    }
    case 'tasks/run-now': {
      const store = await loadTasks(ctx)
      const task = store.tasks.find((t) => t.id === String(body.id))
      if (!task) return fail('tasks/run-now: unknown id')
      const now = Date.now()
      const entry = await executeTask(ctx, task, now)
      task.lastRunAt = now
      task.history = Array.isArray(task.history) ? task.history : []
      task.history.push(entry)
      if (task.history.length > 50) task.history = task.history.slice(-50)
      advanceTask(task, now)
      await saveTasks(ctx, store)
      return ok({ run: entry })
    }
    case 'tasks/history': {
      const store = await loadTasks(ctx)
      const task = store.tasks.find((t) => t.id === String(body.id))
      return ok({ history: task && Array.isArray(task.history) ? task.history : [] })
    }
    default:
      return fail('unknown kind')
  }
}

/** Plugin entry: register the route + the due-task timer, both Fiber-scoped. */
export function apply(ctx) {
  const dispose = ctx.webServer.register({
    kind: 'exact',
    path: ROUTE,
    handler: async (req, res) => {
      const body = await readJsonBody(req)
      const reply = await handle(ctx, body)
      const output = JSON.stringify(reply)
      res.statusCode = reply.ok ? 200 : 400
      res.setHeader('content-type', 'application/json')
      res.setHeader('content-length', Buffer.byteLength(output))
      res.end(output)
    },
  })
  ctx.effect(() => dispose, 'ui-enhancer /enhancer-api route')

  // Due-task checker: every 30s, run any enabled task whose nextAt has passed.
  // Fiber-scoped via ctx.effect — stopping/updating the plugin clears the
  // timer (Node global setInterval, not a synthetic ctx timer).
  const timer = setInterval(() => {
    void runDueTasks(ctx)
  }, 30_000)
  ctx.effect(() => () => clearInterval(timer), 'ui-enhancer automation timer')
}