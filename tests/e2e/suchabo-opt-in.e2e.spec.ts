import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

/**
 * Double-Opt-in-Bestätigung und Abmeldung laufen bewusst über einen expliziten Klick, nicht
 * automatisch beim Laden der Seite (DECISIONS.md #48 — E-Mail-Link-Prefetching durch Scanner
 * würde sonst ungewollt bestätigen/abmelden). Prüft genau das: ein blosses `goto()` der Seite
 * darf NICHTS auslösen, erst der Klick auf den Button.
 */
test.describe('Suchabo — Bestätigung und Abmeldung', () => {
  test('Bestätigung: Laden allein bestätigt nichts, erst der Klick auf "Suchabo bestätigen"', async ({ page }) => {
    const payload = await getPayload({ config })
    const token = `e2e-confirm-${Date.now()}`
    const alert = await payload.create({
      collection: 'searchAlerts',
      data: { email: `e2e-confirm-${Date.now()}@example.com`, bestaetigungsToken: token, abmeldeToken: `${token}-unsub` },
    })

    try {
      await page.goto(`http://localhost:3000/suchabo/bestaetigen?token=${token}`)
      await page.waitForLoadState('networkidle')

      let fresh = await payload.findByID({ collection: 'searchAlerts', id: alert.id })
      expect(fresh.bestaetigtAm).toBeFalsy()

      await page.getByRole('button', { name: 'Suchabo bestätigen' }).click()
      await expect(page.getByRole('heading', { name: 'Suchabo bestätigt.' })).toBeVisible()

      fresh = await payload.findByID({ collection: 'searchAlerts', id: alert.id })
      expect(fresh.bestaetigtAm).toBeTruthy()
    } finally {
      await payload.delete({ collection: 'searchAlerts', id: alert.id }).catch(() => {})
    }
  })

  test('ein ungültiger Bestätigungslink zeigt einen ehrlichen Fehlerzustand', async ({ page }) => {
    await page.goto('http://localhost:3000/suchabo/bestaetigen?token=dieser-token-existiert-nicht')
    await page.getByRole('button', { name: 'Suchabo bestätigen' }).click()
    await expect(page.getByRole('heading', { name: 'Dieser Link ist nicht mehr gültig.' })).toBeVisible()
  })

  test('Abmeldung: Laden allein meldet nichts ab, erst der Klick löscht das Suchabo', async ({ page }) => {
    const payload = await getPayload({ config })
    const token = `e2e-unsub-${Date.now()}`
    const alert = await payload.create({
      collection: 'searchAlerts',
      data: {
        email: `e2e-unsub-${Date.now()}@example.com`,
        bestaetigungsToken: `${token}-confirm`,
        abmeldeToken: token,
        bestaetigtAm: new Date().toISOString(),
      },
    })

    await page.goto(`http://localhost:3000/suchabo/abmelden?token=${token}`)
    await page.waitForLoadState('networkidle')
    await expect(payload.findByID({ collection: 'searchAlerts', id: alert.id })).resolves.toBeTruthy()

    await page.getByRole('button', { name: 'Suchabo abmelden' }).click()
    await expect(page.getByRole('heading', { name: 'Suchabo abgemeldet.' })).toBeVisible()

    await expect(payload.findByID({ collection: 'searchAlerts', id: alert.id })).rejects.toThrow()
  })

  test('ein fehlender Token zeigt einen Hinweis statt eines kaputten Formulars', async ({ page }) => {
    await page.goto('http://localhost:3000/suchabo/bestaetigen')
    await expect(page.getByRole('heading', { name: 'Dieser Link ist unvollständig.' })).toBeVisible()
  })
})
