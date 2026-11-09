import { ImageResponse } from 'next/og'

import type { Media } from '@/payload-types'
import { formatCHF, formatFlaeche, formatOrt, formatZimmer } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Bewusst mit System-Schriften statt Archivo/Literata (next/og rendert über Satori, das eigene
 * Font-Dateien geladen braucht — für Phase 5 genügt ein sauberes, auf Marke abgestimmtes Bild
 * ohne die Zusatzkomplexität des Font-Ladens in der Edge-Umgebung; kann in Phase 7 verfeinert
 * werden, wenn ohnehin alle OG-Bilder der Seite überarbeitet werden).
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'properties', where: { slug: { equals: slug } }, limit: 1 })
  const property = result.docs[0]

  const foto = (property?.galerie ?? []).find((m): m is Media => typeof m === 'object' && m !== null)
  const preis = property?.preisAufAnfrage
    ? 'Preis auf Anfrage'
    : property?.angebotsart === 'kauf'
      ? formatCHF(property?.kaufpreis)
      : property?.bruttomiete
        ? `${formatCHF(property.bruttomiete)} / Monat`
        : null

  const fakten = [formatZimmer(property?.zimmer), formatFlaeche(property?.wohnflaecheM2), formatOrt(property?.kreis, property?.adresse?.ort)]
    .filter(Boolean)
    .join('   ·   ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#eef0ea',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '16px solid #e92624' }} />
          <div style={{ fontSize: 22, color: '#1e2b24', fontWeight: 700 }}>Nora Immobilien AG</div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 56, marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 54, fontWeight: 700, color: '#1e2b24', lineHeight: 1.05 }}>
              {property?.title ?? 'Objekt'}
            </div>
            {fakten ? (
              <div style={{ fontSize: 26, color: '#545b50', marginTop: 20 }}>{fakten}</div>
            ) : null}
            {preis ? (
              <div style={{ fontSize: 32, color: '#2f5b45', fontWeight: 700, marginTop: 28 }}>{preis}</div>
            ) : null}
          </div>
          {foto?.url ? <img src={foto.url} alt="" width={420} height={420} style={{ objectFit: 'cover' }} /> : null}
        </div>
      </div>
    ),
    { ...size },
  )
}
