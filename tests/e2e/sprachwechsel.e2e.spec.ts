import { expect, test } from '@playwright/test'

/**
 * Phase 7 übersetzt bewusst nur zwei Seiten (DECISIONS.md #50) — die Sprachwahl darf deshalb
 * nie auf eine nicht existierende /en-Route verlinken. Prüft beide Fälle: echter Link, wo eine
 * Übersetzung existiert; ausgegrauter Nicht-Link sonst. `LanguageSwitch` sitzt im Footer, nicht
 * im Header (`src/components/layout/Footer.tsx`) — daher dort gescopt. `exact: true` ist Pflicht:
 * ohne exact matcht `name: 'EN'` per Teilstring auch "Stockwerk**eig en**tum" und "Dat**en**schutz".
 */
test.describe('Sprachwechsel', () => {
  test('auf der Startseite führt EN zur echten englischen Startseite', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('footer').getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('h1').first()).toContainText('look after your property')
  })

  test('die englische Seite zeigt einen sichtbaren "noch nicht geprüft"-Hinweis', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await expect(page.getByText(/translation in progress/i)).toBeVisible()
  })

  test('auf einer nicht übersetzten Seite ist EN kein Link, sondern ausgegraut mit Erklärung', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte')
    const footer = page.locator('footer')
    const enLink = footer.getByRole('link', { name: 'EN', exact: true })
    await expect(enLink).toHaveCount(0)
    const enDimmed = footer.getByText('EN', { exact: true })
    await expect(enDimmed).toBeVisible()
    await expect(enDimmed).toHaveAttribute('title', /noch keine englische/i)
  })

  test('von der englischen Bewirtschaftung-Seite führt DE zurück zur deutschen Seite', async ({ page }) => {
    await page.goto('http://localhost:3000/en/bewirtschaftung')
    await page.locator('footer').getByRole('link', { name: 'DE', exact: true }).click()
    await expect(page).toHaveURL(/\/bewirtschaftung$/)
  })
})
