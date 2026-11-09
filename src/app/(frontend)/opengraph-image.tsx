import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// System-Schriften statt Archivo/Literata, konsistent mit der bestehenden Begründung in
// objekte/[slug]/opengraph-image.tsx (Satori/next-og braucht eigene Font-Dateien in der
// Edge-Umgebung — für ein sauberes, markenkonformes Bild ohne diese Zusatzkomplexität reicht das).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#eef0ea',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '23px solid #e92624' }} />
          <div style={{ fontSize: 28, color: '#1e2b24', fontWeight: 700 }}>Nora Immobilien AG</div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, color: '#1e2b24', lineHeight: 1.1, marginTop: 36, maxWidth: 960 }}>
          Wir betreuen Ihre Immobilie, als wäre es unsere eigene.
        </div>
        <div style={{ fontSize: 28, color: '#545b50', marginTop: 28 }}>
          Bewirtschaftung / Stockwerkeigentum / Erstvermietung / Verkauf — Zürich, seit 1979
        </div>
      </div>
    ),
    { ...size },
  )
}
