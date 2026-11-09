import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

/**
 * Phase-6-Checkpoint-Vorgabe (UMSETZUNGSPLAN.md): mindestens ein kompletter Formular-Ablauf
 * Ende-zu-Ende, E-Mail-Versand gemockt. Da in der Entwicklung kein `RESEND_API_KEY` gesetzt ist,
 * fällt `sendEmail` ohnehin auf einen Konsolen-Log zurück (`src/lib/email/send.ts`) — es ist also
 * nie ein echter Versand nötig, kein zusätzliches Mocking-Setup. Geprüft wird stattdessen die
 * eigentliche Nutzwirkung: ein `submissions`-Dokument mit gültiger Referenznummer entsteht.
 */
test.describe('Kontaktformular (Allgemeine Anfrage)', () => {
  test('Absenden erzeugt ein submissions-Dokument mit gültiger Referenznummer', async ({ page }) => {
    const eindeutigeEmail = `e2e-${Date.now()}@example.com`

    await page.goto('http://localhost:3000/kontakt')

    await page.getByLabel('Anliegen').selectOption('allgemein')
    await page.getByLabel('Name').fill('E2E Testperson')
    await page.getByLabel('E-Mail', { exact: true }).fill(eindeutigeEmail)
    await page.getByLabel('Nachricht').fill('Dies ist eine automatisierte End-to-End-Testnachricht.')

    // Turnstile lädt erst beim Sichtbarwerden (IntersectionObserver) — ins Blickfeld scrollen und
    // auf das vom "Always passes"-Testschlüssel gesetzte Token warten, statt eine feste Pause
    // einzubauen. Cloudflares Testschlüssel löst ohne sichtbares iframe auf (nur ein verstecktes
    // Antwortfeld) — das tatsächliche Signal ist dessen Wert, nicht iframe-Sichtbarkeit (per
    // isoliertem Debug-Lauf verifiziert, nicht angenommen).
    const turnstileWidget = page.getByTestId('turnstile-widget')
    await turnstileWidget.scrollIntoViewIfNeeded()
    const turnstileResponse = page.locator('input[name="cf-turnstile-response"]')
    await expect(turnstileResponse).toHaveValue(/.+/, { timeout: 15_000 })

    const submitButton = page.getByRole('button', { name: 'Anfrage senden' })
    await submitButton.click()

    await expect(page.getByRole('status')).toContainText('Ihre Referenznummer', { timeout: 20_000 })
    const statusText = await page.getByRole('status').innerText()
    const match = statusText.match(/AN-\d{4}-[0-9A-Z]{4}/)
    expect(match, `Referenznummer im Erfolgstext nicht gefunden: "${statusText}"`).not.toBeNull()
    const referenznummer = match![0]

    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'submissions',
      where: { referenznummer: { equals: referenznummer } },
      limit: 1,
    })
    expect(result.docs).toHaveLength(1)
    expect(result.docs[0].type).toBe('allgemein')
    expect((result.docs[0].data as Record<string, unknown>).email).toBe(eindeutigeEmail)
    expect(result.docs[0].status).toBe('neu')

    // Aufräumen, damit der Test wiederholt ausführbar bleibt, ohne Testdaten anzuhäufen.
    await payload.delete({ collection: 'submissions', id: result.docs[0].id })
  })
})
