export type Tageszeit = 'tag' | 'abend' | 'nacht'

/**
 * Nur clientseitig nach dem Mounten aufrufen (Hydration-Mismatch vermeiden) — siehe
 * HeroFacade.tsx und DESIGN.md §8.
 */
export function getZuercherTageszeit(date: Date = new Date()): Tageszeit {
  const stunde = Number(
    new Intl.DateTimeFormat('de-CH', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Zurich' }).format(date),
  )

  if (stunde >= 18 && stunde < 23) return 'abend'
  if (stunde >= 23 || stunde < 6) return 'nacht'
  return 'tag'
}
