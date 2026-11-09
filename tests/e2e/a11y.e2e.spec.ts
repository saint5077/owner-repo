import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Phase 8: axe-core gegen jeden unterschiedlichen Seitentyp (Briefing §3: "100 Accessibility").
 * Eine einzelne Objektdetailseite genügt stellvertretend für alle (Briefing-Vorgabe), nicht jede
 * der drei Beispielobjekte einzeln. Null Verstösse ist die Messlatte — wo ein echter Verstoss
 * gefunden wurde, wurde er behoben (siehe DECISIONS.md "Bekannte Grenzen" für alles, was nicht
 * behebbar war).
 */
async function checkA11y(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).analyze()
  if (results.violations.length > 0) {
    const details = results.violations
      .map((v) => `- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} Element(e))`)
      .join('\n')
    throw new Error(`axe-Verstösse auf "${label}":\n${details}`)
  }
  expect(results.violations).toHaveLength(0)
}

test.describe('Barrierefreiheit (axe-core)', () => {
  test('Startseite', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await checkA11y(page, 'Startseite')
  })

  for (const slug of ['bewirtschaftung', 'stockwerkeigentum', 'erstvermietung', 'verkauf']) {
    test(`Leistungsseite — ${slug}`, async ({ page }) => {
      await page.goto(`http://localhost:3000/${slug}`)
      await checkA11y(page, `/${slug}`)
    })
  }

  test('Objektliste — Listenansicht', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte')
    await checkA11y(page, '/objekte (Liste)')
  })

  test('Objektliste — mit aktiven Filtern', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte?kreis=4&angebotsart=miete')
    await checkA11y(page, '/objekte (gefiltert)')
  })

  test('Objektliste — Leerzustand', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte?kreis=1')
    await checkA11y(page, '/objekte (Leerzustand)')
  })

  test('Objektliste — Kartenansicht', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte?ansicht=karte')
    await page.locator('canvas[data-qa-idle="1"]').waitFor({ timeout: 15_000 })
    await checkA11y(page, '/objekte (Karte)')
  })

  test('Objektdetail (stellvertretend für alle Objekte)', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte/studio-zuerich-kreis-3')
    await checkA11y(page, '/objekte/studio-zuerich-kreis-3')
  })

  test('Über uns', async ({ page }) => {
    await page.goto('http://localhost:3000/ueber-uns')
    await checkA11y(page, '/ueber-uns')
  })

  test('Mieterservice', async ({ page }) => {
    await page.goto('http://localhost:3000/mieterservice')
    await checkA11y(page, '/mieterservice')
  })

  test('Schadenmeldung — jeder der fünf Schritte', async ({ page }) => {
    await page.goto('http://localhost:3000/mieterservice/schadenmeldung')
    await checkA11y(page, 'Schadenmeldung Schritt 1')

    await page.getByLabel('Ist dies ein Notfall?').selectOption('nein')
    await page.getByRole('button', { name: 'Weiter' }).click()
    await checkA11y(page, 'Schadenmeldung Schritt 2')

    await page.getByLabel('Liegenschaft (Adresse)').fill('Langstrasse 14')
    await page.getByRole('button', { name: 'Weiter' }).click()
    await checkA11y(page, 'Schadenmeldung Schritt 3')

    await page.getByLabel('Kategorie').selectOption('sanitaer')
    await page.getByLabel('Beschreibung').fill('Testbeschreibung für den Barrierefreiheits-Check.')
    await page.getByRole('button', { name: 'Weiter' }).click()
    await checkA11y(page, 'Schadenmeldung Schritt 4 (Fotos)')

    await page.getByRole('button', { name: 'Weiter' }).click()
    await checkA11y(page, 'Schadenmeldung Schritt 5')
  })

  test('Kontakt — Standardzustand', async ({ page }) => {
    await page.goto('http://localhost:3000/kontakt')
    await checkA11y(page, '/kontakt')
  })

  test('Kontakt — Fehlerzustand (leeres Formular abgesendet)', async ({ page }) => {
    await page.goto('http://localhost:3000/kontakt')
    await page.getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByRole('alert').first()).toBeVisible()
    await checkA11y(page, '/kontakt (Fehlerzustand)')
  })

  test('Impressum', async ({ page }) => {
    await page.goto('http://localhost:3000/impressum')
    await checkA11y(page, '/impressum')
  })

  test('Datenschutz', async ({ page }) => {
    await page.goto('http://localhost:3000/datenschutz')
    await checkA11y(page, '/datenschutz')
  })

  test('404', async ({ page }) => {
    await page.goto('http://localhost:3000/diese-seite-gibt-es-nicht')
    await checkA11y(page, '404')
  })

  test('/en — Startseite', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await checkA11y(page, '/en')
  })

  test('/en/bewirtschaftung', async ({ page }) => {
    await page.goto('http://localhost:3000/en/bewirtschaftung')
    await checkA11y(page, '/en/bewirtschaftung')
  })

  /**
   * Payloads Admin-Login-Bildschirm ist unverändertes Vendor-Markup (kein von uns gebautes
   * Template) — `landmark-one-main`/`page-has-heading-one`/`region` dort zu patchen hiesse,
   * in Payload-Core-Templates einzugreifen, für die das Projekt keinen Override-Mechanismus
   * vorsieht. Bewusst nicht gegen null Verstösse geprüft (anders als jede selbst gebaute
   * Seite), sondern nur geloggt — als "bekannte Grenze" in DECISIONS.md festgehalten, nicht
   * stillschweigend ignoriert. Das öffentliche Briefing-Ziel "100 Accessibility" bezieht sich
   * auf die Publikumsseite, nicht auf das interne, Login-geschützte Redaktionswerkzeug.
   */
  test('Admin — Login-Bildschirm (vendor UI, nur geloggt statt hart geprüft)', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 15_000 })
    const results = await new AxeBuilder({ page }).analyze()
    if (results.violations.length > 0) {
      console.warn(
        `[bekannt, nicht behoben — Payload-Vendor-UI] /admin (Login): ${results.violations.map((v) => v.id).join(', ')}`,
      )
    }
  })
})
