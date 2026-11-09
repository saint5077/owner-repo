import { expect, test } from '@playwright/test'

/**
 * Faltet den einmaligen Phase-2-Beweis (scripts/verify-access-control.ts, lief nur manuell vor
 * Checkpoint 2) in die laufende E2E-Suite — damit ist der Schutz privater Collections Teil von
 * `pnpm test`, nicht nur ein Skript, das jemand zufällig nochmal ausführen müsste. Dasselbe
 * Prinzip wie das Skript: private Collections liefern ohne Login strikt 401/403 und keine
 * Daten, öffentliche liefern 200 (auch bei 0 Treffern).
 */
test.describe('Zugriffskontrolle — öffentliche REST-API', () => {
  const privateCollections = [
    { path: '/api/submissions', label: 'submissions' },
    { path: '/api/searchAlerts', label: 'searchAlerts' },
    { path: '/api/users', label: 'users' },
  ]
  const publicCollections = [
    { path: '/api/properties', label: 'properties' },
    { path: '/api/team', label: 'team' },
    { path: '/api/services', label: 'services' },
  ]

  for (const { path, label } of privateCollections) {
    test(`${label} ist ohne Login nicht erreichbar (401/403, keine Daten)`, async ({ request }) => {
      const res = await request.get(`http://localhost:3000${path}`)
      expect([401, 403]).toContain(res.status())
      const body = await res.json().catch(() => null)
      expect(body?.docs).toBeUndefined()
    })
  }

  for (const { path, label } of publicCollections) {
    test(`${label} ist ohne Login lesbar (200)`, async ({ request }) => {
      const res = await request.get(`http://localhost:3000${path}`)
      expect(res.status()).toBe(200)
      const body = await res.json()
      expect(Array.isArray(body.docs)).toBe(true)
    })
  }

  test('ein direkter POST an /api/submissions wird abgelehnt (create: nobodyCreate, Server Actions umgehen bewusst die REST-API)', async ({
    request,
  }) => {
    const res = await request.post('http://localhost:3000/api/submissions', {
      data: { type: 'allgemein', referenznummer: 'HACK-0000-0000', data: {} },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('/api/graphql ist deaktiviert (DECISIONS.md #17)', async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/graphql')
    expect(res.status()).toBe(404)
  })
})
