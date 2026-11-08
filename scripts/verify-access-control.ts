/**
 * Phase-2-Beweis (Briefing §8): private Collections sind ohne Login nicht erreichbar,
 * öffentliche Collections sind es. Startet einen eigenen Next.js-Dev-Server auf einem
 * Nebenport, prüft per echten HTTP-Requests und beendet ihn wieder.
 *
 * Eine vollständige Vitest-Suite folgt in Phase 8 — dies ist der einmalige Nachweis vor
 * Checkpoint 2.
 */
import { spawn, type ChildProcessByStdio } from 'child_process'
import type { Readable } from 'stream'

const PORT = 3211
const BASE_URL = `http://127.0.0.1:${PORT}`

function startServer(): ChildProcessByStdio<null, Readable, Readable> {
  return spawn('pnpm', ['exec', 'next', 'dev', '--port', String(PORT)], {
    env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

async function waitForServer(timeoutMs = 90_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/api/properties`)
      if (res.status) return
    } catch {
      // noch nicht bereit
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('Server ist innerhalb des Timeouts nicht bereit geworden.')
}

type Check = {
  path: string
  expectPublic: boolean
  label: string
}

const CHECKS: Check[] = [
  { path: '/api/submissions', expectPublic: false, label: 'submissions (privat)' },
  { path: '/api/searchAlerts', expectPublic: false, label: 'searchAlerts (privat)' },
  { path: '/api/users', expectPublic: false, label: 'users (privat)' },
  { path: '/api/properties', expectPublic: true, label: 'properties (öffentlich, nur published)' },
  { path: '/api/team', expectPublic: true, label: 'team (öffentlich)' },
  { path: '/api/services', expectPublic: true, label: 'services (öffentlich, nur published)' },
]

async function runChecks() {
  const results: { label: string; path: string; status: number; ok: boolean; docCount: number | null }[] =
    []

  for (const check of CHECKS) {
    const res = await fetch(`${BASE_URL}${check.path}`)
    const status = res.status
    let docCount: number | null = null
    if (status === 200) {
      const body = (await res.json()) as { docs?: unknown[] }
      docCount = Array.isArray(body.docs) ? body.docs.length : null
    }

    let ok: boolean
    if (check.expectPublic) {
      // Öffentliche Collections: 200 erwartet (auch mit 0 Treffern, falls (noch) nichts
      // veröffentlicht ist) — entscheidend ist, dass KEIN 401/403 zurückkommt.
      ok = status === 200
    } else {
      // Private Collections: ohne Login strikt 401 oder 403, keine Daten.
      ok = status === 401 || status === 403
    }

    results.push({ label: check.label, path: check.path, status, ok, docCount })
  }

  return results
}

async function main() {
  console.log(`Starte Next.js-Dev-Server auf Port ${PORT} …`)
  const server = startServer()
  let serverOutput = ''
  server.stdout.on('data', (d) => (serverOutput += d.toString()))
  server.stderr.on('data', (d) => (serverOutput += d.toString()))

  let exitCode = 0
  try {
    await waitForServer()
    console.log('Server bereit. Prüfe Zugriffskontrolle …\n')
    const results = await runChecks()

    for (const r of results) {
      const status = r.ok ? 'OK ' : 'FEHLER'
      console.log(
        `[${status}] ${r.label.padEnd(45)} ${r.path.padEnd(22)} HTTP ${r.status}${
          r.docCount !== null ? ` (${r.docCount} Dokument(e))` : ''
        }`,
      )
    }

    const failed = results.filter((r) => !r.ok)
    if (failed.length > 0) {
      console.error(`\n${failed.length} Prüfung(en) fehlgeschlagen.`)
      exitCode = 1
    } else {
      console.log('\nAlle Zugriffskontroll-Prüfungen bestanden.')
    }
  } catch (err) {
    console.error('Fehler beim Ausführen der Prüfung:', err)
    console.error('--- Server-Output ---\n' + serverOutput.slice(-4000))
    exitCode = 1
  } finally {
    server.kill('SIGTERM')
    await new Promise((r) => setTimeout(r, 500))
  }

  process.exit(exitCode)
}

main()
