import { describe, expect, it } from 'vitest'

import type { Property } from '@/payload-types'
import { propertyLocation } from '@/lib/property-location'

/**
 * Privatsphäre-Regel isoliert getestet (Briefing §6, DECISIONS.md #40): ein präziser Pin
 * erscheint nur bei `adressePublicAnzeigen: true` UND vorhandenen Koordinaten — sonst immer
 * nur die Kreis-Näherung, selbst wenn zufällig echte Koordinaten im Datensatz stehen.
 */
function property(overrides: Partial<Property>): Property {
  return {
    id: 1,
    title: 'Testobjekt',
    kreis: '4',
    adressePublicAnzeigen: false,
    koordinaten: undefined,
    ...overrides,
  } as Property
}

describe('propertyLocation — Privatsphäre-Regel', () => {
  it('zeigt einen präzisen Pin, wenn die Adresse öffentlich UND Koordinaten vorhanden sind', () => {
    const marker = propertyLocation(
      property({ adressePublicAnzeigen: true, koordinaten: { lat: 47.3769, lng: 8.5417 } }),
    )
    expect(marker).toMatchObject({ lat: 47.3769, lng: 8.5417, approximate: false })
  })

  it('zeigt NUR die Kreis-Näherung, wenn die Adresse privat ist — auch wenn echte Koordinaten im Datensatz stehen', () => {
    const marker = propertyLocation(
      property({ adressePublicAnzeigen: false, koordinaten: { lat: 47.3769, lng: 8.5417 } }),
    )
    expect(marker?.approximate).toBe(true)
    // Die präzisen Koordinaten dürfen nicht durchsickern — der Marker zeigt das Kreiszentrum,
    // nicht die tatsächliche (private) Adresse.
    expect(marker).not.toMatchObject({ lat: 47.3769, lng: 8.5417 })
  })

  it('zeigt die Kreis-Näherung, wenn die Adresse öffentlich ist, aber noch keine Koordinaten geokodiert wurden', () => {
    const marker = propertyLocation(property({ adressePublicAnzeigen: true, koordinaten: undefined }))
    expect(marker?.approximate).toBe(true)
  })

  it('gibt null zurück, wenn weder Koordinaten noch ein bekannter Kreis vorliegen (kein Marker statt eines falschen)', () => {
    const marker = propertyLocation(property({ kreis: null, adressePublicAnzeigen: false, koordinaten: undefined }))
    expect(marker).toBeNull()
  })
})
