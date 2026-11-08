import type { SiteSetting } from '@/payload-types'

export type OpeningStatus = 'offen' | 'geschlossen'

type Oeffnungszeiten = NonNullable<SiteSetting['oeffnungszeiten']>

const TAG_INDEX: Record<string, number> = { so: 0, mo: 1, di: 2, mi: 3, do: 4, fr: 5, sa: 6 }

function parseMinuten(zeit?: string | null): number | null {
  const match = zeit?.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

/**
 * Nur clientseitig nach dem Mounten aufrufen (wie `getZuercherTageszeit`) — ein serverseitig
 * berechneter Wert würde bis zur nächsten Revalidierung (täglich, DECISIONS.md #11/#26) stehen
 * bleiben und wäre die meiste Zeit falsch. Gibt `null` zurück, wenn keine Öffnungszeiten gepflegt
 * sind (aktuell der Fall — CONTENT_TODO.md) oder ein Ausnahmetag/Feiertag greift.
 */
export function getOpeningStatus(oeffnungszeiten: Oeffnungszeiten | null | undefined, now: Date = new Date()): OpeningStatus | null {
  const regulaer = oeffnungszeiten?.regulaer ?? []
  if (regulaer.length === 0) return null

  const zuercherDatum = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(now)
  const heuteAusnahme = (oeffnungszeiten?.ausnahmen ?? []).find((a) => a.datum?.slice(0, 10) === zuercherDatum)
  if (heuteAusnahme?.geschlossen) return 'geschlossen'

  const wochentag = new Intl.DateTimeFormat('de-CH', { weekday: 'short', timeZone: 'Europe/Zurich' })
    .format(now)
    .toLowerCase()
  const tagKuerzel = Object.keys(TAG_INDEX).find((k) => wochentag.startsWith(k))
  const heute = regulaer.find((tag) => tag.tag === tagKuerzel)
  if (!heute || heute.geschlossen) return 'geschlossen'

  const minutenJetzt = new Intl.DateTimeFormat('de-CH', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    timeZone: 'Europe/Zurich',
  })
    .formatToParts(now)
    .reduce((acc, part) => {
      if (part.type === 'hour') return acc + Number(part.value) * 60
      if (part.type === 'minute') return acc + Number(part.value)
      return acc
    }, 0)

  const von = parseMinuten(heute.von)
  const bis = parseMinuten(heute.bis)
  if (von === null || bis === null) return null

  return minutenJetzt >= von && minutenJetzt < bis ? 'offen' : 'geschlossen'
}
