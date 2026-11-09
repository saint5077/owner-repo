import { NextResponse, type NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit } from '@/lib/spam/rate-limit'
import { detectImageType, MAX_FOTO_BYTES } from '@/lib/uploads/validate'

const MIME_FOR_TYPE = { jpeg: 'image/jpeg', png: 'image/png', heic: 'image/heic' } as const

/**
 * Eigene, von Payloads `[...slug]`-Catch-all unabhängige Route (statisches Segment schlägt den
 * Catch-all, siehe Next-Doku) für Schadenmeldungs-Fotos. Direkter Server-Upload statt
 * Zwei-Schritt-Client-Upload zu Vercel Blob, da hierfür echte Zugangsdaten fehlen
 * (DECISIONS.md #12/#43) — Fotos landen über die Payload-Local-API als `media`-Dokumente mit
 * zufälligem Dateinamen, nie öffentlich verlinkt (Briefing §9 "zufällige Pfade, nirgends
 * öffentlich verlinken"). Begrenzung: Next/Vercel-Funktionen nehmen Requests nur bis ca. 4,5 MB
 * entgegen — bei client-seitig auf max. 2560 px verkleinerten Fotos in der Praxis ausreichend,
 * siehe DECISIONS.md für die vollständige Abwägung.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
  const { success } = await checkRateLimit(ip, 'schaden-upload')
  if (!success) {
    return NextResponse.json({ error: 'Zu viele Uploads. Bitte versuchen Sie es später erneut.' }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei empfangen.' }, { status: 400 })
  }
  if (file.size > MAX_FOTO_BYTES) {
    return NextResponse.json({ error: 'Datei zu gross (max. 8 MB).' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const detected = detectImageType(new Uint8Array(buffer.subarray(0, 16)))
  if (!detected) {
    return NextResponse.json({ error: 'Nicht erkanntes Dateiformat (nur JPG, PNG, HEIC).' }, { status: 400 })
  }

  const randomName = `schadenmeldung-${crypto.randomUUID()}.${detected === 'jpeg' ? 'jpg' : detected}`

  const payload = await getPayloadClient()
  const media = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt: 'Foto zu einer Schadenmeldung (von der Mieterschaft hochgeladen)' },
    file: {
      data: buffer,
      mimetype: MIME_FOR_TYPE[detected],
      name: randomName,
      size: buffer.length,
    },
  })

  return NextResponse.json({ id: media.id })
}
