/**
 * Ungefähre Mittelpunkte der 12 Zürcher Stadtkreise (WGS84). Nur für die kartografische
 * Kreis-Näherung gedacht (Privatsphäre-Fallback bei verborgener Adresse, DESIGN.md/Briefing
 * §6 Objektdetail: "nur ungefährer Kreis statt Pin") — keine amtliche Geometrie, kein
 * Anspruch auf exakte Kreisgrenzen. Reale Objektadressen werden über die swisstopo
 * SearchServer-API geokodiert (`src/lib/geocode.ts`), nicht über diese Tabelle.
 */
export const ZURICH_KREIS_CENTER: Record<string, { lat: number; lng: number }> = {
  '1': { lat: 47.3717, lng: 8.541 },
  '2': { lat: 47.3505, lng: 8.528 },
  '3': { lat: 47.3686, lng: 8.505 },
  '4': { lat: 47.3774, lng: 8.527 },
  '5': { lat: 47.3886, lng: 8.524 },
  '6': { lat: 47.387, lng: 8.549 },
  '7': { lat: 47.36, lng: 8.57 },
  '8': { lat: 47.357, lng: 8.55 },
  '9': { lat: 47.385, lng: 8.485 },
  '10': { lat: 47.405, lng: 8.51 },
  '11': { lat: 47.415, lng: 8.535 },
  '12': { lat: 47.41, lng: 8.56 },
}

export function kreisCenter(kreis: string | null | undefined) {
  if (!kreis) return null
  return ZURICH_KREIS_CENTER[kreis] ?? null
}
