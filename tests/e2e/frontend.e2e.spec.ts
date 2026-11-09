import { expect, test } from '@playwright/test'

/**
 * Ersetzt den ursprünglichen Scaffold-Test ("Payload Blank Template" / "Welcome to your new
 * project.") — der war seit Phase 2 nie aktualisiert worden und hätte gegen die echte Seite
 * sofort fehlgeschlagen (Phase-8-Fund). Deckt jetzt Navigation, Sprach-Chrome und die Phase-4-
 * Redirect/404-Routen ab. Alle Header-Links werden bewusst über `page.locator('header')`
 * gesucht — Header UND Footer verlinken dieselben Labels ("Bewirtschaftung", "Kontakt" usw.),
 * ein ungescopter `getByRole` wäre also mehrdeutig (Strict-Mode-Fehler).
 */
test.describe('Navigation', () => {
  test('Startseite lädt mit dem echten Titel und der Hero-Überschrift', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Nora Immobilien/)
    await expect(page.locator('h1').first()).toContainText('Wir betreuen Ihre Immobilie')
  })

  test('Desktop-Hauptnavigation führt zu den Kernseiten', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:3000')
    const header = page.locator('header')

    await header.getByRole('link', { name: 'Objekte' }).click()
    await expect(page).toHaveURL(/\/objekte$/)
    await expect(page.locator('h1')).toHaveText('Objekte')

    await page.goto('http://localhost:3000')
    await header.getByRole('link', { name: 'Mieterservice' }).click()
    await expect(page).toHaveURL(/\/mieterservice$/)

    await page.goto('http://localhost:3000')
    await header.getByRole('link', { name: 'Über uns' }).click()
    await expect(page).toHaveURL(/\/ueber-uns$/)

    await page.goto('http://localhost:3000')
    await header.getByRole('link', { name: 'Kontakt', exact: true }).click()
    await expect(page).toHaveURL(/\/kontakt$/)
  })

  test('Leistungen-Dropdown führt zu allen vier Leistungsseiten', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const [label, path] of [
      ['Bewirtschaftung', '/bewirtschaftung'],
      ['Stockwerkeigentum', '/stockwerkeigentum'],
      ['Erstvermietung', '/erstvermietung'],
      ['Verkauf', '/verkauf'],
    ] as const) {
      await page.goto('http://localhost:3000')
      const header = page.locator('header')
      await header.getByRole('button', { name: 'Leistungen' }).hover()
      await header.getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${path}$`))
    }
  })

  test('mobiles Hamburger-Menü öffnet die Navigation und schliesst mit Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000')
    const header = page.locator('header')

    await expect(header.getByRole('navigation', { name: 'Hauptnavigation' })).toBeHidden()
    const menuButton = header.getByRole('button', { name: /menü/i })
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await header.getByRole('link', { name: 'Kontakt', exact: true }).click()
    await expect(page).toHaveURL(/\/kontakt$/)
  })

  test('die mobile Aktionsleiste ist auf Mobil sichtbar und führt zu den Objekten', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000')
    // "Objekte" kommt auch in der (immer sichtbaren) Footer-Navigation vor — die Aktionsleiste
    // ist zuletzt im DOM (Header, main, Footer, MobileActionBar in layout.tsx), daher `.last()`.
    await page.getByRole('link', { name: 'Objekte', exact: true }).last().click()
    await expect(page).toHaveURL(/\/objekte$/)
  })

  test('/rechtliche-hinweise leitet dauerhaft auf /impressum um (alte Wix-URL, DECISIONS.md #55)', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/rechtliche-hinweise')
    await expect(page).toHaveURL(/\/impressum$/)
    expect(response?.status()).toBeLessThan(400)
  })

  test('eine unbekannte URL liefert HTTP 404 mit der eigenen Fehlerseite statt eines Next-Standardfehlers', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/diese-seite-gibt-es-nicht')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toContainText('Diese Seite gibt es nicht')
    await expect(page.getByRole('link', { name: 'Zur Startseite' })).toBeVisible()
  })
})
