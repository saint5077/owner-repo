import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

/**
 * Objektdetailseite: Galerie/Lightbox (Tastatur) und die Privatsphäre-Regel aus DESIGN.md/
 * DECISIONS.md #40 (präziser Pin nur bei `adressePublicAnzeigen: true`, sonst nur Kreis-
 * Näherung). `propertyLocation()` selbst ist bereits isoliert in
 * tests/int/property-location.int.spec.ts getestet — hier wird zusätzlich die tatsächliche
 * Next.js-Seite geprüft (echte Rendering-Verdrahtung, nicht nur die reine Funktion). Temporäre
 * Testobjekte werden über die Payload-Local-API angelegt und nach jedem Test wieder gelöscht
 * (gleiches Muster wie Phase 5/6), nie geseedet.
 */
test.describe('Objektdetailseite', () => {
  test('Galerie öffnet die Lightbox, Pfeiltasten wechseln das Bild, Escape schliesst', async ({ page }) => {
    const payload = await getPayload({ config })

    // Bestehende, bereits committete Bilder wiederverwenden statt neuer Binär-Fixtures.
    const bild1 = await payload.create({
      collection: 'media',
      data: { alt: 'E2E Testbild 1' },
      filePath: 'reference/assets/team-karin-gentinetta.jpg',
    })
    const bild2 = await payload.create({
      collection: 'media',
      data: { alt: 'E2E Testbild 2' },
      filePath: 'reference/assets/team-alexander-sauter.jpg',
    })
    const property = await payload.create({
      collection: 'properties',
      data: {
        title: 'E2E Galerie-Testobjekt',
        slug: `e2e-galerie-testobjekt-${Date.now()}`,
        objektstatus: 'reserviert', // nicht 'verfuegbar': vermeidet das search-alerts-Benachrichtigungs-Hook-Rauschen bei schnellem Erstellen+Löschen
        angebotsart: 'miete',
        objektart: 'wohnung',
        kreis: '4',
        zimmer: 2,
        galerie: [bild1.id, bild2.id],
      },
    })

    try {
      await page.goto(`http://localhost:3000/objekte/${property.slug}`)

      await page.getByRole('button').filter({ has: page.locator('img[alt="E2E Testbild 1"]') }).click()
      const dialog = page.getByRole('dialog', { name: 'Bildergalerie' })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByText('1 / 2')).toBeVisible()

      await page.keyboard.press('ArrowRight')
      await expect(dialog.getByText('2 / 2')).toBeVisible()
      await page.keyboard.press('ArrowLeft')
      await expect(dialog.getByText('1 / 2')).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
    } finally {
      await payload.delete({ collection: 'properties', id: property.id })
      await payload.delete({ collection: 'media', id: bild1.id })
      await payload.delete({ collection: 'media', id: bild2.id })
    }
  })

  test('eine öffentlich sichtbare Adresse zeigt die Karte ohne Näherungs-Hinweis', async ({ page }) => {
    const payload = await getPayload({ config })
    const property = await payload.create({
      collection: 'properties',
      data: {
        title: 'E2E Datenschutz-Test öffentlich',
        slug: `e2e-datenschutz-oeffentlich-${Date.now()}`,
        objektstatus: 'reserviert', // nicht 'verfuegbar': vermeidet das search-alerts-Benachrichtigungs-Hook-Rauschen bei schnellem Erstellen+Löschen
        angebotsart: 'miete',
        objektart: 'wohnung',
        kreis: '1',
        zimmer: 2,
        adressePublicAnzeigen: true,
        koordinaten: { lat: 47.3769, lng: 8.5417 },
      },
    })

    try {
      await page.goto(`http://localhost:3000/objekte/${property.slug}`)
      await expect(page.getByText('Zum Schutz der Privatsphäre')).toHaveCount(0)
      await expect(page.locator('canvas.maplibregl-canvas')).toBeVisible()
    } finally {
      await payload.delete({ collection: 'properties', id: property.id })
    }
  })

  test('eine private Adresse zeigt nur die Kreis-Näherung, nie die genaue Lage', async ({ page }) => {
    const payload = await getPayload({ config })
    const property = await payload.create({
      collection: 'properties',
      data: {
        title: 'E2E Datenschutz-Test privat',
        slug: `e2e-datenschutz-privat-${Date.now()}`,
        objektstatus: 'reserviert', // nicht 'verfuegbar': vermeidet das search-alerts-Benachrichtigungs-Hook-Rauschen bei schnellem Erstellen+Löschen
        angebotsart: 'miete',
        objektart: 'wohnung',
        kreis: '1',
        zimmer: 2,
        adressePublicAnzeigen: false,
        // bewusst dieselben "echten" Koordinaten wie im öffentlichen Testfall — die Regel muss
        // trotz vorhandener Koordinaten greifen, nicht nur wenn gar keine gesetzt sind.
        koordinaten: { lat: 47.3769, lng: 8.5417 },
      },
    })

    try {
      await page.goto(`http://localhost:3000/objekte/${property.slug}`)
      await expect(
        page.getByText('Zum Schutz der Privatsphäre zeigen wir nur die ungefähre Lage (Kreis 1), keine genaue Adresse.'),
      ).toBeVisible()
    } finally {
      await payload.delete({ collection: 'properties', id: property.id })
    }
  })
})
