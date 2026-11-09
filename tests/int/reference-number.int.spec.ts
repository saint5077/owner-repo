import { describe, expect, it } from 'vitest'

import { generateReferenceNumber } from '@/lib/forms/reference-number'

describe('generateReferenceNumber', () => {
  it('folgt dem Format PRÄFIX-JAHR-SUFFIX (z. B. SM-2026-7F3K)', () => {
    const ref = generateReferenceNumber('schaden')
    expect(ref).toMatch(/^SM-\d{4}-[0-9A-Z]{4}$/)
  })

  it('verwendet das korrekte Präfix je Formulartyp', () => {
    expect(generateReferenceNumber('verwaltung')).toMatch(/^VW-/)
    expect(generateReferenceNumber('ersteinschaetzung')).toMatch(/^EK-/)
    expect(generateReferenceNumber('schaden')).toMatch(/^SM-/)
    expect(generateReferenceNumber('besichtigung')).toMatch(/^BS-/)
    expect(generateReferenceNumber('allgemein')).toMatch(/^AN-/)
  })

  it('fällt bei unbekanntem Typ auf AN zurück statt zu crashen', () => {
    expect(generateReferenceNumber('unbekannt')).toMatch(/^AN-/)
  })

  it('enthält das aktuelle Jahr', () => {
    const ref = generateReferenceNumber('allgemein')
    expect(ref).toContain(String(new Date().getFullYear()))
  })

  it('erzeugt in der Praxis eindeutige Werte (keine Kollision in 150 Läufen)', () => {
    // Bei vollem 36^4-Suffixraum liegt die erwartete Kollisionszahl bei 150 Läufen (Geburtstags-
    // näherung) bei ca. 0,007 — ein Fehlschlag hier wäre ein starkes Signal für einen echten
    // Entropie-Bug im Generator (genau das deckte eine frühere, fehlerhafte Implementierung auf).
    const werte = new Set(Array.from({ length: 150 }, () => generateReferenceNumber('allgemein')))
    expect(werte.size).toBe(150)
  })
})
