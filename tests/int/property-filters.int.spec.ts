import { describe, expect, it } from 'vitest'

import { buildPropertyWhere, parsePropertyFilters, sortParam, withParam } from '@/lib/property-filters'

describe('parsePropertyFilters', () => {
  it('liefert sinnvolle Defaults bei leerer Query', () => {
    const parsed = parsePropertyFilters({})
    expect(parsed).toMatchObject({ sort: 'neueste', ansicht: 'liste' })
    expect(parsed.angebotsart).toBeUndefined()
    expect(parsed.kreis).toBeUndefined()
  })

  it('übernimmt eine gültige angebotsart, verwirft eine ungültige statt zu crashen', () => {
    expect(parsePropertyFilters({ angebotsart: 'miete' }).angebotsart).toBe('miete')
    expect(parsePropertyFilters({ angebotsart: 'garbage' }).angebotsart).toBeUndefined()
  })

  it('liest Mehrfachauswahl (objektart, kreis) als Array, auch bei nur einem Wert', () => {
    expect(parsePropertyFilters({ objektart: 'wohnung' }).objektart).toEqual(['wohnung'])
    expect(parsePropertyFilters({ kreis: ['3', '4'] }).kreis).toEqual(['3', '4'])
  })

  it('parst numerische Filter robust, ignoriert nicht-numerische Werte statt NaN durchzureichen', () => {
    expect(parsePropertyFilters({ zimmerVon: '2.5' }).zimmerVon).toBe(2.5)
    expect(parsePropertyFilters({ zimmerVon: 'nicht-numerisch' }).zimmerVon).toBeUndefined()
  })

  it('fällt bei unbekannter Sortierung auf "neueste" zurück', () => {
    expect(parsePropertyFilters({ sort: 'unbekannt' }).sort).toBe('neueste')
    expect(parsePropertyFilters({ sort: 'preis-auf' }).sort).toBe('preis-auf')
  })
})

describe('buildPropertyWhere', () => {
  it('zeigt immer nur verfügbare/reservierte Objekte, nie Entwürfe', () => {
    const where = buildPropertyWhere(parsePropertyFilters({}))
    expect(where.and).toContainEqual({ objektstatus: { in: ['verfuegbar', 'reserviert'] } })
  })

  it('kombiniert mehrere aktive Filter mit UND', () => {
    const where = buildPropertyWhere(parsePropertyFilters({ angebotsart: 'miete', kreis: ['4'] }))
    expect(where.and).toContainEqual({ angebotsart: { equals: 'miete' } })
    expect(where.and).toContainEqual({ kreis: { in: ['4'] } })
  })

  it('preisBis prüft Bruttomiete ODER Kaufpreis, damit Alle-Angebotsart-Ansichten funktionieren', () => {
    const where = buildPropertyWhere(parsePropertyFilters({ preisBis: '3000' }))
    expect(where.and).toContainEqual({
      or: [{ bruttomiete: { less_than_equal: 3000 } }, { kaufpreis: { less_than_equal: 3000 } }],
    })
  })

  it('fügt ohne aktive Filter keine zusätzlichen Bedingungen hinzu ausser dem Status-Filter', () => {
    const where = buildPropertyWhere(parsePropertyFilters({}))
    expect(where.and).toHaveLength(1)
  })
})

describe('sortParam', () => {
  it('bildet jede Sortieroption auf das erwartete Payload-sort-Präfix ab', () => {
    expect(sortParam('neueste')).toBe('-createdAt')
    expect(sortParam('preis-auf')).toBe('bruttomiete')
    expect(sortParam('preis-ab')).toBe('-bruttomiete')
    expect(sortParam('zimmer')).toBe('-zimmer')
  })
})

describe('withParam', () => {
  it('fügt einen neuen Parameter hinzu und behält bestehende', () => {
    const current = new URLSearchParams('kreis=4')
    expect(withParam(current, { sort: 'preis-auf' })).toBe('kreis=4&sort=preis-auf')
  })

  it('entfernt einen Parameter, wenn der Wert null ist (z. B. Filter zurücksetzen)', () => {
    const current = new URLSearchParams('kreis=4&sort=preis-auf')
    expect(withParam(current, { kreis: null })).toBe('sort=preis-auf')
  })

  it('ersetzt Mehrfachwerte korrekt statt sie zu duplizieren', () => {
    const current = new URLSearchParams('kreis=3&kreis=4')
    expect(withParam(current, { kreis: ['8'] })).toBe('kreis=8')
  })
})
