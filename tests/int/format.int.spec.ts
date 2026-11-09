import { describe, expect, it } from 'vitest'

import { formatCHF, formatFlaeche, formatOrt, formatZimmer } from '@/lib/format'

describe('formatCHF', () => {
  // Intl.NumberFormat('de-CH', {style:'currency', ...}) selbst erzeugt ein geschütztes
  // Leerzeichen (U+00A0) nach "CHF" und den geraden Apostroph ' als Tausendertrennzeichen
  // (nicht ’ U+2019) — gegen die tatsächliche Node-ICU-Ausgabe verifiziert, nicht angenommen.
  it('formatiert in Schweizer Typografie mit Tausendertrennzeichen und Endstrich (DESIGN.md §5)', () => {
    expect(formatCHF(2450)).toBe('CHF 2\'450.–')
  })

  it('rundet auf ganze Franken (keine Rappen im Listen-/Detailkontext)', () => {
    expect(formatCHF(2441.5)).toBe('CHF 2\'442.–')
  })

  it('funktioniert für siebenstellige Kaufpreise', () => {
    expect(formatCHF(2450000)).toBe('CHF 2\'450\'000.–')
  })

  it('gibt null statt eines falschen Werts zurück, wenn kein Preis vorliegt ("Preis auf Anfrage")', () => {
    expect(formatCHF(null)).toBeNull()
    expect(formatCHF(undefined)).toBeNull()
  })
})

describe('formatZimmer', () => {
  it('zeigt einen echten Bruch bei .5-Werten (DESIGN.md §5: "3½ Zimmer")', () => {
    expect(formatZimmer(3.5)).toBe('3½ Zimmer')
  })

  it('zeigt ganze Zahlen ohne Bruch', () => {
    expect(formatZimmer(1)).toBe('1 Zimmer')
  })

  it('behandelt den Sonderfall unter einem ganzen Zimmer (0.5)', () => {
    expect(formatZimmer(0.5)).toBe('½ Zimmer')
  })

  it('gibt null zurück, wenn keine Zimmerzahl vorliegt', () => {
    expect(formatZimmer(null)).toBeNull()
  })
})

describe('formatFlaeche', () => {
  it('formatiert m² mit Tausendertrennzeichen', () => {
    expect(formatFlaeche(142)).toBe('142 m²')
  })

  it('gibt null zurück, wenn keine Fläche vorliegt', () => {
    expect(formatFlaeche(undefined)).toBeNull()
  })
})

describe('formatOrt', () => {
  it('kombiniert Ort und Kreis, wenn beides vorhanden ist', () => {
    expect(formatOrt('4', 'Zürich')).toBe('Zürich, Kreis 4')
  })

  it('fällt auf den Kreis allein zurück, wenn kein Ort gepflegt ist', () => {
    expect(formatOrt('8', null)).toBe('Kreis 8')
  })

  it('fällt auf den Ort allein zurück, wenn kein Kreis gepflegt ist', () => {
    expect(formatOrt(null, 'Winterthur')).toBe('Winterthur')
  })

  it('fällt auf "Zürich" zurück, wenn weder Ort noch Kreis vorliegen, statt eine leere Zeile zu zeigen', () => {
    expect(formatOrt(null, null)).toBe('Zürich')
  })
})
