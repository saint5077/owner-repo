import type { Property } from '@/payload-types'
import type { MapMarker } from '@/components/properties/PropertyMap'
import { kreisCenter } from './zurich-kreise'

/**
 * Privatsphäre-Regel (Briefing §6 Objektdetail): ein Pin mit echten Koordinaten erscheint nur,
 * wenn die Adresse ausdrücklich zur öffentlichen Anzeige freigegeben ist UND die swisstopo-
 * Geokodierung tatsächlich Koordinaten geliefert hat. Sonst nur eine grobe Kreis-Näherung
 * (`approximate: true`) — nie ein Pin auf einer als privat markierten Adresse, auch wenn
 * zufällig Koordinaten im Datensatz stehen (z. B. aus einer früheren, inzwischen privat
 * geschalteten Adresse).
 */
export function propertyLocation(property: Property): MapMarker | null {
  const hatEchteKoordinaten =
    property.adressePublicAnzeigen && typeof property.koordinaten?.lat === 'number' && typeof property.koordinaten?.lng === 'number'

  if (hatEchteKoordinaten) {
    return {
      id: String(property.id),
      lat: property.koordinaten!.lat as number,
      lng: property.koordinaten!.lng as number,
      label: property.title,
      href: `/objekte/${property.slug}`,
      approximate: false,
    }
  }

  const center = kreisCenter(property.kreis)
  if (!center) return null
  return {
    id: String(property.id),
    lat: center.lat,
    lng: center.lng,
    label: `${property.title} (ungefähre Lage, Kreis ${property.kreis})`,
    href: `/objekte/${property.slug}`,
    approximate: true,
  }
}
