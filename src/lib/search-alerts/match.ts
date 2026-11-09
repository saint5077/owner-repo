import type { Property, SearchAlert } from '@/payload-types'

/**
 * Prüft, ob ein Objekt die Kriterien eines bestätigten Suchabos erfüllt (Briefing §8
 * "passende, bestätigte Suchabos benachrichtigen"). Reine, exportierte Funktion ohne
 * Seiteneffekte — direkt testbar (siehe `match.test.ts`), getrennt vom Payload-Hook, der sie
 * aufruft.
 *
 * Interpretation von `verfuegbarAb` im Suchabo: "ich suche ab diesem Datum" — ein Objekt passt,
 * wenn es spätestens an diesem Datum verfügbar ist (`sofort`/`nachVereinbarung` gelten immer als
 * passend, ein `datum`-Objekt nur, wenn sein Datum nicht später liegt als das gesuchte).
 */
export function matchesProperty(property: Property, kriterien: SearchAlert['kriterien']): boolean {
  if (!kriterien) return true

  if (kriterien.angebotsart && kriterien.angebotsart !== property.angebotsart) return false

  if (kriterien.objektart && kriterien.objektart.length > 0 && !kriterien.objektart.includes(property.objektart)) {
    return false
  }

  if (typeof kriterien.zimmerVon === 'number') {
    if (typeof property.zimmer !== 'number' || property.zimmer < kriterien.zimmerVon) return false
  }
  if (typeof kriterien.zimmerBis === 'number') {
    if (typeof property.zimmer !== 'number' || property.zimmer > kriterien.zimmerBis) return false
  }

  if (typeof kriterien.preisBis === 'number' && !property.preisAufAnfrage) {
    const preis = property.angebotsart === 'kauf' ? property.kaufpreis : property.bruttomiete
    if (typeof preis === 'number' && preis > kriterien.preisBis) return false
  }

  if (typeof kriterien.flaecheAb === 'number') {
    const flaeche = property.wohnflaecheM2 ?? property.nutzflaecheM2
    if (typeof flaeche !== 'number' || flaeche < kriterien.flaecheAb) return false
  }

  if (kriterien.kreis && kriterien.kreis.length > 0) {
    if (!property.kreis || !kriterien.kreis.includes(property.kreis)) return false
  }

  if (kriterien.verfuegbarAb) {
    const gesucht = new Date(kriterien.verfuegbarAb).getTime()
    const typ = property.verfuegbarAb?.typ
    if (typ === 'datum' && property.verfuegbarAb?.datum) {
      const verfuegbarAb = new Date(property.verfuegbarAb.datum).getTime()
      if (verfuegbarAb > gesucht) return false
    }
    // 'sofort' und 'nachVereinbarung' gelten immer als rechtzeitig verfügbar.
  }

  return true
}
