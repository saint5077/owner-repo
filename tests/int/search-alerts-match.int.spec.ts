import { describe, expect, it } from 'vitest'

import { matchesProperty } from '@/lib/search-alerts/match'
import type { Property, SearchAlert } from '@/payload-types'

/**
 * Minimale, aber vollständig typisierte Objekt-Fixture — nur die Felder, die `matchesProperty`
 * tatsächlich liest, der Rest kommt aus einem `as unknown as Property`-Cast, wie in
 * Payload-Testsuites üblich (die generierten Typen verlangen weit mehr Felder, als für diesen
 * reinen Logik-Test relevant sind).
 */
function property(overrides: Partial<Property>): Property {
  return {
    id: 1,
    title: 'Testobjekt',
    angebotsart: 'miete',
    objektart: 'wohnung',
    zimmer: 3,
    bruttomiete: 2000,
    preisAufAnfrage: false,
    wohnflaecheM2: 80,
    kreis: '4',
    verfuegbarAb: { typ: 'sofort' },
    ...overrides,
  } as unknown as Property
}

function kriterien(overrides: Partial<NonNullable<SearchAlert['kriterien']>>): SearchAlert['kriterien'] {
  return { ...overrides }
}

describe('matchesProperty', () => {
  it('ohne jegliche Kriterien passt alles', () => {
    expect(matchesProperty(property({}), kriterien({}))).toBe(true)
  })

  it('angebotsart muss übereinstimmen, wenn gesetzt', () => {
    expect(matchesProperty(property({ angebotsart: 'miete' }), kriterien({ angebotsart: 'kauf' }))).toBe(false)
    expect(matchesProperty(property({ angebotsart: 'miete' }), kriterien({ angebotsart: 'miete' }))).toBe(true)
  })

  it('objektart: leere Liste im Suchabo passt auf alles, nicht-leere muss enthalten', () => {
    expect(matchesProperty(property({ objektart: 'studio' }), kriterien({ objektart: [] }))).toBe(true)
    expect(matchesProperty(property({ objektart: 'studio' }), kriterien({ objektart: ['wohnung'] }))).toBe(false)
    expect(matchesProperty(property({ objektart: 'studio' }), kriterien({ objektart: ['studio', 'wohnung'] }))).toBe(true)
  })

  it('Zimmer-Spanne: Grenzwerte sind inklusive (kein Off-by-one)', () => {
    expect(matchesProperty(property({ zimmer: 3 }), kriterien({ zimmerVon: 3 }))).toBe(true)
    expect(matchesProperty(property({ zimmer: 2.5 }), kriterien({ zimmerVon: 3 }))).toBe(false)
    expect(matchesProperty(property({ zimmer: 3 }), kriterien({ zimmerBis: 3 }))).toBe(true)
    expect(matchesProperty(property({ zimmer: 3.5 }), kriterien({ zimmerBis: 3 }))).toBe(false)
  })

  it('Zimmer-Spanne: fehlende Zimmerzahl auf dem Objekt passt nie, wenn ein Filter gesetzt ist', () => {
    expect(matchesProperty(property({ zimmer: undefined }), kriterien({ zimmerVon: 1 }))).toBe(false)
  })

  it('preisBis: vergleicht Bruttomiete bei Miete, Kaufpreis bei Kauf', () => {
    expect(matchesProperty(property({ angebotsart: 'miete', bruttomiete: 2000 }), kriterien({ preisBis: 1999 }))).toBe(false)
    expect(matchesProperty(property({ angebotsart: 'miete', bruttomiete: 2000 }), kriterien({ preisBis: 2000 }))).toBe(true)
    expect(
      matchesProperty(property({ angebotsart: 'kauf', kaufpreis: 900000, bruttomiete: undefined }), kriterien({ preisBis: 800000 })),
    ).toBe(false)
  })

  it('preisBis: "Preis auf Anfrage" wird nie durch den Preisfilter ausgeschlossen', () => {
    expect(
      matchesProperty(property({ preisAufAnfrage: true, bruttomiete: undefined }), kriterien({ preisBis: 100 })),
    ).toBe(true)
  })

  it('kreis: leere Liste passt auf alles, sonst exakte Übereinstimmung', () => {
    expect(matchesProperty(property({ kreis: '4' }), kriterien({ kreis: [] }))).toBe(true)
    expect(matchesProperty(property({ kreis: '4' }), kriterien({ kreis: ['8'] }))).toBe(false)
    expect(matchesProperty(property({ kreis: '4' }), kriterien({ kreis: ['4', '8'] }))).toBe(true)
  })

  it('verfuegbarAb: "sofort" und "nachVereinbarung" gelten immer als rechtzeitig', () => {
    const inZweiMonaten = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    expect(matchesProperty(property({ verfuegbarAb: { typ: 'sofort' } }), kriterien({ verfuegbarAb: inZweiMonaten }))).toBe(true)
    expect(
      matchesProperty(property({ verfuegbarAb: { typ: 'nachVereinbarung' } }), kriterien({ verfuegbarAb: inZweiMonaten })),
    ).toBe(true)
  })

  it('verfuegbarAb: ein späteres Datum als gesucht passt nicht, ein früheres/gleiches schon', () => {
    const gesuchtAb = new Date('2026-06-01').toISOString()
    expect(
      matchesProperty(
        property({ verfuegbarAb: { typ: 'datum', datum: new Date('2026-07-01').toISOString() } }),
        kriterien({ verfuegbarAb: gesuchtAb }),
      ),
    ).toBe(false)
    expect(
      matchesProperty(
        property({ verfuegbarAb: { typ: 'datum', datum: new Date('2026-05-01').toISOString() } }),
        kriterien({ verfuegbarAb: gesuchtAb }),
      ),
    ).toBe(true)
  })

  it('kombinierte Kriterien: alle müssen gleichzeitig passen', () => {
    const obj = property({ angebotsart: 'miete', objektart: 'wohnung', zimmer: 3, bruttomiete: 2000, kreis: '4' })
    expect(
      matchesProperty(obj, kriterien({ angebotsart: 'miete', zimmerVon: 2, zimmerBis: 4, preisBis: 2500, kreis: ['4'] })),
    ).toBe(true)
    expect(
      matchesProperty(obj, kriterien({ angebotsart: 'miete', zimmerVon: 2, zimmerBis: 4, preisBis: 2500, kreis: ['8'] })),
    ).toBe(false)
  })
})
