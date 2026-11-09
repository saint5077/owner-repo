import { expect, test } from '@playwright/test'

/**
 * Objektfilter Ende-zu-Ende: URL-State, Trefferzahl-Live-Region, Reload und Zurück-Taste
 * (Briefing §6: "Filter im URL-Query, teilbar, Zurück-Taste funktioniert"). Nutzt die drei
 * echten Beispielobjekte (Kreis 3/4/8) — ein Kreis-4-Filter ist damit deterministisch genau 1
 * Treffer, kein künstliches Fixture nötig.
 */
test.describe('Objektfilter', () => {
  test('Filtern nach Kreis aktualisiert URL, Trefferzahl und Liste', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte')

    const trefferzahl = page.locator('[aria-live="polite"]')
    await expect(trefferzahl).toContainText('3 Objekte gefunden.')

    // `.click()` statt `.check()`: die Checkbox wird nach dem Klick durch die Soft-Navigation
    // (neue Server-Props für ObjekteFilterBar) als neues DOM-Element ersetzt — Playwrights
    // `.check()` wartet sonst auf den (bereits ersetzten) alten Knoten und schlägt fehl.
    await page.getByRole('group', { name: 'Kreis' }).getByLabel('4', { exact: true }).click()
    await expect(page).toHaveURL(/kreis=4/)
    await expect(trefferzahl).toContainText('1 Objekt gefunden.')
    await expect(page.getByText('3.5-Zimmer-Wohnung', { exact: false })).toBeVisible()
  })

  test('ein Reload behält den aktiven Filter über die URL bei', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte?kreis=4')
    const trefferzahl = page.locator('[aria-live="polite"]')
    await expect(trefferzahl).toContainText('1 Objekt gefunden.')
    await expect(page.getByRole('group', { name: 'Kreis' }).getByLabel('4', { exact: true })).toBeChecked()
  })

  test('die Zurück-Taste des Browsers kehrt zum vorherigen Filterzustand zurück', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte')
    await page.getByRole('group', { name: 'Kreis' }).getByLabel('4', { exact: true }).click()
    await expect(page).toHaveURL(/kreis=4/)

    await page.goBack()
    await expect(page).toHaveURL(/\/objekte$/)
    await expect(page.locator('[aria-live="polite"]')).toContainText('3 Objekte gefunden.')
  })

  test('ein Filter ohne Treffer zeigt den Leerzustand mit Suchabo-Hinweis, nicht nur eine leere Liste', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte?kreis=1')
    await expect(page.locator('[aria-live="polite"]')).toContainText('Keine Objekte gefunden.')
    await expect(page.getByRole('heading', { name: 'Keine Objekte entsprechen Ihren Kriterien.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Suchabo einrichten' })).toBeVisible()
  })

  test('Kartenansicht lädt die swisstopo-Karte statt der Listenkarten', async ({ page }) => {
    await page.goto('http://localhost:3000/objekte')
    await page.getByRole('group', { name: 'Ansicht' }).getByRole('button', { name: 'Karte' }).click()
    await expect(page).toHaveURL(/ansicht=karte/)
    const canvas = page.locator('canvas.maplibregl-canvas')
    await expect(canvas).toBeVisible()
    await expect(page.locator('canvas[data-qa-idle="1"]')).toBeVisible({ timeout: 15_000 })
  })
})
