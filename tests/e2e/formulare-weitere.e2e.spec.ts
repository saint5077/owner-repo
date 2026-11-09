import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

/**
 * Deckt die fünf Formulare ab, die Phase 6's eigener E2E-Test (Kontakt/Allgemein,
 * tests/e2e/kontakt-formular.e2e.spec.ts) noch nicht prüft: Verwaltung anfragen, Schaden
 * melden (mehrstufig), Besichtigung anfragen, Suchabo einrichten. Gleiches Muster: E-Mail
 * läuft ohne RESEND_API_KEY ohnehin auf Konsolen-Fallback, kein Mocking nötig; geprüft wird
 * die eigentliche Wirkung (submissions-/searchAlerts-Dokument), Aufräumen danach.
 */
async function turnstileLösen(page: import('@playwright/test').Page) {
  const widget = page.getByTestId('turnstile-widget')
  await widget.scrollIntoViewIfNeeded()
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 })
}

test.describe('Weitere Formulare', () => {
  test('Verwaltung anfragen (Bewirtschaftung) erzeugt eine Anfrage mit VW-Referenznummer', async ({ page }) => {
    const email = `e2e-verwaltung-${Date.now()}@example.com`
    await page.goto('http://localhost:3000/bewirtschaftung')

    await page.getByLabel('Art der Liegenschaft').selectOption('mehrfamilienhaus')
    await page.getByLabel('Ort').fill('Zürich')
    await page.getByLabel('Heutige Situation').selectOption('selbstVerwaltet')
    await page.getByLabel('Name').fill('E2E Testperson')
    await page.getByLabel('E-Mail', { exact: true }).fill(email)

    await turnstileLösen(page)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()

    const status = page.getByRole('status')
    await expect(status).toContainText('Anfrage gesendet.', { timeout: 20_000 })
    const match = (await status.innerText()).match(/VW-\d{4}-[0-9A-Z]{4}/)
    expect(match).not.toBeNull()

    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'submissions', where: { referenznummer: { equals: match![0] } }, limit: 1 })
    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].type).toBe('verwaltung')
    await payload.delete({ collection: 'submissions', id: result.docs[0].id })
  })

  test('Schaden melden durchläuft alle fünf Schritte und erzeugt eine SM-Referenznummer', async ({ page }) => {
    const email = `e2e-schaden-${Date.now()}@example.com`
    await page.goto('http://localhost:3000/mieterservice/schadenmeldung')

    // Schritt 1 — Notfall
    await page.getByLabel('Ist dies ein Notfall?').selectOption('nein')
    await page.getByRole('button', { name: 'Weiter' }).click()

    // Schritt 2 — Liegenschaft und Wohnung
    await page.getByLabel('Liegenschaft (Adresse)').fill('Langstrasse 14, 8004 Zürich')
    await page.getByLabel('Wohnung').fill('3. OG')
    await page.getByRole('button', { name: 'Weiter' }).click()

    // Schritt 3 — Kategorie und Beschreibung
    await page.getByLabel('Kategorie').selectOption('sanitaer')
    await page.getByLabel('Beschreibung').fill('Der Wasserhahn in der Küche tropft seit zwei Tagen.')
    await page.getByRole('button', { name: 'Weiter' }).click()

    // Schritt 4 — Fotos (übersprungen, optional)
    await page.getByRole('button', { name: 'Weiter' }).click()

    // Schritt 5 — Erreichbarkeit und Kontaktdaten
    await page.getByLabel('Erreichbarkeit (Telefon)').fill('044 495 70 70')
    await page.getByLabel('Zutritt bei Abwesenheit erlaubt?').selectOption('nein')
    await page.getByLabel('Name').fill('E2E Testperson')
    await page.getByLabel('E-Mail', { exact: true }).fill(email)
    await turnstileLösen(page)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()

    const status = page.getByRole('status')
    await expect(status).toContainText('Schaden gemeldet.', { timeout: 20_000 })
    const match = (await status.innerText()).match(/SM-\d{4}-[0-9A-Z]{4}/)
    expect(match).not.toBeNull()

    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'submissions', where: { referenznummer: { equals: match![0] } }, limit: 1 })
    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].type).toBe('schaden')
    await payload.delete({ collection: 'submissions', id: result.docs[0].id })
  })

  test('Besichtigung anfragen auf einer Objektdetailseite erzeugt eine BS-Referenznummer', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte/studio-zuerich-kreis-3')
    await page.getByRole('link', { name: 'Besichtigung anfragen' }).click()

    await page.getByLabel('Name').fill('E2E Testperson')
    const email = `e2e-besichtigung-${Date.now()}@example.com`
    await page.getByLabel('E-Mail', { exact: true }).fill(email)
    await page.getByLabel('Anzahl Personen').selectOption('2')
    await turnstileLösen(page)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()

    const status = page.getByRole('status')
    await expect(status).toContainText('Anfrage gesendet.', { timeout: 20_000 })
    const match = (await status.innerText()).match(/BS-\d{4}-[0-9A-Z]{4}/)
    expect(match).not.toBeNull()

    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'submissions', where: { referenznummer: { equals: match![0] } }, limit: 1 })
    expect(result.docs).toHaveLength(1)
    expect((result.docs[0].data as Record<string, unknown>).propertySlug).toBe('studio-zuerich-kreis-3')
    await payload.delete({ collection: 'submissions', id: result.docs[0].id })
  })

  test('Suchabo einrichten erzeugt ein unbestätigtes searchAlerts-Dokument (Double-Opt-in, kein sofortiges Abo)', async ({ page }) => {
    const email = `e2e-suchabo-${Date.now()}@example.com`
    await page.goto('http://localhost:3000/suchabo')

    await page.getByLabel('Angebotsart').selectOption('miete')
    await page.getByLabel('E-Mail', { exact: true }).fill(email)
    await turnstileLösen(page)
    await page.getByRole('button', { name: 'Anfrage senden' }).click()

    await expect(page.getByRole('status')).toContainText('Fast geschafft.', { timeout: 20_000 })

    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'searchAlerts', where: { email: { equals: email } }, limit: 1 })
    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].bestaetigtAm).toBeFalsy()
    expect(result.docs[0].bestaetigungsToken).toBeTruthy()
    await payload.delete({ collection: 'searchAlerts', id: result.docs[0].id })
  })
})
