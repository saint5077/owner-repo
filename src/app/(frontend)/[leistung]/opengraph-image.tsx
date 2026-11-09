import { ImageResponse } from 'next/og'

import type { Service } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LABEL: Record<Service['serviceType'], string> = {
  bewirtschaftung: 'Bewirtschaftung',
  stockwerkeigentum: 'Stockwerkeigentum',
  erstvermietung: 'Erstvermietung',
  verkauf: 'Verkauf',
}
const SLUGS = Object.keys(LABEL) as Service['serviceType'][]

function isLeistung(value: string): value is Service['serviceType'] {
  return (SLUGS as string[]).includes(value)
}

export default async function Image({ params }: { params: Promise<{ leistung: string }> }) {
  const { leistung } = await params
  const payload = await getPayloadClient()
  const service = isLeistung(leistung)
    ? (await payload.find({ collection: 'services', where: { serviceType: { equals: leistung } }, limit: 1 })).docs[0]
    : null

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
        <div style={{ fontSize: 64, fontWeight: 700, color: '#1e2b24', marginTop: 36 }}>
          {isLeistung(leistung) ? LABEL[leistung] : 'Leistungen'}
        </div>
        {service?.claim ? (
          <div style={{ fontSize: 30, color: '#545b50', marginTop: 24, maxWidth: 960 }}>{service.claim}</div>
        ) : null}
      </div>
    ),
    { ...size },
  )
}
