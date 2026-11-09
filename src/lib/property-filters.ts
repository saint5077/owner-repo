import type { Where } from 'payload'

export type SortOption = 'neueste' | 'preis-auf' | 'preis-ab' | 'zimmer'

export type ParsedPropertyFilters = {
  angebotsart?: 'miete' | 'kauf'
  objektart?: string[]
  zimmerVon?: number
  zimmerBis?: number
  preisBis?: number
  flaecheAb?: number
  kreis?: string[]
  verfuegbarAb?: string
  sort: SortOption
  ansicht: 'liste' | 'karte'
}

type SearchParamsInput = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function list(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined
  const arr = Array.isArray(value) ? value : [value]
  const cleaned = arr.filter(Boolean)
  return cleaned.length > 0 ? cleaned : undefined
}

function num(value: string | string[] | undefined): number | undefined {
  const v = first(value)
  if (!v) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Liest die URL-Query (Briefing §6: "Filter im URL-Query, teilbar, Zurück-Taste funktioniert")
 * in ein typisiertes Filterobjekt. Die Feldnamen spiegeln bewusst `SearchAlerts.kriterien`
 * (dieselben Begriffe, die ein Suchabo später gegen neue Objekte matcht, Phase 6).
 */
export function parsePropertyFilters(searchParams: SearchParamsInput): ParsedPropertyFilters {
  const angebotsart = first(searchParams.angebotsart)
  const sort = first(searchParams.sort)
  const ansicht = first(searchParams.ansicht)

  return {
    angebotsart: angebotsart === 'miete' || angebotsart === 'kauf' ? angebotsart : undefined,
    objektart: list(searchParams.objektart),
    zimmerVon: num(searchParams.zimmerVon),
    zimmerBis: num(searchParams.zimmerBis),
    preisBis: num(searchParams.preisBis),
    flaecheAb: num(searchParams.flaecheAb),
    kreis: list(searchParams.kreis),
    verfuegbarAb: first(searchParams.verfuegbarAb),
    sort: sort === 'preis-auf' || sort === 'preis-ab' || sort === 'zimmer' ? sort : 'neueste',
    ansicht: ansicht === 'karte' ? 'karte' : 'liste',
  }
}

/** Baut die Payload-`where`-Query für `properties` — Filterung läuft serverseitig (Briefing §6). */
export function buildPropertyWhere(filters: ParsedPropertyFilters): Where {
  const and: Where[] = [{ objektstatus: { in: ['verfuegbar', 'reserviert'] } }]

  if (filters.angebotsart) and.push({ angebotsart: { equals: filters.angebotsart } })
  if (filters.objektart?.length) and.push({ objektart: { in: filters.objektart } })
  if (filters.kreis?.length) and.push({ kreis: { in: filters.kreis } })
  if (typeof filters.zimmerVon === 'number') and.push({ zimmer: { greater_than_equal: filters.zimmerVon } })
  if (typeof filters.zimmerBis === 'number') and.push({ zimmer: { less_than_equal: filters.zimmerBis } })
  if (typeof filters.flaecheAb === 'number')
    and.push({ wohnflaecheM2: { greater_than_equal: filters.flaecheAb } })
  if (filters.verfuegbarAb) and.push({ 'verfuegbarAb.datum': { greater_than_equal: filters.verfuegbarAb } })
  if (typeof filters.preisBis === 'number') {
    // Miete vergleicht gegen die Bruttomiete, Kauf gegen den Kaufpreis — "Preis auf Anfrage"-
    // Objekte haben keinen Zahlenwert und werden bei einem aktiven Preis-Filter ausgeblendet,
    // nicht stillschweigend mitgezählt.
    and.push({
      or: [
        { bruttomiete: { less_than_equal: filters.preisBis } },
        { kaufpreis: { less_than_equal: filters.preisBis } },
      ],
    })
  }

  return { and }
}

const SORT_MAP: Record<SortOption, string> = {
  neueste: '-createdAt',
  'preis-auf': 'bruttomiete',
  'preis-ab': '-bruttomiete',
  zimmer: '-zimmer',
}

export function sortParam(sort: SortOption): string {
  return SORT_MAP[sort]
}

/** Baut eine neue Query-String-Repräsentation, die bestehende Parameter beibehält. */
export function withParam(
  current: URLSearchParams,
  updates: Record<string, string | string[] | null>,
): string {
  const next = new URLSearchParams(current)
  for (const [key, value] of Object.entries(updates)) {
    next.delete(key)
    if (value === null) continue
    if (Array.isArray(value)) {
      for (const v of value) next.append(key, v)
    } else {
      next.set(key, value)
    }
  }
  return next.toString()
}
