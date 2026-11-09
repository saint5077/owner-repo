import { describe, expect, it } from 'vitest'

import { getOpeningStatus } from '@/lib/opening-hours'

// 2026-03-10 ist ein Dienstag (Europe/Zurich, ausserhalb der MESZ-Umstellung) —
// gegen eine tatsächliche Intl.DateTimeFormat-Ausgabe verifiziert, nicht angenommen.
const DIENSTAG_VORMITTAG = new Date('2026-03-10T09:30:00+01:00')
const DIENSTAG_ABEND = new Date('2026-03-10T19:30:00+01:00')
const DIENSTAG_MITTAG_PAUSE = new Date('2026-03-10T12:30:00+01:00')

type Tag = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so'
const REGULAER: { tag: Tag; von: string | null; bis: string | null; geschlossen: boolean }[] = [
  { tag: 'mo', von: '08:00', bis: '12:00', geschlossen: false },
  { tag: 'di', von: '08:00', bis: '17:00', geschlossen: false },
  { tag: 'mi', von: '08:00', bis: '17:00', geschlossen: false },
  { tag: 'do', von: '08:00', bis: '17:00', geschlossen: false },
  { tag: 'fr', von: '08:00', bis: '16:00', geschlossen: false },
  { tag: 'sa', von: null, bis: null, geschlossen: true },
  { tag: 'so', von: null, bis: null, geschlossen: true },
]

describe('getOpeningStatus', () => {
  it('gibt null zurück, wenn keine Öffnungszeiten gepflegt sind (aktueller Stand laut CONTENT_TODO.md)', () => {
    expect(getOpeningStatus(undefined, DIENSTAG_VORMITTAG)).toBeNull()
    expect(getOpeningStatus({ regulaer: [] }, DIENSTAG_VORMITTAG)).toBeNull()
  })

  it('erkennt "offen" innerhalb der regulären Öffnungszeiten', () => {
    expect(getOpeningStatus({ regulaer: REGULAER }, DIENSTAG_VORMITTAG)).toBe('offen')
  })

  it('erkennt "geschlossen" ausserhalb der regulären Öffnungszeiten', () => {
    expect(getOpeningStatus({ regulaer: REGULAER }, DIENSTAG_ABEND)).toBe('geschlossen')
  })

  it('behandelt die obere Grenze als exklusiv (bis-Zeit zählt bereits als geschlossen)', () => {
    const grenze = new Date('2026-03-10T17:00:00+01:00')
    expect(getOpeningStatus({ regulaer: REGULAER }, grenze)).toBe('geschlossen')
  })

  it('zeigt "geschlossen" an einem als geschlossen markierten Tag (Samstag)', () => {
    const samstag = new Date('2026-03-14T10:00:00+01:00')
    expect(getOpeningStatus({ regulaer: REGULAER }, samstag)).toBe('geschlossen')
  })

  it('eine Ausnahme (Feiertag) für den heutigen Tag überstimmt die regulären Zeiten', () => {
    const ausnahmen = [{ datum: '2026-03-10', geschlossen: true, grund: 'Test-Feiertag' }]
    expect(getOpeningStatus({ regulaer: REGULAER, ausnahmen }, DIENSTAG_VORMITTAG)).toBe('geschlossen')
  })

  it('eine Ausnahme für einen anderen Tag hat keine Wirkung auf heute', () => {
    const ausnahmen = [{ datum: '2026-12-25', geschlossen: true, grund: 'Weihnachten' }]
    expect(getOpeningStatus({ regulaer: REGULAER, ausnahmen }, DIENSTAG_VORMITTAG)).toBe('offen')
  })

  it('eine normale Mittagsstunde innerhalb durchgehender Öffnungszeiten bleibt "offen" (kein Mittagsschluss modelliert)', () => {
    expect(getOpeningStatus({ regulaer: REGULAER }, DIENSTAG_MITTAG_PAUSE)).toBe('offen')
  })
})
